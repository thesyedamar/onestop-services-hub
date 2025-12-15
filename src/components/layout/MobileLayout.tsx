import { ReactNode } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

export const MobileLayout = ({ children, className = '' }: MobileLayoutProps) => {
  return (
    <div className={`min-h-screen max-w-md mx-auto bg-background overflow-x-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const PageContainer = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`px-4 pb-24 ${className}`}>
      {children}
    </div>
  );
};

export const PageHeader = ({ 
  title, 
  subtitle,
  leftAction,
  rightAction 
}: { 
  title: string; 
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-4 py-4 border-b border-border/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {leftAction}
          <div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {rightAction}
      </div>
    </header>
  );
};
