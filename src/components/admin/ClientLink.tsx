 import { Link } from 'react-router-dom';
 import { User } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface ClientLinkProps {
   clientId: string | null;
   clientName: string;
   className?: string;
   showIcon?: boolean;
 }
 
 /**
  * Reusable component for linking to client profiles across admin modules.
  * Gracefully handles cases where client_id is null (unlinked clients).
  */
 const ClientLink = ({ clientId, clientName, className, showIcon = false }: ClientLinkProps) => {
   if (!clientId) {
     // Client not linked - show plain text
     return (
       <span className={cn("text-muted-foreground", className)}>
         {showIcon && <User className="h-3 w-3 inline mr-1" />}
         {clientName}
       </span>
     );
   }
 
   return (
     <Link
       to={`/admin/clients/${clientId}`}
       className={cn(
         "font-medium text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors cursor-pointer inline-flex items-center gap-1",
         className
       )}
     >
       {showIcon && <User className="h-3 w-3" />}
       {clientName}
     </Link>
   );
 };
 
 export default ClientLink;