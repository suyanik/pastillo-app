import React, { useState } from 'react';
import { Reservation } from '../types';
import { getGoogleCalendarUrl } from '../utils/calendarUtils';

interface Props {
  reservations: Reservation[];
  onDelete: (id: string) => void;
}

const ManagerDashboard: React.FC<Props> = ({ reservations, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Alle');

  const handleDelete = (id: string) => {
    if(window.confirm("Sind Sie sicher, dass Sie diese Reservierung stornieren möchten?")) {
      if (navigator.vibrate) navigator.vibrate(50);
      onDelete(id);
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.date.includes(searchTerm);
    // Since we don't have a real status field in types yet, we simulate logic or just return true for "Alle"
    // For now, all existing reservations are considered "Bestätigt" (Confirmed)
    if (statusFilter === 'Storniert') return false; 
    if (statusFilter === 'Ausstehend') return false;
    return matchesSearch;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col rounded-xl bg-card-dark shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/5 mb-24">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">Reservierungsverwaltung</h2>
            <p className="text-sm sm:text-base font-normal text-gray-400">Anstehende Reservierungen anzeigen und verwalten</p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <span className="material-symbols-outlined text-xl">search</span>
            </span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none h-12 pl-12 pr-4 text-base transition-all" 
              placeholder="Suche nach Name oder Datum..." 
              type="text"
            />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <span className="material-symbols-outlined text-xl">filter_list</span>
            </span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none h-12 pl-12 pr-10 text-base sm:w-auto transition-all"
            >
              <option value="Alle">Alle Status</option>
              <option value="Bestätigt">Bestätigt</option>
              <option value="Ausstehend">Ausstehend</option>
              <option value="Storniert">Storniert</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-t border-white/10 bg-white/5 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Datum</th>
              <th className="px-6 py-4 font-medium">Uhrzeit</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Telefon</th>
              <th className="px-6 py-4 font-medium">Personen</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Keine Reservierungen gefunden.
                </td>
              </tr>
            ) : (
              sortedReservations.map((res) => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{res.date}</td>
                  <td className="px-6 py-4 text-gray-300">{res.time}</td>
                  <td className="px-6 py-4 text-white font-medium">
                    {res.name}
                    {res.notes && (
                      <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={res.notes}>
                        Note: {res.notes}
                      </div>
                    )}
                    {res.aiChefNote && (
                       <div className="text-[10px] text-primary/70 mt-0.5 max-w-[200px] truncate" title={res.aiChefNote}>
                        AI: {res.aiChefNote}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{res.phone}</td>
                  <td className="px-6 py-4 text-gray-300">{res.guests}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success border border-success/20">
                      Bestätigt
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => window.open(getGoogleCalendarUrl(res), '_blank')}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                        title="Zum Kalender hinzufügen"
                      >
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        <span>Kalender</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(res.id)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-error transition-colors hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error"
                        title="Stornieren"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                        <span>Stornieren</span>
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
          Zeigt <span className="font-semibold text-white">{sortedReservations.length > 0 ? 1 : 0}</span>-
          <span className="font-semibold text-white">{Math.min(10, sortedReservations.length)}</span> von <span className="font-semibold text-white">{reservations.length}</span> Reservierungen
        </span>
        <div className="inline-flex items-center gap-2">
          <button className="inline-flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-transparent text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50">
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-transparent text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50">
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
