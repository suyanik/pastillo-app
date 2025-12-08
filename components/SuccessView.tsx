import React from 'react';
import { CheckCircle, CalendarPlus, Home, Smartphone } from 'lucide-react';
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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle className="text-green-600" size={40} />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Harika!</h2>
      <p className="text-slate-600 mb-6 leading-relaxed px-2">
        {reservation.aiConfirmationMessage}
      </p>

      <div className="bg-slate-50 p-5 rounded-2xl mb-6 text-left border border-slate-100 shadow-inner">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">Rezervasyon Detayı</h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
          <span className="text-slate-500 font-medium">İsim:</span>
          <span className="font-bold text-slate-800 text-right truncate">{reservation.name}</span>
          
          <span className="text-slate-500 font-medium">Tarih:</span>
          <span className="font-bold text-slate-800 text-right">{reservation.date}</span>
          
          <span className="text-slate-500 font-medium">Saat:</span>
          <span className="font-bold text-slate-800 text-right">{reservation.time}</span>
          
          <span className="text-slate-500 font-medium">Kişi:</span>
          <span className="font-bold text-slate-800 text-right">{reservation.guests}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-3">
        <button
          onClick={handleAddToGoogleCalendar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <CalendarPlus size={20} />
          Google Takvim'e Ekle
        </button>

        <button
          onClick={handleAddToCalendarICS}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Smartphone size={20} />
          Takvim Dosyası İndir (.ics)
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-4 text-slate-500 py-2 text-sm font-medium hover:text-slate-800 transition-colors"
      >
        Ana Sayfaya Dön
      </button>
    </div>
  );
};

export default SuccessView;
