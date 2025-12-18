
export type ExpenseCategory = 'Maaş/Avans' | 'Tedarikçi' | 'Kira/Fatura' | 'Vergi' | 'Diğer';

export interface PersonnelPayment {
  id: string;
  type: 'salary' | 'advance';
  amount: number;
  date: string;
  month: string; // format: YYYY-MM
}

export interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  nationality: string;
  healthInsurance: string;
  taxId: string;
  socialSecurityNumber: string;
  bankName: string;
  iban: string;
  bic: string;
  startDate: string;
  endDate?: string;
  baseSalary: number;
  payments: PersonnelPayment[];
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
  createdAt: number;
}

export interface DailyTurnover {
  id?: string;
  date: string;
  cash: number;
  creditCard: number;
  lieferando: number;
  total: number;
  createdAt: number;
}

export interface AppSettings {
  adminPin: string;
  maxCapacityPerSlot: number;
  holidays: string[]; // YYYY-MM-DD format
  managerEmail: string;
}

export type Language = 'tr' | 'de' | 'en';
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
