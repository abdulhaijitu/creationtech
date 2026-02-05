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
 import { Briefcase, Edit, Save } from 'lucide-react';
 
 const AdminCMSServices = () => {
   const queryClient = useQueryClient();
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [selectedService, setSelectedService] = useState<any>(null);
 
   const { data: services, isLoading } = useQuery({
     queryKey: ['cms-services'],
     queryFn: async () => {
       const { data, error } = await supabase.from('services').select('*').order('display_order');
       if (error) throw error;
       return data;
     },
   });
 
   const updateServiceMutation = useMutation({
     mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
       const { error } = await supabase.from('services').update(updates).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['cms-services'] });
       toast.success('Service updated');
       setIsEditOpen(false);
     },
     onError: () => toast.error('Failed to update service'),
   });
 
   const ServiceForm = ({ service }: { service: any }) => {
     const [formData, setFormData] = useState({
       title_en: service.title_en || '',
       title_bn: service.title_bn || '',
       description_en: service.description_en || '',
       description_bn: service.description_bn || '',
       icon: service.icon || '',
     });
 
     return (
       <div className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label>Title (English)</Label>
             <Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} />
           </div>
           <div>
             <Label>Title (Bangla)</Label>
             <Input value={formData.title_bn} onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })} />
           </div>
         </div>
         <div>
           <Label>Icon (Lucide icon name)</Label>
           <Input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="e.g., Code, Smartphone" />
         </div>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label>Description (English)</Label>
             <Textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={4} />
           </div>
           <div>
             <Label>Description (Bangla)</Label>
             <Textarea value={formData.description_bn} onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })} rows={4} />
           </div>
         </div>
         <DialogFooter>
           <Button onClick={() => updateServiceMutation.mutate({ id: service.id, ...formData })}>
             <Save className="h-4 w-4 mr-2" />Save Changes
           </Button>
         </DialogFooter>
       </div>
     );
   };
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Services Page" description="Edit service titles and descriptions" />
 
       {!services?.length ? (
         <AdminEmptyState icon={Briefcase} title="No services" description="Services will appear here" />
       ) : (
         <Card>
           <CardHeader><CardTitle>Services</CardTitle></CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Service</TableHead>
                   <TableHead>Description</TableHead>
                   <TableHead>Visible</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {services.map((service) => (
                   <TableRow key={service.id}>
                     <TableCell className="font-medium">{service.title_en}</TableCell>
                     <TableCell className="max-w-[300px] truncate">{service.description_en || '-'}</TableCell>
                     <TableCell>
                       <Switch checked={service.is_active} onCheckedChange={(v) => updateServiceMutation.mutate({ id: service.id, is_active: v })} />
                     </TableCell>
                     <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => { setSelectedService(service); setIsEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       )}
 
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
         <DialogContent className="max-w-2xl">
           <DialogHeader><DialogTitle>Edit Service</DialogTitle></DialogHeader>
           {selectedService && <ServiceForm service={selectedService} />}
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminCMSServices;