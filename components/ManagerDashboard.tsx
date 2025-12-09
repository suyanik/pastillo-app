import React, { useState, useMemo } from 'react';
import { Reservation, ReservationStatus } from '../types';
import { getGoogleCalendarUrl } from '../utils/calendarUtils';
import { Trash2, XCircle, Users, CalendarCheck, CalendarDays, FilterX, UserCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
}

const ManagerDashboard: React.FC<Props> = ({ reservations, onDelete, onStatusUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'Alle'>('Alle');
  
  // Varsayılan olarak bugünü seç
  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const [dateFilter, setDateFilter] = useState<string>(todayStr);

  const handleCancel = (id: string) => {
    if(window.confirm("Möchten Sie diese Reservierung stornieren?")) {
      if (navigator.vibrate) navigator.vibrate(50);
      onStatusUpdate(id, 'cancelled');
    }
  };

  const handleCheckIn = (id: string) => {
    if (navigator.vibrate) navigator.vibrate(50);
    onStatusUpdate(id, 'seated');
  };
  
  const handleDelete = (id: string) => {
    if(window.confirm("Diese Reservierung dauerhaft löschen?")) {
      onDelete(id);
    }
  };

  // Filtreleme Mantığı
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      // 1. Arama Metni Filtresi
      const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            res.phone.includes(searchTerm);
      
      // 2. Durum Filtresi
      const currentStatus = res.status || 'confirmed';
      const matchesStatus = statusFilter === 'Alle' ? true : currentStatus === statusFilter;

      // 3. Tarih Filtresi (Eğer tarih seçiliyse o günü getir)
      // dateFilter boş ise tüm zamanları göster
      const matchesDate = dateFilter ? res.date === dateFilter : true;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchTerm, statusFilter, dateFilter]);

  // Sıralama (Saate göre)
  const sortedReservations = useMemo(() => {
    return [...filteredReservations].sort((a, b) => {
        // Eğer tarih filtresi kapalıysa, önce tarihe sonra saate göre sırala
        if (!dateFilter) {
            return b.date.localeCompare(a.date) || a.time.localeCompare(b.time);
        }
        // Tarih seçiliyse sadece saate göre sırala
        return a.time.localeCompare(b.time);
    });
  }, [filteredReservations, dateFilter]);

  // İstatistikleri Hesapla (Filtrelenmiş listeye göre değil, seçili güne göre)
  const stats = useMemo(() => {
    // İstatistikler her zaman seçili güne odaklanmalı (veya tarih seçili değilse tümüne)
    const targetReservations = filteredReservations.filter(r => r.status !== 'cancelled');
    
    // Check-in yapmış (seated) misafir sayısı
    const seatedGuests = targetReservations.filter(r => r.status === 'seated').reduce((sum, r) => sum + r.guests, 0);
    const totalGuests = targetReservations.reduce((sum, r) => sum + r.guests, 0);
    
    const totalTables = targetReservations.length;

    return { totalGuests, seatedGuests, totalTables };
  }, [filteredReservations]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-300 mb-24">
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-dark border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={64} className="text-primary" />
          </div>
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">
            {dateFilter ? 'Gäste (Heute)' : 'Gäste (Gesamt)'}
          </p>
          <div className="flex items-baseline gap-1">
             <h3 className="text-4xl font-black text-white">{stats.seatedGuests}<span className="text-white/30 text-2xl">/{stats.totalGuests}</span></h3>
             <span className="text-sm text-primary font-medium">Pers.</span>
          </div>
          <p className="text-xs text-green-500 mt-1 font-medium">
            {stats.totalGuests > 0 ? Math.round((stats.seatedGuests / stats.totalGuests) * 100) : 0}% anwesend
          </p>
        </div>

        <div className="bg-card-dark border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CalendarCheck size={64} className="text-success" />
          </div>
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">
             {dateFilter ? 'Tische (Ausgewählt)' : 'Tische (Gesamt)'}
          </p>
          <div className="flex items-baseline gap-1">
             <h3 className="text-4xl font-black text-white">{stats.totalTables}</h3>
             <span className="text-sm text-success font-medium">Res.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-xl bg-card-dark shadow-2xl border border-white/5">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">Verwaltung</h2>
              <p className="text-sm sm:text-base font-normal text-gray-400">
                {dateFilter 
                  ? `Reservierungen für ${new Date(dateFilter).toLocaleDateString('de-DE')}`
                  : 'Alle Reservierungen anzeigen'}
              </p>
            </div>
            
            {/* Tarih Seçici */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <div className="relative">
                    <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 [color-scheme:dark]"
                    />
                </div>
                {dateFilter && (
                    <button 
                        onClick={() => setDateFilter('')}
                        className="p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10 transition-colors"
                        title="Alle Daten anzeigen"
                    >
                        <FilterX size={20} />
                    </button>
                )}
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-grow">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <span className="material-symbols-outlined text-xl">search</span>
              </span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none h-12 pl-12 pr-4 text-base transition-all" 
                placeholder="Suche nach Name..." 
                type="text"
              />
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none h-12 pl-12 pr-10 text-base sm:w-auto transition-all"
              >
                <option value="Alle">Alle Status</option>
                <option value="confirmed">Reserviert (Bestätigt)</option>
                <option value="seated">Am Tisch (Seated)</option>
                <option value="cancelled">Storniert</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-t border-white/10 bg-white/5 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Uhrzeit</th>
                <th className="px-6 py-4 font-medium">Datum</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Personen</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sortedReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <CalendarDays size={32} className="opacity-50"/>
                        <p>Keine Reservierungen für diesen Filter gefunden.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedReservations.map((res) => (
                  <tr key={res.id} className={`hover:bg-white/5 transition-colors ${res.status === 'seated' ? 'bg-success/5' : ''}`}>
                    <td className="px-6 py-4 text-white font-bold text-base">{res.time}</td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                        {new Date(res.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {res.name}
                      {res.notes && (
                        <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={res.notes}>
                          {res.notes}
                        </div>
                      )}
                      {res.aiChefNote && (
                         <div className="text-[10px] text-primary/70 mt-0.5 max-w-[200px] truncate" title={res.aiChefNote}>
                          AI: {res.aiChefNote}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                        <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold">{res.guests}</span>
                    </td>
                    <td className="px-6 py-4">
                      {(!res.status || res.status === 'confirmed') && (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500 border border-blue-500/20">
                          Reserviert
                        </span>
                      )}
                      {res.status === 'seated' && (
                        <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success border border-success/20">
                          Am Tisch
                        </span>
                      )}
                      {res.status === 'cancelled' && (
                        <span className="inline-flex items-center rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-medium text-error border border-error/20">
                          Storniert
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Check-in Button */}
                        {res.status === 'confirmed' && (
                           <button 
                            onClick={() => handleCheckIn(res.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-md text-success hover:text-green-300 transition-colors hover:bg-success/10 border border-success/20"
                            title="Gast ist da (Check-in)"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}

                        {res.status === 'seated' && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-md text-success/50" title="Bereits eingecheckt">
                             <CheckCircle2 size={18} />
                          </div>
                        )}

                         <a 
                          href={`tel:${res.phone}`}
                          className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-white transition-colors hover:bg-white/10"
                          title="Anrufen"
                        >
                          <span className="material-symbols-outlined text-lg">call</span>
                        </a>

                        <button 
                          onClick={() => window.open(getGoogleCalendarUrl(res), '_blank')}
                          className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-white transition-colors hover:bg-white/10"
                          title="Google Kalender"
                        >
                          <span className="material-symbols-outlined text-lg">calendar_today</span>
                        </button>
                        
                        {/* Cancel Button */}
                        {res.status !== 'cancelled' && res.status !== 'seated' && (
                          <button 
                            onClick={() => handleCancel(res.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-md text-orange-400 hover:text-orange-300 transition-colors hover:bg-orange-400/10"
                            title="Stornieren"
                          >
                            <XCircle size={18} />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(res.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-md text-error hover:text-red-400 transition-colors hover:bg-error/10"
                          title="Löschen"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/5 rounded-b-xl">
          <span className="text-sm text-gray-400">
            Gesamt: <span className="font-semibold text-white">{sortedReservations.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
