
import React, { useState } from 'react';
import { Lock, Users, ShieldCheck, User, KeyRound, Delete, ChevronLeft } from 'lucide-react';
import { Language, UserRole } from '../types';

interface Props {
  onLogin: (role: UserRole) => void;
  onCancel: () => void;
  lang: Language;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onCancel, lang }) => {
  const [mode, setMode] = useState<'select' | 'staff' | 'admin'>('select');
  const [pin, setPin] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [error, setError] = useState(false);

  const translations = {
    tr: {
      title: 'Giriş Yap',
      staff: 'Personel Girişi',
      admin: 'Yönetici Girişi',
      user: 'Kullanıcı Adı',
      pass: 'Şifre',
      pin: 'PIN Kodunu Girin',
      login: 'GİRİŞ YAP',
      cancel: 'Vazgeç',
      wrong: 'Hatalı bilgiler!',
      back: 'Geri'
    },
    de: {
      title: 'Anmeldung',
      staff: 'Personal-Login',
      admin: 'Manager-Login',
      user: 'Benutzername',
      pass: 'Passwort',
      pin: 'PIN-Code eingeben',
      login: 'ANMELDEN',
      cancel: 'Abbrechen',
      wrong: 'Falsche Daten!',
      back: 'Zurück'
    },
    en: {
      title: 'Login',
      staff: 'Staff Login',
      admin: 'Manager Login',
      user: 'Username',
      pass: 'Password',
      pin: 'Enter PIN Code',
      login: 'LOGIN',
      cancel: 'Cancel',
      wrong: 'Invalid credentials!',
      back: 'Back'
    }
  };

  const t = translations[lang] || translations.de;

  const handleAdminPin = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        if (newPin === '2027') {
          if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
          onLogin('admin');
        } else {
          setError(true);
          if (navigator.vibrate) navigator.vibrate(200);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleStaffLogin = () => {
    if (staffUsername.toLowerCase() === 'pastillo' && staffPass === '0000') {
      if (navigator.vibrate) navigator.vibrate(50);
      onLogin('staff');
    } else {
      setError(true);
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (mode === 'select') {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{t.title}</h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Pastillo Management Suite</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setMode('staff')}
              className="glass group p-8 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/10 active:scale-95 transition-all border border-white/5"
            >
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <Users size={32} />
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest">{t.staff}</span>
            </button>

            <button 
              onClick={() => setMode('admin')}
              className="glass group p-8 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/10 active:scale-95 transition-all border border-white/5"
            >
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <ShieldCheck size={32} />
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest">{t.admin}</span>
            </button>
          </div>

          <button onClick={onCancel} className="text-white/30 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom duration-500">
      <div className="w-full max-w-xs space-y-10 text-center">
        <div className="relative">
          <button 
            onClick={() => { setMode('select'); setPin(''); setStaffPass(''); setError(false); }}
            className="absolute -top-12 -left-4 p-2 text-white/30 flex items-center gap-1 font-black text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft size={16}/> {t.back}
          </button>
          
          <div className={`w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10 transition-colors ${error ? 'border-red-500/50 text-red-500' : 'text-primary'}`}>
            {mode === 'admin' ? <Lock size={32} /> : <User size={32} />}
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{mode === 'admin' ? t.admin : t.staff}</h2>
          {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 animate-bounce">{t.wrong}</p>}
        </div>

        {mode === 'admin' ? (
          <div className="space-y-10">
            <div className="flex justify-center gap-5 h-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${pin.length > i ? (error ? 'bg-red-500' : 'bg-primary scale-125 shadow-[0_0_15px_rgba(255,193,7,0.5)]') : 'bg-white/10 shadow-inner'}`} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-y-6 gap-x-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} onClick={() => handleAdminPin(num.toString())} className="w-16 h-16 rounded-full bg-white/5 text-2xl font-black text-white border border-white/5 active:bg-primary active:text-black transition-all mx-auto flex items-center justify-center shadow-lg">{num}</button>
              ))}
              <div className="w-16 h-16"></div>
              <button onClick={() => handleAdminPin('0')} className="w-16 h-16 rounded-full bg-white/5 text-2xl font-black text-white border border-white/5 active:bg-primary active:text-black transition-all mx-auto flex items-center justify-center shadow-lg">0</button>
              <button onClick={() => setPin(prev => prev.slice(0, -1))} className="w-16 h-16 flex items-center justify-center text-white/30 active:text-white mx-auto"><Delete size={24}/></button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder={t.user} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  value={staffUsername}
                  onChange={e => setStaffUsername(e.target.value)}
                />
              </div>
              <div className="relative group">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder={t.pass} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                  value={staffPass}
                  onChange={e => setStaffPass(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={handleStaffLogin}
              className="w-full bg-primary text-black py-5 rounded-2xl font-black text-sm tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              {t.login}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
