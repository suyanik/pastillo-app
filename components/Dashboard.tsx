import React, { useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Wallet, CreditCard, ArrowRight,
  Receipt, ShoppingBag, FileSpreadsheet, X
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

  const translations: Record<Language, Record<string, string>> = {
    tr: { net: 'Bugünkü Net Kasa', income: 'Gelir', expense: 'Gider', cash: 'Nakit', card: 'Kredi Kartı', lieferando: 'Lieferando', recent: 'Son Harcamalar', all: 'TÜMÜ', add: 'İŞLEM EKLE', export: 'CSV AKTAR' },
    de: { net: 'Netto-Kasse Heute', income: 'Einnahmen', expense: 'Ausgaben', cash: 'Bargeld', card: 'Kreditkarte', lieferando: 'Lieferando', recent: 'Letzte Ausgaben', all: 'ALLE', add: 'BUCHUNG ERFASSEN', export: 'CSV EXPORT' },
    en: { net: 'Today\'s Net Cash', income: 'Income', expense: 'Expenses', cash: 'Cash', card: 'Credit Card', lieferando: 'Lieferando', recent: 'Recent Expenses', all: 'ALL', add: 'NEW ENTRY', export: 'EXPORT CSV' },
    es: { net: 'Caja Neta Hoy', income: 'Ingresos', expense: 'Gastos', cash: 'Efectivo', card: 'Tarjeta', lieferando: 'Lieferando', recent: 'Gastos Recientes', all: 'TODO', add: 'NUEVA ENTRADA', export: 'EXPORTAR CSV' }
  };

  const t = translations[lang] || translations.de;

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Amount", "Category", "Description"];
    const turnoverRows = turnovers.map((to: DailyTurnover) => [to.date, "Turnover", to.total, "Revenue", `Cash: ${to.cash}, Card: ${to.creditCard}`]);
    const expenseRows = expenses.map((ex: Expense) => [ex.date, "Expense", ex.amount, ex.category, ex.description]);

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
    const turn = turnovers.find((t: DailyTurnover) => t.date === todayStr) || { cash: 0, creditCard: 0, lieferando: 0, total: 0 };
    const todayExps = expenses.filter((e: Expense) => e.date === todayStr).reduce((sum: number, e: Expense) => sum + e.amount, 0);
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
          <h2 className="text-xl font-bold text-gray-900">{t.add}</h2>
          <button onClick={() => setShowEntry(false)} className="p-3 bg-primary/20 border-2 border-primary hover:bg-primary/30 transition-colors cut-corners">
            <X size={24} className="text-primary" />
          </button>
        </div>
        <EntryForm lang={lang} onSave={() => setShowEntry(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Main Card - Cut Corners Style */}
      <div className="relative p-[2px] bg-primary cut-corners-lg">
        <div className="bg-white cut-corners-lg p-8 relative">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{t.net}</p>
          <h2 className="text-5xl font-bold text-gray-900 tracking-tighter">€{todayStats.net.toLocaleString()}</h2>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 p-4 cut-corners">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <TrendingUp size={14} strokeWidth={3} className="text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.income}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">€{todayStats.income.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 cut-corners">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <TrendingDown size={14} strokeWidth={3} className="text-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.expense}</span>
              </div>
              <p className="text-xl font-bold text-gray-900">€{todayStats.expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowEntry(true)}
          className="flex-[2] bg-primary text-gray-900 py-4 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-primary-hover hover:shadow-neon cut-corners"
        >
          {t.add}
        </button>
        <button
          onClick={handleExportCSV}
          className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-4 flex items-center justify-center hover:border-primary transition-all cut-corners"
        >
          <FileSpreadsheet size={20} />
        </button>
      </div>

      {/* Payment Type Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border-2 border-gray-200 p-4 flex flex-col items-center text-center cut-corners">
          <div className="p-2 bg-orange-100 text-orange-500 mb-2">
            <Wallet size={18} />
          </div>
          <p className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">{t.cash}</p>
          <p className="text-sm font-bold text-gray-900">€{todayStats.cash.toLocaleString()}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 p-4 flex flex-col items-center text-center cut-corners">
          <div className="p-2 bg-orange-100 text-orange-500 mb-2">
            <ShoppingBag size={18} />
          </div>
          <p className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">Lieferando</p>
          <p className="text-sm font-bold text-orange-500">€{todayStats.lieferando.toLocaleString()}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 p-4 flex flex-col items-center text-center cut-corners">
          <div className="p-2 bg-blue-100 text-blue-500 mb-2">
            <CreditCard size={18} />
          </div>
          <p className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">{t.card}</p>
          <p className="text-sm font-bold text-gray-900">€{todayStats.card.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{t.recent}</h3>
          <button className="text-primary text-[10px] font-bold flex items-center gap-1 hover:text-primary-hover transition-colors">
            {t.all} <ArrowRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {expenses.slice(0, 5).map((item: Expense, i: number) => (
            <div key={i} className="bg-white border-2 border-gray-200 p-5 flex items-center justify-between cut-corners">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-400 cut-corners">
                  <Receipt size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 tracking-tight">{item.description}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{item.category} • {item.date}</p>
                </div>
              </div>
              <p className="font-bold text-red-500">€{item.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
