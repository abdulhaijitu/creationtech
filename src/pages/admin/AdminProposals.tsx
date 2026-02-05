 import { useEffect, useState } from 'react';
 import { Eye, Plus, Search, Calendar, MoreHorizontal, FileText } from 'lucide-react';
 import AdminLayout from '@/components/admin/AdminLayout';
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
 
 const statusColors: Record<string, string> = {
   draft: 'bg-gray-100 text-gray-700',
   sent: 'bg-blue-100 text-blue-700',
   accepted: 'bg-green-100 text-green-700',
   rejected: 'bg-red-100 text-red-700',
   revised: 'bg-yellow-100 text-yellow-700',
 };
 
 const AdminProposals = () => {
   const { toast } = useToast();
   const [proposals, setProposals] = useState<Proposal[]>([]);
   const [clients, setClients] = useState<{ id: string; name: string; email: string | null; company: string | null }[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
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
 
   const fetchProposals = async () => {
     try {
       const { data, error } = await supabase
         .from('proposals')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       setProposals(data || []);
     } catch (error) {
       console.error('Error fetching proposals:', error);
       toast({ title: 'Error', description: 'Failed to load proposals', variant: 'destructive' });
     } finally {
       setIsLoading(false);
     }
   };
 
   const fetchClients = async () => {
     const { data } = await supabase.from('clients').select('id, name, email, company').order('name');
     setClients(data || []);
   };
 
   useEffect(() => {
     fetchProposals();
     fetchClients();
   }, []);
 
   const openCreateDialog = () => {
     setSelectedProposal(null);
     setFormData({
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
     setIsDialogOpen(true);
   };
 
   const openEditDialog = (proposal: Proposal) => {
     setSelectedProposal(proposal);
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
         client_company: client.company || '',
       });
     }
   };
 
   const handleSave = async () => {
     if (!formData.client_name || !formData.title) {
       toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' });
       return;
     }
 
     try {
       if (selectedProposal) {
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
           .eq('id', selectedProposal.id);
 
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
 
       setIsDialogOpen(false);
       fetchProposals();
     } catch (error: any) {
       console.error('Error saving proposal:', error);
       toast({ title: 'Error', description: error.message || 'Failed to save proposal', variant: 'destructive' });
     }
   };
 
   const updateStatus = async (id: string, status: string) => {
     try {
       const { error } = await supabase.from('proposals').update({ status }).eq('id', id);
       if (error) throw error;
       toast({ title: 'Success', description: 'Status updated' });
       fetchProposals();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const createNewVersion = async (proposal: Proposal) => {
     try {
       const { data: numData } = await supabase.rpc('generate_proposal_number');
       const proposalNumber = numData || `PRO-${Date.now()}`;
 
       const { error } = await supabase.from('proposals').insert({
         proposal_number: proposalNumber,
         client_id: proposal.client_id,
         client_name: proposal.client_name,
         client_email: proposal.client_email,
         client_phone: proposal.client_phone,
         client_company: proposal.client_company,
         title: proposal.title,
         scope_of_work: proposal.scope_of_work,
         timeline: proposal.timeline,
         deliverables: proposal.deliverables,
         pricing_summary: proposal.pricing_summary,
         total_amount: proposal.total_amount,
         valid_until: proposal.valid_until,
         notes: proposal.notes,
         terms: proposal.terms,
         version: proposal.version + 1,
         status: 'draft',
       });
 
       if (error) throw error;
       await supabase.from('proposals').update({ status: 'revised' }).eq('id', proposal.id);
       toast({ title: 'Success', description: 'New version created' });
       fetchProposals();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const filteredProposals = proposals.filter((p) => {
     const matchesSearch =
       p.proposal_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
       p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       p.client_name.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
     return matchesSearch && matchesStatus;
   });
 
   const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
   const formatCurrency = (amount: number | null) => amount ? `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}` : '-';
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         <AdminPageHeader
           title="Proposals"
           description="Create and manage client proposals"
           action={
             <Button onClick={openCreateDialog}>
               <Plus className="h-4 w-4 mr-2" />
               New Proposal
             </Button>
           }
         />
 
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
             <Input
               placeholder="Search proposals..."
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
               <SelectItem value="draft">Draft</SelectItem>
               <SelectItem value="sent">Sent</SelectItem>
               <SelectItem value="accepted">Accepted</SelectItem>
               <SelectItem value="rejected">Rejected</SelectItem>
               <SelectItem value="revised">Revised</SelectItem>
             </SelectContent>
           </Select>
         </div>
 
         <div className="grid gap-4">
           {isLoading ? (
             <Card><CardContent className="py-8 text-center text-muted-foreground">Loading proposals...</CardContent></Card>
           ) : filteredProposals.length === 0 ? (
             <Card><CardContent className="py-8 text-center text-muted-foreground">No proposals found.</CardContent></Card>
           ) : (
             filteredProposals.map((proposal) => (
               <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                 <CardContent className="py-4">
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <h3 className="font-medium">{proposal.proposal_number}</h3>
                         <Badge className={statusColors[proposal.status]} variant="secondary">
                           {proposal.status}
                         </Badge>
                         {proposal.version > 1 && (
                           <Badge variant="outline">v{proposal.version}</Badge>
                         )}
                       </div>
                       <p className="text-sm font-medium text-foreground">{proposal.title}</p>
                       <p className="text-sm text-muted-foreground">{proposal.client_name}</p>
                       <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                         <span className="flex items-center gap-1">
                           <Calendar className="h-3 w-3" /> {formatDate(proposal.created_at)}
                         </span>
                         <span className="font-medium text-foreground">{formatCurrency(proposal.total_amount)}</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <Button variant="outline" size="sm" onClick={() => openEditDialog(proposal)}>
                         <Eye className="h-4 w-4 mr-1" /> View
                       </Button>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'draft')}>Mark as Draft</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'sent')}>Mark as Sent</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'accepted')}>Mark as Accepted</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'rejected')}>Mark as Rejected</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => createNewVersion(proposal)}>
                             <FileText className="h-4 w-4 mr-2" /> Create New Version
                           </DropdownMenuItem>
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
             <DialogTitle>{selectedProposal ? 'Edit Proposal' : 'New Proposal'}</DialogTitle>
             <DialogDescription>
               {selectedProposal ? `Proposal ${selectedProposal.proposal_number}` : 'Create a new proposal for a client'}
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
                 <Label>Company</Label>
                 <Input value={formData.client_company} onChange={(e) => setFormData({ ...formData, client_company: e.target.value })} />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label>Proposal Title *</Label>
               <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Website Development Proposal" />
             </div>
 
             <div className="space-y-2">
               <Label>Scope of Work</Label>
               <Textarea value={formData.scope_of_work} onChange={(e) => setFormData({ ...formData, scope_of_work: e.target.value })} rows={4} placeholder="Describe the project scope..." />
             </div>
 
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Timeline</Label>
                 <Textarea value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} rows={3} placeholder="Project timeline and milestones..." />
               </div>
               <div className="space-y-2">
                 <Label>Deliverables</Label>
                 <Textarea value={formData.deliverables} onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })} rows={3} placeholder="List of deliverables..." />
               </div>
             </div>
 
             <div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                 <Label>Pricing Summary</Label>
                 <Textarea value={formData.pricing_summary} onChange={(e) => setFormData({ ...formData, pricing_summary: e.target.value })} rows={3} placeholder="Pricing breakdown..." />
               </div>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label>Total Amount</Label>
                   <Input type="number" min="0" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })} />
                 </div>
                 <div className="space-y-2">
                   <Label>Valid Until</Label>
                   <Input type="date" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} />
                 </div>
               </div>
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
               <Button onClick={handleSave}>{selectedProposal ? 'Update Proposal' : 'Create Proposal'}</Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminProposals;