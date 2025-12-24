import { Reservation, Language } from '../types';

// WhatsApp Web URL ile mesaj gönderme
export const sendWhatsAppMessage = (phone: string, message: string) => {
    // Telefon numarasını temizle (sadece rakamlar)
    let cleanPhone = phone.replace(/\D/g, '');

    // Almanya için ülke kodu ekle (0 ile başlıyorsa)
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '49' + cleanPhone.substring(1);
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// Rezervasyon onay mesajı oluştur
export const getReservationConfirmationMessage = (reservation: Reservation, lang: Language): string => {
    const messages: Record<Language, string> = {
        tr: `🍽️ Pastillo Restaurant\n\nSayın ${reservation.name},\n\nReservasyonunuz onaylandı:\n📅 Tarih: ${reservation.date}\n⏰ Saat: ${reservation.time}\n👥 Kişi: ${reservation.guests}\n\nBizi tercih ettiğiniz için teşekkür ederiz!\n\n📍 Marktplatz 23, 35510 Butzbach\n📞 06033 974 7771`,

        de: `🍽️ Pastillo Restaurant\n\nSehr geehrte/r ${reservation.name},\n\nIhre Reservierung ist bestätigt:\n📅 Datum: ${reservation.date}\n⏰ Uhrzeit: ${reservation.time}\n👥 Personen: ${reservation.guests}\n\nWir freuen uns auf Ihren Besuch!\n\n📍 Marktplatz 23, 35510 Butzbach\n📞 06033 974 7771`,

        en: `🍽️ Pastillo Restaurant\n\nDear ${reservation.name},\n\nYour reservation is confirmed:\n📅 Date: ${reservation.date}\n⏰ Time: ${reservation.time}\n👥 Guests: ${reservation.guests}\n\nThank you for choosing us!\n\n📍 Marktplatz 23, 35510 Butzbach\n📞 06033 974 7771`,

        es: `🍽️ Pastillo Restaurant\n\nEstimado/a ${reservation.name},\n\nSu reserva está confirmada:\n📅 Fecha: ${reservation.date}\n⏰ Hora: ${reservation.time}\n👥 Personas: ${reservation.guests}\n\n¡Gracias por elegirnos!\n\n📍 Marktplatz 23, 35510 Butzbach\n📞 06033 974 7771`
    };

    return messages[lang] || messages.de;
};

// Rezervasyon hatırlatma mesajı
export const getReservationReminderMessage = (reservation: Reservation, lang: Language): string => {
    const messages: Record<Language, string> = {
        tr: `⏰ Hatırlatma - Pastillo Restaurant\n\nSayın ${reservation.name},\n\nBugün saat ${reservation.time}'de ${reservation.guests} kişilik rezervasyonunuz var.\n\nSizi bekliyoruz! 🍽️`,

        de: `⏰ Erinnerung - Pastillo Restaurant\n\nSehr geehrte/r ${reservation.name},\n\nHeute um ${reservation.time} Uhr haben Sie eine Reservierung für ${reservation.guests} Personen.\n\nWir freuen uns auf Sie! 🍽️`,

        en: `⏰ Reminder - Pastillo Restaurant\n\nDear ${reservation.name},\n\nYou have a reservation today at ${reservation.time} for ${reservation.guests} guests.\n\nWe look forward to seeing you! 🍽️`,

        es: `⏰ Recordatorio - Pastillo Restaurant\n\nEstimado/a ${reservation.name},\n\nTiene una reserva hoy a las ${reservation.time} para ${reservation.guests} personas.\n\n¡Le esperamos! 🍽️`
    };

    return messages[lang] || messages.de;
};

// WhatsApp ile rezervasyon onayı gönder
export const sendReservationConfirmation = (reservation: Reservation, lang: Language) => {
    const message = getReservationConfirmationMessage(reservation, lang);
    sendWhatsAppMessage(reservation.phone, message);
};

// WhatsApp ile hatırlatma gönder
export const sendReservationReminder = (reservation: Reservation, lang: Language) => {
    const message = getReservationReminderMessage(reservation, lang);
    sendWhatsAppMessage(reservation.phone, message);
};
