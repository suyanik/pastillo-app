
import React, { useState } from 'react';
import { Users, Plus, Phone, Briefcase, Calendar, Trash2, UserPlus, Search } from 'lucide-react';
import { Personnel, Language } from '../types';

interface Props {
  lang: Language;
}

const PersonnelManagement: React.FC<Props> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const translations = {
    tr: {
      title: 'Personel Yönetimi',
      count: 'Çalışan Sayısı',
      add: 'Yeni Personel',
      search: 'Personel ara...',
      role: 'Görev',
      since: 'İşe Giriş',
      noStaff: 'Henüz personel eklenmemiş.',
      roles: ['Şef', 'Garson', 'Mutfak', 'Komi', 'Barista', 'Temizlik']
    },
    de: {
      title: 'Personalverwaltung',
      count: 'Anzahl Mitarbeiter',
      add: 'Neuer Mitarbeiter',
      search: 'Personal suchen...',
      role: 'Position',
      since: 'Eintritt',
      noStaff: 'Noch kein Personal hinzugefügt.',
      roles: ['Küchenchef', 'Kellner', 'Küche', 'Hilfskraft', 'Barista', 'Reinigung']
    },
    en: {
      title: 'Staff Management',
      count: 'Staff Count',
      add: 'New Staff',
      search: 'Search staff...',
      role: 'Role',
      since: 'Started',
      noStaff: 'No staff added yet.',
      roles: ['Chef', 'Waiter', 'Kitchen', 'Assistant', 'Barista', 'Cleaning']
    }
  };

  const t = translations[lang] || translations.tr;

  // Mock Data
  const [staff, setStaff] = useState<Personnel[]>([
    { id: '1', name: 'Ahmet Yılmaz', role: t.roles[0], phone: '0176 1234567', startDate: '2023-01-15' },
    { id: '2', name: 'Zeynep Kaya', role: t.roles[1], phone: '0176 7654321', startDate: '2023-05-10' },
  ]);

  const filteredStaff = staff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{t.title}</h2>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{t.count}: {staff.length}</p>
        </div>
        <button className="bg-primary p-3 rounded-2xl text-black shadow-lg shadow-primary/20 active:scale-90 transition-all">
          <UserPlus size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text"
          placeholder={t.search}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Users size={48} className="mx-auto mb-4" />
            <p className="font-bold uppercase tracking-widest text-sm">{t.noStaff}</p>
          </div>
        ) : (
          filteredStaff.map(person => (
            <div key={person.id} className="glass p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-primary border border-white/5 font-black text-xl">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{person.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase">{person.role}</span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter flex items-center gap-1">
                      <Calendar size={10} /> {person.startDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${person.phone}`} className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                  <Phone size={18} />
                </a>
                <button className="p-3 bg-red-500/5 rounded-xl text-red-500/40 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonnelManagement;

