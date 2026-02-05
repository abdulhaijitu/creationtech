import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStatusColor, getVariantColor, STATUS_VARIANTS } from '@/lib/status-colors';

interface AdminStatusBadgeProps {
  status: string;
  className?: string;
  variant?: keyof typeof STATUS_VARIANTS;
}

const AdminStatusBadge = ({ status, className, variant }: AdminStatusBadgeProps) => {
  // Use explicit variant if provided, otherwise auto-detect from status
  const colorClasses = variant ? getVariantColor(variant) : getStatusColor(status);

  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium capitalize border', colorClasses, className)}
    >
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};

export default AdminStatusBadge;
