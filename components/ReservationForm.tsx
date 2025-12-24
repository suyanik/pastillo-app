import React, { useState, useMemo } from 'react';
import { Users, Phone, User, Loader2, Minus, Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Reservation, Language, AppSettings } from '../types';

interface Props {
  onSubmit: (data: Omit<Reservation, "id" | "createdAt" | "status" | "aiConfirmationMessage" | "aiChefNote">) => Promise<void>;
  isLoading: boolean;
  existingReservations: Reservation[];
  lang: Language;
  settings: AppSettings;
}

const ReservationForm: React.FC<Props> = ({ onSubmit, isLoading, existingReservations, lang, settings }) => {
  const getLocalDate = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: getLocalDate(),
    time: '',
    guests: 2,
    notes: ''
  });

  const [dateError, setDateError] = useState<string | null>(null);

  const translations: Record<Language, Record<string, string>> = {
    tr: { title: 'REZERVASYON', date: 'Tarih Seçin', guests: 'Kişi Sayısı', time: 'Müsait Saatler', name: 'Ad Soyad', phone: 'Telefon', submit: 'Rezervasyon Yap', holiday: 'Restoran bu tarihte kapalıdır.' },
    de: { title: 'RESERVIERUNG', date: 'Datum wählen', guests: 'Personenanzahl', time: 'Verfügbare Zeiten', name: 'Vor- und Nachname', phone: 'Telefonnummer', submit: 'Kostenpflichtig buchen', holiday: 'Das Restaurant ist an diesem Tag geschlossen.' },
    en: { title: 'RESERVATION', date: 'Select Date', guests: 'Number of Guests', time: 'Available Times', name: 'Full Name', phone: 'Phone Number', submit: 'Book Table', holiday: 'The restaurant is closed on this date.' },
    es: { title: 'RESERVA', date: 'Seleccionar fecha', guests: 'Número de personas', time: 'Horas disponibles', name: 'Nombre y apellido', phone: 'Número de teléfono', submit: 'Reservar mesa', holiday: 'El restaurante está cerrado en esta fecha.' }
  };

  const t = translations[lang] || translations.de;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (settings.holidays.includes(selectedDate)) {
      setDateError(t.holiday);
    } else {
      setDateError(null);
    }
    setFormData({ ...formData, date: selectedDate, time: '' });
  };

  const timeSlots = useMemo(() => {
    if (dateError) return [];
    const slots: string[] = [];
    const startHour = 11;
    const endHour = 22;
    const isToday = formData.date === getLocalDate();
    const now = new Date();
    const currentHour = now.getHours();

    const dailyRes = existingReservations.filter((r: Reservation) => r.date === formData.date && r.status !== 'cancelled');

    for (let hour = startHour; hour <= endHour; hour++) {
      [":00", ":30"].forEach(m => {
        const time = `${hour}${m}`;
        const slotHour = hour;
        const alreadyBooked = dailyRes.filter((r: Reservation) => r.time === time).reduce((s: number, r: Reservation) => s + r.guests, 0);

        if (alreadyBooked + formData.guests <= settings.maxCapacityPerSlot) {
          if (!isToday || slotHour > currentHour + 1) {
            slots.push(time);
          }
        }
      });
    }
    return slots;
  }, [formData.date, formData.guests, existingReservations, dateError, settings.maxCapacityPerSlot]);

  return (
    <div className="relative p-[2px] bg-primary cut-corners-lg">
      <div className="bg-white cut-corners-lg p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-wider">{t.title}</h2>
          <p className="text-gray-500 text-sm mt-1">Pastillo Restaurant & Bar</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-widest">
              <Calendar size={16} className="text-primary" /> {t.date}
            </label>
            <div className="relative">
              <div className="absolute inset-0 border-2 border-gray-300 cut-corners pointer-events-none"></div>
              <input
                required
                type="date"
                min={getLocalDate()}
                className="relative w-full bg-transparent py-4 px-4 text-gray-900 text-base cut-corners focus:outline-none"
                value={formData.date}
                onChange={handleDateChange}
              />
            </div>
            {dateError && <p className="text-red-500 text-sm flex items-center gap-2 font-medium"><AlertCircle size={14} /> {dateError}</p>}
          </div>

          {/* Guests Counter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-widest">
              <Users size={16} className="text-primary" /> {t.guests}
            </label>
            <div className="flex items-center gap-4 border-2 border-gray-200 p-2 cut-corners">
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))}
                className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-all hover:bg-primary hover:text-gray-900 cut-corners"
              >
                <Minus size={20} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold text-gray-900">{formData.guests}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, guests: p.guests + 1 }))}
                className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-all hover:bg-primary hover:text-gray-900 cut-corners"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-widest">
              <Clock size={16} className="text-primary" /> {t.time}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, time: s })}
                  className={`py-3 font-bold text-sm border-2 transition-all cut-corners ${formData.time === s
                      ? 'bg-primary text-gray-900 border-primary shadow-neon'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Phone */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 border-2 border-gray-300 cut-corners pointer-events-none"></div>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  placeholder={t.name}
                  className="w-full bg-transparent py-4 pl-10 pr-4 text-gray-900 placeholder-gray-400 cut-corners focus:outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 border-2 border-gray-300 cut-corners pointer-events-none"></div>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 text-gray-400" size={18} />
                <input
                  required
                  type="tel"
                  placeholder={t.phone}
                  className="w-full bg-transparent py-4 pl-10 pr-4 text-gray-900 placeholder-gray-400 cut-corners focus:outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.time}
            className="relative group w-full bg-primary text-gray-900 py-4 font-bold text-lg uppercase tracking-wider disabled:opacity-50 active:scale-[0.98] transition-all hover:shadow-neon cut-corners overflow-hidden"
          >
            <span className="relative z-10">
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : t.submit}
            </span>
            <div className="absolute inset-0 h-full w-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
