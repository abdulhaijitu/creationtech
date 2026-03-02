import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClientCombobox from '@/components/admin/ClientCombobox';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, User, Calendar, Plus, Trash2, X, Calculator } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company?: string | null;
}

interface Proposal {
  id: string;
  proposal_number: string;
  client_id: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_company: string | null;
  title: string;
  scope_of_work: string | null;
  timeline: string | null;
  deliverables: string | null;
  pricing_summary: string | null;
  total_amount: number | null;
  valid_until: string | null;
  status: string;
  notes: string | null;
  terms: string | null;
  version: number;
  created_at: string;
  offer_letter: string | null;
  offer_letter_end: string | null;
  expected_outcome: string | null;
  subtotal: number | null;
  tax_rate: number | null;
  tax_amount: number | null;
  discount_amount: number | null;
}

export interface ProposalItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface ProposalFormProps {
  proposal: Proposal | null;
  onSave: () => void;
  onCancel: () => void;
}

export const ProposalForm = ({ proposal, onSave, onCancel }: ProposalFormProps) => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ProposalItem[]>([
    { description: '', quantity: 1, unit_price: 0, amount: 0 },
  ]);
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_company: '',
    title: '',
    offer_letter: '',
    offer_letter_end: '',
    scope_of_work: '',
    expected_outcome: '',
    timeline: '',
    deliverables: '',
    valid_until: '',
    notes: '',
    terms: '',
    tax_rate: 0,
    discount_amount: 0,
  });

  useEffect(() => {
    fetchClients();
    if (proposal) {
      setFormData({
        client_id: proposal.client_id || '',
        client_name: proposal.client_name,
        client_email: proposal.client_email || '',
        client_phone: proposal.client_phone || '',
        client_company: proposal.client_company || '',
        title: proposal.title,
        offer_letter: proposal.offer_letter || '',
        scope_of_work: proposal.scope_of_work || '',
        expected_outcome: proposal.expected_outcome || '',
        offer_letter_end: proposal.offer_letter_end || '',
        timeline: proposal.timeline || '',
        deliverables: proposal.deliverables || '',
        valid_until: proposal.valid_until || '',
        notes: proposal.notes || '',
        terms: proposal.terms || '',
        tax_rate: proposal.tax_rate || 0,
        discount_amount: proposal.discount_amount || 0,
      });
      // Fetch proposal items
      fetchProposalItems(proposal.id);
    }
  }, [proposal]);

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('id, name, email, phone, address, company').order('name');
    setClients(data || []);
  };

  const fetchProposalItems = async (proposalId: string) => {
    const { data } = await supabase
      .from('proposal_items')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('display_order');
    if (data && data.length > 0) {
      setItems(data.map(item => ({
        id: item.id,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        amount: Number(item.amount),
      })));
    }
  };

  const handleClientSelect = (client: Client) => {
    setFormData(prev => ({
      ...prev,
      client_id: client.id,
      client_name: client.name,
      client_email: client.email || '',
      client_phone: client.phone || '',
      client_company: client.company || '',
    }));
  };

  // Line items helpers
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof ProposalItem, value: string | number) => {
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

  const handleSave = async () => {
    if (!formData.client_name || !formData.title) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const proposalData = {
        client_id: formData.client_id || null,
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        client_company: formData.client_company || null,
        title: formData.title,
        offer_letter: formData.offer_letter || null,
        scope_of_work: formData.scope_of_work || null,
        expected_outcome: formData.expected_outcome || null,
        offer_letter_end: formData.offer_letter_end || null,
        timeline: formData.timeline || null,
        deliverables: formData.deliverables || null,
        subtotal,
        tax_rate: formData.tax_rate,
        tax_amount: taxAmount,
        discount_amount: formData.discount_amount,
        total_amount: total,
        valid_until: formData.valid_until || null,
        notes: formData.notes || null,
        terms: formData.terms || null,
      };

      let proposalId: string;

      if (proposal) {
        const { error } = await supabase
          .from('proposals')
          .update(proposalData)
          .eq('id', proposal.id);
        if (error) throw error;
        proposalId = proposal.id;

        // Delete existing items and re-insert
        await supabase.from('proposal_items').delete().eq('proposal_id', proposalId);
      } else {
        const { data: numData } = await supabase.rpc('generate_proposal_number');
        const proposalNumber = numData || `PRO-${Date.now()}`;

        const { data: inserted, error } = await supabase
          .from('proposals')
          .insert({ ...proposalData, proposal_number: proposalNumber })
          .select('id')
          .single();
        if (error) throw error;
        proposalId = inserted.id;
      }

      // Insert items
      const itemsToInsert = items
        .filter(item => item.description || item.amount > 0)
        .map((item, index) => ({
          proposal_id: proposalId,
          description: item.description || '',
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
          display_order: index,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase.from('proposal_items').insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      toast({ title: 'Success', description: proposal ? 'Proposal updated successfully' : 'Proposal created successfully' });
      onSave();
    } catch (error: any) {
      console.error('Error saving proposal:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save proposal', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Client (Optional)</Label>
              <ClientCombobox
                clients={clients}
                value={formData.client_id}
                onSelect={handleClientSelect}
              />
            </div>
            <div className="space-y-2">
              <Label>Name (Client or Company) *</Label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Enter client or company name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                placeholder="client@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile</Label>
              <Input
                value={formData.client_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                placeholder="+880..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Proposal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Subject *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Website Development Proposal"
              />
            </div>
            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Offer Letter</Label>
            <RichTextEditor
              content={formData.offer_letter}
              onChange={(value) => setFormData(prev => ({ ...prev, offer_letter: value }))}
              placeholder="Write offer letter content..."
              className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Project Overview</Label>
            <RichTextEditor
              content={formData.scope_of_work}
              onChange={(value) => setFormData(prev => ({ ...prev, scope_of_work: value }))}
              placeholder="Describe the project scope..."
              className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Timeline</Label>
              <RichTextEditor
                content={formData.timeline}
                onChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
                placeholder="Project timeline and milestones..."
                className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Key Deliverables</Label>
              <RichTextEditor
                content={formData.deliverables}
                onChange={(value) => setFormData(prev => ({ ...prev, deliverables: value }))}
                placeholder="List of deliverables..."
                className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Expected Outcome</Label>
            <RichTextEditor
              content={formData.expected_outcome}
              onChange={(value) => setFormData(prev => ({ ...prev, expected_outcome: value }))}
              placeholder="Describe expected outcomes..."
              className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget Details - Line Items */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Budget Details
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
            <div className="col-span-5 text-xs font-medium text-muted-foreground">Description</div>
            <div className="col-span-2 text-xs font-medium text-muted-foreground">Quantity</div>
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
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <RichTextEditor
                      content={item.description}
                      onChange={(value) => updateItem(index, 'description', value)}
                      placeholder="Item description..."
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
                  <div className="col-span-5 self-start">
                    <RichTextEditor
                      content={item.description}
                      onChange={(value) => updateItem(index, 'description', value)}
                      placeholder="Item description..."
                      className="[&_.ProseMirror]:min-h-[50px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
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

      {/* Offer Letter End */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Offer Letter End
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={formData.offer_letter_end}
            onChange={(value) => setFormData(prev => ({ ...prev, offer_letter_end: value }))}
            placeholder="Write closing remarks for the offer letter..."
            className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
          />
        </CardContent>
      </Card>

      {/* Summary & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes & Terms */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Notes & Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <RichTextEditor
                content={formData.notes}
                onChange={(value) => setFormData(prev => ({ ...prev, notes: value }))}
                placeholder="Internal notes..."
                className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <RichTextEditor
                content={formData.terms}
                onChange={(value) => setFormData(prev => ({ ...prev, terms: value }))}
                placeholder="Terms and conditions..."
                className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Budget Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    onChange={(e) => setFormData(prev => ({ ...prev, tax_rate: Number(e.target.value) }))}
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
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Discount</span>
                <Input
                  type="number"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: Number(e.target.value) }))}
                  className="w-24 h-7 text-center"
                  min="0"
                />
              </div>
              <span className="font-medium text-destructive">-৳{formData.discount_amount.toLocaleString()}</span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : proposal ? 'Update Proposal' : 'Create Proposal'}
        </Button>
      </div>
    </div>
  );
};
