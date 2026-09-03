'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import FinanceDatePicker from './FinanceDatePicker';
import ModalPortal from '@/components/ModalPortal';
import { Trash2, Plus, X, Calendar, Sparkles } from 'lucide-react';

interface BatchRow {
    type: 'income' | 'expense';
    title: string;
    amount: string;
    category: string;
}

interface FinanceBatchModalProps {
    show: boolean;
    categories: { slug: string; name: string; icon: string; type: string }[];
    budgets?: any[];
    transactions?: any[];
    onClose: () => void;
    onSubmitBatch: (date: string, rows: BatchRow[]) => void;
    onSwitchToSingle?: () => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function FinanceBatchModal({
    show,
    categories,
    budgets = [],
    transactions = [],
    onClose,
    onSubmitBatch,
    onSwitchToSingle,
    activeCurrency = 'IDR'
}: FinanceBatchModalProps) {
    const t = useTranslations();
    const locale = useLocale();

    const todayStr = new Date().toISOString().split('T')[0];

    const [date, setDate] = useState<string>(todayStr);
    const [rows, setRows] = useState<BatchRow[]>([
        { type: 'expense', title: '', amount: '', category: '' },
        { type: 'expense', title: '', amount: '', category: '' }
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (show) {
            setDate(todayStr);
            setRows([
                { type: 'expense', title: '', amount: '', category: '' },
                { type: 'expense', title: '', amount: '', category: '' }
            ]);
        }
    }, [show, todayStr]);

    if (!show) return null;

    const currencySymbolMap: Record<string, string> = { IDR: 'Rp', USD: '$', GBP: '£', EUR: '€', JPY: '¥' };
    const currencySymbol = currencySymbolMap[activeCurrency] || 'Rp';
    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);

    const activeSlugs = new Set([
        ...budgets.map(b => b.category),
        ...transactions.map(t => t.category)
    ]);

    // For Batch Modal, we process available categories per row based on its type
    const getDisplayCategories = (type: 'income' | 'expense') => {
        const available = categories.filter(c => c.type === type);
        const active = available.filter(c => activeSlugs.has(c.slug));
        const rawDisplay = active.length === 0 ? available : active;
        return Array.from(new Map(rawDisplay.map(c => [c.slug, c])).values());
    };

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const str = val.toString();
        return isDotSeparator ? str.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleAmountChange = (index: number, rawValue: string) => {
        let cleanVal = isDotSeparator ? rawValue.replace(/\./g, '') : rawValue.replace(/,/g, '');
        if (!isNaN(Number(cleanVal))) {
            setRows(prev => prev.map((r, i) => i === index ? { ...r, amount: cleanVal } : r));
        }
    };

    const handleTypeChange = (index: number, type: 'income' | 'expense') => {
        setRows(prev => prev.map((r, i) => i === index ? { ...r, type, category: '' } : r));
    };

    const addRow = () => {
        setRows(prev => [...prev, { type: 'expense', title: '', amount: '', category: '' }]);
    };

    const removeRow = (index: number) => {
        if (rows.length > 1) {
            setRows(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validRows = rows.filter(r => Number(r.amount) > 0 && r.title.trim() !== '');
        if (validRows.length === 0) return;

        onSubmitBatch(date, validRows);
        onClose();
    };

    const dateDisplay = date ? new Date(date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '';

    return (
        // 1:1 from FinanceBatchModal.vue line 77-292
        <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 " onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300 border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-none animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header — 1:1 from FinanceBatchModal.vue line 138-177 */}
                <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 z-20 rounded-t-[2.5rem] transition-colors duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg dark:shadow-none shadow-indigo-100 dark:shadow-indigo-900/20">
                            ✨
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-1.5 transition-colors duration-500">
                                {t('batch_mode_title') || 'Mode Kolektif'}
                            </h2>
                            <div className="relative">
                                <button 
                                    type="button" 
                                    onClick={() => setShowDatePicker(!showDatePicker)} 
                                    className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/20 rounded-lg px-2.5 py-1 transition-all tracking-wider flex items-center gap-2"
                                >
                                    <span>{dateDisplay}</span>
                                    <span>📅</span>
                                </button>
                                {showDatePicker && (
                                    <ModalPortal><div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                                        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 " onClick={() => setShowDatePicker(false)}></div>
                                        <FinanceDatePicker 
                                            show={true} 
                                            modelValue={date}
                                            onUpdateModelValue={(val: string) => { setDate(val); setShowDatePicker(false); }}
                                            onClose={() => setShowDatePicker(false)}
                                            className="relative z-10"
                                        />
                                    </div></ModalPortal>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {onSwitchToSingle && (
                            <button 
                                onClick={onSwitchToSingle} 
                                type="button" 
                                className="hidden sm:flex text-[10px] font-bold tracking-wider px-4 py-2 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all active:scale-95 items-center gap-2"
                            >
                                <span>↩️</span> {t('btn_single_mode') || 'Mode Tunggal'}
                            </button>
                        )}
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-90 flex items-center justify-center font-bold">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body Form — 1:1 from FinanceBatchModal.vue line 179-268 */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950 p-4 md:p-8 space-y-4">
                        
                        {rows.map((trx, index) => {
                            return (
                                <div 
                                    key={index} 
                                    className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none relative group transition-colors duration-300"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-lg ${trx.type === 'expense' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'}`}>
                                            {t('transaction') || 'Transaksi'} #{index + 1}
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => removeRow(index)} 
                                            disabled={rows.length <= 1}
                                            className={`w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-500 transition-all ${rows.length <= 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Left Col: Type & Category */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-600 tracking-wider mb-1.5 ml-1 block">
                                                    {t('type') || 'Jenis'}
                                                </label>
                                                <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl h-11 border border-slate-100 dark:border-slate-700">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleTypeChange(index, 'expense')} 
                                                        className={`flex-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center tracking-wider ${trx.type === 'expense' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
                                                    >
                                                        {t('out') || 'Pengeluaran'}
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleTypeChange(index, 'income')} 
                                                        className={`flex-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center tracking-wider ${trx.type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
                                                    >
                                                        {t('in') || 'Pemasukan'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-600 tracking-wider mb-1.5 ml-1 block">
                                                    {t('category') || 'Kategori'}
                                                </label>
                                                <select 
                                                    value={trx.category} 
                                                    onChange={(e) => setRows(prev => prev.map((r, i) => i === index ? { ...r, category: e.target.value } : r))}
                                                    className={`w-full pl-3 pr-8 h-11 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 text-xs appearance-none cursor-pointer ${trx.type === 'expense' ? 'focus:border-rose-400' : 'focus:border-emerald-400'}`}
                                                >
                                                    <option value="">{t('select_placeholder') || 'Pilih kategori...'}</option>
                                                    {getDisplayCategories(trx.type).map(cat => (
                                                        <option key={cat.slug} value={cat.slug}>
                                                            {cat.icon} {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Right Col: Amount & Description */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className={`text-[9px] font-bold tracking-wider mb-1.5 ml-1 block ${trx.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                    {t('amount') || 'Nominal'}
                                                </label>
                                                <div className="relative">
                                                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-black text-xs ${trx.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                        {currencySymbol}
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        value={formatDisplay(trx.amount)} 
                                                        onChange={(e) => handleAmountChange(index, e.target.value)} 
                                                        placeholder="0" 
                                                        className={`w-full h-11 pl-10 pr-3 rounded-xl border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-black text-sm text-slate-800 dark:text-white ${trx.type === 'expense' ? 'focus:border-rose-500' : 'focus:border-emerald-500'}`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-600 tracking-wider mb-1.5 ml-1 block">
                                                    {t('description') || 'Keterangan'}
                                                </label>
                                                <input 
                                                    type="text" 
                                                    value={trx.title} 
                                                    onChange={(e) => setRows(prev => prev.map((r, i) => i === index ? { ...r, title: e.target.value } : r))}
                                                    placeholder={t('desc_placeholder') || 'Cth: Kopi, Bensin...'} 
                                                    className="w-full text-xs font-bold h-11 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <button 
                            type="button" 
                            onClick={addRow} 
                            className="mt-6 w-full py-4 border-2 border-dashed border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl text-indigo-500 dark:text-indigo-400 font-bold tracking-wider text-[10px] hover:border-indigo-400 hover:bg-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <span className="w-5 h-5 rounded-md bg-indigo-200 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 flex items-center justify-center text-xs">+</span> 
                            {t('btn_add_another_transaction') || 'Tambah Baris Transaksi'}
                        </button>
                    </div>

                    {/* Footer — 1:1 from FinanceBatchModal.vue line 270-288 */}
                    <div className="px-8 py-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 transition-colors">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-600 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            {t('total_label') || 'Total:'} <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black">{rows.length}</span>
                        </div>
                        
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-[10px] border-2 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 transition"
                            >
                                {t('btn_cancel') || 'Batal'}
                            </button>
                            <button 
                                type="submit" 
                                className="flex-[2] sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 px-8 shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 font-bold text-[10px]"
                            >
                                {t('btn_save_all') || 'Simpan Semua'}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div></ModalPortal>
    );
}
