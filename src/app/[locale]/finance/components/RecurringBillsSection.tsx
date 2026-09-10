'use client';

import React, { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Repeat, 
    Plus, 
    Calendar, 
    AlertCircle, 
    CheckCircle2, 
    Zap, 
    Edit2, 
    Trash2, 
    TrendingUp,
    Clock
} from 'lucide-react';

export interface RecurringBillItem {
    id: string;
    name: string;
    amount: number;
    cycle: 'monthly' | 'yearly';
    billingDay: number; // 1-31
    category: string;
    icon: string;
    color: string;
    notes?: string;
}

interface RecurringBillsSectionProps {
    bills: RecurringBillItem[];
    activeCurrency?: string;
    currencyLocale?: string;
    onOpenAddModal: () => void;
    onEditBill: (bill: RecurringBillItem) => void;
    onDeleteBill: (id: string) => void;
    onPayAndLog: (bill: RecurringBillItem) => void;
    paidBillIdsThisMonth?: string[];
}

export default function RecurringBillsSection({
    bills = [],
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID',
    onOpenAddModal,
    onEditBill,
    onDeleteBill,
    onPayAndLog,
    paidBillIdsThisMonth = []
}: RecurringBillsSectionProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    // Calculate Totals
    const { totalMonthlyBurn, totalYearlyCost } = useMemo(() => {
        let monthly = 0;
        let yearly = 0;

        bills.forEach(b => {
            const amt = Number(b.amount) || 0;
            if (b.cycle === 'yearly') {
                monthly += amt / 12;
                yearly += amt;
            } else {
                monthly += amt;
                yearly += amt * 12;
            }
        });

        return {
            totalMonthlyBurn: Math.round(monthly),
            totalYearlyCost: Math.round(yearly)
        };
    }, [bills]);

    const todayDay = new Date().getDate();

    const getDueStatus = (billingDay: number) => {
        const diff = billingDay - todayDay;
        if (diff === 0) {
            return {
                text: isIndo ? 'Jatuh tempo HARI INI!' : 'Due TODAY!',
                badgeColor: 'bg-rose-500 text-white animate-pulse',
                urgent: true
            };
        }
        if (diff > 0 && diff <= 3) {
            return {
                text: isIndo ? `${diff} hari lagi` : `In ${diff} days`,
                badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50',
                urgent: true
            };
        }
        if (diff > 3) {
            return {
                text: isIndo ? `${diff} hari lagi` : `In ${diff} days`,
                badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                urgent: false
            };
        }
        // diff < 0 (already passed this month)
        const daysToNextMonth = 30 + diff;
        return {
            text: isIndo ? `Bulan depan (${daysToNextMonth} hr)` : `Next month (${daysToNextMonth}d)`,
            badgeColor: 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 opacity-80',
            urgent: false
        };
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-5 sm:p-7 border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 relative overflow-hidden transition-all">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                        <Repeat size={13} /> {isIndo ? 'Langganan & Beban Rutin' : 'Recurring Subscriptions & Bills'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Pelacak Tagihan Otomatis' : 'Recurring Subscriptions Hub'}
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpenAddModal}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition active:scale-95 shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>{isIndo ? 'Tambah Tagihan' : 'Add Recurring'}</span>
                    </button>
                </div>
            </div>

            {/* Summary Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-3xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                <div className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 font-black">
                        🔄
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-purple-800 dark:text-purple-300">
                            {isIndo ? 'Total Beban Bulanan' : 'Monthly Recurring Burn'}
                        </p>
                        <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
                            {formatMoney(totalMonthlyBurn)} <span className="text-xs font-bold text-slate-400">/bln</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-purple-200/50 dark:border-purple-900/30">
                    <div className="sm:text-right">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {isIndo ? 'Estimasi Biaya Setahun' : 'Annualized Cost'}
                        </p>
                        <p className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">
                            {formatMoney(totalYearlyCost)} <span className="text-xs font-normal opacity-75">/thn</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bills Cards Grid */}
            {bills.length === 0 ? (
                <div className="text-center py-10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center mx-auto mb-3 text-2xl">
                        🍿
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {isIndo ? 'Belum ada langganan atau tagihan rutin' : 'No recurring subscriptions added yet'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                        {isIndo ? 'Catat langganan seperti Netflix, ChatGPT, Spotify, WiFi, atau Kost agar pengingat & kalkulasi beban tahunanmu otomatis!' : 'Track subscriptions like Netflix, ChatGPT, WiFi, or rent to monitor annualized costs!'}
                    </p>
                    <button
                        onClick={onOpenAddModal}
                        className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-black text-xs hover:bg-purple-200 transition"
                    >
                        + {isIndo ? 'Tambah Langganan Pertama' : 'Add First Subscription'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {bills.map(bill => {
                        const dueInfo = getDueStatus(bill.billingDay);
                        const isPaid = paidBillIdsThisMonth.includes(bill.id);

                        return (
                            <div
                                key={bill.id}
                                className="group p-4 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all flex flex-col justify-between gap-3 relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div 
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: `${bill.color}15`, color: bill.color }}
                                        >
                                            {bill.icon || '💳'}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                                {bill.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 capitalize">
                                                    {bill.category}
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                                                    {isIndo ? `Tgl ${bill.billingDay}` : `Day ${bill.billingDay}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white font-mono">
                                            {formatMoney(bill.amount)}
                                        </div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">
                                            /{bill.cycle === 'yearly' ? (isIndo ? 'tahun' : 'yr') : (isIndo ? 'bulan' : 'mo')}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row: Due Status Badge & Quick Actions */}
                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${dueInfo.badgeColor}`}>
                                        <Clock size={11} />
                                        <span>{dueInfo.text}</span>
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        {/* 1-Click Pay & Log Action */}
                                        <button
                                            onClick={() => onPayAndLog(bill)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all active:scale-95 ${
                                                isPaid 
                                                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' 
                                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-purple-500/20'
                                            }`}
                                            title="Catat tagihan ini ke transaksi bulan ini"
                                        >
                                            {isPaid ? (
                                                <>
                                                    <CheckCircle2 size={13} />
                                                    <span>{isIndo ? 'Tercatat' : 'Logged'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Zap size={13} />
                                                    <span>{isIndo ? '⚡ Catat Bayar' : '⚡ Log Paid'}</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onEditBill(bill);
                                            }}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                            title="Edit"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onDeleteBill(bill.id);
                                            }}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                            title="Hapus"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}
