'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import FinanceDatePicker from './FinanceDatePicker';
import ModalPortal from '@/components/ModalPortal';

export interface TransactionItem {
    id: number;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    notes?: string;
}

export interface DayStat {
    date: string;
    dateObj: Date;
    transactions: TransactionItem[];
    total_income: number;
    total_expense: number;
}

interface TransactionListProps {
    transactions: TransactionItem[];
    categories: { slug: string; name: string; icon: string; type: string }[];
    filterDate: string;
    setFilterDate: (d: string) => void;
    onOpenDayDetail: (day: DayStat) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function TransactionList({
    transactions,
    categories,
    filterDate,
    setFilterDate,
    onOpenDayDetail,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: TransactionListProps) {
    const t = useTranslations();
    const locale = useLocale();
    const loc = locale === 'id' ? 'id-ID' : 'en-US';

    // 1:1 from TransactionList.vue line 24 — state buat kontrol Popover Kalender
    const [showFilterPicker, setShowFilterPicker] = useState(false);

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString(loc, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Group transactions by day — 1:1 from Index.vue visibleStats logic (line 581)
    const dayStats: DayStat[] = useMemo(() => {
        const grouped: Record<string, TransactionItem[]> = {};
        const filtered = filterDate
            ? transactions.filter(tx => tx.date === filterDate)
            : transactions;

        filtered.forEach(tx => {
            if (!grouped[tx.date]) grouped[tx.date] = [];
            grouped[tx.date].push(tx);
        });

        const stats = Object.entries(grouped)
            .map(([date, txs]) => {
                const [y, m, d] = date.split('-').map(Number);
                return {
                    date,
                    dateObj: new Date(y, m - 1, d),
                    transactions: txs,
                    total_income: txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
                    total_expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
                };
            })
            .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

        return filterDate ? stats : stats.slice(0, 5);
    }, [transactions, filterDate]);

    return (
        <div className="space-y-4">
            {/* Header Row — 1:1 from TransactionList.vue line 29-74 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 lg:px-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-base lg:text-lg font-bold text-slate-800 dark:text-white transition-colors duration-500">
                        {t('daily_history') || 'Riwayat Harian'}
                    </h3>
                    {!filterDate ? (
                        <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            {t('last_5') || 'Last 5'}
                        </span>
                    ) : (
                        <span className="text-[9px] lg:text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">
                            {t('search_result') || 'Hasil Pencarian'}
                        </span>
                    )}
                </div>

                {/* Date Filter — 1:1 from TransactionList.vue line 41-73 (custom date picker, NOT native input!) */}
                <div className="relative z-20">
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterPicker(!showFilterPicker)}
                                className={`pl-3 pr-8 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-none hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:ring-2 hover:ring-indigo-500/10 transition-all flex items-center gap-2 min-w-[120px] lg:min-w-[150px] transition-colors duration-300 ${
                                    filterDate
                                        ? 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                                        : 'text-slate-500 dark:text-slate-400'
                                }`}
                            >
                                <span className="text-base">📅</span>
                                <span>{filterDate ? formatDateDisplay(filterDate) : (t('date_filter') || 'Filter Tanggal')}</span>
                            </button>

                            {/* Clear filter button — 1:1 from TransactionList.vue line 53-63 */}
                            {filterDate && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFilterDate(''); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-1 rounded-full transition-all"
                                    title="Hapus Filter"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* FinanceDatePicker popup — 1:1 from TransactionList.vue line 65-73 */}
                    {showFilterPicker && (
                        <ModalPortal><div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 " onClick={() => setShowFilterPicker(false)}></div>
                            <FinanceDatePicker
                                show={true}
                                modelValue={filterDate}
                                onUpdateModelValue={(val: string) => {
                                    setFilterDate(val);
                                    setShowFilterPicker(false);
                                }}
                                onClose={() => setShowFilterPicker(false)}
                                transactions={transactions}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                                className="relative z-10"
                            />
                        </div></ModalPortal>
                    )}
                </div>
            </div>

            {/* Empty State — 1:1 from TransactionList.vue line 76-79 */}
            {dayStats.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-500">
                    <div className="text-3xl mb-2">📒</div>
                    <p className="text-slate-400 dark:text-slate-600 text-sm font-medium transition-colors duration-500">
                        {t('no_transaction') || 'Belum ada transaksi'}
                    </p>
                </div>
            ) : (
                /* Day-Grouped List — 1:1 from TransactionList.vue line 81-118 */
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50 transition-colors duration-500">
                    {dayStats.map(day => {
                        const net = day.total_income - day.total_expense;
                        const monthAbbr = day.dateObj.toLocaleDateString(loc, { month: 'short' });
                        const dayNum = String(day.dateObj.getDate()).padStart(2, '0');
                        const weekday = day.dateObj.toLocaleDateString(loc, { weekday: 'long' });

                        return (
                            <div
                                key={day.date}
                                onClick={() => onOpenDayDetail(day)}
                                className="group p-4 flex items-center justify-between hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Day badge — 1:1 from TransactionList.vue line 87-90 */}
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-sm">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 leading-none">{monthAbbr}</span>
                                        <span className="text-xl font-black leading-none text-slate-700 dark:text-slate-200 mt-0.5 transition-colors duration-500">{dayNum}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 dark:text-white text-sm capitalize transition-colors duration-500">{weekday}</h4>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700 mt-1 inline-block transition-colors duration-500">
                                            {t('transaction_count', { count: day.transactions.length }) || `${day.transactions.length} Transaksi`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    {/* Daily Net — 1:1 from TransactionList.vue line 102-107 */}
                                    <div className="pl-4 border-l border-slate-100 dark:border-slate-800 text-right">
                                        <span className="block text-[9px] font-black text-slate-400 dark:text-slate-600 tracking-wider">
                                            {t('daily_net') || 'Daily Net'}
                                        </span>
                                        <span className={`text-sm font-black font-mono transition-colors duration-500 ${net >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-orange-500 dark:text-orange-400'}`}>
                                            {net >= 0 ? '+' : ''}{formatMoney(net)}
                                        </span>
                                    </div>
                                    {/* Chevron — 1:1 from TransactionList.vue line 108-112 */}
                                    <span className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Footer hint — 1:1 from TransactionList.vue line 116-118 */}
                    {!filterDate && dayStats.length === 5 && (
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-2.5 text-center border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-widest">
                                {t('old_data_hint') || 'Klik pada hari untuk melihat semua transaksi lama'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
