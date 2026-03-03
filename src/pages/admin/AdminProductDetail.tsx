import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import ProductGalleryUpload from '@/components/admin/ProductGalleryUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Save, ExternalLink, ArrowLeft, Trash2 } from 'lucide-react';

interface MediaItem {
  type: string;
  url: string;
}

interface ProductFormData {
  name_en: string;
  name_bn: string;
  slug: string;
  short_description_en: string;
  short_description_bn: string;
  description_en: string;
  description_bn: string;
  status: string;
  category: string;
  display_order: number;
  features: string;
  highlights: string;
  images: MediaItem[];
}

interface ProductCategory {
  id: string;
  name_en: string;
  name_bn: string | null;
  slug: string;
}

const AdminProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', slug],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data as ProductCategory[];
    },
  });

  const [formData, setFormData] = useState<ProductFormData | null>(null);

  // Initialize form data when product loads
  if (product && !formData) {
    setFormData({
      name_en: product.name_en,
      name_bn: product.name_bn || '',
      slug: product.slug,
      short_description_en: product.short_description_en || '',
      short_description_bn: product.short_description_bn || '',
      description_en: product.description_en || '',
      description_bn: product.description_bn || '',
      status: product.status,
      category: (product as any).category || '',
      display_order: product.display_order ?? 0,
      features: JSON.stringify(product.features || [], null, 2),
      highlights: JSON.stringify(product.highlights || [], null, 2),
      images: (Array.isArray(product.media) ? product.media : []).filter((m: any) => m?.url).map((m: any) => ({ type: m.type || 'image', url: m.url })) as MediaItem[],
    });
  }

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const { error } = await supabase
        .from('products')
        .update({
          name_en: data.name_en,
          name_bn: data.name_bn,
          slug: data.slug,
          short_description_en: data.short_description_en,
          short_description_bn: data.short_description_bn,
          description_en: data.description_en,
          description_bn: data.description_bn,
          status: data.status,
          category: data.category || null,
          display_order: data.display_order,
          features: JSON.parse(data.features || '[]'),
          highlights: JSON.parse(data.highlights || '[]'),
          media: (data.images || []) as any,
        })
        .eq('slug', slug);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product', slug] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update product. Check JSON format.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('products').delete().eq('slug', slug);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
      navigate('/admin/products');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
  if (!product || !formData) return <AdminLayout><div>Product not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/products"><ArrowLeft className="h-4 w-4 mr-2" />Back to Products</Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />Delete Product
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
                onClick={() => deleteMutation.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <AdminPageHeader
        title={product.name_en}
        description="Manage product content and settings"
        action={
          <Button variant="outline" onClick={() => window.open(`/products/${slug}`, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />View on Site
          </Button>
        }
      />

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
                <Label>Name (English)</Label>
                <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} />
              </div>
              <div>
                <Label>Name (Bangla)</Label>
                <Input value={formData.name_bn} onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Slug (URL path)</Label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                <p className="text-xs text-muted-foreground mt-1">URL: /products/{formData.slug}</p>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value === '_none' ? '' : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No Category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Textarea value={formData.short_description_en} onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })} rows={3} />
              </div>
              <div>
                <Label>Short Description (Bangla)</Label>
                <Textarea value={formData.short_description_bn} onChange={(e) => setFormData({ ...formData, short_description_bn: e.target.value })} rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Product Gallery</CardTitle></CardHeader>
          <CardContent>
            <ProductGalleryUpload
              productId={product.id}
              images={formData.images || []}
              onImagesChange={(images) => setFormData({ ...formData, images })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Full Description</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Description (English)</Label>
              <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={6} />
            </div>
            <div>
              <Label>Description (Bangla)</Label>
              <Textarea value={formData.description_bn} onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })} rows={6} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Features & Highlights (JSON)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Features (JSON Array)</Label>
              <Textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} rows={6} className="font-mono text-sm" placeholder='[{"title": "Feature 1", "description": "..."}]' />
            </div>
            <div>
              <Label>Highlights (JSON Array)</Label>
              <Textarea value={formData.highlights} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} rows={6} className="font-mono text-sm" placeholder='["Highlight 1", "Highlight 2"]' />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductDetail;
