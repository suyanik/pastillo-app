
import React from 'react';
import { Instagram, MapPin, Phone, Clock, MessageCircle, ExternalLink } from 'lucide-react';
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
      addressFull: 'Beispielstraße 123, 10115 Berlin',
      hours: 'Çalışma Saatleri',
      weekdays: 'Salı - Pazar: 12:00 - 23:00',
      monday: 'Pazartesi: Kapalı',
      social: 'Sosyal Medya',
      contact: 'Doğrudan İletişim',
      call: 'Bizi Arayın',
      whatsapp: 'WhatsApp Hattı'
    },
    de: {
      title: 'Kontakt & Infos',
      sub: 'Sie können uns jederzeit kontaktieren.',
      address: 'Adresse',
      addressFull: 'Beispielstraße 123, 10115 Berlin',
      hours: 'Öffnungszeiten',
      weekdays: 'Di - So: 12:00 - 23:00',
      monday: 'Montag: Ruhetag',
      social: 'Social Media',
      contact: 'Direktkontakt',
      call: 'Rufen Sie uns an',
      whatsapp: 'WhatsApp Support'
    },
    en: {
      title: 'Contact & Info',
      sub: 'Feel free to contact us anytime.',
      address: 'Address',
      addressFull: 'Beispielstraße 123, 10115 Berlin',
      hours: 'Opening Hours',
      weekdays: 'Tue - Sun: 12:00 PM - 11:00 PM',
      monday: 'Monday: Closed',
      social: 'Social Media',
      contact: 'Direct Contact',
      call: 'Call Us',
      whatsapp: 'WhatsApp Line'
    },
    es: {
      title: 'Contacto e Info',
      sub: 'No dude en contactarnos en cualquier momento.',
      address: 'Dirección',
      addressFull: 'Beispielstraße 123, 10115 Berlin',
      hours: 'Horarios',
      weekdays: 'Mar - Dom: 12:00 - 23:00',
      monday: 'Lunes: Cerrado',
      social: 'Redes Sociales',
      contact: 'Contacto Directo',
      call: 'Llámanos',
      whatsapp: 'WhatsApp'
    }
  };

  const t = translations[lang];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-2">
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
            <button className="text-primary text-xs font-bold mt-2 flex items-center gap-1">
              Google Maps <ExternalLink size={12} />
            </button>
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
            <p className="text-error/80 text-sm font-medium">{t.monday}</p>
          </div>
        </div>

        {/* İletişim */}
        <div className="glass p-5 rounded-2xl border border-white/10">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Phone size={20} className="text-primary" /> {t.contact}
          </h3>
          <div className="space-y-3">
            <a href="tel:+49123456789" className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
              <span className="text-white/80">{t.call}</span>
              <span className="text-white font-bold">+49 123 456 789</span>
            </a>
            <a href="https://wa.me/49123456789" className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/10 hover:bg-green-500/20 transition-all">
              <span className="text-green-500 font-medium">{t.whatsapp}</span>
              <MessageCircle size={20} className="text-green-500" />
            </a>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="glass p-5 rounded-2xl border border-white/10">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Instagram size={20} className="text-primary" /> {t.social}
          </h3>
          <div className="flex gap-4">
            <a href="#" className="flex-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[1px] rounded-xl overflow-hidden active:scale-95 transition-all">
              <div className="bg-[#111111]/90 h-full w-full rounded-xl py-4 flex flex-col items-center justify-center gap-2">
                <Instagram size={24} className="text-white" />
                <span className="text-xs font-bold text-white">@pastilloberlin</span>
              </div>
            </a>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2">
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Facebook</span>
                <span className="text-white font-bold text-xs">pastillo.bar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoView;

