
import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Calendar, LayoutDashboard, 
  Settings, LogOut, Plus, PlusCircle, UserCog
} from 'lucide-react';

// Components
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import ManagerDashboard from './components/ManagerDashboard';
import ReservationForm from './components/ReservationForm';
import PersonnelManagement from './components/PersonnelManagement';
import InstallPrompt from './components/InstallPrompt';

// Services & Types
import { Reservation, Language, ReservationStatus } from './types';
import { subscribeToReservations, addReservationToDB, updateReservationStatus, deleteReservationFromDB } from './services/firebase';

const App: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminView, setAdminView] = useState<'reservations' | 'finance' | 'personnel' | 'settings'>('reservations');
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [lang, setLang] = useState<Language>('tr');
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToReservations((data) => {
      setReservations(data);
    });
    return () => unsubscribe();
  }, []);

  const translations: Record<Language, any> = {
    tr: {
      res: 'Buchung',
      fin: 'Finanz',
      staff: 'Personel',
      set: 'Ayar',
      adminTitle: 'YÖNETİM SÜİTİ',
      customerTitle: 'PASTILLO BUTZBACH',
      customerSub: 'Masa Rezervasyonu'
    },
    de: {
      res: 'Buchung',
      fin: 'Finanzen',
      staff: 'Personal',
      set: 'Einst.',
      adminTitle: 'MANAGEMENT SUITE',
      customerTitle: 'PASTILLO BUTZBACH',
      customerSub: 'Tischreservierung'
    },
    en: {
      res: 'Booking',
      fin: 'Finance',
      staff: 'Staff',
      set: 'Settings',
      adminTitle: 'MANAGEMENT SUITE',
      customerTitle: 'PASTILLO BUTZBACH',
      customerSub: 'Table Reservation'
    },
    es: {
      res: 'Reserva',
      fin: 'Finanzas',
      staff: 'Personal',
      set: 'Ajustes',
      adminTitle: 'SUITE DE GESTIÓN',
      customerTitle: 'PASTILLO BUTZBACH',
      customerSub: 'Reserva de Mesa'
    }
  };

  const t = translations[lang] || translations.tr;

  // Handle Admin Access
  if (view === 'admin' && !isAdminLoggedIn) {
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} onCancel={() => setView('public')} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-32 overflow-x-hidden">
      <InstallPrompt lang={lang} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-6 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              {view === 'admin' ? t.adminTitle : t.customerTitle}
            </h1>
            <p className="text-[10px] text-primary uppercase font-black tracking-[0.2em] mt-0.5">
              {view === 'admin' ? adminView.toUpperCase() : t.customerSub}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 mr-2">
              {(['tr', 'de', 'en', 'es'] as Language[]).map((l) => (
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
              <button 
                onClick={() => setView('admin')}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-primary active:scale-90 transition-all"
              >
                <UserCog size={20} />
              </button>
            ) : (
              <button 
                onClick={() => { setIsAdminLoggedIn(false); setView('public'); }}
                className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 active:scale-90 transition-all"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-5 animate-in fade-in duration-700">
        {view === 'public' ? (
          <div className="space-y-6">
            <ReservationForm 
              lang={lang} 
              isLoading={false} 
              onSubmit={async (data) => {
                await addReservationToDB({...data, status: 'confirmed'});
                alert(lang === 'tr' ? 'Rezervasyonunuz alındı!' : 'Reservierung erfolgreich!');
              }} 
              existingReservations={reservations} 
            />
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
            {adminView === 'finance' && <Dashboard lang={lang} records={[]} />}
            {adminView === 'personnel' && <PersonnelManagement lang={lang} />}
            {adminView === 'settings' && (
              <div className="space-y-4">
                 <div className="glass p-6 rounded-[2rem] border border-white/5">
                    <h3 className="text-lg font-black text-white mb-2">
                      {lang === 'tr' ? 'Restoran Ayarları' : lang === 'de' ? 'Restaurant Einstellungen' : 'Restaurant Settings'}
                    </h3>
                    <p className="text-white/40 text-sm">
                      {lang === 'tr' ? 'Burası yönetim ayarlarını yapacağınız bölüm.' : lang === 'de' ? 'Hier können Sie die Verwaltungseinstellungen vornehmen.' : 'This is where you can make management settings.'}
                    </p>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Admin Tab Bar */}
      {view === 'admin' && (
        <nav className="fixed bottom-8 left-6 right-6 z-50 max-w-sm mx-auto">
          <div className="glass bg-[#161616]/95 p-2 rounded-[2.5rem] shadow-2xl flex justify-between items-center border border-white/10">
            <button onClick={() => setAdminView('reservations')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'reservations' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Calendar size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">{t.res}</span>
            </button>
            <button onClick={() => setAdminView('finance')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'finance' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <TrendingUp size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">{t.fin}</span>
            </button>
            <button onClick={() => setAdminView('personnel')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'personnel' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Users size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">{t.staff}</span>
            </button>
            <button onClick={() => setAdminView('settings')} className={`flex-1 flex flex-col items-center gap-1 py-3.5 rounded-[2.2rem] transition-all ${adminView === 'settings' ? 'bg-primary text-black' : 'text-white/30'}`}>
              <Settings size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">{t.set}</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;

