import React from 'react';
import { Reservation } from '../types';
import { downloadReservationICS, getGoogleCalendarUrl } from '../utils/calendarUtils';

interface Props {
  reservation: Reservation;
  onReset: () => void;
}

const SuccessView: React.FC<Props> = ({ reservation, onReset }) => {

  const handleAddToCalendarICS = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    downloadReservationICS(reservation);
  };

  const handleAddToGoogleCalendar = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    window.open(getGoogleCalendarUrl(reservation), '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-start rounded-xl bg-white/5 border border-white/10 shadow-lg w-full p-6 sm:p-10 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-6">
        <span className="material-symbols-outlined text-primary text-4xl">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
        </span>
      </div>
      
      <h1 className="text-white tracking-tight text-2xl sm:text-3xl font-bold leading-tight pb-3">
        Ihre Reservierung ist bestätigt!
      </h1>
      <p className="text-white/70 text-base font-normal leading-normal pb-8 px-2">
        {reservation.aiConfirmationMessage}
      </p>

      <div className="w-full text-left bg-[#1c1c1c] p-6 rounded-lg border border-white/10 mb-8">
        <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Reservierungsdetails</p>
        <div className="grid grid-cols-1 gap-y-1">
            <div className="grid grid-cols-[40%_1fr] sm:grid-cols-[30%_1fr] border-t border-t-white/10 py-3">
                <p className="text-white/60 text-sm font-normal">Datum</p>
                <p className="text-white text-sm font-normal text-right">{reservation.date}</p>
            </div>
            <div className="grid grid-cols-[40%_1fr] sm:grid-cols-[30%_1fr] border-t border-t-white/10 py-3">
                <p className="text-white/60 text-sm font-normal">Uhrzeit</p>
                <p className="text-white text-sm font-normal text-right">{reservation.time}</p>
            </div>
            <div className="grid grid-cols-[40%_1fr] sm:grid-cols-[30%_1fr] border-t border-t-white/10 py-3">
                <p className="text-white/60 text-sm font-normal">Name</p>
                <p className="text-white text-sm font-normal text-right truncate">{reservation.name}</p>
            </div>
             <div className="grid grid-cols-[40%_1fr] sm:grid-cols-[30%_1fr] border-t border-t-white/10 py-3">
                <p className="text-white/60 text-sm font-normal">Personen</p>
                <p className="text-white text-sm font-normal text-right">{reservation.guests}</p>
            </div>
            <div className="grid grid-cols-[40%_1fr] sm:grid-cols-[30%_1fr] border-t border-t-white/10 py-3">
                <p className="text-white/60 text-sm font-normal">Telefon</p>
                <p className="text-white text-sm font-normal text-right">{reservation.phone}</p>
            </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
          <button 
             onClick={handleAddToGoogleCalendar}
             className="flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/10 px-6 py-3 text-center text-sm font-bold text-white shadow-sm transition-all hover:bg-white/20"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
             Zu Google Kalender hinzufügen
          </button>
          
           <button 
             onClick={handleAddToCalendarICS}
             className="flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 px-6 py-3 text-center text-sm font-medium text-white/80 shadow-sm transition-all hover:bg-white/10"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
             .ICS Datei herunterladen
          </button>

          <button 
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-center text-base font-bold text-black shadow-sm transition-all hover:bg-primary/90 mt-2"
          >
            Zurück zur Startseite
          </button>
      </div>
    </div>
  );
};

export default SuccessView;
