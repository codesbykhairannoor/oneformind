'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Wallet, 
    Plus, 
    ArrowRightLeft, 
    Edit2, 
    Trash2, 
    CreditCard, 
    Building2, 
    Smartphone, 
    Banknote, 
    TrendingUp 
} from 'lucide-react';

export interface WalletItem {
    id: string;
    name: string;
    type: 'bank' | 'ewallet' | 'cash' | 'investment';
    balance: number;
    icon: string;
    color: string;
    accountNumber?: string;
}

interface WalletsSectionProps {
    wallets: WalletItem[];
    activeCurrency?: string;
    currencyLocale?: string;
    onOpenAddWallet: () => void;
    onEditWallet: (wallet: WalletItem) => void;
    onDeleteWallet: (id: string) => void;
    onOpenTransferModal: () => void;
}

export default function WalletsSection({
    wallets = [],
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID',
    onOpenAddWallet,
    onEditWallet,
    onDeleteWallet,
    onOpenTransferModal
}: WalletsSectionProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    const totalWalletBalance = wallets.reduce((s, w) => s + (Number(w.balance) || 0), 0);

    const getTypeIcon = (type: WalletItem['type']) => {
        switch (type) {
            case 'bank': return <Building2 size={16} />;
            case 'ewallet': return <Smartphone size={16} />;
            case 'cash': return <Banknote size={16} />;
            case 'investment': return <TrendingUp size={16} />;
            default: return <CreditCard size={16} />;
        }
    };

    const getTypeLabel = (type: WalletItem['type']) => {
        switch (type) {
            case 'bank': return 'Bank Account';
            case 'ewallet': return 'E-Wallet';
            case 'cash': return isIndo ? 'Uang Tunai' : 'Cash';
            case 'investment': return isIndo ? 'Investasi' : 'Investment';
            default: return 'Wallet';
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-5 sm:p-7 border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 relative overflow-hidden transition-all">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                        <Wallet size={13} /> {isIndo ? 'Kantong & Akun Keuangan' : 'Multi-Wallet & Accounts'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Daftar Dompet & Rekening' : 'Wallets & Bank Accounts'}
                    </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {wallets.length >= 2 && (
                        <button
                            onClick={onOpenTransferModal}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs transition active:scale-95 shrink-0 border border-slate-200 dark:border-slate-700"
                            title="Transfer saldo antar dompet"
                        >
                            <ArrowRightLeft size={15} />
                            <span>{isIndo ? 'Transfer Antar Akun' : 'Transfer'}</span>
                        </button>
                    )}

                    <button
                        onClick={onOpenAddWallet}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition active:scale-95 shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>{isIndo ? 'Tambah Dompet' : 'Add Wallet'}</span>
                    </button>
                </div>
            </div>

            {/* Total Balance Ribbon */}
            <div className="flex items-center justify-between p-4 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 mb-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                        {isIndo ? 'Total Saldo Terkonsolidasi' : 'Total Consolidated Balance'}
                    </p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                        {formatMoney(totalWalletBalance)}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm font-mono">
                        {wallets.length} {isIndo ? 'Akun Aktif' : 'Accounts'}
                    </span>
                </div>
            </div>

            {/* Wallets Cards Slider / Grid */}
            {wallets.length === 0 ? (
                <div className="text-center py-10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mx-auto mb-3 text-2xl">
                        💳
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {isIndo ? 'Belum ada dompet atau rekening terpisah' : 'No custom wallets created yet'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                        {isIndo ? 'Pisahkan saldo ke rekening BCA, GoPay, Uang Tunai, atau Bibit untuk melacak mutasi dan transfer antar dompet!' : 'Separate your funds into BCA, GoPay, Cash, or Investments to track balances per account!'}
                    </p>
                    <button
                        onClick={onOpenAddWallet}
                        className="px-4 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-black text-xs hover:bg-indigo-200 transition"
                    >
                        + {isIndo ? 'Buat Dompet Pertama' : 'Add First Wallet'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallets.map(wallet => (
                        <div
                            key={wallet.id}
                            className="group p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div 
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform group-hover:scale-105"
                                        style={{ backgroundColor: `${wallet.color}18`, color: wallet.color }}
                                    >
                                        {wallet.icon || '💳'}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                            {wallet.name}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
                                            {getTypeIcon(wallet.type)}
                                            <span>{getTypeLabel(wallet.type)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => onEditWallet(wallet)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition"
                                        title="Edit"
                                    >
                                        <Edit2 size={13} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteWallet(wallet.id)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition"
                                        title="Hapus"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-baseline justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {isIndo ? 'Saldo Akun' : 'Balance'}
                                </span>
                                <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white font-mono">
                                    {formatMoney(wallet.balance)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
