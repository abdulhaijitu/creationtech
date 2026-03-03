import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Mail, Phone, Calendar, MoreHorizontal, Search, MessageSquare, FileQuestion, CalendarDays, Plus, UserPlus, Pencil, Trash2 } from 'lucide-react';
 import AdminLayout from '@/components/admin/AdminLayout';
 import AdminPageHeader from '@/components/admin/AdminPageHeader';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
 } from '@/components/ui/alert-dialog';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { useToast } from '@/hooks/use-toast';
 import { supabase } from '@/integrations/supabase/client';
 
 interface ContactSubmission {
   id: string;
   full_name: string;
   email: string;
   phone: string | null;
   subject: string | null;
   message: string;
   status: string;
   notes: string | null;
   created_at: string;
 }
 
 interface QuoteRequest {
   id: string;
   full_name: string;
   email: string;
   phone: string | null;
   company: string | null;
   service_interest: string | null;
   budget: string | null;
   project_details: string;
   status: string;
   notes: string | null;
   created_at: string;
 }
 
 interface MeetingRequest {
   id: string;
   full_name: string;
   email: string;
   phone: string;
   company: string | null;
   meeting_topic: string;
   preferred_date: string | null;
   preferred_time: string | null;
   additional_notes: string | null;
   status: string;
   notes: string | null;
   created_at: string;
 }
 
import { getStatusColor } from '@/lib/status-colors';
 
 const AdminLeads = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
   const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
   const [meetings, setMeetings] = useState<MeetingRequest[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
   const [selectedItem, setSelectedItem] = useState<any>(null);
   const [selectedType, setSelectedType] = useState<'contact' | 'quote' | 'meeting'>('contact');
   const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('contacts');

  // Add Lead states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState<'contact' | 'quote' | 'meeting'>('contact');
  const [addForm, setAddForm] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'contact' | 'quote' | 'meeting' } | null>(null);

  const resetAddForm = () => {
    setAddForm({});
    setAddType('contact');
  };

  const handleAddSubmit = async () => {
    const { full_name, email } = addForm;
    if (!full_name?.trim() || !email?.trim()) {
      toast({ title: 'Error', description: 'Name and email are required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      let error;
      if (addType === 'contact') {
        if (!addForm.message?.trim()) {
          toast({ title: 'Error', description: 'Message is required', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }
        ({ error } = await supabase.from('contact_submissions').insert({
          full_name: addForm.full_name.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone?.trim() || null,
          subject: addForm.subject?.trim() || null,
          message: addForm.message.trim(),
          status: 'new',
        }));
      } else if (addType === 'quote') {
        if (!addForm.project_details?.trim()) {
          toast({ title: 'Error', description: 'Project details are required', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }
        ({ error } = await supabase.from('quote_requests').insert({
          full_name: addForm.full_name.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone?.trim() || null,
          company: addForm.company?.trim() || null,
          service_interest: addForm.service_interest?.trim() || null,
          budget: addForm.budget?.trim() || null,
          project_details: addForm.project_details.trim(),
          status: 'new',
        }));
      } else {
        if (!addForm.phone?.trim() || !addForm.meeting_topic?.trim()) {
          toast({ title: 'Error', description: 'Phone and meeting topic are required', variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }
        ({ error } = await supabase.from('meeting_requests').insert({
          full_name: addForm.full_name.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone.trim(),
          company: addForm.company?.trim() || null,
          meeting_topic: addForm.meeting_topic.trim(),
          preferred_date: addForm.preferred_date || null,
          preferred_time: addForm.preferred_time || null,
          additional_notes: addForm.additional_notes?.trim() || null,
          status: 'new',
        }));
      }

      if (error) throw error;
      toast({ title: 'Success!', description: 'New lead added' });
      setIsAddOpen(false);
      resetAddForm();
      fetchData();
      // Switch to relevant tab
      if (addType === 'contact') setActiveTab('contacts');
      else if (addType === 'quote') setActiveTab('quotes');
      else setActiveTab('meetings');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
  };
 
   const fetchData = async () => {
     setIsLoading(true);
     try {
       const [contactsRes, quotesRes, meetingsRes] = await Promise.all([
         supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
         supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
         supabase.from('meeting_requests').select('*').order('created_at', { ascending: false }),
       ]);
 
       setContacts(contactsRes.data || []);
       setQuotes(quotesRes.data || []);
       setMeetings(meetingsRes.data || []);
     } catch (error) {
       console.error('Error fetching data:', error);
       toast({ title: 'Error', description: 'Failed to load leads', variant: 'destructive' });
     } finally {
       setIsLoading(false);
     }
   };
 
   useEffect(() => {
     fetchData();
   }, []);
 
   const openDetail = (item: any, type: 'contact' | 'quote' | 'meeting') => {
     setSelectedItem(item);
     setSelectedType(type);
     setNotes(item.notes || '');
     setIsDetailOpen(true);
   };
 
   const updateStatus = async (id: string, newStatus: string, type: 'contact' | 'quote' | 'meeting') => {
     const table = type === 'contact' ? 'contact_submissions' : type === 'quote' ? 'quote_requests' : 'meeting_requests';
     try {
       const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
       if (error) throw error;
       toast({ title: 'Success', description: 'Status updated' });
       fetchData();
       if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, status: newStatus });
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
   const saveNotes = async () => {
     if (!selectedItem) return;
     const table = selectedType === 'contact' ? 'contact_submissions' : selectedType === 'quote' ? 'quote_requests' : 'meeting_requests';
     try {
       const { error } = await supabase.from(table).update({ notes }).eq('id', selectedItem.id);
       if (error) throw error;
       toast({ title: 'Success', description: 'Notes saved' });
       fetchData();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };
 
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    const convertToClient = async () => {
      if (!selectedItem) return;
      setIsConverting(true);
      try {
        const { data: existing } = await supabase
          .from('clients')
          .select('id, name')
          .eq('email', selectedItem.email)
          .maybeSingle();

        if (existing) {
          toast({
            title: 'Client already exists',
            description: `"${existing.name}" is already a client with this email.`,
            variant: 'destructive',
          });
          setIsConverting(false);
          return;
        }

        const company = selectedItem.company || null;
        const leadSource = selectedType === 'contact' ? 'Contact Form' : selectedType === 'quote' ? 'Quote Request' : 'Meeting Request';

        const { data: newClient, error } = await supabase.from('clients').insert({
          name: selectedItem.full_name,
          email: selectedItem.email,
          phone: selectedItem.phone || null,
          company,
          notes: `Lead source: ${leadSource} (${new Date(selectedItem.created_at).toLocaleDateString()})`,
        }).select('id').single();

        if (error) throw error;

        // Update lead status to converted
        const table = selectedType === 'contact' ? 'contact_submissions' : selectedType === 'quote' ? 'quote_requests' : 'meeting_requests';
        await supabase.from(table).update({ status: 'converted' }).eq('id', selectedItem.id);
        setSelectedItem({ ...selectedItem, status: 'converted' });

        toast({
          title: 'Client created!',
          description: `"${selectedItem.full_name}" has been successfully converted to a client.`,
        });

        fetchData();

        if (newClient?.id) {
          setTimeout(() => {
            setIsDetailOpen(false);
            navigate(`/admin/clients/${newClient.id}`);
          }, 1000);
        }
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setIsConverting(false);
      }
    };
   const filterBySearch = (item: any) => {
     const search = searchQuery.toLowerCase();
     return item.full_name?.toLowerCase().includes(search) || item.email?.toLowerCase().includes(search);
   };
 
   const filterByStatus = (item: any) => statusFilter === 'all' || item.status === statusFilter;
 
   const filteredContacts = contacts.filter(filterBySearch).filter(filterByStatus);
   const filteredQuotes = quotes.filter(filterBySearch).filter(filterByStatus);
   const filteredMeetings = meetings.filter(filterBySearch).filter(filterByStatus);
 
   const newContactsCount = contacts.filter(c => c.status === 'new').length;
   const newQuotesCount = quotes.filter(q => q.status === 'new').length;
   const newMeetingsCount = meetings.filter(m => m.status === 'new').length;
 
   const getTableName = (type: 'contact' | 'quote' | 'meeting') =>
     type === 'contact' ? 'contact_submissions' as const : type === 'quote' ? 'quote_requests' as const : 'meeting_requests' as const;

   const openEdit = (item: any, type: 'contact' | 'quote' | 'meeting') => {
     setSelectedItem(item);
     setSelectedType(type);
     setIsEditing(true);
     setEditForm({
       full_name: item.full_name || '',
       email: item.email || '',
       phone: item.phone || '',
       subject: item.subject || '',
       message: item.message || '',
       company: item.company || '',
       service_interest: item.service_interest || '',
       budget: item.budget || '',
       project_details: item.project_details || '',
       meeting_topic: item.meeting_topic || '',
       preferred_date: item.preferred_date || '',
       preferred_time: item.preferred_time || '',
       additional_notes: item.additional_notes || '',
     });
     setNotes(item.notes || '');
     setIsDetailOpen(true);
   };

   const handleEditSubmit = async () => {
     if (!selectedItem) return;
     const table = getTableName(selectedType);
     setIsSubmitting(true);
     try {
       let updateData: Record<string, any> = {
         full_name: editForm.full_name?.trim(),
         email: editForm.email?.trim(),
         phone: editForm.phone?.trim() || null,
       };
       if (selectedType === 'contact') {
         updateData.subject = editForm.subject?.trim() || null;
         updateData.message = editForm.message?.trim();
       } else if (selectedType === 'quote') {
         updateData.company = editForm.company?.trim() || null;
         updateData.service_interest = editForm.service_interest?.trim() || null;
         updateData.budget = editForm.budget?.trim() || null;
         updateData.project_details = editForm.project_details?.trim();
       } else {
         updateData.company = editForm.company?.trim() || null;
         updateData.meeting_topic = editForm.meeting_topic?.trim();
         updateData.preferred_date = editForm.preferred_date || null;
         updateData.preferred_time = editForm.preferred_time || null;
         updateData.additional_notes = editForm.additional_notes?.trim() || null;
       }

       const { error } = await supabase.from(table).update(updateData).eq('id', selectedItem.id);
       if (error) throw error;
       toast({ title: 'Success', description: 'Lead updated successfully' });
       setIsEditing(false);
       setIsDetailOpen(false);
       fetchData();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     } finally {
       setIsSubmitting(false);
     }
   };

   const handleDelete = async () => {
     if (!deleteTarget) return;
     const table = getTableName(deleteTarget.type);
     try {
       const { error } = await supabase.from(table).delete().eq('id', deleteTarget.id);
       if (error) throw error;
       toast({ title: 'Deleted', description: 'Lead has been deleted' });
       if (selectedItem?.id === deleteTarget.id) setIsDetailOpen(false);
       setDeleteTarget(null);
       fetchData();
     } catch (error: any) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
     }
   };

   const updateEditField = (field: string, value: string) => {
     setEditForm(prev => ({ ...prev, [field]: value }));
   };

   const renderCard = (item: any, type: 'contact' | 'quote' | 'meeting') => (
     <Card key={item.id} className="hover:shadow-md transition-shadow">
       <CardContent className="py-4">
         <div className="flex items-start justify-between gap-4">
           <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1">
               <h3 className="font-medium truncate">{item.full_name}</h3>
                <Badge className={getStatusColor(item.status)} variant="secondary">
                 {item.status?.replace('_', ' ')}
               </Badge>
             </div>
             <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
               <Mail className="h-3 w-3" /> {item.email}
             </p>
             {type === 'contact' && item.subject && (
               <p className="text-sm font-medium mt-1">{item.subject}</p>
             )}
             {type === 'quote' && item.service_interest && (
               <p className="text-sm font-medium mt-1">Service: {item.service_interest}</p>
             )}
             {type === 'meeting' && (
               <p className="text-sm font-medium mt-1">{item.meeting_topic}</p>
             )}
             <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
               <Calendar className="h-3 w-3" /> {formatDate(item.created_at)}
             </p>
           </div>
           <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" onClick={() => openDetail(item, type)}>
               <Eye className="h-4 w-4 mr-1" /> View
             </Button>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
               </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                   <DropdownMenuItem onClick={() => openEdit(item, type)}>
                     <Pencil className="h-4 w-4 mr-2" /> Edit
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => updateStatus(item.id, 'new', type)}>Mark New</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => updateStatus(item.id, 'contacted', type)}>Mark Contacted</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => updateStatus(item.id, 'in_progress', type)}>Mark In Progress</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => updateStatus(item.id, 'converted', type)}>Mark Converted</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => updateStatus(item.id, 'closed', type)}>Mark Closed</DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget({ id: item.id, type })}>
                     <Trash2 className="h-4 w-4 mr-2" /> Delete
                   </DropdownMenuItem>
                 </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </div>
       </CardContent>
     </Card>
   );
 
   return (
     <AdminLayout>
       <div className="space-y-6">
          <AdminPageHeader
            title="Leads"
            description="Manage contact messages, quote requests, and meeting bookings"
            action={
              <Button onClick={() => { resetAddForm(); setIsAddOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Add Lead
              </Button>
            }
          />
 
         {/* Stats Cards */}
         <div className="grid gap-4 md:grid-cols-3">
           <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('contacts')}>
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Contact Messages</p>
                   <p className="text-2xl font-bold">{contacts.length}</p>
                 </div>
                <div className="h-12 w-12 rounded-full bg-info-muted flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-info" />
                 </div>
               </div>
               {newContactsCount > 0 && (
                <Badge variant="secondary" className="mt-2 bg-info-muted text-info">{newContactsCount} new</Badge>
               )}
             </CardContent>
           </Card>
           <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('quotes')}>
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Quote Requests</p>
                   <p className="text-2xl font-bold">{quotes.length}</p>
                 </div>
                <div className="h-12 w-12 rounded-full bg-success-muted flex items-center justify-center">
                  <FileQuestion className="h-6 w-6 text-success" />
                 </div>
               </div>
               {newQuotesCount > 0 && (
                <Badge variant="secondary" className="mt-2 bg-success-muted text-success">{newQuotesCount} new</Badge>
               )}
             </CardContent>
           </Card>
           <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('meetings')}>
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Meeting Requests</p>
                   <p className="text-2xl font-bold">{meetings.length}</p>
                 </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-accent" />
                 </div>
               </div>
               {newMeetingsCount > 0 && (
                <Badge variant="secondary" className="mt-2 bg-accent/10 text-accent">{newMeetingsCount} new</Badge>
               )}
             </CardContent>
           </Card>
         </div>
 
         {/* Filters */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
             <Input
               placeholder="Search leads..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10"
             />
           </div>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
             <SelectTrigger className="w-[150px]">
               <SelectValue placeholder="Filter status" />
             </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
           </Select>
         </div>
 
         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
           <TabsList className="grid w-full grid-cols-3">
             <TabsTrigger value="contacts" className="gap-2">
               <MessageSquare className="h-4 w-4" /> Contacts
               {newContactsCount > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5">{newContactsCount}</Badge>}
             </TabsTrigger>
             <TabsTrigger value="quotes" className="gap-2">
               <FileQuestion className="h-4 w-4" /> Quotes
               {newQuotesCount > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5">{newQuotesCount}</Badge>}
             </TabsTrigger>
             <TabsTrigger value="meetings" className="gap-2">
               <CalendarDays className="h-4 w-4" /> Meetings
               {newMeetingsCount > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5">{newMeetingsCount}</Badge>}
             </TabsTrigger>
           </TabsList>
 
           <TabsContent value="contacts" className="mt-4 space-y-4">
             {isLoading ? (
               <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
             ) : filteredContacts.length === 0 ? (
               <Card><CardContent className="py-8 text-center text-muted-foreground">No contacts found.</CardContent></Card>
             ) : (
               filteredContacts.map(c => renderCard(c, 'contact'))
             )}
           </TabsContent>
 
           <TabsContent value="quotes" className="mt-4 space-y-4">
             {isLoading ? (
               <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
             ) : filteredQuotes.length === 0 ? (
               <Card><CardContent className="py-8 text-center text-muted-foreground">No quote requests found.</CardContent></Card>
             ) : (
               filteredQuotes.map(q => renderCard(q, 'quote'))
             )}
           </TabsContent>
 
           <TabsContent value="meetings" className="mt-4 space-y-4">
             {isLoading ? (
               <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
             ) : filteredMeetings.length === 0 ? (
               <Card><CardContent className="py-8 text-center text-muted-foreground">No meeting requests found.</CardContent></Card>
             ) : (
               filteredMeetings.map(m => renderCard(m, 'meeting'))
             )}
           </TabsContent>
         </Tabs>
       </div>
 
        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={(open) => { setIsDetailOpen(open); if (!open) setIsEditing(false); }}>
       <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
           <DialogHeader>
               <div className="flex items-center justify-between">
                 <DialogTitle>
                   {isEditing ? 'Edit' : ''} {selectedType === 'contact' ? 'Contact' : selectedType === 'quote' ? 'Quote Request' : 'Meeting Request'} {isEditing ? '' : 'Details'}
                 </DialogTitle>
                 {selectedItem && !isEditing && (
                   <div className="flex items-center gap-1">
                     <Button variant="ghost" size="icon" onClick={() => openEdit(selectedItem, selectedType)}>
                       <Pencil className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { setDeleteTarget({ id: selectedItem.id, type: selectedType }); }}>
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                 )}
               </div>
              <DialogDescription>
                {isEditing ? 'Update the lead information below' : `Submitted on ${selectedItem && formatDate(selectedItem.created_at)}`}
              </DialogDescription>
            </DialogHeader>
 
            {selectedItem && !isEditing && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedItem.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Select
                      value={selectedItem.status}
                      onValueChange={(value) => updateStatus(selectedItem.id, value, selectedType)}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="new">New</SelectItem>
                         <SelectItem value="contacted">Contacted</SelectItem>
                         <SelectItem value="in_progress">In Progress</SelectItem>
                         <SelectItem value="converted">Converted</SelectItem>
                         <SelectItem value="closed">Closed</SelectItem>
                       </SelectContent>
                    </Select>
                  </div>
                </div>
 
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p><a href={`mailto:${selectedItem.email}`} className="text-primary hover:underline">{selectedItem.email}</a></p>
                </div>
 
                {selectedItem.phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p><a href={`tel:${selectedItem.phone}`} className="text-primary hover:underline">{selectedItem.phone}</a></p>
                  </div>
                )}
 
                {selectedType === 'contact' && selectedItem.message && (
                  <div>
                    <Label className="text-muted-foreground">Message</Label>
                    <p className="whitespace-pre-wrap bg-muted p-3 rounded-lg text-sm mt-1">{selectedItem.message}</p>
                  </div>
                )}
 
                {selectedType === 'quote' && (
                  <>
                    {selectedItem.service_interest && (
                      <div>
                        <Label className="text-muted-foreground">Service Interest</Label>
                        <p className="font-medium">{selectedItem.service_interest}</p>
                      </div>
                    )}
                    {selectedItem.budget && (
                      <div>
                        <Label className="text-muted-foreground">Budget</Label>
                        <p className="font-medium">{selectedItem.budget}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-muted-foreground">Project Details</Label>
                      <p className="whitespace-pre-wrap bg-muted p-3 rounded-lg text-sm mt-1">{selectedItem.project_details}</p>
                    </div>
                  </>
                )}
 
                {selectedType === 'meeting' && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Meeting Topic</Label>
                      <p className="font-medium">{selectedItem.meeting_topic}</p>
                    </div>
                    {selectedItem.preferred_date && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label className="text-muted-foreground">Preferred Date</Label>
                          <p className="font-medium">{new Date(selectedItem.preferred_date).toLocaleDateString()}</p>
                        </div>
                        {selectedItem.preferred_time && (
                          <div>
                            <Label className="text-muted-foreground">Preferred Time</Label>
                            <p className="font-medium">{selectedItem.preferred_time}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
 
                 <div className="space-y-2">
                   <Label htmlFor="notes">Internal Notes</Label>
                   <Textarea
                     id="notes"
                     placeholder="Add notes..."
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                     rows={3}
                   />
                   <Button onClick={saveNotes} size="sm">Save Notes</Button>
                 </div>

                 {/* Convert to Client */}
                 {selectedItem.status !== 'converted' && (
                   <div className="border-t pt-4">
                     <Button
                       onClick={convertToClient}
                       disabled={isConverting}
                       variant="outline"
                       className="w-full gap-2"
                     >
                       <UserPlus className="h-4 w-4" />
                       {isConverting ? 'Converting...' : 'Convert to Client'}
                     </Button>
                     <p className="text-xs text-muted-foreground mt-1 text-center">
                       A new client will be created from this lead's info
                     </p>
                   </div>
                 )}
                 {selectedItem.status === 'converted' && (
                   <div className="border-t pt-4">
                     <Badge className="bg-success-muted text-success w-full justify-center py-1.5">
                       ✓ Converted to Client
                     </Badge>
                   </div>
                 )}
              </div>
            )}

            {/* Edit Mode */}
            {selectedItem && isEditing && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input value={editForm.full_name || ''} onChange={(e) => updateEditField('full_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={editForm.email || ''} onChange={(e) => updateEditField('email', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={editForm.phone || ''} onChange={(e) => updateEditField('phone', e.target.value)} />
                </div>

                {selectedType === 'contact' && (
                  <>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input value={editForm.subject || ''} onChange={(e) => updateEditField('subject', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Message *</Label>
                      <Textarea value={editForm.message || ''} onChange={(e) => updateEditField('message', e.target.value)} rows={3} />
                    </div>
                  </>
                )}

                {selectedType === 'quote' && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={editForm.company || ''} onChange={(e) => updateEditField('company', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Service</Label>
                        <Input value={editForm.service_interest || ''} onChange={(e) => updateEditField('service_interest', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Budget</Label>
                      <Input value={editForm.budget || ''} onChange={(e) => updateEditField('budget', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Details *</Label>
                      <Textarea value={editForm.project_details || ''} onChange={(e) => updateEditField('project_details', e.target.value)} rows={3} />
                    </div>
                  </>
                )}

                {selectedType === 'meeting' && (
                  <>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={editForm.company || ''} onChange={(e) => updateEditField('company', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Meeting Topic *</Label>
                      <Input value={editForm.meeting_topic || ''} onChange={(e) => updateEditField('meeting_topic', e.target.value)} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Preferred Date</Label>
                        <Input type="date" value={editForm.preferred_date || ''} onChange={(e) => updateEditField('preferred_date', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Time</Label>
                        <Input type="time" value={editForm.preferred_time || ''} onChange={(e) => updateEditField('preferred_time', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea value={editForm.additional_notes || ''} onChange={(e) => updateEditField('additional_notes', e.target.value)} rows={3} />
                    </div>
                  </>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleEditSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
         </Dialog>

        {/* Add Lead Dialog */}
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetAddForm(); }}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Add New Lead</DialogTitle>
               <DialogDescription>Select lead type and fill in the details</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Lead Type</Label>
                <Select value={addType} onValueChange={(v: 'contact' | 'quote' | 'meeting') => { setAddType(v); setAddForm({}); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">Contact Message</SelectItem>
                    <SelectItem value="quote">Quote Request</SelectItem>
                    <SelectItem value="meeting">Meeting Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Common fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                   <Label>Name *</Label>
                   <Input placeholder="Full name" value={addForm.full_name || ''} onChange={(e) => updateField('full_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" placeholder="email@example.com" value={addForm.email || ''} onChange={(e) => updateField('email', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                 <Label>Phone {addType === 'meeting' ? '*' : ''}</Label>
                 <Input placeholder="Phone number" value={addForm.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
              </div>

              {/* Contact-specific */}
              {addType === 'contact' && (
                <>
                  <div className="space-y-2">
                     <Label>Subject</Label>
                     <Input placeholder="Subject" value={addForm.subject || ''} onChange={(e) => updateField('subject', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                     <Label>Message *</Label>
                     <Textarea placeholder="Write your message..." value={addForm.message || ''} onChange={(e) => updateField('message', e.target.value)} rows={3} />
                  </div>
                </>
              )}

              {/* Quote-specific */}
              {addType === 'quote' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                       <Label>Company</Label>
                       <Input placeholder="Company name" value={addForm.company || ''} onChange={(e) => updateField('company', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <Label>Service</Label>
                       <Input placeholder="Service interest" value={addForm.service_interest || ''} onChange={(e) => updateField('service_interest', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <Label>Budget</Label>
                     <Input placeholder="Budget range" value={addForm.budget || ''} onChange={(e) => updateField('budget', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                     <Label>Project Details *</Label>
                     <Textarea placeholder="Project description..." value={addForm.project_details || ''} onChange={(e) => updateField('project_details', e.target.value)} rows={3} />
                  </div>
                </>
              )}

              {/* Meeting-specific */}
              {addType === 'meeting' && (
                <>
                  <div className="space-y-2">
                     <Label>Company</Label>
                     <Input placeholder="Company name" value={addForm.company || ''} onChange={(e) => updateField('company', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                     <Label>Meeting Topic *</Label>
                     <Input placeholder="Meeting topic" value={addForm.meeting_topic || ''} onChange={(e) => updateField('meeting_topic', e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Preferred Date</Label>
                      <Input type="date" value={addForm.preferred_date || ''} onChange={(e) => updateField('preferred_date', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Time</Label>
                      <Input type="time" value={addForm.preferred_time || ''} onChange={(e) => updateField('preferred_time', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <Label>Additional Notes</Label>
                     <Textarea placeholder="Additional information..." value={addForm.additional_notes || ''} onChange={(e) => updateField('additional_notes', e.target.value)} rows={3} />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
               <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
               <Button onClick={handleAddSubmit} disabled={isSubmitting}>
                 {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
         </Dialog>

         {/* Delete Confirmation */}
         <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
           <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle>Delete Lead</AlertDialogTitle>
               <AlertDialogDescription>
                 Are you sure you want to delete this lead? This action cannot be undone.
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                 Delete
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
       </AdminLayout>
   );
 };
 
 export default AdminLeads;