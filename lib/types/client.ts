export type ClientSource = 
  | "Egyptian WhatsApp" 
  | "Email" 
  | "Website" 
  | "Form" 
  | "Saudi WhatsApp" 
  | "Call" 
  | "Personal";

export type ClientPotentialState = "Low" | "Medium" | "High" | "Won" | "Lost";

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  firstContactDate: string; // ISO string
  lastFollowUpDate: string; // ISO string
  lastFeedback: string;
  projectDetails: string;
  nextAction: string;
  nextActionDate: string; // ISO string
  email: string;
  source: ClientSource;
  projectValue: number;
  currency: string;
  potentialState: ClientPotentialState;
  phone: string; // Includes country code
  country: string;
  sector: string;
  createdAt?: string; // Metadata
}
