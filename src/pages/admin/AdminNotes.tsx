 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import { useQuery as useProfileQuery } from '@tanstack/react-query';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { toast } from 'sonner';
 import { format } from 'date-fns';
 import { StickyNote, Plus, Edit, Archive, Search, User } from 'lucide-react';
 
 interface Note {
   id: string;
   title: string;
   content: string | null;
   author_id: string | null;
   author_name: string | null;
   visibility: string;
   is_archived: boolean;
   created_at: string;
   updated_at: string;
 }
 
 const AdminNotes = () => {
   const { user } = useAuth();
 
   const { data: profile } = useProfileQuery({
     queryKey: ['user-profile', user?.id],
     queryFn: async () => {
       if (!user?.id) return null;
       const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
       return data;
     },
     enabled: !!user?.id,
   });
   const queryClient = useQueryClient();
   const [searchTerm, setSearchTerm] = useState('');
   const [isAddOpen, setIsAddOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [selectedNote, setSelectedNote] = useState<Note | null>(null);
   const [activeTab, setActiveTab] = useState('active');
 
   const { data: notes, isLoading } = useQuery({
     queryKey: ['internal-notes'],
     queryFn: async () => {
       const { data, error } = await supabase.from('internal_notes').select('*').order('created_at', { ascending: false });
       if (error) throw error;
       return data as Note[];
     },
   });
 
   const addNoteMutation = useMutation({
     mutationFn: async (note: { title: string; content: string; visibility: string }) => {
       const { error } = await supabase.from('internal_notes').insert({
         ...note,
         author_id: user?.id,
         author_name: (profile as any)?.full_name || user?.email,
       });
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['internal-notes'] });
       toast.success('Note created');
       setIsAddOpen(false);
     },
     onError: () => toast.error('Failed to create note'),
   });
 
   const updateNoteMutation = useMutation({
     mutationFn: async ({ id, ...updates }: { id: string; title?: string; content?: string; visibility?: string; is_archived?: boolean }) => {
       const { error } = await supabase.from('internal_notes').update(updates).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['internal-notes'] });
       toast.success('Note updated');
       setIsEditOpen(false);
     },
     onError: () => toast.error('Failed to update note'),
   });
 
   const filteredNotes = notes?.filter((note) => {
     const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content?.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesTab = activeTab === 'active' ? !note.is_archived : note.is_archived;
     return matchesSearch && matchesTab;
   });
 
   const NoteForm = ({ note, onSubmit, isNew = false }: { note?: Note | null; onSubmit: (data: any) => void; isNew?: boolean }) => {
     const [formData, setFormData] = useState({
       title: note?.title || '',
       content: note?.content || '',
       visibility: note?.visibility || 'all',
     });
 
     return (
       <div className="space-y-4">
         <div>
           <Label>Title</Label>
           <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Note title" />
         </div>
         <div>
           <Label>Content</Label>
           <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your note..." rows={6} />
         </div>
         <div>
           <Label>Visibility</Label>
           <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v })}>
             <SelectTrigger><SelectValue /></SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Roles</SelectItem>
               <SelectItem value="admin">Admin Only</SelectItem>
               <SelectItem value="manager">Managers & Admin</SelectItem>
             </SelectContent>
           </Select>
         </div>
         <DialogFooter>
           <Button onClick={() => onSubmit(formData)}>{isNew ? 'Create Note' : 'Save Changes'}</Button>
         </DialogFooter>
       </div>
     );
   };
 
   return (
     <AdminLayout>
       <AdminPageHeader
         title="Internal Notes"
         description="Team notes and internal communications"
         action={<Button onClick={() => setIsAddOpen(true)}><Plus className="h-4 w-4 mr-2" />New Note</Button>}
       />
 
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
         </div>
         <Tabs value={activeTab} onValueChange={setActiveTab}>
           <TabsList>
             <TabsTrigger value="active">Active</TabsTrigger>
             <TabsTrigger value="archived">Archived</TabsTrigger>
           </TabsList>
         </Tabs>
       </div>
 
       {isLoading ? (
         <AdminLoadingSkeleton />
       ) : !filteredNotes?.length ? (
         <AdminEmptyState icon={StickyNote} title="No notes found" description="Create internal notes for your team" />
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {filteredNotes.map((note) => (
             <Card key={note.id} className="flex flex-col">
               <CardHeader className="pb-2">
                 <div className="flex items-start justify-between">
                   <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                   <Badge variant="outline" className="capitalize">{note.visibility}</Badge>
                 </div>
                 <CardDescription className="flex items-center gap-1">
                   <User className="h-3 w-3" />
                   {note.author_name || 'Unknown'} • {format(new Date(note.created_at), 'dd MMM yyyy')}
                 </CardDescription>
               </CardHeader>
               <CardContent className="flex-1">
                 <p className="text-sm text-muted-foreground line-clamp-4">{note.content || 'No content'}</p>
               </CardContent>
               <CardFooter className="pt-0 gap-2">
                 <Button variant="ghost" size="sm" onClick={() => { setSelectedNote(note); setIsEditOpen(true); }}>
                   <Edit className="h-4 w-4 mr-1" />Edit
                 </Button>
                 <Button variant="ghost" size="sm" onClick={() => updateNoteMutation.mutate({ id: note.id, is_archived: !note.is_archived })}>
                   <Archive className="h-4 w-4 mr-1" />{note.is_archived ? 'Restore' : 'Archive'}
                 </Button>
               </CardFooter>
             </Card>
           ))}
         </div>
       )}
 
       <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
         <DialogContent>
           <DialogHeader><DialogTitle>Create Note</DialogTitle></DialogHeader>
           <NoteForm isNew onSubmit={(data) => addNoteMutation.mutate(data)} />
         </DialogContent>
       </Dialog>
 
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
         <DialogContent>
           <DialogHeader><DialogTitle>Edit Note</DialogTitle></DialogHeader>
           <NoteForm note={selectedNote} onSubmit={(data) => updateNoteMutation.mutate({ id: selectedNote!.id, ...data })} />
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminNotes;