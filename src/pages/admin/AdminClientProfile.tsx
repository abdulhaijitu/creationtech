 import { useState } from 'react';
 import { useParams, useNavigate, Link } from 'react-router-dom';
 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { format } from 'date-fns';
 import { 
   ArrowLeft, User, Mail, Phone, Building, MapPin, FileText, 
   Receipt, CreditCard, StickyNote, Calendar
 } from 'lucide-react';
 
 const AdminClientProfile = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('overview');
 
   // Fetch client details
   const { data: client, isLoading: clientLoading } = useQuery({
     queryKey: ['client', id],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('clients')
         .select('*')
         .eq('id', id)
         .single();
       if (error) throw error;
       return data;
     },
     enabled: !!id,
   });
 
   // Fetch related invoices
   const { data: invoices } = useQuery({
     queryKey: ['client-invoices', id],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('invoices')
         .select('*')
         .eq('client_id', id)
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data;
     },
     enabled: !!id,
   });
 
   // Fetch related quotations
   const { data: quotations } = useQuery({
     queryKey: ['client-quotations', id],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('quotations')
         .select('*')
         .eq('client_id', id)
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data;
     },
     enabled: !!id,
   });
 
   // Fetch related payments
   const { data: payments } = useQuery({
     queryKey: ['client-payments', id],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('payments')
         .select('*, invoices:invoice_id(invoice_number)')
         .eq('client_id', id)
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data;
     },
     enabled: !!id,
   });
 
   // Fetch related proposals
   const { data: proposals } = useQuery({
     queryKey: ['client-proposals', id],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('proposals')
         .select('*')
         .eq('client_id', id)
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data;
     },
     enabled: !!id,
   });
 
   if (clientLoading) {
     return (
       <AdminLayout>
         <AdminLoadingSkeleton />
       </AdminLayout>
     );
   }
 
   if (!client) {
     return (
       <AdminLayout>
         <AdminEmptyState
           icon={User}
           title="Client not found"
           description="The client you're looking for doesn't exist or has been deleted."
         />
         <div className="mt-4">
           <Button onClick={() => navigate('/admin/clients')}>
             <ArrowLeft className="h-4 w-4 mr-2" />
             Back to Clients
           </Button>
         </div>
       </AdminLayout>
     );
   }
 
   const totalInvoiced = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
   const totalPaid = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
   const outstandingBalance = totalInvoiced - totalPaid;
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         {/* Header with back button */}
         <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
             <ArrowLeft className="h-4 w-4" />
           </Button>
           <AdminPageHeader
             title={client.name}
             description={client.company || 'Client Profile'}
           />
         </div>
 
         {/* Client Info Cards */}
         <div className="grid gap-4 md:grid-cols-4">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-2xl font-bold">৳{totalInvoiced.toLocaleString()}</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
             </CardHeader>
             <CardContent>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">৳{totalPaid.toLocaleString()}</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
             </CardHeader>
             <CardContent>
               <p className={`text-2xl font-bold ${outstandingBalance > 0 ? 'text-orange-600' : ''}`}>
                 ৳{outstandingBalance.toLocaleString()}
               </p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-2xl font-bold">
                 {(invoices?.length || 0) + (quotations?.length || 0) + (proposals?.length || 0)}
               </p>
             </CardContent>
           </Card>
         </div>
 
         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
           <TabsList className="grid w-full grid-cols-5">
             <TabsTrigger value="overview">Overview</TabsTrigger>
             <TabsTrigger value="invoices">Invoices ({invoices?.length || 0})</TabsTrigger>
             <TabsTrigger value="quotations">Quotations ({quotations?.length || 0})</TabsTrigger>
             <TabsTrigger value="payments">Payments ({payments?.length || 0})</TabsTrigger>
             <TabsTrigger value="proposals">Proposals ({proposals?.length || 0})</TabsTrigger>
           </TabsList>
 
           {/* Overview Tab */}
           <TabsContent value="overview" className="mt-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <User className="h-5 w-5" />
                   Client Information
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid gap-4 md:grid-cols-2">
                   <div className="flex items-center gap-3">
                     <Mail className="h-4 w-4 text-muted-foreground" />
                     <div>
                       <p className="text-sm text-muted-foreground">Email</p>
                       <p className="font-medium">{client.email || 'Not provided'}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Phone className="h-4 w-4 text-muted-foreground" />
                     <div>
                       <p className="text-sm text-muted-foreground">Phone</p>
                       <p className="font-medium">{client.phone || 'Not provided'}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Building className="h-4 w-4 text-muted-foreground" />
                     <div>
                       <p className="text-sm text-muted-foreground">Company</p>
                       <p className="font-medium">{client.company || 'Not provided'}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <MapPin className="h-4 w-4 text-muted-foreground" />
                     <div>
                       <p className="text-sm text-muted-foreground">Address</p>
                       <p className="font-medium">{client.address || 'Not provided'}</p>
                     </div>
                   </div>
                 </div>
                 {client.notes && (
                   <div className="pt-4 border-t">
                     <div className="flex items-center gap-2 mb-2">
                       <StickyNote className="h-4 w-4 text-muted-foreground" />
                       <p className="text-sm text-muted-foreground">Notes</p>
                     </div>
                     <p>{client.notes}</p>
                   </div>
                 )}
                 <div className="pt-4 border-t">
                   <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-muted-foreground" />
                     <p className="text-sm text-muted-foreground">
                       Client since {format(new Date(client.created_at), 'MMMM dd, yyyy')}
                     </p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           {/* Invoices Tab */}
           <TabsContent value="invoices" className="mt-6">
             {!invoices?.length ? (
               <AdminEmptyState icon={FileText} title="No invoices" description="No invoices for this client yet." />
             ) : (
               <Card>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Invoice #</TableHead>
                       <TableHead>Date</TableHead>
                       <TableHead>Due Date</TableHead>
                       <TableHead>Total</TableHead>
                       <TableHead>Status</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {invoices.map((invoice) => (
                       <TableRow key={invoice.id}>
                         <TableCell>
                           <Link 
                             to={`/admin/invoices?id=${invoice.id}`}
                             className="font-medium text-primary hover:underline"
                           >
                             {invoice.invoice_number}
                           </Link>
                         </TableCell>
                         <TableCell>{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</TableCell>
                         <TableCell>{invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : '-'}</TableCell>
                         <TableCell className="font-medium">৳{Number(invoice.total).toLocaleString()}</TableCell>
                         <TableCell><AdminStatusBadge status={invoice.status} /></TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </Card>
             )}
           </TabsContent>
 
           {/* Quotations Tab */}
           <TabsContent value="quotations" className="mt-6">
             {!quotations?.length ? (
               <AdminEmptyState icon={Receipt} title="No quotations" description="No quotations for this client yet." />
             ) : (
               <Card>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Quotation #</TableHead>
                       <TableHead>Date</TableHead>
                       <TableHead>Valid Until</TableHead>
                       <TableHead>Total</TableHead>
                       <TableHead>Status</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {quotations.map((quotation) => (
                       <TableRow key={quotation.id}>
                         <TableCell className="font-medium">{quotation.quotation_number}</TableCell>
                         <TableCell>{format(new Date(quotation.issue_date), 'MMM dd, yyyy')}</TableCell>
                         <TableCell>{quotation.valid_until ? format(new Date(quotation.valid_until), 'MMM dd, yyyy') : '-'}</TableCell>
                         <TableCell className="font-medium">৳{Number(quotation.total).toLocaleString()}</TableCell>
                         <TableCell><AdminStatusBadge status={quotation.status} /></TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </Card>
             )}
           </TabsContent>
 
           {/* Payments Tab */}
           <TabsContent value="payments" className="mt-6">
             {!payments?.length ? (
               <AdminEmptyState icon={CreditCard} title="No payments" description="No payments recorded for this client yet." />
             ) : (
               <Card>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Invoice</TableHead>
                       <TableHead>Amount</TableHead>
                       <TableHead>Method</TableHead>
                       <TableHead>Date</TableHead>
                       <TableHead>Status</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {payments.map((payment) => (
                       <TableRow key={payment.id}>
                         <TableCell className="font-medium">
                           {payment.invoices?.invoice_number || '-'}
                         </TableCell>
                         <TableCell className="font-medium">৳{Number(payment.amount).toLocaleString()}</TableCell>
                         <TableCell className="capitalize">{payment.payment_method}</TableCell>
                         <TableCell>{format(new Date(payment.created_at), 'MMM dd, yyyy')}</TableCell>
                         <TableCell><AdminStatusBadge status={payment.status} /></TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </Card>
             )}
           </TabsContent>
 
           {/* Proposals Tab */}
           <TabsContent value="proposals" className="mt-6">
             {!proposals?.length ? (
               <AdminEmptyState icon={FileText} title="No proposals" description="No proposals for this client yet." />
             ) : (
               <Card>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Proposal #</TableHead>
                       <TableHead>Title</TableHead>
                       <TableHead>Amount</TableHead>
                       <TableHead>Date</TableHead>
                       <TableHead>Status</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {proposals.map((proposal) => (
                       <TableRow key={proposal.id}>
                         <TableCell className="font-medium">{proposal.proposal_number}</TableCell>
                         <TableCell>{proposal.title}</TableCell>
                         <TableCell className="font-medium">৳{Number(proposal.total_amount || 0).toLocaleString()}</TableCell>
                         <TableCell>{format(new Date(proposal.created_at), 'MMM dd, yyyy')}</TableCell>
                         <TableCell><AdminStatusBadge status={proposal.status} /></TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </Card>
             )}
           </TabsContent>
         </Tabs>
       </div>
     </AdminLayout>
   );
 };
 
 export default AdminClientProfile;