'use client';

import { TransactionItem } from '../components/TransactionList';
import { CategoryOption } from '../types';
import { SavingVault, SavingFundingOption } from '../components/SavingModal';

export type FinanceDeleteTarget = 
    | { type: 'transaction'; data: { id: number | string; title?: string } }
    | { type: 'category'; data: { slug: string; name: string } }
    | { type: 'vault'; data: { id?: number | string; name: string } }
    | { type: 'wallet'; data: { id: string; name: string } }
    | { type: 'investment'; data: { id: number | string; name: string; ticker?: string } }
    | { type: 'recurring_bill'; data: { id: string; name: string } };

interface UseFinanceActionsParams {
    transactions: TransactionItem[];
    mutateTx: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
    categories: CategoryOption[];
    mutateCat: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
    budgets: any[];
    mutateBud: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
    mutateSav: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
    selectedMonthKey: string;
    deleteTarget: FinanceDeleteTarget | null;
    setDeleteTarget: (v: FinanceDeleteTarget | null) => void;
    setShowBatchModal: (v: boolean) => void;
    setShowSavingModal: (v: boolean) => void;
    setShowCategoryModal: (v: boolean) => void;
    setEditingCategory: (v: any) => void;
    setShowVaultTxModal: (v: boolean) => void;
    activeVault: SavingVault | null;
    vaultTxType: 'deposit' | 'withdraw';
    wallets?: any[];
    investments?: any[];
    recurringBills?: any[];
    saveUserConfig?: (updates: any) => Promise<void> | void;
}

export function useFinanceActions({
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
}: UseFinanceActionsParams) {

    const handleSaveSingleTrx = async (data: any) => {
        try {
            const targetWalletId = data.walletId || (wallets && wallets[0]?.id);
            const numAmount = Number(data.amount) || 0;
            
            if (wallets && saveUserConfig && targetWalletId && numAmount > 0) {
                let updatedWallets = [...wallets];
                if (data.id) {
                    const oldTrx = transactions.find(t => t.id === data.id);
                    if (oldTrx) {
                        const oldAmount = Number(oldTrx.amount) || 0;
                        const oldWalletId = (oldTrx as any).walletId || targetWalletId;
                        
                        // Revert old transaction from wallet
                        updatedWallets = updatedWallets.map(w => {
                            if (w.id === oldWalletId) {
                                const revertDelta = oldTrx.type === 'income' ? -oldAmount : oldAmount;
                                return { ...w, balance: Math.max(0, (Number(w.balance) || 0) + revertDelta) };
                            }
                            return w;
                        });
                    }
                }
                
                // Apply new transaction to wallet
                updatedWallets = updatedWallets.map(w => {
                    if (w.id === targetWalletId) {
                        const applyDelta = data.type === 'income' ? numAmount : -numAmount;
                        return { ...w, balance: Math.max(0, (Number(w.balance) || 0) + applyDelta) };
                    }
                    return w;
                });
                
                saveUserConfig({ finance_wallets: updatedWallets });
            }

            if (data.id) {
                mutateTx(transactions.map(t => t.id === data.id ? { ...data, amount: numAmount, date: data.date.split('T')[0] } : t), false);
                
                await fetch(`/api/finance/transactions/${data.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                mutateTx();
            } else {
                const tempId = Date.now();
                mutateTx([{ ...data, id: tempId, amount: numAmount, date: data.date.split('T')[0] }, ...transactions], false);
                
                await fetch('/api/finance/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                mutateTx();
            }
        } catch (error) {
            console.error('Failed to save transaction:', error);
        }
    };

    const handleSaveBatchTrx = async (date: string, rows: any[]) => {
        try {
            if (wallets && saveUserConfig && rows.length > 0) {
                let updatedWallets = [...wallets];
                for (const r of rows) {
                    const targetWalletId = r.walletId || wallets[0]?.id;
                    const amt = Number(r.amount) || 0;
                    if (targetWalletId && amt > 0) {
                        updatedWallets = updatedWallets.map(w => {
                            if (w.id === targetWalletId) {
                                const delta = r.type === 'income' ? amt : -amt;
                                return { ...w, balance: Math.max(0, (Number(w.balance) || 0) + delta) };
                            }
                            return w;
                        });
                    }
                }
                saveUserConfig({ finance_wallets: updatedWallets });
            }

            for (const r of rows) {
                await fetch('/api/finance/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date,
                        type: r.type,
                        amount: Number(r.amount),
                        title: r.title,
                        category: r.category || 'other',
                        walletId: r.walletId
                    })
                });
            }
            mutateTx();
            setShowBatchModal(false);
        } catch (error) {
            console.error('Failed to batch save transactions:', error);
        }
    };

    const handleDeleteTrx = async (id: number | string) => {
        const trx = transactions.find(t => String(t.id) === String(id));
        setDeleteTarget({ type: 'transaction', data: { id, title: trx?.title } });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            if (deleteTarget.type === 'transaction') {
                const { id } = deleteTarget.data;
                const trxToDelete = transactions.find(t => String(t.id) === String(id));
                if (trxToDelete && wallets && saveUserConfig) {
                    const targetWalletId = (trxToDelete as any).walletId || wallets[0]?.id;
                    const amt = Number(trxToDelete.amount) || 0;
                    if (targetWalletId && amt > 0) {
                        const revertDelta = trxToDelete.type === 'income' ? -amt : amt;
                        const updatedWallets = wallets.map(w => {
                            if (String(w.id) === String(targetWalletId)) {
                                return { ...w, balance: Math.max(0, (Number(w.balance) || 0) + revertDelta) };
                            }
                            return w;
                        });
                        await saveUserConfig({ finance_wallets: updatedWallets });
                    }
                }

                mutateTx(transactions.filter(t => String(t.id) !== String(id)), false);
                await fetch(`/api/finance/transactions/${id}`, { method: 'DELETE' });
                mutateTx();
            } else if (deleteTarget.type === 'category') {
                const cat = deleteTarget.data;
                const budgetToDelete = budgets.find(b => b.category === cat.slug);
                
                mutateCat(categories.filter(c => c.slug !== cat.slug), false);
                mutateBud(budgets.filter(b => b.category !== cat.slug), false);
                
                await fetch(`/api/finance/categories?slug=${cat.slug}`, { method: 'DELETE' });
                
                if (budgetToDelete) {
                    await fetch(`/api/finance/budgets?id=${budgetToDelete.id}`, { method: 'DELETE' });
                }
                
                mutateCat();
                mutateBud();
            } else if (deleteTarget.type === 'vault') {
                const { id } = deleteTarget.data;
                if (id && mutateSav) {
                    await fetch(`/api/finance/savings?id=${id}`, { method: 'DELETE' });
                    mutateSav();
                }
            } else if (deleteTarget.type === 'wallet') {
                const { id } = deleteTarget.data;
                if (wallets && saveUserConfig) {
                    const updated = wallets.filter(w => String(w.id) !== String(id));
                    await saveUserConfig({ finance_wallets: updated });
                }
            } else if (deleteTarget.type === 'investment') {
                const { id } = deleteTarget.data;
                if (investments && saveUserConfig) {
                    const updated = investments.filter(a => String(a.id) !== String(id));
                    await saveUserConfig({ finance_investments: updated });
                }
                try {
                    await fetch(`/api/finance/assets?id=${id}`, { method: 'DELETE' });
                } catch (e) {
                    // ignore if only in userConfig
                }
            } else if (deleteTarget.type === 'recurring_bill') {
                const { id } = deleteTarget.data;
                if (recurringBills && saveUserConfig) {
                    const updated = recurringBills.filter(b => String(b.id) !== String(id));
                    await saveUserConfig({ finance_recurring_bills: updated });
                }
            }
        } catch (err) {
            console.error('Failed executing deletion:', err);
        }

        setDeleteTarget(null);
    };

    const handleSaveVault = async (data: SavingVault, fundingOption?: SavingFundingOption) => {
        try {
            const initialAmount = fundingOption?.deductFromWallet && fundingOption.initialAmount ? fundingOption.initialAmount : Number(data.current_amount || 0);

            if (data.id) {
                const res = await fetch('/api/finance/savings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: data.id, title: data.title, targetAmount: Number(data.target_amount), icon: data.icon, color: data.color })
                });
                if (res.ok) {
                    mutateSav();
                    setShowSavingModal(false);
                }
            } else {
                const res = await fetch('/api/finance/savings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        title: data.title, 
                        targetAmount: Number(data.target_amount), 
                        currentAmount: initialAmount,
                        icon: data.icon, 
                        color: data.color 
                    })
                });
                if (res.ok) {
                    if (fundingOption?.deductFromWallet && fundingOption.walletId && initialAmount > 0) {
                        await handleSaveSingleTrx({
                            title: `Setoran Awal: ${data.title}`,
                            amount: initialAmount,
                            type: 'expense',
                            category: 'tabungan',
                            walletId: fundingOption.walletId,
                            date: fundingOption.date || new Date().toISOString().split('T')[0],
                            notes: fundingOption.notes || `Setoran awal ke pos tabungan ${data.title}`
                        });
                    }
                    mutateSav();
                    setShowSavingModal(false);
                }
            }
        } catch (error) {
            console.error('Failed to save vault:', error);
        }
    };

    const handleVaultMutation = async (amount: number, type: 'deposit' | 'withdraw', date?: string, walletId?: string) => {
        if (!activeVault) return;
        try {
            const currentAmount = Number(activeVault.current_amount || (activeVault as any).current || 0);
            const newCurrentAmount = type === 'deposit' ? currentAmount + amount : Math.max(0, currentAmount - amount);
            const targetWalletId = walletId || (wallets && wallets[0]?.id);
            const txDate = date || new Date().toISOString().split('T')[0];

            // 1. Update Vault in DB
            await fetch('/api/finance/savings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: activeVault.id,
                    title: activeVault.title || (activeVault as any).name,
                    targetAmount: Number(activeVault.target_amount || (activeVault as any).target || 0),
                    currentAmount: newCurrentAmount,
                    icon: activeVault.icon,
                    color: activeVault.color
                })
            });

            // 2. Log transaction & mutate wallet
            const vaultName = activeVault.title || (activeVault as any).name || 'Target Tabungan';
            if (type === 'deposit') {
                await handleSaveSingleTrx({
                    title: `Nabung: ${vaultName}`,
                    amount,
                    type: 'expense',
                    category: 'tabungan',
                    walletId: targetWalletId,
                    date: txDate,
                    notes: `Setoran ke pos tabungan ${vaultName}`
                });
            } else {
                await handleSaveSingleTrx({
                    title: `Tarik Tabungan: ${vaultName}`,
                    amount,
                    type: 'income',
                    category: 'tabungan',
                    walletId: targetWalletId,
                    date: txDate,
                    notes: `Pencairan dari pos tabungan ${vaultName}`
                });
            }

            mutateSav();
            setShowVaultTxModal(false);
        } catch (error) {
            console.error('Failed vault mutation:', error);
        }
    };

    const handleSaveCategory = async (cat: any, editingCategory: any) => {
        const method = editingCategory ? 'PUT' : 'POST';
        const endpoint = editingCategory && cat.id ? `/api/finance/categories?id=${cat.id}` : '/api/finance/categories';
        
        await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cat)
        });
        
        if (cat.type === 'expense' || cat.limit !== undefined) {
            const existingBudget = budgets.find(b => b.category === cat.slug);
            const budMethod = existingBudget ? 'PUT' : 'POST';
            const budEndpoint = existingBudget ? `/api/finance/budgets?id=${existingBudget.id}` : '/api/finance/budgets';
            
            await fetch(budEndpoint, {
                method: budMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: cat.slug,
                    limitAmount: cat.limit || 0,
                    month: selectedMonthKey
                })
            });
            mutateBud();
        }
        
        mutateCat();
        setShowCategoryModal(false);
        setEditingCategory(null);
    };

    const handleAddAssetTransaction = (tx: any) => {
        handleSaveSingleTrx({
            title: tx.title,
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            walletId: tx.walletId,
            date: tx.date
        });
    };

    return {
        handleSaveSingleTrx,
        handleSaveBatchTrx,
        handleDeleteTrx,
        confirmDelete,
        handleSaveVault,
        handleVaultMutation,
        handleSaveCategory,
        handleAddAssetTransaction
    };
}
