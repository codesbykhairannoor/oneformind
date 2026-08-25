'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import FinanceHeader, { SUPPORTED_CURRENCIES } from './components/FinanceHeader';
import FinanceStats from './components/FinanceStats';
import BudgetSidebar from './components/BudgetSidebar';
import SavingCard, { SavingsVaultItem } from './components/SavingCard';
import TransactionList, { TransactionItem, DayStat } from './components/TransactionList';
import DailyTrendChart from './components/DailyTrendChart';
import TransactionModal from './components/TransactionModal';
import FinanceBatchModal from './components/FinanceBatchModal';
import CategoryModal from './components/CategoryModal';
import SavingModal, { SavingVault } from './components/SavingModal';
import VaultTransactionModal from './components/VaultTransactionModal';
import ArchiveModal from './components/ArchiveModal';
import FinanceInsights from './components/FinanceInsights';
import { Wallet, Plus } from 'lucide-react';

interface CategoryOption {
    slug: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
}

export default function FinancePage() {
    const t = useTranslations();
    const locale = useLocale();

    // ===== 1. CURRENCY SYSTEM (1:1 from useFinanceFormat.js) =====
    const [activeCurrency, setActiveCurrency] = useState('IDR');
    const currencyObj = SUPPORTED_CURRENCIES.find(c => c.code === activeCurrency) || SUPPORTED_CURRENCIES[0];
    const currencyLocale = currencyObj.locale;

    useEffect(() => {
        const savedCurrency = localStorage.getItem('finance_currency');
        if (savedCurrency) {
            setActiveCurrency(savedCurrency);
        }
    }, []);

    const handleCurrencyChange = (code: string) => {
        setActiveCurrency(code);
        localStorage.setItem('finance_currency', code);
    };

    // ===== 2. DATE STATE =====
    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [selectedMonthKey, setSelectedMonthKey] = useState(currentMonthStr);

    // ===== 3. CATEGORIES STATE =====
    const [categories, setCategories] = useState<CategoryOption[]>([
        { slug: 'gaji', name: 'Gaji Utama', icon: '💰', type: 'income' },
        { slug: 'freelance', name: 'Freelance & Project', icon: '💻', type: 'income' },
        { slug: 'investasi', name: 'Hasil Investasi', icon: '📈', type: 'income' },
        { slug: 'makanan', name: 'Makanan & Minuman', icon: '🍳', type: 'expense' },
        { slug: 'transportasi', name: 'Transportasi & Bensin', icon: '🚗', type: 'expense' },
        { slug: 'tagihan', name: 'Tagihan & SaaS', icon: '⚡', type: 'expense' },
        { slug: 'hiburan', name: 'Hiburan & Rekreasi', icon: '🎬', type: 'expense' },
        { slug: 'belanja', name: 'Belanja Kebutuhan', icon: '🛍️', type: 'expense' }
    ]);

    // ===== 4. TRANSACTIONS STATE =====
    const [transactions, setTransactions] = useState<TransactionItem[]>([
        { id: 1, title: 'Gaji Utama Project Lead', amount: 15000000, type: 'income', category: 'gaji', date: `${currentMonthStr}-01`, notes: 'Gaji bulanan' },
        { id: 2, title: 'Supermarket & Groceries', amount: 1250000, type: 'expense', category: 'makanan', date: `${currentMonthStr}-03`, notes: 'Belanja mingguan' },
        { id: 3, title: 'Langganan Cloud Server', amount: 650000, type: 'expense', category: 'tagihan', date: `${currentMonthStr}-05` },
        { id: 4, title: 'Bonus Client Freelance', amount: 4500000, type: 'income', category: 'freelance', date: `${currentMonthStr}-10` },
        { id: 5, title: 'Servis Mobil & Bensin', amount: 850000, type: 'expense', category: 'transportasi', date: `${currentMonthStr}-12` },
        { id: 6, title: 'Nonton Bioskop', amount: 150000, type: 'expense', category: 'hiburan', date: `${currentMonthStr}-14` },
        { id: 7, title: 'Dividen Saham Q3', amount: 2200000, type: 'income', category: 'investasi', date: `${currentMonthStr}-15` }
    ]);

    // ===== 5. BUDGETS STATE =====
    const [budgets, setBudgets] = useState([
        { id: 1, category: 'makanan', limit: 3000000, icon: '🍳', spent: 0 },
        { id: 2, category: 'transportasi', limit: 1500000, icon: '🚗', spent: 0 },
        { id: 3, category: 'tagihan', limit: 2000000, icon: '⚡', spent: 0 },
        { id: 4, category: 'hiburan', limit: 1000000, icon: '🎬', spent: 0 }
    ]);

    // ===== 6. SAVINGS VAULT STATE =====
    const [savingsVault, setSavingsVault] = useState<SavingsVaultItem[]>([
        { id: 1, name: 'Dana Darurat 6 Bulan', target: 50000000, current: 32000000, icon: '🛡️', color: '#10b981' },
        { id: 2, name: 'DP Rumah Impian', target: 150000000, current: 65000000, icon: '🏡', color: '#6366f1' },
        { id: 3, name: 'Investasi Saham & ETF', target: 30000000, current: 18500000, icon: '📈', color: '#8b5cf6' }
    ]);

    // ===== 7. INCOME TARGET =====
    const [incomeTarget, setIncomeTarget] = useState(21472000);

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

    // Persistence
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const savedTrx = localStorage.getItem('oneformind_finance_transactions');
        if (savedTrx) { try { const p = JSON.parse(savedTrx); if (Array.isArray(p) && p.length > 0) setTransactions(p); } catch (e) {} }
        const savedCats = localStorage.getItem('oneformind_finance_categories');
        if (savedCats) { try { const p = JSON.parse(savedCats); if (Array.isArray(p) && p.length > 0) setCategories(p); } catch (e) {} }
        const savedVault = localStorage.getItem('oneformind_finance_savings');
        if (savedVault) { try { const p = JSON.parse(savedVault); if (Array.isArray(p) && p.length > 0) setSavingsVault(p); } catch (e) {} }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('oneformind_finance_transactions', JSON.stringify(transactions));
            localStorage.setItem('oneformind_finance_categories', JSON.stringify(categories));
            localStorage.setItem('oneformind_finance_savings', JSON.stringify(savingsVault));
        }
    }, [transactions, categories, savingsVault, isLoaded]);

    // COMPUTED
    const currentMonthTransactions = transactions.filter(t => t.date.startsWith(selectedMonthKey));
    const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

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

    const handleSaveSingleTrx = (data: any) => {
        if (data.id) {
            setTransactions(prev => prev.map(t => t.id === data.id ? data : t));
        } else {
            setTransactions(prev => [{ ...data, id: Date.now() }, ...prev]);
        }
    };

    const handleSaveBatchTrx = (date: string, rows: any[]) => {
        const newTrxs: TransactionItem[] = rows.map((r, i) => ({
            id: Date.now() + i, date, type: r.type, amount: Number(r.amount), title: r.title, category: r.category || 'other'
        }));
        setTransactions(prev => [...newTrxs, ...prev]);
    };

    const handleDeleteTrx = (id: number) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const handleSaveVault = (data: SavingVault) => {
        if (data.id) {
            setSavingsVault(prev => prev.map(s => s.id === data.id ? { ...s, name: data.title, target: Number(data.target_amount), icon: data.icon } : s));
        } else {
            setSavingsVault(prev => [...prev, { id: Date.now(), name: data.title, target: Number(data.target_amount), current: 0, icon: data.icon, color: '#6366f1' }]);
        }
    };

    const handleVaultMutation = (amount: number, type: 'deposit' | 'withdraw') => {
        if (!activeVault) return;
        setSavingsVault(prev => prev.map(s => {
            if (s.id === activeVault.id) {
                return { ...s, current: type === 'deposit' ? s.current + amount : Math.max(0, s.current - amount) };
            }
            return s;
        }));
    };

    const handleAddAssetTransaction = (data: any) => {
        setTransactions(prev => [{ ...data, id: Date.now() }, ...prev]);
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500 pb-20">
                
                {/* FinanceHeader — sticky nav bar with full 5-currency dropdown */}
                <FinanceHeader
                    selectedMonthKey={selectedMonthKey}
                    onMonthChange={changeMonth}
                    onOpenTrxModal={() => { setEditingTransaction(null); setShowTrxModal(true); }}
                    onOpenBudgetModal={() => setShowCategoryModal(true)}
                    onOpenBatchModal={() => setShowBatchModal(true)}
                    activeCurrency={activeCurrency}
                    onCurrencyChange={handleCurrencyChange}
                />

                {/* Main Content — 1:1 from Index.vue line 500 */}
                <div className="w-full min-h-screen px-3 sm:px-6 lg:px-8 py-6 transition-colors duration-500">
                    
                    {/* FinanceStats — 1:1 from Index.vue line 501-503 */}
                    <div className="mb-8 overflow-x-auto no-scrollbar -mx-3 px-3 lg:mx-0 lg:px-0">
                        <FinanceStats
                            totalIncome={totalIncome}
                            totalExpense={totalExpense}
                            balance={balance}
                            incomeTarget={incomeTarget}
                            onUpdateTarget={setIncomeTarget}
                            activeCurrency={activeCurrency}
                            currencyLocale={currencyLocale}
                        />
                    </div>

                    {/* 5-Column Grid — 1:1 from Index.vue line 505 */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
                        
                        {/* RIGHT SIDEBAR (2 cols, sticky) — 1:1 from Index.vue line 506-535 */}
                        <div className="lg:col-span-2 w-full lg:sticky lg:top-24 h-fit space-y-8 lg:space-y-6 order-1 lg:order-2">
                            <BudgetSidebar
                                budgets={budgets}
                                categories={categories}
                                expenseStats={expenseStats}
                                incomeStats={incomeStats}
                                onAddBudget={() => setShowCategoryModal(true)}
                                onEditBudget={() => setShowCategoryModal(true)}
                                onDeleteBudget={(id) => setBudgets(prev => prev.filter(b => b.id !== id))}
                                onAddCategory={() => setShowCategoryModal(true)}
                                onEditCategory={() => setShowCategoryModal(true)}
                                onDeleteCategory={(cat) => setCategories(prev => prev.filter(c => c.slug !== cat.slug))}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                            />

                            {/* Investment Lab — 1:1 from Index.vue line 524-534 */}
                            <div className="hidden lg:block">
                                <FinanceInsights 
                                    activeCurrency={activeCurrency}
                                    currencyLocale={currencyLocale}
                                    onAddTransaction={handleAddAssetTransaction}
                                />
                            </div>
                        </div>

                        {/* LEFT MAIN COLUMN (3 cols) — 1:1 from Index.vue line 537-638 */}
                        <div className="lg:col-span-3 space-y-8 w-full order-2 lg:order-1 pb-24 lg:pb-0">
                            
                            {/* Daily History (Grouped by Day) — 1:1 from Index.vue line 538-592 */}
                            <TransactionList
                                transactions={currentMonthTransactions}
                                categories={categories}
                                filterDate={filterDate}
                                setFilterDate={setFilterDate}
                                onOpenDayDetail={handleOpenDayDetail}
                                activeCurrency={activeCurrency}
                                currencyLocale={currencyLocale}
                            />

                            {/* 🏦 The Vault (Savings) — 1:1 from Index.vue line 593-618 */}
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

                            {/* Mobile-only FinanceInsights — 1:1 from Index.vue line 622-631 */}
                                                            <div className="lg:hidden relative">
                                                                <FinanceInsights 
                                                                    activeCurrency={activeCurrency}
                                                                    currencyLocale={currencyLocale}
                                                                    onAddTransaction={handleAddAssetTransaction}
                                                                />
                                                            </div>

                            {/* Trend Chart — 1:1 from Index.vue line 633-637 */}
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

            {/* MODALS — 1:1 from Index.vue line 642-647 */}
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
                onClose={() => setShowTrxModal(false)}
                onSubmit={handleSaveSingleTrx}
                onSwitchToBatch={() => { setShowTrxModal(false); setShowBatchModal(true); }}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

            <FinanceBatchModal
                show={showBatchModal}
                categories={categories}
                onClose={() => setShowBatchModal(false)}
                onSubmitBatch={handleSaveBatchTrx}
                onSwitchToSingle={() => { setShowBatchModal(false); setShowTrxModal(true); }}
            />

            <CategoryModal
                show={showCategoryModal}
                categories={categories}
                onClose={() => setShowCategoryModal(false)}
                onAddCategory={(cat: any) => {
                    setCategories(prev => [...prev, { slug: cat.slug, name: cat.name, icon: cat.icon, type: cat.type }]);
                    if (cat.type === 'expense' && cat.limit) {
                        setBudgets(prev => [...prev, { id: Date.now(), category: cat.slug, limit: cat.limit, icon: cat.icon, spent: 0 }]);
                    }
                }}
                onDeleteCategory={(slug: string) => {
                    setCategories(prev => prev.filter(c => c.slug !== slug));
                    setBudgets(prev => prev.filter(b => b.category !== slug));
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
