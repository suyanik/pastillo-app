
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
  const translations = {
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
      icon: <Instagram size={18} />,
      url: 'https://instagram.com/Pastillo_butzbach',
      color: 'text-pink-500'
    },
    {
      label: 'Facebook',
      value: 'Pastillo Butzbach',
      icon: <Facebook size={18} />,
      url: 'https://facebook.com/profile.php?id=100086382436854', // Standart bir arama veya bilinen ID
      color: 'text-blue-500'
    },
    {
      label: t.web,
      value: 'www.pastillo.de',
      icon: <Globe size={18} />,
      url: 'https://www.pastillo.de',
      color: 'text-primary'
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-1">
      {/* Header - More Elegant */}
      <div className="text-center space-y-2 mb-2">
        {settings.restaurantLogo && (
          <img src={settings.restaurantLogo} className="h-10 w-auto mx-auto mb-4 opacity-80" alt="Logo" />
        )}
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">{settings.restaurantName || t.title}</h2>
        <div className="flex items-center justify-center gap-2">
          <span className="h-[1px] w-8 bg-white/10"></span>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">{t.sub}</p>
          <span className="h-[1px] w-8 bg-white/10"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Address & Hours - More Compact */}
        <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl text-primary">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t.address}</h3>
              <p className="text-sm font-bold text-white/80 mt-1 leading-snug">{settings.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest mt-2 hover:opacity-70 transition-opacity"
              >
                Maps <ExternalLink size={10} />
              </a>
            </div>
          </div>

          <div className="h-[1px] bg-white/5 w-full"></div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl text-primary">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t.hours}</h3>
              <p className="text-sm font-bold text-white/80 mt-1">{settings.openingHours}</p>
              <p className="text-[11px] font-bold text-red-500/60 mt-0.5">{settings.closedDay}</p>
            </div>
          </div>
        </div>

        {/* Contact - Refined */}
        <div className="glass p-5 rounded-[2rem] border border-white/5">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4 ml-1">{t.contact}</h3>
          <a href={`tel:${settings.phone}`} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Phone size={16} />
              </div>
              <span className="text-xs font-bold text-white/70">{t.call}</span>
            </div>
            <span className="text-sm font-black text-white tracking-tight">{settings.phone}</span>
          </a>
        </div>

        {/* Social & Web - Clean List */}
        <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-2">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 ml-1">{t.social}</h3>
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-white/[0.02] hover:bg-white/5 rounded-2xl border border-white/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-white/5 ${link.color} transition-transform group-hover:scale-110`}>
                  {link.icon}
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{link.label}</p>
                  <p className="text-xs font-bold text-white/70">{link.value}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer minimal tag */}
      <p className="text-center text-[8px] font-black text-white/10 uppercase tracking-[0.5em] mt-4">
        © Pastillo Butzbach
      </p>
    </div>
  );
};

export default InfoView;
