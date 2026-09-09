'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X, ArrowRightLeft, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';
import { WalletItem } from './WalletsSection';

interface TransferModalProps {
    show: boolean;
    wallets: WalletItem[];
    onClose: () => void;
    onTransfer: (data: {
        fromWalletId: string;
        toWalletId: string;
        amount: number;
        adminFee: number;
        date: string;
        notes?: string;
    }) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function TransferModal({
    show,
    wallets = [],
    onClose,
    onTransfer,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: TransferModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
    const [toWalletId, setToWalletId] = useState(wallets[1]?.id || '');
    const [amount, setAmount] = useState('');
    const [adminFee, setAdminFee] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (wallets.length >= 2) {
            setFromWalletId(wallets[0].id);
            setToWalletId(wallets[1].id);
        }
        setAmount('');
        setAdminFee('');
        setNotes('');
        setDate(new Date().toISOString().split('T')[0]);
    }, [show, wallets]);

    if (!show) return null;

    const fromWallet = wallets.find(w => w.id === fromWalletId);
    const toWallet = wallets.find(w => w.id === toWalletId);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmt = Number(amount.replace(/[^0-9]/g, ''));
        const numFee = Number(adminFee.replace(/[^0-9]/g, '')) || 0;

        if (!fromWalletId || !toWalletId || fromWalletId === toWalletId) {
            alert(isIndo ? 'Pilih dompet asal dan tujuan yang berbeda.' : 'Please select different source and destination wallets.');
            return;
        }

        if (isNaN(numAmt) || numAmt <= 0) return;

        onTransfer({
            fromWalletId,
            toWalletId,
            amount: numAmt,
            adminFee: numFee,
            date,
            notes: notes.trim()
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
                                <ArrowRightLeft size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-lg">
                                    {isIndo ? 'Transfer Antar Dompet' : 'Account Transfer'}
                                </h3>
                                <p className="text-xs text-white/80 font-medium">
                                    {isIndo ? 'Pindahkan saldo tanpa menambah beban pengeluaran' : 'Move money without counting as an expense'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                        
                        {/* Source -> Destination Selector Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                            {/* From Wallet */}
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Dari Dompet (Sumber)' : 'From Wallet'}
                                </label>
                                <select
                                    value={fromWalletId}
                                    onChange={e => setFromWalletId(e.target.value)}
                                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    {wallets.map(w => (
                                        <option key={w.id} value={w.id}>
                                            {w.icon} {w.name} ({formatMoney(w.balance)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* To Wallet */}
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Ke Dompet (Tujuan)' : 'To Wallet'}
                                </label>
                                <select
                                    value={toWalletId}
                                    onChange={e => setToWalletId(e.target.value)}
                                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    {wallets.filter(w => w.id !== fromWalletId).map(w => (
                                        <option key={w.id} value={w.id}>
                                            {w.icon} {w.name} ({formatMoney(w.balance)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Amount & Admin Fee */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Jumlah Transfer' : 'Transfer Amount'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="Contoh: 500000"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Biaya Admin (Opsional)' : 'Admin Fee'}
                                </label>
                                <input
                                    type="text"
                                    value={adminFee}
                                    onChange={e => setAdminFee(e.target.value)}
                                    placeholder="Contoh: 2500"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Date & Notes */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Tanggal' : 'Date'}
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                                    {isIndo ? 'Keterangan' : 'Notes'}
                                </label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Contoh: Topup GoPay, Tarik ATM"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowRightLeft size={16} />
                                <span>{isIndo ? 'Eksekusi Transfer' : 'Execute Transfer'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
