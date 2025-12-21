
import React, { useState, useRef } from 'react';
import { Camera, Save, Plus, CreditCard, Wallet, Loader2, ShoppingBag, FileText } from 'lucide-react';
import { analyzeReceiptAI } from '../services/geminiService';
import { Language } from '../types';
import { addTurnover, addExpense } from '../services/firebase';

interface Props {
  onSave: () => void;
  lang: Language;
}

const EntryForm: React.FC<Props> = ({ onSave, lang }) => {
  const [activeTab, setActiveTab] = useState<'ciro' | 'gider'>('ciro');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations: Record<Language, any> = {
    tr: {
      turnover: 'GÜNLÜK CİRO', expense: 'GİDER EKLE', cash: 'Nakit Ciro', card: 'Kredi Kartı Ciro', lieferando: 'Lieferando', save: 'KAYDET',
      scan: 'Taramayı Başlat (AI)', analyzing: 'AI Analiz Ediyor...', amount: 'Tutar', category: 'Kategori', desc: 'Açıklama',
      add: 'GİDERİ EKLE', catOptions: ['Maaş/Avans', 'Tedarikçi', 'Kira/Fatura', 'Vergi', 'Diğer'], fileHint: 'Resim veya PDF'
    },
    de: {
      turnover: 'TAGESUMSATZ', expense: 'AUSGABE HINZUFÜGEN', cash: 'Bargeldumsatz', card: 'Kartenzahlung', lieferando: 'Lieferando', save: 'SPEICHERN',
      scan: 'Scan starten (KI)', analyzing: 'KI analysiert...', amount: 'Betrag', category: 'Kategorie', desc: 'Beschreibung',
      add: 'HINZÜFÜGEN', catOptions: ['Gehalt/Vorschuss', 'Lieferant', 'Miete/Nebenkosten', 'Steuer', 'Sonstiges'], fileHint: 'Bild oder PDF'
    },
    en: {
      turnover: 'DAILY TURNOVER', expense: 'ADD EXPENSE', cash: 'Cash Turnover', card: 'Credit Card Turnover', lieferando: 'Lieferando', save: 'SAVE',
      scan: 'Start Scan (AI)', analyzing: 'AI Analyzing...', amount: 'Amount', category: 'Category', desc: 'Description',
      add: 'ADD EXPENSE', catOptions: ['Salary/Advance', 'Supplier', 'Rent/Bills', 'Tax', 'Other'], fileHint: 'Image or PDF'
    },
    es: {
      turnover: 'VOLUMEN DIARIO', expense: 'AÑADIR GASTO', cash: 'Efectivo', card: 'Tarjeta', lieferando: 'Lieferando', save: 'GUARDAR',
      scan: 'Iniciar Escaneo (IA)', analyzing: 'IA Analizando...', amount: 'Monto', category: 'Categoría', desc: 'Descripción',
      add: 'AÑADIR GASTO', catOptions: ['Salario/Adelanto', 'Proveedor', 'Alquiler/Facturas', 'Impuestos', 'Otros'], fileHint: 'Imagen o PDF'
    }
  };

  const t = translations[lang] || translations.de;

  const [ciro, setCiro] = useState({ cash: '', card: '', lieferando: '' });
  const [gider, setGider] = useState({ amount: '', description: '', category: t.catOptions[0] });

  const handleSaveTurnover = async () => {
    setIsSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const cash = parseFloat(ciro.cash) || 0;
    const card = parseFloat(ciro.card) || 0;
    const lieferando = parseFloat(ciro.lieferando) || 0;

    await addTurnover({
      date: today,
      cash,
      creditCard: card,
      lieferando,
      total: cash + card + lieferando
    });
    setIsSaving(false);
    onSave();
  };

  const handleSaveExpense = async () => {
    setIsSaving(true);
    const today = new Date().toISOString().split('T')[0];
    await addExpense({
      date: today,
      amount: parseFloat(gider.amount) || 0,
      description: gider.description,
      category: gider.category as any
    });
    setIsSaving(false);
    onSave();
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const mimeType = file.type || "image/jpeg";

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeReceiptAI(base64, mimeType, lang);
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
      <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/10">
        <button onClick={() => setActiveTab('ciro')} className={`flex-1 py-4 rounded-[1.8rem] text-[11px] font-black tracking-widest transition-all ${activeTab === 'ciro' ? 'bg-primary text-black' : 'text-white/30'}`}>{t.turnover}</button>
        <button onClick={() => setActiveTab('gider')} className={`flex-1 py-4 rounded-[1.8rem] text-[11px] font-black tracking-widest transition-all ${activeTab === 'gider' ? 'bg-primary text-black' : 'text-white/30'}`}>{t.expense}</button>
      </div>

      {activeTab === 'ciro' ? (
        <div className="space-y-4">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2"><Wallet size={12} /> {t.cash}</label>
              <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 text-4xl font-black text-white focus:outline-none" value={ciro.cash} onChange={e => setCiro({ ...ciro, cash: e.target.value })} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2"><ShoppingBag size={12} className="text-orange-400" /> {t.lieferando}</label>
              <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 text-4xl font-black text-orange-400 focus:outline-none" value={ciro.lieferando} onChange={e => setCiro({ ...ciro, lieferando: e.target.value })} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2"><CreditCard size={12} /> {t.card}</label>
              <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 text-4xl font-black text-white focus:outline-none" value={ciro.card} onChange={e => setCiro({ ...ciro, card: e.target.value })} />
            </div>
          </div>
          <button onClick={handleSaveTurnover} disabled={isSaving} className="w-full bg-primary text-black py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={24} />} {t.save}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-3xl py-12 flex flex-col items-center justify-center gap-4 active:bg-white/10 transition-colors"
            >
              {isAnalyzing ? (
                <Loader2 className="animate-spin text-primary" size={40} />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2 text-primary">
                    <Camera size={32} />
                    <FileText size={32} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">{t.scan}</span>
                  <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{t.fileHint}</span>
                </div>
              )}
            </button>
            <input
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              hidden
              ref={fileInputRef}
              onChange={handleCapture}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.amount}</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white font-black" value={gider.amount} onChange={e => setGider({ ...gider, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.category}</label>
                <select className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-3 text-white text-xs font-black" value={gider.category} onChange={e => setGider({ ...gider, category: e.target.value })}>
                  {t.catOptions.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.desc}</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold" value={gider.description} onChange={e => setGider({ ...gider, description: e.target.value })} />
            </div>
          </div>
          <button onClick={handleSaveExpense} disabled={isSaving} className="w-full bg-white text-black py-6 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" /> : <Plus size={24} />} {t.add}
          </button>
        </div>
      )}
    </div>
  );
};

export default EntryForm;
