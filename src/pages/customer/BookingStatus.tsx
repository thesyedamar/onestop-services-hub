import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, MapPin } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Button } from '@/components/ui/button';
import { BookingProgressIndicator, BookingStatus as BookingStatusType } from '@/components/ui/BookingProgressIndicator';
import { ProviderMiniProfile } from '@/components/ui/ProviderMiniProfile';
import LocationPicker from '@/components/maps/LocationPicker';
import { toast } from 'sonner';

const BookingStatus = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<BookingStatusType>('pending');

  // Simulate status progression
  useEffect(() => {
    const statuses: BookingStatusType[] = ['pending', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'completed'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        setStatus(statuses[currentIndex]);
        
        if (statuses[currentIndex] === 'accepted') {
          toast.success('Your booking has been accepted!');
        } else if (statuses[currentIndex] === 'on_the_way') {
          toast('Provider is on the way!', { icon: '🚗' });
        } else if (statuses[currentIndex] === 'completed') {
          toast.success('Service completed! Please rate your experience.');
        }
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MobileLayout>
      <PageHeader
        title="Booking Status"
        subtitle="Track your service"
        leftAction={
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      />

      <PageContainer className="pt-4">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BookingProgressIndicator
            status={status}
            providerName="John Smith"
            estimatedTime="2:30 PM"
          />
        </motion.div>

        {/* Location Picker - Always show so provider knows where to go */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm mb-6"
        >
          <LocationPicker 
            onLocationConfirmed={(lat, lng, address) => {
              toast.success('Location shared with provider!');
            }}
          />
        </motion.div>

        {/* Provider Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">Your Provider</h3>
          <ProviderMiniProfile
            name="John Smith"
            rating={4.9}
            reviewCount={234}
            verified
            specialty="Professional Cleaner"
            onChat={() => toast('Opening chat...')}
            onCall={() => toast('Calling provider...')}
          />
        </motion.div>

        {/* Service Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">Service Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium text-foreground">Deep House Cleaning</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-foreground">2:00 PM</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-primary text-lg">$82.00</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <Button variant="outline" fullWidth onClick={() => toast('Opening chat...')}>
            <MessageCircle className="h-5 w-5" />
            Chat
          </Button>
          <Button variant="soft" fullWidth onClick={() => toast('Calling...')}>
            <Phone className="h-5 w-5" />
            Call
          </Button>
        </motion.div>

        {/* Cancel Button (only if pending) */}
        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Button 
              variant="ghost" 
              fullWidth 
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                toast.error('Booking cancelled');
                navigate('/home');
              }}
            >
              Cancel Booking
            </Button>
          </motion.div>
        )}

        {/* Rate Service (if completed) */}
        {status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <Button 
              variant="accent" 
              size="lg" 
              fullWidth
              onClick={() => toast.success('Thanks for your rating!')}
            >
              ⭐ Rate Your Experience
            </Button>
          </motion.div>
        )}
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default BookingStatus;
