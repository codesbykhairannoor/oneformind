'use client';

import React from 'react';
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

interface FinanceModalsContainerProps {
    showArchiveModal: boolean;
    setShowArchiveModal: (v: boolean) => void;
    selectedDayData: DayStat | null;
    categories: CategoryOption[];
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

    deleteTarget: { type: 'transaction' | 'category'; data: any } | null;
    setDeleteTarget: (target: { type: 'transaction' | 'category'; data: any } | null) => void;
    confirmDelete: () => void;

    showSavingModal: boolean;
    setShowSavingModal: (v: boolean) => void;
    editingSaving: SavingVault | null;
    onSaveVault: (data: SavingVault) => void;

    showVaultTxModal: boolean;
    setShowVaultTxModal: (v: boolean) => void;
    activeVault: SavingVault | null;
    vaultTxType: 'deposit' | 'withdraw';
    onVaultMutation: (amount: number, note: string) => void;
}

export default function FinanceModalsContainer({
    showArchiveModal,
    setShowArchiveModal,
    selectedDayData,
    categories,
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
                itemName={deleteTarget?.type === 'category' ? deleteTarget.data.name : 'Transaksi'}
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
                onClose={() => setShowVaultTxModal(false)}
                onSave={onVaultMutation}
            />
        </>
    );
}
