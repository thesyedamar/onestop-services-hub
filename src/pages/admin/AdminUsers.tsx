import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Shield, CheckCircle, XCircle, MoreVertical, Crown } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminUsers, useUpdateUserStatus, useUpdateUserRole } from '@/hooks/useAdminData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';

type UserFilter = 'all' | 'customer' | 'provider' | 'admin';

const AdminUsers = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();
  const updateRole = useUpdateUserRole();
  const [filter, setFilter] = useState<UserFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: { key: UserFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'customer', label: 'Customers' },
    { key: 'provider', label: 'Providers' },
    { key: 'admin', label: 'Admins' },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = 
      (user.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    updateStatus.mutate({ userId, isActive: !currentStatus });
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">Active</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">Inactive</span>;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-6 w-6 text-warning" />;
      case 'provider':
        return <Shield className="h-6 w-6 text-accent" />;
      default:
        return <User className="h-6 w-6 text-primary" />;
    }
  };

  const getRoleBgClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-warning/10';
      case 'provider':
        return 'bg-accent-soft';
      default:
        return 'bg-primary-soft';
    }
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <PageHeader title="Users" subtitle="Loading..." />
        <PageContainer className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </PageContainer>
        <BottomNavBar />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <PageHeader 
        title="Users" 
        subtitle={`${users.length} total users`}
      />

      {/* Search */}
      <div className="px-4 pb-2 sticky top-16 z-30 bg-background">
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-card border-border/50"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <PageContainer className="pt-4">
        <AnimatePresence mode="popLayout">
          <div className="flex flex-col gap-3">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRoleBgClass(user.role)}`}>
                    {getRoleIcon(user.role)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-foreground truncate">
                        {user.full_name || 'Unnamed User'}
                      </h4>
                      {user.verified && <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.phone || user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(user.is_active)}
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${user.is_active 
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10' 
                      : 'border-success/30 text-success hover:bg-success/10'}`}
                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                    disabled={updateStatus.isPending}
                  >
                    {user.is_active ? (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <User className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Users Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default AdminUsers;
