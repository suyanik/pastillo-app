import { Reservation } from '../types';

export const downloadReservationICS = (reservation: Reservation) => {
  // Tarih ve saat birleştirme
  const startDateTime = new Date(`${reservation.date}T${reservation.time}`);
  // Varsayılan süre: 2 saat
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RestoRezerv//AI//TR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${reservation.id}@restorezerv.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:🍽️ Rezervasyon: ${reservation.name} (${reservation.guests} Kişi)
DESCRIPTION:Müşteri: ${reservation.name}\\nTel: ${reservation.phone}\\nNot: ${reservation.notes || 'Yok'}\\nŞef Notu: ${reservation.aiChefNote || ''}
LOCATION:Restoranım
STATUS:CONFIRMED
ALARM:DISPLAY
TRIGGER:-PT15M
END:VEVENT
END:VCALENDAR`.trim();

  // Dosya oluşturma ve indirme tetikleme
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  // Dosya ismi temizleme
  const safeName = reservation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  link.setAttribute('download', `rezervasyon_${safeName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
