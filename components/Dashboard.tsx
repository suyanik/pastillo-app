
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, CreditCard, ArrowRight, Receipt } from 'lucide-react';
import { FinancialRecord, Language } from '../types';

interface Props {
  records: FinancialRecord[];
  lang: Language;
}

const Dashboard: React.FC<Props> = ({ lang }) => {
  const translations: any = {
    tr: {
      net: 'Bugünkü Net Kasa',
      income: 'Gelir',
      expense: 'Gider',
      cash: 'Nakit',
      card: 'Kredi Kartı',
      recent: 'Son Harcamalar',
      all: 'TÜMÜ',
      empty: 'İşlem Bulunmuyor'
    },
    de: {
      net: 'Netto-Kasse Heute',
      income: 'Einnahmen',
      expense: 'Ausgaben',
      cash: 'Bargeld',
      card: 'Kreditkarte',
      recent: 'Letzte Ausgaben',
      all: 'ALLE',
      empty: 'Keine Einträge'
    },
    en: {
      net: 'Today\'s Net Cash',
      income: 'Income',
      expense: 'Expenses',
      cash: 'Cash',
      card: 'Credit Card',
      recent: 'Recent Expenses',
      all: 'ALL',
      empty: 'No Transactions'
    },
    es: {
      net: 'Caja Neta de Hoy',
      income: 'Ingresos',
      expense: 'Gastos',
      cash: 'Efectivo',
      card: 'Tarjeta',
      recent: 'Gastos Recientes',
      all: 'TODO',
      empty: 'Sin transacciones'
    }
  };

  const t = translations[lang] || translations.tr;

  const today = {
    turnover: { cash: 1250, card: 3400, total: 4650 },
    expenses: 840,
    net: 3810
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl ring-1 ring-white/10">
        <div className="relative z-10">
          <p className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t.net}</p>
          <h2 className="text-6xl font-black text-black tracking-tighter">€{today.net.toLocaleString()}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-black/5 rounded-[1.8rem] p-4 backdrop-blur-md border border-black/5">
              <div className="flex items-center gap-2 text-black/60 mb-1">
                <TrendingUp size={14} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">{t.income}</span>
              </div>
              <p className="text-xl font-black text-black">€{today.turnover.total}</p>
            </div>
            <div className="bg-black/5 rounded-[1.8rem] p-4 backdrop-blur-md border border-black/5">
              <div className="flex items-center gap-2 text-black/60 mb-1">
                <TrendingDown size={14} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">{t.expense}</span>
              </div>
              <p className="text-xl font-black text-black">€{today.expenses}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-[2rem] border border-white/5 relative">
          <div className="p-3 bg-orange-500/20 rounded-2xl w-fit mb-4 text-orange-500"><Wallet size={24} /></div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{t.cash}</p>
          <p className="text-2xl font-black text-white">€{today.turnover.cash}</p>
        </div>
        <div className="glass p-5 rounded-[2rem] border border-white/5 relative">
          <div className="p-3 bg-blue-500/20 rounded-2xl w-fit mb-4 text-blue-500"><CreditCard size={24} /></div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{t.card}</p>
          <p className="text-2xl font-black text-white">€{today.turnover.card}</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">{t.recent}</h3>
          <button className="text-primary text-[10px] font-black flex items-center gap-1">{t.all} <ArrowRight size={14}/></button>
        </div>
        <div className="space-y-3">
           {[
             { title: 'Sebze Alımı', cat: 'Tedarikçi', price: 120, time: '14:20' },
             { title: 'Ahmet - Avans', cat: 'Maaş/Avans', price: 50, time: '12:05' }
           ].map((item: any, i: number) => (
             <div key={i} className="glass p-5 rounded-[1.8rem] flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20"><Receipt size={22} /></div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{item.title}</p>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">{item.cat} • {item.time}</p>
                  </div>
                </div>
                <p className="font-black text-red-400">€{item.price}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
