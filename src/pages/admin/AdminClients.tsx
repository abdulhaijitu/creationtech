 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { useToast } from '@/hooks/use-toast';
 import { Plus, Pencil, Trash2, Users, Search, Mail, Phone } from 'lucide-react';
 import { format } from 'date-fns';
 
 interface Client {
   id: string;
   name: string;
   email: string | null;
   phone: string | null;
   company: string | null;
   address: string | null;
   notes: string | null;
   created_at: string;
 }
 
 const AdminClients = () => {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [editingClient, setEditingClient] = useState<Client | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const { toast } = useToast();
   const queryClient = useQueryClient();
 
   const [formData, setFormData] = useState({
     name: '',
     email: '',
     phone: '',
     company: '',
     address: '',
     notes: '',
   });
 
   const { data: clients, isLoading } = useQuery({
     queryKey: ['clients'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('clients')
         .select('*')
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data as Client[];
     },
   });
 
   const createMutation = useMutation({
     mutationFn: async (data: typeof formData) => {
       const { error } = await supabase.from('clients').insert({
         name: data.name,
         email: data.email || null,
         phone: data.phone || null,
         company: data.company || null,
         address: data.address || null,
         notes: data.notes || null,
       });
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['clients'] });
       setIsDialogOpen(false);
       resetForm();
       toast({ title: 'Client added successfully' });
     },
     onError: (error) => {
       toast({ title: 'Error adding client', description: error.message, variant: 'destructive' });
     },
   });
 
   const updateMutation = useMutation({
     mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
       const { error } = await supabase
         .from('clients')
         .update({
           name: data.name,
           email: data.email || null,
           phone: data.phone || null,
           company: data.company || null,
           address: data.address || null,
           notes: data.notes || null,
         })
         .eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['clients'] });
       setIsDialogOpen(false);
       resetForm();
       toast({ title: 'Client updated successfully' });
     },
     onError: (error) => {
       toast({ title: 'Error updating client', description: error.message, variant: 'destructive' });
     },
   });
 
   const deleteMutation = useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from('clients').delete().eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['clients'] });
       toast({ title: 'Client deleted successfully' });
     },
     onError: (error) => {
       toast({ title: 'Error deleting client', description: error.message, variant: 'destructive' });
     },
   });
 
   const resetForm = () => {
     setFormData({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
     setEditingClient(null);
   };
 
   const handleEdit = (client: Client) => {
     setEditingClient(client);
     setFormData({
       name: client.name,
       email: client.email || '',
       phone: client.phone || '',
       company: client.company || '',
       address: client.address || '',
       notes: client.notes || '',
     });
     setIsDialogOpen(true);
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (editingClient) {
       updateMutation.mutate({ id: editingClient.id, data: formData });
     } else {
       createMutation.mutate(formData);
     }
   };
 
   const filteredClients = clients?.filter(client =>
     client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     client.company?.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
   return (
     <AdminLayout>
       <AdminPageHeader
         title="Clients"
         description="Manage your clients and their information"
         action={
           <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
             <Plus className="mr-2 h-4 w-4" />
             Add Client
           </Button>
         }
       />
 
       <div className="mb-6">
         <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Search clients..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10"
           />
         </div>
       </div>
 
       {isLoading ? (
         <AdminLoadingSkeleton />
       ) : !filteredClients?.length ? (
         <AdminEmptyState
           icon={Users}
           title="No clients found"
           description="Add your first client to get started"
         />
       ) : (
         <div className="border rounded-lg overflow-hidden">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Name</TableHead>
                 <TableHead>Company</TableHead>
                 <TableHead>Contact</TableHead>
                 <TableHead>Added</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredClients.map((client) => (
                 <TableRow key={client.id}>
                   <TableCell className="font-medium">{client.name}</TableCell>
                   <TableCell>{client.company || '-'}</TableCell>
                   <TableCell>
                     <div className="flex flex-col gap-1 text-sm">
                       {client.email && (
                         <span className="flex items-center gap-1 text-muted-foreground">
                           <Mail className="h-3 w-3" /> {client.email}
                         </span>
                       )}
                       {client.phone && (
                         <span className="flex items-center gap-1 text-muted-foreground">
                           <Phone className="h-3 w-3" /> {client.phone}
                         </span>
                       )}
                     </div>
                   </TableCell>
                   <TableCell>{format(new Date(client.created_at), 'MMM dd, yyyy')}</TableCell>
                   <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => {
                           if (confirm('Delete this client?')) {
                             deleteMutation.mutate(client.id);
                           }
                         }}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       )}
 
       <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label>Name *</Label>
               <Input
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 required
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Email</Label>
                 <Input
                   type="email"
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label>Phone</Label>
                 <Input
                   value={formData.phone}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                 />
               </div>
             </div>
             <div className="space-y-2">
               <Label>Company</Label>
               <Input
                 value={formData.company}
                 onChange={(e) => setFormData({ ...formData, company: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <Label>Address</Label>
               <Input
                 value={formData.address}
                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <Label>Notes</Label>
               <Textarea
                 value={formData.notes}
                 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                 rows={3}
               />
             </div>
             <div className="flex justify-end gap-3">
               <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                 Cancel
               </Button>
               <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                 {editingClient ? 'Update' : 'Add'} Client
               </Button>
             </div>
           </form>
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminClients;