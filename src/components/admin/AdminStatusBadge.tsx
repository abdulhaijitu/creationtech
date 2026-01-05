import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusVariant = 'new' | 'contacted' | 'in_progress' | 'closed' | 'confirmed' | 'completed' | 'cancelled' | 'active' | 'inactive';

const statusStyles: Record<StatusVariant, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-slate-50 text-slate-700 border-slate-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-50 text-slate-600 border-slate-200',
};

interface AdminStatusBadgeProps {
  status: string;
  className?: string;
}

const AdminStatusBadge = ({ status, className }: AdminStatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_') as StatusVariant;
  const style = statusStyles[normalizedStatus] || statusStyles.new;
  
  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium capitalize border', style, className)}
    >
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};

export default AdminStatusBadge;
