import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Shield, CheckCircle, XCircle, MoreVertical, Filter } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type UserType = 'all' | 'customer' | 'provider' | 'pending';

interface UserItem {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'provider';
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
  verified: boolean;
}

const mockUsers: UserItem[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', type: 'customer', status: 'active', joinDate: 'Dec 1, 2024', verified: true },
  { id: '2', name: 'John Smith', email: 'john@email.com', type: 'provider', status: 'pending', joinDate: 'Dec 14, 2024', verified: false },
  { id: '3', name: 'Alice Brown', email: 'alice@email.com', type: 'provider', status: 'active', joinDate: 'Nov 28, 2024', verified: true },
  { id: '4', name: 'Mike Chen', email: 'mike@email.com', type: 'customer', status: 'active', joinDate: 'Nov 15, 2024', verified: true },
  { id: '5', name: 'Emily Davis', email: 'emily@email.com', type: 'provider', status: 'pending', joinDate: 'Dec 13, 2024', verified: false },
  { id: '6', name: 'Bob Wilson', email: 'bob@email.com', type: 'customer', status: 'suspended', joinDate: 'Oct 20, 2024', verified: true },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState<UserType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: { key: UserType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'customer', label: 'Customers' },
    { key: 'provider', label: 'Providers' },
    { key: 'pending', label: 'Pending' },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' ? user.status === 'pending' : user.type === filter);
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active' as const, verified: true } : u));
    toast.success('User approved successfully!');
  };

  const handleReject = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast('User rejected');
  };

  const getStatusBadge = (status: UserItem['status']) => {
    const config = {
      active: { color: 'bg-success/10 text-success', label: 'Active' },
      pending: { color: 'bg-warning/10 text-warning', label: 'Pending' },
      suspended: { color: 'bg-destructive/10 text-destructive', label: 'Suspended' },
    };
    const { color, label } = config[status];
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    user.type === 'provider' ? 'bg-accent-soft' : 'bg-primary-soft'
                  }`}>
                    {user.type === 'provider' ? (
                      <Shield className={`h-6 w-6 ${user.verified ? 'text-accent' : 'text-muted-foreground'}`} />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-foreground truncate">{user.name}</h4>
                      {user.verified && <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(user.status)}
                      <span className="text-xs text-muted-foreground">{user.joinDate}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>

                {/* Pending Actions */}
                {user.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(user.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApprove(user.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
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
