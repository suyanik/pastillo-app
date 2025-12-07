import React, { useState } from 'react';
import { Calendar, Users, Clock, MessageSquare, Phone, User, Loader2 } from 'lucide-react';
import { Reservation } from '../types';

interface Props {
  onSubmit: (data: Omit<Reservation, "id" | "createdAt">) => Promise<void>;
  isLoading: boolean;
}

const ReservationForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: 2,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-orange-100 p-2 rounded-lg text-orange-600">
          <Calendar size={20} />
        </span>
        Masa Ayırt
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Phone */}
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="text"
              placeholder="Adınız Soyadınız"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="tel"
              placeholder="Telefon Numaranız"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
             {/* Date input styling wrapper */}
            <input
              required
              type="date"
              className="w-full pl-4 pr-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-600 text-sm"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="relative">
             {/* Time input styling wrapper */}
            <input
              required
              type="time"
              className="w-full pl-4 pr-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-600 text-sm"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block ml-1">Kişi Sayısı</label>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <Users className="text-slate-400 ml-2" size={20} />
            <input
              type="range"
              min="1"
              max="10"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
              className="flex-1 accent-orange-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="bg-white px-4 py-1.5 rounded-lg font-bold text-slate-700 shadow-sm border border-slate-100 min-w-[3rem] text-center">
              {formData.guests}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
          <textarea
            placeholder="Özel istekleriniz (alerji, masa tercihi vb.)"
            rows={3}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              İşleniyor...
            </>
          ) : (
            'Rezervasyonu Tamamla'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
