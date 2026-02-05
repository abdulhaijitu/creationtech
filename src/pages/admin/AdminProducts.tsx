import { useState, useRef } from 'react';
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
import { Package, Edit, ExternalLink, Plus, ArrowLeft, Save, Trash2, Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
 
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
 
type ViewMode = 'list' | 'create';

 const AdminProducts = () => {
   const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
 
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const newImages: MediaItem[] = [];

    try {
      for (const file of validFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `new-product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        newImages.push({ type: 'image', url: publicUrl });
      }

      if (newImages.length > 0) {
        setGalleryImages((prev) => [...prev, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = galleryImages[index];
    try {
      const urlParts = imageToRemove.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('product-images').remove([fileName]);
    } catch (error) {
      console.error('Delete error:', error);
    }
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= galleryImages.length) return;
    const newImages = [...galleryImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setGalleryImages(newImages);
  };

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
      const { error } = await supabase.from('products').insert([{
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
        media: galleryImages as any,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created successfully');
      setViewMode('list');
      resetForm();
      setGalleryImages([]);
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
    setGalleryImages([]);
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
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Product Gallery ({galleryImages.length})
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Add Images
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-1">
                          {index > 0 && (
                            <Button type="button" variant="secondary" size="sm" onClick={() => moveImage(index, index - 1)}>←</Button>
                          )}
                          {index < galleryImages.length - 1 && (
                            <Button type="button" variant="secondary" size="sm" onClick={() => moveImage(index, index + 1)}>→</Button>
                          )}
                        </div>
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(index)}>
                          <X className="h-4 w-4 mr-1" />Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload images</span>
                      <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB each. Multiple files allowed.</span>
                    </>
                  )}
                </div>
              )}
              {isUploading && galleryImages.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-3">
                The first image will be used as the primary image on product cards.
              </p>
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