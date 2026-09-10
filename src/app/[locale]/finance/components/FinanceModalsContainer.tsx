'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { TransactionItem, DayStat } from './TransactionList';
import { CategoryOption } from '../types';
import { SavingVault } from './SavingModal';
import ArchiveModal from './ArchiveModal';
import TransactionModal from './TransactionModal';
import FinanceBatchModal from './FinanceBatchModal';
import CategoryModal from './CategoryModal';
import SavingModal from './SavingModal';
import VaultTransactionModal from './VaultTransactionModal';
import { DeleteConfirmModal } from './FinanceModals';
import { FinanceDeleteTarget } from '../hooks/useFinanceActions';

interface FinanceModalsContainerProps {
    showArchiveModal: boolean;
    setShowArchiveModal: (v: boolean) => void;
    selectedDayData: DayStat | null;
    categories: CategoryOption[];
    wallets?: any[];
    activeCurrency: string;
    currencyLocale: string;
    onEditTransactionFromArchive: (trx: TransactionItem) => void;
    onDeleteTrx: (id: number) => void;

    showTrxModal: boolean;
    setShowTrxModal: (v: boolean) => void;
    editingTransaction: TransactionItem | null;
    transactions: TransactionItem[];
    budgets: any[];
    onSaveSingleTrx: (data: any) => void;
    onSwitchToBatch: () => void;

    showBatchModal: boolean;
    setShowBatchModal: (v: boolean) => void;
    onSaveBatchTrx: (date: string, rows: any[]) => void;
    onSwitchToSingle: () => void;

    showCategoryModal: boolean;
    setShowCategoryModal: (v: boolean) => void;
    editingCategory: any;
    setEditingCategory: (cat: any) => void;
    onSaveCategory: (cat: any) => void;

    deleteTarget: FinanceDeleteTarget | null;
    setDeleteTarget: (target: FinanceDeleteTarget | null) => void;
    confirmDelete: () => void;

    showSavingModal: boolean;
    setShowSavingModal: (v: boolean) => void;
    editingSaving: SavingVault | null;
    onSaveVault: (data: SavingVault) => void;

    showVaultTxModal: boolean;
    setShowVaultTxModal: (v: boolean) => void;
    activeVault: SavingVault | null;
    vaultTxType: 'deposit' | 'withdraw';
    onVaultMutation: (amount: number, type: 'deposit' | 'withdraw', date?: string, walletId?: string) => void;
}

export default function FinanceModalsContainer({
    showArchiveModal,
    setShowArchiveModal,
    selectedDayData,
    categories,
    wallets = [],
    activeCurrency,
    currencyLocale,
    onEditTransactionFromArchive,
    onDeleteTrx,

    showTrxModal,
    setShowTrxModal,
    editingTransaction,
    transactions,
    budgets,
    onSaveSingleTrx,
    onSwitchToBatch,

    showBatchModal,
    setShowBatchModal,
    onSaveBatchTrx,
    onSwitchToSingle,

    showCategoryModal,
    setShowCategoryModal,
    editingCategory,
    setEditingCategory,
    onSaveCategory,

    deleteTarget,
    setDeleteTarget,
    confirmDelete,

    showSavingModal,
    setShowSavingModal,
    editingSaving,
    onSaveVault,

    showVaultTxModal,
    setShowVaultTxModal,
    activeVault,
    vaultTxType,
    onVaultMutation
}: FinanceModalsContainerProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const getItemName = () => {
        if (!deleteTarget) return '';
        switch (deleteTarget.type) {
            case 'transaction': return deleteTarget.data.title || (isIndo ? 'Transaksi Ini' : 'This Transaction');
            case 'category': return deleteTarget.data.name;
            case 'vault': return deleteTarget.data.name || (isIndo ? 'Target Tabungan Ini' : 'This Goal Vault');
            case 'wallet': return deleteTarget.data.name || (isIndo ? 'Dompet Ini' : 'This Wallet');
            case 'investment': return `${deleteTarget.data.name} ${deleteTarget.data.ticker ? `(${deleteTarget.data.ticker})` : ''}`.trim();
            case 'recurring_bill': return deleteTarget.data.name || (isIndo ? 'Tagihan Rutin Ini' : 'This Recurring Bill');
            default: return isIndo ? 'Item Ini' : 'This Item';
        }
    };

    return (
        <>
            <ArchiveModal
                show={showArchiveModal}
                dayData={selectedDayData}
                categories={categories}
                onClose={() => setShowArchiveModal(false)}
                onEdit={onEditTransactionFromArchive}
                onDelete={onDeleteTrx}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

            <TransactionModal
                show={showTrxModal}
                editingTransaction={editingTransaction}
                categories={categories}
                wallets={wallets}
                transactions={transactions}
                budgets={budgets}
                onClose={() => setShowTrxModal(false)}
                onSubmit={onSaveSingleTrx}
                onSwitchToBatch={onSwitchToBatch}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />

            <FinanceBatchModal
                show={showBatchModal}
                categories={categories}
                wallets={wallets}
                budgets={budgets}
                transactions={transactions}
                onClose={() => setShowBatchModal(false)}
                onSubmitBatch={onSaveBatchTrx}
                onSwitchToSingle={onSwitchToSingle}
            />

            <CategoryModal
                show={showCategoryModal}
                categories={categories}
                editingCategory={editingCategory}
                onClose={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                }}
                onSaveCategory={onSaveCategory}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                itemName={getItemName()}
            />

            <SavingModal
                show={showSavingModal}
                saving={editingSaving}
                onClose={() => setShowSavingModal(false)}
                onSave={onSaveVault}
            />

            <VaultTransactionModal
                show={showVaultTxModal}
                saving={activeVault}
                type={vaultTxType}
                wallets={wallets}
                onClose={() => setShowVaultTxModal(false)}
                onSave={onVaultMutation}
                activeCurrency={activeCurrency}
                currencyLocale={currencyLocale}
            />
        </>
    );
}
