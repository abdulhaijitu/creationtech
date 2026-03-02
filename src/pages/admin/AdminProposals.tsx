import { useEffect, useState } from 'react';
import { Eye, Plus, Search, Calendar, MoreHorizontal, FileText, ArrowLeft, Mail, CheckCircle, Download, Printer, MessageSquare } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProposalForm } from '@/components/admin/ProposalForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getStatusColor } from '@/lib/status-colors';
import { generateProposalPDF, CompanyInfo } from '@/utils/proposalPdfGenerator';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import companyLogo from '@/assets/logo.png';
import watermarkImage from '@/assets/jolchap.png';

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

type ViewMode = 'list' | 'form';

const AdminProposals = () => {
  const { toast } = useToast();
  const { data: businessInfo } = useBusinessInfoMap();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

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

  useEffect(() => {
    fetchProposals();
  }, []);

  const openCreateDialog = () => {
    setSelectedProposal(null);
    setViewMode('form');
  };

  const openEditDialog = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setViewMode('form');
  };

  const handleFormSave = () => {
    setViewMode('list');
    fetchProposals();
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedProposal(null);
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

      const { data: newProposal, error } = await supabase.from('proposals').insert({
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
        offer_letter: proposal.offer_letter,
        offer_letter_end: proposal.offer_letter_end,
        expected_outcome: proposal.expected_outcome,
        subtotal: proposal.subtotal,
        tax_rate: proposal.tax_rate,
        tax_amount: proposal.tax_amount,
        discount_amount: proposal.discount_amount,
        version: (proposal.version || 1) + 1,
        status: 'draft',
      }).select('id').single();

      if (error) throw error;

      const { data: existingItems } = await supabase
        .from('proposal_items')
        .select('description, quantity, unit_price, amount, display_order')
        .eq('proposal_id', proposal.id);

      if (existingItems && existingItems.length > 0 && newProposal) {
        await supabase.from('proposal_items').insert(
          existingItems.map(item => ({ ...item, proposal_id: newProposal.id }))
        );
      }

      await supabase.from('proposals').update({ status: 'revised' }).eq('id', proposal.id);
      toast({ title: 'Success', description: 'New version created' });
      fetchProposals();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const emailToClient = (proposal: Proposal) => {
    if (!proposal.client_email) {
      toast({ title: 'No Email', description: 'This client has no email address set.', variant: 'destructive' });
      return;
    }
    const subject = encodeURIComponent(`Proposal: ${proposal.proposal_number} - ${proposal.title}`);
    const body = encodeURIComponent(`Dear ${proposal.client_name},\n\nPlease find the proposal details for "${proposal.title}".\n\nProposal Number: ${proposal.proposal_number}\nTotal Amount: ৳${proposal.total_amount?.toLocaleString('en-BD') || '0'}\n\nBest regards`);
    window.open(`mailto:${proposal.client_email}?subject=${subject}&body=${body}`, '_self');
  };

  const handlePdfAction = async (proposal: Proposal, action: 'download' | 'print' | 'email') => {
    try {
      // Fetch proposal items
      const { data: items } = await supabase
        .from('proposal_items')
        .select('description, quantity, unit_price, amount')
        .eq('proposal_id', proposal.id)
        .order('display_order');

      const pdfData = {
        ...proposal,
        items: items || [],
      };

      if (action === 'email') {
        emailToClient(proposal);
      } else {
        await generateProposalPDF(pdfData, action, getCompanyInfo());
        toast({ title: 'Success', description: action === 'print' ? 'Opening print dialog...' : 'PDF downloaded' });
      }
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

  // Form View
  if (viewMode === 'form') {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <AdminPageHeader
            title={selectedProposal ? `Edit Proposal - ${selectedProposal.proposal_number}` : 'New Proposal'}
            description={selectedProposal ? 'Update proposal details' : 'Create a new proposal for a client'}
            action={
              <Button variant="outline" onClick={handleFormCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            }
          />
          <ProposalForm
            proposal={selectedProposal}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      </AdminLayout>
    );
  }

  // List View
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
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
                        <Badge className={getStatusColor(proposal.status)} variant="secondary">
                          {proposal.status}
                        </Badge>
                        {(proposal.version || 1) > 1 && (
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
                          <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'accepted')}>
                            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Accepted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'approved')}>
                            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'negotiation')}>
                            <MessageSquare className="h-4 w-4 mr-2" /> Mark as Negotiation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'rejected')}>Mark as Rejected</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePdfAction(proposal, 'download')}>
                            <Download className="h-4 w-4 mr-2" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePdfAction(proposal, 'print')}>
                            <Printer className="h-4 w-4 mr-2" /> Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePdfAction(proposal, 'email')}>
                            <Mail className="h-4 w-4 mr-2" /> Email to Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
    </AdminLayout>
  );
};

export default AdminProposals;
