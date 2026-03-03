import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Receipt,
  UserCircle,
  ClipboardList,
  FileSignature,
  CreditCard,
  ShieldCheck,
  Package,
  Cog,
  Wallet,
  Smartphone,
  UserCog,
  Sliders,
  LogOut,
  FolderKanban,
  Star,
  GraduationCap,
  ChevronsUpDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const sidebarVariants = {
  open: { width: '15rem' },
  closed: { width: '3.05rem' },
};

const contentVariants = {
  open: { display: 'block', opacity: 1 },
  closed: { display: 'block', opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: 'tween' as const,
  ease: 'easeOut' as const,
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

const navGroups = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Sales & Clients',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: MessageSquare },
      { label: 'Clients', href: '/admin/clients', icon: UserCircle },
      { label: 'Invoices', href: '/admin/invoices', icon: Receipt },
      { label: 'Payments', href: '/admin/payments', icon: CreditCard },
      { label: 'Quotations', href: '/admin/quotations', icon: ClipboardList },
      { label: 'Proposals', href: '/admin/proposals', icon: FileSignature },
    ],
  },
  {
    label: 'Products & Services',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Services', href: '/admin/services', icon: Briefcase },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Portfolio', href: '/admin/portfolio', icon: FolderKanban },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
    ],
  },
  {
    label: 'Settings',
    adminOnly: true,
    items: [
      { label: 'General', href: '/admin/settings', icon: Cog },
      { label: 'Preferences', href: '/admin/settings/system', icon: Sliders },
      { label: 'Payment Gateway', href: '/admin/settings/payment', icon: Wallet },
      { label: 'SMS Settings', href: '/admin/settings/sms', icon: Smartphone },
    ],
  },
  {
    label: 'Team',
    adminOnly: true,
    items: [
      { label: 'User Management', href: '/admin/users', icon: UserCog },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
      { label: 'Careers', href: '/admin/careers', icon: GraduationCap },
    ],
  },
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const { user, role, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  const filteredNavGroups = navGroups.filter(group => {
    if ('adminOnly' in group && group.adminOnly && role !== 'admin') return false;
    return true;
  });

  return (
    <motion.div
      className={cn('sidebar fixed left-0 top-0 z-40 h-screen border-r border-border bg-background shrink-0')}
      variants={sidebarVariants}
      animate={isCollapsed ? 'closed' : 'open'}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div className="flex h-full flex-col" variants={contentVariants}>
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center border-b border-border px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex w-full cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-accent">
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                      CT
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <motion.span
                        variants={variants}
                        className="text-sm font-semibold truncate"
                      >
                        Creation Tech
                      </motion.span>
                      <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="flex items-center gap-2">
                    <Cog className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/users" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" /> Manage Users
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Nav */}
          <ScrollArea className="flex-1 px-2 py-2">
            <div className="flex flex-col gap-1">
              {filteredNavGroups.map((group, groupIdx) => (
                <div key={group.label}>
                  {groupIdx > 0 && <Separator className="my-2" />}
                  {!isCollapsed && (
                    <motion.span
                      variants={variants}
                      className="mb-1 block px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {group.label}
                    </motion.span>
                  )}
                  {group.items.map((item) => (
                    <li key={item.href} className="list-none">
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors',
                          isActive(item.href)
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && (
                          <motion.span variants={variants} className="truncate">
                            {item.label}
                          </motion.span>
                        )}
                      </Link>
                    </li>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border px-2 py-2">
            <Link
              to="/admin/settings"
              className={cn(
                'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors',
                isActive('/admin/settings') && 'bg-accent text-accent-foreground font-medium'
              )}
            >
              <Cog className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <motion.span variants={variants} className="truncate">
                  Settings
                </motion.span>
              )}
            </Link>
            <Separator className="my-2" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex w-full cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-accent">
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarFallback className="bg-muted text-[10px] font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="flex flex-col overflow-hidden">
                        <motion.span variants={variants} className="text-sm font-medium truncate">
                          {user?.email?.split('@')[0] || 'Account'}
                        </motion.span>
                        <motion.span variants={variants} className="text-[10px] text-muted-foreground truncate">
                          {user?.email || ''}
                        </motion.span>
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-xs font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{user?.email?.split('@')[0]}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
};

export default AdminSidebar;
