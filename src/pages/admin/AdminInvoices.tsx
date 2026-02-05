 import { useState } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
 import AdminEmptyState from '@/components/admin/AdminEmptyState';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Badge } from '@/components/ui/badge';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { useToast } from '@/hooks/use-toast';
 import { Plus, Pencil, Trash2, Eye, FileText, Search, X, Download } from 'lucide-react';
 import { format } from 'date-fns';
 import { generatePDF, DocumentData, LineItem } from '@/utils/pdfGenerator';
 import ClientLink from '@/components/admin/ClientLink';
 
 interface InvoiceItem {
   id?: string;
   description: string;
   quantity: number;
   unit_price: number;
   amount: number;
 }
 
 interface Invoice {
   id: string;
   invoice_number: string;
  client_id: string | null;
   client_name: string;
   client_email: string | null;
   client_phone: string | null;
   client_address: string | null;
   status: string;
   issue_date: string;
   due_date: string | null;
   subtotal: number;
   tax_rate: number;
   tax_amount: number;
   discount_amount: number;
   total: number;
   notes: string | null;
   terms: string | null;
   paid_amount: number;
   created_at: string;
 }
 
import { getStatusColor } from '@/lib/status-colors';
 
 const AdminInvoices = () => {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, unit_price: 0, amount: 0 }]);
   const { toast } = useToast();
   const queryClient = useQueryClient();
 
   const [formData, setFormData] = useState({
    client_id: '',
     client_name: '',
     client_email: '',
     client_phone: '',
     client_address: '',
     issue_date: format(new Date(), 'yyyy-MM-dd'),
     due_date: '',
     tax_rate: 0,
     discount_amount: 0,
     notes: '',
     terms: '',
     status: 'draft',
   });
 
   const { data: invoices, isLoading } = useQuery({
     queryKey: ['invoices'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('invoices')
         .select('*')
         .order('created_at', { ascending: false });
       if (error) throw error;
       return data as Invoice[];
     },
   });

  const { data: clients } = useQuery({
    queryKey: ['clients-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone, address')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
 
   const createMutation = useMutation({
     mutationFn: async (data: typeof formData & { items: InvoiceItem[] }) => {
       const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
       const taxAmount = subtotal * (data.tax_rate / 100);
       const total = subtotal + taxAmount - data.discount_amount;
 
       // Get next invoice number
       const { data: invoiceNum } = await supabase.rpc('generate_invoice_number');
 
       const { data: invoice, error } = await supabase
         .from('invoices')
         .insert({
           invoice_number: invoiceNum || `INV-${Date.now()}`,
            client_id: data.client_id || null,
           client_name: data.client_name,
           client_email: data.client_email || null,
           client_phone: data.client_phone || null,
           client_address: data.client_address || null,
           issue_date: data.issue_date,
           due_date: data.due_date || null,
           subtotal,
           tax_rate: data.tax_rate,
           tax_amount: taxAmount,
           discount_amount: data.discount_amount,
           total,
           notes: data.notes || null,
           terms: data.terms || null,
           status: data.status,
         })
         .select()
         .single();
 
       if (error) throw error;
 
       // Insert invoice items
       const itemsToInsert = data.items.map((item, index) => ({
         invoice_id: invoice.id,
         description: item.description,
         quantity: item.quantity,
         unit_price: item.unit_price,
         amount: item.amount,
         display_order: index,
       }));
 
       const { error: itemsError } = await supabase
         .from('invoice_items')
         .insert(itemsToInsert);
 
       if (itemsError) throw itemsError;
       return invoice;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['invoices'] });
       setIsDialogOpen(false);
       resetForm();
       toast({ title: 'Invoice created successfully' });
     },
     onError: (error) => {
       toast({ title: 'Error creating invoice', description: error.message, variant: 'destructive' });
     },
   });
 
   const updateMutation = useMutation({
     mutationFn: async ({ id, data }: { id: string; data: typeof formData & { items: InvoiceItem[] } }) => {
       const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
       const taxAmount = subtotal * (data.tax_rate / 100);
       const total = subtotal + taxAmount - data.discount_amount;
 
       const { error } = await supabase
         .from('invoices')
         .update({
           client_name: data.client_name,
           client_email: data.client_email || null,
           client_phone: data.client_phone || null,
           client_address: data.client_address || null,
           issue_date: data.issue_date,
           due_date: data.due_date || null,
           subtotal,
           tax_rate: data.tax_rate,
           tax_amount: taxAmount,
           discount_amount: data.discount_amount,
           total,
           notes: data.notes || null,
           terms: data.terms || null,
           status: data.status,
         })
         .eq('id', id);
 
       if (error) throw error;
 
       // Delete existing items and re-insert
       await supabase.from('invoice_items').delete().eq('invoice_id', id);
 
       const itemsToInsert = data.items.map((item, index) => ({
         invoice_id: id,
         description: item.description,
         quantity: item.quantity,
         unit_price: item.unit_price,
         amount: item.amount,
         display_order: index,
       }));
 
       const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);
       if (itemsError) throw itemsError;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['invoices'] });
       setIsDialogOpen(false);
       resetForm();
       toast({ title: 'Invoice updated successfully' });
     },
     onError: (error) => {
       toast({ title: 'Error updating invoice', description: error.message, variant: 'destructive' });
     },
   });
 
   const deleteMutation = useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from('invoices').delete().eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['invoices'] });
       toast({ title: 'Invoice deleted successfully' });
     },
     onError: (error) => {
       toast({ title: 'Error deleting invoice', description: error.message, variant: 'destructive' });
     },
   });
 
   const updateStatusMutation = useMutation({
     mutationFn: async ({ id, status }: { id: string; status: string }) => {
       const updates: Record<string, any> = { status };
       if (status === 'paid') {
         const invoice = invoices?.find(i => i.id === id);
         updates.paid_amount = invoice?.total || 0;
         updates.paid_at = new Date().toISOString();
       }
       const { error } = await supabase.from('invoices').update(updates).eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['invoices'] });
       toast({ title: 'Status updated' });
     },
   });
 
   const resetForm = () => {
     setFormData({
      client_id: '',
       client_name: '',
       client_email: '',
       client_phone: '',
       client_address: '',
       issue_date: format(new Date(), 'yyyy-MM-dd'),
       due_date: '',
       tax_rate: 0,
       discount_amount: 0,
       notes: '',
       terms: '',
       status: 'draft',
     });
     setItems([{ description: '', quantity: 1, unit_price: 0, amount: 0 }]);
     setEditingInvoice(null);
   };
 
   const handleEdit = async (invoice: Invoice) => {
     setEditingInvoice(invoice);
     setFormData({
      client_id: invoice.client_id || '',
       client_name: invoice.client_name,
       client_email: invoice.client_email || '',
       client_phone: invoice.client_phone || '',
       client_address: invoice.client_address || '',
       issue_date: invoice.issue_date,
       due_date: invoice.due_date || '',
       tax_rate: invoice.tax_rate,
       discount_amount: invoice.discount_amount,
       notes: invoice.notes || '',
       terms: invoice.terms || '',
       status: invoice.status,
     });
 
     // Fetch invoice items
     const { data: invoiceItems } = await supabase
       .from('invoice_items')
       .select('*')
       .eq('invoice_id', invoice.id)
       .order('display_order');
 
     if (invoiceItems && invoiceItems.length > 0) {
       setItems(invoiceItems.map(item => ({
         id: item.id,
         description: item.description,
         quantity: Number(item.quantity),
         unit_price: Number(item.unit_price),
         amount: Number(item.amount),
       })));
     }
     setIsDialogOpen(true);
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     const dataWithItems = { ...formData, items };
     if (editingInvoice) {
       updateMutation.mutate({ id: editingInvoice.id, data: dataWithItems });
     } else {
       createMutation.mutate(dataWithItems);
     }
   };
 
   const addItem = () => {
     setItems([...items, { description: '', quantity: 1, unit_price: 0, amount: 0 }]);
   };
 
   const removeItem = (index: number) => {
     if (items.length > 1) {
       setItems(items.filter((_, i) => i !== index));
     }
   };
 
   const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
     const newItems = [...items];
     newItems[index] = { ...newItems[index], [field]: value };
     if (field === 'quantity' || field === 'unit_price') {
       newItems[index].amount = Number(newItems[index].quantity) * Number(newItems[index].unit_price);
     }
     setItems(newItems);
   };
 
   const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
   const taxAmount = subtotal * (formData.tax_rate / 100);
   const total = subtotal + taxAmount - formData.discount_amount;
 
   const filteredInvoices = invoices?.filter(invoice => {
     const matchesSearch = invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
     return matchesSearch && matchesStatus;
   });
 
   return (
     <AdminLayout>
       <AdminPageHeader
         title="Invoices"
         description="Create and manage invoices"
         action={
           <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
             <Plus className="mr-2 h-4 w-4" />
             Create Invoice
           </Button>
         }
       />
 
       {/* Filters */}
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Search invoices..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10"
           />
         </div>
         <Select value={statusFilter} onValueChange={setStatusFilter}>
           <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Filter by status" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Status</SelectItem>
             <SelectItem value="draft">Draft</SelectItem>
             <SelectItem value="sent">Sent</SelectItem>
             <SelectItem value="paid">Paid</SelectItem>
             <SelectItem value="overdue">Overdue</SelectItem>
             <SelectItem value="cancelled">Cancelled</SelectItem>
           </SelectContent>
         </Select>
       </div>
 
       {isLoading ? (
         <AdminLoadingSkeleton />
       ) : !filteredInvoices?.length ? (
         <AdminEmptyState
           icon={FileText}
           title="No invoices found"
           description="Create your first invoice to get started"
         />
       ) : (
         <div className="border rounded-lg overflow-hidden">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Invoice #</TableHead>
                 <TableHead>Client</TableHead>
                 <TableHead>Issue Date</TableHead>
                 <TableHead>Due Date</TableHead>
                 <TableHead>Total</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredInvoices.map((invoice) => (
                 <TableRow key={invoice.id}>
                   <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>
                    <ClientLink 
                      clientId={invoice.client_id} 
                      clientName={invoice.client_name} 
                    />
                  </TableCell>
                   <TableCell>{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</TableCell>
                   <TableCell>{invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : '-'}</TableCell>
                   <TableCell className="font-medium">৳{Number(invoice.total).toLocaleString()}</TableCell>
                   <TableCell>
                     <Select
                       value={invoice.status}
                       onValueChange={(status) => updateStatusMutation.mutate({ id: invoice.id, status })}
                     >
                       <SelectTrigger className="w-[120px] h-8">
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="draft">Draft</SelectItem>
                         <SelectItem value="sent">Sent</SelectItem>
                         <SelectItem value="paid">Paid</SelectItem>
                         <SelectItem value="overdue">Overdue</SelectItem>
                         <SelectItem value="cancelled">Cancelled</SelectItem>
                       </SelectContent>
                     </Select>
                   </TableCell>
                   <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download PDF"
                          onClick={async () => {
                            const { data: invoiceItems } = await supabase
                              .from('invoice_items')
                              .select('*')
                              .eq('invoice_id', invoice.id)
                              .order('display_order');
                            
                            const pdfData: DocumentData = {
                              documentNumber: invoice.invoice_number,
                              documentType: 'Invoice',
                              clientName: invoice.client_name,
                              clientEmail: invoice.client_email,
                              clientPhone: invoice.client_phone,
                              clientAddress: invoice.client_address,
                              issueDate: invoice.issue_date,
                              dueDate: invoice.due_date,
                              items: (invoiceItems || []).map(item => ({
                                description: item.description,
                                quantity: Number(item.quantity),
                                unit_price: Number(item.unit_price),
                                amount: Number(item.amount),
                              })),
                              subtotal: Number(invoice.subtotal),
                              taxRate: Number(invoice.tax_rate),
                              taxAmount: Number(invoice.tax_amount),
                              discountAmount: Number(invoice.discount_amount),
                              total: Number(invoice.total),
                              notes: invoice.notes,
                              terms: invoice.terms,
                              status: invoice.status,
                            };
                            generatePDF(pdfData);
                            toast({ title: 'PDF downloaded successfully' });
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(invoice)}>
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => {
                           if (confirm('Delete this invoice?')) {
                             deleteMutation.mutate(invoice.id);
                           }
                         }}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       )}
 
       {/* Create/Edit Dialog */}
       <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-6">
             {/* Client Info */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Select Client</Label>
                <Select 
                  value={formData.client_id} 
                  onValueChange={(clientId) => {
                    const client = clients?.find(c => c.id === clientId);
                    if (client) {
                      setFormData({
                        ...formData,
                        client_id: client.id,
                        client_name: client.name,
                        client_email: client.email || '',
                        client_phone: client.phone || '',
                        client_address: client.address || '',
                      });
                    }
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.email ? `(${client.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                 <Label>Email</Label>
                 <Input
                   type="email"
                   value={formData.client_email}
                   onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label>Phone</Label>
                 <Input
                   value={formData.client_phone}
                   onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label>Address</Label>
                 <Input
                   value={formData.client_address}
                   onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                 />
               </div>
             </div>
 
             {/* Dates */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label>Issue Date *</Label>
                 <Input
                   type="date"
                   value={formData.issue_date}
                   onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                   required
                 />
               </div>
               <div className="space-y-2">
                 <Label>Due Date</Label>
                 <Input
                   type="date"
                   value={formData.due_date}
                   onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label>Status</Label>
                 <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="draft">Draft</SelectItem>
                     <SelectItem value="sent">Sent</SelectItem>
                     <SelectItem value="paid">Paid</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
 
             {/* Line Items */}
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <Label className="text-base font-semibold">Line Items</Label>
                 <Button type="button" variant="outline" size="sm" onClick={addItem}>
                   <Plus className="mr-2 h-4 w-4" />
                   Add Item
                 </Button>
               </div>
               <div className="space-y-3">
                 {items.map((item, index) => (
                   <div key={index} className="grid grid-cols-12 gap-2 items-end">
                     <div className="col-span-5">
                       <Label className="text-xs">Description</Label>
                       <Input
                         value={item.description}
                         onChange={(e) => updateItem(index, 'description', e.target.value)}
                         placeholder="Item description"
                       />
                     </div>
                     <div className="col-span-2">
                       <Label className="text-xs">Qty</Label>
                       <Input
                         type="number"
                         value={item.quantity}
                         onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                         min="1"
                       />
                     </div>
                     <div className="col-span-2">
                       <Label className="text-xs">Unit Price</Label>
                       <Input
                         type="number"
                         value={item.unit_price}
                         onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                         min="0"
                       />
                     </div>
                     <div className="col-span-2">
                       <Label className="text-xs">Amount</Label>
                       <Input value={`৳${item.amount.toLocaleString()}`} disabled />
                     </div>
                     <div className="col-span-1">
                       <Button
                         type="button"
                         variant="ghost"
                         size="icon"
                         onClick={() => removeItem(index)}
                         disabled={items.length === 1}
                       >
                         <X className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
 
             {/* Totals */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label>Notes</Label>
                   <Textarea
                     value={formData.notes}
                     onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                     placeholder="Additional notes..."
                     rows={3}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Terms</Label>
                   <Textarea
                     value={formData.terms}
                     onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                     placeholder="Payment terms..."
                     rows={2}
                   />
                 </div>
               </div>
               <div className="space-y-3 p-4 bg-muted rounded-lg">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span className="font-medium">৳{subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <span>Tax</span>
                     <Input
                       type="number"
                       value={formData.tax_rate}
                       onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                       className="w-16 h-8"
                       min="0"
                       max="100"
                     />
                     <span>%</span>
                   </div>
                   <span>৳{taxAmount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <span>Discount</span>
                   </div>
                   <Input
                     type="number"
                     value={formData.discount_amount}
                     onChange={(e) => setFormData({ ...formData, discount_amount: Number(e.target.value) })}
                     className="w-24 h-8"
                     min="0"
                   />
                 </div>
                 <div className="border-t pt-3 flex justify-between text-lg font-bold">
                   <span>Total</span>
                   <span>৳{total.toLocaleString()}</span>
                 </div>
               </div>
             </div>
 
             <div className="flex justify-end gap-3">
               <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                 Cancel
               </Button>
               <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                 {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
               </Button>
             </div>
           </form>
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminInvoices;