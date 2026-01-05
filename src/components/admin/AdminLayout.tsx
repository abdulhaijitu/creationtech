import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  FileText,
  Users,
  MessageSquare,
  FileQuestion,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Careers', href: '/admin/careers', icon: Users },
  {
    label: 'Leads',
    icon: MessageSquare,
    children: [
      { label: 'Contact Messages', href: '/admin/leads/contacts', icon: MessageSquare },
      { label: 'Quote Requests', href: '/admin/leads/quotes', icon: FileQuestion },
      { label: 'Meeting Requests', href: '/admin/leads/meetings', icon: Calendar },
    ],
  },
  { label: 'Users', href: '/admin/users', icon: Users, adminOnly: true },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && role !== 'admin') return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-sm font-bold text-sidebar-primary-foreground">CT</span>
              </div>
              <span className="font-semibold">Admin Panel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {filteredNavItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="space-y-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            item.children.some(child => isActive(child.href))
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.href} asChild>
                            <Link
                              to={child.href}
                              className="flex items-center gap-2"
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              <child.icon className="h-4 w-4" />
                              {child.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  to={item.href!}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href!)
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-medium truncate max-w-[120px]">{user?.email}</p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">{role || 'User'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="lg:hidden" />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                View Site
              </a>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
