 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
 import { toast } from 'sonner';
 import { Package, Edit, ArrowUp, ArrowDown, Save } from 'lucide-react';
 
 const AdminCMSProducts = () => {
   const queryClient = useQueryClient();
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<any>(null);
 
   const { data: products, isLoading } = useQuery({
     queryKey: ['cms-products'],
     queryFn: async () => {
       const { data, error } = await supabase.from('products').select('*').order('display_order');
       if (error) throw error;
       return data;
     },
   });
 
   const updateProductMutation = useMutation({
     mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
       const { error } = await supabase.from('products').update(updates).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['cms-products'] });
       toast.success('Product updated');
       setIsEditOpen(false);
     },
     onError: () => toast.error('Failed to update product'),
   });
 
   const moveProduct = async (id: string, direction: 'up' | 'down') => {
     if (!products) return;
     const index = products.findIndex((p) => p.id === id);
     const swapIndex = direction === 'up' ? index - 1 : index + 1;
     if (swapIndex < 0 || swapIndex >= products.length) return;
 
     const currentOrder = products[index].display_order;
     const swapOrder = products[swapIndex].display_order;
 
     await supabase.from('products').update({ display_order: swapOrder }).eq('id', products[index].id);
     await supabase.from('products').update({ display_order: currentOrder }).eq('id', products[swapIndex].id);
     queryClient.invalidateQueries({ queryKey: ['cms-products'] });
   };
 
   const ProductForm = ({ product }: { product: any }) => {
     const [formData, setFormData] = useState({
       short_description_en: product.short_description_en || '',
       short_description_bn: product.short_description_bn || '',
     });
 
     return (
       <div className="space-y-4">
         <div>
           <Label>Short Description (English)</Label>
           <Textarea value={formData.short_description_en} onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })} rows={3} />
         </div>
         <div>
           <Label>Short Description (Bangla)</Label>
           <Textarea value={formData.short_description_bn} onChange={(e) => setFormData({ ...formData, short_description_bn: e.target.value })} rows={3} />
         </div>
         <DialogFooter>
           <Button onClick={() => updateProductMutation.mutate({ id: product.id, ...formData })}>
             <Save className="h-4 w-4 mr-2" />Save Changes
           </Button>
         </DialogFooter>
       </div>
     );
   };
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Products Page" description="Manage product cards and ordering" />
 
       {!products?.length ? (
         <AdminEmptyState icon={Package} title="No products" description="Products will appear here" />
       ) : (
         <Card>
           <CardHeader><CardTitle>Product Cards</CardTitle></CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Order</TableHead>
                   <TableHead>Product</TableHead>
                   <TableHead>Description</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {products.map((product, index) => (
                   <TableRow key={product.id}>
                     <TableCell>
                       <div className="flex items-center gap-1">
                         <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => moveProduct(product.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" disabled={index === products.length - 1} onClick={() => moveProduct(product.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                       </div>
                     </TableCell>
                     <TableCell className="font-medium">{product.name_en}</TableCell>
                     <TableCell className="max-w-[200px] truncate">{product.short_description_en || '-'}</TableCell>
                     <TableCell>
                       <Switch checked={product.status === 'active'} onCheckedChange={(v) => updateProductMutation.mutate({ id: product.id, status: v ? 'active' : 'inactive' })} />
                     </TableCell>
                     <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => { setSelectedProduct(product); setIsEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       )}
 
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
         <DialogContent>
           <DialogHeader><DialogTitle>Edit Product Card</DialogTitle></DialogHeader>
           {selectedProduct && <ProductForm product={selectedProduct} />}
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminCMSProducts;