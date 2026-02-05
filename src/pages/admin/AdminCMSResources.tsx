 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Button } from '@/components/ui/button';
 import { Switch } from '@/components/ui/switch';
 import { toast } from 'sonner';
 import { format } from 'date-fns';
 import { FileText, Eye, Edit, ExternalLink } from 'lucide-react';
 import { Link } from 'react-router-dom';
 
 const AdminCMSResources = () => {
   const queryClient = useQueryClient();
 
   const { data: posts, isLoading } = useQuery({
     queryKey: ['cms-blog-posts'],
     queryFn: async () => {
       const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
       if (error) throw error;
       return data;
     },
   });
 
   const updatePostMutation = useMutation({
     mutationFn: async ({ id, status }: { id: string; status: string }) => {
       const { error } = await supabase.from('blog_posts').update({ status, published_at: status === 'published' ? new Date().toISOString() : null }).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['cms-blog-posts'] });
       toast.success('Post status updated');
     },
     onError: () => toast.error('Failed to update post'),
   });
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Resources Page" description="Manage blogs and resources" />
 
       {!posts?.length ? (
         <AdminEmptyState icon={FileText} title="No resources" description="Blog posts will appear here" />
       ) : (
         <Card>
           <CardHeader><CardTitle>Blog Posts</CardTitle></CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Title</TableHead>
                   <TableHead>Author</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Published</TableHead>
                   <TableHead>Date</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {posts.map((post) => (
                   <TableRow key={post.id}>
                     <TableCell className="font-medium max-w-[200px] truncate">{post.title_en}</TableCell>
                     <TableCell>{post.author_name || '-'}</TableCell>
                     <TableCell><AdminStatusBadge status={post.status || 'draft'} /></TableCell>
                     <TableCell>
                       <Switch
                         checked={post.status === 'published'}
                         onCheckedChange={(v) => updatePostMutation.mutate({ id: post.id, status: v ? 'published' : 'draft' })}
                       />
                     </TableCell>
                     <TableCell>{format(new Date(post.created_at), 'dd MMM yyyy')}</TableCell>
                     <TableCell className="text-right">
                       <Button variant="ghost" size="sm" asChild>
                         <Link to="/admin/blog"><Edit className="h-4 w-4" /></Link>
                       </Button>
                       {post.status === 'published' && (
                         <Button variant="ghost" size="sm" asChild>
                           <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                         </Button>
                       )}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       )}
     </AdminLayout>
   );
 };
 
 export default AdminCMSResources;