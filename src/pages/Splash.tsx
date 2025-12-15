import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col items-center justify-center gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-20 -left-20 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 -right-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1, delay: 0.2 }}
        className="relative"
      >
        <div className="w-28 h-28 bg-primary-foreground rounded-3xl flex items-center justify-center shadow-xl animate-pulse-glow">
          <MapPin className="h-14 w-14 text-primary" strokeWidth={2.5} />
        </div>
        
        {/* Decorative dots */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary-foreground/60 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        />
      </motion.div>

      {/* App Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-5xl font-extrabold text-primary-foreground mt-8 tracking-tight"
      >
        OneStop
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-primary-foreground/80 text-lg mt-3 font-medium"
      >
        All services, one destination
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-primary-foreground/60 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Splash;
