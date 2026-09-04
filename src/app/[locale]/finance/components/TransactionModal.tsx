'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import FinanceDatePicker from './FinanceDatePicker';
import ModalPortal from '@/components/ModalPortal';

export interface TransactionModalItem {
    id?: number | string;
    title: string;
    amount: number | string;
    type: 'income' | 'expense';
    category: string;
    date: string;
    notes?: string;
}

interface TransactionModalProps {
    show: boolean;
    editingTransaction: TransactionModalItem | null;
    categories: { slug: string; name: string; icon: string; type: string }[];
    transactions?: any[];
    budgets?: any[];
    onClose: () => void;
    onSubmit: (data: TransactionModalItem) => void;
    onSwitchToBatch?: () => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function TransactionModal({
    show,
    editingTransaction,
    categories,
    transactions = [],
    budgets = [],
    onClose,
    onSubmit,
    onSwitchToBatch,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: TransactionModalProps) {
    const t = useTranslations();
    const locale = useLocale();

    const todayStr = new Date().toISOString().split('T')[0];

    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [date, setDate] = useState<string>(todayStr);
    const [notes, setNotes] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (editingTransaction) {
            setType(editingTransaction.type || 'expense');
            setAmount(String(editingTransaction.amount || ''));
            setTitle(editingTransaction.title || '');
            setCategory(editingTransaction.category || '');
            setDate(editingTransaction.date || todayStr);
            setNotes(editingTransaction.notes || '');
        } else {
            setType('expense');
            setAmount('');
            setTitle('');
            setCategory('');
            setDate(todayStr);
            setNotes('');
        }
    }, [editingTransaction, show, todayStr]);

    // 1:1 from TransactionModal.vue line 34 — watch type, reset category
    useEffect(() => {
        setCategory('');
    }, [type]);

    useEffect(() => {
    }, [show]);

    if (!show) return null;

    const currencySymbolMap: Record<string, string> = { IDR: 'Rp', USD: '$', GBP: '£', EUR: '€', JPY: '¥' };
    const currencySymbol = currencySymbolMap[activeCurrency] || 'Rp';
    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);



    const activeSlugs = new Set([
        ...budgets.map(b => b.category),
        ...transactions.map(t => t.category)
    ]);

    const availableCategories = categories.filter(c => c.type === type);
    const rawDisplayCategories = availableCategories.filter(c => activeSlugs.has(c.slug));
    
    const displayCategories = Array.from(new Map(rawDisplayCategories.map(c => [c.slug, c])).values());

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const str = val.toString();
        return isDotSeparator ? str.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        let cleanVal = isDotSeparator ? rawValue.replace(/\./g, '') : rawValue.replace(/,/g, '');
        if (!isNaN(Number(cleanVal))) {
            setAmount(cleanVal);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        onSubmit({
            id: editingTransaction?.id,
            title: title.trim(),
            amount: numAmount,
            type,
            category: category || (displayCategories[0]?.slug || 'other'),
            date,
            notes
        });
        onClose();
    };

    const dateDisplay = date ? new Date(date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '';

    return (
        // 1:1 from TransactionModal.vue line 64-176
        <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 " onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-md bg-slate-50 dark:bg-slate-950 flex flex-col max-h-[85dvh] md:max-h-[85vh] transition-all duration-500 border border-slate-200 dark:border-slate-800 shadow-2xl dark:shadow-none rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header — 1:1 from TransactionModal.vue line 67-85 */}
                <div className="px-6 md:px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 transition-colors duration-500 rounded-t-[2.5rem] z-20">
                    <div className="flex items-center gap-4 transition-colors duration-500">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg dark:shadow-none shadow-indigo-200 dark:shadow-indigo-900/20 shrink-0">
                            ✨
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-2 transition-colors duration-500">
                                {editingTransaction ? (t('edit_transaction') || 'Edit Transaksi') : (t('record_transaction') || 'Catat Transaksi')}
                            </h3>
                            {!editingTransaction && onSwitchToBatch && (
                                <button 
                                    onClick={onSwitchToBatch} 
                                    type="button" 
                                    className="text-[10px] font-bold tracking-tight px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition duration-300 flex items-center gap-1.5 active:scale-95 w-fit border border-indigo-100 dark:border-indigo-500/20"
                                >
                                    <span>⚡</span> {t('batch_mode_title') || 'Mode Kolektif'}
                                </button>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} type="button" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-90 flex items-center justify-center font-bold">
                        ✕
                    </button>
                </div>

                {/* Body — 1:1 from TransactionModal.vue line 87-158 */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-5">
                        
                        {/* Type Switcher */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl transition-colors duration-500">
                            <button 
                                type="button" 
                                onClick={() => setType('expense')} 
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-tight transition-all flex items-center justify-center gap-2 ${type === 'expense' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm dark:shadow-none' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                {type === 'expense' && <span>🔴</span>} {t('out') || 'Pengeluaran'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setType('income')} 
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-tight transition-all flex items-center justify-center gap-2 ${type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-none' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                {type === 'income' && <span>🟢</span>} {t('in') || 'Pemasukan'}
                            </button>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className={`block text-[10px] font-bold tracking-tight mb-2 ml-1 ${type === 'expense' ? 'text-rose-400 dark:text-rose-400/80' : 'text-emerald-400 dark:text-emerald-400/80'}`}>
                                {t('amount') || 'Nominal'}
                            </label>
                            <div className="relative group">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg ${type === 'expense' ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                                    {currencySymbol}
                                </span>
                                <input 
                                    type="text" 
                                    value={formatDisplay(amount)} 
                                    onChange={handleAmountChange} 
                                    placeholder="0" 
                                    className={`w-full pl-12 pr-4 h-14 rounded-xl border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-black text-2xl transition-all dark:text-white focus:ring-0 ${type === 'expense' ? 'focus:border-rose-500' : 'focus:border-emerald-500'}`}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-2 ml-1 tracking-tight">
                                {t('description') || 'Keterangan'}
                            </label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder={t('desc_placeholder') || 'Cth: Kopi, Gaji...'}
                                className="w-full px-4 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-0 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                        </div>

                        {/* Category & Date Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-2 ml-1 tracking-tight">
                                    {t('category') || 'Kategori'}
                                </label>
                                <div className="relative">
                                    <select 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full pl-4 pr-8 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-0 font-bold text-slate-700 dark:text-slate-200 text-sm appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">{t('select_placeholder') || 'Pilih kategori...'}</option>
                                        {displayCategories.map(cat => (
                                            <option key={cat.slug} value={cat.slug}>
                                                {cat.icon} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path d="M19 9l-7 7-7-7"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Date Picker Trigger — 1:1 from TransactionModal.vue line 137-155 */}
                            <div className="relative">
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-2 ml-1 tracking-tight">
                                    {t('date') || 'Tanggal'}
                                </label>
                                <button 
                                    type="button" 
                                    onClick={() => setShowDatePicker(!showDatePicker)} 
                                    className="w-full px-4 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500/40 font-bold text-slate-700 dark:text-slate-200 text-sm transition-all flex items-center justify-between transition-colors duration-500"
                                >
                                    <span className="truncate">{dateDisplay}</span>
                                    <span className="text-slate-400 dark:text-slate-600">📅</span>
                                </button>
                                {showDatePicker && (
                                    <ModalPortal><div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                                        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 " onClick={() => setShowDatePicker(false)}></div>
                                        <FinanceDatePicker 
                                            show={true} 
                                            modelValue={date}
                                            onUpdateModelValue={(val: string) => { setDate(val); setShowDatePicker(false); }}
                                            onClose={() => setShowDatePicker(false)}
                                            transactions={transactions}
                                            activeCurrency={activeCurrency}
                                            currencyLocale={currencyLocale}
                                            className="relative z-10"
                                        />
                                    </div></ModalPortal>
                                )}
                            </div>
                        </div>

                </div>

                {/* Footer Actions — 1:1 from TransactionModal.vue line 160-172 */}
                <div className="px-6 md:px-8 py-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3 z-20 shrink-0 transition-colors duration-500 pb-8 md:pb-6 rounded-b-[2.5rem]">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="flex-1 py-3.5 rounded-xl text-[11px] font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 transition-all"
                    >
                        {t('btn_cancel') || 'Batal'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmit}
                        className={`flex-[2] rounded-xl py-3.5 shadow-xl transition-all active:scale-95 font-bold text-[11px] text-white flex items-center justify-center ${type === 'expense' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-none' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 dark:shadow-none'}`}
                    >
                        {editingTransaction ? (t('btn_save_changes') || 'Simpan Perubahan') : (t('btn_save_manual') || 'Simpan Transaksi')}
                    </button>
                </div>

            </div>
        </div></ModalPortal>
    );
}
