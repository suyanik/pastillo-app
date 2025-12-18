
import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, CreditCard, ArrowRight, Receipt, ShoppingBag } from 'lucide-react';
import { Language, DailyTurnover, Expense } from '../types';
import EntryForm from './EntryForm';

interface Props {
  turnovers: DailyTurnover[];
  expenses: Expense[];
  lang: Language;
}

const Dashboard: React.FC<Props> = ({ lang, turnovers, expenses }) => {
  const [showEntry, setShowEntry] = React.useState(false);

  const translations: Record<Language, any> = {
    tr: { net: 'Bugünkü Net Kasa', income: 'Gelir', expense: 'Gider', cash: 'Nakit', card: 'Kredi Kartı', lieferando: 'Lieferando', recent: 'Son Harcamalar', all: 'TÜMÜ', add: 'İŞLEM EKLE' },
    de: { net: 'Netto-Kasse Heute', income: 'Einnahmen', expense: 'Ausgaben', cash: 'Bargeld', card: 'Kreditkarte', lieferando: 'Lieferando', recent: 'Letzte Ausgaben', all: 'ALLE', add: 'BUCHUNG ERFASSEN' },
    en: { net: 'Today\'s Net Cash', income: 'Income', expense: 'Expenses', cash: 'Cash', card: 'Credit Card', lieferando: 'Lieferando', recent: 'Recent Expenses', all: 'ALL', add: 'NEW ENTRY' }
  };

  const t = translations[lang] || translations.de;

  const todayStr = new Date().toISOString().split('T')[0];

  const todayStats = useMemo(() => {
    const turn = turnovers.find(t => t.date === todayStr) || { cash: 0, creditCard: 0, lieferando: 0, total: 0 };
    const todayExps = expenses.filter(e => e.date === todayStr).reduce((sum, e) => sum + e.amount, 0);
    return {
      income: turn.total,
      cash: turn.cash,
      card: turn.creditCard,
      lieferando: turn.lieferando || 0,
      expenses: todayExps,
      net: turn.total - todayExps
    };
  }, [turnovers, expenses, todayStr]);

  if (showEntry) {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black">{t.add}</h2>
          <button onClick={() => setShowEntry(false)} className="text-white/40 text-sm">X</button>
        </div>
        <EntryForm lang={lang} onSave={() => setShowEntry(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl ring-1 ring-white/10">
        <div className="relative z-10">
          <p className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t.net}</p>
          <h2 className="text-5xl font-black text-black tracking-tighter">€{todayStats.net.toLocaleString()}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-black/5 rounded-[1.8rem] p-4 backdrop-blur-md border border-black/5">
              <div className="flex items-center gap-2 text-black/60 mb-1">
                <TrendingUp size={14} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">{t.income}</span>
              </div>
              <p className="text-xl font-black text-black">€{todayStats.income.toLocaleString()}</p>
            </div>
            <div className="bg-black/5 rounded-[1.8rem] p-4 backdrop-blur-md border border-black/5">
              <div className="flex items-center gap-2 text-black/60 mb-1">
                <TrendingDown size={14} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">{t.expense}</span>
              </div>
              <p className="text-xl font-black text-black">€{todayStats.expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setShowEntry(true)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 font-black text-xs uppercase tracking-widest text-primary shadow-lg active:scale-95 transition-all">
        {t.add}
      </button>

      <div className="grid grid-cols-3 gap-2">
        <div className="glass p-4 rounded-[1.8rem] border border-white/5 relative flex flex-col items-center text-center">
          <div className="p-2 bg-orange-500/20 rounded-xl w-fit mb-2 text-orange-500"><Wallet size={18} /></div>
          <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">{t.cash}</p>
          <p className="text-sm font-black text-white">€{todayStats.cash.toLocaleString()}</p>
        </div>
        <div className="glass p-4 rounded-[1.8rem] border border-white/5 relative flex flex-col items-center text-center">
          <div className="p-2 bg-orange-400/20 rounded-xl w-fit mb-2 text-orange-400"><ShoppingBag size={18} /></div>
          <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">Lieferando</p>
          <p className="text-sm font-black text-orange-400">€{todayStats.lieferando.toLocaleString()}</p>
        </div>
        <div className="glass p-4 rounded-[1.8rem] border border-white/5 relative flex flex-col items-center text-center">
          <div className="p-2 bg-blue-500/20 rounded-xl w-fit mb-2 text-blue-500"><CreditCard size={18} /></div>
          <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">{t.card}</p>
          <p className="text-sm font-black text-white">€{todayStats.card.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">{t.recent}</h3>
          <button className="text-primary text-[10px] font-black flex items-center gap-1">{t.all} <ArrowRight size={14}/></button>
        </div>
        <div className="space-y-3">
           {expenses.slice(0, 5).map((item, i) => (
             <div key={i} className="glass p-5 rounded-[1.8rem] flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20"><Receipt size={22} /></div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{item.description}</p>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-0.5">{item.category} • {item.date}</p>
                  </div>
                </div>
                <p className="font-black text-red-400">€{item.amount}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
