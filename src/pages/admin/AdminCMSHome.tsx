 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
 import { toast } from 'sonner';
 import { Save, Home, GripVertical } from 'lucide-react';
 
 interface PageSection {
   id: string;
   page_slug: string;
   section_key: string;
   title_en: string | null;
   title_bn: string | null;
   content_en: string | null;
   content_bn: string | null;
   is_active: boolean;
   display_order: number;
 }
 
 const SECTIONS = [
   { key: 'hero', label: 'Hero Section' },
   { key: 'services', label: 'Services Section' },
   { key: 'products', label: 'Products Section' },
   { key: 'testimonials', label: 'Testimonials' },
   { key: 'partners', label: 'Partners / Trusted By' },
   { key: 'cta', label: 'Call to Action' },
   { key: 'process', label: 'Development Process' },
   { key: 'industries', label: 'Industries' },
 ];
 
 const AdminCMSHome = () => {
   const queryClient = useQueryClient();
 
   const { data: sections, isLoading } = useQuery({
     queryKey: ['page-content', 'home'],
     queryFn: async () => {
       const { data, error } = await supabase.from('page_content').select('*').eq('page_slug', 'home').order('display_order');
       if (error) throw error;
       return data as PageSection[];
     },
   });
 
   const toggleSectionMutation = useMutation({
     mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
       const { error } = await supabase.from('page_content').update({ is_active }).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['page-content', 'home'] });
       toast.success('Section visibility updated');
     },
   });
 
   const updateSectionMutation = useMutation({
     mutationFn: async (section: Partial<PageSection> & { id: string }) => {
       const { id, ...updates } = section;
       const { error } = await supabase.from('page_content').update(updates).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['page-content', 'home'] });
       toast.success('Section updated');
     },
     onError: () => toast.error('Failed to update section'),
   });
 
   const SectionEditor = ({ section }: { section: PageSection }) => {
     const [formData, setFormData] = useState({
       title_en: section.title_en || '',
       title_bn: section.title_bn || '',
       content_en: section.content_en || '',
       content_bn: section.content_bn || '',
     });
 
     return (
       <div className="space-y-4 pt-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <Label>Title (English)</Label>
             <Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} />
           </div>
           <div>
             <Label>Title (Bangla)</Label>
             <Input value={formData.title_bn} onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })} />
           </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <Label>Content (English)</Label>
             <Textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={4} />
           </div>
           <div>
             <Label>Content (Bangla)</Label>
             <Textarea value={formData.content_bn} onChange={(e) => setFormData({ ...formData, content_bn: e.target.value })} rows={4} />
           </div>
         </div>
         <Button size="sm" onClick={() => updateSectionMutation.mutate({ id: section.id, ...formData })}>
           <Save className="h-4 w-4 mr-2" />Save Section
         </Button>
       </div>
     );
   };
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Home Page" description="Customize home page content and sections" />
 
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" />Page Sections</CardTitle>
           <CardDescription>Enable/disable sections and edit their content</CardDescription>
         </CardHeader>
         <CardContent>
           <Accordion type="single" collapsible className="w-full">
             {SECTIONS.map((sectionDef) => {
               const section = sections?.find((s) => s.section_key === sectionDef.key);
               return (
                 <AccordionItem key={sectionDef.key} value={sectionDef.key}>
                   <AccordionTrigger className="hover:no-underline">
                     <div className="flex items-center gap-3">
                       <GripVertical className="h-4 w-4 text-muted-foreground" />
                       <span>{sectionDef.label}</span>
                       {section && (
                         <Switch
                           checked={section.is_active}
                           onClick={(e) => e.stopPropagation()}
                           onCheckedChange={(v) => toggleSectionMutation.mutate({ id: section.id, is_active: v })}
                         />
                       )}
                     </div>
                   </AccordionTrigger>
                   <AccordionContent>
                     {section ? (
                       <SectionEditor section={section} />
                     ) : (
                       <p className="text-muted-foreground py-4">This section is not configured yet. Add it from the database.</p>
                     )}
                   </AccordionContent>
                 </AccordionItem>
               );
             })}
           </Accordion>
         </CardContent>
       </Card>
     </AdminLayout>
   );
 };
 
 export default AdminCMSHome;