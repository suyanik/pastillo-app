import React from 'react';
import {
  Instagram, MapPin, Phone, Clock, Globe,
  Facebook, ExternalLink, ChevronRight
} from 'lucide-react';
import { Language, AppSettings } from '../types';

interface Props {
  lang: Language;
  settings: AppSettings;
}

const InfoView: React.FC<Props> = ({ lang, settings }) => {
  const translations: Record<Language, Record<string, string>> = {
    tr: {
      title: 'İletişim & Bilgi',
      sub: 'Bize ulaşın',
      address: 'Adres',
      hours: 'Açılış Saatleri',
      social: 'Sosyal Medya',
      web: 'Web Sitemiz',
      contact: 'Hızlı İletişim',
      call: 'Telefon'
    },
    de: {
      title: 'Kontakt & Infos',
      sub: 'Sprechen Sie uns an',
      address: 'Adresse',
      hours: 'Öffnungszeiten',
      social: 'Social Media',
      web: 'Webseite',
      contact: 'Direktkontakt',
      call: 'Anrufen'
    },
    en: {
      title: 'Contact & Info',
      sub: 'Get in touch',
      address: 'Address',
      hours: 'Opening Hours',
      social: 'Social Media',
      web: 'Website',
      contact: 'Quick Contact',
      call: 'Call Us'
    },
    es: {
      title: 'Contacto e Info',
      sub: 'Contáctenos',
      address: 'Dirección',
      hours: 'Horario',
      social: 'Redes Sociales',
      web: 'Sitio Web',
      contact: 'Contacto Rápido',
      call: 'Llamar'
    }
  };

  const t = translations[lang] || translations.de;

  const socialLinks = [
    {
      label: 'Instagram',
      value: '@Pastillo_butzbach',
      icon: <Instagram size={20} />,
      url: 'https://instagram.com/Pastillo_butzbach',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
    {
      label: 'Facebook',
      value: 'Pastillo Butzbach',
      icon: <Facebook size={20} />,
      url: 'https://facebook.com/profile.php?id=100086382436854',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: t.web,
      value: 'www.pastillo.de',
      icon: <Globe size={20} />,
      url: 'https://www.pastillo.de',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Card */}
      <div className="relative p-[2px] bg-primary cut-corners-lg">
        <div className="bg-white cut-corners-lg p-6 text-center">
          {settings.restaurantLogo && (
            <img src={settings.restaurantLogo} className="h-12 w-auto mx-auto mb-3" alt="Logo" />
          )}
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
            {settings.restaurantName || t.title}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">{t.sub}</p>
        </div>
      </div>

      {/* Info List */}
      <div className="bg-white border-2 border-gray-200 cut-corners-lg divide-y divide-gray-100">
        {/* Address */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary cut-corners">
            <MapPin size={22} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.address}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{settings.address}</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </a>

        {/* Hours */}
        <div className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary cut-corners">
            <Clock size={22} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.hours}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{settings.openingHours}</p>
            <p className="text-xs font-bold text-red-500 mt-0.5">{settings.closedDay}</p>
          </div>
        </div>

        {/* Phone */}
        <a
          href={`tel:${settings.phone}`}
          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-green-50 flex items-center justify-center text-green-600 cut-corners">
            <Phone size={22} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.call}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{settings.phone}</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </a>
      </div>

      {/* Social Links */}
      <div className="bg-white border-2 border-gray-200 cut-corners-lg divide-y divide-gray-100">
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.social}</p>
        </div>

        {socialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 ${link.bgColor} flex items-center justify-center ${link.color} cut-corners`}>
              {link.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{link.value}</p>
            </div>
            <ExternalLink size={16} className="text-gray-400" />
          </a>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
        © Pastillo Butzbach
      </p>
    </div>
  );
};

export default InfoView;
