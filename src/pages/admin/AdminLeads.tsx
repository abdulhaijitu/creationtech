 import { useEffect, useState } from 'react';
 import { Eye, Mail, Phone, Calendar, MoreHorizontal, Search, MessageSquare, FileQuestion, CalendarDays } from 'lucide-react';
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
                 <DropdownMenuItem onClick={() => updateStatus(item.id, 'new', type)}>Mark New</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => updateStatus(item.id, 'contacted', type)}>Mark Contacted</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => updateStatus(item.id, 'in_progress', type)}>Mark In Progress</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => updateStatus(item.id, 'closed', type)}>Mark Closed</DropdownMenuItem>
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
       <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
         <DialogContent className="max-w-lg">
           <DialogHeader>
             <DialogTitle>
               {selectedType === 'contact' ? 'Contact' : selectedType === 'quote' ? 'Quote Request' : 'Meeting Request'} Details
             </DialogTitle>
             <DialogDescription>
               Submitted on {selectedItem && formatDate(selectedItem.created_at)}
             </DialogDescription>
           </DialogHeader>
 
           {selectedItem && (
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
             </div>
           )}
         </DialogContent>
       </Dialog>
     </AdminLayout>
   );
 };
 
 export default AdminLeads;