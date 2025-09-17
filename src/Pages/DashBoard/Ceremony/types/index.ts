export interface CeremonyFormData {
  title: string;
  description: string;
  ceremonyType: string; // Changed from 'type' to match backend
  vowsType?: string;
  language?: string;
  vowDescription?: string;
  rituals?: string;
  musicCues?: string; // Changed from 'musicCue' to match backend
  ritualsDescription?: string;
  eventDate?: string; // Changed from 'date' to match backend
  eventTime?: string; // Changed from 'time' to match backend
  location?: string;
  rehearsalDate?: string; // Changed from 'rehearsal' to match backend
  officiantId?: string;
  officiantName?: string;
}

export interface CeremonyData extends CeremonyFormData {
  _id?: string; // Backend uses _id
  id?: string; // Keep for compatibility
  userId: string;
  status: "planned" | "submitted" | "approved" | "completed" | "canceled";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Step {
  number: number;
  title: string;
  active: boolean;
}
