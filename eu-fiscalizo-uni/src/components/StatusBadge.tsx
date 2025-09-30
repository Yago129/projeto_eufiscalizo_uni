import { InspectionStatus } from '@/types/inspection';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: InspectionStatus;
  className?: string;
}

const statusConfig = {
  recebida: {
    label: 'Recebida',
    variant: 'secondary' as const,
    icon: Clock,
    className: 'bg-pending text-pending-foreground'
  },
  em_processo: {
    label: 'Em Processo',
    variant: 'default' as const,
    icon: AlertCircle,
    className: 'bg-warning text-warning-foreground'
  },
  concluida: {
    label: 'Concluída',
    variant: 'default' as const,
    icon: CheckCircle,
    className: 'bg-success text-success-foreground'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className || ''}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}