
export type RsvpStatus = "Yes" | "No" | "Maybe";

export interface Player {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  avatarUrl?: string;
}

export interface RsvpEntry {
  player: Player;
  status: RsvpStatus;
  responseDate: Date;
  notes?: string;
}

export interface RsvpCounts {
  total: number;
  confirmed: number;
  declined: number;
  maybe: number;
}
