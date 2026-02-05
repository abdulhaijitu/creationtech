 import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Button } from '@/components/ui/button';
 import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Package, Edit, ExternalLink, Plus, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
 
 interface Product {
   id: string;
   slug: string;
   name_en: string;
   name_bn: string | null;
   short_description_en: string | null;
   status: string;
   display_order: number;
 }
 
type ViewMode = 'list' | 'create';

 const AdminProducts = () => {
   const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_bn: '',
    slug: '',
    short_description_en: '',
    short_description_bn: '',
    description_en: '',
    description_bn: '',
    status: 'active',
    features: '[]',
    highlights: '[]',
    display_order: 0,
  });
 
   const { data: products, isLoading } = useQuery({
     queryKey: ['admin-products'],
     queryFn: async () => {
       const { data, error } = await supabase.from('products').select('*').order('display_order');
       if (error) throw error;
       return data as Product[];
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
      const { error } = await supabase.from('products').insert({
        name_en: data.name_en,
        name_bn: data.name_bn || null,
        slug: data.slug,
        short_description_en: data.short_description_en || null,
        short_description_bn: data.short_description_bn || null,
        description_en: data.description_en || null,
        description_bn: data.description_bn || null,
        status: data.status,
        features: JSON.parse(data.features || '[]'),
        highlights: JSON.parse(data.highlights || '[]'),
        display_order: data.display_order,
      });
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

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_bn: '',
      slug: '',
      short_description_en: '',
      short_description_bn: '',
      description_en: '',
      description_bn: '',
      status: 'active',
      features: '[]',
      highlights: '[]',
      display_order: products?.length || 0,
    });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData({ 
      ...formData, 
      name_en: value,
      slug: formData.slug || generateSlug(value)
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
                  <Input 
                    value={formData.name_en} 
                    onChange={(e) => handleNameChange(e.target.value)} 
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <Label>Name (Bangla)</Label>
                  <Input 
                    value={formData.name_bn} 
                    onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })} 
                    placeholder="পণ্যের নাম"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Slug (URL path) *</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                    placeholder="product-slug"
                  />
                  <p className="text-xs text-muted-foreground mt-1">URL: /products/{formData.slug || 'slug'}</p>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input 
                    type="number" 
                    value={formData.display_order} 
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Short Description (English)</Label>
                  <Textarea 
                    value={formData.short_description_en} 
                    onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })} 
                    rows={3} 
                    placeholder="Brief product description"
                  />
                </div>
                <div>
                  <Label>Short Description (Bangla)</Label>
                  <Textarea 
                    value={formData.short_description_bn} 
                    onChange={(e) => setFormData({ ...formData, short_description_bn: e.target.value })} 
                    rows={3} 
                    placeholder="সংক্ষিপ্ত বর্ণনা"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Full Description</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Description (English)</Label>
                <Textarea 
                  value={formData.description_en} 
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} 
                  rows={6} 
                  placeholder="Detailed product description"
                />
              </div>
              <div>
                <Label>Description (Bangla)</Label>
                <Textarea 
                  value={formData.description_bn} 
                  onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })} 
                  rows={6} 
                  placeholder="বিস্তারিত বর্ণনা"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Features & Highlights (JSON)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Features (JSON Array)</Label>
                <Textarea 
                  value={formData.features} 
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })} 
                  rows={6} 
                  className="font-mono text-sm" 
                  placeholder='[{"title": "Feature 1", "description": "..."}]' 
                />
              </div>
              <div>
                <Label>Highlights (JSON Array)</Label>
                <Textarea 
                  value={formData.highlights} 
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} 
                  rows={6} 
                  className="font-mono text-sm" 
                  placeholder='["Highlight 1", "Highlight 2"]' 
                />
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
          <Button onClick={() => { resetForm(); setViewMode('create'); }}>
            <Plus className="h-4 w-4 mr-2" />Add Product
          </Button>
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
                 <TableHead>Description</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="text-center">Active</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {products.map((product) => (
                 <TableRow key={product.id}>
                   <TableCell className="font-medium">{product.name_en}</TableCell>
                   <TableCell className="max-w-[300px] truncate">{product.short_description_en || '-'}</TableCell>
                   <TableCell><AdminStatusBadge status={product.status} /></TableCell>
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