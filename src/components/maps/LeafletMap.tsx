import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markerLabel?: string;
  className?: string;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Component to handle map center updates
const MapUpdater: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
  }, [lat, lng, map]);
  
  return null;
};

// Component to handle click events for location selection
const LocationSelector: React.FC<{
  onLocationSelect?: (lat: number, lng: number) => void;
  setPosition: (pos: [number, number]) => void;
}> = ({ onLocationSelect, setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect?.(lat, lng);
    },
  });
  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude = 40.7128,
  longitude = -74.006,
  zoom = 14,
  markerLabel,
  className = 'h-64',
  interactive = true,
  onLocationSelect
}) => {
  const [position, setPosition] = React.useState<[number, number]>([latitude, longitude]);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  return (
    <div className={`relative ${className} rounded-xl overflow-hidden`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater lat={position[0]} lng={position[1]} />
        {onLocationSelect && interactive && (
          <LocationSelector onLocationSelect={onLocationSelect} setPosition={setPosition} />
        )}
        <Marker position={position}>
          {markerLabel && <Popup>{markerLabel}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
