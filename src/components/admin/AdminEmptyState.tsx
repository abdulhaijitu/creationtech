import { ReactNode } from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

const AdminEmptyState = ({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action 
}: AdminEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
};

export default AdminEmptyState;
