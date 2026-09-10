'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X, Repeat, Sparkles, Check } from 'lucide-react';
import { RecurringBillItem } from './RecurringBillsSection';

interface RecurringBillModalProps {
    show: boolean;
    editingBill: RecurringBillItem | null;
    categories: { slug: string; name: string; icon: string }[];
    onClose: () => void;
    onSave: (bill: RecurringBillItem) => void;
    activeCurrency?: string;
}

const PRESET_ICONS = [
    { icon: '🍿', name: 'Netflix / Video', color: '#e50914' },
    { icon: '🤖', name: 'AI / ChatGPT', color: '#10a37f' },
    { icon: '🎵', name: 'Spotify / Music', color: '#1db954' },
    { icon: '📶', name: 'Internet / WiFi', color: '#0284c7' },
    { icon: '⚡', name: 'Listrik / PLN', color: '#f59e0b' },
    { icon: '🏠', name: 'Sewa Kost / Rumah', color: '#6366f1' },
    { icon: '🛡️', name: 'Asuransi / BPJS', color: '#14b8a6' },
    { icon: '☁️', name: 'Cloud / Domain', color: '#8b5cf6' },
    { icon: '🏋️', name: 'Gym / Fitness', color: '#ec4899' },
    { icon: '📱', name: 'Pulsa / Kuota', color: '#3b82f6' },
];

export default function RecurringBillModal({
    show,
    editingBill,
    categories = [],
    onClose,
    onSave,
    activeCurrency = 'IDR'
}: RecurringBillModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [billingDay, setBillingDay] = useState(1);
    const [category, setCategory] = useState('');
    const [icon, setIcon] = useState('🍿');
    const [color, setColor] = useState('#e50914');

    useEffect(() => {
        if (editingBill) {
            setName(editingBill.name);
            setAmount(String(editingBill.amount));
            setCycle(editingBill.cycle || 'monthly');
            setBillingDay(editingBill.billingDay || 1);
            setCategory(editingBill.category || (categories[0]?.slug || ''));
            setIcon(editingBill.icon || '🍿');
            setColor(editingBill.color || '#6366f1');
        } else {
            setName('');
            setAmount('');
            setCycle('monthly');
            setBillingDay(1);
            setCategory(categories[0]?.slug || '');
            setIcon('🍿');
            setColor('#e50914');
        }
    }, [editingBill, show, categories]);

    if (!show) return null;

    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);

    const formatDisplay = (val: string | number) => {
        if (val === undefined || val === null || val === '') return '';
        const str = val.toString().replace(/[^0-9]/g, '');
        if (!str) return '';
        return isDotSeparator 
            ? str.replace(/\B(?=(\d{3})+(?!\d))/g, '.') 
            : str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setAmount(raw);
    };

    const handleSelectPreset = (preset: typeof PRESET_ICONS[0]) => {
        setIcon(preset.icon);
        setColor(preset.color);
        if (!name) {
            setName(preset.name.split(' / ')[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmt = Number(amount.replace(/[^0-9]/g, ''));
        if (!name.trim() || isNaN(numAmt) || numAmt <= 0) return;

        onSave({
            id: editingBill ? editingBill.id : `bill_${Date.now()}`,
            name: name.trim(),
            amount: numAmt,
            cycle,
            billingDay: Math.min(31, Math.max(1, Number(billingDay))),
            category: category || (categories[0]?.slug || 'langganan'),
            icon,
            color
        });

        onClose();
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                <div 
                    className="absolute inset-0 bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-sm"
                    onClick={onClose}
                />

                <div 
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] zoom-in-95 transition-all"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl border border-white/30">
                                {icon}
                            </div>
                            <div>
                                <h3 className="font-black text-lg">
                                    {editingBill 
                                        ? (isIndo ? 'Edit Langganan' : 'Edit Subscription') 
                                        : (isIndo ? 'Tambah Tagihan Rutin' : 'New Recurring Subscription')}
                                </h3>
                                <p className="text-xs text-white/80 font-medium">
                                    {isIndo ? 'Pantau pengeluaran berulang & tanggal jatuh tempo' : 'Track ongoing bills & payment schedules'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                        
                        {/* Quick Presets */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                                {isIndo ? 'Pilih Preset Populer' : 'Quick Presets'}
                            </label>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                {PRESET_ICONS.map(p => (
                                    <button
                                        key={p.name}
                                        type="button"
                                        onClick={() => handleSelectPreset(p)}
                                        className={`flex-shrink-0 px-3 py-2 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                                            icon === p.icon 
                                                ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/30' 
                                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                                        }`}
                                    >
                                        <span className="text-base">{p.icon}</span>
                                        <span>{p.name.split(' / ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                {isIndo ? 'Nama Layanan / Tagihan' : 'Subscription Name'}
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Contoh: Netflix Premium, WiFi Indihome, Sewa Kost"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>

                        {/* Amount & Cycle */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Nominal Tagihan' : 'Amount'}
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    required
                                    value={formatDisplay(amount)}
                                    onChange={handleAmountChange}
                                    placeholder="Contoh: 186.000"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Siklus Pembayaran' : 'Billing Cycle'}
                                </label>
                                <select
                                    value={cycle}
                                    onChange={e => setCycle(e.target.value as any)}
                                    className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="monthly">{isIndo ? 'Bulanan (Monthly)' : 'Monthly'}</option>
                                    <option value="yearly">{isIndo ? 'Tahunan (Yearly)' : 'Yearly'}</option>
                                </select>
                            </div>
                        </div>

                        {/* Billing Day & Category */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Tanggal Jatuh Tempo (1-31)' : 'Billing Day (1-31)'}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    required
                                    value={billingDay}
                                    onChange={e => setBillingDay(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Kategori' : 'Category'}
                                </label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    {categories.map(c => (
                                        <option key={c.slug} value={c.slug}>
                                            {c.icon} {c.name}
                                        </option>
                                    ))}
                                    <option value="langganan">🔄 Langganan</option>
                                    <option value="utilitas">⚡ Utilitas / Tagihan</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-xl shadow-purple-500/25 hover:opacity-95 active:scale-95 transition-all"
                            >
                                {editingBill 
                                    ? (isIndo ? 'Simpan Perubahan' : 'Save Changes') 
                                    : (isIndo ? 'Simpan Tagihan Rutin' : 'Add Recurring Subscription')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
