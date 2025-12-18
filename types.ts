
export type ExpenseCategory = 'Maaş/Avans' | 'Tedarikçi' | 'Kira/Fatura' | 'Vergi' | 'Diğer';

export interface Personnel {
  id: string;
  name: string;
  role: string;
  phone: string;
  startDate: string;
  salary?: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  receiptImage?: string;
  personnelId?: string;
  personnelName?: string;
}

export interface DailyTurnover {
  date: string;
  cash: number;
  creditCard: number;
  total: number;
}

export interface FinancialRecord {
  id: string;
  date: string;
  turnover: DailyTurnover;
  expenses: Expense[];
  notes?: string;
}

export type Language = 'tr' | 'de' | 'en' | 'es';
export type ReservationStatus = 'confirmed' | 'seated' | 'cancelled';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: ReservationStatus;
  createdAt: number;
  aiConfirmationMessage?: string;
  aiChefNote?: string;
}
