import React, { useState } from 'react';
import { Lock, Users, ShieldCheck, User, Delete, ChevronLeft, Mail } from 'lucide-react';
import { Language, UserRole, AppSettings } from '../types';

interface Props {
  onLogin: (role: UserRole) => void;
  onCancel: () => void;
  lang: Language;
  settings: AppSettings;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onCancel, lang, settings }) => {
  const [mode, setMode] = useState<'select' | 'staff' | 'admin'>('select');
  const [pin, setPin] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [error, setError] = useState(false);

  const translations: Record<Language, Record<string, string>> = {
    tr: {
      title: 'STAFF PORTAL',
      subtitle: 'Restaurant Staff Management',
      staff: 'Personel Girişi',
      admin: 'Yönetici Girişi',
      user: 'Email',
      pass: 'Şifre',
      pin: 'PIN Kodu',
      login: 'GİRİŞ YAP',
      cancel: 'Vazgeç',
      wrong: 'Hatalı bilgiler!',
      back: 'Geri',
      forgot: 'Şifremi Unuttum?'
    },
    de: {
      title: 'STAFF PORTAL',
      subtitle: 'Restaurant Staff Management',
      staff: 'Personal-Login',
      admin: 'Manager-Login',
      user: 'Email',
      pass: 'Passwort',
      pin: 'PIN-Code',
      login: 'ANMELDEN',
      cancel: 'Abbrechen',
      wrong: 'Falsche Daten!',
      back: 'Zurück',
      forgot: 'Passwort vergessen?'
    },
    en: {
      title: 'STAFF PORTAL',
      subtitle: 'Restaurant Staff Management',
      staff: 'Staff Login',
      admin: 'Admin Login',
      user: 'Email',
      pass: 'Password',
      pin: 'PIN Code',
      login: 'LOG IN',
      cancel: 'Cancel',
      wrong: 'Wrong credentials!',
      back: 'Back',
      forgot: 'Forgot Password?'
    },
    es: {
      title: 'STAFF PORTAL',
      subtitle: 'Restaurant Staff Management',
      staff: 'Acceso Personal',
      admin: 'Acceso Administrador',
      user: 'Email',
      pass: 'Contraseña',
      pin: 'Código PIN',
      login: 'INICIAR SESIÓN',
      cancel: 'Cancelar',
      wrong: '¡Datos incorrectos!',
      back: 'Volver',
      forgot: '¿Olvidaste la contraseña?'
    }
  };

  const t = translations[lang] || translations.de;

  const handleAdminPin = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === (settings?.adminPin || '2027')) {
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

  // Hexagon Logo SVG
  const HexLogo = () => (
    <svg className="w-16 h-16 text-primary fill-none stroke-current stroke-[4]" viewBox="0 0 100 100">
      <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" />
      <path d="M50 35 L50 80 M35 45 L35 70 M65 45 L65 70" strokeLinecap="round" strokeWidth="3" />
      <path className="fill-white stroke-primary" d="M30 25 Q50 5 70 25" strokeWidth="3" />
    </svg>
  );

  if (mode === 'select') {
    return (
      <div className="fixed inset-0 bg-background-light hex-pattern z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-md">
          {/* Card with cut corners */}
          <div className="relative p-[2px] bg-primary cut-corners-lg">
            <div className="bg-white cut-corners-lg p-8 md:p-12 flex flex-col items-center">
              {/* Logo */}
              <div className="mb-2 flex items-center justify-center space-x-3">
                <HexLogo />
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold tracking-wider text-gray-900 leading-none">STAFF</h1>
                  <h1 className="text-3xl font-bold tracking-wider text-gray-900 leading-none">PORTAL</h1>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-10 tracking-wide uppercase">{t.subtitle}</p>

              {/* Login Buttons */}
              <div className="w-full space-y-4">
                <button
                  onClick={() => setMode('staff')}
                  className="group w-full bg-white border-2 border-gray-200 p-4 flex items-center gap-4 hover:border-primary transition-all cut-corners"
                >
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <Users size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.staff}</span>
                </button>

                <button
                  onClick={() => setMode('admin')}
                  className="group w-full bg-white border-2 border-gray-200 p-4 flex items-center gap-4 hover:border-primary transition-all cut-corners"
                >
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t.admin}</span>
                </button>
              </div>

              <button onClick={onCancel} className="mt-8 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background-light hex-pattern z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        {/* Card with cut corners */}
        <div className="relative p-[2px] bg-primary cut-corners-lg">
          <div className="bg-white cut-corners-lg p-8 md:p-12 flex flex-col items-center">
            {/* Back button */}
            <button
              onClick={() => { setMode('select'); setPin(''); setStaffPass(''); setError(false); }}
              className="absolute top-4 left-4 p-2 text-gray-400 flex items-center gap-1 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} /> {t.back}
            </button>

            {/* Logo */}
            <div className="mb-2 flex items-center justify-center space-x-3">
              <HexLogo />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-wider text-gray-900 leading-none">STAFF</h1>
                <h1 className="text-3xl font-bold tracking-wider text-gray-900 leading-none">PORTAL</h1>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-8 tracking-wide uppercase">{t.subtitle}</p>

            {error && (
              <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest animate-pulse">
                {t.wrong}
              </div>
            )}

            {mode === 'admin' ? (
              <div className="w-full space-y-8">
                {/* PIN Display */}
                <div className="flex justify-center gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`w-4 h-4 transition-all duration-300 ${pin.length > i ? (error ? 'bg-red-500' : 'bg-primary shadow-neon') : 'bg-gray-200'}`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                  ))}
                </div>

                {/* PIN Keypad */}
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleAdminPin(num.toString())}
                      className="w-16 h-16 mx-auto bg-gray-100 text-xl font-bold text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary active:bg-primary active:text-white transition-all cut-corners"
                    >
                      {num}
                    </button>
                  ))}
                  <div className="w-16 h-16"></div>
                  <button
                    onClick={() => handleAdminPin('0')}
                    className="w-16 h-16 mx-auto bg-gray-100 text-xl font-bold text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary active:bg-primary active:text-white transition-all cut-corners"
                  >
                    0
                  </button>
                  <button
                    onClick={() => setPin(prev => prev.slice(0, -1))}
                    className="w-16 h-16 mx-auto flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                  >
                    <Delete size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <form className="w-full space-y-6" onSubmit={(e) => { e.preventDefault(); handleStaffLogin(); }}>
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-gray-300 cut-corners pointer-events-none"></div>
                  <div className="relative flex items-center">
                    <span className="material-icons absolute left-3 text-gray-400">email</span>
                    <input
                      type="text"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      className="w-full bg-transparent border-none text-gray-900 pl-10 pr-4 py-3 focus:ring-0 placeholder-gray-400 cut-corners outline-none"
                      placeholder={t.user}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-gray-300 cut-corners pointer-events-none"></div>
                  <div className="relative flex items-center">
                    <span className="material-icons absolute left-3 text-gray-400">lock</span>
                    <input
                      type="password"
                      value={staffPass}
                      onChange={(e) => setStaffPass(e.target.value)}
                      className="w-full bg-transparent border-none text-gray-900 pl-10 pr-4 py-3 focus:ring-0 placeholder-gray-400 cut-corners outline-none"
                      placeholder={t.pass}
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="relative group w-full bg-primary text-gray-900 font-bold py-3 px-6 uppercase tracking-wider transition-all duration-300 hover:bg-primary-hover hover:shadow-neon cut-corners overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t.login}
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </button>

                <div className="text-center">
                  <a href="#" className="text-primary hover:text-primary-hover transition-colors text-sm underline">
                    {t.forgot}
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
