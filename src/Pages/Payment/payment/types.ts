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
  createdAt: Date;
  updatedAt: Date;
}

export interface BillData {
  userId: string;
  userName: string;
  eventType: string;
  eventDate: Date;
  eventName: string;
  officiantName: string;
  officiantId: string;
  cost: number;
  travelFee?: number;
  agreementId: string;
  amount: number;
  status: string;
  issuedAt?: Date;
  paidAt?: Date | null;
  location?: {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
  contacts?: string;
  transactionId?: string;
  billingMail?: string;
  billingName?: string;
}
