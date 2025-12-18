import React, { useState, useRef } from 'react';
import { Camera, Save, Plus, Users, CreditCard, Wallet, Loader2 } from 'lucide-react';
import { analyzeReceiptAI } from '../services/geminiService';
import { Language } from '../types';

interface Props {
  onSave: () => void;
  lang: Language;
}

const EntryForm: React.FC<Props> = ({ onSave, lang }) => {
  const [activeTab, setActiveTab] = useState<'ciro' | 'gider'>('ciro');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations: Record<Language, any> = {
    tr: {
      turnover: 'GÜNLÜK CİRO',
      expense: 'GİDER EKLE',
      cash: 'Nakit Ciro',
      card: 'Kredi Kartı Ciro',
      save: 'KAYDET',
      scan: 'Fiş Tara (AI)',
      analyzing: 'AI Analiz Ediyor...',
      amount: 'Tutar',
      category: 'Kategori',
      desc: 'Açıklama',
      personnel: 'Personel Seçimi',
      placeholderDesc: 'Örn: Metro Market Gıda',
      add: 'GİDERİ EKLE',
      catOptions: ['Maaş/Avans', 'Tedarikçi', 'Kira/Fatura', 'Vergi', 'Diğer']
    },
    de: {
      turnover: 'TAGESUMSATZ',
      expense: 'AUSGABE HINZUFÜGEN',
      cash: 'Bargeldumsatz',
      card: 'Kartenzahlung',
      save: 'SPEICHERN',
      scan: 'Beleg scannen (KI)',
      analyzing: 'KI analysiert...',
      amount: 'Betrag',
      category: 'Kategorie',
      desc: 'Beschreibung',
      personnel: 'Personalauswahl',
      placeholderDesc: 'Z.B.: Metro Markt Einkauf',
      add: 'HINZUFÜGEN',
      catOptions: ['Gehalt/Vorschuss', 'Lieferant', 'Miete/Nebenkosten', 'Steuer', 'Sonstiges']
    },
    en: {
      turnover: 'DAILY TURNOVER',
      expense: 'ADD EXPENSE',
      cash: 'Cash Turnover',
      card: 'Card Turnover',
      save: 'SAVE',
      scan: 'Scan Receipt (AI)',
      analyzing: 'AI Analyzing...',
      amount: 'Amount',
      category: 'Category',
      desc: 'Description',
      personnel: 'Personnel Selection',
      placeholderDesc: 'E.g.: Metro Market Groceries',
      add: 'ADD EXPENSE',
      catOptions: ['Salary/Advance', 'Supplier', 'Rent/Bills', 'Tax', 'Other']
    },
    es: {
      turnover: 'TURNO DIARIO',
      expense: 'AGREGAR GASTO',
      cash: 'Efectivo',
      card: 'Tarjeta',
      save: 'GUARDAR',
      scan: 'Escanear (AI)',
      analyzing: 'AI analizando...',
      amount: 'Monto',
      category: 'Categoría',
      desc: 'Descripción',
      personnel: 'Personal',
      placeholderDesc: 'Ej: Supermercado',
      add: 'AGREGAR GASTO',
      catOptions: ['Salario/Adelanto', 'Proveedor', 'Renta/Facturas', 'Impuestos', 'Otros']
    }
  };

  const t = translations[lang] || translations.tr;

  const [ciro, setCiro] = useState({ cash: '', card: '' });
  const [gider, setGider] = useState({ 
    amount: '', 
    description: '', 
    category: t.catOptions[0],
    personnelName: ''
  });

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeReceiptAI(base64, lang);
      if (result) {
        setGider({
          ...gider,
          amount: result.totalAmount.toString(),
          description: result.description,
          category: result.category
        });
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/10 shadow-inner">
        <button 
          onClick={() => setActiveTab('ciro')}
          className={`flex-1 py-4 rounded-[1.8rem] text-[11px] font-black tracking-widest transition-all ${activeTab === 'ciro' ? 'bg-primary text-black' : 'text-white/30'}`}
        >
          {t.turnover}
        </button>
        <button 
          onClick={() => setActiveTab('gider')}
          className={`flex-1 py-4 rounded-[1.8rem] text-[11px] font-black tracking-widest transition-all ${activeTab === 'gider' ? 'bg-primary text-black' : 'text-white/30'}`}
        >
          {t.expense}
        </button>
      </div>

      {activeTab === 'ciro' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                <Wallet size={12} strokeWidth={3} /> {t.cash}
              </label>
              <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 text-4xl font-black text-white focus:outline-none" value={ciro.cash} onChange={e => setCiro({...ciro, cash: e.target.value})}/>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                <CreditCard size={12} strokeWidth={3} /> {t.card}
              </label>
              <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 text-4xl font-black text-white focus:outline-none" value={ciro.card} onChange={e => setCiro({...ciro, card: e.target.value})}/>
            </div>
          </div>
          <button onClick={onSave} className="w-full bg-primary text-black py-6 rounded-3xl font-black text-lg shadow-xl"><Save size={24} /> {t.save}</button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-3xl py-12 flex flex-col items-center justify-center gap-4">
              {isAnalyzing ? <Loader2 className="animate-spin text-primary" /> : <Camera size={40} className="text-primary" />}
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">{isAnalyzing ? t.analyzing : t.scan}</span>
            </button>
            <input type="file" accept="image/*" capture="environment" hidden ref={fileInputRef} onChange={handleCapture} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.amount}</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-black" value={gider.amount} onChange={e => setGider({...gider, amount: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.category}</label>
                <select className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-3 text-white text-xs font-black [color-scheme:dark]" value={gider.category} onChange={e => setGider({...gider, category: e.target.value})}>
                  {(t.catOptions as string[]).map((opt: string) => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.desc}</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold" placeholder={t.placeholderDesc} value={gider.description} onChange={e => setGider({...gider, description: e.target.value})}/>
            </div>
          </div>
          <button onClick={onSave} className="w-full bg-white text-black py-6 rounded-3xl font-black text-lg shadow-xl"><Plus size={24} /> {t.add}</button>
        </div>
      )}
    </div>
  );
};

export default EntryForm;