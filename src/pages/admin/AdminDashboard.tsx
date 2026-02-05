import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  FileQuestion,
  Calendar,
  Users,
  Briefcase,
  FileText,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Stats {
  contacts: number;
  quotes: number;
  meetings: number;
  applications: number;
  newContacts: number;
  newQuotes: number;
  newMeetings: number;
  newApplications: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalRevenue: number;
  pendingRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'invoice' | 'contact' | 'quote' | 'meeting';
  title: string;
  description: string;
  date: string;
  status?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    contacts: 0,
    quotes: 0,
    meetings: 0,
    applications: 0,
    newContacts: 0,
    newQuotes: 0,
    newMeetings: 0,
    newApplications: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contacts, quotes, meetings, applications, invoices, paidInvoicesData, pendingInvoicesData] = await Promise.all([
          supabase.from('contact_submissions').select('status', { count: 'exact' }),
          supabase.from('quote_requests').select('status', { count: 'exact' }),
          supabase.from('meeting_requests').select('status', { count: 'exact' }),
          supabase.from('job_applications').select('status', { count: 'exact' }),
          supabase.from('invoices').select('*', { count: 'exact' }),
          supabase.from('invoices').select('total').eq('status', 'paid'),
          supabase.from('invoices').select('total').in('status', ['sent', 'draft']),
        ]);

        const [newContacts, newQuotes, newMeetings, newApplications] = await Promise.all([
          supabase.from('contact_submissions').select('*', { count: 'exact' }).eq('status', 'new'),
          supabase.from('quote_requests').select('*', { count: 'exact' }).eq('status', 'new'),
          supabase.from('meeting_requests').select('*', { count: 'exact' }).eq('status', 'new'),
          supabase.from('job_applications').select('*', { count: 'exact' }).eq('status', 'new'),
        ]);

        const totalRevenue = paidInvoicesData.data?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
        const pendingRevenue = pendingInvoicesData.data?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;

        setStats({
          contacts: contacts.count || 0,
          quotes: quotes.count || 0,
          meetings: meetings.count || 0,
          applications: applications.count || 0,
          newContacts: newContacts.count || 0,
          newQuotes: newQuotes.count || 0,
          newMeetings: newMeetings.count || 0,
          newApplications: newApplications.count || 0,
          totalInvoices: invoices.count || 0,
          paidInvoices: paidInvoicesData.data?.length || 0,
          pendingInvoices: pendingInvoicesData.data?.length || 0,
          totalRevenue,
          pendingRevenue,
        });

        // Fetch recent activity
        const [recentInvoices, recentContacts, recentQuotes] = await Promise.all([
          supabase.from('invoices').select('id, invoice_number, client_name, total, status, created_at').order('created_at', { ascending: false }).limit(3),
          supabase.from('contact_submissions').select('id, full_name, subject, status, created_at').order('created_at', { ascending: false }).limit(2),
          supabase.from('quote_requests').select('id, full_name, service_interest, status, created_at').order('created_at', { ascending: false }).limit(2),
        ]);

        const activities: RecentActivity[] = [
          ...(recentInvoices.data?.map(inv => ({
            id: inv.id,
            type: 'invoice' as const,
            title: `Invoice ${inv.invoice_number}`,
            description: `${inv.client_name} - ৳${Number(inv.total).toLocaleString()}`,
            date: inv.created_at,
            status: inv.status,
          })) || []),
          ...(recentContacts.data?.map(c => ({
            id: c.id,
            type: 'contact' as const,
            title: 'New Contact',
            description: `${c.full_name} - ${c.subject || 'General inquiry'}`,
            date: c.created_at,
            status: c.status,
          })) || []),
          ...(recentQuotes.data?.map(q => ({
            id: q.id,
            type: 'quote' as const,
            title: 'Quote Request',
            description: `${q.full_name} - ${q.service_interest || 'Not specified'}`,
            date: q.created_at,
            status: q.status,
          })) || []),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const revenueCards = [
    {
      title: 'Total Revenue',
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pending Revenue',
      value: `৳${stats.pendingRevenue.toLocaleString()}`,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices,
      subtext: `${stats.paidInvoices} paid`,
      icon: Receipt,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: FileQuestion,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const leadCards = [
    {
      title: 'Contact Messages',
      total: stats.contacts,
      new: stats.newContacts,
      icon: MessageSquare,
      href: '/admin/leads/contacts',
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
    },
    {
      title: 'Quote Requests',
      total: stats.quotes,
      new: stats.newQuotes,
      icon: FileQuestion,
      href: '/admin/leads/quotes',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Meeting Requests',
      total: stats.meetings,
      new: stats.newMeetings,
      icon: Calendar,
      href: '/admin/leads/meetings',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      title: 'Job Applications',
      total: stats.applications,
      new: stats.newApplications,
      icon: Users,
      href: '/admin/careers',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const quickActions = [
    { label: 'Create Invoice', href: '/admin/invoices', icon: Receipt },
    { label: 'Write Blog Post', href: '/admin/blog', icon: FileText },
    { label: 'Manage Services', href: '/admin/services', icon: Briefcase },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invoice': return Receipt;
      case 'contact': return MessageSquare;
      case 'quote': return FileQuestion;
      case 'meeting': return Calendar;
      default: return FileText;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'new': return 'text-blue-600 bg-blue-50';
      case 'sent': return 'text-amber-600 bg-amber-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/admin/invoices">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Link>
            </Button>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {revenueCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : stat.value}</div>
                  {stat.subtext && (
                    <p className="text-xs text-accent flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {stat.subtext}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Leads Stats */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Leads & Applications</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leadCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isLoading ? '...' : stat.total}</div>
                    {stat.new > 0 && (
                      <p className="text-xs text-primary flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.new} new
                      </p>
                    )}
                    <Link
                      to={stat.href}
                      className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      View all
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your business</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3">
                        <div className="rounded-lg p-2 bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{activity.title}</p>
                            {activity.status && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {format(new Date(activity.date), 'MMM dd, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button key={action.label} variant="outline" asChild>
                      <Link to={action.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        {action.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-3">Getting Started</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Create invoices for your clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Monitor incoming leads and respond promptly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Update your services and portfolio</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
