'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';

interface TransactionItem {
    id: number;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    notes?: string;
}

interface DayData {
    date: string;
    dateObj: Date;
    transactions: TransactionItem[];
    total_income: number;
    total_expense: number;
}

interface ArchiveModalProps {
    show: boolean;
    dayData: DayData | null;
    categories: { slug: string; name: string; icon: string }[];
    onClose: () => void;
    onEdit: (trx: TransactionItem) => void;
    onDelete: (id: number) => void;
    currencySymbol?: string;
    currencyLocale?: string;
    activeCurrency?: string;
}

export default function ArchiveModal({
    show,
    dayData,
    categories,
    onClose,
    onEdit,
    onDelete,
    currencyLocale = 'id-ID',
    activeCurrency = 'IDR'
}: ArchiveModalProps) {
    const t = useTranslations();
    const locale = useLocale();

    if (!show || !dayData) return null;

    const loc = locale === 'id' ? 'id-ID' : 'en-US';
    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    const getCat = (slug: string) => {
        const found = categories.find(c => c.slug === slug);
        return found || { name: slug, icon: '📦' };
    };

    const formattedDate = dayData.dateObj.toLocaleDateString(loc, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Body — 1:1 from ArchiveModal.vue line 54 */}
            <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl dark:shadow-none border border-transparent dark:border-slate-800 transition-all duration-500 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header — 1:1 from ArchiveModal.vue line 57 */}
                <div className="bg-indigo-600 dark:bg-indigo-700 px-6 py-5 relative overflow-hidden text-white transition-colors duration-500">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <span className="text-indigo-200 text-[10px] font-bold tracking-wider">
                                {t('daily_detail') || 'Detail Transaksi Harian'}
                            </span>
                            <h3 className="text-xl font-black mt-0.5 capitalize">{formattedDate}</h3>
                        </div>
                        <button onClick={onClose} className="bg-white/10 dark:bg-black/20 hover:bg-white/20 p-1.5 rounded-lg transition-all duration-300 font-bold">
                            ✕
                        </button>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 flex-1">
                            <span className="text-[10px] text-indigo-100 block font-bold">
                                {t('income') || 'Pemasukan'}
                            </span>
                            <span className="text-sm font-bold text-emerald-300">+ {formatMoney(dayData.total_income)}</span>
                        </div>
                        <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 flex-1">
                            <span className="text-[10px] text-indigo-100 block font-bold">
                                {t('expense') || 'Pengeluaran'}
                            </span>
                            <span className="text-sm font-bold text-rose-300">- {formatMoney(dayData.total_expense)}</span>
                        </div>
                    </div>
                </div>

                {/* List Body — 1:1 from ArchiveModal.vue line 79 */}
                <div className="p-0 bg-slate-50 dark:bg-slate-950 max-h-[60vh] overflow-y-auto custom-scrollbar transition-colors duration-500">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {dayData.transactions.map(trx => {
                            const cat = getCat(trx.category);
                            return (
                                <div key={trx.id} className="bg-white dark:bg-slate-900 p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-indigo-500/5 transition group transition-colors duration-500">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 bg-slate-100 dark:bg-slate-800">
                                        {cat.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate transition-colors duration-500">
                                            {trx.title}
                                        </p>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded capitalize transition-colors duration-500">
                                            {cat.name}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <p className={`font-bold text-sm font-mono mb-1 transition-colors duration-500 ${trx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                                            {trx.type === 'income' ? '+' : '-'} {formatMoney(trx.amount)}
                                        </p>
                                        <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { onClose(); onEdit(trx); }} 
                                                className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 hover:underline"
                                            >
                                                {t('edit') || 'Edit'}
                                            </button>
                                            <button 
                                                onClick={() => { onDelete(trx.id); onClose(); }} 
                                                className="text-[10px] font-bold text-rose-400 dark:text-rose-500 hover:text-rose-600 dark:hover:text-rose-400"
                                            >
                                                {t('delete') || 'Hapus'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div></ModalPortal>
    );
}
