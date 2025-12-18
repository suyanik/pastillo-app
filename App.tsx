
import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Calendar, 
  Settings, LogOut, UserCog, LayoutDashboard
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

// Services & Types
import { Reservation, Language, AppSettings, DailyTurnover, Expense, UserRole, Personnel } from './types';
import { 
  subscribeToReservations, addReservationToDB, updateReservationStatus, 
  deleteReservationFromDB, subscribeToSettings, subscribeToTurnover, subscribeToExpenses,
  subscribeToPersonnel 
} from './services/firebase';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('none');
  const [adminView, setAdminView] = useState<'overview' | 'reservations' | 'finance' | 'personnel' | 'settings'>('overview');
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [lang, setLang] = useState<Language>('de');
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [turnovers, setTurnovers] = useState<DailyTurnover[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staffList, setStaffList] = useState<Personnel[]>([]);
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

    return () => {
      unsubRes();
      unsubSet();
      unsubTurn();
      unsubExp();
      unsubPersonnel();
    };
  }, []);

  const translations: Record<Language, any> = {
    tr: {
      ovw: 'PANEL', res: 'REZERVASYON', fin: 'FİNANS', staff: 'PERSONEL', set: 'AYARLAR',
      adminTitle: 'YÖNETİM SÜİTİ',
      staffTitle: 'PERSONEL PANELİ',
      titleMap: {
        overview: 'GENEL BAKIŞ',
        reservations: 'REZERVASYONLAR',
        finance: 'FİNANSAL DURUM',
        personnel: 'EKİP YÖNETİMİ',
        settings: 'SİSTEM AYARLARI'
      }
    },
    de: {
      ovw: 'ÜBERSICHT', res: 'BUCHUNG', fin: 'FINANZEN', staff: 'PERSONAL', set: 'EINSTELL.',
      adminTitle: 'MANAGEMENT SUITE',
      staffTitle: 'PERSONALPANEEL',
      titleMap: {
        overview: 'ÜBERSICHT',
        reservations: 'BUCHUNGEN',
        finance: 'FINANZEN',
        personnel: 'PERSONAL',
        settings: 'EINSTELLUNGEN'
      }
    },
    en: {
      ovw: 'DASHBOARD', res: 'BOOKING', fin: 'FINANCE', staff: 'STAFF', set: 'SETTINGS',
      adminTitle: 'MANAGEMENT SUITE',
      staffTitle: 'STAFF PANEL',
      titleMap: {
        overview: 'OVERVIEW',
        reservations: 'RESERVATIONS',
        finance: 'FINANCIALS',
        personnel: 'PERSONNEL',
        settings: 'SETTINGS'
      }
    }
  };

  const t = translations[lang] || translations.de;

  const getHeaderTitle = () => {
    if (view === 'public') return "TISCHRESERVIERUNG";
    if (userRole === 'staff') return t.staffTitle;
    return t.titleMap[adminView] || t.adminTitle;
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setAdminView(role === 'admin' ? 'overview' : 'reservations');
  };

  if (view === 'admin' && userRole === 'none') {
    return <AdminLogin onLogin={handleLogin} onCancel={() => setView('public')} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-32 overflow-x-hidden">
      <InstallPrompt lang={lang} />
      
      <header className="sticky top-0 z-40 px-6 py-6 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-2xl">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tighter uppercase text-primary">
              {getHeaderTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-white/5 rounded-xl p-1 border border-white/10 mr-2">
              {(['tr', 'de', 'en'] as Language[]).map((l: Language) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${lang === l ? 'bg-primary text-black' : 'text-white/30'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {view === 'public' ? (
              <button onClick={() => setView('admin')} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-primary active:scale-90 transition-all">
                <UserCog size={20} />
              </button>
            ) : (
              <button onClick={() => { setUserRole('none'); setView('public'); }} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 active:scale-90 transition-all">
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
                await addReservationToDB({...data, status: 'confirmed'});
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
            {userRole === 'admin' && (
              <>
                {adminView === 'finance' && <Dashboard lang={lang} turnovers={turnovers} expenses={expenses} />}
                {adminView === 'personnel' && <PersonnelManagement lang={lang} />}
                {adminView === 'settings' && <SettingsManager lang={lang} settings={settings} />}
              </>
            )}
          </div>
        )}
      </main>

      {view === 'admin' && userRole === 'admin' && (
        <nav className="fixed bottom-8 left-6 right-6 z-50 max-w-xl mx-auto">
          <div className="glass bg-[#161616]/95 p-2 rounded-[2.5rem] shadow-2xl flex justify-between items-center border border-white/10">
            <button onClick={() => setAdminView('overview')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'overview' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <LayoutDashboard size={18} /><span className="text-[8px] font-black uppercase tracking-widest">{t.ovw}</span>
            </button>
            <button onClick={() => setAdminView('reservations')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'reservations' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Calendar size={18} /><span className="text-[8px] font-black uppercase tracking-widest">{t.res}</span>
            </button>
            <button onClick={() => setAdminView('finance')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'finance' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <TrendingUp size={18} /><span className="text-[8px] font-black uppercase tracking-widest">{t.fin}</span>
            </button>
            <button onClick={() => setAdminView('personnel')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'personnel' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Users size={18} /><span className="text-[8px] font-black uppercase tracking-widest">{t.staff}</span>
            </button>
            <button onClick={() => setAdminView('settings')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'settings' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Settings size={18} /><span className="text-[8px] font-black uppercase tracking-widest">{t.set}</span>
            </button>
          </div>
        </nav>
      )}

      {view === 'admin' && userRole === 'staff' && (
        <div className="fixed bottom-10 left-0 right-0 text-center animate-in fade-in duration-1000">
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">Limited Access Mode</p>
        </div>
      )}
    </div>
  );
};

export default App;
