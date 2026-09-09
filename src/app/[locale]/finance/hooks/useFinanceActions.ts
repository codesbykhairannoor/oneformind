'use client';

import { TransactionItem } from '../components/TransactionList';
import { CategoryOption } from '../types';
import { SavingVault } from '../components/SavingModal';

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
            if (data.id) {
                mutateTx(transactions.map(t => t.id === data.id ? { ...data, amount: Number(data.amount), date: data.date.split('T')[0] } : t), false);
                
                await fetch(`/api/finance/transactions/${data.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                mutateTx();
            } else {
                const tempId = Date.now();
                mutateTx([{ ...data, id: tempId, amount: Number(data.amount), date: data.date.split('T')[0] }, ...transactions], false);
                
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
            for (const r of rows) {
                await fetch('/api/finance/transactions', {
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
        const trx = transactions.find(t => t.id === id);
        setDeleteTarget({ type: 'transaction', data: { id, title: trx?.title } });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            if (deleteTarget.type === 'transaction') {
                const { id } = deleteTarget.data;
                mutateTx(transactions.filter(t => t.id !== id), false);
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
                    const updated = wallets.filter(w => w.id !== id);
                    saveUserConfig({ finance_wallets: updated });
                }
            } else if (deleteTarget.type === 'investment') {
                const { id } = deleteTarget.data;
                if (investments && saveUserConfig) {
                    const updated = investments.filter(a => a.id !== id);
                    saveUserConfig({ finance_investments: updated });
                }
            } else if (deleteTarget.type === 'recurring_bill') {
                const { id } = deleteTarget.data;
                if (recurringBills && saveUserConfig) {
                    const updated = recurringBills.filter(b => b.id !== id);
                    saveUserConfig({ finance_recurring_bills: updated });
                }
            }
        } catch (err) {
            console.error('Failed executing deletion:', err);
        }

        setDeleteTarget(null);
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

    const handleVaultMutation = async (amount: number, note: string) => {
        if (!activeVault) return;
        try {
            const res = await fetch(`/api/finance/savings/${activeVault.id}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, type: vaultTxType, note })
            });
            if (res.ok) {
                mutateSav();
                mutateTx();
                setShowVaultTxModal(false);
            }
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
