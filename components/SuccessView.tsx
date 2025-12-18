
import React from 'react';
import { Reservation, Language } from '../types';
import { downloadReservationICS, getGoogleCalendarUrl } from '../utils/calendarUtils';
import { Calendar, CheckCircle2, Home, Share2 } from 'lucide-react';

interface Props {
  reservation: Reservation;
  onReset: () => void;
  lang: Language;
}

const SuccessView: React.FC<Props> = ({ reservation, onReset, lang }) => {

  const handleAddToCalendarICS = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    downloadReservationICS(reservation);
  };

  const handleAddToGoogleCalendar = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    window.open(getGoogleCalendarUrl(reservation), '_blank');
  };

  const handleShareWhatsapp = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    const dateObj = new Date(reservation.date);
    const dateStr = dateObj.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const messages = {
      tr: `🍽️ Pastillo Rezervasyonu\n\n📅 Tarih: ${dateStr}\n⏰ Saat: ${reservation.time}\n👤 Kişi: ${reservation.guests}\n\nGörüşmek üzere! 🥂`,
      de: `🍽️ Reservierung bei Pastillo\n\n📅 Datum: ${dateStr}\n⏰ Zeit: ${reservation.time}\n👤 Personen: ${reservation.guests}\n\nIch freue mich! 🥂`,
      en: `🍽️ Reservation at Pastillo\n\n📅 Date: ${dateStr}\n⏰ Time: ${reservation.time}\n👤 Guests: ${reservation.guests}\n\nSee you there! 🥂`
    };

    const text = messages[lang] || messages.de;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const labels = {
    tr: { title: 'Onaylandı!', details: 'Detaylar', date: 'Tarih', time: 'Saat', name: 'İsim', guests: 'Kişi', save: 'Takvime Kaydet', google: 'Google Takvim', home: 'Anasayfa' },
    de: { title: 'Bestätigt!', details: 'Details', date: 'Datum', time: 'Uhrzeit', name: 'Name', guests: 'Gäste', save: 'In Kalender speichern', google: 'Google Kalender', home: 'Zurück zur Startseite' },
    en: { title: 'Confirmed!', details: 'Details', date: 'Date', time: 'Time', name: 'Name', guests: 'Guests', save: 'Save to Calendar', google: 'Google Calendar', home: 'Back Home' }
  };

  const l = labels[lang] || labels.de;

  return (
    <div className="flex flex-col items-center justify-start rounded-xl bg-white/5 border border-white/10 shadow-lg w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 mb-6 ring-1 ring-success/50">
        <CheckCircle2 className="text-success w-10 h-10" />
      </div>
      
      <h1 className="text-white tracking-tight text-2xl sm:text-3xl font-bold leading-tight pb-3">
        {l.title}
      </h1>
      <p className="text-white/70 text-base font-normal leading-normal pb-8 px-2">
        {reservation.aiConfirmationMessage}
      </p>

      <div className="w-full text-left bg-[#1c1c1c] p-5 rounded-xl border border-white/10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
            <Calendar size={64} className="text-white" />
        </div>
        <p className="text-white text-lg font-bold leading-tight tracking-tight mb-4 border-b border-white/10 pb-2">
            {l.details}
        </p>
        <div className="grid grid-cols-1 gap-y-1">
            <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">{l.date}</span>
                <span className="text-white text-sm font-medium">
                  {new Date(reservation.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">{l.time}</span>
                <span className="text-white text-sm font-medium">{reservation.time}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">{l.name}</span>
                <span className="text-white text-sm font-medium truncate max-w-[150px]">{reservation.name}</span>
            </div>
             <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm">{l.guests}</span>
                <span className="text-white text-sm font-medium">{reservation.guests}</span>
            </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
           <button 
             onClick={handleAddToCalendarICS}
             className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
             <Calendar size={20} strokeWidth={2.5} />
             {l.save}
          </button>

          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={handleAddToGoogleCalendar}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                {l.google}
              </button>
              
              <button 
                onClick={handleShareWhatsapp}
                className="w-full bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366]/30 text-[#25D366] py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                WhatsApp
              </button>
          </div>

          <button 
            onClick={onReset}
            className="mt-4 text-white/40 text-sm font-medium hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
          >
            <Home size={14} />
            {l.home}
          </button>
      </div>
    </div>
  );
};

export default SuccessView;
