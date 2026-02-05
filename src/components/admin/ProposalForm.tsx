 import { useEffect, useState } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import ClientCombobox from '@/components/admin/ClientCombobox';
 import RichTextEditor from '@/components/ui/rich-text-editor';
 import { supabase } from '@/integrations/supabase/client';
 import { useToast } from '@/hooks/use-toast';
 import { FileText, User, Calendar, DollarSign } from 'lucide-react';
 
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
   const [formData, setFormData] = useState({
     client_id: '',
     client_name: '',
     client_email: '',
     client_phone: '',
     client_company: '',
     title: '',
     scope_of_work: '',
     timeline: '',
     deliverables: '',
     pricing_summary: '',
     total_amount: 0,
     valid_until: '',
     notes: '',
     terms: '',
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
         scope_of_work: proposal.scope_of_work || '',
         timeline: proposal.timeline || '',
         deliverables: proposal.deliverables || '',
         pricing_summary: proposal.pricing_summary || '',
         total_amount: proposal.total_amount || 0,
         valid_until: proposal.valid_until || '',
         notes: proposal.notes || '',
         terms: proposal.terms || '',
       });
     }
   }, [proposal]);
 
   const fetchClients = async () => {
     const { data } = await supabase.from('clients').select('id, name, email, phone, address, company').order('name');
     setClients(data || []);
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
 
   const handleSave = async () => {
     if (!formData.client_name || !formData.title) {
       toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
       return;
     }
 
     setIsLoading(true);
     try {
       if (proposal) {
         const { error } = await supabase
           .from('proposals')
           .update({
             client_id: formData.client_id || null,
             client_name: formData.client_name,
             client_email: formData.client_email || null,
             client_phone: formData.client_phone || null,
             client_company: formData.client_company || null,
             title: formData.title,
             scope_of_work: formData.scope_of_work || null,
             timeline: formData.timeline || null,
             deliverables: formData.deliverables || null,
             pricing_summary: formData.pricing_summary || null,
             total_amount: formData.total_amount || null,
             valid_until: formData.valid_until || null,
             notes: formData.notes || null,
             terms: formData.terms || null,
           })
           .eq('id', proposal.id);
 
         if (error) throw error;
         toast({ title: 'Success', description: 'Proposal updated successfully' });
       } else {
         const { data: numData } = await supabase.rpc('generate_proposal_number');
         const proposalNumber = numData || `PRO-${Date.now()}`;
 
         const { error } = await supabase
           .from('proposals')
           .insert({
             proposal_number: proposalNumber,
             client_id: formData.client_id || null,
             client_name: formData.client_name,
             client_email: formData.client_email || null,
             client_phone: formData.client_phone || null,
             client_company: formData.client_company || null,
             title: formData.title,
             scope_of_work: formData.scope_of_work || null,
             timeline: formData.timeline || null,
             deliverables: formData.deliverables || null,
             pricing_summary: formData.pricing_summary || null,
             total_amount: formData.total_amount || null,
             valid_until: formData.valid_until || null,
             notes: formData.notes || null,
             terms: formData.terms || null,
           });
 
         if (error) throw error;
         toast({ title: 'Success', description: 'Proposal created successfully' });
       }
 
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
               <Label>Client Name *</Label>
               <Input
                 value={formData.client_name}
                 onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                 placeholder="Enter client name"
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
               <Label>Phone</Label>
               <Input
                 value={formData.client_phone}
                 onChange={(e) => setFormData(prev => ({ ...prev, client_phone: e.target.value }))}
                 placeholder="+880..."
               />
             </div>
             <div className="space-y-2 sm:col-span-2">
               <Label>Company</Label>
               <Input
                 value={formData.client_company}
                 onChange={(e) => setFormData(prev => ({ ...prev, client_company: e.target.value }))}
                 placeholder="Company name"
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
               <Label>Proposal Title *</Label>
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
             <div className="space-y-2">
               <Label>Total Amount</Label>
               <Input
                 type="number"
                 min="0"
                 value={formData.total_amount}
                 onChange={(e) => setFormData(prev => ({ ...prev, total_amount: Number(e.target.value) }))}
                 placeholder="0.00"
               />
             </div>
           </div>
 
           <div className="space-y-2">
             <Label>Scope of Work</Label>
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
               <Label>Deliverables</Label>
               <RichTextEditor
                 content={formData.deliverables}
                 onChange={(value) => setFormData(prev => ({ ...prev, deliverables: value }))}
                 placeholder="List of deliverables..."
                 className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
               />
             </div>
           </div>
 
           <div className="space-y-2">
             <Label>Pricing Summary</Label>
             <RichTextEditor
               content={formData.pricing_summary}
               onChange={(value) => setFormData(prev => ({ ...prev, pricing_summary: value }))}
               placeholder="Pricing breakdown..."
               className="min-h-[80px] [&_.ProseMirror]:min-h-[60px] [&_.ProseMirror]:p-2 [&_.ProseMirror]:text-sm"
             />
           </div>
         </CardContent>
       </Card>
 
       {/* Notes & Terms */}
       <Card>
         <CardHeader className="pb-4">
           <CardTitle className="text-base flex items-center gap-2">
             <Calendar className="h-4 w-4" />
             Notes & Terms
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="grid gap-4 sm:grid-cols-2">
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
           </div>
         </CardContent>
       </Card>
 
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