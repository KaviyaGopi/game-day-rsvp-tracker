
import React, { useState } from 'react';
import { Player, RsvpEntry, RsvpStatus } from '@/types/rsvp';
import PlayerCard from './PlayerCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface PlayersListProps {
  players: Player[];
  rsvpEntries: RsvpEntry[];
  onStatusChange: (player: Player, status: RsvpStatus) => void;
  onRemovePlayer: (playerId: string) => void;
}

const PlayersList: React.FC<PlayersListProps> = ({
  players,
  rsvpEntries,
  onStatusChange,
  onRemovePlayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Prepare players with their RSVP entries (if any)
  const playersWithRsvp = players.map(player => {
    const rsvpEntry = rsvpEntries.find(entry => entry.player.id === player.id);
    return { player, rsvpEntry };
  });

  // Filter players based on search query and status
  const filteredPlayers = playersWithRsvp.filter(({ player, rsvpEntry }) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.position?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'no-response' && !rsvpEntry) ||
      (rsvpEntry && rsvpEntry.status === statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Players</SelectItem>
            <SelectItem value="Yes">Attending</SelectItem>
            <SelectItem value="No">Not Attending</SelectItem>
            <SelectItem value="Maybe">Maybe</SelectItem>
            <SelectItem value="no-response">No Response</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No players match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlayers.map(({ player, rsvpEntry }) => (
            <PlayerCard
              key={player.id}
              player={player}
              entry={rsvpEntry}
              onStatusChange={onStatusChange}
              onRemove={onRemovePlayer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersList;
