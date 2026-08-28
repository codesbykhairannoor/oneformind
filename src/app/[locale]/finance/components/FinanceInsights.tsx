import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { X } from 'lucide-react';

interface AssetItem {
    id: string | number;
    name: string;
    capital: number;
    percent: number;
}

interface FinanceInsightsProps {
    activeCurrency?: string;
    currencyLocale?: string;
    onAddTransaction?: (data: any) => void;
}

export default function FinanceInsights({
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID',
    onAddTransaction
}: FinanceInsightsProps) {
    const t = useTranslations();
    const locale = useLocale();

    const [assets, setAssets] = useState<AssetItem[]>([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await fetch('/api/finance/assets');
                if (res.ok) {
                    const data = await res.json();
                    setAssets(data.map((a: any) => ({
                        id: a.id,
                        name: a.name,
                        capital: Number(a.value),
                        percent: a.color ? Number(a.color) : 0 // Using color for percent to avoid schema changes for now, or percent can be calculated dynamically, wait, we don't store percent in db in FinanceAsset. The app stores percent in localStorage. So I'll just use 'color' field temporarily or just set it to 0 and not save it, wait, percent needs to be saved.
                    })));
                }
            } catch (e) {
                console.error("Failed to load assets", e);
            }
        };
        fetchAssets();
    }, []);

    const totalCapital = assets.reduce((s, a) => s + Number(a.capital), 0);
    const currentValue = assets.reduce((s, a) => s + (Number(a.capital) * (1 + (Number(a.percent) / 100))), 0);
    const totalReturn = currentValue - totalCapital;

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    const [showInvestModal, setShowInvestModal] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [newAssetName, setNewAssetName] = useState('');
    const [newAssetCapital, setNewAssetCapital] = useState('');
    const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleAddAssetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const capital = Number(newAssetCapital.replace(/[^0-9]/g, ''));
        if (!newAssetName || isNaN(capital) || capital <= 0) return;

        try {
            const res = await fetch('/api/finance/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newAssetName.trim(),
                    value: capital,
                    color: "0" // we'll use color as percent string
                })
            });
            if (res.ok) {
                const newAsset = await res.json();
                setAssets(prev => [
                    ...prev,
                    { id: newAsset.id, name: newAsset.name, capital: Number(newAsset.value), percent: 0 }
                ]);
            }
        } catch (error) {
            console.error("Failed to add asset", error);
        }

        onAddTransaction?.({
            title: `Invest: ${newAssetName.trim()}`,
            amount: capital,
            type: 'expense',
            category: 'investasi',
            date: new Date().toISOString().split('T')[0],
            notes: `Modal awal investasi ${newAssetName.trim()}`
        });

        setShowInvestModal(false);
        setNewAssetName('');
        setNewAssetCapital('');
    };

    const handleQuitSubmit = async () => {
        if (!selectedAsset) return;
        const finalValue = selectedAsset.capital * (1 + (selectedAsset.percent / 100));
        const profit = finalValue - selectedAsset.capital;

        try {
            await fetch(`/api/finance/assets?id=${selectedAsset.id}`, { method: 'DELETE' });
            setAssets(prev => prev.filter(a => a.id !== selectedAsset.id));
        } catch (error) {
            console.error("Failed to delete asset", error);
        }

        onAddTransaction?.({
            title: `Withdraw: ${selectedAsset.name}`,
            amount: finalValue,
            type: 'income',
            category: 'investasi',
            date: new Date().toISOString().split('T')[0],
            notes: `Return: ${formatMoney(profit)} (${selectedAsset.percent}%)`
        });

        setShowQuitModal(false);
        setSelectedAsset(null);
    };

    const updatePercent = async (id: string | number, val: number) => {
        setAssets(prev => prev.map(a => a.id === id ? { ...a, percent: val } : a));
        const asset = assets.find(a => a.id === id);
        if (asset) {
            fetch('/api/finance/assets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name: asset.name, value: asset.capital, color: val.toString() })
            }).catch(e => console.error("Sync failed", e));
        }
    };



    return (
        <div className="mt-6 space-y-4 transition-all duration-700">
            <div className="bg-indigo-900 dark:bg-slate-950 rounded-[2rem] p-1 shadow-2xl dark:shadow-none shadow-indigo-200/50 dark:shadow-indigo-900/20 relative overflow-hidden group transition-all duration-500">
                
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 dark:from-indigo-900 dark:to-slate-950 transition-all duration-500"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>

                <div className="relative z-10 p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-lg">🧪</span>
                                <p className="text-indigo-200 text-[10px] font-black tracking-wider">
                                    {t('investment_lab') || 'Investment Lab'}
                                </p>
                            </div>
                            <h4 className="text-2xl font-black text-white tracking-tight">
                                {formatMoney(currentValue)}
                            </h4>
                            <div className="inline-flex items-center gap-1.5 mt-1 bg-black/20 px-2.5 py-1 rounded-md border border-white/5">
                                <span className={`w-1.5 h-1.5 rounded-full ${totalReturn >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                                <p className={`text-[9px] font-bold ${totalReturn >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                                    {totalReturn >= 0 ? '+' : ''}{formatMoney(totalReturn)} {t('total_pl') || '(P/L)'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowInvestModal(true)} 
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl text-white border border-white/20 transition-all active:scale-95 shadow-md"
                        >
                            ＋
                        </button>
                    </div>

                    {/* Assets List */}
                    {assets.length > 0 ? (
                        <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                            {assets.map(asset => {
                                const estTotal = asset.capital * (1 + (asset.percent / 100));
                                return (
                                    <div key={asset.id} className="bg-indigo-950/50 dark:bg-black/20 border border-indigo-500/30 dark:border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/card hover:bg-indigo-800/80 dark:hover:bg-white/5 transition-all duration-500">
                                        
                                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h5 className="text-sm font-black text-white truncate">{asset.name}</h5>
                                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/30">
                                                    {formatMoney(asset.capital)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center w-fit bg-black/30 rounded-lg border border-white/10 overflow-hidden focus-within:border-yellow-400/50 transition-all">
                                                <div className="bg-white/5 px-2 py-1 border-r border-white/10">
                                                    <svg className="w-3 h-3 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                                    </svg>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    value={asset.percent} 
                                                    onChange={(e) => updatePercent(asset.id, Number(e.target.value))}
                                                    className="w-16 bg-transparent border-none text-sm font-black text-center text-yellow-400 focus:outline-none focus:ring-0 py-1 px-1"
                                                    placeholder="0"
                                                />
                                                <div className="bg-white/5 px-2 py-1 border-l border-white/10">
                                                    <span className="text-[8px] font-bold text-indigo-200">
                                                        {t('growth') || 'Growth'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-2 sm:pt-0 mt-1 sm:mt-0 border-t sm:border-none border-indigo-500/20 gap-2">
                                            <div className="text-left sm:text-right">
                                                <p className="text-[8px] text-indigo-300 mb-0.5 font-bold">
                                                    {t('est_total') || 'Est. Total'}
                                                </p>
                                                <p className={`text-sm font-black tracking-tight ${asset.percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {formatMoney(estTotal)}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => { setSelectedAsset(asset); setShowQuitModal(true); }} 
                                                className="text-[9px] font-black tracking-wider text-white bg-rose-500/90 hover:bg-rose-500 px-4 py-1.5 rounded-lg transition-all shadow-sm active:scale-95"
                                            >
                                                {t('quit') || 'Cairkan'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 flex flex-col items-center justify-center border border-dashed border-indigo-400/30 rounded-xl bg-indigo-950/30 mt-2">
                            <span className="text-2xl mb-2 opacity-50 grayscale">🕸️</span>
                            <p className="text-[10px] font-bold text-indigo-300 tracking-wider">
                                {t('lab_empty') || 'Belum Ada Aset Terpantau'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showInvestModal && isMounted && createPortal(
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 " onClick={() => setShowInvestModal(false)}></div>
                    <div className="bg-white dark:bg-slate-900 flex flex-col w-full max-w-md relative overflow-visible transition-all duration-500 border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-none rounded-[2.5rem] p-8 animate-in fade-in zoom-in-95">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">
                            {t('invest_new') || 'Investasi Baru'}
                        </h3>
                        <form onSubmit={handleAddAssetSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-1.5">{t('asset_name') || 'Nama Aset'}</label>
                                <input type="text" value={newAssetName} onChange={e => setNewAssetName(e.target.value)} required placeholder={t('asset_name_placeholder') || 'Cth: Saham BBCA'}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-1.5">{t('capital_invest') || 'Modal Investasi'}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400 dark:text-slate-600">Rp</span>
                                    <input type="text" inputMode="numeric" value={newAssetCapital} onChange={e => {
                                        let raw = e.target.value.replace(/[^0-9]/g, '');
                                        setNewAssetCapital(raw ? new Intl.NumberFormat('id-ID').format(Number(raw)) : '');
                                    }} required placeholder="0" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-base font-black text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600" />
                                </div>
                            </div>
                            <div className="flex w-full gap-3 pt-4">
                                <button type="button" onClick={() => setShowInvestModal(false)} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase tracking-widest text-xs">
                                    {t('cancel') || 'Batal'}
                                </button>
                                <button type="submit" className="flex-[2] px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
                                    {t('confirm_pay') || 'Simpan Investasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showQuitModal && selectedAsset && isMounted && createPortal(
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 " onClick={() => setShowQuitModal(false)}></div>
                    <div className="bg-white dark:bg-slate-900 flex flex-col w-full max-w-md relative overflow-visible transition-all duration-500 border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-none rounded-[2.5rem] p-8 animate-in fade-in zoom-in-95">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">
                            {t('withdraw_asset') || 'Cairkan Aset'}
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('initial_capital') || 'Modal Awal'}</span>
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200">{formatMoney(selectedAsset.capital)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('return_text') || 'Return'} ({selectedAsset.percent}%)</span>
                                <span className={`text-xs font-black ${selectedAsset.percent >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'} bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700`}>
                                    {selectedAsset.percent >= 0 ? '+' : ''}
                                    {formatMoney(
                                        (selectedAsset.capital * (1 + (selectedAsset.percent / 100))) - selectedAsset.capital
                                    )}
                                </span>
                            </div>
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-2"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">{t('total_withdraw') || 'Total Pencairan'}</span>
                                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                                    {formatMoney(selectedAsset.capital * (1 + (selectedAsset.percent / 100)))}
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full gap-3">
                            <button type="button" onClick={() => setShowQuitModal(false)} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase tracking-widest text-xs">
                                {t('cancel') || 'Batal'}
                            </button>
                            <button type="button" onClick={handleQuitSubmit} className="flex-[2] px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
                                {t('yes_withdraw') || 'Ya, Cairkan'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
