'use client';

import React, { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { Link, useRouter } from '@/i18n/routing';
import {
    TrendingUp,
    ArrowRight,
    Download,
    ChevronRight,
    ChevronLeft,
    Wallet,
    PiggyBank,
    LineChart as LineChartIcon,
    ShieldCheck,
    Sparkles,
    Calendar,
    Award,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    FileSpreadsheet
} from 'lucide-react';
import YearlyCashflowChart from './YearlyCashflowChart';

interface YearlyStat {
    month: string;
    total_income: number;
    total_expense: number;
    income_target: number;
    balance: number;
}

export default function FinanceDashboardClient({ 
    selectedYear = new Date().getFullYear(),
    yearlyStats, 
    totalSavings = 0,
    totalAssetsValue = 0,
    currentBalance = 0, 
    avgExpense = 0 
}: { 
    selectedYear?: number;
    yearlyStats: YearlyStat[]; 
    totalSavings?: number;
    totalAssetsValue?: number;
    currentBalance?: number; 
    avgExpense?: number; 
}) {
    const locale = useLocale();
    const router = useRouter();
    const isIndo = locale === 'id';

    const [isExporting, setIsExporting] = useState(false);

    // Total Liquid Net Worth (Cash + Savings Vaults + Investment Assets)
    const totalNetWorth = currentBalance + totalSavings + totalAssetsValue;
    const liquidBuffer = currentBalance + totalSavings;
    const runwayMonths = avgExpense > 0 ? (liquidBuffer / avgExpense).toFixed(1) : '∞';

    // Yearly Aggregates
    const ytdIncome = useMemo(() => yearlyStats.reduce((s, m) => s + m.total_income, 0), [yearlyStats]);
    const ytdExpense = useMemo(() => yearlyStats.reduce((s, m) => s + m.total_expense, 0), [yearlyStats]);
    const ytdSurplus = ytdIncome - ytdExpense;
    const savingsRate = ytdIncome > 0 ? Math.max(0, Math.round((ytdSurplus / ytdIncome) * 100)) : 0;

    // Smart Highlights
    const { highestSurplusMonth, highestExpenseMonth } = useMemo(() => {
        let maxSurplus = -Infinity;
        let bestMonth = yearlyStats[0];
        let maxExpense = -Infinity;
        let worstMonth = yearlyStats[0];

        yearlyStats.forEach(m => {
            if (m.balance > maxSurplus && m.total_income > 0) {
                maxSurplus = m.balance;
                bestMonth = m;
            }
            if (m.total_expense > maxExpense && m.total_expense > 0) {
                maxExpense = m.total_expense;
                worstMonth = m;
            }
        });

        return {
            highestSurplusMonth: bestMonth,
            highestExpenseMonth: worstMonth
        };
    }, [yearlyStats]);

    const getMonthName = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
    };

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: locale === 'id' ? 'IDR' : 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    // Year Navigation
    const handleYearChange = (delta: number) => {
        const nextYear = selectedYear + delta;
        router.push(`/finance/dashboard?year=${nextYear}`);
    };

    // Export to CSV Function
    const handleExportCSV = () => {
        setIsExporting(true);
        try {
            const headers = ['Bulan', 'Pemasukan', 'Target_Pemasukan', 'Pengeluaran', 'Net_Surplus'];
            const rows = yearlyStats.map(s => [
                s.month,
                s.total_income,
                s.income_target,
                s.total_expense,
                s.balance
            ]);

            const csvContent = 'data:text/csv;charset=utf-8,' 
                + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `Laporan_Finansial_Tranvas_${selectedYear}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('Export CSV failed', e);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-500 pb-28 relative overflow-hidden">
                
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-50/40 to-transparent dark:from-indigo-950/20 dark:to-transparent pointer-events-none z-0"></div>
                <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
                <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none z-0"></div>

                {/* Topbar */}
                <div className="relative z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b shadow-sm dark:shadow-none border-slate-200/50 dark:border-slate-800/50 sticky top-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 max-w-[1700px] mx-auto">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
                                <Wallet size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                    <span>{isIndo ? 'Finance Overview' : 'Wealth & Finance Dashboard'}</span>
                                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 font-mono">
                                        {selectedYear}
                                    </span>
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-medium text-xs md:text-sm">
                                    {isIndo ? 'Kompilasi kesehatan kekayaan, runway & arus kas tahunan.' : 'Annual net worth, runway & cashflow intelligence.'}
                                </p>
                            </div>
                        </div>

                        {/* Top Action Controls */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                            
                            {/* Year Switcher */}
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                                <button 
                                    onClick={() => handleYearChange(-1)} 
                                    className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition shadow-sm"
                                    title="Tahun Sebelumnya"
                                >
                                    <ChevronLeft size={16} strokeWidth={2.5} />
                                </button>
                                <span className="font-black text-xs md:text-sm px-2 text-slate-800 dark:text-white font-mono">
                                    {selectedYear}
                                </span>
                                <button 
                                    onClick={() => handleYearChange(1)} 
                                    className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition shadow-sm"
                                    title="Tahun Berikutnya"
                                >
                                    <ChevronRight size={16} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Export CSV Button */}
                            <button 
                                onClick={handleExportCSV}
                                disabled={isExporting}
                                className="shrink-0 flex items-center justify-center px-4 h-11 transition border bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs shadow-sm active:scale-95"
                                title="Download CSV spreadsheet"
                            >
                                <FileSpreadsheet size={16} className="text-emerald-500" />
                                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                            </button>

                            {/* Back to Monthly Detail Button */}
                            <Link 
                                href="/finance" 
                                className="shrink-0 flex items-center justify-center px-5 h-11 transition bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl gap-2 hover:opacity-95 font-bold text-xs shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                <span>{isIndo ? 'Kelola Bulanan' : 'Monthly Detail'}</span>
                                <ArrowRight size={15} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Workspace */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto relative z-10">
                    
                    {/* 4 Top Executive KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        
                        {/* Card 1: Total Liquid Net Worth */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {isIndo ? 'Total Kekayaan Likuid' : 'Liquid Net Worth'}
                                </span>
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Wallet size={20} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {formatMoney(totalNetWorth)}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>{isIndo ? 'Kas + Tabungan + Aset' : 'Cash + Vaults + Assets'}</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatMoney(currentBalance)} Kas</span>
                            </div>
                        </div>

                        {/* Card 2: Annual Savings Rate */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {isIndo ? 'Tingkat Tabungan (YTD)' : 'Savings Rate (YTD)'}
                                </span>
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Award size={20} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {savingsRate}%
                                </span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    {savingsRate >= 50 ? (isIndo ? '🔥 Juara Finansial' : '🔥 Elite Saver') : savingsRate >= 20 ? (isIndo ? '✨ Sehat' : '✨ Healthy') : (isIndo ? '⚠️ Perlu Evaluasi' : '⚠️ Low Buffer')}
                                </span>
                            </div>
                            <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${Math.min(savingsRate, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Card 3: Financial Runway Calculator */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-purple-500/5 hover:border-purple-300 dark:hover:border-purple-700/50 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {isIndo ? 'Ketahanan Dana (Runway)' : 'Financial Runway'}
                                </span>
                                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={20} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {runwayMonths}
                                </span>
                                <span className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                    {isIndo ? 'Bulan' : 'Months'}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>{isIndo ? 'Burn rate 3 bulan:' : '3-mo avg burn:'}</span>
                                <span className="font-bold text-slate-600 dark:text-slate-300 font-mono">{formatMoney(avgExpense)}/bln</span>
                            </div>
                        </div>

                        {/* Card 4: YTD Net Surplus & Cashflow */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-amber-500/5 hover:border-amber-300 dark:hover:border-amber-700/50 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {isIndo ? 'Surplus Bersih Tahunan' : 'YTD Net Cashflow'}
                                </span>
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp size={20} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className={`text-2xl md:text-3xl font-black tracking-tight ${ytdSurplus >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
                                {formatMoney(ytdSurplus)}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                                    <ArrowUpRight size={13} /> {formatMoney(ytdIncome)}
                                </span>
                                <span className="text-rose-500 font-bold flex items-center gap-0.5">
                                    <ArrowDownRight size={13} /> {formatMoney(ytdExpense)}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Interactive Yearly Cashflow Dynamics Chart */}
                    <YearlyCashflowChart
                        yearlyStats={yearlyStats}
                        activeCurrency={locale === 'id' ? 'IDR' : 'USD'}
                        currencyLocale={locale === 'id' ? 'id-ID' : 'en-US'}
                    />

                    {/* Smart Financial Highlights Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        
                        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 p-5 rounded-3xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                                <Sparkles size={20} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1">
                                    {isIndo ? 'Bulan Paling Hemat / Surplus Tertinggi' : 'Highest Surplus Month'}
                                </h4>
                                <p className="text-base font-black text-slate-900 dark:text-white capitalize">
                                    {highestSurplusMonth ? getMonthName(highestSurplusMonth.month) : '-'}
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">
                                    +{formatMoney(highestSurplusMonth?.balance || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 p-5 rounded-3xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                                <AlertCircle size={20} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-1">
                                    {isIndo ? 'Bulan Paling Boros / Beban Tertinggi' : 'Highest Expense Month'}
                                </h4>
                                <p className="text-base font-black text-slate-900 dark:text-white capitalize">
                                    {highestExpenseMonth ? getMonthName(highestExpenseMonth.month) : '-'}
                                </p>
                                <p className="text-xs text-rose-600 dark:text-rose-400 font-mono font-bold mt-1">
                                    -{formatMoney(highestExpenseMonth?.total_expense || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/30 p-5 rounded-3xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                                <PiggyBank size={20} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300 mb-1">
                                    {isIndo ? 'Total Celengan Impian (Vaults)' : 'Total Savings Vaults'}
                                </h4>
                                <p className="text-base font-black text-slate-900 dark:text-white">
                                    {formatMoney(totalSavings)}
                                </p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                                    {isIndo ? 'Disimpan aman untuk target masa depan' : 'Safely allocated for future targets'}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* 12 Months Grid Breakdown */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {isIndo ? `Rincian 12 Bulan (${selectedYear})` : `12 Months Breakdown (${selectedYear})`}
                            </h3>
                            <span className="text-xs text-slate-400 font-medium">
                                {isIndo ? 'Klik kartu untuk melihat transaksi harian' : 'Click card to view daily transactions'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {yearlyStats.map((stat) => (
                                <div 
                                    key={stat.month} 
                                    className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-5 md:p-6 border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-50/40 group-hover:to-transparent dark:group-hover:from-indigo-900/10 dark:group-hover:to-transparent transition-colors duration-500 pointer-events-none"></div>

                                    <div className="relative z-10 flex items-center justify-between mb-5">
                                        <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white capitalize tracking-tight">
                                            {getMonthName(stat.month)}
                                        </h3>
                                        <Link 
                                            href={`/finance?month=${stat.month}`} 
                                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all shadow-sm"
                                            title="Buka Transaksi Bulan Ini"
                                        >
                                            <ChevronRight size={16} strokeWidth={3} />
                                        </Link>
                                    </div>

                                    <div className="space-y-3 mb-5 relative z-10">
                                        <div>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                                <span className="uppercase tracking-widest">{isIndo ? 'Pemasukan' : 'Income'}</span>
                                                <span className="text-emerald-500 dark:text-emerald-400 font-mono">{formatMoney(stat.total_income)}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-700 ease-out" 
                                                    style={{ width: `${Math.min((stat.total_income / Math.max(stat.income_target, 1)) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                                <span className="uppercase tracking-widest">{isIndo ? 'Pengeluaran' : 'Expense'}</span>
                                                <span className="text-rose-500 dark:text-rose-400 font-mono">{formatMoney(stat.total_expense)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {isIndo ? 'Net Surplus' : 'Net Balance'}
                                            </span>
                                            <span className={`text-sm md:text-base font-black font-mono ${stat.balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
                                                {formatMoney(stat.balance)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/finance?month=${stat.month}`}
                                        className="relative z-10 block w-full py-2.5 text-center rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 text-[11px] font-black uppercase tracking-wider hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                                    >
                                        {stat.income_target > 0 ? (isIndo ? 'Target: ' + formatMoney(stat.income_target) : 'Target: ' + formatMoney(stat.income_target)) : (isIndo ? 'Lihat Detail Kas' : 'View Cashflow')}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
