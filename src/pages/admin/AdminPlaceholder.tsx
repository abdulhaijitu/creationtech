 import AdminLayout from '@/components/admin/AdminLayout';
 import { Card, CardContent } from '@/components/ui/card';
 import { Construction } from 'lucide-react';
 
 interface AdminPlaceholderProps {
   title: string;
   description?: string;
 }
 
 const AdminPlaceholder = ({ title, description }: AdminPlaceholderProps) => {
   return (
     <AdminLayout>
       <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold">{title}</h1>
           {description && <p className="text-muted-foreground">{description}</p>}
         </div>
         <Card>
           <CardContent className="py-16 text-center">
             <div className="flex flex-col items-center gap-4">
               <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                 <Construction className="h-8 w-8 text-muted-foreground" />
               </div>
               <div>
                 <h3 className="text-lg font-medium">Coming Soon</h3>
                 <p className="text-muted-foreground mt-1">
                   This feature is under development and will be available soon.
                 </p>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminPlaceholder;