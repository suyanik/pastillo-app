
export type UserRole = 'none' | 'staff' | 'admin';
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
  photo?: string; // Base64 image
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
  restaurantName: string;
  restaurantLogo?: string;
  address: string;
  phone: string;
  openingHours: string;
  closedDay: string;
  adminPin: string;
  maxCapacityPerSlot: number;
  holidays: string[]; // YYYY-MM-DD format
  managerEmail: string;
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

// Vardiya Yönetimi
export type ShiftType = 'morning' | 'afternoon' | 'evening' | 'full';
export type LeaveType = 'annual' | 'sick' | 'unpaid' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Shift {
  id: string;
  personnelId: string;
  personnelName?: string;
  date: string; // YYYY-MM-DD
  type: ShiftType;
  startTime: string; // HH:mm
  endTime: string;
  actualStart?: string;
  actualEnd?: string;
  notes?: string;
  createdAt: number;
}

export interface LeaveRequest {
  id: string;
  personnelId: string;
  personnelName?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  createdAt: number;
}

// Raporlama
export interface ReportPeriod {
  start: string;
  end: string;
  label: string;
}

export interface ChartDataPoint {
  date: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

// Masa Planı
export type TableShape = 'round' | 'square' | 'rectangle';
export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface RestaurantTable {
  id: string;
  name: string; // "A1", "B2" gibi
  capacity: number;
  x: number; // pozisyon (0-100 yüzde)
  y: number;
  shape: TableShape;
  width?: number; // sadece rectangle için
}

// Sipariş Yönetimi
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: number;
  staffId?: string;
  staffName?: string;
}

// Personel Check-in
export interface StaffCheckIn {
  id: string;
  personnelId: string;
  personnelName: string;
  checkInTime: number;
  checkOutTime?: number;
  breaks: { start: number; end?: number }[];
  date: string;
}
