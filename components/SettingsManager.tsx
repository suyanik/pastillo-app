
import React, { useState } from 'react';
import { Shield, Users, Calendar, Mail, Save, Plus, X, Check, Loader2 } from 'lucide-react';
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

  const translations: Record<Language, any> = {
    tr: { title: 'Sistem Ayarları', pin: 'Yönetici PIN', cap: 'Slot Başı Max Kapasite', email: 'Yönetici E-posta', holidays: 'Tatil Günleri', save: 'AYARLARI KAYDET', add: 'Ekle', saved: 'KAYDEDİLDİ' },
    de: { title: 'Sytemeinstellungen', pin: 'Admin PIN', cap: 'Max. Kapazität pro Slot', email: 'Manager E-Mail', holidays: 'Ruhetage', save: 'EINSTELLUNGEN SPEICHERN', add: 'Hinzufügen', saved: 'GESPEICHERT' },
    en: { title: 'System Settings', pin: 'Admin PIN', cap: 'Max Capacity per Slot', email: 'Manager Email', holidays: 'Holidays', save: 'SAVE SETTINGS', add: 'Add', saved: 'SAVED' }
  };

  const t = translations[lang] || translations.de;

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

  const addHoliday = () => {
    if (!newHoliday) return;
    if (!localSettings.holidays.includes(newHoliday)) {
      setLocalSettings({ ...localSettings, holidays: [...localSettings.holidays, newHoliday].sort() });
    }
    setNewHoliday('');
  };

  const removeHoliday = (date: string) => {
    setLocalSettings({ ...localSettings, holidays: localSettings.holidays.filter(h => h !== date) });
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <section className="glass p-6 rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Shield size={20}/><h3 className="font-black text-sm uppercase tracking-widest">{t.pin}</h3>
        </div>
        <input 
          type="text" maxLength={4} 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-2xl font-black text-white text-center focus:border-primary outline-none transition-all"
          value={localSettings.adminPin}
          onChange={e => setLocalSettings({...localSettings, adminPin: e.target.value})}
        />
      </section>

      <section className="glass p-6 rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Users size={20}/><h3 className="font-black text-sm uppercase tracking-widest">{t.cap}</h3>
        </div>
        <input 
          type="number" 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-2xl font-black text-white text-center focus:border-primary outline-none transition-all"
          value={localSettings.maxCapacityPerSlot}
          onChange={e => setLocalSettings({...localSettings, maxCapacityPerSlot: parseInt(e.target.value) || 0})}
        />
      </section>

      <section className="glass p-6 rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Mail size={20}/><h3 className="font-black text-sm uppercase tracking-widest">{t.email}</h3>
        </div>
        <input 
          type="email" 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-primary outline-none transition-all"
          value={localSettings.managerEmail}
          onChange={e => setLocalSettings({...localSettings, managerEmail: e.target.value})}
        />
      </section>

      <section className="glass p-6 rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Calendar size={20}/><h3 className="font-black text-sm uppercase tracking-widest">{t.holidays}</h3>
        </div>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white [color-scheme:dark] h-12"
            value={newHoliday}
            onChange={e => setNewHoliday(e.target.value)}
          />
          <button onClick={addHoliday} className="bg-primary text-black px-6 rounded-xl font-black active:scale-95 transition-all text-xs uppercase tracking-widest">{t.add}</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localSettings.holidays.length === 0 && (
            <p className="text-[10px] text-white/20 uppercase font-black italic">Herhangi bir tatil günü eklenmedi</p>
          )}
          {localSettings.holidays.map(h => (
            <div key={h} className="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black border border-white/5 animate-in zoom-in duration-200">
              {new Date(h).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE')} 
              <button onClick={() => removeHoliday(h)} className="text-red-500 hover:text-red-400 transition-colors p-1"><X size={14}/></button>
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
