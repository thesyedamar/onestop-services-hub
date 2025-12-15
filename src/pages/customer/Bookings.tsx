import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';

type BookingTabType = 'active' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  service: string;
  provider: string;
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
}

const mockBookings: Booking[] = [
  { id: '1', service: 'Deep House Cleaning', provider: 'CleanPro Services', date: 'Today', time: '2:00 PM', price: 82, status: 'in_progress' },
  { id: '2', service: 'Plumbing Repair', provider: 'PipeMasters', date: 'Tomorrow', time: '10:00 AM', price: 45, status: 'accepted' },
  { id: '3', service: 'Home Haircut', provider: 'StyleCut', date: 'Dec 10', time: '3:00 PM', price: 40, status: 'completed' },
  { id: '4', service: 'Airport Transfer', provider: 'SkyRide', date: 'Dec 8', time: '6:00 AM', price: 35, status: 'completed' },
  { id: '5', service: 'AC Repair', provider: 'CoolTech', date: 'Dec 5', time: '11:00 AM', price: 60, status: 'cancelled' },
];

const Bookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<BookingTabType>('active');

  const tabs: { key: BookingTabType; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === 'active') return ['pending', 'accepted', 'in_progress'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'completed';
    return booking.status === 'cancelled';
  });

  const getStatusBadge = (status: Booking['status']) => {
    const config = {
      pending: { color: 'bg-warning/10 text-warning', icon: AlertCircle, label: 'Pending' },
      accepted: { color: 'bg-primary/10 text-primary', icon: CheckCircle, label: 'Accepted' },
      in_progress: { color: 'bg-accent/10 text-accent', icon: Clock, label: 'In Progress' },
      completed: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-destructive/10 text-destructive', icon: XCircle, label: 'Cancelled' },
    };
    const { color, icon: Icon, label } = config[status];
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${color}`}>
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
    );
  };

  return (
    <MobileLayout>
      <PageHeader title="My Bookings" subtitle="Track your services" />

      {/* Tabs */}
      <div className="px-4 pb-2 sticky top-16 z-30 bg-background">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PageContainer className="pt-4">
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Bookings</h3>
            <p className="text-muted-foreground">
              {activeTab === 'active' && 'You have no active bookings'}
              {activeTab === 'completed' && 'No completed bookings yet'}
              {activeTab === 'cancelled' && 'No cancelled bookings'}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredBookings.map((booking, index) => (
              <motion.button
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => navigate('/booking-status')}
                className="w-full bg-card rounded-2xl p-4 border border-border/50 shadow-sm tap-highlight text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{booking.service}</h3>
                    <p className="text-sm text-muted-foreground">{booking.provider}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-lg">${booking.price}</span>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-sm font-medium">View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default Bookings;
