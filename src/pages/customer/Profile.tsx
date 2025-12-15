import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings, CreditCard, Bell, HelpCircle, Shield, LogOut, ChevronRight, Star, Calendar } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => toast('Edit Profile coming soon!') },
    { icon: CreditCard, label: 'Payment Methods', action: () => toast('Payment Methods coming soon!') },
    { icon: Bell, label: 'Notifications', action: () => toast('Notifications coming soon!') },
    { icon: Shield, label: 'Privacy & Security', action: () => toast('Privacy coming soon!') },
    { icon: HelpCircle, label: 'Help & Support', action: () => toast('Help coming soon!') },
    { icon: Settings, label: 'Settings', action: () => toast('Settings coming soon!') },
  ];

  return (
    <MobileLayout>
      <PageHeader title="Profile" />

      <PageContainer className="pt-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user?.name || 'User'}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">{user?.phone || 'No phone added'}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Bookings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-2xl font-bold text-foreground">4.8</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">$450</p>
              <p className="text-xs text-muted-foreground">Spent</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Button 
            variant="soft" 
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/bookings')}
          >
            <Calendar className="h-6 w-6" />
            <span>My Bookings</span>
          </Button>
          <Button 
            variant="soft-accent" 
            className="h-auto py-4 flex-col gap-2"
            onClick={() => toast('Favorites coming soon!')}
          >
            <Star className="h-6 w-6" />
            <span>Favorites</span>
          </Button>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden mb-6"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 tap-highlight hover:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            variant="ghost" 
            fullWidth 
            className="text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          OneStop v1.0.0
        </p>
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default Profile;
