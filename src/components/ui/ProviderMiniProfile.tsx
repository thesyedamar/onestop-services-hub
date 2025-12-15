import { motion } from 'framer-motion';
import { Star, Shield, MessageCircle, Phone } from 'lucide-react';
import { Button } from './button';

interface ProviderMiniProfileProps {
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  verified?: boolean;
  specialty?: string;
  onChat?: () => void;
  onCall?: () => void;
  compact?: boolean;
}

export const ProviderMiniProfile = ({
  name,
  avatar,
  rating,
  reviewCount,
  verified = false,
  specialty,
  onChat,
  onCall,
  compact = false,
}: ProviderMiniProfileProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{name}</h4>
            {verified && <Shield className="h-4 w-4 text-primary fill-primary-soft" />}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span>{rating.toFixed(1)}</span>
            <span>({reviewCount} reviews)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-primary-soft flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-foreground text-lg">{name}</h4>
            {verified && <Shield className="h-5 w-5 text-primary fill-primary-soft" />}
          </div>
          {specialty && (
            <p className="text-sm text-muted-foreground mb-2">{specialty}</p>
          )}
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {(onChat || onCall) && (
        <div className="flex gap-3 mt-4">
          {onChat && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onChat}>
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
          )}
          {onCall && (
            <Button variant="soft" size="sm" className="flex-1" onClick={onCall}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};
