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
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, FileText, Search, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { generatePDF, DocumentData, LineItem, CompanyInfo } from '@/utils/pdfGenerator';
import ClientLink from '@/components/admin/ClientLink';
import InvoiceForm, { InvoiceItem, InvoiceFormData } from '@/components/admin/InvoiceForm';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import companyLogo from '@/assets/logo.png';
import watermarkImage from '@/assets/jolchap.png';
import { getStatusColor } from '@/lib/status-colors';

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
  is_recurring: boolean;
  billing_period_start: string | null;
  billing_period_end: string | null;
}

const AdminInvoices = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, unit_price: 0, amount: 0, billing_type: 'one_time', billing_period: '' }]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: businessInfo } = useBusinessInfoMap();

  const getCompanyInfo = (): CompanyInfo => ({
    name: businessInfo?.company_name?.value_en || 'Creation Tech',
    tagline: businessInfo?.tagline?.value_en || '-PRIME TECH PARTNER-',
    address: businessInfo?.address?.value_en || 'Dhaka, Bangladesh',
    phone: businessInfo?.phone_primary?.value_en || '+880 1XXX-XXXXXX',
    email: businessInfo?.email_primary?.value_en || 'info@creationtech.com',
    website: businessInfo?.website?.value_en || 'www.creationtech.com',
    logo_url: businessInfo?.company_logo?.value_en || companyLogo,
    watermark_url: watermarkImage,
  });

  const [formData, setFormData] = useState<InvoiceFormData>({
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
    is_recurring: false,
    billing_period_start: '',
    billing_period_end: '',
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

  const createMutation = useMutation({
    mutationFn: async (data: InvoiceFormData & { items: InvoiceItem[] }) => {
      const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = subtotal * (data.tax_rate / 100);
      const total = subtotal + taxAmount - data.discount_amount;

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
          is_recurring: data.is_recurring,
          billing_period_start: data.billing_period_start || null,
          billing_period_end: data.billing_period_end || null,
        } as any)
        .select()
        .single();

      if (error) throw error;

      const itemsToInsert = data.items.map((item, index) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
        display_order: index,
        billing_type: item.billing_type,
        billing_period: item.billing_period || null,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert as any);

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
    mutationFn: async ({ id, data }: { id: string; data: InvoiceFormData & { items: InvoiceItem[] } }) => {
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
          is_recurring: data.is_recurring,
          billing_period_start: data.billing_period_start || null,
          billing_period_end: data.billing_period_end || null,
        } as any)
        .eq('id', id);

      if (error) throw error;

      await supabase.from('invoice_items').delete().eq('invoice_id', id);

      const itemsToInsert = data.items.map((item, index) => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.amount,
        display_order: index,
        billing_type: item.billing_type,
        billing_period: item.billing_period || null,
      }));

      const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert as any);
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
      is_recurring: false,
      billing_period_start: '',
      billing_period_end: '',
    });
    setItems([{ description: '', quantity: 1, unit_price: 0, amount: 0, billing_type: 'one_time', billing_period: '' }]);
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
      is_recurring: invoice.is_recurring || false,
      billing_period_start: invoice.billing_period_start || '',
      billing_period_end: invoice.billing_period_end || '',
    });

    const { data: invoiceItems } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('display_order');

    if (invoiceItems && invoiceItems.length > 0) {
      setItems(invoiceItems.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        amount: Number(item.amount),
        billing_type: item.billing_type || 'one_time',
        billing_period: item.billing_period || '',
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
                <TableHead>Type</TableHead>
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
                    {invoice.is_recurring ? (
                      <Badge variant="outline" className="gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Recurring
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">One-time</span>
                    )}
                  </TableCell>
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
                            items: (invoiceItems || []).map((item: any) => ({
                              description: item.description,
                              quantity: Number(item.quantity),
                              unit_price: Number(item.unit_price),
                              amount: Number(item.amount),
                              billing_type: item.billing_type || 'one_time',
                              billing_period: item.billing_period || '',
                            })),
                            subtotal: Number(invoice.subtotal),
                            taxRate: Number(invoice.tax_rate),
                            taxAmount: Number(invoice.tax_amount),
                            discountAmount: Number(invoice.discount_amount),
                            total: Number(invoice.total),
                            notes: invoice.notes,
                            terms: invoice.terms,
                            status: invoice.status,
                            isRecurring: invoice.is_recurring,
                            billingPeriodStart: invoice.billing_period_start,
                            billingPeriodEnd: invoice.billing_period_end,
                          };
                          await generatePDF(pdfData, getCompanyInfo());
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
          </DialogHeader>
          <InvoiceForm
            formData={formData}
            setFormData={setFormData}
            items={items}
            setItems={setItems}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isEditing={!!editingInvoice}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminInvoices;
