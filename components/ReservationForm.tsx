import React, { useState, useEffect } from 'react';
import { Users, Phone, User, Loader2, MessageSquare, Minus, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Reservation } from '../types';

interface Props {
  onSubmit: (data: Omit<Reservation, "id" | "createdAt" | "status" | "aiConfirmationMessage" | "aiChefNote">) => Promise<void>;
  isLoading: boolean;
}

const ReservationForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  // Varsayılan tarihi yerel saat dilimine göre ayarla
  const getLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: getLocalDate(),
    time: '',
    guests: 2,
    notes: ''
  });

  const [dateError, setDateError] = useState<string | null>(null);

  // Tarih değiştiğinde kontrol et
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay();

    // 0 = Pazar, 1 = Pazartesi, ... 6 = Cumartesi
    // Örnek: Pazartesi (1) kapalı olsun.
    if (dayOfWeek === 1) {
      setDateError("Montags haben wir leider Ruhetag. Bitte wählen Sie einen anderen Tag.");
      setFormData({ ...formData, date: selectedDate, time: '' }); // Tarihi set et ama hata göster
      return;
    }

    setDateError(null);
    setFormData({ ...formData, date: selectedDate });
  };

  // Saat dilimlerini oluştur
  const generateTimeSlots = () => {
    if (dateError) return []; // Hata varsa saat gösterme

    const slots = [];
    const startHour = 17; // Açılış 17:00
    const endHour = 22;   // Son mutfak siparişi 22:00
    
    // Seçilen tarih bugün mü?
    const isToday = formData.date === getLocalDate();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let hour = startHour; hour <= endHour; hour++) {
      const timeStringFull = `${hour}:00`;
      const timeStringHalf = `${hour}:30`;

      // Eğer bugün ise ve saat geçtiyse listeye ekleme
      if (!isToday || hour > currentHour || (hour === currentHour && currentMinute < 0)) {
         slots.push(timeStringFull);
      }
      
      // Buçuklu saat kontrolü
      if (hour !== endHour) { // 22:30 olmasın
        if (!isToday || hour > currentHour || (hour === currentHour && currentMinute < 30)) {
          slots.push(timeStringHalf);
        }
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Eğer mevcut seçili saat artık geçerli değilse (örn: gün değişti), saati sıfırla
  useEffect(() => {
    if (formData.time && !timeSlots.includes(formData.time)) {
      setFormData(prev => ({ ...prev, time: '' }));
    }
  }, [formData.date, dateError]);

  const handleGuestChange = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      guests: Math.max(1, prev.guests + amount)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) {
      alert(dateError);
      return;
    }
    if (!formData.time) {
      alert("Bitte wählen Sie eine Uhrzeit.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="glass p-6 sm:p-8 rounded-xl w-full mb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/20 p-3 rounded-full text-primary">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div>
           <h2 className="text-xl font-bold text-white leading-tight">Tisch reservieren</h2>
           <p className="text-sm text-white/60">Sichern Sie sich Ihren Platz.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Date Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Calendar size={16} className="text-primary"/> 
            Datum wählen
          </label>
          <div className="relative">
            <input
              required
              type="date"
              min={getLocalDate()} // Geçmiş tarih seçilemez
              className={`w-full bg-white/5 border rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-1 transition-all text-base [color-scheme:dark] appearance-none ${dateError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-primary focus:ring-primary'}`}
              value={formData.date}
              onChange={handleDateChange}
            />
          </div>
          {dateError && (
            <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{dateError}</span>
            </div>
          )}
        </div>

        {/* Time Selection (Chips) */}
        {!dateError && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Clock size={16} className="text-primary"/> 
              Verfügbare Zeiten
            </label>
            
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar py-1">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, time: slot })}
                    className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      formData.time === slot
                        ? 'bg-primary text-black border-primary shadow-lg scale-[1.02]'
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center text-sm text-white/50">
                Für heute sind leider keine Zeiten mehr verfügbar.
              </div>
            )}
          </div>
        )}

        {/* Guest Count */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Users size={16} className="text-primary"/> 
            Anzahl der Personen
          </label>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-2">
             <button
               type="button"
               onClick={() => handleGuestChange(-1)}
               className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
             >
               <Minus size={20} />
             </button>
             
             <div className="flex-1 text-center">
               <span className="text-2xl font-bold text-white">{formData.guests}</span>
             </div>

             <button
               type="button"
               onClick={() => handleGuestChange(1)}
               className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
             >
               <Plus size={20} />
             </button>
          </div>
        </div>

        {/* Personal Details */}
        <div className="space-y-4 pt-2">
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-white/40" size={18} />
            </div>
            <input
              required
              type="text"
              placeholder=" "
              className="peer w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label className="absolute left-10 -top-2.5 bg-[#111111] px-1 text-xs text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary">
              Vor- und Nachname
            </label>
          </div>

          <div className="group relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="text-white/40" size={18} />
            </div>
            <input
              required
              type="tel"
              placeholder=" "
              className="peer w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
             <label className="absolute left-10 -top-2.5 bg-[#111111] px-1 text-xs text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary">
              Telefonnummer
            </label>
          </div>

          <div className="relative">
             <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="text-white/40" size={18} />
            </div>
             <textarea
              placeholder="Anmerkungen (Allergien, Sonderwünsche...)"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.time || timeSlots.length === 0 || !!dateError}
          className="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Wird verarbeitet...
            </>
          ) : (
            'Kostenpflichtig buchen'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
