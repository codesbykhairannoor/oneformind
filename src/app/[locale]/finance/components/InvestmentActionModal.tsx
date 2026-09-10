'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
    X, 
    RefreshCw, 
    PlusCircle, 
    ArrowUpRight, 
    ArrowDownRight, 
    CheckCircle2, 
    TrendingUp, 
    DollarSign,
    Gift,
    Coins,
    Calculator,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { InvestmentAssetItem } from './InvestmentPortfolioSection';
import { WalletOption } from '../types';

export type InvestmentActionMode = 'revalue' | 'topup' | 'withdraw' | 'dividend';

export interface InvestmentActionResult {
    assetId: string | number;
    mode: InvestmentActionMode;
    
    // Lump-sum / Raw amount
    amount?: number;
    
    // Unit-based transaction data
    unitsDelta?: number;
    pricePerUnit?: number;
    
    // Resulting updated asset fields
    newCapital: number;
    newCurrentValue: number;
    newUnits?: number;
    newAvgBuyPrice?: number;
    newCurrentPrice?: number;
    newTotalDividends?: number;
    
    // Cashflow integration
    cashflowAmount: number;
    logCashflow: boolean;
    walletId?: string;
    date: string;
    notes?: string;
}

interface InvestmentActionModalProps {
    show: boolean;
    asset: InvestmentAssetItem | null;
    mode: InvestmentActionMode;
    wallets?: WalletOption[];
    onClose: () => void;
    onExecute: (result: InvestmentActionResult) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function InvestmentActionModal({
    show,
    asset,
    mode,
    wallets = [],
    onClose,
    onExecute,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: InvestmentActionModalProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);
    const todayStr = new Date().toISOString().split('T')[0];

    // Form states
    const [actionUnits, setActionUnits] = useState('');
    const [actionPrice, setActionPrice] = useState('');
    const [rawAmount, setRawAmount] = useState('');
    const [walletId, setWalletId] = useState('');
    const [logCashflow, setLogCashflow] = useState(true);
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(todayStr);

    const isUnitBased = asset?.inputMode === 'units' || !!asset?.units;
    const unitType = asset?.unitType || (asset?.type === 'stocks' ? 'lot' : 'unit');
    const multiplier = unitType === 'lot' ? 100 : 1;

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const str = val.toString();
        return isDotSeparator ? str.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleMoneyChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const clean = isDotSeparator ? raw.replace(/\./g, '') : raw.replace(/,/g, '');
        if (!isNaN(Number(clean)) || clean === '') {
            setter(clean);
        }
    };

    const handleDecimalChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '.');
        if (/^\d*\.?\d*$/.test(raw)) {
            setter(raw);
        }
    };

    useEffect(() => {
        if (show && asset) {
            setDate(todayStr);
            setNotes('');
            setActionUnits('');
            setWalletId(wallets[0]?.id || '');

            if (mode === 'revalue') {
                if (isUnitBased) {
                    setActionPrice(String(asset.currentPrice || asset.avgBuyPrice || ''));
                } else {
                    setRawAmount(String(asset.currentValue || asset.capital || ''));
                }
                setLogCashflow(false);
            } else if (mode === 'topup') {
                if (isUnitBased) {
                    setActionPrice(String(asset.currentPrice || asset.avgBuyPrice || ''));
                } else {
                    setRawAmount('');
                }
                setLogCashflow(true);
            } else if (mode === 'withdraw') {
                if (isUnitBased) {
                    setActionPrice(String(asset.currentPrice || asset.avgBuyPrice || ''));
                } else {
                    setRawAmount('');
                }
                setLogCashflow(true);
            } else if (mode === 'dividend') {
                setRawAmount('');
                setLogCashflow(true);
            }
        }
    }, [show, asset, mode, isUnitBased, todayStr]);

    // Live Math Computations
    const calculations = useMemo(() => {
        if (!asset) return null;

        const curUnits = asset.units || 0;
        const curAvgPrice = asset.avgBuyPrice || 0;
        const curMarketPrice = asset.currentPrice || curAvgPrice;
        const curCapital = asset.capital || 0;
        const curVal = asset.currentValue || 0;
        const curDividends = asset.totalDividends || 0;

        if (mode === 'revalue') {
            if (isUnitBased) {
                const newMktPrice = parseFloat(actionPrice) || curMarketPrice;
                const newTotalVal = (curUnits * multiplier) * newMktPrice;
                const newPL = newTotalVal - curCapital;
                const newROI = curCapital > 0 ? (newPL / curCapital) * 100 : 0;

                return {
                    newCapital: curCapital,
                    newCurrentValue: Math.round(newTotalVal),
                    newUnits: curUnits,
                    newAvgBuyPrice: curAvgPrice,
                    newCurrentPrice: newMktPrice,
                    cashflowAmount: 0,
                    pl: newPL,
                    roi: newROI,
                    isValid: newMktPrice > 0
                };
            } else {
                const newTotalVal = parseFloat(rawAmount) || 0;
                const newPL = newTotalVal - curCapital;
                const newROI = curCapital > 0 ? (newPL / curCapital) * 100 : 0;

                return {
                    newCapital: curCapital,
                    newCurrentValue: Math.round(newTotalVal),
                    cashflowAmount: 0,
                    pl: newPL,
                    roi: newROI,
                    isValid: newTotalVal > 0
                };
            }
        }

        if (mode === 'topup') {
            if (isUnitBased) {
                const addUnits = parseFloat(actionUnits) || 0;
                const buyPrice = parseFloat(actionPrice) || 0;
                const totalCostAdded = (addUnits * multiplier) * buyPrice;

                const newTotalUnits = curUnits + addUnits;
                const newTotalNormalized = newTotalUnits * multiplier;
                const newTotalCap = curCapital + totalCostAdded;
                const newWeightedAvg = newTotalNormalized > 0 ? newTotalCap / newTotalNormalized : buyPrice;
                const newTotalVal = newTotalNormalized * curMarketPrice;
                const newPL = newTotalVal - newTotalCap;
                const newROI = newTotalCap > 0 ? (newPL / newTotalCap) * 100 : 0;

                return {
                    newCapital: Math.round(newTotalCap),
                    newCurrentValue: Math.round(newTotalVal),
                    newUnits: newTotalUnits,
                    newAvgBuyPrice: newWeightedAvg,
                    newCurrentPrice: curMarketPrice,
                    cashflowAmount: Math.round(totalCostAdded),
                    pl: newPL,
                    roi: newROI,
                    isValid: addUnits > 0 && buyPrice > 0
                };
            } else {
                const addAmount = parseFloat(rawAmount) || 0;
                const newTotalCap = curCapital + addAmount;
                const newTotalVal = curVal + addAmount;
                const newPL = newTotalVal - newTotalCap;
                const newROI = newTotalCap > 0 ? (newPL / newTotalCap) * 100 : 0;

                return {
                    newCapital: Math.round(newTotalCap),
                    newCurrentValue: Math.round(newTotalVal),
                    cashflowAmount: Math.round(addAmount),
                    pl: newPL,
                    roi: newROI,
                    isValid: addAmount > 0
                };
            }
        }

        if (mode === 'withdraw') {
            if (isUnitBased) {
                const sellUnits = parseFloat(actionUnits) || 0;
                const sellPrice = parseFloat(actionPrice) || 0;
                const cashProceeds = (sellUnits * multiplier) * sellPrice;
                const costOfSold = (sellUnits * multiplier) * curAvgPrice;
                const realizedPL = cashProceeds - costOfSold;

                const remainingUnits = Math.max(0, curUnits - sellUnits);
                const remainingCap = Math.max(0, (remainingUnits * multiplier) * curAvgPrice);
                const remainingVal = Math.max(0, (remainingUnits * multiplier) * curMarketPrice);
                const remainingPL = remainingVal - remainingCap;
                const remainingROI = remainingCap > 0 ? (remainingPL / remainingCap) * 100 : 0;

                return {
                    newCapital: Math.round(remainingCap),
                    newCurrentValue: Math.round(remainingVal),
                    newUnits: remainingUnits,
                    newAvgBuyPrice: curAvgPrice,
                    newCurrentPrice: curMarketPrice,
                    cashflowAmount: Math.round(cashProceeds),
                    realizedPL,
                    pl: remainingPL,
                    roi: remainingROI,
                    isValid: sellUnits > 0 && sellUnits <= curUnits && sellPrice > 0
                };
            } else {
                const withdrawAmount = parseFloat(rawAmount) || 0;
                const ratio = curVal > 0 ? Math.min(1, withdrawAmount / curVal) : 0;
                const newTotalCap = Math.max(0, curCapital * (1 - ratio));
                const newTotalVal = Math.max(0, curVal - withdrawAmount);
                const newPL = newTotalVal - newTotalCap;
                const newROI = newTotalCap > 0 ? (newPL / newTotalCap) * 100 : 0;

                return {
                    newCapital: Math.round(newTotalCap),
                    newCurrentValue: Math.round(newTotalVal),
                    cashflowAmount: Math.round(withdrawAmount),
                    pl: newPL,
                    roi: newROI,
                    isValid: withdrawAmount > 0 && withdrawAmount <= curVal
                };
            }
        }

        if (mode === 'dividend') {
            const divAmount = parseFloat(rawAmount) || 0;
            return {
                newCapital: curCapital,
                newCurrentValue: curVal,
                newTotalDividends: curDividends + divAmount,
                cashflowAmount: Math.round(divAmount),
                pl: curVal - curCapital,
                roi: curCapital > 0 ? ((curVal - curCapital) / curCapital) * 100 : 0,
                isValid: divAmount > 0
            };
        }

        return null;
    }, [asset, mode, isUnitBased, actionUnits, actionPrice, rawAmount, multiplier]);

    if (!show || !asset || !calculations) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!calculations.isValid) return;

        onExecute({
            assetId: asset.id,
            mode,
            amount: calculations.cashflowAmount,
            unitsDelta: isUnitBased ? parseFloat(actionUnits) : undefined,
            pricePerUnit: isUnitBased ? parseFloat(actionPrice) : undefined,
            newCapital: calculations.newCapital,
            newCurrentValue: calculations.newCurrentValue,
            newUnits: calculations.newUnits,
            newAvgBuyPrice: calculations.newAvgBuyPrice,
            newCurrentPrice: calculations.newCurrentPrice,
            newTotalDividends: calculations.newTotalDividends,
            cashflowAmount: calculations.cashflowAmount,
            logCashflow: mode === 'revalue' ? false : logCashflow,
            walletId: mode === 'revalue' ? undefined : (walletId || wallets[0]?.id),
            date,
            notes: notes.trim() || undefined
        });

        onClose();
    };

    const getTitle = () => {
        switch (mode) {
            case 'revalue': return isIndo ? 'Update Harga Pasar Terkini' : 'Update Current Market Price';
            case 'topup': return isIndo ? 'Top-Up / Beli Saham & Aset' : 'Buy More / Top-Up Asset';
            case 'withdraw': return isIndo ? 'Jual / Cairkan Aset' : 'Sell / Cash Out Asset';
            case 'dividend': return isIndo ? 'Catat Pembagian Dividen' : 'Record Dividend Payout';
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="p-5 sm:p-7 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                                style={{ backgroundColor: `${asset.color || '#10b981'}15`, color: asset.color || '#10b981' }}
                            >
                                {asset.icon || '📈'}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {getTitle()}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {asset.name} {asset.ticker ? `(${asset.ticker})` : ''}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-95"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-7 space-y-4">
                        
                        {/* Current Asset Overview Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            {isUnitBased && (
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{isIndo ? 'Kepemilikan' : 'Holdings'}</span>
                                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                                        {asset.units} {unitType === 'lot' ? `Lot (${(asset.units || 0) * 100} lbr)` : unitType}
                                    </span>
                                </div>
                            )}
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{isIndo ? 'Modal Beli' : 'Cost Basis'}</span>
                                <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{formatMoney(asset.capital)}</span>
                            </div>
                            <div className="text-right sm:text-left">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{isIndo ? 'Nilai Saat Ini' : 'Current Value'}</span>
                                <span className="font-black font-mono text-emerald-600 dark:text-emerald-400">{formatMoney(asset.currentValue)}</span>
                            </div>
                        </div>

                        {/* MODE 1: REVALUE */}
                        {mode === 'revalue' && (
                            <div className="space-y-3">
                                {isUnitBased ? (
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? `Harga Pasar Baru (per ${unitType === 'lot' ? 'lembar saham' : unitType})` : `New Market Price (per ${unitType})`} ({activeCurrency})
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            value={formatDisplay(actionPrice)}
                                            onChange={handleMoneyChange(setActionPrice)}
                                            placeholder="0"
                                            className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xl transition-all"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? 'Total Nilai Portofolio Baru' : 'New Total Market Valuation'} ({activeCurrency})
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            value={formatDisplay(rawAmount)}
                                            onChange={handleMoneyChange(setRawAmount)}
                                            placeholder="0"
                                            className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xl transition-all"
                                        />
                                    </div>
                                )}

                                {/* Quick Percentage Presets */}
                                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                                    {[
                                        { label: '-10%', mult: 0.9 },
                                        { label: '-5%', mult: 0.95 },
                                        { label: '-2%', mult: 0.98 },
                                        { label: '+2%', mult: 1.02 },
                                        { label: '+5%', mult: 1.05 },
                                        { label: '+10%', mult: 1.1 }
                                    ].map((p, idx) => {
                                        const baseVal = isUnitBased ? (asset.currentPrice || asset.avgBuyPrice || 0) : asset.currentValue;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    const target = Math.round(baseVal * p.mult);
                                                    if (isUnitBased) setActionPrice(String(target));
                                                    else setRawAmount(String(target));
                                                }}
                                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition shrink-0"
                                            >
                                                {p.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* MODE 2: TOP-UP (BUY MORE / DCA) */}
                        {mode === 'topup' && (
                            <div className="space-y-3">
                                {isUnitBased ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                                {isIndo ? `Jumlah Beli (${unitType === 'lot' ? 'Lot' : unitType})` : `Quantity to Buy (${unitType})`}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                autoFocus
                                                value={actionUnits}
                                                onChange={handleDecimalChange(setActionUnits)}
                                                placeholder="cth: 1"
                                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-800 dark:text-white font-mono font-bold text-base"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                                {isIndo ? `Harga Beli (per ${unitType === 'lot' ? 'lbr' : unitType})` : `Buy Price (per ${unitType})`}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formatDisplay(actionPrice)}
                                                onChange={handleMoneyChange(setActionPrice)}
                                                placeholder="0"
                                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-800 dark:text-white font-mono font-bold text-base"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? 'Nominal Top-Up / Tambah Modal' : 'Top-Up Capital Amount'} ({activeCurrency})
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            value={formatDisplay(rawAmount)}
                                            onChange={handleMoneyChange(setRawAmount)}
                                            placeholder="0"
                                            className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-slate-800 dark:text-white font-mono font-black text-xl transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODE 3: WITHDRAW (SELL / LIQUIDATE) */}
                        {mode === 'withdraw' && (
                            <div className="space-y-3">
                                {isUnitBased ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                                    {isIndo ? `Jumlah Jual (${unitType === 'lot' ? 'Lot' : unitType})` : `Units to Sell (${unitType})`}
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setActionUnits(String(asset.units || ''))}
                                                    className="text-[10px] font-bold text-emerald-600 hover:underline"
                                                >
                                                    {isIndo ? 'Jual Semua' : 'Sell All'} ({asset.units} {unitType})
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                autoFocus
                                                value={actionUnits}
                                                onChange={handleDecimalChange(setActionUnits)}
                                                placeholder={`Maks: ${asset.units}`}
                                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-800 dark:text-white font-mono font-bold text-base"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                                {isIndo ? `Harga Jual (per ${unitType === 'lot' ? 'lbr' : unitType})` : `Selling Price (per ${unitType})`}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formatDisplay(actionPrice)}
                                                onChange={handleMoneyChange(setActionPrice)}
                                                placeholder="0"
                                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-800 dark:text-white font-mono font-bold text-base"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                                {isIndo ? 'Nominal Pencairan / Penjualan' : 'Liquidation Amount'} ({activeCurrency})
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setRawAmount(String(asset.currentValue || ''))}
                                                className="text-[10px] font-bold text-emerald-600 hover:underline"
                                            >
                                                {isIndo ? 'Cairkan Semua' : 'Liquidate All'} ({formatMoney(asset.currentValue)})
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            value={formatDisplay(rawAmount)}
                                            onChange={handleMoneyChange(setRawAmount)}
                                            placeholder={`Maks: ${formatDisplay(String(asset.currentValue))}`}
                                            className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-slate-800 dark:text-white font-mono font-black text-xl transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MODE 4: DIVIDEND */}
                        {mode === 'dividend' && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Total Pembagian Dividen Diterima' : 'Dividend Payout Received'} ({activeCurrency})
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={formatDisplay(rawAmount)}
                                    onChange={handleMoneyChange(setRawAmount)}
                                    placeholder="0"
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-amber-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-amber-600 dark:text-amber-400 font-mono font-black text-xl transition-all"
                                />
                            </div>
                        )}

                        {/* LIVE PREVIEW BOX */}
                        {calculations.isValid && (
                            <div className="p-4 rounded-3xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                    <span className="flex items-center gap-1.5">
                                        <Sparkles size={13} className="text-emerald-500" />
                                        {isIndo ? 'Hasil Simulasi Portofolio Baru:' : 'Simulated Portfolio Outcome:'}
                                    </span>
                                    {calculations.cashflowAmount > 0 && (
                                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                            {mode === 'topup' ? `-${formatMoney(calculations.cashflowAmount)} (Kas Keluar)` : `+${formatMoney(calculations.cashflowAmount)} (Kas Masuk)`}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{isIndo ? 'Modal Baru (Cost Basis)' : 'New Cost Basis'}</span>
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatMoney(calculations.newCapital)}</span>
                                        {isUnitBased && calculations.newAvgBuyPrice && (
                                            <span className="text-[9px] text-slate-400 block font-mono">
                                                (Avg: {formatMoney(calculations.newAvgBuyPrice)})
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{isIndo ? 'Nilai Pasar Baru' : 'New Market Value'}</span>
                                        <span className="font-mono font-black text-slate-900 dark:text-white">{formatMoney(calculations.newCurrentValue)}</span>
                                        {isUnitBased && (
                                            <span className="text-[9px] text-slate-400 block font-mono">
                                                ({calculations.newUnits} {unitType})
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {mode === 'withdraw' && (calculations as any).realizedPL !== undefined && (
                                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px]">
                                        <span className="font-bold text-slate-500">{isIndo ? 'Keuntungan Realisasi (Realized Gain):' : 'Realized Gain/Loss:'}</span>
                                        <span className={`font-mono font-bold ${(calculations as any).realizedPL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {(calculations as any).realizedPL >= 0 ? '+' : ''}{formatMoney((calculations as any).realizedPL)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Log to Cashflow Checkbox & Wallet Selection */}
                        {mode !== 'revalue' && (
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:bg-slate-100/70 transition">
                                    <input
                                        type="checkbox"
                                        checked={logCashflow}
                                        onChange={(e) => setLogCashflow(e.target.checked)}
                                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                    />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {mode === 'topup' && (isIndo ? 'Otomatis catat sebagai Pengeluaran (Investasi) di Arus Kas' : 'Log as Expense (Investment) in Cashflow')}
                                        {mode === 'withdraw' && (isIndo ? 'Otomatis catat sebagai Pemasukan (Pencairan) di Arus Kas' : 'Log as Income (Liquidation) in Cashflow')}
                                        {mode === 'dividend' && (isIndo ? 'Otomatis catat sebagai Pemasukan (Dividen) di Arus Kas' : 'Log as Income (Dividend) in Cashflow')}
                                    </span>
                                </label>

                                {logCashflow && wallets.length > 0 && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                            {mode === 'topup' 
                                                ? (isIndo ? 'Sumber Dana (Potong Dompet)' : 'Source Wallet') 
                                                : (isIndo ? 'Tujuan Dana (Masuk Dompet)' : 'Destination Wallet')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={walletId}
                                                onChange={(e) => setWalletId(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white transition-all appearance-none cursor-pointer"
                                            >
                                                {wallets.map((w) => (
                                                    <option key={w.id} value={w.id}>
                                                        {w.icon || '💳'} {w.name} ({formatMoney(w.balance)})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Note & Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{isIndo ? 'Tanggal' : 'Date'}</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-3 py-2 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{isIndo ? 'Catatan Mutasi' : 'Notes'}</label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={isIndo ? "cth: Beli cicil DCA / Dividen Final" : "e.g. DCA / Final Dividend"}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-3 py-2 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                            >
                                {t('btn_cancel') || (isIndo ? 'Batal' : 'Cancel')}
                            </button>

                            <button
                                type="submit"
                                disabled={!calculations.isValid}
                                className={`px-6 py-3 rounded-2xl text-white font-black text-xs shadow-lg transition active:scale-95 disabled:opacity-50 disabled:grayscale ${
                                    mode === 'withdraw'
                                        ? 'bg-rose-600 shadow-rose-600/20 hover:bg-rose-700'
                                        : mode === 'dividend'
                                        ? 'bg-amber-600 shadow-amber-600/20 hover:bg-amber-700'
                                        : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'
                                }`}
                            >
                                {mode === 'revalue' && (isIndo ? 'Update Nilai Sekarang' : 'Update Value')}
                                {mode === 'topup' && (isIndo ? 'Konfirmasi Beli / Top-Up' : 'Confirm Buy / Top-Up')}
                                {mode === 'withdraw' && (isIndo ? 'Konfirmasi Jual / Cairkan' : 'Confirm Sell / Liquidate')}
                                {mode === 'dividend' && (isIndo ? 'Simpan Dividen' : 'Save Dividend')}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
