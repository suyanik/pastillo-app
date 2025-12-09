import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Sadece iOS cihazlarda çalışsın
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Uygulama zaten "Standalone" (Ana ekrandan açılmış) modda mı?
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    // Eğer iOS ise VE henüz ana ekrana eklenmemişse göster
    if (isIOS && !isStandalone) {
      // Daha önce kapatıldı mı kontrol et (Session bazlı)
      const hasClosed = sessionStorage.getItem('installPromptClosed');
      if (!hasClosed) {
        // Kullanıcı hemen görmesin, 3 saniye sonra kibarca göster
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    sessionStorage.setItem('installPromptClosed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="bg-[#1c1c1c]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl relative max-w-md mx-auto">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-primary rounded-xl p-3 shrink-0">
             <img src="https://cdn-icons-png.flaticon.com/512/706/706164.png" className="w-8 h-8 invert-0" alt="Icon" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">App installieren</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Fügen Sie Pastillo zum Home-Bildschirm hinzu für die beste Erfahrung.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
           <div className="flex items-center gap-3 text-sm text-white/60">
             <span className="flex items-center justify-center w-6 h-6">
                <Share size={18} className="text-primary" />
             </span>
             <span>1. Tippen Sie unten auf <b>Teilen</b></span>
           </div>
           <div className="flex items-center gap-3 text-sm text-white/60">
             <span className="flex items-center justify-center w-6 h-6">
                <PlusSquare size={18} className="text-primary" />
             </span>
             <span>2. Wählen Sie <b>"Zum Home-Bildschirm"</b></span>
           </div>
        </div>
        
        {/* Ok işareti - Safari alt barını işaret eder */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1c1c1c]/90 border-r border-b border-white/10 rotate-45 transform"></div>
      </div>
    </div>
  );
};

export default InstallPrompt;
