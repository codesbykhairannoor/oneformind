'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { 
    Wallet, 
    TrendingUp, 
    RefreshCw, 
    PieChart, 
    ArrowUpRight, 
    ArrowDownRight, 
    ShieldCheck, 
    Landmark,
    Layers,
    Sparkles,
    Calendar
} from 'lucide-react';

import FinanceHeader, { SUPPORTED_CURRENCIES } from './components/FinanceHeader';
import FinanceStats from './components/FinanceStats';
import BudgetSidebar from './components/BudgetSidebar';
import { SavingsVaultItem } from './components/SavingCard';
import TransactionList, { TransactionItem, DayStat } from './components/TransactionList';
import FinanceInsights from './components/FinanceInsights';
import SavingsVaultSection from './components/SavingsVaultSection';
import FinanceModalsContainer from './components/FinanceModalsContainer';
import { SavingVault } from './components/SavingModal';
import { CategoryOption } from './types';
import { useFinanceActions, FinanceDeleteTarget } from './hooks/useFinanceActions';

// Wallets & Transfers
import WalletsSection, { WalletItem } from './components/WalletsSection';
import WalletModal from './components/WalletModal';
import TransferModal from './components/TransferModal';

// Recurring Subscriptions
import RecurringBillsSection, { RecurringBillItem } from './components/RecurringBillsSection';
import RecurringBillModal from './components/RecurringBillModal';

// Investments & Assets Portfolio
import InvestmentPortfolioSection, { InvestmentAssetItem } from './components/InvestmentPortfolioSection';
import InvestmentAssetModal, { InvestmentFundingOption } from './components/InvestmentAssetModal';
import InvestmentActionModal, { InvestmentActionMode, InvestmentActionResult } from './components/InvestmentActionModal';

const DailyTrendChart = dynamic(() => import('./components/DailyTrendChart'), { ssr: false });

export type FinanceTab = 'cashflow' | 'wallets_savings' | 'investments' | 'recurring';

export default function FinanceClient({
    initialMonthKey,
    initialTransactions,
    initialCategories,
    initialBudgets,
    initialSavings
}: {
    initialMonthKey: string;
    initialTransactions: TransactionItem[];
    initialCategories: CategoryOption[];
    initialBudgets: any[];
    initialSavings: SavingsVaultItem[];
}) {
    usePageTitle('Finance Workspace');
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const fetcher = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('API Error');
        }
        return res.json();
    };

    // ===== 1. CURRENCY SYSTEM =====
    const [activeCurrency, setActiveCurrency] = useState('IDR');
    const currencyObj = SUPPORTED_CURRENCIES.find(c => c.code === activeCurrency) || SUPPORTED_CURRENCIES[0];
    const currencyLocale = currencyObj.locale;

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    const [userSettings, setUserSettings] = useState<any>({});

    useEffect(() => {
        const fetchUserConfig = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    setUserSettings(data.settings || {});
                    if (data.settings?.finance_currency) {
                        setActiveCurrency(data.settings.finance_currency);
                    }
                }
            } catch (e) {
                console.error("Failed to load user finance config", e);
            }
        };
        fetchUserConfig();
    }, []);

    const saveUserConfig = async (updates: any) => {
        setUserSettings((prev: any) => ({ ...prev, ...updates }));
        try {
            const userRes = await fetch('/api/user');
            if (userRes.ok) {
                const userData = await userRes.json();
                const newSettings = { ...userData.settings, ...updates };
                await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings: newSettings })
                });
            }
        } catch (error) {
            console.error("Failed to save user config", error);
        }
    };

    const handleCurrencyChange = (code: string) => {
        setActiveCurrency(code);
        saveUserConfig({ finance_currency: code });
    };

    // ===== 2. ACTIVE TAB & WORKSPACE NAVIGATION =====
    const [activeTab, setActiveTab] = useState<FinanceTab>('cashflow');

    // ===== 3. DATE STATE =====
    const [selectedMonthKey, setSelectedMonthKey] = useState(initialMonthKey);

    // ===== 4. SWR DATA FETCHING & CACHING =====
    const swrOptions = { keepPreviousData: true };
    const { data: txRawData, mutate: mutateTx } = useSWR(`/api/finance/transactions?month=${selectedMonthKey}`, fetcher, swrOptions);
    const { data: catRawData, mutate: mutateCat } = useSWR(`/api/finance/categories`, fetcher, swrOptions);
    const { data: budRawData, mutate: mutateBud } = useSWR(`/api/finance/budgets?month=${selectedMonthKey}`, fetcher, swrOptions);
    const { data: savRawData, mutate: mutateSav } = useSWR(`/api/finance/savings`, fetcher, swrOptions);
    const { data: habitsRawData } = useSWR(`/api/habits?period=${selectedMonthKey}`, fetcher, swrOptions);

    // Cross-Domain Habit Compounding Savings & Cost-of-Vice
    const habitSavingsSummary = useMemo(() => {
        if (!habitsRawData || !Array.isArray(habitsRawData)) return { totalSaved: 0, items: [] };
        let totalSaved = 0;
        const items: Array<{ id: number; name: string; icon: string; saved: number; daysCompleted: number }> = [];
        habitsRawData.forEach((h: any) => {
            let meta: any = {};
            if (h.status && typeof h.status === 'string' && h.status.startsWith('{')) {
                try { meta = JSON.parse(h.status); } catch {}
            } else if (h.status && typeof h.status === 'object') {
                meta = h.status;
            }
            if (meta.syncedTabs && Array.isArray(meta.syncedTabs) && !meta.syncedTabs.includes('finance')) {
                return;
            }
            const impact = Number(meta.dailyFinancialImpact) || 0;
            if (impact > 0) {
                const completedCount = (h.logs || []).filter((l: any) => l.status === 'completed').length;
                const saved = completedCount * impact;
                if (completedCount > 0) {
                    totalSaved += saved;
                    items.push({
                        id: h.id,
                        name: h.name,
                        icon: h.icon || '🌱',
                        saved,
                        daysCompleted: completedCount
                    });
                }
            }
        });
        return { totalSaved, items };
    }, [habitsRawData]);

    // Derive parsed data from SWR cache or fallback to initial data
    const transactions: TransactionItem[] = (txRawData || initialTransactions).map((t: any) => ({
        ...t,
        amount: Number(t.amount),
        date: t.date?.split('T')[0] || t.date
    }));



    const categories: CategoryOption[] = catRawData || initialCategories;

    const budgets: any[] = (budRawData || initialBudgets).map((b: any) => ({ 
        ...b, 
        limit: Number(b.limitAmount) 
    }));

    const savingsVault: SavingsVaultItem[] = (savRawData || initialSavings).map((s: any) => ({
        ...s,
        name: s.title || s.name,
        target: Number(s.targetAmount || s.target),
        current: Number(s.currentAmount || s.current)
    }));

    // ===== 5. INCOME TARGET =====
    const [incomeTarget, setIncomeTarget] = useState(0);
    
    useEffect(() => {
        const target = userSettings[`finance_income_target_${selectedMonthKey}`] 
                    || userSettings[`finance_income_target`] 
                    || 0;
        setIncomeTarget(Number(target));
    }, [selectedMonthKey, userSettings]);

    const handleUpdateTarget = (val: number) => {
        setIncomeTarget(val);
        saveUserConfig({ [`finance_income_target_${selectedMonthKey}`]: val });
    };

    // ===== 6. MULTI-WALLET =====
    const wallets: WalletItem[] = useMemo(() => {
        return userSettings.finance_wallets || [];
    }, [userSettings.finance_wallets]);

    const [showWalletModal, setShowWalletModal] = useState(false);
    const [editingWallet, setEditingWallet] = useState<WalletItem | null>(null);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const handleSaveWallet = (walletData: WalletItem) => {
        const exists = wallets.some(w => String(w.id) === String(walletData.id));
        const updated = exists 
            ? wallets.map(w => String(w.id) === String(walletData.id) ? walletData : w)
            : [...wallets, walletData];
        saveUserConfig({ finance_wallets: updated });
    };


    const handleTransfer = ({
        fromWalletId,
        toWalletId,
        amount,
        adminFee,
        date,
        notes
    }: {
        fromWalletId: string;
        toWalletId: string;
        amount: number;
        adminFee: number;
        date: string;
        notes?: string;
    }) => {
        const fromW = wallets.find(w => String(w.id) === String(fromWalletId));
        const toW = wallets.find(w => String(w.id) === String(toWalletId));
        if (!fromW || !toW) return;

        const updatedWallets = wallets.map(w => {
            if (String(w.id) === String(fromWalletId)) {
                return { ...w, balance: Math.max(0, w.balance - (amount + adminFee)) };
            }
            if (String(w.id) === String(toWalletId)) {
                return { ...w, balance: w.balance + amount };
            }
            return w;
        });

        saveUserConfig({ finance_wallets: updatedWallets });

        if (adminFee > 0) {
            handleSaveSingleTrx({
                title: `Biaya Admin Transfer (${fromW.name} → ${toW.name})`,
                amount: adminFee,
                type: 'expense',
                category: 'utilitas',
                walletId: fromWalletId,
                date: date || new Date().toISOString().split('T')[0],
                notes: notes || 'Biaya admin transfer antar akun'
            });
        }
    };

    // ===== 7. RECURRING BILLS =====
    const recurringBills: RecurringBillItem[] = useMemo(() => {
        return userSettings.finance_recurring_bills || [];
    }, [userSettings.finance_recurring_bills]);

    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [editingBill, setEditingBill] = useState<RecurringBillItem | null>(null);

    const paidBillIdsThisMonth: string[] = useMemo(() => {
        return userSettings[`paid_bills_${selectedMonthKey}`] || [];
    }, [userSettings, selectedMonthKey]);

    const handleSaveBill = (billData: RecurringBillItem) => {
        const exists = recurringBills.some(b => String(b.id) === String(billData.id));
        const updated = exists
            ? recurringBills.map(b => String(b.id) === String(billData.id) ? billData : b)
            : [...recurringBills, billData];
        saveUserConfig({ finance_recurring_bills: updated });
    };

    const handlePayAndLogBill = async (bill: RecurringBillItem) => {
        await handleSaveSingleTrx({
            title: bill.name,
            amount: bill.amount,
            type: 'expense',
            category: bill.category || 'langganan',
            walletId: (bill as any).walletId || wallets[0]?.id,
            date: new Date().toISOString().split('T')[0],
            notes: `Tagihan Rutin (${bill.cycle === 'yearly' ? 'Tahunan' : 'Bulanan'})`
        });

        const currentPaid = userSettings[`paid_bills_${selectedMonthKey}`] || [];
        if (!currentPaid.includes(bill.id)) {
            saveUserConfig({ [`paid_bills_${selectedMonthKey}`]: [...currentPaid, bill.id] });
        }
    };

    // ===== 8. INVESTMENTS & STOCK PORTFOLIO =====
    const investments: InvestmentAssetItem[] = useMemo(() => {
        return userSettings.finance_investments || [];
    }, [userSettings.finance_investments]);

    const [showAssetModal, setShowAssetModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState<InvestmentAssetItem | null>(null);

    const [showActionModal, setShowActionModal] = useState(false);
    const [actionAsset, setActionAsset] = useState<InvestmentAssetItem | null>(null);
    const [actionMode, setActionMode] = useState<InvestmentActionMode>('revalue');

    const handleSaveAsset = async (assetData: InvestmentAssetItem, fundingOption?: InvestmentFundingOption) => {
        const exists = investments.some(a => String(a.id) === String(assetData.id));
        const updated = exists
            ? investments.map(a => String(a.id) === String(assetData.id) ? assetData : a)
            : [...investments, assetData];
        await saveUserConfig({ finance_investments: updated });

        // If creating new asset and funding from wallet was chosen:
        if (!exists && fundingOption?.deductFromWallet && fundingOption.walletId && assetData.capital > 0) {
            await handleSaveSingleTrx({
                title: isIndo ? `Investasi: Beli ${assetData.name}` : `Investment: Buy ${assetData.name}`,
                amount: assetData.capital,
                type: 'expense',
                category: 'investasi',
                walletId: fundingOption.walletId,
                date: fundingOption.date || new Date().toISOString().split('T')[0],
                notes: fundingOption.notes || (isIndo ? `Beli aset ${assetData.name} (${assetData.ticker || assetData.type})` : `Initial purchase of ${assetData.name}`)
            });
        }
    };

    const handleExecuteAssetAction = async (result: InvestmentActionResult) => {
        const {
            assetId,
            mode,
            cashflowAmount,
            logCashflow,
            walletId,
            date,
            notes,
            newCapital,
            newCurrentValue,
            newUnits,
            newAvgBuyPrice,
            newCurrentPrice,
            newTotalDividends
        } = result;

        const target = investments.find(a => String(a.id) === String(assetId));
        if (!target) return;

        if (logCashflow && cashflowAmount > 0) {
            if (mode === 'topup') {
                await handleSaveSingleTrx({
                    title: isIndo ? `Investasi: Top-Up ${target.name}` : `Investment: Top-Up ${target.name}`,
                    amount: cashflowAmount,
                    type: 'expense',
                    category: 'investasi',
                    walletId: walletId || wallets[0]?.id,
                    date,
                    notes: notes || (isIndo ? `Top-up modal instrumen ${target.name}` : `Top-up asset ${target.name}`)
                });
            } else if (mode === 'withdraw') {
                await handleSaveSingleTrx({
                    title: isIndo ? `Pencairan Aset: ${target.name}` : `Asset Liquidation: ${target.name}`,
                    amount: cashflowAmount,
                    type: 'income',
                    category: 'investasi',
                    walletId: walletId || wallets[0]?.id,
                    date,
                    notes: notes || (isIndo ? `Pencairan hasil jual ${target.name}` : `Proceeds from ${target.name}`)
                });
            } else if (mode === 'dividend') {
                await handleSaveSingleTrx({
                    title: isIndo ? `Dividen: ${target.name}` : `Dividend: ${target.name}`,
                    amount: cashflowAmount,
                    type: 'income',
                    category: 'investasi',
                    walletId: walletId || wallets[0]?.id,
                    date,
                    notes: notes || (isIndo ? `Dividen pasif instrumen ${target.name}` : `Passive dividend payout from ${target.name}`)
                });
            }
        }

        const updated = investments.map(a => {
            if (String(a.id) !== String(assetId)) return a;
            return {
                ...a,
                capital: newCapital,
                currentValue: newCurrentValue,
                units: newUnits !== undefined ? newUnits : a.units,
                avgBuyPrice: newAvgBuyPrice !== undefined ? newAvgBuyPrice : a.avgBuyPrice,
                currentPrice: newCurrentPrice !== undefined ? newCurrentPrice : a.currentPrice,
                totalDividends: newTotalDividends !== undefined ? newTotalDividends : (a.totalDividends || 0)
            };
        });

        saveUserConfig({ finance_investments: updated });
    };

    // ===== 9. MODAL STATES =====
    const [showTrxModal, setShowTrxModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deleteTarget, setDeleteTarget] = useState<FinanceDeleteTarget | null>(null);
    const [showSavingModal, setShowSavingModal] = useState(false);
    const [showVaultTxModal, setShowVaultTxModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);

    const [selectedDayData, setSelectedDayData] = useState<DayStat | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
    const [editingSaving, setEditingSaving] = useState<SavingVault | null>(null);
    const [activeVault, setActiveVault] = useState<SavingVault | null>(null);
    const [vaultTxType, setVaultTxType] = useState<'deposit' | 'withdraw'>('deposit');
    const [filterDate, setFilterDate] = useState('');

    // ===== 10. COMPUTED EXECUTIVE METRICS =====
    const currentMonthTransactions = transactions;
    const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    const expenseStats: Record<string, number> = {};
    const incomeStats: Record<string, number> = {};
    currentMonthTransactions.forEach(t => {
        if (t.type === 'expense') expenseStats[t.category] = (expenseStats[t.category] || 0) + Number(t.amount);
        if (t.type === 'income') incomeStats[t.category] = (incomeStats[t.category] || 0) + Number(t.amount);
    });

    // Net Worth Calculations
    const totalWalletsBalance = useMemo(() => {
        return wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
    }, [wallets]);

    const balance = wallets.length > 0
        ? totalWalletsBalance
        : (incomeTarget + totalIncome - totalExpense);

    const liquidCash = wallets.length > 0 ? totalWalletsBalance : balance;

    const { totalInvestedCapital, totalInvestedCurrentValue, totalInvestedReturn, totalInvestedROI } = useMemo(() => {
        let cap = 0;
        let cur = 0;
        investments.forEach(a => {
            cap += Number(a.capital) || 0;
            cur += Number(a.currentValue) || 0;
        });
        const ret = cur - cap;
        const roi = cap > 0 ? (ret / cap) * 100 : 0;
        return { totalInvestedCapital: cap, totalInvestedCurrentValue: cur, totalInvestedReturn: ret, totalInvestedROI: roi };
    }, [investments]);

    const totalVaultsBalance = useMemo(() => {
        return savingsVault.reduce((sum, v) => sum + (Number(v.current) || 0), 0);
    }, [savingsVault]);

    const totalRecurringMonthly = useMemo(() => {
        return recurringBills.reduce((sum, b) => {
            return sum + (b.cycle === 'yearly' ? Math.round(b.amount / 12) : b.amount);
        }, 0);
    }, [recurringBills]);

    const totalNetWorth = liquidCash + totalInvestedCurrentValue + totalVaultsBalance;

    // ===== 11. ACTIONS HOOK =====
    const {
        handleSaveSingleTrx,
        handleSaveBatchTrx,
        handleDeleteTrx,
        confirmDelete,
        handleSaveVault,
        handleVaultMutation,
        handleSaveCategory,
        handleAddAssetTransaction
    } = useFinanceActions({
        transactions,
        mutateTx,
        categories,
        mutateCat,
        budgets,
        mutateBud,
        mutateSav,
        selectedMonthKey,
        deleteTarget,
        setDeleteTarget,
        setShowBatchModal,
        setShowSavingModal,
        setShowCategoryModal,
        setEditingCategory,
        setShowVaultTxModal,
        activeVault,
        vaultTxType,
        wallets,
        investments,
        recurringBills,
        saveUserConfig
    });

    const changeMonth = (val: number | string) => {
        if (typeof val === 'string') {
            setSelectedMonthKey(val);
        } else {
            const [y, m] = selectedMonthKey.split('-').map(Number);
            const d = new Date(y, m - 1 + val, 1);
            setSelectedMonthKey(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
    };

    const handleOpenDayDetail = (day: DayStat) => {
        setSelectedDayData(day);
        setShowArchiveModal(true);
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500 pb-24">
                
                {/* Finance Header (Month Navigation, Quick Actions, Currency) */}
                <FinanceHeader
                    selectedMonthKey={selectedMonthKey}
                    onMonthChange={changeMonth}
                    onOpenTrxModal={() => { setEditingTransaction(null); setShowTrxModal(true); }}
                    onOpenBatchModal={() => setShowBatchModal(true)}
                    activeCurrency={activeCurrency}
                    onCurrencyChange={handleCurrencyChange}
                    transactions={transactions}
                />

                <div className="w-full min-h-screen px-3 sm:px-6 lg:px-8 py-6 transition-colors duration-500 max-w-[1750px] mx-auto space-y-6">
                    
                    {/* ===== TOP EXECUTIVE NET WORTH & WEALTH STRIP ===== */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/50">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            
                            {/* Net Worth Headline */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2 backdrop-blur-md">
                                    <Sparkles size={12} /> {isIndo ? 'Kekayaan Bersih Terpadu' : 'Unified Net Worth'}
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-mono">
                                    {formatMoney(totalNetWorth)}
                                </h2>
                                <p className="text-xs text-slate-400 font-medium mt-1">
                                    {isIndo ? 'Kombinasi kas dompet, portofolio investasi, & simpanan tabungan' : 'Aggregated cash, investments, & vault savings'}
                                </p>
                            </div>

                            {/* 3 Executive Pillars */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:max-w-2xl w-full">
                                
                                {/* Liquid Cash */}
                                <div 
                                    onClick={() => setActiveTab('wallets_savings')}
                                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                                        <span>{isIndo ? 'Kas Likuid (Dompet)' : 'Liquid Cash'}</span>
                                        <Wallet size={13} className="group-hover:text-blue-400 transition" />
                                    </div>
                                    <p className="text-lg font-black font-mono text-white">
                                        {formatMoney(liquidCash)}
                                    </p>
                                    <span className="text-[10px] text-blue-400 font-bold">
                                        {wallets.length > 0 ? `${wallets.length} ${isIndo ? 'Akun' : 'Wallets'}` : (isIndo ? 'Kas Utama' : 'Main Cash')}
                                    </span>
                                </div>

                                {/* Invested Portfolio */}
                                <div 
                                    onClick={() => setActiveTab('investments')}
                                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                                        <span>{isIndo ? 'Investasi & Saham' : 'Invested Assets'}</span>
                                        <TrendingUp size={13} className="group-hover:text-emerald-400 transition" />
                                    </div>
                                    <p className="text-lg font-black font-mono text-white">
                                        {formatMoney(totalInvestedCurrentValue)}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] font-bold font-mono">
                                        <span className={totalInvestedReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                            {totalInvestedReturn >= 0 ? '+' : ''}{totalInvestedROI.toFixed(1)}% ROI
                                        </span>
                                    </div>
                                </div>

                                {/* Dedicated Vaults & Emergency Fund */}
                                <div 
                                    onClick={() => setActiveTab('wallets_savings')}
                                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                                        <span>{isIndo ? 'Vault & Dana Darurat' : 'The Vaults'}</span>
                                        <ShieldCheck size={13} className="group-hover:text-amber-400 transition" />
                                    </div>
                                    <p className="text-lg font-black font-mono text-white">
                                        {formatMoney(totalVaultsBalance)}
                                    </p>
                                    <span className="text-[10px] text-amber-400 font-bold">
                                        {savingsVault.length} {isIndo ? 'Pos Target' : 'Goals'}
                                    </span>
                                </div>

                            </div>

                            {/* Habit Compounding Savings & Cost-of-Vice Tracker */}
                            {habitSavingsSummary.totalSaved > 0 && (
                                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shadow-sm shrink-0">
                                            💰
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                                                {isIndo ? 'Akumulasi Hemat Kebiasaan (Cost-of-Vice)' : 'Habits Compounding Savings'}
                                            </span>
                                            <p className="text-xs text-slate-200 font-medium leading-snug">
                                                {isIndo 
                                                    ? `Konsistensi kebiasaan Anda telah mengamankan ${formatMoney(habitSavingsSummary.totalSaved)} bulan ini!` 
                                                    : `Your habit consistency has secured ${formatMoney(habitSavingsSummary.totalSaved)} this month!`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        {habitSavingsSummary.items.map(item => (
                                            <span
                                                key={item.id}
                                                className="px-2.5 py-1 rounded-xl bg-black/30 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center gap-1.5 font-mono"
                                            >
                                                <span>{item.icon}</span>
                                                <span>{item.name}</span>
                                                <span className="text-white font-black">+{formatMoney(item.saved)}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ===== WORKSPACE SEGMENTED TAB SWITCHER ===== */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-[1.75rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800 shadow-sm">
                        
                        <button
                            onClick={() => setActiveTab('cashflow')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all duration-300 shrink-0 ${
                                activeTab === 'cashflow'
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <PieChart size={16} />
                            <span>{isIndo ? 'Arus Kas & Anggaran' : 'Cashflow & Budgets'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                activeTab === 'cashflow' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                                {transactions.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('wallets_savings')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all duration-300 shrink-0 ${
                                activeTab === 'wallets_savings'
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <Wallet size={16} />
                            <span>{isIndo ? 'Dompet & Tabungan' : 'Wallets & Vaults'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                activeTab === 'wallets_savings' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                                {wallets.length + savingsVault.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('investments')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all duration-300 shrink-0 ${
                                activeTab === 'investments'
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <TrendingUp size={16} />
                            <span>{isIndo ? 'Portofolio Investasi' : 'Investments & Stocks'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                activeTab === 'investments' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                                {investments.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('recurring')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all duration-300 shrink-0 ${
                                activeTab === 'recurring'
                                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/25 scale-[1.02]'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <RefreshCw size={16} />
                            <span>{isIndo ? 'Tagihan Rutin' : 'Recurring Subscriptions'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                activeTab === 'recurring' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                                {recurringBills.length}
                            </span>
                        </button>

                    </div>

                    {/* ===== TAB CONTENT 1: ARUS KAS & BUDGET ===== */}
                    {activeTab === 'cashflow' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            
                            {/* Monthly Cashflow KPI Stats */}
                            <div className="overflow-x-auto no-scrollbar -mx-3 px-3 lg:mx-0 lg:px-0">
                                <FinanceStats
                                    totalIncome={totalIncome}
                                    totalExpense={totalExpense}
                                    balance={balance}
                                    incomeTarget={incomeTarget}
                                    onUpdateTarget={handleUpdateTarget}
                                    activeCurrency={activeCurrency}
                                    currencyLocale={currencyLocale}
                                    onManageWallets={() => setActiveTab('wallets_savings')}
                                    walletsCount={wallets.length}
                                />
                            </div>

                            {/* 2-Column Finance Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
                                
                                {/* Left Column: Budgets + Insights */}
                                <div className="lg:col-span-2 w-full lg:sticky lg:top-24 h-fit space-y-6 order-1 lg:order-2">
                                    <BudgetSidebar
                                        budgets={budgets}
                                        categories={categories}
                                        expenseStats={expenseStats}
                                        incomeStats={incomeStats}
                                        onAddCategory={() => { setEditingCategory(null); setShowCategoryModal(true); }}
                                        onEditCategory={(cat) => { setEditingCategory(cat); setShowCategoryModal(true); }}
                                        onDeleteCategory={(cat) => setDeleteTarget({ type: 'category', data: cat })}
                                        activeCurrency={activeCurrency}
                                        currencyLocale={currencyLocale}
                                    />

                                    <div className="hidden lg:block">
                                        <FinanceInsights 
                                            activeCurrency={activeCurrency}
                                            currencyLocale={currencyLocale}
                                            onAddTransaction={handleAddAssetTransaction}
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Transactions + Daily Trend */}
                                <div className="lg:col-span-3 space-y-6 w-full order-2 lg:order-1">
                                    
                                    <TransactionList
                                        transactions={transactions}
                                        categories={categories}
                                        filterDate={filterDate}
                                        setFilterDate={setFilterDate}
                                        onOpenDayDetail={handleOpenDayDetail}
                                        activeCurrency={activeCurrency}
                                        currencyLocale={currencyLocale}
                                    />

                                    <div className="lg:hidden">
                                        <FinanceInsights 
                                            activeCurrency={activeCurrency}
                                            currencyLocale={currencyLocale}
                                            onAddTransaction={handleAddAssetTransaction}
                                        />
                                    </div>

                                    {transactions.length > 0 && (
                                        <DailyTrendChart
                                            transactions={transactions}
                                            currentDate={`${selectedMonthKey}-01`}
                                            onDayClick={(payload: any) => setFilterDate(payload.date)}
                                        />
                                    )}

                                </div>

                            </div>
                        </div>
                    )}

                    {/* ===== TAB CONTENT 2: DOMPET & TABUNGAN (WALLETS & VAULTS) ===== */}
                    {activeTab === 'wallets_savings' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            
                            {/* Wallets & Bank Accounts */}
                            <WalletsSection
                                wallets={wallets}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                                onOpenAddWallet={() => { setEditingWallet(null); setShowWalletModal(true); }}
                                onEditWallet={(w) => { setEditingWallet(w); setShowWalletModal(true); }}
                                onDeleteWallet={(id) => {
                                    const w = wallets.find(item => String(item.id) === String(id));
                                    setDeleteTarget({ type: 'wallet', data: { id: String(id), name: w?.name || 'Dompet' } });
                                }}
                                onOpenTransferModal={() => setShowTransferModal(true)}
                            />

                            {/* Savings Vault & Emergency Fund Section */}
                            <SavingsVaultSection
                                savingsVault={savingsVault}
                                monthlyBurnRate={totalExpense > 0 ? totalExpense : totalRecurringMonthly}
                                t={t}
                                onOpenCreateVault={() => { setEditingSaving(null); setShowSavingModal(true); }}
                                onEditVault={(vault) => { setEditingSaving(vault); setShowSavingModal(true); }}
                                onDeleteVault={(vault) => {
                                    setDeleteTarget({ type: 'vault', data: { id: vault.id, name: vault.title || (vault as any).name || 'Target Tabungan' } });
                                }}
                                onDeposit={(vault) => {
                                    setActiveVault(vault);
                                    setVaultTxType('deposit');
                                    setShowVaultTxModal(true);
                                }}
                                onWithdraw={(vault) => {
                                    setActiveVault(vault);
                                    setVaultTxType('withdraw');
                                    setShowVaultTxModal(true);
                                }}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                            />

                        </div>
                    )}

                    {/* ===== TAB CONTENT 3: PORTOFOLIO INVESTASI (STOCKS & ASSETS) ===== */}
                    {activeTab === 'investments' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <InvestmentPortfolioSection
                                assets={investments}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                                onOpenAddModal={() => { setEditingAsset(null); setShowAssetModal(true); }}
                                onEditAsset={(asset) => { setEditingAsset(asset); setShowAssetModal(true); }}
                                onDeleteAsset={(asset) => {
                                    const targetId = asset.id || `${asset.name}_${asset.ticker || 'asset'}`;
                                    setDeleteTarget({ 
                                        type: 'investment', 
                                        data: { 
                                            id: String(targetId), 
                                            name: asset.name || 'Aset Investasi', 
                                            ticker: asset.ticker,
                                            asset
                                        } 
                                    });
                                }}
                                onTopupAsset={(asset) => {
                                    setActionAsset(asset);
                                    setActionMode('topup');
                                    setShowActionModal(true);
                                }}
                                onWithdrawAsset={(asset) => {
                                    setActionAsset(asset);
                                    setActionMode('withdraw');
                                    setShowActionModal(true);
                                }}
                                onUpdateMarketValue={(asset) => {
                                    setActionAsset(asset);
                                    setActionMode('revalue');
                                    setShowActionModal(true);
                                }}
                                onRecordDividend={(asset) => {
                                    setActionAsset(asset);
                                    setActionMode('dividend');
                                    setShowActionModal(true);
                                }}
                            />
                        </div>
                    )}

                    {/* ===== TAB CONTENT 4: TAGIHAN RUTIN (RECURRING SUBSCRIPTIONS) ===== */}
                    {activeTab === 'recurring' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <RecurringBillsSection
                                bills={recurringBills}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                                onOpenAddModal={() => { setEditingBill(null); setShowRecurringModal(true); }}
                                onEditBill={(b) => { setEditingBill(b); setShowRecurringModal(true); }}
                                onDeleteBill={(id) => {
                                    const b = recurringBills.find(item => String(item.id) === String(id));
                                    setDeleteTarget({ type: 'recurring_bill', data: { id: String(id), name: b?.name || 'Tagihan Rutin' } });
                                }}
                                onPayAndLog={handlePayAndLogBill}
                                paidBillIdsThisMonth={paidBillIdsThisMonth}
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Standard Finance Modals Container */}
            <FinanceModalsContainer
                showArchiveModal={showArchiveModal}
                setShowArchiveModal={setShowArchiveModal}
                selectedDayData={selectedDayData}
                categories={categories}
                wallets={wallets}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
                onEditTransactionFromArchive={(trx) => { setEditingTransaction(trx); setShowTrxModal(true); }}
                onDeleteTrx={handleDeleteTrx}
                showTrxModal={showTrxModal}
                setShowTrxModal={setShowTrxModal}
                editingTransaction={editingTransaction}
                transactions={transactions}
                budgets={budgets}
                onSaveSingleTrx={handleSaveSingleTrx}
                onSwitchToBatch={() => { setShowTrxModal(false); setShowBatchModal(true); }}
                showBatchModal={showBatchModal}
                setShowBatchModal={setShowBatchModal}
                onSaveBatchTrx={handleSaveBatchTrx}
                onSwitchToSingle={() => { setShowBatchModal(false); setShowTrxModal(true); }}
                showCategoryModal={showCategoryModal}
                setShowCategoryModal={setShowCategoryModal}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
                onSaveCategory={(cat) => handleSaveCategory(cat, editingCategory)}
                deleteTarget={deleteTarget}
                setDeleteTarget={setDeleteTarget}
                confirmDelete={confirmDelete}
                showSavingModal={showSavingModal}
                setShowSavingModal={setShowSavingModal}
                editingSaving={editingSaving}
                onSaveVault={handleSaveVault}
                showVaultTxModal={showVaultTxModal}
                setShowVaultTxModal={setShowVaultTxModal}
                activeVault={activeVault}
                vaultTxType={vaultTxType}
                onVaultMutation={handleVaultMutation}
            />

            {/* Wallet Modals */}
            <WalletModal
                show={showWalletModal}
                editingWallet={editingWallet}
                onClose={() => setShowWalletModal(false)}
                onSave={handleSaveWallet}
                activeCurrency={activeCurrency}
            />

            <TransferModal
                show={showTransferModal}
                wallets={wallets}
                onClose={() => setShowTransferModal(false)}
                onTransfer={handleTransfer}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

            {/* Recurring Bill Modal */}
            <RecurringBillModal
                show={showRecurringModal}
                editingBill={editingBill}
                categories={categories}
                onClose={() => setShowRecurringModal(false)}
                onSave={handleSaveBill}
                activeCurrency={activeCurrency}
            />

            {/* Investment Portfolio Modals */}
            <InvestmentAssetModal
                show={showAssetModal}
                editingAsset={editingAsset}
                wallets={wallets}
                onClose={() => setShowAssetModal(false)}
                onSave={handleSaveAsset}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

            <InvestmentActionModal
                show={showActionModal}
                asset={actionAsset}
                mode={actionMode}
                wallets={wallets}
                onClose={() => setShowActionModal(false)}
                onExecute={handleExecuteAssetAction}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

        </AuthenticatedLayout>
    );
}
