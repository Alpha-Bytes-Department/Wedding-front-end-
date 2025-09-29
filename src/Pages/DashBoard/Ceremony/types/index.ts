export interface CeremonyFormData {
  title: string;
  description: string;
  ceremonyType: string; // Changed from 'type' to match backend
  // Greetings step fields
  groomName?: string;
  brideName?: string;
  language?: string;
  greetingSpeech?: string;
  presentationOfBride?: string;
  questionForPresentation?: string;
  responseToQuestion?: string;
  invocation?: string;
  // Vows step fields
  chargeToGroomAndBride?: string;
  pledge?: string;
  introductionToExchangeOfVows?: string;
  vows?: string;
  readings?: string;
  introductionToExchangeOfRings?: string;
  blessingsOfRings?: string;
  exchangeOfRingsGroom?: string;
  exchangeOfRingsBride?: string;
  prayerOnTheNewUnion?: string;
  // Rituals step fields
  ritualsSelection?: string;
  ritualsOption?: string;
  closingStatement?: string;
  pronouncing?: string;
  kiss?: string;
  introductionOfCouple?: string;
  eventDate?: string; // Changed from 'date' to match backend
  eventTime?: string; // Changed from 'time' to match backend
  location?: string;
  rehearsalDate?: string; // Changed from 'rehearsal' to match backend
  officiantId?: string;
  officiantName?: string;
  status?: "draft" | "planned" | "submitted" | "completed" | "approved" | "canceled";
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
