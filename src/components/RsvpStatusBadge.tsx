
import React from 'react';
import { RsvpStatus } from '@/types/rsvp';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface RsvpStatusBadgeProps {
  status: RsvpStatus;
  className?: string;
}

const RsvpStatusBadge: React.FC<RsvpStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: RsvpStatus) => {
    switch(status) {
      case 'Yes':
        return {
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          variant: 'success' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case 'No':
        return {
          icon: <XCircle className="h-4 w-4 mr-1" />,
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
      case 'Maybe':
        return {
          icon: <HelpCircle className="h-4 w-4 mr-1" />,
          variant: 'outline' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline"
      className={cn("flex items-center gap-1 font-medium", config.className, className)}
    >
      {config.icon}
      {status}
    </Badge>
  );
};

export default RsvpStatusBadge;
