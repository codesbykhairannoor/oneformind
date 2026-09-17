'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X, Wallet, Check } from 'lucide-react';
import { WalletItem } from './WalletsSection';

interface WalletModalProps {
    show: boolean;
    editingWallet: WalletItem | null;
    onClose: () => void;
    onSave: (wallet: WalletItem) => void;
    activeCurrency?: string;
}

const WALLET_ICONS = ['🏛️', '📱', '💵', '💳', '📈', '🪙', '💼', '🏦', '💎', '🛒'];
const WALLET_COLORS = ['#005baa', '#003d79', '#00aed6', '#7c3aed', '#ee4d2d', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#0f766e'];

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
        setBalance(raw);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numBal = Number(balance.replace(/[^0-9]/g, '')) || 0;
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
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                        
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
                                placeholder="Contoh: BCA Utama, GoPay, Uang Tunai, Mandiri"
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
                                    inputMode="numeric"
                                    required
                                    value={formatDisplay(balance)}
                                    onChange={handleAmountChange}
                                    placeholder="0"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Icon & Color Selector */}
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
                                {isIndo ? 'Ikon & Warna Tema' : 'Icon & Theme Color'}
                            </label>
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2.5">
                                {WALLET_ICONS.map(ic => (
                                    <button
                                        key={ic}
                                        type="button"
                                        onClick={() => setIcon(ic)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform shrink-0 ${
                                            icon === ic 
                                                ? 'bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-500 scale-110' 
                                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                                        }`}
                                    >
                                        {ic}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                                {WALLET_COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-7 h-7 rounded-full transition-transform shrink-0 flex items-center justify-center ${
                                            color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: c }}
                                    >
                                        {color === c && <Check size={12} className="text-white" />}
                                    </button>
                                ))}
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
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
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
