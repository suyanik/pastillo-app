import React, { useEffect } from 'react';
import { Reservation } from '../types';
import { downloadReservationICS, getGoogleCalendarUrl } from '../utils/calendarUtils';
import { Calendar, CheckCircle2, Home } from 'lucide-react';

interface Props {
  reservation: Reservation;
  onReset: () => void;
}

const SuccessView: React.FC<Props> = ({ reservation, onReset }) => {

  // Sayfa açıldığında otomatik olarak takvime eklemeyi dene (Kullanıcı deneyimi için)
  // Not: iOS Safari bazen kullanıcı etkileşimi olmadan indirmeyi engelleyebilir, bu yüzden buton hala gereklidir.
  useEffect(() => {
    const timer = setTimeout(() => {
       // Otomatik indirmeyi çok agresif yapmamak için yorum satırına aldım.
       // İstenirse burası açılabilir: downloadReservationICS(reservation);
    }, 1000);
    return () => clearTimeout(timer);
  }, [reservation]);

  const handleAddToCalendarICS = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    downloadReservationICS(reservation);
  };

  const handleAddToGoogleCalendar = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    window.open(getGoogleCalendarUrl(reservation), '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-start rounded-xl bg-white/5 border border-white/10 shadow-lg w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 mb-6 ring-1 ring-success/50">
        <CheckCircle2 className="text-success w-10 h-10" />
      </div>
      
      <h1 className="text-white tracking-tight text-2xl sm:text-3xl font-bold leading-tight pb-3">
        Bestätigt!
      </h1>
      <p className="text-white/70 text-base font-normal leading-normal pb-8 px-2">
        {reservation.aiConfirmationMessage}
      </p>

      {/* Reservation Details Card */}
      <div className="w-full text-left bg-[#1c1c1c] p-5 rounded-xl border border-white/10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
            <Calendar size={64} className="text-white" />
        </div>
        <p className="text-white text-lg font-bold leading-tight tracking-tight mb-4 border-b border-white/10 pb-2">
            Details
        </p>
        <div className="grid grid-cols-1 gap-y-1">
            <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">Datum</span>
                <span className="text-white text-sm font-medium">{reservation.date}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">Uhrzeit</span>
                <span className="text-white text-sm font-medium">{reservation.time}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">Name</span>
                <span className="text-white text-sm font-medium truncate max-w-[150px]">{reservation.name}</span>
            </div>
             <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">Gäste</span>
                <span className="text-white text-sm font-medium">{reservation.guests}</span>
            </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
           {/* Primary Action: Add to iOS Calendar */}
           <button 
             onClick={handleAddToCalendarICS}
             className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
             <Calendar size={20} strokeWidth={2.5} />
             In Kalender speichern
          </button>
          
          <button 
             onClick={handleAddToGoogleCalendar}
             className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
             Google Kalender
          </button>

          <button 
            onClick={onReset}
            className="mt-4 text-white/40 text-sm font-medium hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
          >
            <Home size={14} />
            Zurück zur Startseite
          </button>
      </div>
    </div>
  );
};

export default SuccessView;
