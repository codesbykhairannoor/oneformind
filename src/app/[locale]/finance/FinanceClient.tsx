'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import useSWR from 'swr';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import FinanceHeader, { SUPPORTED_CURRENCIES } from './components/FinanceHeader';
import FinanceStats from './components/FinanceStats';
import BudgetSidebar from './components/BudgetSidebar';
import SavingCard, { SavingsVaultItem } from './components/SavingCard';
import TransactionList, { TransactionItem, DayStat } from './components/TransactionList';
import dynamic from 'next/dynamic';
const DailyTrendChart = dynamic(() => import('./components/DailyTrendChart'), { ssr: false });
import TransactionModal from './components/TransactionModal';
import FinanceBatchModal from './components/FinanceBatchModal';
import CategoryModal from './components/CategoryModal';
import SavingModal, { SavingVault } from './components/SavingModal';
import VaultTransactionModal from './components/VaultTransactionModal';
import ArchiveModal from './components/ArchiveModal';
import FinanceInsights from './components/FinanceInsights';
import { Wallet, Plus } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

interface CategoryOption {
    slug: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
}

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
    usePageTitle('Finance');
    const t = useTranslations();
    const locale = useLocale();
    const fetcher = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('API Error');
        }
        return res.json();
    };

    // ===== 1. CURRENCY SYSTEM (1:1 from useFinanceFormat.js) =====
    const [activeCurrency, setActiveCurrency] = useState('IDR');
    const currencyObj = SUPPORTED_CURRENCIES.find(c => c.code === activeCurrency) || SUPPORTED_CURRENCIES[0];
    const currencyLocale = currencyObj.locale;

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

    // ===== 2. DATE STATE =====
    const [selectedMonthKey, setSelectedMonthKey] = useState(initialMonthKey);

    // ===== 3. SWR DATA FETCHING & CACHING =====
    const { data: txRawData, mutate: mutateTx } = useSWR(`/api/finance/transactions?month=${selectedMonthKey}`, fetcher, { keepPreviousData: true });
    const { data: catRawData, mutate: mutateCat } = useSWR(`/api/finance/categories`, fetcher, { keepPreviousData: true });
    const { data: budRawData, mutate: mutateBud } = useSWR(`/api/finance/budgets?month=${selectedMonthKey}`, fetcher, { keepPreviousData: true });
    const { data: savRawData, mutate: mutateSav } = useSWR(`/api/finance/savings`, fetcher, { keepPreviousData: true });

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

    // ===== 7. INCOME TARGET =====
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

    // ===== 8. MODAL STATES =====
    const [showTrxModal, setShowTrxModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSavingModal, setShowSavingModal] = useState(false);
    const [showVaultTxModal, setShowVaultTxModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);

    const [selectedDayData, setSelectedDayData] = useState<DayStat | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
    const [editingSaving, setEditingSaving] = useState<SavingVault | null>(null);
    const [activeVault, setActiveVault] = useState<SavingVault | null>(null);
    const [vaultTxType, setVaultTxType] = useState<'deposit' | 'withdraw'>('deposit');
    const [filterDate, setFilterDate] = useState('');

    // ===== COMPUTED — transactions state is already filtered by selectedMonthKey from API =====
    const currentMonthTransactions = transactions;
    const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const balance = incomeTarget + totalIncome - totalExpense;

    const expenseStats: Record<string, number> = {};
    const incomeStats: Record<string, number> = {};
    currentMonthTransactions.forEach(t => {
        if (t.type === 'expense') expenseStats[t.category] = (expenseStats[t.category] || 0) + Number(t.amount);
        if (t.type === 'income') incomeStats[t.category] = (incomeStats[t.category] || 0) + Number(t.amount);
    });

    // HANDLERS
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

    const handleSaveSingleTrx = async (data: any) => {
        try {
            if (data.id) {
                // Optimistic UI
                mutateTx(transactions.map(t => t.id === data.id ? { ...data, amount: Number(data.amount), date: data.date.split('T')[0] } : t), false);
                
                const res = await fetch(`/api/finance/transactions/${data.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                mutateTx(); // revalidate
            } else {
                // Optimistic UI
                const tempId = Date.now();
                mutateTx([{ ...data, id: tempId, amount: Number(data.amount), date: data.date.split('T')[0] }, ...transactions], false);
                
                const res = await fetch('/api/finance/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                mutateTx(); // revalidate
            }
        } catch (error) {
            console.error('Failed to save transaction:', error);
        }
    };

    const handleSaveBatchTrx = async (date: string, rows: any[]) => {
        try {
            const newTrxs: TransactionItem[] = [];
            for (const r of rows) {
                const res = await fetch('/api/finance/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date, type: r.type, amount: Number(r.amount), title: r.title, category: r.category || 'other'
                    })
                });
            }
            mutateTx();
            setShowBatchModal(false);
        } catch (error) {
            console.error('Failed to batch save transactions:', error);
        }
    };

    const handleDeleteTrx = async (id: number) => {
        if (confirm(t('common.delete_confirm'))) {
            mutateTx(transactions.filter(t => t.id !== id), false);
            await fetch(`/api/finance/transactions/${id}`, { method: 'DELETE' });
            mutateTx();
        }
    };

    const handleSaveVault = async (data: SavingVault) => {
        try {
            if (data.id) {
                const res = await fetch('/api/finance/savings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: data.id, title: data.title, targetAmount: Number(data.target_amount), icon: data.icon })
                });
                if (res.ok) {
                    mutateSav();
                    setShowSavingModal(false);
                }
            } else {
                const res = await fetch('/api/finance/savings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: data.title, targetAmount: Number(data.target_amount), icon: data.icon, color: data.color })
                });
                if (res.ok) {
                    mutateSav();
                    setShowSavingModal(false);
                }
            }
        } catch (error) {
            console.error('Failed to save vault:', error);
        }
    };

    const handleVaultMutation = async (amount: number, type: 'deposit' | 'withdraw') => {
        if (!activeVault) return;
        try {
            const currentAmount = activeVault.current_amount || 0;
            const newAmount = type === 'deposit' ? currentAmount + amount : Math.max(0, currentAmount - amount);
            const res = await fetch('/api/finance/savings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: activeVault.id, currentAmount: newAmount })
            });
            if (res.ok) {
                mutateSav();
                mutateTx();
                setShowVaultTxModal(false);
            }
        } catch (error) {
            console.error('Failed to mutate vault:', error);
        }
    };

    const handleAddAssetTransaction = async (data: any) => {
        try {
            const res = await fetch('/api/finance/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                mutateTx();
            }
        } catch (error) {
            console.error('Failed to add asset transaction:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500 pb-20">
                
                <FinanceHeader
                    selectedMonthKey={selectedMonthKey}
                    onMonthChange={changeMonth}
                    onOpenTrxModal={() => { setEditingTransaction(null); setShowTrxModal(true); }}
                    onOpenBudgetModal={() => setShowCategoryModal(true)}
                    onOpenBatchModal={() => setShowBatchModal(true)}
                    activeCurrency={activeCurrency}
                    onCurrencyChange={handleCurrencyChange}
                    transactions={currentMonthTransactions}
                />

                <div className="w-full min-h-screen px-3 sm:px-6 lg:px-8 py-6 transition-colors duration-500">
                    
                    <div className="mb-8 overflow-x-auto no-scrollbar -mx-3 px-3 lg:mx-0 lg:px-0">
                        <FinanceStats
                            totalIncome={totalIncome}
                            totalExpense={totalExpense}
                            balance={balance}
                            incomeTarget={incomeTarget}
                            onUpdateTarget={handleUpdateTarget}
                            activeCurrency={activeCurrency}
                            currencyLocale={currencyLocale}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
                        
                        <div className="lg:col-span-2 w-full lg:sticky lg:top-24 h-fit space-y-8 lg:space-y-6 order-1 lg:order-2">
                            <BudgetSidebar
                                budgets={budgets}
                                categories={categories}
                                expenseStats={expenseStats}
                                incomeStats={incomeStats}
                                onAddBudget={() => setShowCategoryModal(true)}
                                onEditBudget={() => setShowCategoryModal(true)}
                                onDeleteBudget={async (id) => {
                                    mutateBud(budgets.filter(b => b.id !== id), false);
                                    await fetch(`/api/finance/budgets?id=${id}`, { method: 'DELETE' });
                                    mutateBud();
                                }}
                                onAddCategory={() => setShowCategoryModal(true)}
                                onEditCategory={() => setShowCategoryModal(true)}
                                onDeleteCategory={async (cat) => {
                                    mutateCat(categories.filter(c => c.slug !== cat.slug), false);
                                    await fetch(`/api/finance/categories?slug=${cat.slug}`, { method: 'DELETE' });
                                    mutateCat();
                                }}
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

                        <div className="lg:col-span-3 space-y-8 w-full order-2 lg:order-1 pb-24 lg:pb-0">
                            
                            <TransactionList
                                transactions={currentMonthTransactions}
                                categories={categories}
                                filterDate={filterDate}
                                setFilterDate={setFilterDate}
                                onOpenDayDetail={handleOpenDayDetail}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                            />

                            <div className="space-y-6 relative group">
                                <div className="flex items-center justify-between px-1 lg:px-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-sm">
                                            <Wallet size={20} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <h3 className="text-base lg:text-lg font-black text-slate-800 dark:text-white tracking-tight">
                                                    {t('vault_header_title') || 'The Vault'}
                                                </h3>
                                                <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 tracking-wider leading-none mt-0.5">
                                                    {t('vault_header_subtitle') || 'Tabungan & Target'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setEditingSaving(null); setShowSavingModal(true); }}
                                        className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-[1.25rem] text-[10px] font-black tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none relative group/btn overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                        <Plus size={16} strokeWidth={3} />
                                        <span className="relative z-10">{t('vault_btn_add') || 'Buat Vault'}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                    {savingsVault.length === 0 ? (
                                        <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-2 border-slate-100 dark:border-slate-800 p-10 text-center transition-colors shadow-sm col-span-1 md:col-span-2">
                                            <div className="mb-4 text-3xl transform group-hover:scale-110 transition-transform duration-500 animate-bounce">🏦</div>
                                            <h4 className="text-slate-400 font-bold text-[10px] lg:text-sm mb-4">{t('vault_empty_title') || 'Belum ada tabungan'}</h4>
                                            <button onClick={() => { setEditingSaving(null); setShowSavingModal(true); }} className="text-[9px] lg:text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-6 py-2.5 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all active:scale-95 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
                                                {t('vault_empty_btn') || 'Buat Target Tabungan'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex overflow-x-auto custom-scrollbar gap-4 pb-6 -mx-2 px-2 pt-2 md:col-span-2">
                                        {savingsVault.map(s => (
                                            <div key={s.id} className="shrink-0 w-[260px] md:w-[280px]">
                                                <SavingCard
                                                    saving={s}
                                                    onDeposit={(saving) => {
                                                        setActiveVault({ id: saving.id, title: saving.name, target_amount: saving.target, current_amount: saving.current, icon: saving.icon, color: saving.color });
                                                        setVaultTxType('deposit');
                                                        setShowVaultTxModal(true);
                                                    }}
                                                    onWithdraw={(saving) => {
                                                        setActiveVault({ id: saving.id, title: saving.name, target_amount: saving.target, current_amount: saving.current, icon: saving.icon, color: saving.color });
                                                        setVaultTxType('withdraw');
                                                        setShowVaultTxModal(true);
                                                    }}
                                                    activeCurrency={activeCurrency}
                                                    currencyLocale={currencyLocale}
                                                />
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:hidden relative">
                                <FinanceInsights 
                                    activeCurrency={activeCurrency}
                                    currencyLocale={currencyLocale}
                                    onAddTransaction={handleAddAssetTransaction}
                                />
                            </div>

                            {currentMonthTransactions.length > 0 && (
                                <div className="relative">
                                    <DailyTrendChart
                                        transactions={currentMonthTransactions}
                                        currentDate={`${selectedMonthKey}-01`}
                                        onDayClick={(payload: any) => setFilterDate(payload.date)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ArchiveModal
                show={showArchiveModal}
                dayData={selectedDayData}
                categories={categories}
                onClose={() => setShowArchiveModal(false)}
                onEdit={(trx) => { setEditingTransaction(trx); setShowTrxModal(true); }}
                onDelete={handleDeleteTrx}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

            <TransactionModal
                show={showTrxModal}
                editingTransaction={editingTransaction}
                categories={categories}
                transactions={transactions}
                budgets={budgets}
                onClose={() => setShowTrxModal(false)}
                onSubmit={handleSaveSingleTrx}
                onSwitchToBatch={() => { setShowTrxModal(false); setShowBatchModal(true); }}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

            <FinanceBatchModal
                show={showBatchModal}
                categories={categories}
                budgets={budgets}
                transactions={transactions}
                onClose={() => setShowBatchModal(false)}
                onSubmitBatch={handleSaveBatchTrx}
                onSwitchToSingle={() => { setShowBatchModal(false); setShowTrxModal(true); }}
            />

            <CategoryModal
                show={showCategoryModal}
                categories={categories}
                onClose={() => setShowCategoryModal(false)}
                onAddCategory={async (cat: any) => {
                    await fetch('/api/finance/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cat)
                    });
                    mutateCat();
                    if (cat.limit) {
                        mutateBud();
                    }
                    setShowCategoryModal(false);
                }}
                onDeleteCategory={async (slug: string) => {
                    mutateCat(categories.filter(c => c.slug !== slug), false);
                    mutateBud(budgets.filter(b => b.category !== slug), false);
                    await fetch(`/api/finance/categories?slug=${slug}`, { method: 'DELETE' });
                    mutateCat();
                    mutateBud();
                }}
            />

            <SavingModal
                show={showSavingModal}
                saving={editingSaving}
                onClose={() => setShowSavingModal(false)}
                onSave={handleSaveVault}
            />

            <VaultTransactionModal
                show={showVaultTxModal}
                saving={activeVault}
                type={vaultTxType}
                onClose={() => setShowVaultTxModal(false)}
                onSave={handleVaultMutation}
            />
        </AuthenticatedLayout>
    );
}
