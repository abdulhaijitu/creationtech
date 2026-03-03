import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import ProductGalleryUpload from '@/components/admin/ProductGalleryUpload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Package, Edit, ExternalLink, Plus, ArrowLeft, Save, Trash2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MediaItem {
  type: string;
  url: string;
}

interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string | null;
  short_description_en: string | null;
  status: string;
  display_order: number;
}

interface ProductCategory {
  id: string;
  name_en: string;
  name_bn: string | null;
  slug: string;
  is_active: boolean;
  display_order: number;
}

type ViewMode = 'list' | 'create';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name_en: '', name_bn: '', slug: '' });

  const [formData, setFormData] = useState({
    name_en: '',
    slug: '',
    short_description_en: '',
    description_en: '',
    status: 'active',
    category: '',
    display_order: 0,
    price: '',
    demo_url: '',
    meta_title: '',
    meta_description: '',
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('display_order');
      if (error) throw error;
      return data as Product[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as ProductCategory[];
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('products').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
      setDeletingId(null);
    },
    onError: () => {
      toast.error('Failed to delete product');
      setDeletingId(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('products').insert([{
        name_en: data.name_en,
        slug: data.slug,
        short_description_en: data.short_description_en || null,
        description_en: data.description_en || null,
        status: data.status,
        category: data.category || null,
        display_order: data.display_order,
        price: data.price || null,
        demo_url: data.demo_url || null,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        media: galleryImages as any,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created successfully');
      setViewMode('list');
      resetForm();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create product. Check JSON format and slug uniqueness.');
    },
  });

  // Category CRUD mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (cat: { name_en: string; name_bn: string; slug: string }) => {
      const { error } = await supabase.from('product_categories').insert([{
        name_en: cat.name_en,
        name_bn: cat.name_bn || null,
        slug: cat.slug,
        display_order: categories.length,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories-admin'] });
      setNewCategory({ name_en: '', name_bn: '', slug: '' });
      toast.success('Category created');
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (cat: ProductCategory) => {
      const { error } = await supabase.from('product_categories').update({
        name_en: cat.name_en,
        name_bn: cat.name_bn,
        slug: cat.slug,
        is_active: cat.is_active,
      }).eq('id', cat.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories-admin'] });
      setEditingCategory(null);
      toast.success('Category updated');
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories-admin'] });
      toast.success('Category deleted');
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const resetForm = () => {
    setFormData({
      name_en: '',
      slug: '',
      short_description_en: '',
      description_en: '',
      status: 'active',
      category: '',
      display_order: products?.length || 0,
      price: '',
      demo_url: '',
      meta_title: '',
      meta_description: '',
    });
    setGalleryImages([]);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name_en: value,
      slug: formData.slug || generateSlug(value),
    });
  };

  const handleSubmit = () => {
    if (!formData.name_en.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleAddCategory = () => {
    if (!newCategory.name_en.trim()) {
      toast.error('Category name is required');
      return;
    }
    const slug = newCategory.slug || generateSlug(newCategory.name_en);
    createCategoryMutation.mutate({ ...newCategory, slug });
  };

  const activeCategories = categories.filter((c) => c.is_active);

  if (viewMode === 'create') {
    return (
      <AdminLayout>
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Products
          </Button>
        </div>

        <AdminPageHeader title="New Product" description="Add a new product to the catalog" />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Basic Information
                <div className="flex items-center gap-2">
                  <Label>Active</Label>
                  <Switch
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name (English) *</Label>
                  <Input value={formData.name_en} onChange={(e) => handleNameChange(e.target.value)} placeholder="Product name" />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="e.g. ৳5,000/month or Contact us" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Slug (URL path) *</Label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="product-slug" />
                  <p className="text-xs text-muted-foreground mt-1">URL: /products/{formData.slug || 'slug'}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value === '_none' ? '' : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">No Category</SelectItem>
                      {activeCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>{cat.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>Short Description</Label>
                <Textarea value={formData.short_description_en} onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })} rows={3} placeholder="Brief product description" />
              </div>
              <div>
                <Label>Live Preview / Demo URL</Label>
                <Input value={formData.demo_url} onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })} placeholder="https://demo.example.com" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Product Gallery ({galleryImages.length})</CardTitle></CardHeader>
            <CardContent>
              <ProductGalleryUpload
                productId="new-product"
                images={galleryImages}
                onImagesChange={setGalleryImages}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Full Description</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={6} placeholder="Detailed product description" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Meta Title</Label>
                <Input value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} placeholder="SEO title (max 60 chars)" maxLength={60} />
                <p className="text-xs text-muted-foreground mt-1">{formData.meta_title.length}/60</p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} rows={3} placeholder="SEO description (max 160 chars)" maxLength={160} />
                <p className="text-xs text-muted-foreground mt-1">{formData.meta_description.length}/160</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setViewMode('list')}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />Create Product
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="All Products"
        description="Manage product catalog"
        action={
          <div className="flex gap-2">
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />Manage Categories
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Product Categories</DialogTitle>
                  <DialogDescription>Add, edit, or remove product categories.</DialogDescription>
                </DialogHeader>

                {/* Add new category */}
                <div className="space-y-3 border-b pb-4">
                  <Label className="font-medium">Add New Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Name (English)"
                      value={newCategory.name_en}
                      onChange={(e) => setNewCategory({ ...newCategory, name_en: e.target.value, slug: generateSlug(e.target.value) })}
                    />
                    <Input
                      placeholder="Name (Bangla)"
                      value={newCategory.name_bn}
                      onChange={(e) => setNewCategory({ ...newCategory, name_bn: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Slug"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleAddCategory} disabled={createCategoryMutation.isPending}>
                      <Plus className="h-4 w-4 mr-1" />Add
                    </Button>
                  </div>
                </div>

                {/* Category list */}
                <div className="space-y-2">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-2 p-2 border rounded-lg">
                        {editingCategory?.id === cat.id ? (
                          <>
                            <div className="flex-1 space-y-1">
                              <Input
                                value={editingCategory.name_en}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                                placeholder="Name EN"
                              />
                              <Input
                                value={editingCategory.name_bn || ''}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name_bn: e.target.value })}
                                placeholder="Name BN"
                              />
                            </div>
                            <Button size="sm" onClick={() => updateCategoryMutation.mutate(editingCategory)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{cat.name_en}</p>
                              {cat.name_bn && <p className="text-xs text-muted-foreground">{cat.name_bn}</p>}
                            </div>
                            <Switch
                              checked={cat.is_active}
                              onCheckedChange={(checked) => updateCategoryMutation.mutate({ ...cat, is_active: checked })}
                            />
                            <Button size="sm" variant="ghost" onClick={() => setEditingCategory({ ...cat })}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost"><Trash2 className="h-3 w-3 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                  <AlertDialogDescription>Delete "{cat.name_en}"? Products using this category won't be affected.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteCategoryMutation.mutate(cat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => { resetForm(); setViewMode('create'); }}>
              <Plus className="h-4 w-4 mr-2" />Add Product
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <AdminLoadingSkeleton />
      ) : !products?.length ? (
        <AdminEmptyState icon={Package} title="No products found" description="Products will appear here" />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name_en}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{product.slug}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{product.short_description_en || '-'}</TableCell>
                  <TableCell><AdminStatusBadge status={product.status} /></TableCell>
                  <TableCell className="text-center text-muted-foreground">{product.display_order}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={product.status === 'active'}
                      onCheckedChange={(checked) => toggleStatusMutation.mutate({ id: product.id, status: checked ? 'active' : 'inactive' })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/products/${product.slug}`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                    </Button>
                    <AlertDialog open={deletingId === product.id} onOpenChange={(open) => !open && setDeletingId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name_en}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
