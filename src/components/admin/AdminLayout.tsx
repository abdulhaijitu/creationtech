 import { ReactNode } from 'react';
 import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
 import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
 import { TooltipProvider } from '@/components/ui/tooltip';
 import AdminSidebar from './AdminSidebar';
 import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
   const isMobile = useIsMobile();

  return (
     <TooltipProvider delayDuration={0}>
       <SidebarProvider defaultOpen={!isMobile}>
         <div className="flex min-h-screen w-full">
           <AdminSidebar />
           <SidebarInset className="flex flex-1 flex-col">
             {/* Top bar */}
             <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
               <SidebarTrigger className="-ml-1">
                 <Menu className="h-5 w-5" />
               </SidebarTrigger>
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
           </SidebarInset>
         </div>
       </SidebarProvider>
     </TooltipProvider>
  );
};

export default AdminLayout;
