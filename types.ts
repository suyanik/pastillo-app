
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'seated';
export type Language = 'tr' | 'de' | 'en' | 'es';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  createdAt: number;
  status: ReservationStatus;
  // AI Generated fields
  aiConfirmationMessage?: string;
  aiChefNote?: string; // Summary for the owner/kitchen
}

export interface GeminiResponse {
  confirmationMessage: string;
  chefNote: string;
}
