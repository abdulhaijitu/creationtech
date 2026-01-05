import { useEffect, useState } from 'react';
import { Eye, Mail, Phone, Calendar, MoreHorizontal, Search, Clock, Building } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
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

interface MeetingRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  meeting_topic: string;
  additional_notes: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminMeetings = () => {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<MeetingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchMeetings = async () => {
    try {
      let query = supabase
        .from('meeting_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load meeting requests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [statusFilter]);

  const openDetail = (meeting: MeetingRequest) => {
    setSelectedMeeting(meeting);
    setNotes(meeting.notes || '');
    setIsDetailOpen(true);
  };

  const updateStatus = async (meetingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('meeting_requests')
        .update({ status: newStatus })
        .eq('id', meetingId);

      if (error) throw error;

      toast({ title: 'Success', description: 'Status updated successfully' });
      fetchMeetings();

      if (selectedMeeting?.id === meetingId) {
        setSelectedMeeting({ ...selectedMeeting, status: newStatus });
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const saveNotes = async () => {
    if (!selectedMeeting) return;

    try {
      const { error } = await supabase
        .from('meeting_requests')
        .update({ notes })
        .eq('id', selectedMeeting.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Notes saved successfully' });
      fetchMeetings();
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.meeting_topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPreferredDate = (date: string | null) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Meeting Requests</h1>
          <p className="text-muted-foreground">Manage meeting booking requests</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meetings List */}
        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading meeting requests...
              </CardContent>
            </Card>
          ) : filteredMeetings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No meeting requests found.
              </CardContent>
            </Card>
          ) : (
            filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{meeting.full_name}</h3>
                        <Badge className={statusColors[meeting.status]} variant="secondary">
                          {meeting.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {meeting.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {meeting.phone}
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-2">{meeting.meeting_topic}</p>
                      {meeting.preferred_date && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Preferred: {formatPreferredDate(meeting.preferred_date)}
                          {meeting.preferred_time && ` at ${meeting.preferred_time}`}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Submitted: {formatDate(meeting.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openDetail(meeting)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateStatus(meeting.id, 'new')}>
                            Mark as New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(meeting.id, 'confirmed')}>
                            Mark as Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(meeting.id, 'completed')}>
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(meeting.id, 'cancelled')}>
                            Mark as Cancelled
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

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Meeting Request Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedMeeting && formatDate(selectedMeeting.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedMeeting.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Select
                      value={selectedMeeting.status}
                      onValueChange={(value) => updateStatus(selectedMeeting.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">
                    <a href={`mailto:${selectedMeeting.email}`} className="text-primary hover:underline">
                      {selectedMeeting.email}
                    </a>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">
                    <a href={`tel:${selectedMeeting.phone}`} className="text-primary hover:underline">
                      {selectedMeeting.phone}
                    </a>
                  </p>
                </div>
              </div>

              {selectedMeeting.company && (
                <div>
                  <Label className="text-muted-foreground">Company</Label>
                  <p className="font-medium">{selectedMeeting.company}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Meeting Topic</Label>
                <p className="font-medium">{selectedMeeting.meeting_topic}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Preferred Date</Label>
                  <p className="font-medium">{formatPreferredDate(selectedMeeting.preferred_date)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Preferred Time</Label>
                  <p className="font-medium">{selectedMeeting.preferred_time || 'Not specified'}</p>
                </div>
              </div>

              {selectedMeeting.additional_notes && (
                <div>
                  <Label className="text-muted-foreground">Additional Notes</Label>
                  <p className="whitespace-pre-wrap bg-muted p-3 rounded-lg text-sm mt-1">
                    {selectedMeeting.additional_notes}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this meeting request..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
                <Button onClick={saveNotes} size="sm">
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMeetings;
