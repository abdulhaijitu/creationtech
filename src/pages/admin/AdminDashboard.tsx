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
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  contacts: number;
  quotes: number;
  meetings: number;
  applications: number;
  newContacts: number;
  newQuotes: number;
  newMeetings: number;
  newApplications: number;
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
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contacts, quotes, meetings, applications] = await Promise.all([
          supabase.from('contact_submissions').select('status', { count: 'exact' }),
          supabase.from('quote_requests').select('status', { count: 'exact' }),
          supabase.from('meeting_requests').select('status', { count: 'exact' }),
          supabase.from('job_applications').select('status', { count: 'exact' }),
        ]);

        const [newContacts, newQuotes, newMeetings, newApplications] = await Promise.all([
          supabase.from('contact_submissions').select('*', { count: 'exact' }).eq('status', 'new'),
          supabase.from('quote_requests').select('*', { count: 'exact' }).eq('status', 'new'),
          supabase.from('meeting_requests').select('*', { count: 'exact' }).eq('status', 'new'),
          supabase.from('job_applications').select('*', { count: 'exact' }).eq('status', 'new'),
        ]);

        setStats({
          contacts: contacts.count || 0,
          quotes: quotes.count || 0,
          meetings: meetings.count || 0,
          applications: applications.count || 0,
          newContacts: newContacts.count || 0,
          newQuotes: newQuotes.count || 0,
          newMeetings: newMeetings.count || 0,
          newApplications: newApplications.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Contact Messages',
      total: stats.contacts,
      new: stats.newContacts,
      icon: MessageSquare,
      href: '/admin/leads/contacts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Quote Requests',
      total: stats.quotes,
      new: stats.newQuotes,
      icon: FileQuestion,
      href: '/admin/leads/quotes',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Meeting Requests',
      total: stats.meetings,
      new: stats.newMeetings,
      icon: Calendar,
      href: '/admin/leads/meetings',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
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
    { label: 'Manage Services', href: '/admin/services', icon: Briefcase },
    { label: 'Write Blog Post', href: '/admin/blog', icon: FileText },
    { label: 'View Applications', href: '/admin/careers', icon: Users },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
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
                    <p className="text-xs text-accent flex items-center gap-1 mt-1">
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Tips to manage your website effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Add your services to showcase your offerings to potential clients</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Upload portfolio projects to demonstrate your expertise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Write blog posts to improve SEO and establish thought leadership</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Monitor incoming leads and respond promptly to inquiries</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
