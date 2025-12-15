import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  title: string;
  provider: string;
  providerAvatar?: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceUnit?: string;
  duration?: string;
  distance?: string;
  image?: string;
  onClick?: () => void;
}

export const ServiceCard = ({
  title,
  provider,
  providerAvatar,
  rating,
  reviewCount,
  price,
  priceUnit = 'hr',
  duration,
  distance,
  image,
  onClick,
}: ServiceCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-full bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden tap-highlight text-left"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Image */}
      {image && (
        <div className="h-36 w-full bg-muted overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-4">
        {/* Provider Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center overflow-hidden">
            {providerAvatar ? (
              <img src={providerAvatar} alt={provider} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-semibold text-primary">{provider.charAt(0)}</span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{provider}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>

        {/* Rating & Meta */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </div>
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          )}
          {distance && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-primary">${price}</span>
          <span className="text-sm text-muted-foreground">/{priceUnit}</span>
        </div>
      </div>
    </motion.button>
  );
};
