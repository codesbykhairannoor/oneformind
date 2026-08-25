'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface CategoryItem {
    slug: string;
    name: string;
    icon: string;
    type?: 'income' | 'expense';
    limit?: number;
}

interface CategoryModalProps {
    show: boolean;
    categories: CategoryItem[];
    onClose: () => void;
    onAddCategory: (cat: CategoryItem) => void;
    onDeleteCategory: (slug: string) => void;
}

export default function CategoryModal({
    show,
    categories,
    onClose,
    onAddCategory,
    onDeleteCategory
}: CategoryModalProps) {
    const t = useTranslations();
    const iconPalette = ['💰', '💸', '🏦', '💎', '🎥', '🎤', '🚗', '🏠', '🎓', '🛒', '🔧', '🎨', '🖥️', '📱', '🪙', '💵'];

    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [icon, setIcon] = useState('📦');
    const [showIconGrid, setShowIconGrid] = useState(false);

    useEffect(() => {
        if (show) {
            setName('');
            setIcon('📦');
            setShowIconGrid(false);
        }
    }, [show]);

    if (!show) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const slug = name.trim().toLowerCase().replace(/\s+/g, '_');
        const budgetLimit = type === 'expense' ? Number(limit.replace(/[^0-9]/g, '')) : undefined;

        onAddCategory({
            slug,
            name: name.trim(),
            icon: icon || '📦',
            type,
            limit: isNaN(budgetLimit!) ? 0 : budgetLimit
        });

        setName('');
        setLimit('');
        setIcon('📦');
        onClose();
    };

    return (
        // 1:1 from CategoryModal.vue line 22-65
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}></div>

            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl dark:shadow-none z-10 p-6 animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800 transition-all duration-500 relative">
                
                {/* Header — 1:1 from CategoryModal.vue line 28-33 */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-500">
                        ✨ {t('add_source') || 'Tambah Sumber / Kategori'}
                    </h3>
                    <button onClick={onClose} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300">
                        <X size={18} />
                    </button>
                </div>

                {/* Form — 1:1 from CategoryModal.vue line 35-61 */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Type selector */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button 
                            type="button" 
                            onClick={() => setType('expense')} 
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${type === 'expense' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-400'}`}
                        >
                            🔴 {t('expense') || 'Pengeluaran'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setType('income')} 
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-400'}`}
                        >
                            🟢 {t('income') || 'Pemasukan'}
                        </button>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-wider mb-1.5 transition-colors duration-500">
                            {t('name') || 'Nama Kategori'}
                        </label>
                        <div className="flex gap-2">
                            <div className="relative">
                                <button 
                                    type="button" 
                                    onClick={() => setShowIconGrid(!showIconGrid)} 
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl text-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 duration-300"
                                >
                                    {icon}
                                </button>
                                
                                {showIconGrid && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowIconGrid(false)}></div>
                                        <div className="absolute top-14 left-0 w-64 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-700 z-50 grid grid-cols-6 gap-2 animate-in fade-in zoom-in-95 duration-100">
                                            {iconPalette.map((ic) => (
                                                <button 
                                                    key={ic} 
                                                    type="button" 
                                                    onClick={() => { setIcon(ic); setShowIconGrid(false); }} 
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-lg transition-all duration-300"
                                                >
                                                    {ic}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <input 
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('placeholder_name') || 'Nama kategori...'} 
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 dark:text-slate-200 transition-all duration-500 placeholder:dark:text-slate-600 text-sm"
                            />
                        </div>
                    </div>

                    {type === 'expense' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-wider mb-1.5 transition-colors duration-500">
                                {t('budget_limit') || 'Batas Budget'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">Rp</span>
                                <input 
                                    type="text"
                                    inputMode="numeric"
                                    value={limit}
                                    onChange={(e) => {
                                        let raw = e.target.value.replace(/[^0-9]/g, '');
                                        setLimit(raw ? new Intl.NumberFormat('id-ID').format(Number(raw)) : '');
                                    }}
                                    placeholder="0"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-rose-500 font-black text-lg text-slate-700 dark:text-white transition-all duration-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-400 dark:text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-all duration-300 text-xs">
                            {t('cancel') || 'Batal'}
                        </button>
                        <button type="submit" className="flex-[2] py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg dark:shadow-none shadow-emerald-200 dark:shadow-emerald-900/20 active:scale-95 transition-all duration-300 text-xs">
                            {t('save') || 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
