import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

interface MapboxMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markerLabel?: string;
  className?: string;
  showControls?: boolean;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  latitude = 40.7128,
  longitude = -74.006,
  zoom = 14,
  markerLabel,
  className = 'h-64',
  showControls = true,
  interactive = true,
  onLocationSelect
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [token, setToken] = useState<string>(localStorage.getItem('mapbox_token') || '');
  const [isTokenSet, setIsTokenSet] = useState<boolean>(!!localStorage.getItem('mapbox_token'));
  const [isLoading, setIsLoading] = useState(false);

  const saveToken = () => {
    if (token.trim()) {
      localStorage.setItem('mapbox_token', token.trim());
      setIsTokenSet(true);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !token) return;

    setIsLoading(true);

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: zoom,
        interactive: interactive
      });

      if (showControls) {
        map.current.addControl(
          new mapboxgl.NavigationControl({ visualizePitch: true }),
          'top-right'
        );
      }

      // Add marker
      marker.current = new mapboxgl.Marker({ color: '#3B82F6' })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      if (markerLabel) {
        marker.current.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setText(markerLabel)
        );
      }

      // Allow clicking to select location
      if (onLocationSelect && interactive) {
        map.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          marker.current?.setLngLat([lng, lat]);
          onLocationSelect(lat, lng);
        });
      }

      map.current.on('load', () => {
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [isTokenSet, token, interactive, showControls]);

  // Update marker position when props change
  useEffect(() => {
    if (map.current && marker.current) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.flyTo({
        center: [longitude, latitude],
        essential: true,
        duration: 1000
      });
    }
  }, [latitude, longitude]);

  if (!isTokenSet) {
    return (
      <div className={`${className} bg-muted rounded-xl flex flex-col items-center justify-center p-6`}>
        <MapPin className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground text-center mb-4">
          Enter your Mapbox public token to enable maps.
          <br />
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Get one free at mapbox.com
          </a>
        </p>
        <div className="flex gap-2 w-full max-w-sm">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveToken} disabled={!token.trim()}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-xl overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapboxMap;
