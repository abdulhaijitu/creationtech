 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { toast } from 'sonner';
 import { Save, Building2, Users, TrendingUp, Award } from 'lucide-react';
 
 const TRUST_NUMBERS = [
   { key: 'clients_count', label: 'Clients Count', icon: Users },
   { key: 'projects_count', label: 'Projects Completed', icon: TrendingUp },
   { key: 'years_experience', label: 'Years of Experience', icon: Award },
   { key: 'team_members', label: 'Team Members', icon: Users },
 ];
 
 const AdminCMSCompanies = () => {
   const queryClient = useQueryClient();
 
   const { data: businessInfo, isLoading } = useQuery({
     queryKey: ['business-info-cms'],
     queryFn: async () => {
       const { data, error } = await supabase.from('business_info').select('*');
       if (error) throw error;
       return data;
     },
   });
 
   const [formData, setFormData] = useState<Record<string, string>>({});
 
   // Initialize form data when businessInfo loads
   if (businessInfo && Object.keys(formData).length === 0) {
     const data: Record<string, string> = {};
     businessInfo.forEach((info) => { data[info.key] = info.value_en || ''; });
     if (Object.keys(data).length > 0) setFormData(data);
   }
 
   const updateMutation = useMutation({
     mutationFn: async (data: Record<string, string>) => {
       for (const [key, value] of Object.entries(data)) {
         const existing = businessInfo?.find((b) => b.key === key);
         if (existing) {
           const { error } = await supabase.from('business_info').update({ value_en: value }).eq('key', key);
           if (error) throw error;
         } else {
           const { error } = await supabase.from('business_info').insert({ key, value_en: value });
           if (error) throw error;
         }
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['business-info-cms'] });
       toast.success('Trust numbers updated');
     },
     onError: () => toast.error('Failed to update'),
   });
 
   if (isLoading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Companies Page" description="Manage partner logos and trust numbers" />
 
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Trust Numbers</CardTitle>
             <CardDescription>Statistics displayed on the homepage and about page</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {TRUST_NUMBERS.map((item) => (
                 <div key={item.key} className="flex items-center gap-4 p-4 border rounded-lg">
                   <div className="p-3 rounded-lg bg-primary/10">
                     <item.icon className="h-5 w-5 text-primary" />
                   </div>
                   <div className="flex-1">
                     <Label>{item.label}</Label>
                     <Input
                       type="number"
                       value={formData[item.key] || ''}
                       onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                       placeholder="0"
                     />
                   </div>
                 </div>
               ))}
             </div>
             <div className="flex justify-end mt-6">
               <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isPending}>
                 <Save className="h-4 w-4 mr-2" />Save Trust Numbers
               </Button>
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Partner Logos</CardTitle>
             <CardDescription>Manage client and partner logos displayed on the website</CardDescription>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground">Partner logos are currently managed through file uploads. Contact support for logo management.</p>
           </CardContent>
         </Card>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminCMSCompanies;