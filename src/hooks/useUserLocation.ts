import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface UseUserLocationResult {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  updateLocation: (location: LocationData) => Promise<void>;
}

export const useUserLocation = (): UseUserLocationResult => {
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved location from database
  useEffect(() => {
    const fetchSavedLocation = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_locations')
        .select('latitude, longitude, address')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setLocation(data);
      }
    };

    fetchSavedLocation();
  }, [user]);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${localStorage.getItem('mapbox_token') || ''}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
    } catch (e) {
      console.error('Geocoding error:', e);
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Update location in database
  const updateLocation = useCallback(async (newLocation: LocationData) => {
    if (!user) {
      setError('Please log in to save location');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: upsertError } = await supabase
        .from('user_locations')
        .upsert({
          user_id: user.id,
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          address: newLocation.address,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setLocation(newLocation);
      toast.success('Location updated successfully');
    } catch (e: any) {
      console.error('Error updating location:', e);
      setError(e.message);
      toast.error('Failed to update location');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Request current location from browser
  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      toast.error('Geolocation not supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);

      const newLocation: LocationData = { latitude, longitude, address };
      await updateLocation(newLocation);
    } catch (e: any) {
      console.error('Error getting location:', e);
      if (e.code === 1) {
        setError('Location permission denied. Please enable location access.');
        toast.error('Location permission denied');
      } else if (e.code === 2) {
        setError('Location unavailable');
        toast.error('Location unavailable');
      } else if (e.code === 3) {
        setError('Location request timed out');
        toast.error('Location request timed out');
      } else {
        setError(e.message);
        toast.error('Failed to get location');
      }
    } finally {
      setIsLoading(false);
    }
  }, [updateLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    updateLocation
  };
};

// Hook for providers to subscribe to customer locations in real-time
export const useRealtimeCustomerLocation = (customerId: string | null) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!customerId) {
      setIsLoading(false);
      return;
    }

    // Fetch initial location
    const fetchLocation = async () => {
      const { data, error } = await supabase
        .from('user_locations')
        .select('latitude, longitude, address')
        .eq('user_id', customerId)
        .single();

      if (data && !error) {
        setLocation(data);
      }
      setIsLoading(false);
    };

    fetchLocation();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`customer-location-${customerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_locations',
          filter: `user_id=eq.${customerId}`
        },
        (payload) => {
          console.log('Location update received:', payload);
          if (payload.new && typeof payload.new === 'object') {
            const newData = payload.new as any;
            setLocation({
              latitude: newData.latitude,
              longitude: newData.longitude,
              address: newData.address
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [customerId]);

  return { location, isLoading };
};
