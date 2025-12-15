import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Star, Clock, MapPin, Shield, Calendar, ChevronRight } from 'lucide-react';
import { MobileLayout, PageContainer } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { ProviderMiniProfile } from '@/components/ui/ProviderMiniProfile';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { getServiceById, getCategoryById } from '@/data/services';
import { toast } from 'sonner';

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  const service = getServiceById(serviceId || '');
  const category = service ? getCategoryById(service.categoryId) : null;

  if (!service) {
    return (
      <MobileLayout>
        <PageContainer className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Service not found</p>
        </PageContainer>
      </MobileLayout>
    );
  }

  const dates = [
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'Dec 18', value: '2024-12-18' },
    { label: 'Dec 19', value: '2024-12-19' },
  ];

  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleBookService = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    setIsBookingSheetOpen(false);
    toast.success('Booking confirmed!');
    navigate('/booking-status');
  };

  return (
    <MobileLayout>
      {/* Header Image Area */}
      <div className="relative h-56 bg-gradient-to-br from-primary to-primary/70">
        {/* Top Actions */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 safe-top z-10">
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/30"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/30"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-accent text-accent' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/30"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Category Badge */}
        {category && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
            <category.icon className="h-4 w-4" style={{ color: category.color }} />
            <span className="text-sm font-medium text-foreground">{category.title}</span>
          </div>
        )}
      </div>

      <PageContainer className="-mt-6 relative">
        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-t-3xl shadow-lg -mx-4 px-4 pt-6"
        >
          {/* Title & Rating */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">{service.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-semibold text-foreground">{service.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
              </div>
              {service.duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Provider Profile */}
          <div className="mb-6">
            <ProviderMiniProfile
              name={service.provider}
              rating={service.rating}
              reviewCount={service.reviewCount}
              verified
              specialty="Professional Service Provider"
              onChat={() => toast('Chat feature coming soon!')}
              onCall={() => toast('Call feature coming soon!')}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">About this service</h3>
            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">What's included</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: 'Insured Service' },
                { icon: Clock, label: 'Flexible Timing' },
                { icon: MapPin, label: 'On-Location' },
                { icon: Star, label: 'Top Rated' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Preview */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Reviews</h3>
              <button className="flex items-center gap-1 text-primary text-sm font-medium">
                See all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                  <span className="font-semibold text-primary">S</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">Sarah M.</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-sm font-medium">5.0</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Amazing service! Very professional and on time. Would definitely book again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border/50 p-4 safe-bottom z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">${service.price}</span>
              <span className="text-muted-foreground">/{service.priceUnit}</span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="px-8"
            onClick={() => setIsBookingSheetOpen(true)}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book Now
          </Button>
        </div>
      </div>

      {/* Booking Modal Sheet */}
      <ModalSheet
        isOpen={isBookingSheetOpen}
        onClose={() => setIsBookingSheetOpen(false)}
        title="Select Date & Time"
      >
        {/* Date Selection */}
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Select Date</h4>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {dates.map((date) => (
              <button
                key={date.value}
                onClick={() => setSelectedDate(date.value)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedDate === date.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Select Time</h4>
          <div className="grid grid-cols-3 gap-2">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  selectedTime === time
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="font-medium text-foreground">${service.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium text-foreground">$2.00</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-xl text-primary">${service.price + 2}</span>
          </div>
        </div>

        <Button 
          size="lg" 
          fullWidth 
          onClick={handleBookService}
        >
          Confirm Booking
        </Button>
      </ModalSheet>
    </MobileLayout>
  );
};

export default ServiceDetail;
