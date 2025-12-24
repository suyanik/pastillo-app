import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    FileText, Download, Calendar, TrendingUp, TrendingDown,
    BarChart3, Clock, Users, Award
} from 'lucide-react';
import { Language, DailyTurnover, Expense, Reservation, Personnel } from '../types';

interface Props {
    lang: Language;
    turnovers: DailyTurnover[];
    expenses: Expense[];
    reservations: Reservation[];
    personnel: Personnel[];
}

type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';

const ReportGenerator: React.FC<Props> = ({ lang, turnovers, expenses, reservations, personnel }) => {
    const [period, setPeriod] = useState<ReportPeriod>('month');
    const [compareEnabled, setCompareEnabled] = useState(false);

    const translations: Record<Language, Record<string, string>> = {
        tr: {
            title: 'Rapor Oluştur',
            period: 'Dönem',
            week: 'Son 7 Gün',
            month: 'Bu Ay',
            quarter: 'Son 3 Ay',
            year: 'Bu Yıl',
            generate: 'PDF İndir',
            compare: 'Karşılaştır',
            totalRevenue: 'Toplam Ciro',
            totalExpense: 'Toplam Gider',
            netProfit: 'Net Kar',
            reservations: 'Rezervasyonlar',
            avgDaily: 'Günlük Ortalama',
            bestDay: 'En İyi Gün',
            bestHour: 'En Yoğun Saat',
            personnelCost: 'Personel Maliyeti'
        },
        de: {
            title: 'Bericht erstellen',
            period: 'Zeitraum',
            week: 'Letzte 7 Tage',
            month: 'Dieser Monat',
            quarter: 'Letztes Quartal',
            year: 'Dieses Jahr',
            generate: 'PDF herunterladen',
            compare: 'Vergleichen',
            totalRevenue: 'Gesamtumsatz',
            totalExpense: 'Gesamtausgaben',
            netProfit: 'Nettogewinn',
            reservations: 'Reservierungen',
            avgDaily: 'Tagesdurchschnitt',
            bestDay: 'Bester Tag',
            bestHour: 'Beste Stunde',
            personnelCost: 'Personalkosten'
        },
        en: {
            title: 'Generate Report',
            period: 'Period',
            week: 'Last 7 Days',
            month: 'This Month',
            quarter: 'Last Quarter',
            year: 'This Year',
            generate: 'Download PDF',
            compare: 'Compare',
            totalRevenue: 'Total Revenue',
            totalExpense: 'Total Expenses',
            netProfit: 'Net Profit',
            reservations: 'Reservations',
            avgDaily: 'Daily Average',
            bestDay: 'Best Day',
            bestHour: 'Peak Hour',
            personnelCost: 'Personnel Cost'
        },
        es: {
            title: 'Generar Informe',
            period: 'Período',
            week: 'Últimos 7 Días',
            month: 'Este Mes',
            quarter: 'Último Trimestre',
            year: 'Este Año',
            generate: 'Descargar PDF',
            compare: 'Comparar',
            totalRevenue: 'Ingresos Totales',
            totalExpense: 'Gastos Totales',
            netProfit: 'Beneficio Neto',
            reservations: 'Reservas',
            avgDaily: 'Promedio Diario',
            bestDay: 'Mejor Día',
            bestHour: 'Hora Pico',
            personnelCost: 'Costo de Personal'
        }
    };

    const t = translations[lang] || translations.de;

    // Calculate date range
    const getDateRange = (p: ReportPeriod, offset: number = 0) => {
        const now = new Date();
        let start: Date;
        let end: Date = new Date(now);

        switch (p) {
            case 'week':
                start = new Date(now.getTime() - (7 + offset * 7) * 24 * 60 * 60 * 1000);
                if (offset > 0) end = new Date(now.getTime() - offset * 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
                end = offset > 0 ? new Date(now.getFullYear(), now.getMonth() - offset + 1, 0) : now;
                break;
            case 'quarter':
                start = new Date(now.getFullYear(), now.getMonth() - 3 - offset * 3, 1);
                end = offset > 0 ? new Date(now.getFullYear(), now.getMonth() - offset * 3, 0) : now;
                break;
            case 'year':
                start = new Date(now.getFullYear() - offset, 0, 1);
                end = offset > 0 ? new Date(now.getFullYear() - offset, 11, 31) : now;
                break;
        }

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    };

    // Calculate stats for a period
    const calculateStats = (range: { start: string; end: string }) => {
        const periodTurnovers = turnovers.filter(t => t.date >= range.start && t.date <= range.end);
        const periodExpenses = expenses.filter(e => e.date >= range.start && e.date <= range.end);
        const periodReservations = reservations.filter(r => r.date >= range.start && r.date <= range.end);

        const totalRevenue = periodTurnovers.reduce((sum, t) => sum + t.total, 0);
        const totalExpense = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalGuests = periodReservations.reduce((sum, r) => sum + r.guests, 0);
        const personnelCost = personnel.reduce((sum, p) => sum + p.baseSalary, 0);

        // Best day calculation
        const dayTotals: Record<string, number> = {};
        periodTurnovers.forEach(t => {
            const day = new Date(t.date).toLocaleDateString('de-DE', { weekday: 'long' });
            dayTotals[day] = (dayTotals[day] || 0) + t.total;
        });
        const bestDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

        // Best hour calculation
        const hourCounts: Record<string, number> = {};
        periodReservations.forEach(r => {
            const hour = r.time.split(':')[0];
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        const bestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

        return {
            totalRevenue,
            totalExpense,
            netProfit: totalRevenue - totalExpense,
            reservationCount: periodReservations.length,
            guestCount: totalGuests,
            avgDaily: periodTurnovers.length > 0 ? totalRevenue / periodTurnovers.length : 0,
            bestDay,
            bestHour: bestHour !== '-' ? `${bestHour}:00` : '-',
            personnelCost,
            days: periodTurnovers.length
        };
    };

    const currentRange = getDateRange(period);
    const previousRange = getDateRange(period, 1);
    const stats = useMemo(() => calculateStats(currentRange), [turnovers, expenses, reservations, period]);
    const prevStats = useMemo(() => calculateStats(previousRange), [turnovers, expenses, reservations, period]);

    const getChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(24);
        doc.setTextColor(255, 193, 7); // Primary color
        doc.text('PASTILLO', 20, 25);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Restaurant & Bar - Finanzbericht', 20, 32);

        // Period
        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text(`Zeitraum: ${currentRange.start} bis ${currentRange.end}`, 20, 42);
        doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 20, 48);

        // Summary table
        const summaryData = [
            [t.totalRevenue, `€${stats.totalRevenue.toLocaleString()}`],
            [t.totalExpense, `€${stats.totalExpense.toLocaleString()}`],
            [t.netProfit, `€${stats.netProfit.toLocaleString()}`],
            [t.reservations, stats.reservationCount.toString()],
            [t.avgDaily, `€${stats.avgDaily.toFixed(2)}`],
            [t.bestDay, stats.bestDay],
            [t.bestHour, stats.bestHour],
            [t.personnelCost, `€${stats.personnelCost.toLocaleString()}`]
        ];

        autoTable(doc, {
            startY: 55,
            head: [['Kennzahl', 'Wert']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0] },
            styles: { fontSize: 10 }
        });

        // Daily breakdown
        const currentY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Tagesübersicht', 20, currentY);

        const dailyData = turnovers
            .filter(t => t.date >= currentRange.start && t.date <= currentRange.end)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 15) // Last 15 days
            .map(t => [
                new Date(t.date).toLocaleDateString('de-DE'),
                `€${t.cash.toLocaleString()}`,
                `€${t.creditCard.toLocaleString()}`,
                `€${(t.lieferando || 0).toLocaleString()}`,
                `€${t.total.toLocaleString()}`
            ]);

        autoTable(doc, {
            startY: currentY + 5,
            head: [['Datum', 'Bargeld', 'Karte', 'Lieferando', 'Gesamt']],
            body: dailyData,
            theme: 'striped',
            headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0] },
            styles: { fontSize: 9 }
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Pastillo Restaurant & Bar | Marktplatz 23, 35510 Butzbach | Tel: 06033 974 7771', pageWidth / 2, finalY, { align: 'center' });

        // Save
        doc.save(`Pastillo_Bericht_${currentRange.start}_${currentRange.end}.pdf`);
    };

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                    <FileText className="text-primary" size={24} />
                    {t.title}
                </h2>
            </div>

            {/* Period Selector */}
            <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.period}</p>
                <div className="flex gap-2 bg-gray-100 p-1.5 border-2 border-gray-200 cut-corners">
                    {(['week', 'month', 'quarter', 'year'] as ReportPeriod[]).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all cut-corners ${period === p ? 'bg-primary text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-5 border-2 border-gray-200 cut-corners">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-green-500" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.totalRevenue}</span>
                    </div>
                    <p className="text-2xl font-black text-green-500">€{stats.totalRevenue.toLocaleString()}</p>
                    {compareEnabled && (
                        <p className={`text-xs mt-1 ${getChange(stats.totalRevenue, prevStats.totalRevenue) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {getChange(stats.totalRevenue, prevStats.totalRevenue) >= 0 ? '+' : ''}{getChange(stats.totalRevenue, prevStats.totalRevenue).toFixed(1)}%
                        </p>
                    )}
                </div>

                <div className="bg-white p-5 border-2 border-gray-200 cut-corners">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown size={16} className="text-red-500" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.totalExpense}</span>
                    </div>
                    <p className="text-2xl font-black text-red-500">€{stats.totalExpense.toLocaleString()}</p>
                </div>

                <div className="bg-white p-5 border-2 border-gray-200 cut-corners">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 size={16} className="text-primary" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.netProfit}</span>
                    </div>
                    <p className={`text-2xl font-black ${stats.netProfit >= 0 ? 'text-primary' : 'text-red-500'}`}>
                        €{stats.netProfit.toLocaleString()}
                    </p>
                </div>

                <div className="bg-white p-5 border-2 border-gray-200 cut-corners">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-blue-400" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t.reservations}</span>
                    </div>
                    <p className="text-2xl font-black text-blue-400">{stats.reservationCount}</p>
                </div>
            </div>

            {/* Best Performance */}
            <div className="bg-white p-5 border-2 border-gray-200 space-y-4 cut-corners">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Award size={14} className="text-primary" />
                    Top Performans
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-gray-500 uppercase">{t.bestDay}</p>
                        <p className="text-lg font-bold text-gray-900">{stats.bestDay}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-gray-500 uppercase">{t.bestHour}</p>
                        <p className="text-lg font-bold text-gray-900">{stats.bestHour}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-gray-500 uppercase">{t.avgDaily}</p>
                        <p className="text-lg font-black text-primary">€{stats.avgDaily.toFixed(0)}</p>
                    </div>
                </div>
            </div>

            {/* Compare Toggle */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setCompareEnabled(!compareEnabled)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cut-corners ${compareEnabled ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    {t.compare}
                </button>
            </div>

            {/* Download Button */}
            <button
                onClick={generatePDF}
                className="w-full bg-primary text-gray-900 py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all hover:shadow-neon cut-corners"
            >
                <Download size={18} />
                {t.generate}
            </button>
        </div>
    );
};

export default ReportGenerator;
