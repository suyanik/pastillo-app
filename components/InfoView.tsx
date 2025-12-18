
import React from 'react';
import { Instagram, MapPin, Phone, Clock, MessageCircle, ExternalLink, Facebook } from 'lucide-react';
import { Language, AppSettings } from '../types';

interface Props {
  lang: Language;
  settings: AppSettings;
}

const InfoView: React.FC<Props> = ({ lang, settings }) => {
  const translations = {
    tr: {
      title: 'İletişim & Bilgi',
      sub: 'Bizimle her zaman iletişime geçebilirsiniz.',
      address: 'Adres',
      hours: 'Çalışma Saatleri',
      social: 'Sosyal Medya',
      contact: 'Doğrudan İletişim',
      call: 'Bizi Arayın',
      whatsapp: 'WhatsApp Hattı'
    },
    de: {
      title: 'Kontakt & Infos',
      sub: 'Sie können uns jederzeit kontaktieren.',
      address: 'Adresse',
      hours: 'Öffnungszeiten',
      social: 'Social Media',
      contact: 'Direktkontakt',
      call: 'Rufen Sie uns an',
      whatsapp: 'WhatsApp Support'
    },
    en: {
      title: 'Contact & Info',
      sub: 'Feel free to contact us anytime.',
      address: 'Address',
      hours: 'Opening Hours',
      social: 'Social Media',
      contact: 'Direct Contact',
      call: 'Call Us',
      whatsapp: 'WhatsApp Line'
    }
  };

  const t = translations[lang] || translations.de;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="px-2 pt-4">
        {settings.restaurantLogo && (
          <img src={settings.restaurantLogo} className="h-12 w-auto mb-4 object-contain" alt="Logo" />
        )}
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{settings.restaurantName || t.title}</h2>
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
            <p className="text-white/60 text-sm mt-1">{settings.address}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
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
            <p className="text-white/60 text-sm mt-1">{settings.openingHours}</p>
            <p className="text-error/80 text-sm font-medium">{settings.closedDay}</p>
          </div>
        </div>

        {/* İletişim */}
        <div className="glass p-5 rounded-2xl border border-white/10">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <Phone size={20} className="text-primary" /> {t.contact}
          </h3>
          <div className="space-y-3">
            <a href={`tel:${settings.phone}`} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
              <span className="text-white/80">{t.call}</span>
              <span className="text-white font-bold text-sm">{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoView;
