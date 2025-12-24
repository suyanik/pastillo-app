
import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, Calendar, BarChart3, FileText, Layout,
  Settings, LogOut, UserCog, LayoutDashboard, Clock, Download
} from 'lucide-react';

// Components
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import ManagerDashboard from './components/ManagerDashboard';
import MasterDashboard from './components/MasterDashboard';
import ReservationForm from './components/ReservationForm';
import PersonnelManagement from './components/PersonnelManagement';
import InstallPrompt from './components/InstallPrompt';
import SettingsManager from './components/SettingsManager';
import InfoView from './components/InfoView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ShiftManagement from './components/ShiftManagement';
import LeaveManagement from './components/LeaveManagement';
import ReportGenerator from './components/ReportGenerator';
import FloorPlan from './components/FloorPlan';
import StaffMobileView from './components/StaffMobileView';

// Services & Types
import { Reservation, Language, AppSettings, DailyTurnover, Expense, UserRole, Personnel, Shift, LeaveRequest, RestaurantTable, Order } from './types';
import {
  subscribeToReservations, addReservationToDB, updateReservationStatus,
  deleteReservationFromDB, subscribeToSettings, subscribeToTurnover, subscribeToExpenses,
  subscribeToPersonnel, subscribeToShifts, subscribeToLeaveRequests
} from './services/firebase';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('none');
  const [adminView, setAdminView] = useState<'overview' | 'reservations' | 'finance' | 'personnel' | 'settings' | 'analytics' | 'shifts' | 'leaves' | 'reports' | 'floorplan'>('overview');
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [lang, setLang] = useState<Language>('de');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [turnovers, setTurnovers] = useState<DailyTurnover[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staffList, setStaffList] = useState<Personnel[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([
    { id: 't1', name: 'A1', capacity: 4, x: 20, y: 20, shape: 'round' },
    { id: 't2', name: 'A2', capacity: 4, x: 40, y: 20, shape: 'round' },
    { id: 't3', name: 'B1', capacity: 6, x: 20, y: 50, shape: 'rectangle' },
    { id: 't4', name: 'B2', capacity: 6, x: 60, y: 50, shape: 'rectangle' },
    { id: 't5', name: 'C1', capacity: 2, x: 80, y: 30, shape: 'square' },
    { id: 't6', name: 'C2', capacity: 2, x: 80, y: 60, shape: 'square' }
  ]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentStaff, setCurrentStaff] = useState<Personnel | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    restaurantName: "Pastillo Butzbach",
    address: "Marktplatz 23, 35510 Butzbach",
    phone: "06033 974 7771",
    openingHours: "Her gün: 11:00 - 23:00",
    closedDay: "Salı: Kapalı",
    adminPin: "0000",
    maxCapacityPerSlot: 20,
    holidays: [],
    managerEmail: "info@pastillo.de"
  });

  useEffect(() => {
    const unsubRes = subscribeToReservations(setReservations);
    const unsubSet = subscribeToSettings(setSettings);
    const unsubTurn = subscribeToTurnover(setTurnovers);
    const unsubExp = subscribeToExpenses(setExpenses);
    const unsubPersonnel = subscribeToPersonnel(setStaffList);
    const unsubShifts = subscribeToShifts(setShifts);
    const unsubLeave = subscribeToLeaveRequests(setLeaveRequests);

    return () => {
      unsubRes();
      unsubSet();
      unsubTurn();
      unsubExp();
      unsubPersonnel();
      unsubShifts();
      unsubLeave();
    };
  }, []);

  const translations: Record<Language, any> = {
    tr: {
      ovw: 'PANEL', res: 'REZERVASYON', fin: 'FİNANS', staff: 'PERSONEL', set: 'AYARLAR', analytics: 'ANALİZ', shifts: 'VARDİYA', leaves: 'İZİN',
      adminTitle: 'YÖNETİM SÜİTİ',
      staffTitle: 'PERSONEL PANELİ',
      titleMap: {
        overview: 'GENEL BAKIŞ',
        reservations: 'REZERVASYONLAR',
        finance: 'FİNANSAL DURUM',
        personnel: 'EKİP YÖNETİMİ',
        settings: 'SİSTEM AYARLARI',
        analytics: 'FİNANSAL ANALİZ',
        shifts: 'VARDİYA PLANLAMA',
        leaves: 'İZİN YÖNETİMİ',
        reports: 'RAPORLAR',
        floorplan: 'MASA PLANI'
      }
    },
    de: {
      ovw: 'ÜBERSICHT', res: 'BUCHUNG', fin: 'FINANZEN', staff: 'PERSONAL', set: 'EINSTELL.', analytics: 'ANALYSE', shifts: 'SCHICHT', leaves: 'URLAUB',
      adminTitle: 'MANAGEMENT SUITE',
      staffTitle: 'PERSONALPANEEL',
      titleMap: {
        overview: 'ÜBERSICHT',
        reservations: 'BUCHUNGEN',
        finance: 'FINANZEN',
        personnel: 'PERSONAL',
        settings: 'EINSTELLUNGEN',
        analytics: 'FINANZANALYSE',
        shifts: 'SCHICHTPLANUNG',
        leaves: 'URLAUBSVERWALTUNG',
        reports: 'BERICHTE',
        floorplan: 'TISCHPLAN'
      }
    },
    en: {
      ovw: 'DASHBOARD', res: 'BOOKING', fin: 'FINANCE', staff: 'STAFF', set: 'SETTINGS', analytics: 'ANALYTICS', shifts: 'SHIFTS', leaves: 'LEAVES',
      adminTitle: 'MANAGEMENT SUITE',
      staffTitle: 'STAFF PANEL',
      titleMap: {
        overview: 'OVERVIEW',
        reservations: 'RESERVATIONS',
        finance: 'FINANCIALS',
        personnel: 'PERSONNEL',
        settings: 'SETTINGS',
        analytics: 'FINANCIAL ANALYSIS',
        shifts: 'SHIFT PLANNING',
        leaves: 'LEAVE MANAGEMENT',
        reports: 'REPORTS',
        floorplan: 'FLOOR PLAN'
      }
    },
    es: {
      ovw: 'PANEL', res: 'RESERVA', fin: 'FINANZAS', staff: 'PERSONAL', set: 'AJUSTES', analytics: 'ANÁLISIS', shifts: 'TURNOS', leaves: 'PERMISOS',
      adminTitle: 'SUITE DE GESTIÓN',
      staffTitle: 'PANEL DE PERSONAL',
      titleMap: {
        overview: 'RESUMEN',
        reservations: 'RESERVAS',
        finance: 'FINANZAS',
        personnel: 'PERSONAL',
        settings: 'AJUSTES',
        analytics: 'ANÁLISIS FINANCIERO',
        shifts: 'PLANIFICACIÓN DE TURNOS',
        leaves: 'GESTIÓN DE PERMISOS'
      }
    }
  };

  const t = translations[lang] || translations.de;

  const getHeaderTitle = () => {
    if (view === 'public') return "TISCHRESERVIERUNG";
    if (userRole === 'staff') return t.staffTitle || "STAFF";
    return (t.titleMap && t.titleMap[adminView]) || t.adminTitle || "ADMIN";
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setAdminView(role === 'admin' ? 'overview' : 'reservations');
  };

  if (view === 'admin' && userRole === 'none') {
    return <AdminLogin onLogin={handleLogin} onCancel={() => setView('public')} lang={lang} settings={settings} />;
  }

  return (
    <div className="min-h-screen bg-background-light hex-pattern text-gray-900 font-sans pb-32 overflow-x-hidden">
      <InstallPrompt lang={lang} />

      <header className="sticky top-0 z-40 px-6 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Hexagon Logo */}
            <svg className="w-8 h-8 text-primary fill-none stroke-current stroke-[3]" viewBox="0 0 100 100">
              <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" />
              <path d="M50 35 L50 70 M38 45 L38 60 M62 45 L62 60" strokeLinecap="round" strokeWidth="4" />
            </svg>
            <h1 className="text-xl font-bold tracking-tighter uppercase text-gray-900">
              {getHeaderTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-gray-100 rounded-lg p-1 border border-gray-200 mr-2">
              {(['tr', 'de', 'en'] as Language[]).map((l: Language) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 text-[9px] font-bold uppercase transition-all cut-corners ${lang === l ? 'bg-primary text-gray-900' : 'text-gray-400'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {view === 'public' ? (
              <button onClick={() => setView('admin')} className="p-2.5 bg-white border-2 border-gray-200 text-primary active:scale-90 transition-all hover:border-primary cut-corners">
                <UserCog size={20} />
              </button>
            ) : (
              <button onClick={() => { setUserRole('none'); setView('public'); }} className="p-2.5 bg-red-50 border-2 border-red-200 text-red-500 active:scale-90 transition-all cut-corners">
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={`mx-auto p-5 animate-in fade-in duration-700 ${view === 'admin' && userRole === 'admin' ? 'max-w-7xl' : 'max-w-md'}`}>
        {view === 'public' ? (
          <div className="space-y-12">
            <ReservationForm
              lang={lang}
              isLoading={false}
              onSubmit={async (data) => {
                await addReservationToDB({ ...data, status: 'confirmed' });
                const msg = lang === 'tr' ? 'Rezervasyonunuz alındı!' : (lang === 'en' ? 'Reservation received!' : 'Reservierung erfolgreich!');
                alert(msg);
              }}
              existingReservations={reservations}
              settings={settings}
            />
            <InfoView lang={lang} settings={settings} />
          </div>
        ) : (
          <div className="space-y-6">
            {adminView === 'overview' && userRole === 'admin' && (
              <MasterDashboard
                lang={lang}
                reservations={reservations}
                turnovers={turnovers}
                expenses={expenses}
                personnel={staffList}
                settings={settings}
              />
            )}
            {adminView === 'reservations' && (
              <ManagerDashboard
                lang={lang}
                reservations={reservations}
                onDelete={deleteReservationFromDB}
                onStatusUpdate={updateReservationStatus}
              />
            )}
            {/* Staff Mobile View */}
            {userRole === 'staff' && adminView === 'overview' && (
              <StaffMobileView
                lang={lang}
                tables={tables}
                reservations={reservations}
                orders={orders}
                currentStaff={currentStaff}
                onAddOrder={(order) => {
                  const newOrder = { ...order, id: `order-${Date.now()}`, createdAt: Date.now() };
                  setOrders([...orders, newOrder]);
                }}
                onUpdateOrderStatus={(orderId, status) => {
                  setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
                }}
                onCheckIn={() => console.log('Check in')}
                onCheckOut={() => console.log('Check out')}
              />
            )}
            {userRole === 'admin' && (
              <>
                {adminView === 'finance' && <Dashboard lang={lang} turnovers={turnovers} expenses={expenses} />}
                {adminView === 'analytics' && <AnalyticsDashboard lang={lang} turnovers={turnovers} expenses={expenses} personnel={staffList} />}
                {adminView === 'personnel' && <PersonnelManagement lang={lang} staff={staffList} settings={settings} />}
                {adminView === 'shifts' && <ShiftManagement lang={lang} personnel={staffList} shifts={shifts} />}
                {adminView === 'leaves' && <LeaveManagement lang={lang} personnel={staffList} leaveRequests={leaveRequests} isAdmin={true} />}
                {adminView === 'reports' && <ReportGenerator lang={lang} turnovers={turnovers} expenses={expenses} reservations={reservations} personnel={staffList} />}
                {adminView === 'floorplan' && <FloorPlan lang={lang} tables={tables} reservations={reservations} onUpdateTables={setTables} isAdmin={true} />}
                {adminView === 'settings' && <SettingsManager lang={lang} settings={settings} />}
              </>
            )}
          </div>
        )}
      </main>

      {view === 'admin' && (userRole === 'admin' || userRole === 'staff') && (
        <nav className="fixed bottom-6 left-4 right-4 z-50 max-w-xl mx-auto">
          <div className="bg-white border-2 border-primary p-2 shadow-lg flex justify-between items-center cut-corners-lg">
            <button onClick={() => setAdminView('overview')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${(adminView === 'overview' || (userRole === 'staff' && adminView === 'reservations')) ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <LayoutDashboard size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t.ovw}</span>
            </button>
            <button onClick={() => setAdminView('reservations')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'reservations' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <Calendar size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t.res}</span>
            </button>
            {userRole === 'admin' && (
              <>
                <button onClick={() => setAdminView('finance')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'finance' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <TrendingUp size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t.fin}</span>
                </button>
                <button onClick={() => setAdminView('analytics')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'analytics' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <BarChart3 size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t.analytics}</span>
                </button>
                <button onClick={() => setAdminView('personnel')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'personnel' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Users size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t.staff}</span>
                </button>
                <button onClick={() => setAdminView('shifts')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'shifts' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Clock size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t.shifts}</span>
                </button>
                <button onClick={() => setAdminView('leaves')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'leaves' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <FileText size={18} /><span className="text-[8px] font-black uppercase tracking-widest">{t.leaves}</span>
                </button>
                <button onClick={() => setAdminView('reports')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'reports' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Download size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">PDF</span>
                </button>
                <button onClick={() => setAdminView('floorplan')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'floorplan' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Layout size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">PLAN</span>
                </button>
                <button onClick={() => setAdminView('settings')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-all cut-corners ${adminView === 'settings' ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Settings size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t.set}</span>
                </button>
              </>
            )}
          </div>
        </nav>
      )}

      {view === 'admin' && userRole === 'staff' && (
        <div className="fixed bottom-10 left-0 right-0 text-center animate-in fade-in duration-1000">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Limited Access Mode</p>
        </div>
      )}
    </div>
  );
};

export default App;
