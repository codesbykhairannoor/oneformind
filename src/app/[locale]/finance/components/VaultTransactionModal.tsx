'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { SavingVault } from './SavingModal';
import FinanceDatePicker from './FinanceDatePicker';

interface VaultTransactionModalProps {
    show: boolean;
    saving: SavingVault | null;
    type: 'deposit' | 'withdraw';
    onClose: () => void;
    onSave: (amount: number, type: 'deposit' | 'withdraw', date?: string) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function VaultTransactionModal({
    show,
    saving,
    type,
    onClose,
    onSave,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: VaultTransactionModalProps) {
    const t = useTranslations();
    const todayStr = new Date().toISOString().split('T')[0];

    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<string>(todayStr);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const presets = [50000, 100000, 500000, 1000000];

    useEffect(() => {
        if (show) {
            setAmount('');
            setDate(todayStr);
        }
    }, [show, todayStr]);

    if (!show || !saving) return null;

    const currencySymbolMap: Record<string, string> = { IDR: 'Rp', USD: '$', GBP: '£', EUR: '€', JPY: '¥' };
    const currencySymbol = currencySymbolMap[activeCurrency] || 'Rp';
    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);
    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const str = val.toString();
        return isDotSeparator ? str.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        let cleanVal = isDotSeparator ? rawValue.replace(/\./g, '') : rawValue.replace(/,/g, '');
        if (!isNaN(Number(cleanVal)) || cleanVal === '') {
            setAmount(cleanVal);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        if (type === 'withdraw' && numAmount > (saving.current_amount || 0)) {
            alert('Saldo tabungan tidak mencukupi!');
            return;
        }

        onSave(numAmount, type, date);
        setAmount('');
        onClose();
    };

    return (
        // 1:1 from VaultTransactionModal.vue line 76-170
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Header — 1:1 from VaultTransactionModal.vue line 82-100 */}
                <div className="p-8 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" 
                             style={{ backgroundColor: (saving.color || '#6366f1') + '20' }}>
                            {saving.icon || '🏦'}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white">
                                {type === 'deposit' ? (t('vault_deposit_title') || 'Top-Up Tabungan') : (t('vault_withdraw_title') || 'Tarik Tabungan')}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                                {saving.title}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-95">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave}>
                    <div className="p-8 space-y-6">
                        
                        {/* Current Status — 1:1 from VaultTransactionModal.vue line 104-117 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 flex justify-between items-center transition-all">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 mb-1">{t('vault_available_title') || 'Saldo Terkumpul'}</p>
                                <p className="text-lg font-black text-slate-800 dark:text-white tabular-nums">
                                    {formatMoney(saving.current_amount || 0)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-slate-400 mb-1">{t('target') || 'Target'}</p>
                                <p className="text-xs font-bold text-indigo-500 tabular-nums">
                                    {formatMoney(Number(saving.target_amount) || 0)}
                                </p>
                            </div>
                        </div>

                        {/* Input Box — 1:1 from VaultTransactionModal.vue line 120-141 */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="absolute -top-2.5 left-5 bg-white dark:bg-slate-900 px-2 text-[10px] font-black text-indigo-500 tracking-wider z-10">
                                    {type === 'deposit' ? (t('vault_deposit_label') || 'Nominal Setoran') : (t('vault_withdraw_label') || 'Nominal Penarikan')}
                                </label>
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus-within:border-indigo-500/20 focus-within:bg-white dark:focus-within:bg-slate-800 rounded-[1.5rem] px-5 py-4 transition-all shadow-inner">
                                    <span className="text-slate-400 font-black text-lg">{currencySymbol}</span>
                                    <input 
                                        type="text" 
                                        required
                                        autoFocus
                                        value={formatDisplay(amount)} 
                                        onChange={handleAmountChange} 
                                        placeholder="0" 
                                        className="w-full bg-transparent border-none p-0 text-2xl font-black text-slate-800 dark:text-white placeholder-slate-300 focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* Presets */}
                            <div className="grid grid-cols-4 gap-2">
                                {presets.map((p) => (
                                    <button 
                                        key={p}
                                        type="button"
                                        onClick={() => setAmount(String(p))}
                                        className="py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[9px] font-bold text-slate-500 dark:text-slate-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-95 border border-slate-100 dark:border-slate-800"
                                    >
                                        {Math.floor(p / 1000)}k
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Input — 1:1 from VaultTransactionModal.vue line 144-150 */}
                        <div className="space-y-1 relative">
                            <label className="text-[10px] font-bold text-slate-400 tracking-wider ml-1 block">
                                {t('vault_date_label') || 'Tanggal Transaksi'}
                            </label>
                            <button 
                                type="button" 
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer flex justify-between items-center" 
                            >
                                <span>{date ? new Date(date).toLocaleDateString() : ''}</span>
                                <span className="text-slate-400">📅</span>
                            </button>
                            {showDatePicker && (
                                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                                    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowDatePicker(false)}></div>
                                    <FinanceDatePicker 
                                        show={true}
                                        modelValue={date}
                                        onUpdateModelValue={(val) => setDate(val)}
                                        onClose={() => setShowDatePicker(false)}
                                        className="relative z-10"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Action — 1:1 from VaultTransactionModal.vue line 154-168 */}
                    <div className="p-8 pt-0">
                        <button 
                            type="submit"
                            disabled={!amount || Number(amount) <= 0}
                            className={`w-full relative group overflow-hidden py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${type === 'deposit' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-rose-500 text-white shadow-xl shadow-rose-500/20'}`}
                        >
                            <span className="relative flex items-center justify-center gap-3">
                                {type === 'deposit' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                                {type === 'deposit' ? (t('vault_btn_deposit') || 'Konfirmasi Top-Up') : (t('vault_btn_withdraw') || 'Konfirmasi Penarikan')}
                            </span>
                        </button>
                        {type === 'withdraw' && (
                            <p className="text-center text-[10px] font-bold text-slate-400 mt-4">
                                {t('vault_withdraw_notice') || 'Penarikan akan mengurangi saldo terkumpul pada target ini.'}
                            </p>
                        )}
                    </div>
                </form>

            </div>
        </div>
    );
}
