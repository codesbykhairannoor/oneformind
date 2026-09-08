'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { usePageTitle } from '@/hooks/usePageTitle';

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
import { useFinanceActions } from './hooks/useFinanceActions';

const DailyTrendChart = dynamic(() => import('./components/DailyTrendChart'), { ssr: false });

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
    const swrOptions = { keepPreviousData: true };
    const { data: txRawData, mutate: mutateTx } = useSWR(`/api/finance/transactions?month=${selectedMonthKey}`, fetcher, swrOptions);
    const { data: catRawData, mutate: mutateCat } = useSWR(`/api/finance/categories`, fetcher, swrOptions);
    const { data: budRawData, mutate: mutateBud } = useSWR(`/api/finance/budgets?month=${selectedMonthKey}`, fetcher, swrOptions);
    const { data: savRawData, mutate: mutateSav } = useSWR(`/api/finance/savings`, fetcher, swrOptions);

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

    // ===== 4. INCOME TARGET =====
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

    // ===== 5. MODAL STATES =====
    const [showTrxModal, setShowTrxModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deleteTarget, setDeleteTarget] = useState<{type: 'transaction'|'category', data: any} | null>(null);
    const [showSavingModal, setShowSavingModal] = useState(false);
    const [showVaultTxModal, setShowVaultTxModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);

    const [selectedDayData, setSelectedDayData] = useState<DayStat | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
    const [editingSaving, setEditingSaving] = useState<SavingVault | null>(null);
    const [activeVault, setActiveVault] = useState<SavingVault | null>(null);
    const [vaultTxType, setVaultTxType] = useState<'deposit' | 'withdraw'>('deposit');
    const [filterDate, setFilterDate] = useState('');

    // ===== 6. COMPUTED METRICS =====
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

    // ===== 7. ACTIONS HOOK =====
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
        vaultTxType
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
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
                <FinanceHeader
                    selectedMonth={selectedMonthKey}
                    onChangeMonth={changeMonth}
                    onOpenAddModal={() => { setEditingTransaction(null); setShowTrxModal(true); }}
                    onOpenBatchModal={() => setShowBatchModal(true)}
                    activeCurrency={activeCurrency}
                    onCurrencyChange={handleCurrencyChange}
                    transactions={transactions}
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

                        <div className="lg:col-span-3 space-y-8 w-full order-2 lg:order-1 pb-24 lg:pb-0">
                            <TransactionList
                                transactions={transactions}
                                categories={categories}
                                filterDate={filterDate}
                                setFilterDate={setFilterDate}
                                onOpenDayDetail={handleOpenDayDetail}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                            />

                            <SavingsVaultSection
                                savingsVault={savingsVault}
                                t={t}
                                onOpenCreateVault={() => { setEditingSaving(null); setShowSavingModal(true); }}
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

                            <div className="lg:hidden relative">
                                <FinanceInsights 
                                    activeCurrency={activeCurrency}
                                    currencyLocale={currencyLocale}
                                    onAddTransaction={handleAddAssetTransaction}
                                />
                            </div>

                            {transactions.length > 0 && (
                                <div className="relative">
                                    <DailyTrendChart
                                        transactions={transactions}
                                        currentDate={`${selectedMonthKey}-01`}
                                        onDayClick={(payload: any) => setFilterDate(payload.date)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <FinanceModalsContainer
                showArchiveModal={showArchiveModal}
                setShowArchiveModal={setShowArchiveModal}
                selectedDayData={selectedDayData}
                categories={categories}
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
        </AuthenticatedLayout>
    );
}
