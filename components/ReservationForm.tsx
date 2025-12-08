import React, { useState } from 'react';
import { Users, Phone, User, Loader2, MessageSquare } from 'lucide-react';
import { Reservation } from '../types';

interface Props {
  onSubmit: (data: Omit<Reservation, "id" | "createdAt">) => Promise<void>;
  isLoading: boolean;
}

const ReservationForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  // Varsayılan tarihi yerel saat dilimine göre ayarla (UTC hatasını önle)
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
    time: '19:00',
    guests: 2,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass p-6 sm:p-8 rounded-xl w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/20 p-3 rounded-full text-primary">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div>
           <h2 className="text-xl font-bold text-white leading-tight">Tisch reservieren</h2>
           <p className="text-sm text-white/60">Sichern Sie sich Ihren Platz für genussvolle Momente.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Phone Group */}
        <div className="space-y-4">
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
              Name
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
        </div>

        {/* Date & Time Group */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs font-medium text-white/60 mb-1.5 ml-1">Datum</label>
            <input
              required
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm [color-scheme:dark]"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-medium text-white/60 mb-1.5 ml-1">Uhrzeit</label>
            <input
              required
              type="time"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm [color-scheme:dark]"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        {/* Guests Slider */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
             <label className="text-sm font-medium text-white/80 flex items-center gap-2">
               <Users size={16} className="text-primary"/> Anzahl der Personen
             </label>
             <span className="text-2xl font-bold text-primary">{formData.guests}</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-2 font-medium px-1">
            <span>1</span>
            <span>6</span>
            <span>12+</span>
          </div>
        </div>

        {/* Notes */}
        <div className="relative">
             <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="text-white/40" size={18} />
            </div>
             <textarea
              placeholder="Anmerkungen (Allergien, Sonderwünsche...)"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-lg font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Wird verarbeitet...
            </>
          ) : (
            'Reservierung bestätigen'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
