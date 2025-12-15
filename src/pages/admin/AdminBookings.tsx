import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, MapPin, DollarSign, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Input } from '@/components/ui/input';

type BookingFilter = 'all' | 'active' | 'completed' | 'cancelled';

interface BookingItem {
  id: string;
  service: string;
  customer: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
}

const mockBookings: BookingItem[] = [
  { id: '1', service: 'Deep House Cleaning', customer: 'Sarah J.', provider: 'CleanPro', date: 'Today', time: '2:00 PM', location: '123 Main St', price: 80, status: 'in_progress' },
  { id: '2', service: 'Plumbing Repair', customer: 'Mike C.', provider: 'PipeMasters', date: 'Today', time: '4:00 PM', location: '456 Oak Ave', price: 45, status: 'accepted' },
  { id: '3', service: 'Home Haircut', customer: 'Emily D.', provider: 'StyleCut', date: 'Tomorrow', time: '10:00 AM', location: '789 Pine Rd', price: 40, status: 'pending' },
  { id: '4', service: 'AC Repair', customer: 'James W.', provider: 'CoolTech', date: 'Dec 10', time: '3:00 PM', location: '321 Elm St', price: 60, status: 'completed' },
  { id: '5', service: 'Airport Transfer', customer: 'Anna K.', provider: 'SkyRide', date: 'Dec 8', time: '6:00 AM', location: 'JFK Airport', price: 35, status: 'completed' },
  { id: '6', service: 'Moving Service', customer: 'Bob W.', provider: 'QuickMove', date: 'Dec 5', time: '9:00 AM', location: '654 Maple Dr', price: 150, status: 'cancelled' },
];

const AdminBookings = () => {
  const [filter, setFilter] = useState<BookingFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: { key: BookingFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesFilter = filter === 'all' ||
      (filter === 'active' ? ['pending', 'accepted', 'in_progress'].includes(booking.status) :
       filter === 'completed' ? booking.status === 'completed' :
       booking.status === 'cancelled');
    const matchesSearch = booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusConfig = (status: BookingItem['status']) => {
    const config = {
      pending: { color: 'bg-warning/10 text-warning', icon: AlertCircle, label: 'Pending' },
      accepted: { color: 'bg-primary/10 text-primary', icon: CheckCircle, label: 'Accepted' },
      in_progress: { color: 'bg-accent/10 text-accent', icon: Clock, label: 'In Progress' },
      completed: { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-destructive/10 text-destructive', icon: XCircle, label: 'Cancelled' },
    };
    return config[status];
  };

  // Calculate stats
  const totalRevenue = mockBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);
  const activeCount = mockBookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length;

  return (
    <MobileLayout>
      <PageHeader 
        title="Bookings" 
        subtitle={`${mockBookings.length} total bookings`}
      />

      {/* Search */}
      <div className="px-4 pb-2 sticky top-16 z-30 bg-background">
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-card border-border/50"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-card rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground">Active Bookings</p>
            <p className="text-xl font-bold text-foreground">{activeCount}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-success">${totalRevenue}</p>
          </div>
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
        <div className="flex flex-col gap-3">
          {filteredBookings.map((booking, index) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{booking.service}</h4>
                    <p className="text-sm text-muted-foreground">
                      {booking.customer} → {booking.provider}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{statusConfig.label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-success" />
                    <span className="font-bold text-foreground">${booking.price}</span>
                  </div>
                  <button className="flex items-center gap-1 text-primary text-sm font-medium">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Bookings Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default AdminBookings;
