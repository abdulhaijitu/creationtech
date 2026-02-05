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
 import { Badge } from '@/components/ui/badge';
 import { toast } from 'sonner';
 import { Save, CreditCard, TestTube } from 'lucide-react';
 
 const GATEWAYS = [
   { id: 'bkash', name: 'bKash', description: 'Mobile financial service' },
   { id: 'nagad', name: 'Nagad', description: 'Digital payment service' },
   { id: 'sslcommerz', name: 'SSLCommerz', description: 'Payment gateway for Bangladesh' },
   { id: 'stripe', name: 'Stripe', description: 'International payment gateway' },
 ];
 
 const AdminPaymentGateway = () => {
   const queryClient = useQueryClient();
 
   const { data: settings, isLoading } = useQuery({
     queryKey: ['system-settings', 'payment'],
     queryFn: async () => {
       const { data, error } = await supabase.from('system_settings').select('*').eq('category', 'payment');
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
           const { error } = await supabase.from('system_settings').update({ value }).eq('category', 'payment').eq('key', key);
           if (error) throw error;
         } else {
           const { error } = await supabase.from('system_settings').insert({ category: 'payment', key, value });
           if (error) throw error;
         }
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['system-settings', 'payment'] });
       toast.success('Payment settings saved');
     },
     onError: () => toast.error('Failed to save settings'),
   });
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Payment Gateway" description="Configure payment gateway settings" />
 
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Gateway Configuration</CardTitle>
             <CardDescription>Enable and configure payment gateways</CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
             <div className="flex items-center justify-between p-4 border rounded-lg">
               <div className="flex items-center gap-3">
                 <TestTube className="h-5 w-5 text-muted-foreground" />
                 <div>
                   <p className="font-medium">Test Mode</p>
                   <p className="text-sm text-muted-foreground">Enable test mode for development</p>
                 </div>
               </div>
               <Switch checked={formData.test_mode === 'true'} onCheckedChange={(v) => setFormData({ ...formData, test_mode: v.toString() })} />
             </div>
 
             <div className="flex items-center justify-between p-4 border rounded-lg">
               <div>
                 <p className="font-medium">Enable Payment Gateway</p>
                 <p className="text-sm text-muted-foreground">Accept payments through configured gateways</p>
               </div>
               <Switch checked={formData.gateway_enabled === 'true'} onCheckedChange={(v) => setFormData({ ...formData, gateway_enabled: v.toString() })} />
             </div>
 
             <div>
               <Label>Default Gateway</Label>
               <Select value={formData.default_gateway || ''} onValueChange={(v) => setFormData({ ...formData, default_gateway: v })}>
                 <SelectTrigger><SelectValue placeholder="Select default gateway" /></SelectTrigger>
                 <SelectContent>
                   {GATEWAYS.map((g) => (
                     <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader><CardTitle>Available Gateways</CardTitle></CardHeader>
           <CardContent>
             <div className="grid gap-4">
               {GATEWAYS.map((gateway) => (
                 <div key={gateway.id} className="flex items-center justify-between p-4 border rounded-lg">
                   <div>
                     <div className="flex items-center gap-2">
                       <p className="font-medium">{gateway.name}</p>
                       {formData.default_gateway === gateway.id && <Badge variant="secondary">Default</Badge>}
                     </div>
                     <p className="text-sm text-muted-foreground">{gateway.description}</p>
                   </div>
                   <Switch checked={formData[`${gateway.id}_enabled`] === 'true'} onCheckedChange={(v) => setFormData({ ...formData, [`${gateway.id}_enabled`]: v.toString() })} />
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
 
         <div className="flex justify-end">
           <Button onClick={() => updateSettingsMutation.mutate(formData)} disabled={updateSettingsMutation.isPending}>
             <Save className="h-4 w-4 mr-2" />Save Settings
           </Button>
         </div>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminPaymentGateway;