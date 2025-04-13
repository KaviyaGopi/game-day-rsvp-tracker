
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Player, RsvpEntry, RsvpStatus } from '@/types/rsvp';
import RsvpStatusBadge from './RsvpStatusBadge';
import { MoreHorizontal, CheckCircle, XCircle, HelpCircle, Trash2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface PlayerCardProps {
  entry?: RsvpEntry;
  player: Player;
  onStatusChange: (player: Player, status: RsvpStatus) => void;
  onRemove: (playerId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  entry, 
  player, 
  onStatusChange,
  onRemove
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={player.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(player.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{player.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {player.position || 'Player'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {entry && <RsvpStatusBadge status={entry.status} />}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => onStatusChange(player, 'Yes')}
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Mark as Attending</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => onStatusChange(player, 'No')}
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Mark as Not Attending</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => onStatusChange(player, 'Maybe')}
                >
                  <HelpCircle className="h-4 w-4 text-yellow-500" />
                  <span>Mark as Maybe</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-500 cursor-pointer"
                  onClick={() => onRemove(player.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove Player</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
      {entry && entry.notes && (
        <CardFooter className="bg-muted/50 px-4 py-2 text-sm">
          <p className="text-muted-foreground">{entry.notes}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default PlayerCard;
