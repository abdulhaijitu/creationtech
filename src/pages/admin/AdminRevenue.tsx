 import { useState } from 'react';
 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Button } from '@/components/ui/button';
 import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
 import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, eachMonthOfInterval } from 'date-fns';
 import { DollarSign, TrendingUp, Calendar, Download, FileText } from 'lucide-react';
 import { toast } from 'sonner';
 
 const AdminRevenue = () => {
   const [chartType, setChartType] = useState<'monthly' | 'yearly'>('monthly');
   const [year, setYear] = useState(new Date().getFullYear().toString());
 
   const { data: invoices } = useQuery({
     queryKey: ['revenue-invoices'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('invoices')
         .select('id, total, paid_amount, status, issue_date, paid_at')
         .in('status', ['paid', 'sent', 'overdue']);
       if (error) throw error;
       return data;
     },
   });
 
   const today = new Date();
   const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
   const startOfThisMonth = startOfMonth(today);
   const endOfThisMonth = endOfMonth(today);
   const startOfThisYear = startOfYear(today);
   const endOfThisYear = endOfYear(today);
 
   const todayRevenue = invoices?.filter((inv) => inv.paid_at && new Date(inv.paid_at) >= startOfToday).reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
   const monthRevenue = invoices?.filter((inv) => inv.paid_at && new Date(inv.paid_at) >= startOfThisMonth && new Date(inv.paid_at) <= endOfThisMonth).reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
   const yearRevenue = invoices?.filter((inv) => inv.paid_at && new Date(inv.paid_at) >= startOfThisYear && new Date(inv.paid_at) <= endOfThisYear).reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
 
   const getMonthlyData = () => {
     const months = eachMonthOfInterval({ start: new Date(parseInt(year), 0, 1), end: new Date(parseInt(year), 11, 31) });
     return months.map((month) => {
       const monthStart = startOfMonth(month);
       const monthEnd = endOfMonth(month);
       const revenue = invoices?.filter((inv) => inv.paid_at && new Date(inv.paid_at) >= monthStart && new Date(inv.paid_at) <= monthEnd).reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
       return { name: format(month, 'MMM'), revenue };
     });
   };
 
   const getYearlyData = () => {
     const years = [2022, 2023, 2024, 2025, 2026];
     return years.map((y) => {
       const yearStart = startOfYear(new Date(y, 0, 1));
       const yearEnd = endOfYear(new Date(y, 0, 1));
       const revenue = invoices?.filter((inv) => inv.paid_at && new Date(inv.paid_at) >= yearStart && new Date(inv.paid_at) <= yearEnd).reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
       return { name: y.toString(), revenue };
     });
   };
 
   const chartData = chartType === 'monthly' ? getMonthlyData() : getYearlyData();
 
   const exportCSV = () => {
     const headers = ['Invoice ID', 'Amount', 'Paid Amount', 'Status', 'Issue Date', 'Paid Date'];
     const rows = invoices?.map((inv) => [inv.id, inv.total, inv.paid_amount || 0, inv.status, inv.issue_date, inv.paid_at || '']) || [];
     const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
     const blob = new Blob([csv], { type: 'text/csv' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `revenue-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
     a.click();
     toast.success('CSV exported successfully');
   };
 
   return (
     <AdminLayout>
       <AdminPageHeader title="Revenue Report" description="View revenue analytics and reports" />
 
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
             <Calendar className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">৳{todayRevenue.toLocaleString()}</div>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">৳{monthRevenue.toLocaleString()}</div>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">This Year</CardTitle>
             <DollarSign className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">৳{yearRevenue.toLocaleString()}</div>
           </CardContent>
         </Card>
       </div>
 
       <Card className="mb-6">
         <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <CardTitle>Revenue Chart</CardTitle>
           <div className="flex gap-2">
             <Select value={chartType} onValueChange={(v: 'monthly' | 'yearly') => setChartType(v)}>
               <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="monthly">Monthly</SelectItem>
                 <SelectItem value="yearly">Yearly</SelectItem>
               </SelectContent>
             </Select>
             {chartType === 'monthly' && (
               <Select value={year} onValueChange={setYear}>
                 <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                 <SelectContent>
                   {[2024, 2025, 2026].map((y) => (
                     <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             )}
           </div>
         </CardHeader>
         <CardContent>
           <ResponsiveContainer width="100%" height={350}>
             {chartType === 'monthly' ? (
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                 <XAxis dataKey="name" className="text-xs" />
                 <YAxis className="text-xs" tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                 <Tooltip formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']} />
                 <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
               </BarChart>
             ) : (
               <LineChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                 <XAxis dataKey="name" className="text-xs" />
                 <YAxis className="text-xs" tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                 <Tooltip formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']} />
                 <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
               </LineChart>
             )}
           </ResponsiveContainer>
         </CardContent>
       </Card>
 
       <div className="flex gap-2">
         <Button onClick={exportCSV} variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
         <Button variant="outline" disabled><FileText className="h-4 w-4 mr-2" />Export PDF (Coming Soon)</Button>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminRevenue;