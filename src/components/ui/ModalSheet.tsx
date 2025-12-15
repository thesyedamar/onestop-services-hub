import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './button';

interface ModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showHandle?: boolean;
}

export const ModalSheet = ({ isOpen, onClose, title, children, showHandle = true }: ModalSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-card rounded-t-3xl shadow-xl safe-bottom"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3">
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="p-4 max-h-[70vh] overflow-y-auto no-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
