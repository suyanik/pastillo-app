
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, AlertTriangle, UtensilsCrossed, Globe } from 'lucide-react';
import ReservationForm from './components/ReservationForm';
import SuccessView from './components/SuccessView';
import ManagerDashboard from './components/ManagerDashboard';
import AdminLogin from './components/AdminLogin';
import InstallPrompt from './components/InstallPrompt';
import Menu from './components/Menu';
import { Reservation, ReservationStatus, Language } from './types';
import { processReservationAI } from './services/geminiService';
import { addReservationToDB, deleteReservationFromDB, updateReservationStatus, subscribeToReservations } from './services/firebase';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'success' | 'manager' | 'menu'>('form');
  const [lang, setLang] = useState<Language>('tr');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  useEffect(() => {
    try {
      const unsubscribe = subscribeToReservations((data) => {
        setReservations(data);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleLanguage = () => {
    const langs: Language[] = ['tr', 'de', 'en', 'es'];
    const currentIndex = langs.indexOf(lang);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLang(langs[nextIndex]);
    if (navigator.vibrate) navigator.vibrate(5);
  };

  const handleReservationSubmit = async (data: Omit<Reservation, "id" | "createdAt" | "status">) => {
    setIsLoading(true);
    if (navigator.vibrate) navigator.vibrate(20);
    
    try {
      const aiResponse = await processReservationAI(data, lang);
      const reservationData = {
        ...data,
        status: 'confirmed' as ReservationStatus,
        aiConfirmationMessage: aiResponse.confirmationMessage,
        aiChefNote: aiResponse.chefNote
      };

      await addReservationToDB(reservationData);
      setCurrentReservation({ ...reservationData, id: "temp-id", createdAt: Date.now() });
      setIsLoading(false);
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setView('success');
    } catch (error) {
      const errorMsg = {
        tr: "Hata oluştu!",
        de: "Ein Fehler ist aufgetreten!",
        en: "An error occurred!",
        es: "¡Ocurrió un error!"
      };
      alert(errorMsg[lang]);
      setIsLoading(false);
    }
  };

  const handleManagerClick = () => {
    if (isAdminLoggedIn) setView('manager');
    else setShowLogin(true);
  };

  const texts = {
    tr: { welcome: 'Hoş Geldiniz', sub: 'Harika bir akşam yemeği için yerinizi ayırtın.' },
    de: { welcome: 'Willkommen', sub: 'Sichern Sie sich einen Tisch für heute Abend.' },
    en: { welcome: 'Welcome', sub: 'Reserve your table for a wonderful dinner.' },
    es: { welcome: 'Bienvenidos', sub: 'Reserve su mesa para una cena maravillosa.' }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans pb-safe selection:bg-primary">
      <InstallPrompt />
      {showLogin && <AdminLogin onLogin={() => { setIsAdminLoggedIn(true); setShowLogin(false); setView('manager'); }} onCancel={() => setShowLogin(false)} />}

      <header className="sticky top-0 z-10 px-6 py-5 flex items-center justify-between border-b border-white/10 bg-[#111111]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="size-5 text-primary">
            <svg fill="none" viewBox="0 0 48 48" className="w-full h-full"><path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path></svg>
          </div>
          <h1 className="text-xl font-bold text-white">Pastillo <span className="text-primary font-light">&</span> Bar</h1>
        </div>
        <button onClick={toggleLanguage} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white/10 transition-colors">
          <Globe size={14} className="text-primary" />
          {lang.toUpperCase()}
        </button>
      </header>

      <main className="max-w-md mx-auto p-5 pt-8">
        {view === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8 px-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{texts[lang].welcome}</h2>
              <p className="text-white/60 font-medium text-lg mt-1">{texts[lang].sub}</p>
            </div>
            <ReservationForm onSubmit={handleReservationSubmit} isLoading={isLoading} existingReservations={reservations} lang={lang} />
          </div>
        )}
        {view === 'menu' && <Menu lang={lang} />}
        {view === 'success' && currentReservation && <SuccessView reservation={currentReservation} onReset={() => setView('form')} lang={lang} />}
        {view === 'manager' && <ManagerDashboard reservations={reservations} onDelete={deleteReservationFromDB} onStatusUpdate={updateReservationStatus} lang={lang} />}
      </main>

      <div className="fixed bottom-6 left-6 right-6 z-20 max-w-sm mx-auto">
        <nav className="glass bg-[#1c1c1c]/90 p-1.5 rounded-[2rem] shadow-2xl flex justify-between items-center border border-white/10">
          <button onClick={() => setView('form')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] transition-all ${view === 'form' || view === 'success' ? 'bg-primary text-black font-bold' : 'text-white/40'}`}>
            <PlusCircle size={20} />
          </button>
          <button onClick={() => setView('menu')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] transition-all ${view === 'menu' ? 'bg-primary text-black font-bold' : 'text-white/40'}`}>
            <UtensilsCrossed size={20} />
          </button>
          <button onClick={handleManagerClick} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] transition-all relative ${view === 'manager' ? 'bg-white text-black font-bold' : 'text-white/40'}`}>
            <LayoutDashboard size={20} />
            {reservations.filter(r => r.status === 'confirmed').length > 0 && view !== 'manager' && <span className="absolute top-2 right-8 w-2 h-2 bg-primary rounded-full border border-black"></span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
