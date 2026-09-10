'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, CheckCircle2 } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';

export interface SavingVault {
    id?: number | string;
    title: string;
    target_amount: number | string;
    current_amount?: number;
    icon: string;
    color: string;
}

export interface SavingFundingOption {
    deductFromWallet: boolean;
    walletId?: string;
    initialAmount?: number;
    date?: string;
    notes?: string;
}

interface SavingModalProps {
    show: boolean;
    saving: SavingVault | null;
    wallets?: any[];
    onClose: () => void;
    onSave: (data: SavingVault, fundingOption?: SavingFundingOption) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function SavingModal({
    show,
    saving,
    wallets = [],
    onClose,
    onSave,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: SavingModalProps) {
    const t = useTranslations();

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#0ea5e9', '#0f172a'];
    const icons = ['🏦', '💍', '🏠', '🚗', '🎓', '✈️', '💻', '👶', '🎁', '🏥', '🍱', '💼'];

    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState<string>('');
    const [icon, setIcon] = useState('🏦');
    const [color, setColor] = useState('#6366f1');

    // Initial Deposit States (Only for new vault creation)
    const [initialDeposit, setInitialDeposit] = useState<string>('');
    const [deductFromWallet, setDeductFromWallet] = useState(false);
    const [selectedWalletId, setSelectedWalletId] = useState('');

    useEffect(() => {
        if (saving && saving.id) {
            setTitle(saving.title || '');
            setTargetAmount(String(saving.target_amount || ''));
            setIcon(saving.icon || '🏦');
            setColor(saving.color || '#6366f1');
            setInitialDeposit('');
            setDeductFromWallet(false);
        } else {
            setTitle('');
            setTargetAmount('');
            setIcon('🏦');
            setColor('#6366f1');
            setInitialDeposit('');
            setDeductFromWallet(false);
            if (wallets && wallets.length > 0) {
                setSelectedWalletId(wallets[0].id);
            }
        }
    }, [saving, show, wallets]);

    if (!show) return null;

    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const str = val.toString();
        return isDotSeparator ? str.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        let cleanVal = isDotSeparator ? rawValue.replace(/\./g, '') : rawValue.replace(/,/g, '');
        if (!isNaN(Number(cleanVal)) || cleanVal === '') {
            setTargetAmount(cleanVal);
        }
    };

    const handleInitialDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        let cleanVal = isDotSeparator ? rawValue.replace(/\./g, '') : rawValue.replace(/,/g, '');
        if (!isNaN(Number(cleanVal)) || cleanVal === '') {
            setInitialDeposit(cleanVal);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numTarget = Number(targetAmount);
        if (!title.trim() || isNaN(numTarget) || numTarget <= 0) return;

        const numInitial = Number(initialDeposit) || 0;
        const fundingOption: SavingFundingOption | undefined = (!saving?.id && deductFromWallet && numInitial > 0) ? {
            deductFromWallet: true,
            walletId: selectedWalletId || (wallets && wallets[0]?.id),
            initialAmount: numInitial,
            date: new Date().toISOString().split('T')[0],
            notes: `Setoran awal ke pos tabungan ${title.trim()}`
        } : undefined;

        onSave({
            id: saving?.id,
            title: title.trim(),
            target_amount: numTarget,
            current_amount: numInitial,
            icon,
            color
        }, fundingOption);
        onClose();
    };

    return (
        // 1:1 from SavingModal.vue line 80-151
        <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[85dvh] md:max-h-[90vh]">
                
                {/* Header — 1:1 from SavingModal.vue line 86-94 */}
                <div className="px-8 pt-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                            {saving?.id ? (t('vault_edit_title') || 'Edit Target Tabungan') : (t('vault_new_title') || 'Target Tabungan Baru')}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">
                            {t('vault_subtitle') || 'Atur alokasi dana dan target tabungan Anda'}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-95">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body — 1:1 from SavingModal.vue line 96-138 */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                        
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-600 block">
                                {t('vault_label_name') || 'Nama Target Tabungan'}
                            </label>
                            <input 
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Dream Wedding, New Laptop..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl px-5 py-4 text-slate-700 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm text-sm"
                            />
                        </div>

                        {/* Target Amount */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-600 block">
                                {t('vault_label_target') || 'Target Nominal'} ({activeCurrency})
                            </label>
                            <input 
                                type="text" 
                                required
                                value={formatDisplay(targetAmount)}
                                onChange={handleAmountChange}
                                placeholder="0"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl px-5 py-4 text-slate-700 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm text-lg"
                            />
                        </div>

                        {/* Optional Initial Deposit (Only on New Vault) */}
                        {!saving?.id && wallets && wallets.length > 0 && (
                            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            Langsung Setor Saldo Awal Tabungan?
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Potong dari dompet & catat pengeluaran pos tabungan otomatis
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input 
                                            type="checkbox" 
                                            checked={deductFromWallet} 
                                            onChange={e => setDeductFromWallet(e.target.checked)} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                {deductFromWallet && (
                                    <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Nominal Setoran Awal ({activeCurrency})
                                            </label>
                                            <input 
                                                type="text"
                                                value={formatDisplay(initialDeposit)}
                                                onChange={handleInitialDepositChange}
                                                placeholder="0"
                                                className="w-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Pilih Dompet Sumber
                                            </label>
                                            <select
                                                value={selectedWalletId || (wallets[0]?.id || '')}
                                                onChange={e => setSelectedWalletId(e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                                            >
                                                {wallets.map(w => (
                                                    <option key={w.id} value={w.id}>
                                                        {w.name} (Saldo: {new Intl.NumberFormat(currencyLocale, { style: 'currency', currency: activeCurrency, maximumFractionDigits: 0 }).format(Number(w.balance || 0))})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Icon Picker */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-600 block">
                                {t('vault_label_icon') || 'Ikon / Emoji'}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {icons.map(i => (
                                    <button 
                                        key={i}
                                        type="button"
                                        onClick={() => setIcon(i)}
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all active:scale-90 ${icon === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-600 block">
                                {t('vault_label_color') || 'Warna Akses'}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {colors.map(c => (
                                    <button 
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        style={{ backgroundColor: c }}
                                        className={`w-10 h-10 rounded-2xl transition-all flex items-center justify-center ${color === c ? 'ring-4 ring-offset-4 dark:ring-offset-slate-900 ring-indigo-500/30 scale-105' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        {color === c && <CheckCircle2 size={16} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions — 1:1 from SavingModal.vue line 141-150 */}
                    <div className="p-8 pb-10 md:pb-8 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 transition-colors z-20 sticky bottom-0 shrink-0">
                        <button type="button" onClick={onClose} className="text-[10px] font-bold text-slate-400 dark:text-slate-600 px-4 py-2 hover:text-rose-500 transition-colors">
                            {t('btn_cancel') || 'Batal'}
                        </button>
                        <button 
                            type="submit"
                            className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            {saving?.id ? (t('vault_btn_update') || 'Simpan Perubahan') : (t('vault_btn_create') || 'Buat Target Tabungan')}
                        </button>
                    </div>
                </form>

            </div>
        </div></ModalPortal>
    );
}
