
import React, { useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, CreditCard, ArrowRight, 
  Receipt, ShoppingBag, Download, FileSpreadsheet, X
} from 'lucide-react';
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
    tr: { net: 'Bugünkü Net Kasa', income: 'Gelir', expense: 'Gider', cash: 'Nakit', card: 'Kredi Kartı', lieferando: 'Lieferando', recent: 'Son Harcamalar', all: 'TÜMÜ', add: 'İŞLEM EKLE', export: 'CSV AKTAR' },
    de: { net: 'Netto-Kasse Heute', income: 'Einnahmen', expense: 'Ausgaben', cash: 'Bargeld', card: 'Kreditkarte', lieferando: 'Lieferando', recent: 'Letzte Ausgaben', all: 'ALLE', add: 'BUCHUNG ERFASSEN', export: 'CSV EXPORT' },
    en: { net: 'Today\'s Net Cash', income: 'Income', expense: 'Expenses', cash: 'Cash', card: 'Credit Card', lieferando: 'Lieferando', recent: 'Recent Expenses', all: 'ALL', add: 'NEW ENTRY', export: 'EXPORT CSV' }
  };

  const t = translations[lang] || translations.de;

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Amount", "Category", "Description"];
    const turnoverRows = turnovers.map(to => [to.date, "Turnover", to.total, "Revenue", `Cash: ${to.cash}, Card: ${to.creditCard}`]);
    const expenseRows = expenses.map(ex => [ex.date, "Expense", ex.amount, ex.category, ex.description]);
    
    const csvContent = [headers, ...turnoverRows, ...expenseRows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pastillo_Finance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h2 className="text-xl font-black text-white">{t.add}</h2>
          <button onClick={() => setShowEntry(false)} className="p-2 bg-white/5 rounded-full"><X size={16}/></button>
        </div>
        <EntryForm lang={lang} onSave={() => setShowEntry(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 rounded-[2.5rem] p-8 relative shadow-xl">
        <div className="relative z-10">
          <p className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t.net}</p>
          <h2 className="text-5xl font-black text-black tracking-tighter">€{todayStats.net.toLocaleString()}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-black/5 rounded-[1.8rem] p-4 border border-black/5">
              <div className="flex items-center gap-2 text-black/60 mb-1">
                <TrendingUp size={14} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">{t.income}</span>
              </div>
              <p className="text-xl font-black text-black">€{todayStats.income.toLocaleString()}</p>
            </div>
            <div className="bg-black/5 rounded-[1.8rem] p-4 border border-black/5">
              <div className="flex items-center gap-2 text-black/60 mb-1">
                <TrendingDown size={14} strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">{t.expense}</span>
              </div>
              <p className="text-xl font-black text-black">€{todayStats.expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setShowEntry(true)} className="flex-[2] bg-primary text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
          {t.add}
        </button>
        <button onClick={handleExportCSV} className="flex-1 bg-white/5 border border-white/10 text-white/40 py-4 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
          <FileSpreadsheet size={20} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="glass p-4 rounded-[1.8rem] border border-white/5 flex flex-col items-center text-center">
          <div className="p-2 bg-orange-500/20 rounded-xl w-fit mb-2 text-orange-500"><Wallet size={18} /></div>
          <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">{t.cash}</p>
          <p className="text-sm font-black text-white">€{todayStats.cash.toLocaleString()}</p>
        </div>
        <div className="glass p-4 rounded-[1.8rem] border border-white/5 flex flex-col items-center text-center">
          <div className="p-2 bg-orange-400/20 rounded-xl w-fit mb-2 text-orange-400"><ShoppingBag size={18} /></div>
          <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">Lieferando</p>
          <p className="text-sm font-black text-orange-400">€{todayStats.lieferando.toLocaleString()}</p>
        </div>
        <div className="glass p-4 rounded-[1.8rem] border border-white/5 flex flex-col items-center text-center">
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
