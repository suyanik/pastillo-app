import React, { useState } from 'react';
import { UtensilsCrossed, LayoutDashboard, PlusCircle } from 'lucide-react';
import ReservationForm from './components/ReservationForm';
import SuccessView from './components/SuccessView';
import ManagerDashboard from './components/ManagerDashboard';
import { Reservation } from './types';
import { processReservationAI } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'success' | 'manager'>('form');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const triggerNotification = (reservation: Reservation) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        new Notification(`Yeni Rezervasyon: ${reservation.time}`, {
          body: `${reservation.name} - ${reservation.guests} Kişi\n${reservation.notes || 'Not yok'}`,
          icon: 'https://cdn-icons-png.flaticon.com/512/706/706164.png',
          tag: 'new-reservation',
        });
      } catch (e) {
        console.log("Notification failed", e);
      }
    }
  };

  const handleReservationSubmit = async (data: Omit<Reservation, "id" | "createdAt">) => {
    setIsLoading(true);
    
    // Process with AI
    const aiResponse = await processReservationAI(data);

    const newReservation: Reservation = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      aiConfirmationMessage: aiResponse.confirmationMessage,
      aiChefNote: aiResponse.chefNote
    };

    // Save to state (In a real app, send to backend)
    setReservations(prev => [newReservation, ...prev]);
    setCurrentReservation(newReservation);
    
    // Trigger notification
    triggerNotification(newReservation);

    setIsLoading(false);
    setView('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-600 p-1.5 rounded-lg text-white">
            <UtensilsCrossed size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Pastillo</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto p-4 pt-6">
        {view === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-800">Hoş Geldiniz</h2>
              <p className="text-slate-500">Enfes lezzetler için yerinizi hemen ayırtın.</p>
            </div>
            <ReservationForm onSubmit={handleReservationSubmit} isLoading={isLoading} />
          </div>
        )}

        {view === 'success' && currentReservation && (
          <SuccessView 
            reservation={currentReservation} 
            onReset={() => setView('form')} 
          />
        )}

        {view === 'manager' && (
          <div className="animate-in fade-in duration-300">
            <ManagerDashboard reservations={reservations} />
          </div>
        )}
      </main>

      {/* Bottom Navigation (Simulating App Tab Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 pb-safe flex justify-around items-center z-20 max-w-md mx-auto">
        <button 
          onClick={() => setView('form')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'form' || view === 'success' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <PlusCircle size={24} />
          <span className="text-[10px] font-medium">Rezervasyon</span>
        </button>
        
        <button 
          onClick={() => setView('manager')}
          className={`flex flex-col items-center gap-1 transition-colors relative ${view === 'manager' ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Yönetim</span>
          {reservations.length > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {reservations.length}
            </span>
          )}
        </button>
      </nav>

      {/* Safe Area Spacer for iOS bottom bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default App;