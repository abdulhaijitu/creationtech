 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
 import { Badge } from '@/components/ui/badge';
 import { toast } from 'sonner';
 import { format } from 'date-fns';
 import { CheckSquare, Plus, Edit, Search, Filter, Calendar } from 'lucide-react';
 
 interface Task {
   id: string;
   title: string;
   description: string | null;
   assigned_to: string | null;
   assigned_to_name: string | null;
   due_date: string | null;
   status: string;
   priority: string;
   follow_up_notes: string | null;
   created_at: string;
 }
 
 const AdminTasks = () => {
   const { user } = useAuth();
   const queryClient = useQueryClient();
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [isAddOpen, setIsAddOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
 
   const { data: tasks, isLoading } = useQuery({
     queryKey: ['tasks'],
     queryFn: async () => {
       const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
       if (error) throw error;
       return data as Task[];
     },
   });
 
   const { data: profiles } = useQuery({
     queryKey: ['profiles-for-tasks'],
     queryFn: async () => {
       const { data, error } = await supabase.from('profiles').select('id, full_name, email');
       if (error) throw error;
       return data;
     },
   });
 
   const addTaskMutation = useMutation({
     mutationFn: async (task: Omit<Task, 'id' | 'created_at'>) => {
       const { error } = await supabase.from('tasks').insert({ ...task, created_by: user?.id });
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tasks'] });
       toast.success('Task created');
       setIsAddOpen(false);
     },
     onError: () => toast.error('Failed to create task'),
   });
 
   const updateTaskMutation = useMutation({
     mutationFn: async ({ id, ...updates }: { id: string } & Partial<Task>) => {
       const { error } = await supabase.from('tasks').update(updates).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tasks'] });
       toast.success('Task updated');
       setIsEditOpen(false);
     },
     onError: () => toast.error('Failed to update task'),
   });
 
   const filteredTasks = tasks?.filter((task) => {
     const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
     return matchesSearch && matchesStatus;
   });
 
   const getPriorityColor = (priority: string) => {
     switch (priority) {
       case 'high': return 'destructive';
       case 'medium': return 'default';
       case 'low': return 'secondary';
       default: return 'outline';
     }
   };
 
   const TaskForm = ({ task, onSubmit, isNew = false }: { task?: Task | null; onSubmit: (data: any) => void; isNew?: boolean }) => {
     const [formData, setFormData] = useState({
       title: task?.title || '',
       description: task?.description || '',
       assigned_to: task?.assigned_to || '',
       assigned_to_name: task?.assigned_to_name || '',
       due_date: task?.due_date || '',
       status: task?.status || 'pending',
       priority: task?.priority || 'medium',
       follow_up_notes: task?.follow_up_notes || '',
     });
 
     const handleAssigneeChange = (userId: string) => {
       const profile = profiles?.find((p) => p.id === userId);
       setFormData({ ...formData, assigned_to: userId, assigned_to_name: profile?.full_name || profile?.email || '' });
     };
 
     return (
       <div className="space-y-4">
         <div>
           <Label>Title</Label>
           <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Task title" />
         </div>
         <div>
           <Label>Description</Label>
           <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
         </div>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label>Assigned To</Label>
             <Select value={formData.assigned_to} onValueChange={handleAssigneeChange}>
               <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
               <SelectContent>
                 {profiles?.map((p) => (
                   <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
           <div>
             <Label>Due Date</Label>
             <Input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
           </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label>Status</Label>
             <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="pending">Pending</SelectItem>
                 <SelectItem value="in_progress">In Progress</SelectItem>
                 <SelectItem value="completed">Completed</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div>
             <Label>Priority</Label>
             <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="low">Low</SelectItem>
                 <SelectItem value="medium">Medium</SelectItem>
                 <SelectItem value="high">High</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
         <div>
           <Label>Follow-up Notes</Label>
           <Textarea value={formData.follow_up_notes} onChange={(e) => setFormData({ ...formData, follow_up_notes: e.target.value })} rows={2} />
         </div>
         <DialogFooter>
           <Button onClick={() => onSubmit(formData)}>{isNew ? 'Create Task' : 'Save Changes'}</Button>
         </DialogFooter>
       </div>
     );
   };
 
   return (
     <AdminLayout>
       <AdminPageHeader
         title="Tasks / Follow-ups"
         description="Manage tasks and follow-up items"
         action={<Button onClick={() => setIsAddOpen(true)}><Plus className="h-4 w-4 mr-2" />New Task</Button>}
       />
 
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
         </div>
         <Select value={statusFilter} onValueChange={setStatusFilter}>
           <SelectTrigger className="w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Status</SelectItem>
             <SelectItem value="pending">Pending</SelectItem>
             <SelectItem value="in_progress">In Progress</SelectItem>
             <SelectItem value="completed">Completed</SelectItem>
           </SelectContent>
         </Select>
       </div>
 
       {isLoading ? (
         <AdminLoadingSkeleton />
       ) : !filteredTasks?.length ? (
         <AdminEmptyState icon={CheckSquare} title="No tasks found" description="Create tasks to track work items" />
       ) : (
         <div className="border rounded-lg">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Title</TableHead>
                 <TableHead>Assigned To</TableHead>
                 <TableHead>Due Date</TableHead>
                 <TableHead>Priority</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredTasks.map((task) => (
                 <TableRow key={task.id}>
                   <TableCell className="font-medium">{task.title}</TableCell>
                   <TableCell>{task.assigned_to_name || '-'}</TableCell>
                   <TableCell>
                     {task.due_date ? (
                       <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(task.due_date), 'dd MMM yyyy')}</span>
                     ) : '-'}
                   </TableCell>
                   <TableCell><Badge variant={getPriorityColor(task.priority) as any} className="capitalize">{task.priority}</Badge></TableCell>
                   <TableCell><AdminStatusBadge status={task.status} /></TableCell>
                   <TableCell className="text-right">
                     <Button variant="ghost" size="sm" onClick={() => { setSelectedTask(task); setIsEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       )}
 
       <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
         <DialogContent><DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader><TaskForm isNew onSubmit={(data) => addTaskMutation.mutate(data)} /></DialogContent>
       </Dialog>
 
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
         <DialogContent><DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader><TaskForm task={selectedTask} onSubmit={(data) => updateTaskMutation.mutate({ id: selectedTask!.id, ...data })} /></DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminTasks;