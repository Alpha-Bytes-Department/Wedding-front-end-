export interface CeremonyFormData {
  title: string;
  type: string;
  description: string;
  vowsType: string;
  language: string;
  rituals: string;
  musicCue: string;
  notes: string;
  date: string;
  time: string;
  location: string;
  rehearsal: string;
}

export interface CeremonyData extends CeremonyFormData {
  id: string;
  status: "draft" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface Step {
  number: number;
  title: string;
  active: boolean;
}
