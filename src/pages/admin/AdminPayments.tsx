 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { toast } from 'sonner';
 import { format } from 'date-fns';
 import { CreditCard, Search, Filter, Eye, Plus, Edit } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import ClientLink from '@/components/admin/ClientLink';
 
 interface Payment {
   id: string;
   invoice_id: string | null;
   client_id: string | null;
   amount: number;
   payment_method: string;
   status: string;
   transaction_id: string | null;
   notes: string | null;
   paid_at: string | null;
   created_at: string;
   invoices?: { invoice_number: string; client_name: string } | null;
   clients?: { name: string } | null;
 }
 
 const AdminPayments = () => {
   const queryClient = useQueryClient();
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [methodFilter, setMethodFilter] = useState<string>('all');
   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
   const [isViewOpen, setIsViewOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isAddOpen, setIsAddOpen] = useState(false);
 
   const { data: payments, isLoading } = useQuery({
     queryKey: ['payments'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('payments')
         .select(`
           *,
           invoices:invoice_id(invoice_number, client_name),
           clients:client_id(name)
         `)
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data as Payment[];
     },
   });
 
   const { data: invoices } = useQuery({
     queryKey: ['invoices-for-payment'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('invoices')
         .select('id, invoice_number, client_name, client_id, total')
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data;
     },
   });
 
   const updatePaymentMutation = useMutation({
     mutationFn: async ({ id, ...updates }: { id: string; status?: string; notes?: string }) => {
       const { error } = await supabase
         .from('payments')
         .update({ ...updates, paid_at: updates.status === 'paid' ? new Date().toISOString() : null })
         .eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['payments'] });
       toast.success('Payment updated successfully');
       setIsEditOpen(false);
     },
     onError: () => toast.error('Failed to update payment'),
   });
 
   const addPaymentMutation = useMutation({
     mutationFn: async (payment: Omit<Payment, 'id' | 'created_at' | 'invoices' | 'clients'>) => {
       const { error } = await supabase.from('payments').insert(payment);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['payments'] });
       toast.success('Payment added successfully');
       setIsAddOpen(false);
     },
     onError: () => toast.error('Failed to add payment'),
   });
 
   const filteredPayments = payments?.filter((payment) => {
     const matchesSearch =
       payment.invoices?.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       payment.invoices?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       payment.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
     const matchesMethod = methodFilter === 'all' || payment.payment_method === methodFilter;
     return matchesSearch && matchesStatus && matchesMethod;
   });
 
   const PaymentForm = ({ payment, onSubmit, isNew = false }: { payment?: Payment | null; onSubmit: (data: any) => void; isNew?: boolean }) => {
     const [formData, setFormData] = useState({
       invoice_id: payment?.invoice_id || '',
       client_id: payment?.client_id || '',
       amount: payment?.amount || 0,
       payment_method: payment?.payment_method || 'cash',
       status: payment?.status || 'pending',
       transaction_id: payment?.transaction_id || '',
       notes: payment?.notes || '',
     });
 
     const handleInvoiceChange = (invoiceId: string) => {
       const invoice = invoices?.find((i) => i.id === invoiceId);
       setFormData({
         ...formData,
         invoice_id: invoiceId,
         client_id: invoice?.client_id || '',
         amount: invoice?.total || 0,
       });
     };
 
     return (
       <div className="space-y-4">
         {isNew && (
           <div>
             <Label>Invoice</Label>
             <Select value={formData.invoice_id} onValueChange={handleInvoiceChange}>
               <SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger>
               <SelectContent>
                 {invoices?.map((inv) => (
                   <SelectItem key={inv.id} value={inv.id}>
                     {inv.invoice_number} - {inv.client_name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         )}
         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label>Amount</Label>
             <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} disabled={!isNew} />
           </div>
           <div>
             <Label>Payment Method</Label>
             <Select value={formData.payment_method} onValueChange={(v) => setFormData({ ...formData, payment_method: v })}>
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="cash">Cash</SelectItem>
                 <SelectItem value="bank">Bank Transfer</SelectItem>
                 <SelectItem value="bkash">bKash</SelectItem>
                 <SelectItem value="nagad">Nagad</SelectItem>
                 <SelectItem value="card">Card</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label>Status</Label>
             <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="pending">Pending</SelectItem>
                 <SelectItem value="paid">Paid</SelectItem>
                 <SelectItem value="failed">Failed</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div>
             <Label>Transaction ID</Label>
             <Input value={formData.transaction_id} onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })} />
           </div>
         </div>
         <div>
           <Label>Notes</Label>
           <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
         </div>
         <DialogFooter>
           <Button onClick={() => onSubmit(formData)}>{isNew ? 'Add Payment' : 'Update'}</Button>
         </DialogFooter>
       </div>
     );
   };
 
   return (
     <AdminLayout>
       <AdminPageHeader
         title="Payments"
         description="Track and manage payment transactions"
         action={<Button onClick={() => setIsAddOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Payment</Button>}
       />
 
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search payments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
         </div>
         <Select value={statusFilter} onValueChange={setStatusFilter}>
           <SelectTrigger className="w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Status</SelectItem>
             <SelectItem value="pending">Pending</SelectItem>
             <SelectItem value="paid">Paid</SelectItem>
             <SelectItem value="failed">Failed</SelectItem>
           </SelectContent>
         </Select>
         <Select value={methodFilter} onValueChange={setMethodFilter}>
           <SelectTrigger className="w-[150px]"><SelectValue placeholder="Method" /></SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Methods</SelectItem>
             <SelectItem value="cash">Cash</SelectItem>
             <SelectItem value="bank">Bank Transfer</SelectItem>
             <SelectItem value="bkash">bKash</SelectItem>
             <SelectItem value="nagad">Nagad</SelectItem>
             <SelectItem value="card">Card</SelectItem>
           </SelectContent>
         </Select>
       </div>
 
       {isLoading ? (
         <AdminLoadingSkeleton />
       ) : !filteredPayments?.length ? (
         <AdminEmptyState icon={CreditCard} title="No payments found" description="Payment records will appear here" />
       ) : (
         <div className="border rounded-lg">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Invoice</TableHead>
                 <TableHead>Client</TableHead>
                 <TableHead>Amount</TableHead>
                 <TableHead>Method</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Date</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredPayments.map((payment) => (
                 <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.invoice_id && payment.invoices?.invoice_number ? (
                        <Link 
                          to={`/admin/invoices?id=${payment.invoice_id}`}
                          className="text-primary hover:underline underline-offset-2"
                        >
                          {payment.invoices.invoice_number}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <ClientLink 
                        clientId={payment.client_id} 
                        clientName={payment.invoices?.client_name || payment.clients?.name || '-'} 
                      />
                    </TableCell>
                   <TableCell>৳{payment.amount.toLocaleString()}</TableCell>
                   <TableCell className="capitalize">{payment.payment_method}</TableCell>
                   <TableCell><AdminStatusBadge status={payment.status} /></TableCell>
                   <TableCell>{format(new Date(payment.created_at), 'dd MMM yyyy')}</TableCell>
                   <TableCell className="text-right">
                     <Button variant="ghost" size="sm" onClick={() => { setSelectedPayment(payment); setIsViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                     <Button variant="ghost" size="sm" onClick={() => { setSelectedPayment(payment); setIsEditOpen(true); }}><Edit className="h-4 w-4" /></Button>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       )}
 
       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
         <DialogContent>
           <DialogHeader><DialogTitle>Payment Details</DialogTitle></DialogHeader>
           {selectedPayment && (
             <div className="space-y-3">
               <div className="grid grid-cols-2 gap-4">
                 <div><Label className="text-muted-foreground">Invoice</Label><p className="font-medium">{selectedPayment.invoices?.invoice_number || '-'}</p></div>
                 <div><Label className="text-muted-foreground">Client</Label><p className="font-medium">{selectedPayment.invoices?.client_name || selectedPayment.clients?.name || '-'}</p></div>
                 <div><Label className="text-muted-foreground">Amount</Label><p className="font-medium">৳{selectedPayment.amount.toLocaleString()}</p></div>
                 <div><Label className="text-muted-foreground">Method</Label><p className="font-medium capitalize">{selectedPayment.payment_method}</p></div>
                 <div><Label className="text-muted-foreground">Status</Label><AdminStatusBadge status={selectedPayment.status} /></div>
                 <div><Label className="text-muted-foreground">Transaction ID</Label><p className="font-medium">{selectedPayment.transaction_id || '-'}</p></div>
               </div>
               {selectedPayment.notes && <div><Label className="text-muted-foreground">Notes</Label><p>{selectedPayment.notes}</p></div>}
             </div>
           )}
         </DialogContent>
       </Dialog>
 
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
         <DialogContent>
           <DialogHeader><DialogTitle>Update Payment</DialogTitle></DialogHeader>
           <PaymentForm payment={selectedPayment} onSubmit={(data) => updatePaymentMutation.mutate({ id: selectedPayment!.id, ...data })} />
         </DialogContent>
       </Dialog>
 
       <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
         <DialogContent>
           <DialogHeader><DialogTitle>Add Payment</DialogTitle></DialogHeader>
           <PaymentForm isNew onSubmit={(data) => addPaymentMutation.mutate(data)} />
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminPayments;