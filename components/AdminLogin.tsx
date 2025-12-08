import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        if (newPin === '1234') {
          setTimeout(onLogin, 100);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 300);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 bg-[#111111]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in slide-in-from-bottom duration-300">
      <div className="w-full max-w-xs text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <Lock className="text-primary" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Login</h2>
          <p className="text-sm text-white/50 mt-2">PIN eingeben um fortzufahren</p>
        </div>

        <div className="flex justify-center gap-4 mb-8 h-4">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                pin.length > i 
                  ? (error ? 'bg-red-500' : 'bg-primary scale-110') 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-6 gap-y-4 px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumClick(num.toString())}
              className="w-16 h-16 rounded-full bg-white/5 text-2xl font-medium text-white shadow-sm border border-white/10 active:bg-white/20 transition-colors mx-auto flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16"></div> {/* Spacer */}
          <button
            onClick={() => handleNumClick('0')}
            className="w-16 h-16 rounded-full bg-white/5 text-2xl font-medium text-white shadow-sm border border-white/10 active:bg-white/20 transition-colors mx-auto flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white/50 active:text-white mx-auto text-sm font-medium"
          >
            Löschen
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="mt-12 text-white/40 text-sm font-medium hover:text-white"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
