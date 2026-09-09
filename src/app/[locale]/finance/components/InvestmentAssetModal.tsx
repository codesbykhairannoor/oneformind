'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
    X, 
    TrendingUp, 
    Coins, 
    Building2, 
    HelpCircle, 
    Layers, 
    Calculator,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Check
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { InvestmentAssetItem } from './InvestmentPortfolioSection';

interface InvestmentAssetModalProps {
    show: boolean;
    editingAsset: InvestmentAssetItem | null;
    onClose: () => void;
    onSave: (asset: InvestmentAssetItem) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function InvestmentAssetModal({
    show,
    editingAsset,
    onClose,
    onSave,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: InvestmentAssetModalProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);

    // Form States
    const [name, setName] = useState('');
    const [type, setType] = useState<InvestmentAssetItem['type']>('stocks');
    const [ticker, setTicker] = useState('');
    const [inputMode, setInputMode] = useState<'units' | 'lumpsum'>('units');
    const [unitType, setUnitType] = useState<'lot' | 'shares' | 'gram' | 'coin' | 'unit'>('lot');
    const [units, setUnits] = useState('');
    const [avgBuyPrice, setAvgBuyPrice] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [capital, setCapital] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [broker, setBroker] = useState('');
    const [icon, setIcon] = useState('📈');
    const [color, setColor] = useState('#3b82f6');
    const [notes, setNotes] = useState('');

    const assetTypes: { id: InvestmentAssetItem['type']; label: string; icon: string; defaultColor: string; defaultMode: 'units' | 'lumpsum'; defaultUnit: 'lot' | 'shares' | 'gram' | 'coin' | 'unit' }[] = [
        { id: 'stocks', label: isIndo ? 'Saham' : 'Stocks', icon: '📈', defaultColor: '#3b82f6', defaultMode: 'units', defaultUnit: 'lot' },
        { id: 'mutual_funds', label: isIndo ? 'Reksadana' : 'Mutual Funds', icon: '🏦', defaultColor: '#10b981', defaultMode: 'lumpsum', defaultUnit: 'unit' },
        { id: 'crypto', label: 'Crypto', icon: '🪙', defaultColor: '#f59e0b', defaultMode: 'units', defaultUnit: 'coin' },
        { id: 'gold', label: isIndo ? 'Emas / Logam' : 'Gold', icon: '🪙', defaultColor: '#eab308', defaultMode: 'units', defaultUnit: 'gram' },
        { id: 'real_estate', label: isIndo ? 'Properti / Bisnis' : 'Property', icon: '🏢', defaultColor: '#8b5cf6', defaultMode: 'lumpsum', defaultUnit: 'unit' },
        { id: 'other', label: isIndo ? 'Lainnya' : 'Other', icon: '📦', defaultColor: '#64748b', defaultMode: 'lumpsum', defaultUnit: 'unit' }
    ];

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#eab308', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

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
        if (editingAsset) {
            setName(editingAsset.name || '');
            setType(editingAsset.type || 'stocks');
            setTicker(editingAsset.ticker || '');
            setInputMode(editingAsset.inputMode || (editingAsset.units ? 'units' : 'lumpsum'));
            setUnitType(editingAsset.unitType || (editingAsset.type === 'stocks' ? 'lot' : editingAsset.type === 'crypto' ? 'coin' : editingAsset.type === 'gold' ? 'gram' : 'unit'));
            setUnits(editingAsset.units !== undefined ? String(editingAsset.units) : '');
            setAvgBuyPrice(editingAsset.avgBuyPrice !== undefined ? String(editingAsset.avgBuyPrice) : '');
            setCurrentPrice(editingAsset.currentPrice !== undefined ? String(editingAsset.currentPrice) : '');
            setCapital(String(editingAsset.capital || ''));
            setCurrentValue(String(editingAsset.currentValue || ''));
            setBroker(editingAsset.broker || '');
            setIcon(editingAsset.icon || '📈');
            setColor(editingAsset.color || '#3b82f6');
            setNotes(editingAsset.notes || '');
        } else {
            setName('');
            setType('stocks');
            setTicker('');
            setInputMode('units');
            setUnitType('lot');
            setUnits('');
            setAvgBuyPrice('');
            setCurrentPrice('');
            setCapital('');
            setCurrentValue('');
            setBroker('');
            setIcon('📈');
            setColor('#3b82f6');
            setNotes('');
        }
    }, [editingAsset, show]);

    const handleTypeSelect = (selectedType: InvestmentAssetItem['type']) => {
        setType(selectedType);
        const match = assetTypes.find(t => t.id === selectedType);
        if (match) {
            setIcon(match.icon);
            if (!editingAsset) {
                setColor(match.defaultColor);
                setInputMode(match.defaultMode);
                setUnitType(match.defaultUnit);
            }
        }
    };

    // Live Calculation Math
    const calculatedMetrics = useMemo(() => {
        if (inputMode === 'units') {
            const numUnits = parseFloat(units) || 0;
            const numAvgBuy = parseFloat(avgBuyPrice) || 0;
            const numCurPrice = parseFloat(currentPrice) || numAvgBuy;

            // Multiplier for Lot (1 lot = 100 shares in IDX)
            const multiplier = unitType === 'lot' ? 100 : 1;
            const totalNormalizedUnits = numUnits * multiplier;

            const calcCapital = totalNormalizedUnits * numAvgBuy;
            const calcCurrentValue = totalNormalizedUnits * numCurPrice;
            const calcPL = calcCurrentValue - calcCapital;
            const calcROI = calcCapital > 0 ? (calcPL / calcCapital) * 100 : 0;

            return {
                totalUnitsNormalized: totalNormalizedUnits,
                capital: calcCapital,
                currentValue: calcCurrentValue,
                pl: calcPL,
                roi: calcROI,
                isValid: numUnits > 0 && numAvgBuy > 0
            };
        } else {
            const numCap = parseFloat(capital) || 0;
            const numCur = currentValue !== '' ? parseFloat(currentValue) : numCap;
            const calcPL = numCur - numCap;
            const calcROI = numCap > 0 ? (calcPL / numCap) * 100 : 0;

            return {
                totalUnitsNormalized: 1,
                capital: numCap,
                currentValue: numCur,
                pl: calcPL,
                roi: calcROI,
                isValid: numCap > 0
            };
        }
    }, [inputMode, unitType, units, avgBuyPrice, currentPrice, capital, currentValue]);

    if (!show) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        let finalCapital = calculatedMetrics.capital;
        let finalCurrentValue = calculatedMetrics.currentValue;

        if (inputMode === 'units') {
            const numUnits = parseFloat(units) || 0;
            const numAvgBuy = parseFloat(avgBuyPrice) || 0;
            const numCurPrice = parseFloat(currentPrice) || numAvgBuy;

            onSave({
                id: editingAsset?.id || `inv_${Date.now()}`,
                name: name.trim(),
                type,
                ticker: ticker.trim().toUpperCase() || undefined,
                inputMode: 'units',
                unitType,
                units: numUnits,
                sharesCount: calculatedMetrics.totalUnitsNormalized,
                avgBuyPrice: numAvgBuy,
                currentPrice: numCurPrice,
                capital: Math.round(finalCapital),
                currentValue: Math.round(finalCurrentValue),
                broker: broker.trim() || undefined,
                icon,
                color,
                notes: notes.trim() || undefined,
                totalDividends: editingAsset?.totalDividends || 0
            });
        } else {
            onSave({
                id: editingAsset?.id || `inv_${Date.now()}`,
                name: name.trim(),
                type,
                ticker: ticker.trim().toUpperCase() || undefined,
                inputMode: 'lumpsum',
                capital: Math.round(finalCapital),
                currentValue: Math.round(finalCurrentValue),
                broker: broker.trim() || undefined,
                icon,
                color,
                notes: notes.trim() || undefined,
                totalDividends: editingAsset?.totalDividends || 0
            });
        }

        onClose();
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="p-5 sm:p-7 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {editingAsset ? (isIndo ? 'Edit Instrumen Investasi' : 'Edit Investment Asset') : (isIndo ? 'Tambah Instrumen Portofolio' : 'Add Investment Asset')}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                                    {isIndo ? 'Kalkulasi harga beli, unit/lot, dan floating profit presisi' : 'Accurate cost basis, units/lots & real floating P/L'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-7 space-y-5">
                        
                        {/* Asset Type Selector */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? '1. Kategori Instrumen' : '1. Asset Category'}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {assetTypes.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => handleTypeSelect(t.id)}
                                        className={`p-2.5 sm:p-3 rounded-2xl border text-left flex items-center gap-2 transition-all text-xs font-bold ${
                                            type === t.id
                                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                        }`}
                                    >
                                        <span className="text-base sm:text-lg">{t.icon}</span>
                                        <span className="truncate">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name & Ticker */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Nama Aset / Perusahaan' : 'Asset / Security Name'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={isIndo ? "cth: Bank Central Asia / Antam" : "e.g. Apple Inc / S&P500"}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-800 dark:text-white font-bold text-sm transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Kode / Ticker' : 'Ticker (Opt)'}
                                </label>
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                    placeholder="BBCA / BTC"
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-800 dark:text-white font-mono font-black text-sm uppercase transition-all"
                                />
                            </div>
                        </div>

                        {/* Mode Switcher: Unit-Based vs Lump-Sum */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                <span>{isIndo ? '2. Mode Perhitungan' : '2. Calculation Method'}</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold lowercase">
                                    {inputMode === 'units' ? (isIndo ? 'rekomendasi untuk saham & kripto' : 'recommended for stocks & crypto') : (isIndo ? 'rekomendasi untuk reksadana' : 'recommended for mutual funds')}
                                </span>
                            </label>

                            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
                                <button
                                    type="button"
                                    onClick={() => setInputMode('units')}
                                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                                        inputMode === 'units'
                                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                                    }`}
                                >
                                    <Calculator size={14} />
                                    <span>{isIndo ? 'Unit / Lot / Lembar' : 'By Units / Lots'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInputMode('lumpsum')}
                                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                                        inputMode === 'lumpsum'
                                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                                    }`}
                                >
                                    <Layers size={14} />
                                    <span>{isIndo ? 'Lump-Sum / Saldo Total' : 'Lump-Sum Total'}</span>
                                </button>
                            </div>
                        </div>

                        {/* MODE A: UNIT-BASED INPUTS (Stocks, Crypto, Gold, Units) */}
                        {inputMode === 'units' && (
                            <div className="p-4 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
                                
                                {/* Unit Type Selection */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                        {isIndo ? 'Satuan Kepemilikan' : 'Unit Type'}
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {[
                                            { id: 'lot', label: isIndo ? 'Lot (100 lbr)' : 'Lot (100 sh)' },
                                            { id: 'shares', label: isIndo ? 'Lembar' : 'Shares' },
                                            { id: 'gram', label: 'Gram' },
                                            { id: 'coin', label: 'Coin' }
                                        ].map(u => (
                                            <button
                                                key={u.id}
                                                type="button"
                                                onClick={() => setUnitType(u.id as any)}
                                                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                                                    unitType === u.id
                                                        ? 'bg-emerald-500 text-white shadow-sm'
                                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                {u.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Unit Quantity & Prices */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? 'Jumlah Kepemilikan' : 'Quantity'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={units}
                                            onChange={handleDecimalChange(setUnits)}
                                            placeholder={unitType === 'lot' ? 'cth: 2' : unitType === 'gram' ? 'cth: 10' : 'cth: 0.05'}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-mono font-bold text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? 'Harga Beli (Avg)' : 'Avg Buy Price'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formatDisplay(avgBuyPrice)}
                                            onChange={handleMoneyChange(setAvgBuyPrice)}
                                            placeholder={unitType === 'lot' ? 'Rp 9.500/lbr' : '0'}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-mono font-bold text-sm"
                                        />
                                        <span className="text-[9px] text-slate-400 block">
                                            {unitType === 'lot' ? (isIndo ? '*per lembar saham' : '*per share') : (isIndo ? `*per ${unitType}` : `*per ${unitType}`)}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? 'Harga Pasar Terkini' : 'Market Price'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formatDisplay(currentPrice)}
                                            onChange={handleMoneyChange(setCurrentPrice)}
                                            placeholder={formatDisplay(avgBuyPrice) || '0'}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm"
                                        />
                                        <span className="text-[9px] text-slate-400 block">
                                            {isIndo ? 'harga saat ini' : 'current market price'}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* MODE B: LUMP-SUM INPUTS (Mutual Funds, Property) */}
                        {inputMode === 'lumpsum' && (
                            <div className="p-4 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                        {isIndo ? 'Total Modal Awal / Beli' : 'Total Cost Basis (Capital)'} ({activeCurrency})
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formatDisplay(capital)}
                                        onChange={handleMoneyChange(setCapital)}
                                        placeholder="0"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3 text-slate-800 dark:text-white font-mono font-bold text-base transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                        {isIndo ? 'Nilai Pasar Terkini' : 'Current Market Value'} ({activeCurrency})
                                    </label>
                                    <input
                                        type="text"
                                        value={formatDisplay(currentValue)}
                                        onChange={handleMoneyChange(setCurrentValue)}
                                        placeholder={formatDisplay(capital) || '0'}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3 text-emerald-600 dark:text-emerald-400 font-mono font-black text-base transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* LIVE TRANSPARENT FORMULA PREVIEW BOX */}
                        {calculatedMetrics.isValid && (
                            <div className="p-4 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-2.5 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                    <span className="flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-emerald-600" />
                                        {isIndo ? 'Hasil Perhitungan Otomatis:' : 'Automatic Live Calculation:'}
                                    </span>
                                    {inputMode === 'units' && unitType === 'lot' && (
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-200">
                                            {units} Lot = {calculatedMetrics.totalUnitsNormalized} {isIndo ? 'Lembar' : 'Shares'}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-emerald-200/50 dark:border-emerald-800/30">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? 'Total Modal Beli' : 'Total Cost Basis'}
                                        </span>
                                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                            {formatMoney(calculatedMetrics.capital)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                            {isIndo ? 'Total Nilai Portofolio' : 'Total Market Value'}
                                        </span>
                                        <span className="font-mono font-black text-slate-900 dark:text-white">
                                            {formatMoney(calculatedMetrics.currentValue)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-emerald-200/50 dark:border-emerald-800/30">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        {isIndo ? 'Floating Profit / Loss (P/L):' : 'Floating Profit / Loss:'}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        {calculatedMetrics.pl >= 0 ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-rose-500" />}
                                        <span className={`text-xs font-black font-mono ${calculatedMetrics.pl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                            {calculatedMetrics.pl >= 0 ? '+' : ''}{formatMoney(calculatedMetrics.pl)} ({calculatedMetrics.roi >= 0 ? '+' : ''}{calculatedMetrics.roi.toFixed(2)}% ROI)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Broker / Platform & Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Sekuritas / Platform Broker' : 'Broker Platform'}
                                </label>
                                <input
                                    type="text"
                                    value={broker}
                                    onChange={(e) => setBroker(e.target.value)}
                                    placeholder={isIndo ? "cth: Stockbit / Bibit / Indodax / Antam" : "e.g. IBKR / Robinhood / Binance"}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Catatan Tambahan (Opsional)' : 'Notes (Optional)'}
                                </label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={isIndo ? "cth: Akun RDN Utama / Target Jangka Panjang" : "e.g. Long-term holding"}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
                                />
                            </div>
                        </div>

                        {/* Accent Color Selection */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? 'Warna Aksen' : 'Accent Color'}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        style={{ backgroundColor: c }}
                                        className={`w-7 h-7 rounded-xl transition-all flex items-center justify-center text-white text-xs ${
                                            color === c ? 'ring-4 ring-offset-2 dark:ring-offset-slate-900 ring-emerald-500/40 scale-110' : 'opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        {color === c && <Check size={12} strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                            >
                                {t('btn_cancel') || (isIndo ? 'Batal' : 'Cancel')}
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition"
                            >
                                {editingAsset ? (isIndo ? 'Simpan Perubahan' : 'Update Asset') : (isIndo ? 'Simpan Portofolio' : 'Save Portfolio')}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
