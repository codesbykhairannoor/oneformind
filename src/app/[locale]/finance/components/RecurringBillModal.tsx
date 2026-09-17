'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X, Repeat, Check, Wallet } from 'lucide-react';
import { RecurringBillItem } from './RecurringBillsSection';
import { WalletItem } from './WalletsSection';

interface RecurringBillModalProps {
    show: boolean;
    editingBill: RecurringBillItem | null;
    categories: { slug: string; name: string; icon: string }[];
    wallets?: WalletItem[];
    onClose: () => void;
    onSave: (bill: RecurringBillItem) => void;
    activeCurrency?: string;
}

const RECURRING_ICONS = ['🍿', '🤖', '🎵', '📶', '⚡', '🏠', '🛡️', '☁️', '🏋️', '📱', '🎮', '🚗'];
const RECURRING_COLORS = ['#e50914', '#10a37f', '#1db954', '#0284c7', '#f59e0b', '#6366f1', '#14b8a6', '#8b5cf6', '#ec4899', '#3b82f6'];

export default function RecurringBillModal({
    show,
    editingBill,
    categories = [],
    wallets = [],
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
    const [walletId, setWalletId] = useState('');
    const [icon, setIcon] = useState('🍿');
    const [color, setColor] = useState('#e50914');

    useEffect(() => {
        if (editingBill) {
            setName(editingBill.name);
            setAmount(String(editingBill.amount));
            setCycle(editingBill.cycle || 'monthly');
            setBillingDay(editingBill.billingDay || 1);
            setCategory(editingBill.category || (categories[0]?.slug || ''));
            setWalletId(editingBill.walletId || (wallets[0]?.id || ''));
            setIcon(editingBill.icon || '🍿');
            setColor(editingBill.color || '#6366f1');
        } else {
            setName('');
            setAmount('');
            setCycle('monthly');
            setBillingDay(1);
            setCategory(categories[0]?.slug || '');
            setWalletId(wallets[0]?.id || '');
            setIcon('🍿');
            setColor('#e50914');
        }
    }, [editingBill, show, categories, wallets]);

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
            walletId: walletId || (wallets[0]?.id || undefined),
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
                                    {isIndo ? 'Pantau pengeluaran berulang & potong otomatis' : 'Track ongoing bills & payment schedules'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                        
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
                                placeholder="Contoh: Netflix Premium, WiFi Indihome, Sewa Kost, ChatGPT Plus"
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
                                    {isIndo ? 'Tgl Jatuh Tempo (1-31)' : 'Billing Day (1-31)'}
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
                                    {isIndo ? 'Kategori Anggaran' : 'Category'}
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
                                </select>
                            </div>
                        </div>

                        {/* Wallet Deduction Account */}
                        {wallets.length > 0 && (
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1">
                                    <Wallet size={13} className="text-purple-500" />
                                    <span>{isIndo ? 'Potong Dari Dompet / Rekening' : 'Deduct From Wallet'}</span>
                                </label>
                                <select
                                    value={walletId}
                                    onChange={e => setWalletId(e.target.value)}
                                    className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    {wallets.map(w => (
                                        <option key={w.id} value={w.id}>
                                            {w.icon || '💳'} {w.name} ({new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: activeCurrency, maximumFractionDigits: 0 }).format(w.balance)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Icon & Color Selector */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                                {isIndo ? 'Ikon & Warna Tema' : 'Icon & Theme Color'}
                            </label>
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2.5">
                                {RECURRING_ICONS.map(ic => (
                                    <button
                                        key={ic}
                                        type="button"
                                        onClick={() => setIcon(ic)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform shrink-0 ${
                                            icon === ic 
                                                ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500 scale-110' 
                                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                                        }`}
                                    >
                                        {ic}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                                {RECURRING_COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-7 h-7 rounded-full transition-transform shrink-0 flex items-center justify-center ${
                                            color === c ? 'ring-2 ring-offset-2 ring-purple-500 scale-110' : 'hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: c }}
                                    >
                                        {color === c && <Check size={12} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-xl shadow-purple-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                            >
                                {editingBill 
                                    ? (isIndo ? 'Simpan Perubahan' : 'Save Changes') 
                                    : (isIndo ? 'Simpan Tagihan Rutin' : 'Save Recurring Subscription')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
