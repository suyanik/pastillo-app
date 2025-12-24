
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
      add: 'GİDERİ EKLE', catOptions: ['Avans', 'Maaş', 'Tedarikçi', 'Kira/Fatura', 'Metro', 'Nuava Gastronomie', 'Kaya Markt', 'Waurig', 'Rewe', 'İçecekler', 'Vergi', 'Muhasebeci', 'Bakım/Tamir', 'Reklam/Pazarlama', 'Diğer'], fileHint: 'Resim veya PDF'
    },
    de: {
      turnover: 'TAGESUMSATZ', expense: 'AUSGABE HINZUFÜGEN', cash: 'Bargeldumsatz', card: 'Kartenzahlung', lieferando: 'Lieferando', save: 'SPEICHERN',
      scan: 'Scan starten (KI)', analyzing: 'KI analysiert...', amount: 'Betrag', category: 'Kategorie', desc: 'Beschreibung',
      add: 'HINZÜFÜGEN', catOptions: ['Vorschuss', 'Gehalt', 'Lieferant', 'Miete/Nebenkosten', 'Metro', 'Nuava Gastronomie', 'Kaya Markt', 'Waurig', 'Rewe', 'Getränke', 'Steuer', 'Steuerberater', 'Wartung/Reparatur', 'Werbung/Marketing', 'Sonstiges'], fileHint: 'Bild oder PDF'
    },
    en: {
      turnover: 'DAILY TURNOVER', expense: 'ADD EXPENSE', cash: 'Cash Turnover', card: 'Credit Card Turnover', lieferando: 'Lieferando', save: 'SAVE',
      scan: 'Start Scan (AI)', analyzing: 'AI Analyzing...', amount: 'Amount', category: 'Category', desc: 'Description',
      add: 'ADD EXPENSE', catOptions: ['Advance', 'Salary', 'Supplier', 'Rent/Bills', 'Metro', 'Nuava Gastronomie', 'Kaya Markt', 'Waurig', 'Rewe', 'Beverages', 'Tax', 'Tax Consultant', 'Maintenance/Repair', 'Advertising/Marketing', 'Other'], fileHint: 'Image or PDF'
    },
    es: {
      turnover: 'VOLUMEN DIARIO', expense: 'AÑADIR GASTO', cash: 'Efectivo', card: 'Tarjeta', lieferando: 'Lieferando', save: 'GUARDAR',
      scan: 'Iniciar Escaneo (IA)', analyzing: 'IA Analizando...', amount: 'Monto', category: 'Categoría', desc: 'Descripción',
      add: 'AÑADIR GASTO', catOptions: ['Adelanto', 'Salario', 'Proveedor', 'Alquiler/Facturas', 'Metro', 'Nuava Gastronomie', 'Kaya Markt', 'Waurig', 'Rewe', 'Bebidas', 'Impuestos', 'Asesor Fiscal', 'Mantenimiento/Reparación', 'Publicidad/Marketing', 'Otros'], fileHint: 'Imagen o PDF'
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
      <div className="flex bg-gray-100 p-1.5 border-2 border-gray-200 cut-corners">
        <button onClick={() => setActiveTab('ciro')} className={`flex-1 py-4 text-[11px] font-bold tracking-widest transition-all cut-corners ${activeTab === 'ciro' ? 'bg-primary text-gray-900' : 'text-gray-500'}`}>{t.turnover}</button>
        <button onClick={() => setActiveTab('gider')} className={`flex-1 py-4 text-[11px] font-bold tracking-widest transition-all cut-corners ${activeTab === 'gider' ? 'bg-primary text-gray-900' : 'text-gray-500'}`}>{t.expense}</button>
      </div>

      {activeTab === 'ciro' ? (
        <div className="space-y-4">
          <div className="bg-white p-8 border-2 border-gray-200 space-y-8 cut-corners-lg">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><Wallet size={12} /> {t.cash}</label>
              <input type="number" placeholder="0.00" className="w-full bg-gray-100 border-2 border-gray-200 py-6 px-6 text-4xl font-bold text-gray-900 focus:outline-none focus:border-primary cut-corners" value={ciro.cash} onChange={e => setCiro({ ...ciro, cash: e.target.value })} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><ShoppingBag size={12} className="text-orange-500" /> {t.lieferando}</label>
              <input type="number" placeholder="0.00" className="w-full bg-gray-100 border-2 border-gray-200 py-6 px-6 text-4xl font-bold text-orange-500 focus:outline-none focus:border-primary cut-corners" value={ciro.lieferando} onChange={e => setCiro({ ...ciro, lieferando: e.target.value })} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><CreditCard size={12} /> {t.card}</label>
              <input type="number" placeholder="0.00" className="w-full bg-gray-100 border-2 border-gray-200 py-6 px-6 text-4xl font-bold text-gray-900 focus:outline-none focus:border-primary cut-corners" value={ciro.card} onChange={e => setCiro({ ...ciro, card: e.target.value })} />
            </div>
          </div>
          <button onClick={handleSaveTurnover} disabled={isSaving} className="w-full bg-primary text-gray-900 py-6 font-bold text-lg shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2 hover:shadow-neon cut-corners">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={24} />} {t.save}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-8 border-2 border-gray-200 space-y-6 cut-corners-lg">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full bg-gray-50 border-2 border-dashed border-gray-300 py-12 flex flex-col items-center justify-center gap-4 active:bg-gray-100 transition-colors cut-corners"
            >
              {isAnalyzing ? (
                <Loader2 className="animate-spin text-primary" size={40} />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2 text-primary">
                    <Camera size={32} />
                    <FileText size={32} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">{t.scan}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t.fileHint}</span>
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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.amount}</label>
                <input type="number" className="w-full bg-gray-100 border-2 border-gray-200 py-4 px-4 text-gray-900 font-bold cut-corners" value={gider.amount} onChange={e => setGider({ ...gider, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.category}</label>
                <select className="w-full bg-gray-100 border-2 border-gray-200 py-4 px-3 text-gray-900 text-xs font-bold cut-corners" value={gider.category} onChange={e => setGider({ ...gider, category: e.target.value })}>
                  {t.catOptions.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.desc}</label>
              <input type="text" className="w-full bg-gray-100 border-2 border-gray-200 py-4 px-5 text-gray-900 font-bold cut-corners" value={gider.description} onChange={e => setGider({ ...gider, description: e.target.value })} />
            </div>
          </div>
          <button onClick={handleSaveExpense} disabled={isSaving} className="w-full bg-primary text-gray-900 py-6 font-bold text-lg shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2 hover:shadow-neon cut-corners">
            {isSaving ? <Loader2 className="animate-spin" /> : <Plus size={24} />} {t.add}
          </button>
        </div>
      )}
    </div>
  );
};

export default EntryForm;
