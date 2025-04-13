import React, { useEffect } from "react";
import { RsvpProvider, useRsvp } from "@/context/RsvpContext";
import StatsCard from "@/components/StatsCard";
import PlayersList from "@/components/PlayersList";
import AddPlayerDialog from "@/components/AddPlayerDialog";
import { samplePlayers } from "@/data/samplePlayers";
import { Player, RsvpStatus } from "@/types/rsvp";
import { Activity, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventDashboard: React.FC = () => {
  const { rsvpEntries, counts, addOrUpdateRsvp, removeRsvp, refreshData } =
    useRsvp();
  const [players, setPlayers] = React.useState<Player[]>([]);

  // Load players and RSVP data from localStorage on initial mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Get saved players or use sample data if none exist
        const savedPlayers = localStorage.getItem("players");
        const initialPlayers = savedPlayers ? JSON.parse(savedPlayers) : [];

        // If no saved players, add some sample players for first-time users
        if (initialPlayers.length === 0) {
          setPlayers(samplePlayers);

          // Add initial RSVP statuses for sample players
          samplePlayers.slice(0, 4).forEach((player, index) => {
            const statuses: RsvpStatus[] = ["Yes", "No", "Maybe", "Yes"];
            addOrUpdateRsvp(player, statuses[index]);
          });

          // Save sample players to localStorage
          localStorage.setItem("players", JSON.stringify(samplePlayers));
        } else {
          setPlayers(initialPlayers);

          // Get saved RSVP data
          const savedRsvpData = localStorage.getItem("rsvpData");
          if (savedRsvpData) {
            const rsvpData = JSON.parse(savedRsvpData);

            // Restore RSVP entries
            rsvpData.forEach((entry: any) => {
              const player = initialPlayers.find(
                (p: Player) => p.id === entry.playerId
              );
              if (player) {
                addOrUpdateRsvp(player, entry.status, entry.notes);
              }
            });
          }
        }

        refreshData();
      } catch (error) {
        console.error("Error loading saved data:", error);
        // Fallback to sample data if there's an error
        setPlayers(samplePlayers);
      }
    };

    loadSavedData();
  }, []);

  // Save RSVP data whenever it changes
  useEffect(() => {
    if (rsvpEntries.length > 0) {
      localStorage.setItem("rsvpData", JSON.stringify(rsvpEntries));
    }
  }, [rsvpEntries]);

  const handleAddPlayer = (
    player: Player,
    status: RsvpStatus,
    notes?: string
  ) => {
    const updatedPlayers = [...players, player];
    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    addOrUpdateRsvp(player, status, notes);
  };

  const handleStatusChange = (player: Player, status: RsvpStatus) => {
    addOrUpdateRsvp(player, status);
  };

  const handleRemovePlayer = (playerId: string) => {
    removeRsvp(playerId);
    const updatedPlayers = players.filter((player) => player.id !== playerId);
    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Game Day RSVP Manager</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <p>Saturday, June 15, 2025 • 2:00 PM • City Stadium</p>
          </div>
        </div>
        <AddPlayerDialog onAddPlayer={handleAddPlayer} />
      </header>

      <Separator />

      <StatsCard counts={counts} />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="attending">Attending</TabsTrigger>
          <TabsTrigger value="not-attending">Not Attending</TabsTrigger>
          <TabsTrigger value="maybe">Maybe</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <PlayersList
            players={players}
            rsvpEntries={rsvpEntries}
            onStatusChange={handleStatusChange}
            onRemovePlayer={handleRemovePlayer}
          />
        </TabsContent>

        <TabsContent value="attending" className="mt-6">
          <PlayersList
            players={players}
            rsvpEntries={rsvpEntries.filter((entry) => entry.status === "Yes")}
            onStatusChange={handleStatusChange}
            onRemovePlayer={handleRemovePlayer}
          />
        </TabsContent>

        <TabsContent value="not-attending" className="mt-6">
          <PlayersList
            players={players}
            rsvpEntries={rsvpEntries.filter((entry) => entry.status === "No")}
            onStatusChange={handleStatusChange}
            onRemovePlayer={handleRemovePlayer}
          />
        </TabsContent>

        <TabsContent value="maybe" className="mt-6">
          <PlayersList
            players={players}
            rsvpEntries={rsvpEntries.filter(
              (entry) => entry.status === "Maybe"
            )}
            onStatusChange={handleStatusChange}
            onRemovePlayer={handleRemovePlayer}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Index = () => {
  return (
    <RsvpProvider>
      <EventDashboard />
    </RsvpProvider>
  );
};

export default Index;
