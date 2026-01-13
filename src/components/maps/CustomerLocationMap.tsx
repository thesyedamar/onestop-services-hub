import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import LeafletMap from './LeafletMap';
import { useRealtimeCustomerLocation } from '@/hooks/useUserLocation';

interface CustomerLocationMapProps {
  customerId: string;
  customerName?: string;
  className?: string;
}

const CustomerLocationMap: React.FC<CustomerLocationMapProps> = ({
  customerId,
  customerName = 'Customer',
  className = ''
}) => {
  const { location, isLoading } = useRealtimeCustomerLocation(customerId);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-muted rounded-xl h-48 flex items-center justify-center ${className}`}
      >
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </motion.div>
    );
  }

  if (!location) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-muted rounded-xl h-48 flex flex-col items-center justify-center ${className}`}
      >
        <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Customer hasn't shared their location yet
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-3 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Navigation className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">{customerName}'s Location</h3>
        <span className="ml-auto flex items-center gap-1 text-xs text-success">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Live
        </span>
      </div>

      {location.address && (
        <div className="bg-primary/5 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Address:</span> {location.address}
          </p>
        </div>
      )}

      <LeafletMap
        latitude={location.latitude}
        longitude={location.longitude}
        zoom={15}
        markerLabel={`${customerName}'s Location`}
        className="h-48"
        interactive={true}
      />

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
      </div>
    </motion.div>
  );
};

export default CustomerLocationMap;
