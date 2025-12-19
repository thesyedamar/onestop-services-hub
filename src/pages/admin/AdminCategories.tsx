import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useServiceCategories, useDeleteCategory, ServiceCategory } from '@/hooks/useAdminData';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const AdminCategories = () => {
  const { data: categories = [], isLoading } = useServiceCategories();
  const deleteCategory = useDeleteCategory();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: ServiceCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <PageHeader title="Categories" subtitle="Loading..." />
        <PageContainer className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner />
        </PageContainer>
        <BottomNavBar />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <PageHeader 
        title="Categories" 
        subtitle={`${categories.length} categories`}
        rightAction={
          <Button size="icon" variant="ghost" onClick={handleAdd}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      {/* Search */}
      <div className="px-4 pb-4 sticky top-16 z-30 bg-background">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-card border-border/50"
          />
        </div>
      </div>

      <PageContainer>
        <AnimatePresence mode="popLayout">
          <div className="flex flex-col gap-3">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <FolderOpen 
                      className="h-6 w-6" 
                      style={{ color: category.color || '#3B82F6' }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-foreground truncate">{category.name}</h4>
                      {!category.is_active && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon-sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon-sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteCategory.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <FolderOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Categories Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Add your first category'}
            </p>
            {!searchQuery && (
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            )}
          </motion.div>
        )}
      </PageContainer>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
      />

      <BottomNavBar />
    </MobileLayout>
  );
};

export default AdminCategories;
