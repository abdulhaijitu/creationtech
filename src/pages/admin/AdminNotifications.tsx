 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { toast } from 'sonner';
 import { format } from 'date-fns';
 import { Bell, BellRing, Check, CheckCheck, Mail, CreditCard, UserPlus, FileText } from 'lucide-react';
 
 interface Notification {
   id: string;
   user_id: string | null;
   title: string;
   message: string | null;
   type: string;
   is_read: boolean;
   action_url: string | null;
   entity_type: string | null;
   created_at: string;
 }
 
 const AdminNotifications = () => {
   const queryClient = useQueryClient();
   const [activeTab, setActiveTab] = useState('all');
 
   const { data: notifications, isLoading } = useQuery({
     queryKey: ['notifications'],
     queryFn: async () => {
       const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
       if (error) throw error;
       return data as Notification[];
     },
   });
 
   const markReadMutation = useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
   });
 
   const markAllReadMutation = useMutation({
     mutationFn: async () => {
       const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['notifications'] });
       toast.success('All notifications marked as read');
     },
   });
 
   const getIcon = (type: string) => {
     switch (type) {
       case 'lead': return <UserPlus className="h-4 w-4" />;
       case 'payment': return <CreditCard className="h-4 w-4" />;
       case 'task': return <FileText className="h-4 w-4" />;
       default: return <Bell className="h-4 w-4" />;
     }
   };
 
   const getTypeColor = (type: string) => {
     switch (type) {
       case 'success': return 'bg-green-500/10 text-green-600';
       case 'warning': return 'bg-yellow-500/10 text-yellow-600';
       case 'error': return 'bg-red-500/10 text-red-600';
       default: return 'bg-blue-500/10 text-blue-600';
     }
   };
 
   const filteredNotifications = notifications?.filter((n) => {
     if (activeTab === 'unread') return !n.is_read;
     if (activeTab === 'read') return n.is_read;
     return true;
   });
 
   const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
 
   return (
     <AdminLayout>
       <AdminPageHeader
         title="Notifications"
         description="View and manage notifications"
         action={
           unreadCount > 0 ? (
             <Button variant="outline" onClick={() => markAllReadMutation.mutate()}>
               <CheckCheck className="h-4 w-4 mr-2" />Mark All Read
             </Button>
           ) : null
         }
       />
 
       <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
         <TabsList>
           <TabsTrigger value="all">All</TabsTrigger>
           <TabsTrigger value="unread">
             Unread {unreadCount > 0 && <Badge className="ml-1" variant="secondary">{unreadCount}</Badge>}
           </TabsTrigger>
           <TabsTrigger value="read">Read</TabsTrigger>
         </TabsList>
       </Tabs>
 
       {isLoading ? (
         <AdminLoadingSkeleton />
       ) : !filteredNotifications?.length ? (
         <AdminEmptyState icon={BellRing} title="No notifications" description="You're all caught up!" />
       ) : (
         <div className="space-y-3">
           {filteredNotifications.map((notification) => (
             <Card key={notification.id} className={`transition-colors ${!notification.is_read ? 'border-l-4 border-l-primary bg-muted/30' : ''}`}>
               <CardContent className="flex items-start gap-4 py-4">
                 <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                   {getIcon(notification.entity_type || notification.type)}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-start justify-between gap-2">
                     <div>
                       <h4 className={`font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</h4>
                       {notification.message && <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>}
                     </div>
                     <span className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(notification.created_at), 'dd MMM, HH:mm')}</span>
                   </div>
                 </div>
                 {!notification.is_read && (
                   <Button variant="ghost" size="sm" onClick={() => markReadMutation.mutate(notification.id)}>
                     <Check className="h-4 w-4" />
                   </Button>
                 )}
               </CardContent>
             </Card>
           ))}
         </div>
       )}
     </AdminLayout>
   );
 };
 
 export default AdminNotifications;