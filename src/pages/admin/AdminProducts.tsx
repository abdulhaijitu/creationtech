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
 import { toast } from 'sonner';
 import { Package, Eye, Edit, ExternalLink } from 'lucide-react';
 import { Link } from 'react-router-dom';
 
 interface Product {
   id: string;
   slug: string;
   name_en: string;
   name_bn: string | null;
   short_description_en: string | null;
   status: string;
   display_order: number;
 }
 
 const AdminProducts = () => {
   const queryClient = useQueryClient();
 
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
 
   return (
     <AdminLayout>
       <AdminPageHeader title="All Products" description="Manage product catalog" />
 
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