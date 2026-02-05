 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Switch } from '@/components/ui/switch';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { toast } from 'sonner';
 import { Shield, Users, Settings } from 'lucide-react';
 
 interface Permission {
   id: string;
   role: 'admin' | 'manager' | 'developer';
   module: string;
   can_view: boolean;
   can_create: boolean;
   can_edit: boolean;
   can_delete: boolean;
 }
 
 const MODULES = [
   { key: 'dashboard', label: 'Dashboard' },
   { key: 'leads', label: 'Leads' },
   { key: 'quotations', label: 'Quotations' },
   { key: 'proposals', label: 'Proposals' },
   { key: 'invoices', label: 'Invoices' },
   { key: 'clients', label: 'Clients' },
   { key: 'payments', label: 'Payments' },
   { key: 'employees', label: 'Employees' },
   { key: 'attendance', label: 'Attendance' },
   { key: 'roles', label: 'Roles & Permissions' },
   { key: 'notes', label: 'Internal Notes' },
   { key: 'products', label: 'Products' },
   { key: 'cms', label: 'CMS / Frontend' },
   { key: 'tasks', label: 'Tasks' },
   { key: 'notifications', label: 'Notifications' },
   { key: 'settings', label: 'Settings' },
 ];
 
 const ROLES: { key: 'admin' | 'manager' | 'developer'; label: string; description: string; color: string }[] = [
   { key: 'admin', label: 'Admin', description: 'Full system access', color: 'bg-red-500' },
   { key: 'manager', label: 'Manager', description: 'Can manage content without delete', color: 'bg-blue-500' },
   { key: 'developer', label: 'Developer', description: 'Read-only access', color: 'bg-green-500' },
 ];
 
 const AdminRoles = () => {
   const queryClient = useQueryClient();
   const [activeRole, setActiveRole] = useState<'admin' | 'manager' | 'developer'>('admin');
 
   const { data: permissions, isLoading } = useQuery({
     queryKey: ['permissions'],
     queryFn: async () => {
       const { data, error } = await supabase.from('permissions').select('*').order('module');
       if (error) throw error;
       return data as Permission[];
     },
   });
 
   const updatePermissionMutation = useMutation({
     mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => {
       const { error } = await supabase.from('permissions').update({ [field]: value }).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['permissions'] });
       toast.success('Permission updated');
     },
     onError: () => toast.error('Failed to update permission'),
   });
 
   const rolePermissions = permissions?.filter((p) => p.role === activeRole);
 
   const getPermissionForModule = (module: string) => rolePermissions?.find((p) => p.module === module);
 
   const handleToggle = (permission: Permission | undefined, field: 'can_view' | 'can_create' | 'can_edit' | 'can_delete', value: boolean) => {
     if (!permission) return;
     if (activeRole === 'admin') {
       toast.error('Admin permissions cannot be modified');
       return;
     }
     updatePermissionMutation.mutate({ id: permission.id, field, value });
   };
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Roles & Permissions" description="Manage user roles and access permissions" />
 
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         {ROLES.map((role) => (
           <Card key={role.key} className={`cursor-pointer transition-all ${activeRole === role.key ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveRole(role.key)}>
             <CardHeader className="pb-2">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${role.key === 'admin' ? 'bg-destructive' : role.key === 'manager' ? 'bg-primary' : 'bg-secondary'}`}><Shield className="h-5 w-5 text-primary-foreground" /></div>
                 <div>
                   <CardTitle className="text-lg">{role.label}</CardTitle>
                   <CardDescription>{role.description}</CardDescription>
                 </div>
               </div>
             </CardHeader>
           </Card>
         ))}
       </div>
 
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Settings className="h-5 w-5" />
             Permission Matrix for {ROLES.find((r) => r.key === activeRole)?.label}
           </CardTitle>
           {activeRole === 'admin' && <CardDescription className="text-amber-600">Admin permissions are locked and cannot be modified</CardDescription>}
         </CardHeader>
         <CardContent>
           {isLoading ? (
             <AdminLoadingSkeleton />
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead className="w-[200px]">Module</TableHead>
                   <TableHead className="text-center">View</TableHead>
                   <TableHead className="text-center">Create</TableHead>
                   <TableHead className="text-center">Edit</TableHead>
                   <TableHead className="text-center">Delete</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {MODULES.map((module) => {
                   const perm = getPermissionForModule(module.key);
                   return (
                     <TableRow key={module.key}>
                       <TableCell className="font-medium">{module.label}</TableCell>
                       <TableCell className="text-center">
                         <Switch checked={perm?.can_view ?? false} onCheckedChange={(v) => handleToggle(perm, 'can_view', v)} disabled={activeRole === 'admin'} />
                       </TableCell>
                       <TableCell className="text-center">
                         <Switch checked={perm?.can_create ?? false} onCheckedChange={(v) => handleToggle(perm, 'can_create', v)} disabled={activeRole === 'admin'} />
                       </TableCell>
                       <TableCell className="text-center">
                         <Switch checked={perm?.can_edit ?? false} onCheckedChange={(v) => handleToggle(perm, 'can_edit', v)} disabled={activeRole === 'admin'} />
                       </TableCell>
                       <TableCell className="text-center">
                         <Switch checked={perm?.can_delete ?? false} onCheckedChange={(v) => handleToggle(perm, 'can_delete', v)} disabled={activeRole === 'admin'} />
                       </TableCell>
                     </TableRow>
                   );
                 })}
               </TableBody>
             </Table>
           )}
         </CardContent>
       </Card>
     </AdminLayout>
   );
 };
 
 export default AdminRoles;