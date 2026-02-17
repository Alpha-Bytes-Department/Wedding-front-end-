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
  payLater?: boolean;
  partner1Signature?: string;
  partner2Signature?: string;
  officiantSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgreementFormData {
  officiantName: string;
  eventDate: string;
  partner1Name: string;
  partner2Name: string;
  location: string;
  price: string;
  travelFee: string;
}

export const getTotalAmount = (formData: AgreementFormData): string => {
  return (
    (parseFloat(formData.price) || 0) + (parseFloat(formData.travelFee) || 0)
  ).toFixed(2);
};

export const formatDate = (date?: Date): string => {
  if (!date) return "Not Set";
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
