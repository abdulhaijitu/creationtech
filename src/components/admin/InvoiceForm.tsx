import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Plus, X, User, Calendar, FileText, Calculator, Receipt, Trash2, RefreshCw } from 'lucide-react';
import ClientCombobox from './ClientCombobox';
import { format } from 'date-fns';
import RichTextEditor from '@/components/ui/rich-text-editor';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  billing_type: string;
  billing_period: string;
}

export interface InvoiceFormData {
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  issue_date: string;
  due_date: string;
  tax_rate: number;
  discount_amount: number;
  notes: string;
  terms: string;
  status: string;
  is_recurring: boolean;
  billing_period_start: string;
  billing_period_end: string;
}

interface InvoiceFormProps {
  formData: InvoiceFormData;
  setFormData: (data: InvoiceFormData) => void;
  items: InvoiceItem[];
  setItems: (items: InvoiceItem[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
  onAddNewClient?: () => void;
}

const InvoiceForm = ({
  formData,
  setFormData,
  items,
  setItems,
  onSubmit,
  onCancel,
  isEditing,
  isLoading,
  onAddNewClient,
}: InvoiceFormProps) => {
  const { data: clients = [] } = useQuery({
    queryKey: ['clients-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone, address, company')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, amount: 0, billing_type: 'one_time', billing_period: '' }]);
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

  const recurringItems = items.filter(i => i.billing_type === 'recurring');
  const oneTimeItems = items.filter(i => i.billing_type === 'one_time');
  const recurringSubtotal = recurringItems.reduce((sum, item) => sum + item.amount, 0);
  const oneTimeSubtotal = oneTimeItems.reduce((sum, item) => sum + item.amount, 0);
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (formData.tax_rate / 100);
  const total = subtotal + taxAmount - formData.discount_amount;

  const handleClientSelect = (client: { id: string; name: string; email: string | null; phone: string | null; address: string | null }) => {
    setFormData({
      ...formData,
      client_id: client.id,
      client_name: client.name,
      client_email: client.email || '',
      client_phone: client.phone || '',
      client_address: client.address || '',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Client Selection Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Client <span className="text-destructive">*</span></Label>
            <ClientCombobox
              clients={clients}
              value={formData.client_id}
              onSelect={handleClientSelect}
              onAddNew={onAddNewClient}
              placeholder="Search and select a client..."
              displayName={formData.client_name}
            />
          </div>
          
          {(formData.client_id || formData.client_name) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  placeholder="client@example.com"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  placeholder="+880 1XXX-XXXXXX"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Address</Label>
                <Input
                  value={formData.client_address}
                  onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                  placeholder="Street, City"
                  className="h-9"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Invoice Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Issue Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                required
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-muted-foreground/70" />
                      Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="sent">
                    <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-primary" />
                      Sent
                    </div>
                  </SelectItem>
                  <SelectItem value="paid">
                    <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
                      Paid
                    </div>
                  </SelectItem>
                  <SelectItem value="overdue">
                    <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-destructive" />
                      Overdue
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recurring Invoice Toggle & Billing Period */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Recurring Invoice</Label>
            </div>
            <Switch
              checked={formData.is_recurring}
              onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
            />
          </div>

          {formData.is_recurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Billing Period Start</Label>
                <Input
                  type="date"
                  value={formData.billing_period_start}
                  onChange={(e) => setFormData({ ...formData, billing_period_start: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Billing Period End</Label>
                <Input
                  type="date"
                  value={formData.billing_period_end}
                  onChange={(e) => setFormData({ ...formData, billing_period_end: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line Items Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Line Items
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Header for desktop */}
          <div className="hidden md:grid md:grid-cols-12 gap-2 mb-2 px-1">
            <div className="col-span-2 text-xs font-medium text-muted-foreground">Type</div>
            <div className="col-span-4 text-xs font-medium text-muted-foreground">Description</div>
            <div className="col-span-1 text-xs font-medium text-muted-foreground">Qty</div>
            <div className="col-span-2 text-xs font-medium text-muted-foreground">Unit Price</div>
            <div className="col-span-2 text-xs font-medium text-muted-foreground text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="group relative grid grid-cols-1 md:grid-cols-12 gap-2 p-3 md:p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Mobile layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Billing Type</Label>
                      <Select value={item.billing_type} onValueChange={(v) => updateItem(index, 'billing_type', v)}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one_time">One-time</SelectItem>
                          <SelectItem value="recurring">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {item.billing_type === 'recurring' && (
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Period</Label>
                        <Input
                          value={item.billing_period}
                          onChange={(e) => updateItem(index, 'billing_period', e.target.value)}
                          placeholder="e.g. March 2026"
                          className="h-9"
                        />
                      </div>
                    )}
                  </div>
                   <div className="space-y-1.5">
                     <Label className="text-xs text-muted-foreground">Description</Label>
                     <RichTextEditor
                       content={item.description}
                       onChange={(value) => updateItem(index, 'description', value)}
                       placeholder="Item description with formatting..."
                       className="[&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
                     />
                   </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Qty</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Price</Label>
                      <Input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Amount</Label>
                      <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm font-medium flex items-center justify-end">
                        ৳{item.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:contents">
                  <div className="col-span-2 space-y-1">
                    <Select value={item.billing_type} onValueChange={(v) => updateItem(index, 'billing_type', v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_time">One-time</SelectItem>
                        <SelectItem value="recurring">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    {item.billing_type === 'recurring' && (
                      <Input
                        value={item.billing_period}
                        onChange={(e) => updateItem(index, 'billing_period', e.target.value)}
                        placeholder="e.g. Mar 2026"
                        className="h-7 text-xs"
                      />
                    )}
                  </div>
                   <div className="col-span-4 self-start">
                     <RichTextEditor
                       content={item.description}
                       onChange={(value) => updateItem(index, 'description', value)}
                       placeholder="Item description with formatting..."
                       className="[&_.ProseMirror]:min-h-[50px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
                     />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      min="1"
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                      min="0"
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="font-medium text-sm">৳{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary & Notes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes & Terms */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Notes & Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes for the client..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Payment Terms</Label>
              <Textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="Payment terms and conditions..."
                rows={2}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Invoice Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Show separate subtotals if there are both types */}
            {recurringItems.length > 0 && oneTimeItems.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    <Badge variant="outline" className="mr-1.5 text-xs">Monthly</Badge>
                    Recurring
                  </span>
                  <span className="font-medium text-sm">৳{recurringSubtotal.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    <Badge variant="outline" className="mr-1.5 text-xs">One-time</Badge>
                    One-time
                  </span>
                  <span className="font-medium text-sm">৳{oneTimeSubtotal.toLocaleString()}</span>
                </div>
                <Separator />
              </>
            )}

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">৳{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                    className="w-16 h-7 text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <span className="font-medium">৳{taxAmount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Discount</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">৳</span>
                <Input
                  type="number"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: Number(e.target.value) })}
                  className="w-24 h-7 text-right"
                  min="0"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">৳{total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !formData.client_id}>
          {isLoading ? 'Saving...' : isEditing ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
