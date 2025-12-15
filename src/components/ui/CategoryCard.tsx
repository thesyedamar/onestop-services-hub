import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  count?: number;
}

export const CategoryCard = ({ title, icon: Icon, color, onClick, count }: CategoryCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 bg-card rounded-2xl shadow-sm border border-border/50 tap-highlight"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="h-7 w-7" style={{ color }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        {count !== undefined && (
          <p className="text-xs text-muted-foreground mt-0.5">{count} services</p>
        )}
      </div>
    </motion.button>
  );
};
