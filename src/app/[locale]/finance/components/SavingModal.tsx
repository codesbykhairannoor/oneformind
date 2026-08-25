'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, CheckCircle2 } from 'lucide-react';

export interface SavingVault {
    id?: number | string;
    title: string;
    target_amount: number | string;
    current_amount?: number;
    icon: string;
    color: string;
}

interface SavingModalProps {
    show: boolean;
    saving: SavingVault | null;
    onClose: () => void;
    onSave: (data: SavingVault) => void;
    activeCurrency?: string;
}

export default function SavingModal({
    show,
    saving,
    onClose,
    onSave,
    activeCurrency = 'IDR'
}: SavingModalProps) {
    const t = useTranslations();

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#0ea5e9', '#0f172a'];
    const icons = ['🏦', '💍', '🏠', '🚗', '🎓', '✈️', '💻', '👶', '🎁', '🏥', '🍱', '💼'];

    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState<string>('');
    const [icon, setIcon] = useState('🏦');
    const [color, setColor] = useState('#6366f1');

    useEffect(() => {
        if (saving && saving.id) {
            setTitle(saving.title || '');
            setTargetAmount(String(saving.target_amount || ''));
            setIcon(saving.icon || '🏦');
            setColor(saving.color || '#6366f1');
        } else {
            setTitle('');
            setTargetAmount('');
            setIcon('🏦');
            setColor('#6366f1');
        }
    }, [saving, show]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numTarget = Number(targetAmount);
        if (!title.trim() || isNaN(numTarget) || numTarget <= 0) return;

        onSave({
            id: saving?.id,
            title: title.trim(),
            target_amount: numTarget,
            icon,
            color
        });
        onClose();
    };

    return (
        // 1:1 from SavingModal.vue line 80-151
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
        </div>
    );
}
