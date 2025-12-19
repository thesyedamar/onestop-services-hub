import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ServiceCategory, useCreateCategory, useUpdateCategory } from '@/hooks/useAdminData';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ServiceCategory | null;
}

const initialFormData = {
  name: '',
  slug: '',
  description: '',
  icon: 'Package',
  color: '#3B82F6',
  sort_order: 0,
  is_active: true,
};

export const CategoryFormModal = ({ isOpen, onClose, category }: CategoryFormModalProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || 'Package',
        color: category.color || '#3B82F6',
        sort_order: category.sort_order || 0,
        is_active: category.is_active,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      return;
    }

    if (category) {
      updateCategory.mutate({
        id: category.id,
        ...formData,
      }, {
        onSuccess: () => onClose(),
      });
    } else {
      createCategory.mutate(formData, {
        onSuccess: () => onClose(),
      });
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: category ? formData.slug : generateSlug(name),
    });
  };

  if (!isOpen) return null;

  const isLoading = createCategory.isPending || updateCategory.isPending;

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
              {category ? 'Edit Category' : 'Add Category'}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Home Services"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., home-services"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the category..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., Home"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
