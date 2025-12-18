
import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Calendar, 
  Settings, LogOut, UserCog
} from 'lucide-react';

// Components
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ReservationForm from './components/ReservationForm';
import PersonnelManagement from './components/PersonnelManagement';
import InstallPrompt from './components/InstallPrompt';
import SettingsManager from './components/SettingsManager';
import InfoView from './components/InfoView';

// Services & Types
import { Reservation, Language, AppSettings, DailyTurnover, Expense } from './types';
import { 
  subscribeToReservations, addReservationToDB, updateReservationStatus, 
  deleteReservationFromDB, subscribeToSettings, subscribeToTurnover, subscribeToExpenses 
} from './services/firebase';

const App: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminView, setAdminView] = useState<'reservations' | 'finance' | 'personnel' | 'settings'>('reservations');
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [lang, setLang] = useState<Language>('de');
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [turnovers, setTurnovers] = useState<DailyTurnover[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
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

    return () => {
      unsubRes();
      unsubSet();
      unsubTurn();
      unsubExp();
    };
  }, []);

  const translations: Record<Language, any> = {
    tr: {
      res: 'Buchung', fin: 'Finanz', staff: 'Personel', set: 'Ayar',
      adminTitle: 'YÖNETİM SÜİTİ'
    },
    de: {
      res: 'Buchung', fin: 'Finanzen', staff: 'Personal', set: 'Einst.',
      adminTitle: 'MANAGEMENT SUITE'
    },
    en: {
      res: 'Booking', fin: 'Finance', staff: 'Staff', set: 'Settings',
      adminTitle: 'MANAGEMENT SUITE'
    }
  };

  const t = translations[lang] || translations.de;

  if (view === 'admin' && !isAdminLoggedIn) {
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} onCancel={() => setView('public')} lang={lang} currentPin={settings.adminPin} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-32 overflow-x-hidden">
      <InstallPrompt lang={lang} />
      
      <header className="sticky top-0 z-40 px-6 py-6 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {view === 'public' && settings.restaurantLogo && (
               <img src={settings.restaurantLogo} className="h-10 w-auto object-contain" alt="Logo" />
            )}
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase">
                {view === 'admin' ? t.adminTitle : settings.restaurantName}
              </h1>
              <p className="text-[10px] text-primary uppercase font-black tracking-[0.2em] mt-0.5">
                {view === 'admin' ? adminView.toUpperCase() : "Tischreservierung"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 mr-2">
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
              <button onClick={() => { setIsAdminLoggedIn(false); setView('public'); }} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 active:scale-90 transition-all">
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-5 animate-in fade-in duration-700">
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
            {adminView === 'reservations' && (
              <ManagerDashboard 
                lang={lang} 
                reservations={reservations} 
                onDelete={deleteReservationFromDB} 
                onStatusUpdate={updateReservationStatus} 
              />
            )}
            {adminView === 'finance' && <Dashboard lang={lang} turnovers={turnovers} expenses={expenses} />}
            {adminView === 'personnel' && <PersonnelManagement lang={lang} />}
            {adminView === 'settings' && <SettingsManager lang={lang} settings={settings} />}
          </div>
        )}
      </main>

      {view === 'admin' && (
        <nav className="fixed bottom-8 left-6 right-6 z-50 max-w-sm mx-auto">
          <div className="glass bg-[#161616]/95 p-2 rounded-[2.5rem] shadow-2xl flex justify-between items-center border border-white/10">
            <button onClick={() => setAdminView('reservations')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'reservations' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Calendar size={20} /><span className="text-[8px] font-black uppercase tracking-widest">{t.res}</span>
            </button>
            <button onClick={() => setAdminView('finance')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'finance' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <TrendingUp size={20} /><span className="text-[8px] font-black uppercase tracking-widest">{t.fin}</span>
            </button>
            <button onClick={() => setAdminView('personnel')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'personnel' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Users size={20} /><span className="text-[8px] font-black uppercase tracking-widest">{t.staff}</span>
            </button>
            <button onClick={() => setAdminView('settings')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'settings' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Settings size={20} /><span className="text-[8px] font-black uppercase tracking-widest">{t.set}</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
