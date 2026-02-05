 import { Link, useLocation } from 'react-router-dom';
 import {
   LayoutDashboard,
   Briefcase,
   MessageSquare,
   Receipt,
   UserCircle,
   ClipboardList,
   FileSignature,
   UsersRound,
   Clock,
   CreditCard,
   TrendingUp,
   ShieldCheck,
   StickyNote,
   Package,
   Monitor,
   Server,
   Utensils,
   Home,
   Building2,
   BookOpen,
   FileCode,
   ListTodo,
   Bell,
   Activity,
   Cog,
   Wallet,
   Smartphone,
   UserCog,
   Sliders,
   LogOut,
   ChevronRight,
 } from 'lucide-react';
 import { useAuth } from '@/contexts/AuthContext';
 import { cn } from '@/lib/utils';
 import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
 } from '@/components/ui/sidebar';
 import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
 } from '@/components/ui/collapsible';
 import { Button } from '@/components/ui/button';
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
 } from '@/components/ui/tooltip';
 
 const navGroups = [
   {
     label: 'Dashboard',
     icon: LayoutDashboard,
     items: [
       { label: 'Overview', href: '/admin', icon: LayoutDashboard },
     ],
   },
   {
     label: 'Sales & Clients',
     icon: Briefcase,
     items: [
       { label: 'Leads', href: '/admin/leads', icon: MessageSquare },
       { label: 'Quotations', href: '/admin/quotations', icon: ClipboardList },
       { label: 'Proposals', href: '/admin/proposals', icon: FileSignature },
       { label: 'Invoices', href: '/admin/invoices', icon: Receipt },
       { label: 'Clients', href: '/admin/clients', icon: UserCircle },
     ],
   },
   {
     label: 'Finance',
     icon: CreditCard,
     items: [
       { label: 'Payments', href: '/admin/payments', icon: CreditCard },
       { label: 'Revenue Report', href: '/admin/revenue', icon: TrendingUp },
     ],
   },
   {
     label: 'HR & Team',
     icon: UsersRound,
     items: [
       { label: 'Employees', href: '/admin/employees', icon: UsersRound },
       { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
       { label: 'Attendance', href: '/admin/attendance', icon: Clock },
       { label: 'Internal Notes', href: '/admin/notes', icon: StickyNote },
     ],
   },
   {
     label: 'Products',
     icon: Package,
     items: [
       { label: 'All Products', href: '/admin/products', icon: Package },
       { label: 'ISP Manager', href: '/admin/products/isp-manager', icon: Server },
       { label: 'Somity App', href: '/admin/products/somity-app', icon: Monitor },
       { label: 'Restaurant App', href: '/admin/products/restaurant-app', icon: Utensils },
     ],
   },
   {
     label: 'Frontend Control',
     icon: FileCode,
     items: [
       { label: 'Home Page', href: '/admin/pages/home', icon: Home },
       { label: 'Products Page', href: '/admin/pages/products', icon: Package },
       { label: 'Services Page', href: '/admin/pages/services', icon: Briefcase },
       { label: 'Companies Page', href: '/admin/pages/companies', icon: Building2 },
       { label: 'Resources Page', href: '/admin/pages/resources', icon: BookOpen },
       { label: 'Other Pages', href: '/admin/pages', icon: FileCode },
     ],
   },
   {
     label: 'Operations',
     icon: Activity,
     items: [
       { label: 'Tasks / Follow-ups', href: '/admin/tasks', icon: ListTodo },
       { label: 'Notifications', href: '/admin/notifications', icon: Bell },
       { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
     ],
   },
   {
     label: 'Settings',
     icon: Cog,
     adminOnly: true,
     items: [
       { label: 'General Settings', href: '/admin/settings', icon: Cog },
       { label: 'Payment Gateway', href: '/admin/settings/payment', icon: Wallet },
       { label: 'SMS Settings', href: '/admin/settings/sms', icon: Smartphone },
       { label: 'User Management', href: '/admin/users', icon: UserCog },
       { label: 'System Preferences', href: '/admin/settings/system', icon: Sliders },
     ],
   },
 ];
 
 const AdminSidebar = () => {
   const location = useLocation();
   const { user, role, signOut } = useAuth();
   const { state } = useSidebar();
   const isCollapsed = state === 'collapsed';
 
   const isActive = (href: string) => {
     if (href === '/admin') return location.pathname === '/admin';
     return location.pathname.startsWith(href);
   };
 
   const isGroupActive = (items: { href: string }[]) => {
     return items.some(item => isActive(item.href));
   };
 
   const filteredNavGroups = navGroups.filter(group => {
     if (group.adminOnly && role !== 'admin') return false;
     return true;
   });
 
   return (
     <Sidebar collapsible="icon" className="border-r border-sidebar-border">
       <SidebarHeader className="border-b border-sidebar-border">
         <Link to="/admin" className="flex items-center gap-3 px-2 py-2">
           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
             <span className="text-xs font-bold text-primary-foreground">CT</span>
           </div>
           {!isCollapsed && (
             <div className="flex flex-col">
               <span className="text-sm font-semibold leading-tight">Creation Tech</span>
               <span className="text-[10px] text-sidebar-foreground/60">Admin Panel</span>
             </div>
           )}
         </Link>
       </SidebarHeader>
 
       <SidebarContent className="px-2">
         {filteredNavGroups.map((group) => (
           <Collapsible
             key={group.label}
             defaultOpen={isGroupActive(group.items)}
             className="group/collapsible"
           >
             <SidebarGroup className="py-0">
               {isCollapsed ? (
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <SidebarGroupLabel className="flex h-9 cursor-pointer items-center justify-center rounded-md px-0 hover:bg-sidebar-accent">
                       <group.icon className="h-4 w-4" />
                     </SidebarGroupLabel>
                   </TooltipTrigger>
                   <TooltipContent side="right" className="flex flex-col gap-1">
                     <span className="font-medium">{group.label}</span>
                     {group.items.map(item => (
                       <Link
                         key={item.href}
                         to={item.href}
                         className={cn(
                           "text-xs hover:text-primary",
                           isActive(item.href) && "text-primary font-medium"
                         )}
                       >
                         {item.label}
                       </Link>
                     ))}
                   </TooltipContent>
                 </Tooltip>
               ) : (
                 <>
                   <CollapsibleTrigger asChild>
                     <SidebarGroupLabel className="flex h-9 cursor-pointer items-center justify-between rounded-md px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors duration-200">
                       <div className="flex items-center gap-2">
                         <group.icon className="h-3.5 w-3.5" />
                         <span>{group.label}</span>
                       </div>
                       <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                     </SidebarGroupLabel>
                   </CollapsibleTrigger>
                   <CollapsibleContent className="transition-all duration-200 ease-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                     <SidebarGroupContent>
                       <SidebarMenu>
                         {group.items.map((item) => (
                           <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton
                               asChild
                               isActive={isActive(item.href)}
                               tooltip={item.label}
                             >
                               <Link
                                 to={item.href}
                                 className={cn(
                                   "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150",
                                   isActive(item.href)
                                     ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                     : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                 )}
                               >
                                 <item.icon className="h-4 w-4 shrink-0" />
                                 <span>{item.label}</span>
                               </Link>
                             </SidebarMenuButton>
                           </SidebarMenuItem>
                         ))}
                       </SidebarMenu>
                     </SidebarGroupContent>
                   </CollapsibleContent>
                 </>
               )}
             </SidebarGroup>
           </Collapsible>
         ))}
       </SidebarContent>
 
       <SidebarFooter className="border-t border-sidebar-border p-3">
         <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
           {!isCollapsed && (
             <div className="flex items-center gap-3">
               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
                 {user?.email?.charAt(0).toUpperCase()}
               </div>
               <div className="text-sm">
                 <p className="font-medium truncate max-w-[120px]">{user?.email}</p>
                 <p className="text-xs text-sidebar-foreground/60 capitalize">{role || 'User'}</p>
               </div>
             </div>
           )}
           <Tooltip>
             <TooltipTrigger asChild>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={signOut}
                 className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
               >
                 <LogOut className="h-4 w-4" />
               </Button>
             </TooltipTrigger>
             <TooltipContent side="right">Sign out</TooltipContent>
           </Tooltip>
         </div>
       </SidebarFooter>
     </Sidebar>
   );
 };
 
 export default AdminSidebar;