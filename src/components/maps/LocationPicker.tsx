import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapboxMap from './MapboxMap';
import { useUserLocation } from '@/hooks/useUserLocation';

interface LocationPickerProps {
  onLocationConfirmed?: (lat: number, lng: number, address?: string) => void;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationConfirmed,
  className = ''
}) => {
  const { location, isLoading, error, requestLocation, updateLocation } = useUserLocation();

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    await updateLocation({ latitude: lat, longitude: lng });
    onLocationConfirmed?.(lat, lng);
  };

  const handleUseCurrentLocation = async () => {
    await requestLocation();
    if (location) {
      onLocationConfirmed?.(location.latitude, location.longitude, location.address || undefined);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Your Location</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              Getting...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-1" />
              Use Current
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-lg">
          {error}
        </p>
      )}

      {location ? (
        <div className="space-y-3">
          <div className="bg-primary/5 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Address:</span>{' '}
              {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
            </p>
          </div>
          <MapboxMap
            latitude={location.latitude}
            longitude={location.longitude}
            zoom={15}
            markerLabel="Your Location"
            className="h-48"
            onLocationSelect={handleMapLocationSelect}
          />
          <p className="text-xs text-muted-foreground text-center">
            Tap on the map to adjust your location
          </p>
        </div>
      ) : (
        <div className="bg-muted rounded-xl h-48 flex flex-col items-center justify-center">
          <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Click "Use Current" to share your location
            <br />
            <span className="text-xs">Required for service providers to find you</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LocationPicker;
