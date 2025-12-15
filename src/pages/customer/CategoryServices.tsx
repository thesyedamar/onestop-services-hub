import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/button';
import { getServicesByCategory, getCategoryById } from '@/data/services';

const CategoryServices = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = getCategoryById(categoryId || '');
  const services = getServicesByCategory(categoryId || '');

  if (!category) {
    return (
      <MobileLayout>
        <PageContainer className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Category not found</p>
        </PageContainer>
      </MobileLayout>
    );
  }

  const CategoryIcon = category.icon;

  return (
    <MobileLayout>
      <PageHeader
        title={category.title}
        subtitle={`${services.length} services available`}
        leftAction={
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
        rightAction={
          <Button variant="ghost" size="icon-sm">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        }
      />

      <PageContainer className="pt-4">
        {/* Category Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl mb-6"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}25` }}
            >
              <CategoryIcon className="h-8 w-8" style={{ color: category.color }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
              <p className="text-muted-foreground">{category.count} verified providers</p>
            </div>
          </div>
        </motion.div>

        {/* Services List */}
        <div className="flex flex-col gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <ServiceCard
                id={service.id}
                title={service.title}
                provider={service.provider}
                rating={service.rating}
                reviewCount={service.reviewCount}
                price={service.price}
                priceUnit={service.priceUnit}
                duration={service.duration}
                distance={service.distance}
                onClick={() => navigate(`/service/${service.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CategoryIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Services Yet</h3>
            <p className="text-muted-foreground">
              Services in this category will appear here
            </p>
          </div>
        )}
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default CategoryServices;
