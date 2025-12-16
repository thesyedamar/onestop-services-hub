import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, role, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<'form' | 'role'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role) {
      redirectByRole(role);
    }
  }, [isAuthenticated, role]);

  const redirectByRole = (userRole: string) => {
    switch (userRole) {
      case 'provider':
        navigate('/provider/requests');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/home');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setStep('role');
  };

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);
    
    const { error } = await signup(name, email, password, role);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('An account with this email already exists');
      } else {
        toast.error(error.message || 'Signup failed. Please try again.');
      }
      setIsLoading(false);
      return;
    }
    
    toast.success('Account created! Please check your email to confirm your account.');
    setIsLoading(false);
    navigate('/login');
  };

  if (authLoading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </MobileLayout>
    );
  }

  if (step === 'role') {
    return (
      <MobileLayout>
        <div className="min-h-screen flex flex-col px-6 py-8 safe-top safe-bottom">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setStep('form')}
            className="flex items-center gap-2 text-muted-foreground mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground">Choose Your Role</h1>
            <p className="text-muted-foreground mt-2">Select how you want to use OneStop</p>
          </motion.div>

          {/* Role Selection */}
          <div className="flex flex-col gap-4 flex-1">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => handleRoleSelect('customer')}
              disabled={isLoading}
              className={`p-6 rounded-2xl border-2 text-left tap-highlight transition-all ${
                selectedRole === 'customer'
                  ? 'border-primary bg-primary-soft'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                <User className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">I'm a Customer</h3>
              <p className="text-muted-foreground">Browse and book services from trusted providers</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => handleRoleSelect('provider')}
              disabled={isLoading}
              className={`p-6 rounded-2xl border-2 text-left tap-highlight transition-all ${
                selectedRole === 'provider'
                  ? 'border-accent bg-accent-soft'
                  : 'border-border bg-card hover:border-accent/50'
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                <MapPin className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">I'm a Service Provider</h3>
              <p className="text-muted-foreground">Offer your services and grow your business</p>
            </motion.button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="md" />
            </div>
          )}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen flex flex-col px-6 py-8 safe-top safe-bottom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center pt-8 mb-10"
        >
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <MapPin className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join OneStop today</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-4 flex-1"
        >
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-12 h-14 rounded-xl bg-card border-border/50 text-base"
              autoComplete="name"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 rounded-xl bg-card border-border/50 text-base"
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-14 rounded-xl bg-card border-border/50 text-base"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary font-medium">Privacy Policy</Link>
          </p>

          {/* Continue Button */}
          <Button type="submit" size="lg" fullWidth className="mt-4">
            Continue
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Signup */}
          <Button variant="outline" size="lg" fullWidth type="button" disabled>
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </motion.form>

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-6"
        >
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Signup;
