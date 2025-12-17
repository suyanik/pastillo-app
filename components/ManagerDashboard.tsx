
import React, { useState, useMemo } from 'react';
import { Reservation, ReservationStatus, Language } from '../types';
import { getGoogleCalendarUrl } from '../utils/calendarUtils';
import { Trash2, XCircle, Users, CalendarCheck, CalendarDays, FilterX, UserCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  reservations: Reservation[];
  onDelete: (id: string) => Promise<void>;
  onStatusUpdate: (id: string, status: ReservationStatus) => Promise<void>;
  lang: Language;
}

const ManagerDashboard: React.FC<Props> = ({ reservations, onDelete, onStatusUpdate, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'Alle'>('Alle');
  
  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const [dateFilter, setDateFilter] = useState<string>(todayStr);

  const translations = {
    tr: {
      title: 'Yönetim Paneli',
      subTitle: 'Rezervasyonlar',
      all: 'Tümü',
      search: 'İsimle ara...',
      allStatus: 'Tüm Durumlar',
      confirmed: 'Onaylı',
      seated: 'Masada',
      cancelled: 'İptal',
      guests: 'Misafir',
      tables: 'Masa',
      actions: 'İşlemler',
      deleteConfirm: 'Bu rezervasyonu silmek istediğinize emin misiniz?',
      cancelConfirm: 'İptal etmek istiyor musunuz?',
      noRes: 'Rezervasyon bulunamadı.',
      present: 'burada'
    },
    de: {
      title: 'Verwaltung',
      subTitle: 'Reservierungen',
      all: 'Alle',
      search: 'Suche nach Name...',
      allStatus: 'Alle Status',
      confirmed: 'Reserviert',
      seated: 'Am Tisch',
      cancelled: 'Storniert',
      guests: 'Gäste',
      tables: 'Tische',
      actions: 'Aktionen',
      deleteConfirm: 'Diese Reservierung dauerhaft löschen?',
      cancelConfirm: 'Möchten Sie diese Reservierung stornieren?',
      noRes: 'Keine Reservierungen gefunden.',
      present: 'anwesend'
    },
    en: {
      title: 'Management',
      subTitle: 'Reservations',
      all: 'All',
      search: 'Search by name...',
      allStatus: 'All Statuses',
      confirmed: 'Confirmed',
      seated: 'Seated',
      cancelled: 'Cancelled',
      guests: 'Guests',
      tables: 'Tables',
      actions: 'Actions',
      deleteConfirm: 'Permanently delete this reservation?',
      cancelConfirm: 'Do you want to cancel this reservation?',
      noRes: 'No reservations found.',
      present: 'present'
    },
    es: {
      title: 'Gestión',
      subTitle: 'Reservas',
      all: 'Todos',
      search: 'Buscar por nombre...',
      allStatus: 'Todos los estados',
      confirmed: 'Confirmado',
      seated: 'En mesa',
      cancelled: 'Cancelado',
      guests: 'Invitados',
      tables: 'Mesas',
      actions: 'Acciones',
      deleteConfirm: '¿Eliminar permanentemente esta reserva?',
      cancelConfirm: '¿Desea cancelar esta reserva?',
      noRes: 'No se encontraron reservas.',
      present: 'presente'
    }
  };

  const t = translations[lang];

  const handleCancel = (id: string) => {
    if(window.confirm(t.cancelConfirm)) {
      if (navigator.vibrate) navigator.vibrate(50);
      onStatusUpdate(id, 'cancelled');
    }
  };

  const handleCheckIn = (id: string) => {
    if (navigator.vibrate) navigator.vibrate(50);
    onStatusUpdate(id, 'seated');
  };
  
  const handleDelete = (id: string) => {
    if(window.confirm(t.deleteConfirm)) {
      onDelete(id);
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            res.phone.includes(searchTerm);
      const currentStatus = res.status || 'confirmed';
      const matchesStatus = statusFilter === 'Alle' ? true : currentStatus === statusFilter;
      const matchesDate = dateFilter ? res.date === dateFilter : true;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchTerm, statusFilter, dateFilter]);

  const sortedReservations = useMemo(() => {
    return [...filteredReservations].sort((a, b) => {
        if (!dateFilter) {
            return b.date.localeCompare(a.date) || a.time.localeCompare(b.time);
        }
        return a.time.localeCompare(b.time);
    });
  }, [filteredReservations, dateFilter]);

  const stats = useMemo(() => {
    const targetReservations = filteredReservations.filter(r => r.status !== 'cancelled');
    const seatedGuests = targetReservations.filter(r => r.status === 'seated').reduce((sum, r) => sum + r.guests, 0);
    const totalGuests = targetReservations.reduce((sum, r) => sum + r.guests, 0);
    const totalTables = targetReservations.length;
    return { totalGuests, seatedGuests, totalTables };
  }, [filteredReservations]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-300 mb-24">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-dark border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">
            {t.guests}
          </p>
          <div className="flex items-baseline gap-1">
             <h3 className="text-4xl font-black text-white">{stats.seatedGuests}<span className="text-white/30 text-2xl">/{stats.totalGuests}</span></h3>
          </div>
          <p className="text-xs text-green-500 mt-1 font-medium">
            {stats.totalGuests > 0 ? Math.round((stats.seatedGuests / stats.totalGuests) * 100) : 0}% {t.present}
          </p>
        </div>

        <div className="bg-card-dark border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">
             {t.tables}
          </p>
          <div className="flex items-baseline gap-1">
             <h3 className="text-4xl font-black text-white">{stats.totalTables}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-xl bg-card-dark shadow-2xl border border-white/5">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">{t.title}</h2>
              <p className="text-sm sm:text-base font-normal text-gray-400">
                {dateFilter 
                  ? `${t.subTitle}: ${new Date(dateFilter).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE')}`
                  : t.all}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 [color-scheme:dark]"
                />
                {dateFilter && (
                    <button 
                        onClick={() => setDateFilter('')}
                        className="p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10 transition-colors"
                    >
                        <FilterX size={20} />
                    </button>
                )}
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-grow">
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none h-12 pl-4 pr-4 text-base transition-all" 
                placeholder={t.search} 
                type="text"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white h-12 px-4 text-base sm:w-auto [color-scheme:dark]"
            >
              <option value="Alle">{t.allStatus}</option>
              <option value="confirmed">{t.confirmed}</option>
              <option value="seated">{t.seated}</option>
              <option value="cancelled">{t.cancelled}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-t border-white/10 bg-white/5 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">{lang === 'tr' ? 'Saat' : 'Uhrzeit'}</th>
                <th className="px-6 py-4 font-medium">{lang === 'tr' ? 'Tarih' : 'Datum'}</th>
                <th className="px-6 py-4 font-medium">{lang === 'tr' ? 'İsim' : 'Name'}</th>
                <th className="px-6 py-4 font-medium">{lang === 'tr' ? 'Kişi' : 'Pers.'}</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sortedReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {t.noRes}
                  </td>
                </tr>
              ) : (
                sortedReservations.map((res) => (
                  <tr key={res.id} className={`hover:bg-white/5 transition-colors ${res.status === 'seated' ? 'bg-success/5' : ''}`}>
                    <td className="px-6 py-4 text-white font-bold text-base">{res.time}</td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                        {new Date(res.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', { day: '2-digit', month: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {res.name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                        <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold">{res.guests}</span>
                    </td>
                    <td className="px-6 py-4">
                      {(!res.status || res.status === 'confirmed') && (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500 border border-blue-500/20">
                          {t.confirmed}
                        </span>
                      )}
                      {res.status === 'seated' && (
                        <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success border border-success/20">
                          {t.seated}
                        </span>
                      )}
                      {res.status === 'cancelled' && (
                        <span className="inline-flex items-center rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error border border-error/20">
                          {t.cancelled}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {res.status === 'confirmed' && (
                           <button 
                            onClick={() => handleCheckIn(res.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-md text-success hover:bg-success/10 border border-success/20"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        <a href={`tel:${res.phone}`} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"><Phone size={16}/></a>
                        <button onClick={() => handleDelete(res.id)} className="w-8 h-8 flex items-center justify-center text-error hover:text-red-400"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import { Phone } from 'lucide-react';

export default ManagerDashboard;
