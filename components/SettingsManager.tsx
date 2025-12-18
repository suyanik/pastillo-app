
import React, { useState, useRef } from 'react';
import { 
  Shield, Users, Calendar, Mail, Save, Plus, X, Check, Loader2, 
  Store, MapPin, Phone, Clock, Image as ImageIcon, Camera
} from 'lucide-react';
import { Language, AppSettings } from '../types';
import { updateSettings } from '../services/firebase';

interface Props {
  lang: Language;
  settings: AppSettings;
}

const SettingsManager: React.FC<Props> = ({ lang, settings }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [newHoliday, setNewHoliday] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const translations: Record<Language, any> = {
    tr: { 
      branding: 'Marka & Kimlik', contact: 'İletişim Bilgileri', system: 'Sistem Ayarları',
      name: 'Restoran İsmi', logo: 'Logo Yükle', address: 'Adres', phone: 'Telefon',
      hours: 'Çalışma Saatleri', closed: 'Kapalı Gün', pin: 'Yönetici PIN', 
      cap: 'Max Kapasite', email: 'E-posta', holidays: 'Tatil Günleri', 
      save: 'AYARLARI KAYDET', add: 'Ekle', saved: 'KAYDEDİLDİ' 
    },
    de: { 
      branding: 'Markenidentität', contact: 'Kontaktinformationen', system: 'Systemeinstellungen',
      name: 'Restaurant Name', logo: 'Logo hochladen', address: 'Adresse', phone: 'Telefon',
      hours: 'Öffnungszeiten', closed: 'Ruhetag', pin: 'Admin PIN', 
      cap: 'Max. Kapazität', email: 'Manager E-Mail', holidays: 'Ruhetage', 
      save: 'EINSTELLUNGEN SPEICHERN', add: 'Hinzufügen', saved: 'GESPEICHERT' 
    },
    en: { 
      branding: 'Branding', contact: 'Contact Info', system: 'System Settings',
      name: 'Restaurant Name', logo: 'Upload Logo', address: 'Address', phone: 'Phone',
      hours: 'Opening Hours', closed: 'Closed Day', pin: 'Admin PIN', 
      cap: 'Max Capacity', email: 'Email', holidays: 'Holidays', 
      save: 'SAVE SETTINGS', add: 'Add', saved: 'SAVED' 
    }
  };

  const t = translations[lang] || translations.de;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalSettings({ ...localSettings, restaurantLogo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await updateSettings(localSettings);
      setSaveStatus('saved');
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      setSaveStatus('idle');
      alert("Error saving settings");
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Branding Section */}
      <section className="glass p-6 rounded-[2.5rem] space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <Store size={14}/> {t.branding}
        </h3>
        
        <div className="flex flex-col items-center gap-4">
          <div 
            onClick={() => logoInputRef.current?.click()}
            className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative group"
          >
            {localSettings.restaurantLogo ? (
              <img src={localSettings.restaurantLogo} className="w-full h-full object-contain p-2" alt="Logo" />
            ) : (
              <ImageIcon className="text-white/20" size={32} />
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera size={20} className="text-primary"/>
            </div>
          </div>
          <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={handleLogoUpload} />
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{t.logo}</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.name}</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold focus:border-primary outline-none transition-all"
              value={localSettings.restaurantName}
              onChange={e => setLocalSettings({...localSettings, restaurantName: e.target.value})}
            />
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="glass p-6 rounded-[2.5rem] space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <MapPin size={14}/> {t.contact}
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
             <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.address}</label>
             <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold" value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} />
          </div>
          <div className="space-y-1">
             <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.phone}</label>
             <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.hours}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold text-xs" value={localSettings.openingHours} onChange={e => setLocalSettings({...localSettings, openingHours: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.closed}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold text-xs" value={localSettings.closedDay} onChange={e => setLocalSettings({...localSettings, closedDay: e.target.value})} />
             </div>
          </div>
        </div>
      </section>

      {/* Existing System Settings */}
      <section className="glass p-6 rounded-[2.5rem] space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <Shield size={14}/> {t.system}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.pin}</label>
             <input maxLength={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-xl font-black text-white" value={localSettings.adminPin} onChange={e => setLocalSettings({...localSettings, adminPin: e.target.value})} />
          </div>
          <div className="space-y-1">
             <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.cap}</label>
             <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-xl font-black text-white" value={localSettings.maxCapacityPerSlot} onChange={e => setLocalSettings({...localSettings, maxCapacityPerSlot: parseInt(e.target.value) || 0})} />
          </div>
        </div>
        <div className="space-y-1">
           <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-2">{t.email}</label>
           <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold" value={localSettings.managerEmail} onChange={e => setLocalSettings({...localSettings, managerEmail: e.target.value})} />
        </div>
      </section>

      <section className="glass p-6 rounded-[2.5rem] space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <Calendar size={20}/><h3 className="font-black text-[10px] uppercase tracking-widest">{t.holidays}</h3>
        </div>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white [color-scheme:dark] h-12"
            value={newHoliday}
            onChange={e => setNewHoliday(e.target.value)}
          />
          <button onClick={() => { if(newHoliday) { setLocalSettings({...localSettings, holidays: [...localSettings.holidays, newHoliday].sort()}); setNewHoliday(''); } }} className="bg-primary text-black px-6 rounded-xl font-black active:scale-95 transition-all text-[10px] uppercase tracking-widest">{t.add}</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localSettings.holidays.map(h => (
            <div key={h} className="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black border border-white/5">
              {new Date(h).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE')} 
              <button onClick={() => setLocalSettings({...localSettings, holidays: localSettings.holidays.filter(x => x !== h)})} className="text-red-500 p-1"><X size={14}/></button>
            </div>
          ))}
        </div>
      </section>

      <button 
        onClick={handleSave} 
        disabled={saveStatus !== 'idle'}
        className={`w-full py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
          saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-primary text-black'
        }`}
      >
        {saveStatus === 'saving' && <Loader2 size={24} className="animate-spin" />}
        {saveStatus === 'saved' && <Check size={24} />}
        {saveStatus === 'saved' ? t.saved : t.save}
      </button>
    </div>
  );
};

export default SettingsManager;
