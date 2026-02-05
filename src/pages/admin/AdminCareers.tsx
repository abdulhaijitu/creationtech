import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Search, Download } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JobListing {
  id: string;
  title_en: string;
  title_bn: string | null;
  department: string | null;
  job_type: string | null;
  location: string | null;
  description_en: string | null;
  requirements: string[];
  is_active: boolean;
}

interface JobApplication {
  id: string;
  job_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  position: string;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  created_at: string;
}

import { getStatusColor } from '@/lib/status-colors';

const AdminCareers = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isAppDialogOpen, setIsAppDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [jobForm, setJobForm] = useState({
    title_en: '', title_bn: '', department: '', job_type: 'Full-time',
    location: '', description_en: '', requirements: '', is_active: true,
  });

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        supabase.from('job_listings').select('*').order('created_at', { ascending: false }),
        supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
      ]);

      if (jobsRes.error) throw jobsRes.error;
      if (appsRes.error) throw appsRes.error;

      setJobs((jobsRes.data || []).map(j => ({ ...j, requirements: Array.isArray(j.requirements) ? j.requirements : [] })));
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateJobDialog = () => {
    setSelectedJob(null);
    setJobForm({ title_en: '', title_bn: '', department: '', job_type: 'Full-time', location: '', description_en: '', requirements: '', is_active: true });
    setIsJobDialogOpen(true);
  };

  const openEditJobDialog = (job: JobListing) => {
    setSelectedJob(job);
    setJobForm({
      title_en: job.title_en,
      title_bn: job.title_bn || '',
      department: job.department || '',
      job_type: job.job_type || 'Full-time',
      location: job.location || '',
      description_en: job.description_en || '',
      requirements: job.requirements.join('\n'),
      is_active: job.is_active,
    });
    setIsJobDialogOpen(true);
  };

  const handleSaveJob = async () => {
    if (!jobForm.title_en) {
      toast({ title: 'Validation Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    setIsSaving(true);

    try {
      const requirementsArray = jobForm.requirements.split('\n').map(r => r.trim()).filter(r => r);
      const jobData = {
        title_en: jobForm.title_en,
        title_bn: jobForm.title_bn || null,
        department: jobForm.department || null,
        job_type: jobForm.job_type || null,
        location: jobForm.location || null,
        description_en: jobForm.description_en || null,
        requirements: requirementsArray,
        is_active: jobForm.is_active,
      };

      if (selectedJob) {
        const { error } = await supabase.from('job_listings').update(jobData).eq('id', selectedJob.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Job updated successfully' });
      } else {
        const { error } = await supabase.from('job_listings').insert(jobData);
        if (error) throw error;
        toast({ title: 'Success', description: 'Job created successfully' });
      }

      setIsJobDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save job', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    try {
      const { error } = await supabase.from('job_listings').delete().eq('id', selectedJob.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Job deleted' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('job_applications').update({ status: newStatus }).eq('id', appId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Status updated' });
      fetchData();
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Careers</h1>
          <p className="text-muted-foreground">Manage job listings and applications</p>
        </div>

        <Tabs defaultValue="jobs">
          <TabsList>
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.filter(a => a.status === 'new').length} new)</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openCreateJobDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </div>

            {isLoading ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
            ) : jobs.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No jobs yet.</CardContent></Card>
            ) : (
              jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium">{job.title_en}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {job.department && <span>{job.department}</span>}
                        {job.job_type && <Badge variant="outline">{job.job_type}</Badge>}
                        {job.location && <span>{job.location}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${job.is_active ? 'bg-success-muted text-success-muted-foreground' : 'bg-neutral-muted text-neutral-muted-foreground'}`}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => openEditJobDialog(job)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJob(job); setIsDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search applications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredApps.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No applications found.</CardContent></Card>
            ) : (
              filteredApps.map((app) => (
                <Card key={app.id}>
                  <CardContent className="flex items-start justify-between py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{app.full_name}</h3>
                        <Badge className={getStatusColor(app.status)} variant="secondary">{app.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{app.email}</p>
                      <p className="text-sm font-medium mt-1">Applied for: {app.position}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(app.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedApp(app); setIsAppDialogOpen(true); }}>
                        <Eye className="h-4 w-4 mr-1" />View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob ? 'Edit Job' : 'Add Job'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title (English) *</Label>
              <Input value={jobForm.title_en} onChange={(e) => setJobForm({ ...jobForm, title_en: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={jobForm.department} onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobForm.job_type} onValueChange={(v) => setJobForm({ ...jobForm, job_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={jobForm.description_en} onChange={(e) => setJobForm({ ...jobForm, description_en: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Requirements (one per line)</Label>
              <Textarea value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} rows={4} />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="is_active" checked={jobForm.is_active} onCheckedChange={(checked) => setJobForm({ ...jobForm, is_active: checked })} />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveJob} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Detail Dialog */}
      <Dialog open={isAppDialogOpen} onOpenChange={setIsAppDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedApp.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Select value={selectedApp.status} onValueChange={(v) => updateApplicationStatus(selectedApp.id, v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium"><a href={`mailto:${selectedApp.email}`} className="text-primary hover:underline">{selectedApp.email}</a></p>
              </div>
              {selectedApp.phone && (
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedApp.phone}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Position</Label>
                <p className="font-medium">{selectedApp.position}</p>
              </div>
              {selectedApp.cover_letter && (
                <div>
                  <Label className="text-muted-foreground">Cover Letter</Label>
                  <p className="whitespace-pre-wrap bg-muted p-3 rounded-lg text-sm mt-1">{selectedApp.cover_letter}</p>
                </div>
              )}
              {selectedApp.resume_url && (
                <div>
                  <Label className="text-muted-foreground">Resume</Label>
                  <Button variant="outline" size="sm" asChild className="mt-1">
                    <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" />Download Resume
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedJob?.title_en}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCareers;
