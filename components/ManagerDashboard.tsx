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
      alert("Tarayıcınız bildirimleri desteklemiyor.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const handleDelete = (id: string) => {
    if(window.confirm("Bu rezervasyonu silmek istediğinize emin misiniz?")) {
      if (navigator.vibrate) navigator.vibrate(50);
      onDelete(id);
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <ChefHat className="mx-auto mb-3 opacity-50" size={48} />
        <p>Henüz rezervasyon yok.</p>
        
        {permission === 'default' && (
           <button 
             onClick={requestNotificationPermission}
             className="mt-6 text-orange-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
           >
             <Bell size={16} />
             Bildirimleri Aç
           </button>
        )}
      </div>
    );
  }

  // Sort by date/time (newest first for demo)
  const sorted = [...reservations].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-slate-800">Gelen Rezervasyonlar</h2>
        {permission !== 'granted' && (
          <button 
            onClick={requestNotificationPermission}
            className="bg-orange-100 text-orange-700 p-2 rounded-full"
            title="Bildirimleri Aç"
          >
            <Bell size={18} />
          </button>
        )}
        {permission === 'granted' && (
           <div className="text-green-600 p-2" title="Bildirimler Açık">
             <BellRing size={18} />
           </div>
        )}
      </div>

      {sorted.map((res) => (
        <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          {/* Status Indicator Stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>
          
          <div className="pl-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-800">{res.name}</h3>
                <p className="text-xs text-slate-500">{res.phone}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <span className="block text-lg font-bold text-orange-600">{res.time}</span>
                  <span className="text-xs text-slate-400">{res.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                <Users size={14} /> {res.guests} Kişi
              </span>
            </div>

            {/* AI Summary Section */}
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mt-2">
              <div className="flex items-start gap-2">
                <ChefHat size={16} className="text-orange-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-1">Şef Notu (AI)</p>
                  <p className="text-sm text-orange-900 leading-snug">
                    {res.aiChefNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2 justify-end border-t border-slate-100 pt-3">
               <button
                  onClick={() => handleDelete(res.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sil"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => window.open(getGoogleCalendarUrl(res), '_blank')}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Calendar size={14} />
                  Takvime Ekle
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
