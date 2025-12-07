export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  createdAt: number;
  // AI Generated fields
  aiConfirmationMessage?: string;
  aiChefNote?: string; // Summary for the owner/kitchen
}

export interface GeminiResponse {
  confirmationMessage: string;
  chefNote: string;
}
