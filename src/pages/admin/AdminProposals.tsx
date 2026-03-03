import { useMemo, useState, useCallback } from 'react';
import { Eye, Plus, Search, Calendar, MoreHorizontal, FileText, ArrowLeft, Mail, CheckCircle, Download, Printer, MessageSquare, ExternalLink, FileEdit, Send, XCircle, LayoutList, Table2, DollarSign, Clock, FileCheck, Copy } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProposalForm } from '@/components/admin/ProposalForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getStatusColor } from '@/lib/status-colors';
import { generateProposalPDF, CompanyInfo } from '@/utils/proposalPdfGenerator';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
type ListMode = 'card' | 'table';

// Utilities outside component to avoid re-creation
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const formatCurrency = (amount: number | null) =>
  amount ? `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}` : '-';

const fetchProposals = async (): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Proposal[];
};

const AdminProposals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: businessInfo } = useBusinessInfoMap();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [listMode, setListMode] = useState<ListMode>('card');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: fetchProposals,
  });

  const getCompanyInfo = useCallback((): CompanyInfo => ({
    name: businessInfo?.company_name?.value_en || 'Creation Tech',
    tagline: businessInfo?.tagline?.value_en || '-PRIME TECH PARTNER-',
    address: businessInfo?.address?.value_en || 'Dhaka, Bangladesh',
    phone: businessInfo?.phone_primary?.value_en || '+880 1XXX-XXXXXX',
    email: businessInfo?.email_primary?.value_en || 'info@creationtech.com',
    website: businessInfo?.website?.value_en || 'www.creationtech.com',
    logo_url: businessInfo?.company_logo?.value_en || companyLogo,
    watermark_url: watermarkImage,
  }), [businessInfo]);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('proposals').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Status updated' });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const versionMutation = useMutation({
    mutationFn: async (proposal: Proposal) => {
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
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'New version created' });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: async (proposal: Proposal) => {
      const { data: numData } = await supabase.rpc('generate_proposal_number');
      const proposalNumber = numData || `PRO-${Date.now()}`;

      const { data: newProposal, error } = await supabase.from('proposals').insert({
        proposal_number: proposalNumber,
        client_id: proposal.client_id,
        client_name: proposal.client_name,
        client_email: proposal.client_email,
        client_phone: proposal.client_phone,
        client_company: proposal.client_company,
        title: `${proposal.title} (Clone)`,
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
        version: 1,
        status: 'draft',
      }).select('id').single();

      if (error) throw error;

      const { data: existingItems } = await supabase
        .from('proposal_items')
        .select('description, quantity, unit_price, amount, display_order, billing_type')
        .eq('proposal_id', proposal.id);

      if (existingItems && existingItems.length > 0 && newProposal) {
        await supabase.from('proposal_items').insert(
          existingItems.map(item => ({ ...item, proposal_id: newProposal.id }))
        );
      }
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Proposal cloned successfully' });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.proposal_number.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.client_name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [proposals, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = proposals.length;
    const draft = proposals.filter(p => p.status === 'draft').length;
    const active = proposals.filter(p => ['sent', 'accepted', 'approved'].includes(p.status)).length;
    const totalValue = proposals.reduce((sum, p) => sum + (p.total_amount || 0), 0);
    return { total, draft, active, totalValue };
  }, [proposals]);

  const openCreateDialog = useCallback(() => {
    setSelectedProposal(null);
    setViewMode('form');
  }, []);

  const openEditDialog = useCallback((proposal: Proposal) => {
    setSelectedProposal(proposal);
    setViewMode('form');
  }, []);

  const handleFormSave = useCallback(() => {
    setViewMode('list');
    queryClient.invalidateQueries({ queryKey: ['proposals'] });
  }, [queryClient]);

  const handleFormCancel = useCallback(() => {
    setViewMode('list');
    setSelectedProposal(null);
  }, []);

  const emailToClient = useCallback((proposal: Proposal) => {
    if (!proposal.client_email) {
      toast({ title: 'No Email', description: 'This client has no email address set.', variant: 'destructive' });
      return;
    }
    const subject = encodeURIComponent(`Proposal: ${proposal.proposal_number} - ${proposal.title}`);
    const body = encodeURIComponent(`Dear ${proposal.client_name},\n\nPlease find the proposal details for "${proposal.title}".\n\nProposal Number: ${proposal.proposal_number}\nTotal Amount: ৳${proposal.total_amount?.toLocaleString('en-BD') || '0'}\n\nBest regards`);
    window.open(`mailto:${proposal.client_email}?subject=${subject}&body=${body}`, '_self');
  }, [toast]);

  const handlePdfAction = useCallback(async (proposal: Proposal, action: 'download' | 'print' | 'email' | 'preview') => {
    try {
      const { data: items } = await supabase
        .from('proposal_items')
        .select('description, quantity, unit_price, amount, billing_type')
        .eq('proposal_id', proposal.id)
        .order('display_order');

      const pdfData = { ...proposal, items: (items || []).map(i => ({ ...i, billing_type: (i.billing_type || 'one_time') as 'one_time' | 'monthly' | 'yearly' })) };

      if (action === 'email') {
        emailToClient(proposal);
      } else {
        await generateProposalPDF(pdfData, action, getCompanyInfo());
        toast({ title: 'Success', description: action === 'print' ? 'Opening print dialog...' : 'PDF downloaded' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }, [emailToClient, getCompanyInfo, toast]);

  const renderDropdownActions = useCallback((proposal: Proposal) => (
    <DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto">
      <DropdownMenuItem onClick={() => statusMutation.mutate({ id: proposal.id, status: 'draft' })}>
        <FileEdit className="h-4 w-4 mr-2" /> Mark as Draft
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => statusMutation.mutate({ id: proposal.id, status: 'sent' })}>
        <Send className="h-4 w-4 mr-2" /> Mark as Sent
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => statusMutation.mutate({ id: proposal.id, status: 'accepted' })}>
        <CheckCircle className="h-4 w-4 mr-2" /> Mark as Accepted
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => statusMutation.mutate({ id: proposal.id, status: 'approved' })}>
        <CheckCircle className="h-4 w-4 mr-2" /> Mark as Approved
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => statusMutation.mutate({ id: proposal.id, status: 'negotiation' })}>
        <MessageSquare className="h-4 w-4 mr-2" /> Mark as Negotiation
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => statusMutation.mutate({ id: proposal.id, status: 'rejected' })}>
        <XCircle className="h-4 w-4 mr-2" /> Mark as Rejected
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => handlePdfAction(proposal, 'preview')}>
        <ExternalLink className="h-4 w-4 mr-2" /> Preview PDF
      </DropdownMenuItem>
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
      <DropdownMenuItem onClick={() => versionMutation.mutate(proposal)}>
        <FileText className="h-4 w-4 mr-2" /> Create New Version
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => cloneMutation.mutate(proposal)}>
        <Copy className="h-4 w-4 mr-2" /> Clone Proposal
      </DropdownMenuItem>
    </DropdownMenuContent>
  ), [statusMutation, versionMutation, cloneMutation, handlePdfAction]);

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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Draft</p>
                <p className="text-lg font-semibold">{stats.draft}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <FileCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-lg font-semibold">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-lg font-semibold">{formatCurrency(stats.totalValue)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter status" />
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
            <div className="hidden md:flex border rounded-md">
              <Button
                variant={listMode === 'card' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setListMode('card')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={listMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setListMode('table')}
              >
                <Table2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <AdminLoadingSkeleton rows={4} type={listMode === 'table' ? 'table' : 'card'} />
        ) : filteredProposals.length === 0 ? (
          <AdminEmptyState
            icon={FileText}
            title="No proposals found"
            description="Create your first proposal to get started, or adjust your filters."
            action={
              <Button onClick={openCreateDialog} size="sm">
                <Plus className="h-4 w-4 mr-2" /> New Proposal
              </Button>
            }
          />
        ) : listMode === 'table' ? (
          /* Table View */
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id} className="cursor-pointer" onClick={() => openEditDialog(proposal)}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {proposal.proposal_number}
                        {(proposal.version || 1) > 1 && (
                          <Badge variant="outline" className="ml-1.5 text-[10px] px-1 py-0">v{proposal.version}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{proposal.title}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {proposal.client_name}
                        {proposal.client_company && (
                          <span className="text-muted-foreground text-xs ml-1">({proposal.client_company})</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(proposal.status)} capitalize`} variant="secondary">
                          {proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium whitespace-nowrap">{formatCurrency(proposal.total_amount)}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">{formatDate(proposal.created_at)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          {renderDropdownActions(proposal)}
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          /* Card View */
          <div className="grid gap-3">
            {filteredProposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium">{proposal.proposal_number}</h3>
                        <Badge className={`${getStatusColor(proposal.status)} capitalize`} variant="secondary">
                          {proposal.status}
                        </Badge>
                        {(proposal.version || 1) > 1 && (
                          <Badge variant="outline">v{proposal.version}</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">{proposal.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {proposal.client_name}
                        {proposal.client_company && (
                          <span className="text-xs ml-1">· {proposal.client_company}</span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(proposal.created_at)}
                        </span>
                        <span className="font-medium text-foreground">{formatCurrency(proposal.total_amount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(proposal)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        {renderDropdownActions(proposal)}
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProposals;
