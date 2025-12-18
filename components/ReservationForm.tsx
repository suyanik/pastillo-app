
import React, { useState, useEffect, useMemo } from 'react';
import { Users, Phone, User, Loader2, MessageSquare, Minus, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Reservation, Language } from '../types';

interface Props {
  onSubmit: (data: Omit<Reservation, "id" | "createdAt" | "status" | "aiConfirmationMessage" | "aiChefNote">) => Promise<void>;
  isLoading: boolean;
  existingReservations: Reservation[];
  lang: Language;
}

const MAX_GUESTS_PER_SLOT = 20; 

const ReservationForm: React.FC<Props> = ({ onSubmit, isLoading, existingReservations, lang }) => {
  const getLocalDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

  const translations = {
    tr: {
      date: 'Tarih Seçin',
      guests: 'Kişi Sayısı',
      time: 'Müsait Saatler',
      name: 'Ad Soyad',
      phone: 'Telefon',
      submit: 'Rezervasyon Yap',
      closedDay: 'Salı günleri kapalıyız.'
    },
    de: {
      date: 'Datum wählen',
      guests: 'Personenanzahl',
      time: 'Verfügbare Zeiten',
      name: 'Vor- und Nachname',
      phone: 'Telefonnummer',
      submit: 'Kostenpflichtig buchen',
      closedDay: 'Dienstags haben wir Ruhetag.'
    },
    en: {
      date: 'Select Date',
      guests: 'Number of Guests',
      time: 'Available Times',
      name: 'Full Name',
      phone: 'Phone Number',
      submit: 'Book Table',
      closedDay: 'Closed on Tuesdays.'
    },
    es: {
      date: 'Seleccionar Fecha',
      guests: 'Número de Personas',
      time: 'Horarios Disponibles',
      name: 'Nombre y Apellido',
      phone: 'Teléfono',
      submit: 'Reservar Mesa',
      closedDay: 'Cerrado los martes.'
    }
  };

  const t = translations[lang];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    if (value.length > 4) value = `${value.slice(0, 4)} ${value.slice(4)}`;
    setFormData({ ...formData, phone: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) return;
    
    // getDay(): 0=Pazar, 1=Pazartesi, 2=Salı...
    const dayOfWeek = new Date(selectedDate).getDay();
    if (dayOfWeek === 2) {
      setDateError(t.closedDay);
      return;
    }
    setDateError(null);
    setFormData({ ...formData, date: selectedDate });
  };

  const timeSlots = useMemo(() => {
    if (dateError) return [];
    const slots: string[] = [];
    const startHour = 11; // Kullanıcı 11:00 dedi
    const endHour = 22;   // 23:00'e kadar açık ama son rezervasyon 22:30 olabilir
    const isToday = formData.date === getLocalDate();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const dailyRes = existingReservations.filter(r => r.date === formData.date && r.status !== 'cancelled');

    for (let hour = startHour; hour <= endHour; hour++) {
      [":00", ":30"].forEach(m => {
        // 22:30 son slot olabilir (23:00 kapanış için)
        const time = `${hour}${m}`;
        const slotHour = hour;
        const slotMinute = m === ":30" ? 30 : 0;

        const alreadyBooked = dailyRes.filter(r => r.time === time).reduce((s, r) => s + r.guests, 0);
        
        if (alreadyBooked + formData.guests <= MAX_GUESTS_PER_SLOT) {
            if (!isToday) {
                slots.push(time);
            } else {
                // Bugün için en az 1 saat sonrası
                if (slotHour > currentHour + 1 || (slotHour === currentHour + 1 && slotMinute >= currentMinute)) {
                    slots.push(time);
                }
            }
        }
      });
    }
    return slots;
  }, [formData.date, formData.guests, existingReservations, dateError]);

  return (
    <div className="glass p-6 sm:p-8 rounded-xl w-full mb-12 box-border">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-8 max-w-full overflow-hidden">
        <div className="space-y-3 w-full">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Calendar size={16} className="text-primary"/> {t.date}
          </label>
          <input 
            required 
            type="date" 
            min={getLocalDate()} 
            className="block w-full max-w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white text-base [color-scheme:dark] box-border focus:ring-1 focus:ring-primary focus:outline-none" 
            value={formData.date} 
            onChange={handleDateChange} 
          />
          {dateError && <p className="text-red-400 text-sm flex items-center gap-2 mt-2 font-medium"><AlertCircle size={14}/> {dateError}</p>}
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Users size={16} className="text-primary"/> {t.guests}
          </label>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-2">
             <button type="button" onClick={() => setFormData(p => ({...p, guests: Math.max(1, p.guests-1)}))} className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white active:scale-95 transition-all"><Minus size={20}/></button>
             <div className="flex-1 text-center"><span className="text-2xl font-bold text-white">{formData.guests}</span></div>
             <button type="button" onClick={() => setFormData(p => ({...p, guests: p.guests+1}))} className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white active:scale-95 transition-all"><Plus size={20}/></button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Clock size={16} className="text-primary"/> {t.time}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(s => (
              <button 
                key={s} 
                type="button" 
                onClick={() => {
                  setFormData({...formData, time: s});
                  if (navigator.vibrate) navigator.vibrate(10);
                }} 
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.time === s ? 'bg-primary text-black border-primary scale-[1.02] shadow-lg shadow-primary/20' : 'bg-white/5 text-white border-white/10'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {timeSlots.length === 0 && !dateError && (
             <p className="text-white/40 text-xs italic text-center mt-2">Bu tarih için müsait saat kalmadı.</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-4 text-white/40" size={18} />
            <input required type="text" placeholder={t.name} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-base focus:ring-1 focus:ring-primary focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-4 text-white/40" size={18} />
            <input required type="tel" placeholder={t.phone} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-base focus:ring-1 focus:ring-primary focus:outline-none" value={formData.phone} onChange={handlePhoneChange} />
          </div>
        </div>

        <button type="submit" disabled={isLoading || !formData.time} className="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-xl font-extrabold text-lg disabled:opacity-50 active:scale-[0.98] transition-all shadow-xl shadow-primary/10">
          {isLoading ? <Loader2 className="animate-spin mx-auto"/> : t.submit}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;

