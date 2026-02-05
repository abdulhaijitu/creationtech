 import { useEffect, useState } from 'react';
 import { Eye, Plus, Search, Calendar, MoreHorizontal, FileText, ArrowRight, Download } from 'lucide-react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import { generatePDF, DocumentData } from '@/utils/pdfGenerator';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Badge } from '@/components/ui/badge';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { useToast } from '@/hooks/use-toast';
 import { supabase } from '@/integrations/supabase/client';
 
 interface QuotationItem {
   id?: string;
   description: string;
   quantity: number;
   unit_price: number;
   amount: number;
 }
 
 interface Quotation {
   id: string;
   quotation_number: string;
   client_id: string | null;
   client_name: string;
   client_email: string | null;
   client_phone: string | null;
   client_address: string | null;
   issue_date: string;
   valid_until: string | null;
   subtotal: number;
   tax_rate: number | null;
   tax_amount: number | null;
   discount_amount: number | null;
   total: number;
   status: string;
   notes: string | null;
   terms: string | null;
   created_at: string;
 }
 
 const statusColors: Record<string, string> = {
   pending: 'bg-yellow-100 text-yellow-700',
   approved: 'bg-green-100 text-green-700',
   rejected: 'bg-red-100 text-red-700',
   converted: 'bg-blue-100 text-blue-700',
 };
 
 const AdminQuotations = () => {
   const { toast } = useToast();
   const [quotations, setQuotations] = useState<Quotation[]>([]);
   const [clients, setClients] = useState<{ id: string; name: string; email: string | null }[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
   const [items, setItems] = useState<QuotationItem[]>([{ description: '', quantity: 1, unit_price: 0, amount: 0 }]);
   const [formData, setFormData] = useState({
     client_id: '',
     client_name: '',
     client_email: '',
     client_phone: '',
     client_address: '',
     valid_until: '',
     tax_rate: 0,
     discount_amount: 0,
     notes: '',
     terms: '',
   });
 
   const fetchQuotations = async () => {
     try {
       const { data, error } = await supabase
         .from('quotations')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       setQuotations(data || []);
     } catch (error) {
       console.error('Error fetching quotations:', error);
       toast({ title: 'Error', description: 'Failed to load quotations', variant: 'destructive' });
     } finally {
       setIsLoading(false);
     }
   };
 
   const fetchClients = async () => {
     const { data } = await supabase.from('clients').select('id, name, email').order('name');
     setClients(data || []);
   };
 
   useEffect(() => {
     fetchQuotations();
     fetchClients();
   }, []);
 
   const calculateTotals = (lineItems: QuotationItem[], taxRate: number, discountAmount: number) => {
     const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
     const taxAmount = subtotal * (taxRate / 100);
     const total = subtotal + taxAmount - discountAmount;
     return { subtotal, taxAmount, total };
   };
 
   const updateItemAmount = (index: number, field: keyof QuotationItem, value: number | string) => {
     const newItems = [...items];
     (newItems[index] as any)[field] = value;
     if (field === 'quantity' || field === 'unit_price') {
       newItems[index].amount = newItems[index].quantity * newItems[index].unit_price;
     }
     setItems(newItems);
   };
 
   const addItem = () => {
     setItems([...items, { description: '', quantity: 1, unit_price: 0, amount: 0 }]);
   };
 
   const removeItem = (index: number) => {
     if (items.length > 1) {
       setItems(items.filter((_, i) => i !== index));
     }
   };
 
   const openCreateDialog = () => {
     setSelectedQuotation(null);
     setFormData({
       client_id: '',
       client_name: '',
       client_email: '',
       client_phone: '',
       client_address: '',
       valid_until: '',
       tax_rate: 0,
       discount_amount: 0,
       notes: '',
       terms: '',
     });
     setItems([{ description: '', quantity: 1, unit_price: 0, amount: 0 }]);
     setIsDialogOpen(true);
   };
 
   const openEditDialog = async (quotation: Quotation) => {
     setSelectedQuotation(quotation);
     setFormData({
       client_id: quotation.client_id || '',
       client_name: quotation.client_name,
       client_email: quotation.client_email || '',
       client_phone: quotation.client_phone || '',
       client_address: quotation.client_address || '',
       valid_until: quotation.valid_until || '',
       tax_rate: quotation.tax_rate || 0,
       discount_amount: quotation.discount_amount || 0,
       notes: quotation.notes || '',
       terms: quotation.terms || '',
     });
 
     const { data: itemsData } = await supabase
       .from('quotation_items')
       .select('*')
       .eq('quotation_id', quotation.id)
       .order('display_order');
 
     setItems(itemsData?.map(item => ({
       id: item.id,
       description: item.description,
       quantity: Number(item.quantity),
       unit_price: Number(item.unit_price),
       amount: Number(item.amount),
     })) || [{ description: '', quantity: 1, unit_price: 0, amount: 0 }]);
 
     setIsDialogOpen(true);
   };
 
   const handleClientSelect = (clientId: string) => {
     const client = clients.find(c => c.id === clientId);
     if (client) {
       setFormData({
         ...formData,
         client_id: client.id,
         client_name: client.name,
         client_email: client.email || '',
       });
     }
   };
 
   const handleSave = async () => {
     if (!formData.client_name || items.every(i => !i.description)) {
       toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
       return;
     }
 
     const { subtotal, taxAmount, total } = calculateTotals(items, formData.tax_rate, formData.discount_amount);
 
     try {
       if (selectedQuotation) {
         const { error } = await supabase
           .from('quotations')
           .update({
             client_id: formData.client_id || null,
             client_name: formData.client_name,
             client_email: formData.client_email || null,
             client_phone: formData.client_phone || null,
             client_address: formData.client_address || null,
             valid_until: formData.valid_until || null,
             subtotal,
             tax_rate: formData.tax_rate,
             tax_amount: taxAmount,
             discount_amount: formData.discount_amount,
             total,
             notes: formData.notes || null,
             terms: formData.terms || null,
           })
           .eq('id', selectedQuotation.id);
 
         if (error) throw error;
 
         await supabase.from('quotation_items').delete().eq('quotation_id', selectedQuotation.id);
         await supabase.from('quotation_items').insert(
           items.filter(i => i.description).map((item, index) => ({
             quotation_id: selectedQuotation.id,
             description: item.description,
             quantity: item.quantity,
             unit_price: item.unit_price,
             amount: item.amount,
             display_order: index,
           }))
         );
 
         toast({ title: 'Success', description: 'Quotation updated successfully' });
       } else {
         const { data: numData } = await supabase.rpc('generate_quotation_number');
         const quotationNumber = numData || `QUO-${Date.now()}`;
 
         const { data: newQuotation, error } = await supabase
           .from('quotations')
           .insert({
             quotation_number: quotationNumber,
             client_id: formData.client_id || null,
             client_name: formData.client_name,
             client_email: formData.client_email || null,
             client_phone: formData.client_phone || null,
             client_address: formData.client_address || null,
             valid_until: formData.valid_until || null,
             subtotal,
             tax_rate: formData.tax_rate,
             tax_amount: taxAmount,
             discount_amount: formData.discount_amount,
             total,
             notes: formData.notes || null,
             terms: formData.terms || null,
           })
           .select()
           .single();
 
         if (error) throw error;
 
         await supabase.from('quotation_items').insert(
           items.filter(i => i.description).map((item, index) => ({
             quotation_id: newQuotation.id,
             description: item.description,
             quantity: item.quantity,
             unit_price: item.unit_price,
             amount: item.amount,
             display_order: index,
           }))
         );
 
         toast({ title: 'Success', description: 'Quotation created successfully' });
       }
 
       setIsDialogOpen(false);
       fetchQuotations();
     } catch (error: any) {
       console.error('Error saving quotation:', error);
       toast({ title: 'Error', description: error.message || 'Failed to save quotation', variant: 'destructive' });
     }
   };
 
   const updateStatus = async (id: string, status: string) => {
     try {
       const { error } = await supabase.from('quotations').update({ status }).eq('id', id);
       if (error) throw error;
       toast({ title: 'Success', description: 'Status updated' });
       fetchQuotations();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const convertToInvoice = async (quotation: Quotation) => {
     try {
       const { data: numData } = await supabase.rpc('generate_invoice_number');
       const invoiceNumber = numData || `INV-${Date.now()}`;
 
       const { data: itemsData } = await supabase
         .from('quotation_items')
         .select('*')
         .eq('quotation_id', quotation.id);
 
       const { data: newInvoice, error } = await supabase
         .from('invoices')
         .insert({
           invoice_number: invoiceNumber,
           client_id: quotation.client_id,
           client_name: quotation.client_name,
           client_email: quotation.client_email,
           client_phone: quotation.client_phone,
           client_address: quotation.client_address,
           subtotal: quotation.subtotal,
           tax_rate: quotation.tax_rate,
           tax_amount: quotation.tax_amount,
           discount_amount: quotation.discount_amount,
           total: quotation.total,
           notes: quotation.notes,
           terms: quotation.terms,
           status: 'draft',
         })
         .select()
         .single();
 
       if (error) throw error;
 
       if (itemsData && itemsData.length > 0) {
         await supabase.from('invoice_items').insert(
           itemsData.map((item) => ({
             invoice_id: newInvoice.id,
             description: item.description,
             quantity: item.quantity,
             unit_price: item.unit_price,
             amount: item.amount,
             display_order: item.display_order,
           }))
         );
       }
 
       await supabase.from('quotations').update({ status: 'converted' }).eq('id', quotation.id);
 
       toast({ title: 'Success', description: 'Quotation converted to invoice' });
       fetchQuotations();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const filteredQuotations = quotations.filter((q) => {
     const matchesSearch =
       q.quotation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
       q.client_name.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
     return matchesSearch && matchesStatus;
   });
 
   const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
   const formatCurrency = (amount: number) => `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
 
   const { subtotal, taxAmount, total } = calculateTotals(items, formData.tax_rate, formData.discount_amount);
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         <AdminPageHeader
           title="Quotations"
           description="Create and manage client quotations"
           action={
             <Button onClick={openCreateDialog}>
               <Plus className="h-4 w-4 mr-2" />
               New Quotation
             </Button>
           }
         />
 
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
             <Input
               placeholder="Search quotations..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
             />
           </div>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-[150px]">
               <SelectValue placeholder="Filter by status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="approved">Approved</SelectItem>
               <SelectItem value="rejected">Rejected</SelectItem>
               <SelectItem value="converted">Converted</SelectItem>
             </SelectContent>
           </Select>
         </div>
 
         <div className="grid gap-4">
           {isLoading ? (
             <Card><CardContent className="py-8 text-center text-muted-foreground">Loading quotations...</CardContent></Card>
           ) : filteredQuotations.length === 0 ? (
             <Card><CardContent className="py-8 text-center text-muted-foreground">No quotations found.</CardContent></Card>
           ) : (
             filteredQuotations.map((quotation) => (
               <Card key={quotation.id} className="hover:shadow-md transition-shadow">
                 <CardContent className="py-4">
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <h3 className="font-medium">{quotation.quotation_number}</h3>
                         <Badge className={statusColors[quotation.status]} variant="secondary">
                           {quotation.status}
                         </Badge>
                       </div>
                       <p className="text-sm text-muted-foreground">{quotation.client_name}</p>
                       <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                         <span className="flex items-center gap-1">
                           <Calendar className="h-3 w-3" /> {formatDate(quotation.issue_date)}
                         </span>
                         <span className="font-medium text-foreground">{formatCurrency(quotation.total)}</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          title="Download PDF"
                          onClick={async () => {
                            const { data: quotationItems } = await supabase
                              .from('quotation_items')
                              .select('*')
                              .eq('quotation_id', quotation.id)
                              .order('display_order');
                            
                            const pdfData: DocumentData = {
                              documentNumber: quotation.quotation_number,
                              documentType: 'Quotation',
                              clientName: quotation.client_name,
                              clientEmail: quotation.client_email,
                              clientPhone: quotation.client_phone,
                              clientAddress: quotation.client_address,
                              issueDate: quotation.issue_date,
                              validUntil: quotation.valid_until,
                              items: (quotationItems || []).map(item => ({
                                description: item.description,
                                quantity: Number(item.quantity),
                                unit_price: Number(item.unit_price),
                                amount: Number(item.amount),
                              })),
                              subtotal: Number(quotation.subtotal),
                              taxRate: Number(quotation.tax_rate || 0),
                              taxAmount: Number(quotation.tax_amount || 0),
                              discountAmount: Number(quotation.discount_amount || 0),
                              total: Number(quotation.total),
                              notes: quotation.notes,
                              terms: quotation.terms,
                              status: quotation.status,
                            };
                            generatePDF(pdfData);
                            toast({ title: 'PDF downloaded successfully' });
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                       <Button variant="outline" size="sm" onClick={() => openEditDialog(quotation)}>
                         <Eye className="h-4 w-4 mr-1" /> View
                       </Button>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => updateStatus(quotation.id, 'pending')}>Mark Pending</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(quotation.id, 'approved')}>Mark Approved</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(quotation.id, 'rejected')}>Mark Rejected</DropdownMenuItem>
                           {quotation.status !== 'converted' && (
                             <DropdownMenuItem onClick={() => convertToInvoice(quotation)}>
                               <ArrowRight className="h-4 w-4 mr-2" /> Convert to Invoice
                             </DropdownMenuItem>
                           )}
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))
           )}
         </div>
       </div>
 
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>{selectedQuotation ? 'Edit Quotation' : 'New Quotation'}</DialogTitle>
             <DialogDescription>
               {selectedQuotation ? `Quotation ${selectedQuotation.quotation_number}` : 'Create a new quotation for a client'}
             </DialogDescription>
           </DialogHeader>
 
           <div className="space-y-6">
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Select Client (Optional)</Label>
                 <Select value={formData.client_id} onValueChange={handleClientSelect}>
                   <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                   <SelectContent>
                     {clients.map((client) => (
                       <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label>Client Name *</Label>
                 <Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Email</Label>
                 <Input type="email" value={formData.client_email} onChange={(e) => setFormData({ ...formData, client_email: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Phone</Label>
                 <Input value={formData.client_phone} onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })} />
               </div>
               <div className="space-y-2 sm:col-span-2">
                 <Label>Address</Label>
                 <Input value={formData.client_address} onChange={(e) => setFormData({ ...formData, client_address: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Valid Until</Label>
                 <Input type="date" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} />
               </div>
             </div>
 
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <Label>Line Items</Label>
                 <Button type="button" variant="outline" size="sm" onClick={addItem}>
                   <Plus className="h-4 w-4 mr-1" /> Add Item
                 </Button>
               </div>
               <div className="space-y-3">
                 {items.map((item, index) => (
                   <div key={index} className="grid gap-2 sm:grid-cols-12 items-end">
                     <div className="sm:col-span-5">
                       <Input placeholder="Description" value={item.description} onChange={(e) => updateItemAmount(index, 'description', e.target.value)} />
                     </div>
                     <div className="sm:col-span-2">
                       <Input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={(e) => updateItemAmount(index, 'quantity', Number(e.target.value))} />
                     </div>
                     <div className="sm:col-span-2">
                       <Input type="number" placeholder="Price" min="0" value={item.unit_price} onChange={(e) => updateItemAmount(index, 'unit_price', Number(e.target.value))} />
                     </div>
                     <div className="sm:col-span-2 text-right font-medium">
                       {formatCurrency(item.amount)}
                     </div>
                     <div className="sm:col-span-1">
                       <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} disabled={items.length === 1}>×</Button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
 
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Tax Rate (%)</Label>
                 <Input type="number" min="0" value={formData.tax_rate} onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })} />
               </div>
               <div className="space-y-2">
                 <Label>Discount Amount</Label>
                 <Input type="number" min="0" value={formData.discount_amount} onChange={(e) => setFormData({ ...formData, discount_amount: Number(e.target.value) })} />
               </div>
             </div>
 
             <div className="bg-muted p-4 rounded-lg space-y-2">
               <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(subtotal)}</span></div>
               <div className="flex justify-between"><span>Tax ({formData.tax_rate}%):</span><span>{formatCurrency(taxAmount)}</span></div>
               <div className="flex justify-between"><span>Discount:</span><span>-{formatCurrency(formData.discount_amount)}</span></div>
               <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>{formatCurrency(total)}</span></div>
             </div>
 
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Notes</Label>
                 <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
               </div>
               <div className="space-y-2">
                 <Label>Terms & Conditions</Label>
                 <Textarea value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} rows={3} />
               </div>
             </div>
 
             <div className="flex justify-end gap-3">
               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
               <Button onClick={handleSave}>{selectedQuotation ? 'Update Quotation' : 'Create Quotation'}</Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminQuotations;