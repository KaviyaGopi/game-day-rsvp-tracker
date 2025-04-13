
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, RsvpEntry, RsvpStatus, RsvpCounts } from '../types/rsvp';
import { RsvpService, Logger, ConsoleLogger } from '../services/RsvpService';
import { toast } from '@/components/ui/use-toast';

interface RsvpContextType {
  rsvpService: RsvpService;
  rsvpEntries: RsvpEntry[];
  counts: RsvpCounts;
  addOrUpdateRsvp: (player: Player, status: RsvpStatus, notes?: string) => void;
  removeRsvp: (playerId: string) => void;
  refreshData: () => void;
}

const RsvpContext = createContext<RsvpContextType | undefined>(undefined);

interface RsvpProviderProps {
  children: ReactNode;
  logger?: Logger;
}

export const RsvpProvider: React.FC<RsvpProviderProps> = ({ 
  children, 
  logger = new ConsoleLogger() 
}) => {
  const rsvpService = React.useMemo(() => new RsvpService(logger), [logger]);
  const [rsvpEntries, setRsvpEntries] = useState<RsvpEntry[]>([]);
  const [counts, setCounts] = useState<RsvpCounts>({
    total: 0,
    confirmed: 0,
    declined: 0,
    maybe: 0
  });

  const refreshData = React.useCallback(() => {
    setRsvpEntries(rsvpService.getAllRsvps());
    setCounts(rsvpService.getCounts());
  }, [rsvpService]);

  const addOrUpdateRsvp = React.useCallback((player: Player, status: RsvpStatus, notes?: string) => {
    rsvpService.addOrUpdateRsvp(player, status, notes);
    toast({
      title: "RSVP Updated",
      description: `${player.name}'s status set to ${status}`,
    });
    refreshData();
  }, [rsvpService, refreshData]);

  const removeRsvp = React.useCallback((playerId: string) => {
    const removed = rsvpService.removeRsvp(playerId);
    if (removed) {
      toast({
        title: "RSVP Removed",
        description: "Player has been removed from the event",
      });
      refreshData();
    }
  }, [rsvpService, refreshData]);

  const value = {
    rsvpService,
    rsvpEntries,
    counts,
    addOrUpdateRsvp,
    removeRsvp,
    refreshData
  };

  return (
    <RsvpContext.Provider value={value}>
      {children}
    </RsvpContext.Provider>
  );
};

export const useRsvp = (): RsvpContextType => {
  const context = useContext(RsvpContext);
  if (context === undefined) {
    throw new Error('useRsvp must be used within a RsvpProvider');
  }
  return context;
};
