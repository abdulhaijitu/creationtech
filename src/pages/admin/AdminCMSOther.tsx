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
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { toast } from 'sonner';
 import { FileText, Edit, Plus, Save, ExternalLink } from 'lucide-react';
 
 const EXCLUDED_PAGES = ['home', 'products', 'services', 'companies', 'resources'];
 
 const AdminCMSOther = () => {
   const queryClient = useQueryClient();
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isAddOpen, setIsAddOpen] = useState(false);
   const [selectedPage, setSelectedPage] = useState<any>(null);
 
   const { data: pages, isLoading } = useQuery({
     queryKey: ['cms-other-pages'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('page_content')
         .select('*')
         .not('page_slug', 'in', `(${EXCLUDED_PAGES.join(',')})`)
         .order('page_slug');
       if (error) throw error;
       // Group by page_slug
       const grouped = data.reduce((acc: any, item: any) => {
         if (!acc[item.page_slug]) acc[item.page_slug] = [];
         acc[item.page_slug].push(item);
         return acc;
       }, {});
       return Object.entries(grouped).map(([slug, sections]) => ({ slug, sections }));
     },
   });
 
   const updatePageMutation = useMutation({
     mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
       const { error } = await supabase.from('page_content').update(updates).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['cms-other-pages'] });
       toast.success('Page updated');
       setIsEditOpen(false);
     },
     onError: () => toast.error('Failed to update page'),
   });
 
   const addPageMutation = useMutation({
     mutationFn: async (page: any) => {
       const { error } = await supabase.from('page_content').insert(page);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['cms-other-pages'] });
       toast.success('Page section added');
       setIsAddOpen(false);
     },
     onError: () => toast.error('Failed to add page section'),
   });
 
   const PageForm = ({ page, onSubmit, isNew = false }: { page?: any; onSubmit: (data: any) => void; isNew?: boolean }) => {
     const [formData, setFormData] = useState({
       page_slug: page?.page_slug || '',
       section_key: page?.section_key || 'main',
       title_en: page?.title_en || '',
       title_bn: page?.title_bn || '',
       content_en: page?.content_en || '',
       content_bn: page?.content_bn || '',
       meta_title_en: page?.meta_title_en || '',
       meta_description_en: page?.meta_description_en || '',
       is_active: page?.is_active ?? true,
     });
 
     return (
       <div className="space-y-4">
         {isNew && (
           <div className="grid grid-cols-2 gap-4">
             <div>
               <Label>Page Slug</Label>
               <Input value={formData.page_slug} onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })} placeholder="e.g., about, faq" />
             </div>
             <div>
               <Label>Section Key</Label>
               <Input value={formData.section_key} onChange={(e) => setFormData({ ...formData, section_key: e.target.value })} placeholder="e.g., main, hero" />
             </div>
           </div>
         )}
         <Tabs defaultValue="content">
           <TabsList>
             <TabsTrigger value="content">Content</TabsTrigger>
             <TabsTrigger value="seo">SEO</TabsTrigger>
           </TabsList>
           <TabsContent value="content" className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div><Label>Title (English)</Label><Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} /></div>
               <div><Label>Title (Bangla)</Label><Input value={formData.title_bn} onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })} /></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><Label>Content (English)</Label><Textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={6} /></div>
               <div><Label>Content (Bangla)</Label><Textarea value={formData.content_bn} onChange={(e) => setFormData({ ...formData, content_bn: e.target.value })} rows={6} /></div>
             </div>
           </TabsContent>
           <TabsContent value="seo" className="space-y-4">
             <div><Label>Meta Title</Label><Input value={formData.meta_title_en} onChange={(e) => setFormData({ ...formData, meta_title_en: e.target.value })} /></div>
             <div><Label>Meta Description</Label><Textarea value={formData.meta_description_en} onChange={(e) => setFormData({ ...formData, meta_description_en: e.target.value })} rows={3} /></div>
           </TabsContent>
         </Tabs>
         <div className="flex items-center gap-2">
           <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
           <Label>Visible</Label>
         </div>
         <DialogFooter>
           <Button onClick={() => onSubmit(formData)}><Save className="h-4 w-4 mr-2" />{isNew ? 'Add Section' : 'Save Changes'}</Button>
         </DialogFooter>
       </div>
     );
   };
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader
         title="Other Pages"
         description="Manage other website pages"
         action={<Button onClick={() => setIsAddOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Section</Button>}
       />
 
       {!pages?.length ? (
         <AdminEmptyState icon={FileText} title="No other pages" description="Add page sections to manage content" />
       ) : (
         <Card>
           <CardHeader><CardTitle>Page Sections</CardTitle></CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Page</TableHead>
                   <TableHead>Sections</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {pages.map((page: any) => (
                   <TableRow key={page.slug}>
                     <TableCell className="font-medium capitalize">{page.slug.replace(/-/g, ' ')}</TableCell>
                     <TableCell>{(page.sections as any[]).length} section(s)</TableCell>
                     <TableCell>
                       <Switch
                         checked={(page.sections as any[])[0]?.is_active}
                         onCheckedChange={(v) => updatePageMutation.mutate({ id: (page.sections as any[])[0]?.id, is_active: v })}
                       />
                     </TableCell>
                     <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => { setSelectedPage((page.sections as any[])[0]); setIsEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="sm" asChild><a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a></Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       )}
 
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
         <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>Edit Page Section</DialogTitle></DialogHeader>{selectedPage && <PageForm page={selectedPage} onSubmit={(data) => updatePageMutation.mutate({ id: selectedPage.id, ...data })} />}</DialogContent>
       </Dialog>
 
       <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
         <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>Add Page Section</DialogTitle></DialogHeader><PageForm isNew onSubmit={(data) => addPageMutation.mutate(data)} /></DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminCMSOther;