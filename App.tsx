import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, AlertTriangle } from 'lucide-react';
import ReservationForm from './components/ReservationForm';
import SuccessView from './components/SuccessView';
import ManagerDashboard from './components/ManagerDashboard';
import AdminLogin from './components/AdminLogin';
import { Reservation, ReservationStatus } from './types';
import { processReservationAI } from './services/geminiService';
import { addReservationToDB, deleteReservationFromDB, updateReservationStatus, subscribeToReservations } from './services/firebase';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'success' | 'manager'>('form');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState(false);
  
  // Admin Login State
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Firebase'i dinle (Realtime Updates)
  useEffect(() => {
    try {
      const unsubscribe = subscribeToReservations((data) => {
        setReservations(data);
        setDbError(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase connection error:", err);
      setDbError(true);
    }
  }, []);

  const triggerNotification = (reservation: Omit<Reservation, "id" | "createdAt">) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        new Notification(`Neue Reservierung: ${reservation.time}`, {
          body: `${reservation.name} - ${reservation.guests} Personen\n${reservation.notes || 'Keine Anmerkungen'}`,
          icon: 'https://cdn-icons-png.flaticon.com/512/706/706164.png',
          tag: 'new-reservation',
        });
      } catch (e) {
        console.log("Notification failed", e);
      }
    }
  };

  const handleReservationSubmit = async (data: Omit<Reservation, "id" | "createdAt" | "status">) => {
    setIsLoading(true);
    if (navigator.vibrate) navigator.vibrate(20);
    
    try {
      // 1. Yapay Zeka ile İşle
      const aiResponse = await processReservationAI(data);

      const reservationData = {
        ...data,
        status: 'confirmed' as ReservationStatus, // Varsayılan olarak onaylı
        aiConfirmationMessage: aiResponse.confirmationMessage,
        aiChefNote: aiResponse.chefNote
      };

      // 2. Firebase'e Kaydet
      await addReservationToDB(reservationData);

      // UI Güncellemeleri
      setCurrentReservation({
        ...reservationData,
        id: "temp-id",
        createdAt: Date.now()
      });
      
      triggerNotification(reservationData);

      setIsLoading(false);
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setView('success');
    } catch (error) {
      console.error("Reservation failed:", error);
      alert("Hata: Rezervasyon kaydedilemedi. Lütfen internet bağlantınızı kontrol edin.");
      setIsLoading(false);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      await deleteReservationFromDB(id);
    } catch (error) {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const handleStatusUpdate = async (id: string, status: ReservationStatus) => {
    try {
      await updateReservationStatus(id, status);
    } catch (error) {
      alert("Durum güncellemesi başarısız oldu.");
    }
  };

  const handleManagerClick = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    
    if (isAdminLoggedIn) {
      setView('manager');
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowLogin(false);
    setView('manager');
  };

  if (dbError) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="text-primary mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2">Datenbankverbindung fehlt</h2>
        <p className="text-white/60 mb-6">Bitte überprüfen Sie die Firebase-Konfiguration.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans pb-safe selection:bg-primary selection:text-black">
      
      {/* Admin Login Modal */}
      {showLogin && (
        <AdminLogin 
          onLogin={handleLoginSuccess}
          onCancel={() => setShowLogin(false)}
        />
      )}

      {/* Dynamic Header */}
      <header className={`sticky top-0 z-10 transition-all duration-300 px-6 py-5 flex items-center justify-between border-b border-white/10 ${view === 'manager' ? 'bg-[#1c1c1c]' : 'bg-[#111111]/80 backdrop-blur-md'}`}>
        <div className="flex items-center gap-3">
          <div className="size-5 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
            </svg>
          </div>
          <div>
             <h1 className="text-xl font-bold tracking-tight leading-none text-white">Pastillo <span className="text-primary font-light">&</span> Bar</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto p-5 pt-8">
        {view === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8 px-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Willkommen</h2>
              <p className="text-white/60 font-medium text-lg mt-1">Wir freuen uns darauf, Sie heute Abend zu bedienen.</p>
            </div>
            <ReservationForm 
              onSubmit={handleReservationSubmit} 
              isLoading={isLoading} 
              existingReservations={reservations}
            />
          </div>
        )}

        {view === 'success' && currentReservation && (
          <SuccessView 
            reservation={currentReservation} 
            onReset={() => setView('form')} 
          />
        )}

        {view === 'manager' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <ManagerDashboard 
              reservations={reservations} 
              onDelete={handleDeleteReservation}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        )}
      </main>

      {/* iOS Style Floating Tab Bar */}
      <div className="fixed bottom-6 left-6 right-6 z-20 max-w-sm mx-auto">
        <nav className="glass bg-[#1c1c1c]/80 p-1.5 rounded-[2rem] shadow-2xl flex justify-between items-center relative border border-white/10">
          
          <button 
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(10);
              setView('form');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] transition-all duration-300 ${view === 'form' || view === 'success' ? 'bg-primary text-black shadow-lg font-bold' : 'text-white/40 hover:text-white'}`}
          >
            <PlusCircle size={20} strokeWidth={2.5} />
            {(view === 'form' || view === 'success') && <span className="text-sm">Reservierung</span>}
          </button>
          
          <button 
            onClick={handleManagerClick}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] transition-all duration-300 relative ${view === 'manager' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <LayoutDashboard size={20} strokeWidth={2.5} />
            {view === 'manager' && <span className="text-sm font-bold">Admin</span>}
            
            {/* Notification Badge - Sadece bekleyen/onaylı rezervasyonlar için */}
            {reservations.filter(r => r.status !== 'cancelled').length > 0 && view !== 'manager' && (
              <span className="absolute top-2 right-8 w-2.5 h-2.5 bg-primary rounded-full border-2 border-black"></span>
            )}
          </button>
        </nav>
      </div>

      {/* Spacer */}
      <div className="h-24"></div>
    </div>
  );
};

export default App;
