import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Star } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceFormModal } from '@/components/admin/ServiceFormModal';
import { categories } from '@/data/services';

interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  provider: string;
  provider_avatar: string | null;
  provider_phone: string | null;
  address: string | null;
  rating: number;
  review_count: number;
  price: number;
  price_unit: string;
  duration: string | null;
  distance: string | null;
  image: string | null;
  featured: boolean;
  is_active: boolean;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load services');
      console.error(error);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete service');
    } else {
      toast.success('Service deleted');
      fetchServices();
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSave = () => {
    fetchServices();
    handleModalClose();
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryTitle = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || categoryId;
  };

  return (
    <MobileLayout>
      <PageHeader 
        title="Services" 
        subtitle="Manage platform services"
      />

      <PageContainer className="pt-4">
        {/* Search and Add */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAdd} size="icon" className="shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No services found' : 'No services yet. Add your first service!'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground truncate">{service.title}</h4>
                      {service.featured && (
                        <Star className="h-4 w-4 text-warning fill-warning shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{service.provider}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {getCategoryTitle(service.category_id)}
                  </span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      {service.rating}
                    </span>
                    <span className="font-medium text-foreground">
                      ${service.price}/{service.price_unit}
                    </span>
                  </div>
                </div>

                {!service.is_active && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
                    Inactive
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </PageContainer>

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        service={editingService}
      />

      <BottomNavBar />
    </MobileLayout>
  );
};

export default AdminServices;