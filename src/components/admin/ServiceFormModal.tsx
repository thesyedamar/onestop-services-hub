import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  service: Service | null;
}

const initialFormData = {
  category_id: '',
  title: '',
  description: '',
  provider: '',
  provider_phone: '',
  address: '',
  price: '',
  price_unit: 'hr',
  duration: '',
  featured: false,
  is_active: true,
};

export const ServiceFormModal = ({ isOpen, onClose, onSave, service }: ServiceFormModalProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        category_id: service.category_id,
        title: service.title,
        description: service.description,
        provider: service.provider,
        provider_phone: service.provider_phone || '',
        address: service.address || '',
        price: service.price.toString(),
        price_unit: service.price_unit,
        duration: service.duration || '',
        featured: service.featured,
        is_active: service.is_active,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.title || !formData.provider || !formData.price || !formData.provider_phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const serviceData = {
      category_id: formData.category_id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      provider: formData.provider.trim(),
      provider_phone: formData.provider_phone.trim(),
      address: formData.address.trim(),
      price: parseFloat(formData.price),
      price_unit: formData.price_unit,
      duration: formData.duration || null,
      featured: formData.featured,
      is_active: formData.is_active,
    };

    let error;

    if (service) {
      const result = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', service.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('services')
        .insert(serviceData);
      error = result.error;
    }

    setLoading(false);

    if (error) {
      toast.error(service ? 'Failed to update service' : 'Failed to create service');
      console.error(error);
    } else {
      toast.success(service ? 'Service updated' : 'Service created');
      onSave();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-card rounded-t-3xl border-t border-border"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-card px-4 py-3 border-b border-border flex items-center justify-between z-10">
            <h3 className="font-semibold text-lg text-foreground">
              {service ? 'Edit Service' : 'Add Service'}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., House Cleaning"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the service..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="provider">Provider Name *</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., CleanPro Services"
              />
            </div>

            <div>
              <Label htmlFor="provider_phone">Phone Number *</Label>
              <Input
                id="provider_phone"
                type="tel"
                value={formData.provider_phone}
                onChange={(e) => setFormData({ ...formData, provider_phone: e.target.value })}
                placeholder="e.g., +1 234 567 8900"
              />
            </div>

            <div>
              <Label htmlFor="address">Location / Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., 123 Main St, City"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="price_unit">Unit</Label>
                <Select
                  value={formData.price_unit}
                  onValueChange={(value) => setFormData({ ...formData, price_unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">per hour</SelectItem>
                    <SelectItem value="session">per session</SelectItem>
                    <SelectItem value="visit">per visit</SelectItem>
                    <SelectItem value="trip">per trip</SelectItem>
                    <SelectItem value="call">per call</SelectItem>
                    <SelectItem value="day">per day</SelectItem>
                    <SelectItem value="package">per package</SelectItem>
                    <SelectItem value="order">per order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 1-2 hrs"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="featured" className="cursor-pointer">Featured Service</Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="pt-4 pb-8">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};