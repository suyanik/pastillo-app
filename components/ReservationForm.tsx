
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
      monday: 'Pazartesi günleri kapalıyız.'
    },
    de: {
      date: 'Datum wählen',
      guests: 'Personenanzahl',
      time: 'Verfügbare Zeiten',
      name: 'Vor- und Nachname',
      phone: 'Telefonnummer',
      submit: 'Kostenpflichtig buchen',
      monday: 'Montags haben wir Ruhetag.'
    },
    en: {
      date: 'Select Date',
      guests: 'Number of Guests',
      time: 'Available Times',
      name: 'Full Name',
      phone: 'Phone Number',
      submit: 'Book Table',
      monday: 'Closed on Mondays.'
    },
    es: {
      date: 'Seleccionar Fecha',
      guests: 'Número de Personas',
      time: 'Horarios Disponibles',
      name: 'Nombre y Apellido',
      phone: 'Teléfono',
      submit: 'Reservar Mesa',
      monday: 'Cerrado los lunes.'
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
    const dayOfWeek = new Date(selectedDate).getDay();
    if (dayOfWeek === 1) {
      setDateError(t.monday);
      return;
    }
    setDateError(null);
    setFormData({ ...formData, date: selectedDate });
  };

  const timeSlots = useMemo(() => {
    if (dateError) return [];
    const slots: string[] = []; // Burada tip tanımlandı
    const startHour = 12;
    const endHour = 22;
    const isToday = formData.date === getLocalDate();
    const now = new Date();
    const currentHour = now.getHours();
    
    const dailyRes = existingReservations.filter(r => r.date === formData.date && r.status !== 'cancelled');

    for (let hour = startHour; hour <= endHour; hour++) {
      [":00", ":30"].forEach(m => {
        if (hour === 22 && m === ":30") return;
        const time = `${hour}${m}`;
        const alreadyBooked = dailyRes.filter(r => r.time === time).reduce((s, r) => s + r.guests, 0);
        if (alreadyBooked + formData.guests <= MAX_GUESTS_PER_SLOT) {
            if (!isToday || hour > currentHour) slots.push(time);
        }
      });
    }
    return slots;
  }, [formData.date, formData.guests, existingReservations, dateError]);

  return (
    <div className="glass p-6 sm:p-8 rounded-xl w-full mb-12">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-8">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Calendar size={16} className="text-primary"/> {t.date}
          </label>
          <input required type="date" min={getLocalDate()} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white [color-scheme:dark]" value={formData.date} onChange={handleDateChange} />
          {dateError && <p className="text-red-400 text-sm flex items-center gap-2 mt-2"><AlertCircle size={14}/> {dateError}</p>}
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Users size={16} className="text-primary"/> {t.guests}
          </label>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-2">
             <button type="button" onClick={() => setFormData(p => ({...p, guests: Math.max(1, p.guests-1)}))} className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white"><Minus size={20}/></button>
             <div className="flex-1 text-center"><span className="text-2xl font-bold text-white">{formData.guests}</span></div>
             <button type="button" onClick={() => setFormData(p => ({...p, guests: p.guests+1}))} className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white"><Plus size={20}/></button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Clock size={16} className="text-primary"/> {t.time}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(s => (
              <button key={s} type="button" onClick={() => setFormData({...formData, time: s})} className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${formData.time === s ? 'bg-primary text-black border-primary' : 'bg-white/5 text-white border-white/10'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-white/40" size={18} />
            <input required type="text" placeholder={t.name} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-white/40" size={18} />
            <input required type="tel" placeholder={t.phone} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white" value={formData.phone} onChange={handlePhoneChange} />
          </div>
        </div>

        <button type="submit" disabled={isLoading || !formData.time} className="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-xl font-bold text-lg disabled:opacity-50">
          {isLoading ? <Loader2 className="animate-spin mx-auto"/> : t.submit}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;

