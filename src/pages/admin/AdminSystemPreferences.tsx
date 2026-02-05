 import { useState, useEffect } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Switch } from '@/components/ui/switch';
 import { toast } from 'sonner';
 import { Save, Settings, Bell, Lock, Globe } from 'lucide-react';
 
 const PREFERENCES = [
   { key: 'email_notifications', label: 'Email Notifications', description: 'Send email notifications for important events', icon: Bell },
   { key: 'push_notifications', label: 'Push Notifications', description: 'Enable browser push notifications', icon: Bell },
   { key: 'two_factor_auth', label: 'Two-Factor Authentication', description: 'Require 2FA for admin login', icon: Lock },
   { key: 'auto_logout', label: 'Auto Logout', description: 'Automatically logout after inactivity', icon: Lock },
   { key: 'maintenance_mode', label: 'Maintenance Mode', description: 'Show maintenance page to visitors', icon: Settings },
   { key: 'public_registration', label: 'Public Registration', description: 'Allow public user registration', icon: Globe },
 ];
 
 const AdminSystemPreferences = () => {
   const queryClient = useQueryClient();
 
   const { data: settings, isLoading } = useQuery({
     queryKey: ['system-settings', 'preferences'],
     queryFn: async () => {
       const { data, error } = await supabase.from('system_settings').select('*').eq('category', 'preferences');
       if (error) throw error;
       return data;
     },
   });
 
   const [formData, setFormData] = useState<Record<string, boolean>>({});
 
   useEffect(() => {
     if (settings) {
       const data: Record<string, boolean> = {};
       settings.forEach((s) => { data[s.key] = s.value === 'true'; });
       setFormData(data);
     }
   }, [settings]);
 
   const updateSettingsMutation = useMutation({
     mutationFn: async (data: Record<string, boolean>) => {
       for (const [key, value] of Object.entries(data)) {
         const existing = settings?.find((s) => s.key === key);
         if (existing) {
           const { error } = await supabase.from('system_settings').update({ value: value.toString() }).eq('category', 'preferences').eq('key', key);
           if (error) throw error;
         } else {
           const { error } = await supabase.from('system_settings').insert({ category: 'preferences', key, value: value.toString() });
           if (error) throw error;
         }
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['system-settings', 'preferences'] });
       toast.success('Preferences saved');
     },
     onError: () => toast.error('Failed to save preferences'),
   });
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="System Preferences" description="Configure system behavior and preferences" />
 
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />System Behavior</CardTitle>
           <CardDescription>Toggle system features and behaviors</CardDescription>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             {PREFERENCES.map((pref) => (
               <div key={pref.key} className="flex items-center justify-between p-4 border rounded-lg">
                 <div className="flex items-center gap-3">
                   <pref.icon className="h-5 w-5 text-muted-foreground" />
                   <div>
                     <p className="font-medium">{pref.label}</p>
                     <p className="text-sm text-muted-foreground">{pref.description}</p>
                   </div>
                 </div>
                 <Switch checked={formData[pref.key] || false} onCheckedChange={(v) => setFormData({ ...formData, [pref.key]: v })} />
               </div>
             ))}
           </div>
 
           <div className="flex justify-end mt-6">
             <Button onClick={() => updateSettingsMutation.mutate(formData)} disabled={updateSettingsMutation.isPending}>
               <Save className="h-4 w-4 mr-2" />Save Preferences
             </Button>
           </div>
         </CardContent>
       </Card>
     </AdminLayout>
   );
 };
 
 export default AdminSystemPreferences;