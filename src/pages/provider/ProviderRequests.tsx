import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, DollarSign, Check, X, User } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ServiceRequest {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  urgent?: boolean;
}

const mockRequests: ServiceRequest[] = [
  { id: '1', customer: 'Sarah Johnson', service: 'Deep House Cleaning', date: 'Today', time: '2:00 PM', location: '123 Main St, Apt 4B', price: 80, urgent: true },
  { id: '2', customer: 'Mike Chen', service: 'Deep House Cleaning', date: 'Tomorrow', time: '10:00 AM', location: '456 Oak Ave', price: 80 },
  { id: '3', customer: 'Emily Davis', service: 'Standard Cleaning', date: 'Dec 18', time: '3:00 PM', location: '789 Pine Rd', price: 50 },
];

const ProviderRequests = () => {
  const [requests, setRequests] = useState(mockRequests);

  const handleAccept = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    toast.success('Request accepted! Added to your jobs.');
  };

  const handleDecline = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    toast('Request declined');
  };

  return (
    <MobileLayout>
      <PageHeader 
        title="Incoming Requests" 
        subtitle={`${requests.length} pending requests`}
      />

      <PageContainer className="pt-4">
        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-success-soft flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">All Caught Up!</h3>
            <p className="text-muted-foreground">No pending requests at the moment</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-4">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.08 }}
                  className={`bg-card rounded-2xl p-4 border shadow-sm ${
                    request.urgent ? 'border-accent' : 'border-border/50'
                  }`}
                >
                  {/* Urgent Badge */}
                  {request.urgent && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                      <Clock className="h-3 w-3" />
                      Urgent - Today
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{request.customer}</h3>
                      <p className="text-sm text-muted-foreground">{request.service}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{request.date} at {request.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="text-success">${request.price} earnings</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDecline(request.id)}
                    >
                      <X className="h-5 w-5 mr-1" />
                      Decline
                    </Button>
                    <Button
                      variant="success"
                      className="flex-1"
                      onClick={() => handleAccept(request.id)}
                    >
                      <Check className="h-5 w-5 mr-1" />
                      Accept
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default ProviderRequests;
