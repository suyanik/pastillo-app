import React, { useMemo, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
    TrendingUp, TrendingDown, Calendar, PieChart as PieIcon,
    BarChart3, ArrowUpRight, ArrowDownRight, Wallet, Banknote, CreditCard, Users
} from 'lucide-react';
import { Language, DailyTurnover, Expense, Personnel, ChartDataPoint } from '../types';

interface Props {
    lang: Language;
    turnovers: DailyTurnover[];
    expenses: Expense[];
    personnel: Personnel[];
}

type PeriodType = 'week' | 'month' | 'year';

const AnalyticsDashboard: React.FC<Props> = ({ lang, turnovers, expenses, personnel }) => {
    const [period, setPeriod] = useState<PeriodType>('month');

    const translations: Record<Language, Record<string, string>> = {
        tr: {
            title: 'Finansal Analiz',
            week: 'Haftalık',
            month: 'Aylık',
            year: 'Yıllık',
            income: 'Gelir',
            expense: 'Gider',
            net: 'Net Kar',
            totalIncome: 'Toplam Ciro',
            totalExpense: 'Toplam Gider',
            netProfit: 'Net Kar',
            trend: 'Gelir Trendi',
            distribution: 'Gider Dağılımı',
            comparison: 'Karşılaştırma',
            personnelCost: 'Personel Maliyeti',
            salary: 'Maaş',
            advance: 'Avans',
            vsLastPeriod: 'Geçen döneme göre'
        },
        de: {
            title: 'Finanzanalyse',
            week: 'Woche',
            month: 'Monat',
            year: 'Jahr',
            income: 'Einnahmen',
            expense: 'Ausgaben',
            net: 'Nettogewinn',
            totalIncome: 'Gesamtumsatz',
            totalExpense: 'Gesamtausgaben',
            netProfit: 'Nettogewinn',
            trend: 'Umsatztrend',
            distribution: 'Kostenverteilung',
            comparison: 'Vergleich',
            personnelCost: 'Personalkosten',
            salary: 'Gehalt',
            advance: 'Vorschuss',
            vsLastPeriod: 'Im Vergleich zum Vorjahr'
        },
        en: {
            title: 'Financial Analysis',
            week: 'Weekly',
            month: 'Monthly',
            year: 'Yearly',
            income: 'Income',
            expense: 'Expenses',
            net: 'Net Profit',
            totalIncome: 'Total Revenue',
            totalExpense: 'Total Expenses',
            netProfit: 'Net Profit',
            trend: 'Revenue Trend',
            distribution: 'Expense Distribution',
            comparison: 'Comparison',
            personnelCost: 'Personnel Cost',
            salary: 'Salary',
            advance: 'Advance',
            vsLastPeriod: 'vs last period'
        },
        es: {
            title: 'Análisis Financiero',
            week: 'Semanal',
            month: 'Mensual',
            year: 'Anual',
            income: 'Ingresos',
            expense: 'Gastos',
            net: 'Beneficio Neto',
            totalIncome: 'Ingresos Totales',
            totalExpense: 'Gastos Totales',
            netProfit: 'Beneficio Neto',
            trend: 'Tendencia de Ingresos',
            distribution: 'Distribución de Gastos',
            comparison: 'Comparación',
            personnelCost: 'Costo de Personal',
            salary: 'Salario',
            advance: 'Anticipo',
            vsLastPeriod: 'vs periodo anterior'
        }
    };

    const t = translations[lang] || translations.de;

    // Calculate date range based on period
    const getDateRange = (p: PeriodType) => {
        const now = new Date();
        const end = now.toISOString().split('T')[0];
        let start: string;

        switch (p) {
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                start = weekAgo.toISOString().split('T')[0];
                break;
            case 'month':
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                start = monthAgo.toISOString().split('T')[0];
                break;
            case 'year':
                const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                start = yearAgo.toISOString().split('T')[0];
                break;
        }
        return { start, end };
    };

    // Chart data calculation
    const chartData = useMemo((): ChartDataPoint[] => {
        const range = getDateRange(period);
        const filtered = turnovers.filter(t => t.date >= range.start && t.date <= range.end);

        return filtered.map(turn => {
            const dayExpenses = expenses
                .filter(e => e.date === turn.date)
                .reduce((sum, e) => sum + e.amount, 0);

            return {
                date: turn.date,
                label: new Date(turn.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'de-DE', {
                    day: '2-digit',
                    month: 'short'
                }),
                income: turn.total,
                expense: dayExpenses,
                net: turn.total - dayExpenses
            };
        }).reverse();
    }, [turnovers, expenses, period, lang]);

    // Summary statistics
    const stats = useMemo(() => {
        const range = getDateRange(period);
        const periodTurnovers = turnovers.filter(t => t.date >= range.start && t.date <= range.end);
        const periodExpenses = expenses.filter(e => e.date >= range.start && e.date <= range.end);

        const totalIncome = periodTurnovers.reduce((sum, t) => sum + t.total, 0);
        const totalExpense = periodExpenses.reduce((sum, e) => sum + e.amount, 0);

        return {
            totalIncome,
            totalExpense,
            net: totalIncome - totalExpense,
            avgDaily: periodTurnovers.length > 0 ? totalIncome / periodTurnovers.length : 0
        };
    }, [turnovers, expenses, period]);

    // Expense distribution by category
    const expenseDistribution = useMemo(() => {
        const range = getDateRange(period);
        const periodExpenses = expenses.filter(e => e.date >= range.start && e.date <= range.end);

        const byCategory: Record<string, number> = {};
        periodExpenses.forEach(e => {
            byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
        });

        return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
    }, [expenses, period]);

    // Personnel costs
    const personnelStats = useMemo(() => {
        let totalSalary = 0;
        let totalAdvance = 0;

        personnel.forEach(p => {
            totalSalary += p.baseSalary;
            p.payments?.forEach(payment => {
                if (payment.type === 'advance') {
                    totalAdvance += payment.amount;
                }
            });
        });

        // Count personnel with salary
        const personnelWithSalary = personnel.filter(p => p.baseSalary > 0).length;
        // Count advance requests
        let advanceCount = 0;
        personnel.forEach(p => {
            p.payments?.forEach(payment => {
                if (payment.type === 'advance') {
                    advanceCount++;
                }
            });
        });

        return {
            totalSalary,
            totalAdvance,
            total: totalSalary + totalAdvance,
            personnelCount: personnelWithSalary,
            advanceCount
        };
    }, [personnel]);

    const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <BarChart3 className="text-primary" size={24} />
                    {t.title}
                </h2>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 bg-gray-100 p-1.5 border-2 border-gray-200 cut-corners">
                {(['week', 'month', 'year'] as PeriodType[]).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all cut-corners ${period === p ? 'bg-primary text-gray-900' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {t[p]}
                    </button>
                ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 border-2 border-gray-200 text-center cut-corners">
                    <div className="p-2 bg-green-500/20 rounded-xl w-fit mx-auto mb-2 text-green-500">
                        <TrendingUp size={18} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.totalIncome}</p>
                    <p className="text-lg font-black text-green-500">€{stats.totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 border-2 border-gray-200 text-center cut-corners">
                    <div className="p-2 bg-red-500/20 rounded-xl w-fit mx-auto mb-2 text-red-500">
                        <TrendingDown size={18} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.totalExpense}</p>
                    <p className="text-lg font-bold text-red-500">€{stats.totalExpense.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 border-2 border-gray-200 text-center cut-corners">
                    <div className={`p-2 rounded-xl w-fit mx-auto mb-2 ${stats.net >= 0 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                        <Wallet size={18} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.netProfit}</p>
                    <p className={`text-lg font-bold ${stats.net >= 0 ? 'text-primary' : 'text-red-500'}`}>
                        €{stats.net.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white p-6 border-2 border-gray-200 cut-corners-lg">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-primary" />
                    {t.trend}
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                            <XAxis
                                dataKey="label"
                                stroke="rgba(0,0,0,0.2)"
                                fontSize={10}
                                tick={{ fill: 'rgba(0,0,0,0.5)' }}
                            />
                            <YAxis
                                stroke="rgba(0,0,0,0.2)"
                                fontSize={10}
                                tick={{ fill: 'rgba(0,0,0,0.5)' }}
                                tickFormatter={(value) => `€${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    color: '#111'
                                }}
                                formatter={(value) => [`€${(value ?? 0).toLocaleString()}`, '']}
                            />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', strokeWidth: 0 }}
                                name={t.income}
                            />
                            <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ fill: '#ef4444', strokeWidth: 0 }}
                                name={t.expense}
                            />
                            <Line
                                type="monotone"
                                dataKey="net"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', strokeWidth: 0 }}
                                name={t.net}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Expense Distribution */}
            <div className="bg-white p-6 border-2 border-gray-200 cut-corners-lg">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <PieIcon size={14} className="text-primary" />
                    {t.distribution}
                </h3>
                <div className="h-64 flex items-center justify-center">
                    {expenseDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                                    labelLine={{ stroke: 'rgba(0,0,0,0.3)' }}
                                >
                                    {expenseDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        color: '#111'
                                    }}
                                    formatter={(value) => [`€${(value ?? 0).toLocaleString()}`, '']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-sm">No data available</p>
                    )}
                </div>
            </div>

            {/* Personnel Costs */}
            <div className="bg-white p-6 border-2 border-gray-200 cut-corners-lg">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Wallet size={14} className="text-primary" />
                    {t.personnelCost}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 border border-gray-200 p-4 text-center cut-corners relative overflow-hidden">
                        <div className="p-2 bg-blue-500/20 rounded-xl w-fit mx-auto mb-2 text-blue-500">
                            <Banknote size={18} />
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.salary}</p>
                        <p className="text-xl font-bold text-blue-500">€{personnelStats.totalSalary.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                            <Users size={10} /> {personnelStats.personnelCount} kişi
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/20">
                            <div className="h-full bg-blue-500" style={{ width: personnelStats.totalSalary > 0 ? '100%' : '0%' }}></div>
                        </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 text-center cut-corners relative overflow-hidden">
                        <div className="p-2 bg-orange-500/20 rounded-xl w-fit mx-auto mb-2 text-orange-500">
                            <CreditCard size={18} />
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.advance}</p>
                        <p className="text-xl font-bold text-orange-500">€{personnelStats.totalAdvance.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                            <ArrowUpRight size={10} /> {personnelStats.advanceCount} talep
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500/20">
                            <div className="h-full bg-orange-500" style={{ width: personnelStats.total > 0 ? `${(personnelStats.totalAdvance / personnelStats.total) * 100}%` : '0%' }}></div>
                        </div>
                    </div>
                    <div className="bg-primary/10 border-2 border-primary p-4 text-center cut-corners relative overflow-hidden">
                        <div className="p-2 bg-primary/20 rounded-xl w-fit mx-auto mb-2 text-primary">
                            <Wallet size={18} />
                        </div>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Total</p>
                        <p className="text-xl font-bold text-primary">€{personnelStats.total.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Aylık Toplam</p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
