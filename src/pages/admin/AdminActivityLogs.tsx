 import { useState } from 'react';
 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Input } from '@/components/ui/input';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Badge } from '@/components/ui/badge';
 import { format } from 'date-fns';
 import { Activity, Search, Filter, User, Settings, FileText, CreditCard, Users } from 'lucide-react';
 
 interface ActivityLog {
   id: string;
   user_id: string | null;
   user_email: string | null;
   action: string;
   entity_type: string;
   entity_id: string | null;
   details: any;
   created_at: string;
 }
 
 const MODULES = [
   { key: 'all', label: 'All Modules' },
   { key: 'invoice', label: 'Invoices' },
   { key: 'quotation', label: 'Quotations' },
   { key: 'proposal', label: 'Proposals' },
   { key: 'client', label: 'Clients' },
   { key: 'employee', label: 'Employees' },
   { key: 'settings', label: 'Settings' },
   { key: 'auth', label: 'Authentication' },
 ];
 
 const AdminActivityLogs = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [moduleFilter, setModuleFilter] = useState('all');
 
   const { data: logs, isLoading } = useQuery({
     queryKey: ['activity-logs'],
     queryFn: async () => {
       const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100);
       if (error) throw error;
       return data as ActivityLog[];
     },
   });
 
   const filteredLogs = logs?.filter((log) => {
     const matchesSearch = log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase()) || log.entity_type.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesModule = moduleFilter === 'all' || log.entity_type.toLowerCase().includes(moduleFilter);
     return matchesSearch && matchesModule;
   });
 
   const getActionColor = (action: string) => {
     if (action.includes('create') || action.includes('add')) return 'bg-green-500/10 text-green-600';
     if (action.includes('update') || action.includes('edit')) return 'bg-blue-500/10 text-blue-600';
     if (action.includes('delete') || action.includes('remove')) return 'bg-red-500/10 text-red-600';
     if (action.includes('login') || action.includes('logout')) return 'bg-purple-500/10 text-purple-600';
     return 'bg-muted text-muted-foreground';
   };
 
   const getEntityIcon = (entityType: string) => {
     switch (entityType.toLowerCase()) {
       case 'invoice': return <CreditCard className="h-4 w-4" />;
       case 'client': return <Users className="h-4 w-4" />;
       case 'settings': return <Settings className="h-4 w-4" />;
       case 'auth': return <User className="h-4 w-4" />;
       default: return <FileText className="h-4 w-4" />;
     }
   };
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Activity Logs" description="Track important system actions" />
 
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search by user, action, or module..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
         </div>
         <Select value={moduleFilter} onValueChange={setModuleFilter}>
           <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter by module" /></SelectTrigger>
           <SelectContent>
             {MODULES.map((m) => (
               <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
             ))}
           </SelectContent>
         </Select>
       </div>
 
       {isLoading ? (
         <AdminLoadingSkeleton />
       ) : !filteredLogs?.length ? (
         <AdminEmptyState icon={Activity} title="No activity logs" description="System activity will appear here" />
       ) : (
         <div className="border rounded-lg">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>User</TableHead>
                 <TableHead>Action</TableHead>
                 <TableHead>Module</TableHead>
                 <TableHead>Entity ID</TableHead>
                 <TableHead>Timestamp</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredLogs.map((log) => (
                 <TableRow key={log.id}>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <User className="h-4 w-4 text-muted-foreground" />
                       <span className="text-sm">{log.user_email || 'System'}</span>
                     </div>
                   </TableCell>
                   <TableCell>
                     <Badge className={`${getActionColor(log.action)} capitalize`}>{log.action.replace(/_/g, ' ')}</Badge>
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       {getEntityIcon(log.entity_type)}
                       <span className="capitalize">{log.entity_type}</span>
                     </div>
                   </TableCell>
                   <TableCell className="font-mono text-xs">{log.entity_id ? log.entity_id.slice(0, 8) + '...' : '-'}</TableCell>
                   <TableCell className="text-muted-foreground">{format(new Date(log.created_at), 'dd MMM yyyy, HH:mm')}</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       )}
     </AdminLayout>
   );
 };
 
 export default AdminActivityLogs;