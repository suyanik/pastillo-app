
import React from 'react';
import { Instagram, MapPin, Phone, Clock, MessageCircle, ExternalLink, Facebook } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

const InfoView: React.FC<Props> = ({ lang }) => {
  const translations = {
    tr: {
      title: 'İletişim & Bilgi',
      sub: 'Bizimle her zaman iletişime geçebilirsiniz.',
      address: 'Adres',
      addressFull: 'Marktplatz 23, 35510 Butzbach',
      hours: 'Çalışma Saatleri',
      weekdays: 'Her gün: 11:00 - 23:00',
      closedDay: 'Salı: Kapalı',
      social: 'Sosyal Medya',
      contact: 'Doğrudan İletişim',
      call: 'Bizi Arayın',
      whatsapp: 'WhatsApp Hattı'
    },
    de: {
      title: 'Kontakt & Infos',
      sub: 'Sie können uns jederzeit kontaktieren.',
      address: 'Adresse',
      addressFull: 'Marktplatz 23, 35510 Butzbach',
      hours: 'Öffnungszeiten',
      weekdays: 'Täglich: 11:00 - 23:00',
      closedDay: 'Dienstag: Ruhetag',
      social: 'Social Media',
      contact: 'Direktkontakt',
      call: 'Rufen Sie uns an',
      whatsapp: 'WhatsApp Support'
    },
    en: {
      title: 'Contact & Info',
      sub: 'Feel free to contact us anytime.',
      address: 'Address',
      addressFull: 'Marktplatz 23, 35510 Butzbach',
      hours: 'Opening Hours',
      weekdays: 'Daily: 11:00 AM - 11:00 PM',
      closedDay: 'Tuesday: Closed',
      social: 'Social Media',
      contact: 'Direct Contact',
      call: 'Call Us',
      whatsapp: 'WhatsApp Line'
    },
    es: {
      title: 'Contacto e Info',
      sub: 'No dude en contactarnos en cualquier momento.',
      address: 'Dirección',
      addressFull: 'Marktplatz 23, 35510 Butzbach',
      hours: 'Horarios',
      weekdays: 'Diario: 11:00 - 23:00',
      closedDay: 'Martes: Cerrado',
      social: 'Redes Sociales',
      contact: 'Contacto Directo',
      call: 'Llámanos',
      whatsapp: 'WhatsApp'
    }
  };

  const t = translations[lang];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-2 pt-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{t.title}</h2>
        <p className="text-white/60 font-medium text-lg mt-1">{t.sub}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Adres */}
        <div className="glass p-5 rounded-2xl border border-white/10 flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{t.address}</h3>
            <p className="text-white/60 text-sm mt-1">{t.addressFull}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.addressFull)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-xs font-bold mt-2 flex items-center gap-1"
            >
              Google Maps <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Saatler */}
        <div className="glass p-5 rounded-2xl border border-white/10 flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{t.hours}</h3>
            <p className="text-white/60 text-sm mt-1">{t.weekdays}</p>
            <p className="text-error/80 text-sm font-medium">{t.closedDay}</p>
          </div>
        </div>

        {/* İletişim */}
        <div className="glass p-5 rounded-2xl border border-white/10">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Phone size={20} className="text-primary" /> {t.contact}
          </h3>
          <div className="space-y-3">
            <a href="tel:060339747771" className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
              <span className="text-white/80">{t.call}</span>
              <span className="text-white font-bold text-sm">06033 974 7771</span>
            </a>
            <a href="https://wa.me/4917613175373" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/10 hover:bg-green-500/20 transition-all">
              <span className="text-green-500 font-medium">{t.whatsapp}</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs">0176 13175373</span>
                <MessageCircle size={20} className="text-green-500" />
              </div>
            </a>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="glass p-5 rounded-2xl border border-white/10">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Instagram size={20} className="text-primary" /> {t.social}
          </h3>
          <div className="flex gap-4">
            <a 
              href="https://www.instagram.com/pastillo_butzbach" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[1px] rounded-xl overflow-hidden active:scale-95 transition-all"
            >
              <div className="bg-[#111111]/90 h-full w-full rounded-xl py-4 flex flex-col items-center justify-center gap-2">
                <Instagram size={24} className="text-white" />
                <span className="text-xs font-bold text-white">@pastillo_butzbach</span>
              </div>
            </a>
            <a 
              href="https://www.facebook.com/search/top?q=pastillo%20butzbach" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Facebook size={24} className="text-blue-500" />
              <div className="text-center">
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block">Facebook</span>
                <span className="text-white font-bold text-xs">Pastillo Butzbach</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoView;

