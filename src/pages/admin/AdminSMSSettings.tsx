 import { useState, useEffect } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Textarea } from '@/components/ui/textarea';
 import { toast } from 'sonner';
 import { Save, MessageSquare, Send } from 'lucide-react';
 
 const SMS_PROVIDERS = [
   { id: 'twilio', name: 'Twilio' },
   { id: 'ssl_wireless', name: 'SSL Wireless' },
   { id: 'banglalink', name: 'Banglalink SMS' },
   { id: 'grameenphone', name: 'Grameenphone SMS' },
 ];
 
 const SMS_EVENTS = [
   { id: 'new_lead', label: 'New Lead Notification' },
   { id: 'payment_received', label: 'Payment Received' },
   { id: 'invoice_sent', label: 'Invoice Sent' },
   { id: 'task_assigned', label: 'Task Assigned' },
 ];
 
 const AdminSMSSettings = () => {
   const queryClient = useQueryClient();
 
   const { data: settings, isLoading } = useQuery({
     queryKey: ['system-settings', 'sms'],
     queryFn: async () => {
       const { data, error } = await supabase.from('system_settings').select('*').eq('category', 'sms');
       if (error) throw error;
       return data;
     },
   });
 
   const [formData, setFormData] = useState<Record<string, string>>({});
 
   useEffect(() => {
     if (settings) {
       const data: Record<string, string> = {};
       settings.forEach((s) => { data[s.key] = s.value || ''; });
       setFormData(data);
     }
   }, [settings]);
 
   const updateSettingsMutation = useMutation({
     mutationFn: async (data: Record<string, string>) => {
       for (const [key, value] of Object.entries(data)) {
         const existing = settings?.find((s) => s.key === key);
         if (existing) {
           const { error } = await supabase.from('system_settings').update({ value }).eq('category', 'sms').eq('key', key);
           if (error) throw error;
         } else {
           const { error } = await supabase.from('system_settings').insert({ category: 'sms', key, value });
           if (error) throw error;
         }
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['system-settings', 'sms'] });
       toast.success('SMS settings saved');
     },
     onError: () => toast.error('Failed to save settings'),
   });
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="SMS Settings" description="Configure SMS gateway and templates" />
 
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />SMS Configuration</CardTitle>
             <CardDescription>Configure your SMS provider settings</CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
             <div className="flex items-center justify-between p-4 border rounded-lg">
               <div>
                 <p className="font-medium">Enable SMS</p>
                 <p className="text-sm text-muted-foreground">Send SMS notifications</p>
               </div>
               <Switch checked={formData.enabled === 'true'} onCheckedChange={(v) => setFormData({ ...formData, enabled: v.toString() })} />
             </div>
 
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <Label>SMS Provider</Label>
                 <Select value={formData.provider || ''} onValueChange={(v) => setFormData({ ...formData, provider: v })}>
                   <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                   <SelectContent>
                     {SMS_PROVIDERS.map((p) => (
                       <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label>Sender ID</Label>
                 <Input value={formData.sender_id || ''} onChange={(e) => setFormData({ ...formData, sender_id: e.target.value })} placeholder="e.g., CreationTech" />
               </div>
             </div>
 
             <div>
               <Label>API Key (stored securely)</Label>
               <Input type="password" value={formData.api_key || ''} onChange={(e) => setFormData({ ...formData, api_key: e.target.value })} placeholder="Enter API key" />
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader><CardTitle>SMS Events</CardTitle><CardDescription>Enable/disable SMS for specific events</CardDescription></CardHeader>
           <CardContent>
             <div className="space-y-4">
               {SMS_EVENTS.map((event) => (
                 <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                   <span>{event.label}</span>
                   <Switch checked={formData[`event_${event.id}`] === 'true'} onCheckedChange={(v) => setFormData({ ...formData, [`event_${event.id}`]: v.toString() })} />
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader><CardTitle>Default Template</CardTitle></CardHeader>
           <CardContent>
             <Textarea value={formData.default_template || ''} onChange={(e) => setFormData({ ...formData, default_template: e.target.value })} rows={4} placeholder="Enter default SMS template. Use {{name}}, {{amount}}, etc. for variables." />
           </CardContent>
         </Card>
 
         <div className="flex justify-end gap-2">
           <Button variant="outline"><Send className="h-4 w-4 mr-2" />Send Test SMS</Button>
           <Button onClick={() => updateSettingsMutation.mutate(formData)} disabled={updateSettingsMutation.isPending}>
             <Save className="h-4 w-4 mr-2" />Save Settings
           </Button>
         </div>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminSMSSettings;