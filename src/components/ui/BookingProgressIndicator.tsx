import { motion } from 'framer-motion';
import { Check, Clock, User, MapPin, Star } from 'lucide-react';

export type BookingStatus = 'pending' | 'accepted' | 'on_the_way' | 'arrived' | 'in_progress' | 'completed';

interface BookingProgressIndicatorProps {
  status: BookingStatus;
  providerName?: string;
  estimatedTime?: string;
}

const steps: { status: BookingStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pending', label: 'Pending', icon: Clock },
  { status: 'accepted', label: 'Accepted', icon: Check },
  { status: 'on_the_way', label: 'On the Way', icon: MapPin },
  { status: 'arrived', label: 'Arrived', icon: User },
  { status: 'in_progress', label: 'In Progress', icon: Clock },
  { status: 'completed', label: 'Completed', icon: Star },
];

export const BookingProgressIndicator = ({
  status,
  providerName,
  estimatedTime,
}: BookingProgressIndicatorProps) => {
  const currentIndex = steps.findIndex(s => s.status === status);

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
      {/* Status Header */}
      <div className="text-center mb-6">
        <motion.div
          key={status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary font-semibold"
        >
          {steps[currentIndex]?.icon && (
            <motion.div
              animate={{ rotate: status === 'in_progress' ? 360 : 0 }}
              transition={{ duration: 2, repeat: status === 'in_progress' ? Infinity : 0, ease: 'linear' }}
            >
              {(() => {
                const IconComponent = steps[currentIndex].icon;
                return <IconComponent className="h-5 w-5" />;
              })()}
            </motion.div>
          )}
          {steps[currentIndex]?.label}
        </motion.div>
        
        {estimatedTime && status !== 'completed' && (
          <p className="text-sm text-muted-foreground mt-2">
            Est. arrival: {estimatedTime}
          </p>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
        
        {/* Active line */}
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-muted text-muted-foreground'
                }`}
                initial={false}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }}
              >
                <StepIcon className="h-4 w-4" />
              </motion.div>
              <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Provider Info */}
      {providerName && (
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">Your provider</p>
          <p className="font-semibold text-foreground">{providerName}</p>
        </div>
      )}
    </div>
  );
};
