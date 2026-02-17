export interface AgreementData {
  _id: string;
  userId: string;
  officiantId: string;
  officiantName?: string;
  eventDate?: Date;
  partner1Name?: string;
  partner2Name?: string;
  location?: string;
  price?: number;
  travelFee?: number;
  status: string;
  isUsedForCeremony?: boolean;
  payLater?: boolean;
  ceremonySubmittedAt?: Date;
  partner1Signature?: string;
  partner2Signature?: string;
  officiantSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const formatDate = (date?: Date): string => {
  if (!date) return "Not Set";
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getTotalAmount = (agreement: AgreementData): string => {
  return ((agreement.price || 0) + (agreement.travelFee || 0)).toFixed(2);
};
