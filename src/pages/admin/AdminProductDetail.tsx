 import { useState } from 'react';
 import { useParams, Link } from 'react-router-dom';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import ProductImageUpload from '@/components/admin/ProductImageUpload';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import { toast } from 'sonner';
 import { Save, ExternalLink, ArrowLeft } from 'lucide-react';
 
 const AdminProductDetail = () => {
   const { slug } = useParams<{ slug: string }>();
   const queryClient = useQueryClient();
 
   const { data: product, isLoading } = useQuery({
     queryKey: ['admin-product', slug],
     queryFn: async () => {
       const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
       if (error) throw error;
       return data;
     },
     enabled: !!slug,
   });
 
   const [formData, setFormData] = useState<any>(null);
 
   // Initialize form data when product loads
   if (product && !formData) {
     setFormData({
       name_en: product.name_en,
       name_bn: product.name_bn || '',
       short_description_en: product.short_description_en || '',
       short_description_bn: product.short_description_bn || '',
       description_en: product.description_en || '',
       description_bn: product.description_bn || '',
       status: product.status,
       features: JSON.stringify(product.features || [], null, 2),
       highlights: JSON.stringify(product.highlights || [], null, 2),
        image_url: (product.media as any)?.[0]?.url || '',
     });
   }
 
   const updateMutation = useMutation({
     mutationFn: async (data: any) => {
        const mediaArray = data.image_url ? [{ type: 'image', url: data.image_url }] : [];
       const { error } = await supabase
         .from('products')
         .update({
            name_en: data.name_en,
            name_bn: data.name_bn,
            short_description_en: data.short_description_en,
            short_description_bn: data.short_description_bn,
            description_en: data.description_en,
            description_bn: data.description_bn,
            status: data.status,
           features: JSON.parse(data.features || '[]'),
           highlights: JSON.parse(data.highlights || '[]'),
            media: mediaArray,
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
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
   if (!product || !formData) return <AdminLayout><div>Product not found</div></AdminLayout>;
 
   return (
     <AdminLayout>
       <div className="mb-4">
         <Button variant="ghost" size="sm" asChild>
           <Link to="/admin/products"><ArrowLeft className="h-4 w-4 mr-2" />Back to Products</Link>
         </Button>
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
            <CardHeader><CardTitle>Product Image</CardTitle></CardHeader>
            <CardContent>
              <ProductImageUpload
                productId={product.id}
                currentImageUrl={formData.image_url || null}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
              />
              <p className="text-sm text-muted-foreground mt-2">
                This image will be used on the products page and homepage.
              </p>
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