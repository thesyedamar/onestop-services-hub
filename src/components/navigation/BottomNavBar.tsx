import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Calendar, User, Inbox, Briefcase, DollarSign, Users, LayoutDashboard } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const customerNavItems: NavItem[] = [
  { label: 'Home', icon: <Home className="h-5 w-5" />, path: '/home' },
  { label: 'Bookings', icon: <Calendar className="h-5 w-5" />, path: '/bookings' },
  { label: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
];

const providerNavItems: NavItem[] = [
  { label: 'Requests', icon: <Inbox className="h-5 w-5" />, path: '/provider/requests' },
  { label: 'Jobs', icon: <Briefcase className="h-5 w-5" />, path: '/provider/jobs' },
  { label: 'Earnings', icon: <DollarSign className="h-5 w-5" />, path: '/provider/earnings' },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/admin/dashboard' },
  { label: 'Users', icon: <Users className="h-5 w-5" />, path: '/admin/users' },
  { label: 'Bookings', icon: <Calendar className="h-5 w-5" />, path: '/admin/bookings' },
];

const getNavItems = (role: UserRole): NavItem[] => {
  switch (role) {
    case 'provider':
      return providerNavItems;
    case 'admin':
      return adminNavItems;
    default:
      return customerNavItems;
  }
};

export const BottomNavBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navItems = getNavItems(user?.role || 'customer');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="glass border-t border-border/50 px-6 py-2 safe-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center py-2 px-4 tap-highlight"
              >
                <motion.div
                  className={`relative flex flex-col items-center gap-1 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -inset-2 bg-primary-soft rounded-xl"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 text-xs font-medium">{item.label}</span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
