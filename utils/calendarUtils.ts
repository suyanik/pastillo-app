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
PRODID:-//Pastillo Restaurant//Reservations//DE
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Pastillo Reservierungen
BEGIN:VEVENT
UID:${reservation.id}@pastillo.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDateTime)}
DTEND:${formatDate(endDateTime)}
SUMMARY:🍽️ Reservierung bei Pastillo
DESCRIPTION:Tisch für ${reservation.guests} Personen.\\nName: ${reservation.name}\\nTel: ${reservation.phone}\\nNotiz: ${reservation.notes || 'Keine'}
LOCATION:Pastillo Restaurant & Bar
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT60M
DESCRIPTION:Erinnerung an Reservierung
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`.trim();

  // iOS için dosya oluşturma ve indirme mantığı
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = `reservation_${reservation.date}_${reservation.name.replace(/[^a-z0-9]/gi, '')}`.toLowerCase();
  link.setAttribute('download', `${safeName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getGoogleCalendarUrl = (reservation: Reservation) => {
  const startDateTime = new Date(`${reservation.date}T${reservation.time}`);
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 saat

  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `🍽️ Reservierung: ${reservation.name} (${reservation.guests} Personen)`,
    details: `Kunde: ${reservation.name}\nTel: ${reservation.phone}\nAnmerkung: ${reservation.notes || 'Keine'}\nKoch Notiz: ${reservation.aiChefNote || ''}`,
    location: 'Pastillo Restaurant & Bar',
    dates: `${formatDate(startDateTime)}/${formatDate(endDateTime)}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
