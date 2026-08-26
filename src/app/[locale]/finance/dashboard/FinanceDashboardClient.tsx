'use client';

import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { Link } from '@/i18n/routing';
import {
    TrendingUp,
    ArrowRight,
    Download,
    FileText,
    ChevronRight,
    Wallet
} from 'lucide-react';

interface YearlyStat {
    month: string;
    total_income: number;
    total_expense: number;
    income_target: number;
    balance: number;
}

export default function FinanceDashboardClient({ 
    yearlyStats, 
    totalSavings, 
    currentBalance, 
    avgExpense 
}: { 
    yearlyStats: YearlyStat[], 
    totalSavings: number, 
    currentBalance: number, 
    avgExpense: number 
}) {
    const locale = useLocale();

    const totalFunds = totalSavings + currentBalance;
    const runwayMonths = avgExpense > 0 ? (totalFunds / avgExpense).toFixed(1) : '∞';

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

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-500">
                {/* Topbar */}
                <div className="relative z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b shadow-sm dark:shadow-none border-slate-200/50 dark:border-slate-800/50 sticky top-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Wallet size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Finance Overview</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-medium text-xs md:text-sm">Ringkasan kesehatan finansial tahunanmu.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            <button className="shrink-0 flex items-center justify-center px-4 h-11 md:h-12 transition border bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 font-bold text-[11px] tracking-tight">
                                <Download size={16} strokeWidth={2.5} />
                                <span className="hidden md:inline">Export Excel</span>
                            </button>
                            <button className="shrink-0 flex items-center justify-center px-4 h-11 md:h-12 transition border bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold text-[11px] tracking-tight">
                                <FileText size={16} strokeWidth={2.5} />
                                <span className="hidden md:inline">Laporan Pajak (PDF)</span>
                            </button>
                            <Link href="/finance" className="shrink-0 flex items-center justify-center px-5 h-11 md:h-12 transition border bg-indigo-600 border-indigo-600 text-white rounded-xl gap-2 hover:bg-indigo-700 hover:border-indigo-700 font-bold text-[11px] tracking-tight shadow-lg shadow-indigo-200 dark:shadow-none">
                                Detail Bulanan
                                <ArrowRight size={16} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
                    
                    {/* Runway Calculator Widget */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-500 group">
                        <div className="absolute -right-10 -top-10 opacity-[0.03] dark:opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <TrendingUp size={300} strokeWidth={1} />
                        </div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <TrendingUp size={14} /> Runway Analysis
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">Kalkulasi Ketahanan Dana</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                                    Total gabungan saldo kas saat ini dengan seluruh saldo tabungan (Savings) Anda, dibagi rata-rata pengeluaran 3 bulan terakhir.
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[1.5rem] p-6 md:p-8 shadow-xl shadow-indigo-500/30 lg:min-w-[380px] flex flex-col gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-indigo-200/80 text-[10px] md:text-xs uppercase font-black tracking-widest mb-1.5">Total Dana Gabungan</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl md:text-4xl font-black tracking-tight">{formatMoney(totalFunds)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-indigo-200/80 text-[10px] md:text-xs uppercase font-black tracking-widest mb-1.5">Rata-rata Pengeluaran</p>
                                        <span className="text-lg md:text-xl font-bold">{formatMoney(avgExpense)}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/20 relative z-10 flex items-center justify-between">
                                    <span className="text-indigo-100 font-medium">Estimasi Bertahan</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-black text-white">{runwayMonths}</span>
                                        <span className="text-indigo-200 font-bold uppercase tracking-widest text-[10px]">Bulan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 12 Months Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {yearlyStats.map((stat, idx) => (
                            <div key={stat.month} className="group bg-white dark:bg-slate-900 rounded-[1.5rem] p-5 md:p-6 border border-slate-200/60 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-50/50 group-hover:to-transparent dark:group-hover:from-indigo-900/10 dark:group-hover:to-transparent transition-colors duration-500"></div>

                                <div className="relative z-10 flex items-center justify-between mb-6">
                                    <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white capitalize tracking-tight">{getMonthName(stat.month)}</h3>
                                    <Link href={`/finance?month=${stat.month}`} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-400 transition-colors">
                                        <ChevronRight size={16} strokeWidth={3} />
                                    </Link>
                                </div>

                                <div className="space-y-4 mb-6 relative z-10">
                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                                            <span className="uppercase tracking-widest">Pemasukan</span>
                                            <span className="text-emerald-500 dark:text-emerald-400">{formatMoney(stat.total_income)}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((stat.total_income / Math.max(stat.income_target, 1)) * 100, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                            <span className="uppercase tracking-widest">Pengeluaran</span>
                                            <span className="text-rose-500 dark:text-rose-400">{formatMoney(stat.total_expense)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Balance</span>
                                            <span className={`text-sm md:text-base font-black ${stat.balance >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-500 dark:text-rose-400'}`}>
                                                {formatMoney(stat.balance)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button className="relative z-10 w-full py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                    {stat.income_target > 0 ? 'Target: ' + formatMoney(stat.income_target) : '+ Set Target Pemasukan'}
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
