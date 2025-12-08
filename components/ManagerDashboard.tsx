import React, { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { ChefHat, Calendar, Users, Bell, BellRing, Trash2, ExternalLink } from 'lucide-react';
import { getGoogleCalendarUrl } from '../utils/calendarUtils';

interface Props {
  reservations: Reservation[];
  onDelete: (id: string) => void;
}

const ManagerDashboard: React.FC<Props> = ({ reservations, onDelete }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Ihr Browser unterstützt keine Benachrichtigungen.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const handleDelete = (id: string) => {
    if(window.confirm("Sind Sie sicher, dass Sie diese Reservierung löschen möchten?")) {
      if (navigator.vibrate) navigator.vibrate(50);
      onDelete(id);
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="p-8 text-center text-white/40">
        <ChefHat className="mx-auto mb-3 opacity-50" size={48} />
        <p>Keine Reservierungen vorhanden.</p>
        
        {permission === 'default' && (
           <button 
             onClick={requestNotificationPermission}
             className="mt-6 text-primary text-sm font-medium flex items-center justify-center gap-2 mx-auto hover:text-primary/80"
           >
             <Bell size={16} />
             Benachrichtigungen aktivieren
           </button>
        )}
      </div>
    );
  }

  // Sort by date/time (newest first for demo)
  const sorted = [...reservations].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg font-bold text-white">Eingehende Reservierungen</h2>
        {permission !== 'granted' && (
          <button 
            onClick={requestNotificationPermission}
            className="bg-primary/20 text-primary p-2 rounded-full"
            title="Benachrichtigungen aktivieren"
          >
            <Bell size={18} />
          </button>
        )}
        {permission === 'granted' && (
           <div className="text-green-500 p-2" title="Benachrichtigungen aktiv">
             <BellRing size={18} />
           </div>
        )}
      </div>

      {sorted.map((res) => (
        <div key={res.id} className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm relative overflow-hidden group">
          {/* Status Indicator Stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          
          <div className="pl-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-white">{res.name}</h3>
                <p className="text-xs text-white/50">{res.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-right">
                  <span className="block text-lg font-bold text-primary">{res.time}</span>
                  <span className="text-xs text-white/40">{res.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
              <span className="flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-1 rounded-md">
                <Users size={14} /> {res.guests} Personen
              </span>
            </div>

            {/* AI Summary Section */}
            <div className="bg-[#1c1c1c] p-3 rounded-lg border border-white/5 mt-2">
              <div className="flex items-start gap-2">
                <ChefHat size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wide mb-1">Koch Notiz (AI)</p>
                  <p className="text-sm text-white/90 leading-snug font-medium">
                    {res.aiChefNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2 justify-end border-t border-white/5 pt-3">
               <button
                  onClick={() => handleDelete(res.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Löschen"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => window.open(getGoogleCalendarUrl(res), '_blank')}
                  className="flex items-center gap-1 bg-white/10 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors border border-white/5"
                >
                  <Calendar size={14} />
                  Kalender
                  <ExternalLink size={10} className="ml-0.5"/>
                </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default ManagerDashboard;
