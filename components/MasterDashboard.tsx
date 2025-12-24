
import React, { useMemo } from 'react';
import {
  TrendingUp, Calendar, Users, PieChart, Activity,
  Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Reservation, DailyTurnover, Expense, Personnel, Language, AppSettings } from '../types';

interface Props {
  reservations: Reservation[];
  turnovers: DailyTurnover[];
  expenses: Expense[];
  personnel: Personnel[];
  settings: AppSettings;
  lang: Language;
}

const MasterDashboard: React.FC<Props> = ({ reservations, turnovers, expenses, personnel, settings, lang }) => {
  const translations = {
    tr: {
      welcome: 'Hoş Geldin, Chef!',
      overview: 'Genel Durum',
      todayTurnover: 'Bugünkü Ciro',
      todayRes: 'Rezervasyonlar',
      staffCount: 'Aktif Personel',
      weeklyTrend: 'Haftalık Ciro Trendi',
      occupancy: 'Anlık Doluluk',
      seated: 'Masada',
      waiting: 'Bekleyen',
      capacity: 'Kapasite',
      guests: 'Kişi'
    },
    de: {
      welcome: 'Willkommen, Chef!',
      overview: 'Übersicht',
      todayTurnover: 'Umsatz Heute',
      todayRes: 'Reservierungen',
      staffCount: 'Mitarbeiter',
      weeklyTrend: 'Wöchentlicher Umsatztrend',
      occupancy: 'Heutige Auslastung',
      seated: 'Am Tisch',
      waiting: 'Wartend',
      capacity: 'Kapazität',
      guests: 'Pers.'
    },
    en: {
      welcome: 'Welcome, Boss!',
      overview: 'Overview',
      todayTurnover: 'Today\'s Turnover',
      todayRes: 'Reservations',
      staffCount: 'Staff Members',
      weeklyTrend: 'Weekly Revenue Trend',
      occupancy: 'Current Occupancy',
      seated: 'Seated',
      waiting: 'Waiting',
      capacity: 'Capacity',
      guests: 'Guests'
    },
    es: {
      welcome: '¡Bienvenido, Chef!',
      overview: 'Resumen general',
      todayTurnover: 'Volumen de hoy',
      todayRes: 'Reservas',
      staffCount: 'Personal activo',
      weeklyTrend: 'Tendencia semanal',
      occupancy: 'Ocupación actual',
      seated: 'En mesa',
      waiting: 'En espera',
      capacity: 'Capacidad',
      guests: 'Invitados'
    }
  };

  const t = translations[lang] || translations.de;
  const todayStr = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const todayTurnover = turnovers.find((t: DailyTurnover) => t.date === todayStr)?.total || 0;
    const todayReservations = reservations.filter((r: Reservation) => r.date === todayStr && r.status !== 'cancelled');
    const totalGuestsWaiting = todayReservations.filter((r: Reservation) => r.status === 'confirmed').reduce((sum: number, r: Reservation) => sum + r.guests, 0);
    const seatedGuests = todayReservations.filter((r: Reservation) => r.status === 'seated').reduce((sum: number, r: Reservation) => sum + r.guests, 0);

    // Last 7 days chart data with improved scaling
    const last7Days = Array.from({ length: 7 }, (_, i: number) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const turn = turnovers.find((t: DailyTurnover) => t.date === dStr)?.total || 0;
      return { day: d.toLocaleDateString(lang, { weekday: 'short' }), value: turn };
    }).reverse();

    const maxVal = Math.max(...last7Days.map((d: { value: number }) => d.value), 500); // Minimum scale to avoid empty bars when data is small

    // Occupancy based on real restaurant capacity
    const occupancyRate = Math.min(100, Math.round((seatedGuests / (settings.maxCapacityPerSlot || 1)) * 100));

    return {
      todayTurnover,
      totalGuestsWaiting,
      seatedGuests,
      staffActive: personnel.length,
      last7Days,
      maxVal,
      occupancyRate
    };
  }, [reservations, turnovers, personnel, settings.maxCapacityPerSlot, todayStr, lang]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Dynamic Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-tighter">{t.welcome}</h2>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
            <Activity size={14} className="text-primary" /> {t.overview} • {new Date().toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* KPI: Financials */}
        <div className="bg-white p-8 border-2 border-gray-200 space-y-6 relative overflow-hidden group hover:border-primary transition-all cut-corners-lg">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">LIVE</span>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{t.todayTurnover}</p>
            <h3 className="text-4xl font-bold text-gray-900">€{stats.todayTurnover.toLocaleString()}</h3>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <TrendingUp size={140} />
          </div>
        </div>

        {/* KPI: Reservations */}
        <div className="bg-white p-8 border-2 border-gray-200 space-y-6 relative overflow-hidden group hover:border-primary transition-all cut-corners-lg">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Calendar size={24} />
            </div>
            {stats.totalGuestsWaiting > 0 && (
              <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full animate-pulse">
                {stats.totalGuestsWaiting} {t.waiting}
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{t.todayRes}</p>
            <h3 className="text-4xl font-bold text-gray-900">{stats.seatedGuests} <span className="text-gray-400 text-2xl font-bold">/ {stats.totalGuestsWaiting + stats.seatedGuests}</span></h3>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Calendar size={140} />
          </div>
        </div>

        {/* KPI: Staff */}
        <div className="bg-white p-8 border-2 border-gray-200 space-y-6 relative overflow-hidden group hover:border-primary transition-all cut-corners-lg">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Users size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{t.staffCount}</p>
            <h3 className="text-4xl font-bold text-gray-900">{stats.staffActive}</h3>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Users size={140} />
          </div>
        </div>

        {/* Chart: Weekly Trend */}
        <div className="lg:col-span-2 bg-white p-8 border-2 border-gray-200 flex flex-col justify-between cut-corners-lg">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
              <PieChart size={14} className="text-primary" /> {t.weeklyTrend}
            </h3>
          </div>
          <div className="flex items-end justify-between gap-4 h-48 px-2">
            {stats.last7Days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className="relative w-full group flex items-end justify-center h-full">
                  <div
                    className="w-full max-w-[40px] bg-primary/30 group-hover:bg-primary transition-all cursor-pointer relative cut-corners"
                    style={{ height: `${Math.max(4, (d.value / stats.maxVal) * 100)}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl scale-90 group-hover:scale-100">
                      €{d.value}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity Based Occupancy Chart */}
        <div className="bg-white p-8 border-2 border-gray-200 flex flex-col items-center justify-center space-y-4 cut-corners-lg">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{t.occupancy}</h3>
          <div className="relative w-44 h-44">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="78"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="88"
                cy="88"
                r="78"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={490}
                strokeDashoffset={490 - (490 * (stats.occupancyRate / 100))}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900 tracking-tighter">{stats.occupancyRate}%</span>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                {stats.seatedGuests} / {settings.maxCapacityPerSlot} {t.capacity}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MasterDashboard;
