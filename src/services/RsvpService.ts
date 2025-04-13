
import { Player, RsvpEntry, RsvpStatus, RsvpCounts } from "../types/rsvp";

export interface Logger {
  log: (message: string) => void;
  error: (message: string, error?: unknown) => void;
}

export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
  
  error(message: string, error?: unknown): void {
    console.error(message, error);
  }
}

export class RsvpService {
  private rsvpEntries: RsvpEntry[] = [];
  private logger: Logger;
  private readonly STORAGE_KEY = 'game-day-rsvp-entries';
  
  constructor(logger: Logger = new ConsoleLogger()) {
    this.logger = logger;
    this.loadFromStorage();
  }
  
  /**
   * Loads RSVP entries from localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Convert string dates back to Date objects
        this.rsvpEntries = parsedData.map((entry: any) => ({
          ...entry,
          responseDate: new Date(entry.responseDate)
        }));
        
        this.logger.log(`Loaded ${this.rsvpEntries.length} RSVP entries from storage`);
      }
    } catch (error) {
      this.logger.error('Failed to load RSVP data from storage', error);
    }
  }
  
  /**
   * Saves RSVP entries to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.rsvpEntries));
      this.logger.log('RSVP data saved to storage');
    } catch (error) {
      this.logger.error('Failed to save RSVP data to storage', error);
    }
  }
  
  /**
   * Adds or updates a player's RSVP
   */
  addOrUpdateRsvp(player: Player, status: RsvpStatus, notes?: string): RsvpEntry {
    this.logger.log(`Setting RSVP for ${player.name} to ${status}`);
    
    // Look for existing entry
    const existingEntryIndex = this.rsvpEntries.findIndex(
      entry => entry.player.id === player.id
    );
    
    const newEntry: RsvpEntry = {
      player,
      status,
      responseDate: new Date(),
      notes
    };
    
    // Update or add the entry
    if (existingEntryIndex >= 0) {
      this.rsvpEntries[existingEntryIndex] = newEntry;
    } else {
      this.rsvpEntries.push(newEntry);
    }
    
    // Save to localStorage
    this.saveToStorage();
    
    return newEntry;
  }
  
  /**
   * Gets all RSVP entries
   */
  getAllRsvps(): RsvpEntry[] {
    return [...this.rsvpEntries];
  }
  
  /**
   * Gets all confirmed attendees (status = "Yes")
   */
  getConfirmedAttendees(): RsvpEntry[] {
    return this.rsvpEntries.filter(entry => entry.status === "Yes");
  }
  
  /**
   * Gets all entries with a specific status
   */
  getRsvpsByStatus(status: RsvpStatus): RsvpEntry[] {
    return this.rsvpEntries.filter(entry => entry.status === status);
  }
  
  /**
   * Gets counts of all RSVP statuses
   */
  getCounts(): RsvpCounts {
    const confirmed = this.getRsvpsByStatus("Yes").length;
    const declined = this.getRsvpsByStatus("No").length;
    const maybe = this.getRsvpsByStatus("Maybe").length;
    
    return {
      total: this.rsvpEntries.length,
      confirmed,
      declined,
      maybe
    };
  }
  
  /**
   * Removes a player's RSVP
   */
  removeRsvp(playerId: string): boolean {
    const initialLength = this.rsvpEntries.length;
    this.rsvpEntries = this.rsvpEntries.filter(entry => entry.player.id !== playerId);
    
    const removed = initialLength > this.rsvpEntries.length;
    if (removed) {
      this.logger.log(`Removed RSVP for player ID: ${playerId}`);
      // Save to localStorage after removal
      this.saveToStorage();
    } else {
      this.logger.log(`No RSVP found for player ID: ${playerId}`);
    }
    
    return removed;
  }
}
