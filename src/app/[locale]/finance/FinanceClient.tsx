'use client';

import { useState, useEffect, useMemo } from 'react';
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

// New Feature Components (Pilihan A & B)
import WalletsSection, { WalletItem } from './components/WalletsSection';
import WalletModal from './components/WalletModal';
import TransferModal from './components/TransferModal';
import RecurringBillsSection, { RecurringBillItem } from './components/RecurringBillsSection';
import RecurringBillModal from './components/RecurringBillModal';

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

    // ===== 5. MULTI-WALLET (PILIHAN B) =====
    const defaultWallets: WalletItem[] = useMemo(() => [
        { id: 'w_bca', name: 'BCA Utama', type: 'bank', balance: 10500000, icon: '🏛️', color: '#005baa', accountNumber: '882-019-332' },
        { id: 'w_gopay', name: 'GoPay / E-Wallet', type: 'ewallet', balance: 450000, icon: '📱', color: '#00aed6' },
        { id: 'w_cash', name: 'Uang Tunai (Cash)', type: 'cash', balance: 350000, icon: '💵', color: '#10b981' },
    ], []);

    const wallets: WalletItem[] = useMemo(() => {
        return userSettings.finance_wallets || defaultWallets;
    }, [userSettings.finance_wallets, defaultWallets]);

    const [showWalletModal, setShowWalletModal] = useState(false);
    const [editingWallet, setEditingWallet] = useState<WalletItem | null>(null);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const handleSaveWallet = (walletData: WalletItem) => {
        const exists = wallets.some(w => w.id === walletData.id);
        const updated = exists 
            ? wallets.map(w => w.id === walletData.id ? walletData : w)
            : [...wallets, walletData];
        saveUserConfig({ finance_wallets: updated });
    };

    const handleDeleteWallet = (id: string) => {
        const updated = wallets.filter(w => w.id !== id);
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
        const fromW = wallets.find(w => w.id === fromWalletId);
        const toW = wallets.find(w => w.id === toWalletId);
        if (!fromW || !toW) return;

        const updatedWallets = wallets.map(w => {
            if (w.id === fromWalletId) {
                return { ...w, balance: Math.max(0, w.balance - (amount + adminFee)) };
            }
            if (w.id === toWalletId) {
                return { ...w, balance: w.balance + amount };
            }
            return w;
        });

        saveUserConfig({ finance_wallets: updatedWallets });

        // If admin fee exists, log it as an expense transaction
        if (adminFee > 0) {
            handleSaveSingleTrx({
                title: `Biaya Admin Transfer (${fromW.name} → ${toW.name})`,
                amount: adminFee,
                type: 'expense',
                category: 'utilitas',
                date: date || new Date().toISOString().split('T')[0],
                notes: notes || 'Biaya admin transfer antar akun'
            });
        }
    };

    // ===== 6. RECURRING BILLS (PILIHAN A) =====
    const defaultBills: RecurringBillItem[] = useMemo(() => [
        { id: 'b_netflix', name: 'Netflix Premium', amount: 186000, cycle: 'monthly', billingDay: 5, category: 'langganan', icon: '🍿', color: '#e50914' },
        { id: 'b_chatgpt', name: 'ChatGPT Plus AI', amount: 330000, cycle: 'monthly', billingDay: 12, category: 'langganan', icon: '🤖', color: '#10a37f' },
        { id: 'b_spotify', name: 'Spotify Duo', amount: 86000, cycle: 'monthly', billingDay: 20, category: 'langganan', icon: '🎵', color: '#1db954' },
        { id: 'b_wifi', name: 'WiFi Internet', amount: 375000, cycle: 'monthly', billingDay: 15, category: 'utilitas', icon: '📶', color: '#0284c7' }
    ], []);

    const recurringBills: RecurringBillItem[] = useMemo(() => {
        return userSettings.finance_recurring_bills || defaultBills;
    }, [userSettings.finance_recurring_bills, defaultBills]);

    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [editingBill, setEditingBill] = useState<RecurringBillItem | null>(null);

    // Track paid bill IDs this month from user settings
    const paidBillIdsThisMonth: string[] = useMemo(() => {
        return userSettings[`paid_bills_${selectedMonthKey}`] || [];
    }, [userSettings, selectedMonthKey]);

    const handleSaveBill = (billData: RecurringBillItem) => {
        const exists = recurringBills.some(b => b.id === billData.id);
        const updated = exists
            ? recurringBills.map(b => b.id === billData.id ? billData : b)
            : [...recurringBills, billData];
        saveUserConfig({ finance_recurring_bills: updated });
    };

    const handleDeleteBill = (id: string) => {
        const updated = recurringBills.filter(b => b.id !== id);
        saveUserConfig({ finance_recurring_bills: updated });
    };

    const handlePayAndLogBill = async (bill: RecurringBillItem) => {
        await handleSaveSingleTrx({
            title: bill.name,
            amount: bill.amount,
            type: 'expense',
            category: bill.category || 'langganan',
            date: new Date().toISOString().split('T')[0],
            notes: `Tagihan Rutin (${bill.cycle === 'yearly' ? 'Tahunan' : 'Bulanan'})`
        });

        const currentPaid = userSettings[`paid_bills_${selectedMonthKey}`] || [];
        if (!currentPaid.includes(bill.id)) {
            saveUserConfig({ [`paid_bills_${selectedMonthKey}`]: [...currentPaid, bill.id] });
        }
    };

    // ===== 7. MODAL STATES =====
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

    // ===== 8. COMPUTED METRICS =====
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

    // ===== 9. ACTIONS HOOK =====
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
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500 pb-24">
                <FinanceHeader
                    selectedMonthKey={selectedMonthKey}
                    onMonthChange={changeMonth}
                    onOpenTrxModal={() => { setEditingTransaction(null); setShowTrxModal(true); }}
                    onOpenBatchModal={() => setShowBatchModal(true)}
                    activeCurrency={activeCurrency}
                    onCurrencyChange={handleCurrencyChange}
                    transactions={transactions}
                />

                <div className="w-full min-h-screen px-3 sm:px-6 lg:px-8 py-6 transition-colors duration-500 max-w-[1750px] mx-auto space-y-8">
                    
                    {/* Top KPI Stats */}
                    <div className="overflow-x-auto no-scrollbar -mx-3 px-3 lg:mx-0 lg:px-0">
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

                    {/* NEW: Multi-Wallet Section (Pilihan B) */}
                    <WalletsSection
                        wallets={wallets}
                        activeCurrency={activeCurrency}
                        currencyLocale={currencyLocale}
                        onOpenAddWallet={() => { setEditingWallet(null); setShowWalletModal(true); }}
                        onEditWallet={(w) => { setEditingWallet(w); setShowWalletModal(true); }}
                        onDeleteWallet={handleDeleteWallet}
                        onOpenTransferModal={() => setShowTransferModal(true)}
                    />

                    {/* Main 2-Column Finance Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
                        
                        {/* Left Column: Budgets + Insights */}
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

                        {/* Right Column: Transactions + Recurring Bills + Savings + Chart */}
                        <div className="lg:col-span-3 space-y-8 w-full order-2 lg:order-1 pb-16 lg:pb-0">
                            
                            {/* Transactions List */}
                            <TransactionList
                                transactions={transactions}
                                categories={categories}
                                filterDate={filterDate}
                                setFilterDate={setFilterDate}
                                onOpenDayDetail={handleOpenDayDetail}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                            />

                            {/* NEW: Recurring Subscriptions & Bills Hub (Pilihan A) */}
                            <RecurringBillsSection
                                bills={recurringBills}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                                onOpenAddModal={() => { setEditingBill(null); setShowRecurringModal(true); }}
                                onEditBill={(b) => { setEditingBill(b); setShowRecurringModal(true); }}
                                onDeleteBill={handleDeleteBill}
                                onPayAndLog={handlePayAndLogBill}
                                paidBillIdsThisMonth={paidBillIdsThisMonth}
                            />

                            {/* Savings Vault Section */}
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

                            {/* Daily Trend Chart */}
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

            {/* Standard Finance Modals */}
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

            {/* NEW: Wallet Modals */}
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

            {/* NEW: Recurring Bill Modal */}
            <RecurringBillModal
                show={showRecurringModal}
                editingBill={editingBill}
                categories={categories}
                onClose={() => setShowRecurringModal(false)}
                onSave={handleSaveBill}
                activeCurrency={activeCurrency}
            />
        </AuthenticatedLayout>
    );
}
