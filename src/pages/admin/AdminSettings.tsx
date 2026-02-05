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
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { toast } from 'sonner';
 import { Save, Building } from 'lucide-react';
 
 interface SystemSetting {
   id: string;
   category: string;
   key: string;
   value: string | null;
 }
 
 const AdminSettings = () => {
   const queryClient = useQueryClient();
 
   const { data: settings, isLoading } = useQuery({
     queryKey: ['system-settings', 'general'],
     queryFn: async () => {
       const { data, error } = await supabase.from('system_settings').select('*').eq('category', 'general');
       if (error) throw error;
       return data as SystemSetting[];
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
         const { error } = await supabase.from('system_settings').update({ value }).eq('category', 'general').eq('key', key);
         if (error) throw error;
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['system-settings'] });
       toast.success('Settings saved successfully');
     },
     onError: () => toast.error('Failed to save settings'),
   });
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="General Settings" description="Configure general system settings" />
 
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Company Information</CardTitle>
           <CardDescription>Basic company and system configuration</CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <Label>Company Name</Label>
               <Input value={formData.company_name || ''} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
             </div>
             <div>
               <Label>Timezone</Label>
               <Select value={formData.timezone || 'Asia/Dhaka'} onValueChange={(v) => setFormData({ ...formData, timezone: v })}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="Asia/Dhaka">Asia/Dhaka (UTC+6)</SelectItem>
                   <SelectItem value="UTC">UTC</SelectItem>
                   <SelectItem value="America/New_York">America/New York</SelectItem>
                   <SelectItem value="Europe/London">Europe/London</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div>
               <Label>Currency</Label>
               <Select value={formData.currency || 'BDT'} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="BDT">BDT (৳)</SelectItem>
                   <SelectItem value="USD">USD ($)</SelectItem>
                   <SelectItem value="EUR">EUR (€)</SelectItem>
                   <SelectItem value="GBP">GBP (£)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div>
               <Label>Date Format</Label>
               <Select value={formData.date_format || 'DD/MM/YYYY'} onValueChange={(v) => setFormData({ ...formData, date_format: v })}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                   <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                   <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div>
               <Label>Default Language</Label>
               <Select value={formData.language_default || 'en'} onValueChange={(v) => setFormData({ ...formData, language_default: v })}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="en">English</SelectItem>
                   <SelectItem value="bn">Bangla (বাংলা)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           <div className="flex justify-end pt-4">
             <Button onClick={() => updateSettingsMutation.mutate(formData)} disabled={updateSettingsMutation.isPending}>
               <Save className="h-4 w-4 mr-2" />Save Settings
             </Button>
           </div>
         </CardContent>
       </Card>
     </AdminLayout>
   );
 };
 
 export default AdminSettings;