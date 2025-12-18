import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Bell, ChevronDown } from 'lucide-react';
import { MobileLayout, PageContainer } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Input } from '@/components/ui/input';
import { categories } from '@/data/services';
import { useAuth } from '@/contexts/AuthContext';
import { useFeaturedServices, useCategoryServiceCount } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerHome = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  const { services: featuredServices, loading: featuredLoading } = useFeaturedServices();
  const { counts: categoryCounts } = useCategoryServiceCount();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background px-4 py-4 safe-top border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          {/* Location Selector */}
          <motion.button 
            className="flex items-center gap-2 tap-highlight"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Location</p>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">{currentLocation}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center relative tap-highlight"
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </motion.button>
        </div>

        {/* Welcome Message */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            Hello, {profile?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-muted-foreground">What service do you need today?</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-card border-border/50"
          />
        </div>
      </div>

      <PageContainer className="pt-6">
        {/* Categories Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Categories</h2>
            <button className="text-primary text-sm font-medium">See All</button>
          </div>
          
          <motion.div 
            className="grid grid-cols-3 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <CategoryCard
                  title={category.title.split(' ')[0]}
                  icon={category.icon}
                  color={category.color}
                  count={categoryCounts[category.id] || 0}
                  onClick={() => handleCategoryClick(category.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Services Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Featured Services</h2>
            <button className="text-primary text-sm font-medium">See All</button>
          </div>

          <div className="flex flex-col gap-4">
            {featuredLoading ? (
              <>
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
              </>
            ) : featuredServices.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No featured services yet</p>
            ) : (
              featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ServiceCard
                    id={service.id}
                    title={service.title}
                    provider={service.provider}
                    rating={Number(service.rating)}
                    reviewCount={service.review_count}
                    price={Number(service.price)}
                    priceUnit={service.price_unit}
                    duration={service.duration || undefined}
                    distance={service.distance || undefined}
                    onClick={() => handleServiceClick(service.id)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default CustomerHome;
