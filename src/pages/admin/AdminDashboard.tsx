import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '2,345', change: '+12%', icon: Users, color: 'primary' },
    { label: 'Active Bookings', value: '128', change: '+5%', icon: Calendar, color: 'accent' },
    { label: 'Revenue', value: '$45.2K', change: '+18%', icon: DollarSign, color: 'success' },
    { label: 'Growth', value: '24%', change: '+3%', icon: TrendingUp, color: 'primary' },
  ];

  const pendingApprovals = [
    { id: '1', name: 'John Smith', type: 'Provider', service: 'Cleaning', date: '2 hours ago' },
    { id: '2', name: 'Alice Brown', type: 'Provider', service: 'Plumbing', date: '5 hours ago' },
    { id: '3', name: 'Bob Wilson', type: 'Provider', service: 'Electrical', date: '1 day ago' },
  ];

  const recentActivity = [
    { id: '1', action: 'New booking', user: 'Sarah J.', time: '5 min ago', status: 'success' },
    { id: '2', action: 'Provider approved', user: 'Mike C.', time: '15 min ago', status: 'success' },
    { id: '3', action: 'Booking cancelled', user: 'Emily D.', time: '1 hour ago', status: 'warning' },
    { id: '4', action: 'Payment received', user: 'James W.', time: '2 hours ago', status: 'success' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary-soft text-primary',
      accent: 'bg-accent-soft text-accent',
      success: 'bg-success-soft text-success',
    };
    return colors[color] || colors.primary;
  };

  return (
    <MobileLayout>
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Manage your platform"
      />

      <PageContainer className="pt-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-card rounded-xl p-4 border border-border/50"
            >
              <div className={`w-10 h-10 rounded-lg ${getColorClasses(stat.color)} flex items-center justify-center mb-2`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className="text-xs font-medium text-success flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Pending Approvals</h3>
            <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
              {pendingApprovals.length} pending
            </span>
          </div>

          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            {pendingApprovals.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 ${
                  index !== pendingApprovals.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.type} • {item.service}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>

          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.status === 'success' ? 'bg-success-soft' : 'bg-warning/10'
                }`}>
                  {item.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default AdminDashboard;
