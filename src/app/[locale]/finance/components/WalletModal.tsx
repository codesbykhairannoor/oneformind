'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X, Wallet, Building2, Smartphone, Banknote, TrendingUp } from 'lucide-react';
import { WalletItem } from './WalletsSection';

interface WalletModalProps {
    show: boolean;
    editingWallet: WalletItem | null;
    onClose: () => void;
    onSave: (wallet: WalletItem) => void;
    activeCurrency?: string;
}

const WALLET_PRESETS = [
    { name: 'BCA', type: 'bank' as const, icon: '🏛️', color: '#005baa' },
    { name: 'Mandiri', type: 'bank' as const, icon: '🏛️', color: '#003d79' },
    { name: 'BRI / BNI', type: 'bank' as const, icon: '🏛️', color: '#0f766e' },
    { name: 'GoPay', type: 'ewallet' as const, icon: '📱', color: '#00aed6' },
    { name: 'OVO / DANA', type: 'ewallet' as const, icon: '📱', color: '#7c3aed' },
    { name: 'ShopeePay', type: 'ewallet' as const, icon: '📱', color: '#ee4d2d' },
    { name: 'Uang Tunai (Cash)', type: 'cash' as const, icon: '💵', color: '#10b981' },
    { name: 'Bibit / Reksadana', type: 'investment' as const, icon: '📈', color: '#6366f1' },
    { name: 'Crypto / Stock', type: 'investment' as const, icon: '🪙', color: '#f59e0b' },
];

export default function WalletModal({
    show,
    editingWallet,
    onClose,
    onSave,
    activeCurrency = 'IDR'
}: WalletModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [name, setName] = useState('');
    const [type, setType] = useState<WalletItem['type']>('bank');
    const [balance, setBalance] = useState('');
    const [icon, setIcon] = useState('🏛️');
    const [color, setColor] = useState('#005baa');
    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {
        if (editingWallet) {
            setName(editingWallet.name);
            setType(editingWallet.type || 'bank');
            setBalance(String(editingWallet.balance || 0));
            setIcon(editingWallet.icon || '🏛️');
            setColor(editingWallet.color || '#6366f1');
            setAccountNumber(editingWallet.accountNumber || '');
        } else {
            setName('');
            setType('bank');
            setBalance('');
            setIcon('🏛️');
            setColor('#005baa');
            setAccountNumber('');
        }
    }, [editingWallet, show]);

    if (!show) return null;

    const handleSelectPreset = (p: typeof WALLET_PRESETS[0]) => {
        setName(p.name);
        setType(p.type);
        setIcon(p.icon);
        setColor(p.color);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numBal = Number(balance.replace(/[^0-9]/g, ''));
        if (!name.trim() || isNaN(numBal)) return;

        onSave({
            id: editingWallet ? editingWallet.id : `wallet_${Date.now()}`,
            name: name.trim(),
            type,
            balance: numBal,
            icon,
            color,
            accountNumber: accountNumber.trim() || undefined
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
                    <div className="px-6 py-5 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl border border-white/30">
                                {icon}
                            </div>
                            <div>
                                <h3 className="font-black text-lg">
                                    {editingWallet 
                                        ? (isIndo ? 'Edit Akun Dompet' : 'Edit Wallet') 
                                        : (isIndo ? 'Tambah Dompet / Rekening' : 'New Wallet / Account')}
                                </h3>
                                <p className="text-xs text-white/80 font-medium">
                                    {isIndo ? 'Kelola saldo per akun bank & e-wallet' : 'Manage balances per bank & e-wallet'}
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
                                {WALLET_PRESETS.map(p => (
                                    <button
                                        key={p.name}
                                        type="button"
                                        onClick={() => handleSelectPreset(p)}
                                        className={`flex-shrink-0 px-3 py-2 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                                            name === p.name 
                                                ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30' 
                                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                                        }`}
                                    >
                                        <span className="text-base">{p.icon}</span>
                                        <span>{p.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                {isIndo ? 'Nama Akun / Dompet' : 'Wallet Name'}
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Contoh: BCA Utama, GoPay, Uang Tunai"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        {/* Type & Balance */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Tipe Akun' : 'Account Type'}
                                </label>
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value as any)}
                                    className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    <option value="bank">🏛️ Bank Account</option>
                                    <option value="ewallet">📱 E-Wallet</option>
                                    <option value="cash">💵 Uang Tunai (Cash)</option>
                                    <option value="investment">📈 Investasi / Aset</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Saldo Saat Ini' : 'Current Balance'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={balance}
                                    onChange={e => setBalance(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Account Number (Optional) */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                {isIndo ? 'Nomor Rekening / Catatan (Opsional)' : 'Account Number / Notes (Optional)'}
                            </label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={e => setAccountNumber(e.target.value)}
                                placeholder="Contoh: 123-456-7890"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition-all"
                            >
                                {editingWallet 
                                    ? (isIndo ? 'Simpan Perubahan' : 'Save Changes') 
                                    : (isIndo ? 'Buat Dompet Baru' : 'Create Wallet')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
