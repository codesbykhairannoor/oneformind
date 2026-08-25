import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Plus, Edit3, PiggyBank, Target, Layers, Calendar } from 'lucide-react';
import { TransactionItem } from './TransactionList';
import { BudgetItem } from './BudgetSidebar';
import { SavingsVaultItem } from './SavingCard';
import FinanceDatePicker from './FinanceDatePicker';
import { useTranslations } from 'next-intl';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const BaseModal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==========================
// Transaction Modal
// ==========================
export const TransactionModal = ({
    isOpen, onClose, onSubmit, editingId,
    title, setTitle, amount, setAmount, type, setType, category, setCategory, date, setDate, notes, setNotes, categoriesList
}: any) => {
    const t = useTranslations();
    const [showDatePicker, setShowDatePicker] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-slate-50 dark:bg-slate-950 flex flex-col w-full max-w-md max-h-[85dvh] md:max-h-[85vh] relative overflow-visible transition-all duration-500 border border-slate-200 dark:border-slate-800 shadow-2xl dark:shadow-none rounded-[2.5rem] animate-in fade-in zoom-in-95">
                
                {/* Header */}
                <div className="px-6 md:px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-20 shrink-0 rounded-t-[2.5rem]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg dark:shadow-none shadow-indigo-200 dark:shadow-indigo-900/20 shrink-0">
                            ✨
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-2">
                                {editingId ? (t('edit_transaction') || 'Edit Transaksi') : (t('record_transaction') || 'Transaksi Baru')}
                            </h3>
                            {!editingId && (
                                <button type="button" className="text-[10px] font-bold tracking-tight px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition duration-300 flex items-center gap-1.5 active:scale-95 w-fit border border-indigo-100 dark:border-indigo-500/20">
                                    <span>⚡</span> {t('batch_mode_title') || 'Batch Mode'}
                                </button>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-90 flex items-center justify-center font-bold">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-5">
                    
                    {/* Type Switcher */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl transition-colors duration-500">
                        <button type="button" onClick={() => setType('expense')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-tight transition-all flex items-center justify-center gap-2 duration-300 ${type === 'expense' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm dark:shadow-none' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                            {type === 'expense' && <span>🔴</span>} {t('out') || 'Pengeluaran'}
                        </button>
                        <button type="button" onClick={() => setType('income')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-tight transition-all flex items-center justify-center gap-2 duration-300 ${type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-none' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                            {type === 'income' && <span>🟢</span>} {t('in') || 'Pemasukan'}
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className={`block text-[10px] font-bold tracking-tight mb-2 transition-colors duration-500 ml-1 ${type === 'expense' ? 'text-rose-400 dark:text-rose-400/80' : 'text-emerald-400 dark:text-emerald-400/80'}`}>
                            {t('amount') || 'Jumlah'}
                        </label>
                        <div className="relative group">
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg transition-colors duration-500 ${type === 'expense' ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}`}>Rp</span>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" 
                                className={`w-full pl-12 pr-4 h-14 rounded-xl border-2 bg-white dark:bg-slate-900 focus:ring-0 font-black text-2xl transition-all dark:text-white border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 ${type === 'expense' ? 'focus:border-rose-500' : 'focus:border-emerald-500'}`} />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-2 transition-colors duration-500 ml-1 tracking-tight">{t('description') || 'Deskripsi'}</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder={t('desc_placeholder') || 'Cth: Kopi, Gaji...'}
                            className="w-full px-4 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-0 font-bold text-sm text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700" />
                    </div>

                    {/* Cat & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-2 transition-colors duration-500 ml-1 tracking-tight">{t('category') || 'Kategori'}</label>
                            <div className="relative">
                                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full pl-4 pr-8 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-0 font-bold text-slate-700 dark:text-slate-200 text-sm appearance-none cursor-pointer transition-all">
                                    <option value="" disabled>{t('select_placeholder') || 'Pilih...'}</option>
                                    {categoriesList.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-2 transition-colors duration-500 ml-1 tracking-tight">{t('date') || 'Tanggal'}</label>
                            <button type="button" onClick={() => setShowDatePicker(!showDatePicker)} className="w-full px-4 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-500/40 font-bold text-slate-700 dark:text-slate-200 text-sm transition-all flex items-center justify-between transition-colors duration-500">
                                <span className="truncate">{date ? new Date(date).toLocaleDateString() : ''}</span>
                                <span className="text-slate-400 dark:text-slate-600">📅</span>
                            </button>
                            {showDatePicker && (
                                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                                    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowDatePicker(false)}></div>
                                    <FinanceDatePicker 
                                        show={true}
                                        modelValue={date}
                                        onUpdateModelValue={(val) => setDate(val)}
                                        onClose={() => setShowDatePicker(false)}
                                        className="relative z-10"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 md:px-8 py-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3 z-20 shrink-0 rounded-b-[2.5rem]">
                    <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl text-[11px] font-bold border-2 dark:border-slate-700 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 transition-all duration-300">
                        {t('btn_cancel') || 'Batal'}
                    </button>
                    <button type="button" onClick={onSubmit} className={`flex-[2] rounded-xl py-3.5 shadow-xl dark:shadow-none transition-all transform active:scale-95 font-bold text-white text-[11px] justify-center duration-300 ${type === 'expense' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-rose-900/40' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/40'}`}>
                        {t('btn_save_manual') || 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================
// Delete Modal
// ==========================
export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }: any) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Hapus Transaksi?">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} strokeWidth={2.5} />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-6">
                    Apakah Anda yakin ingin menghapus <strong className="text-slate-800 dark:text-white">{itemName}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex w-full gap-3">
                    <button onClick={onClose} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Batal</button>
                    <button onClick={onConfirm} className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-rose-500 shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-600 transition-all active:scale-95">Ya, Hapus!</button>
                </div>
            </div>
        </BaseModal>
    );
};
