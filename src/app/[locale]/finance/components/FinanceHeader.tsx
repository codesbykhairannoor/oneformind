'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
    Download, 
    Plus, 
    FileText,
    PieChart
} from 'lucide-react';
import FinanceMonthPicker from './FinanceMonthPicker';
import ExportModal from '@/components/export/ExportModal';
import ModuleHeader from '@/components/layout/ModuleHeader';

export interface CurrencyOption {
    code: string;
    locale: string;
    label: string;
    icon: string;
    symbol: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
    { code: 'IDR', locale: 'id-ID', label: 'Rupiah (Rp)', icon: '🇮🇩', symbol: 'Rp' },
    { code: 'USD', locale: 'en-US', label: 'Dollar ($)', icon: '🇺🇸', symbol: '$' },
    { code: 'GBP', locale: 'en-GB', label: 'Pound (£)', icon: '🇬🇧', symbol: '£' },
    { code: 'EUR', locale: 'de-DE', label: 'Euro (€)', icon: '🇪🇺', symbol: '€' },
    { code: 'JPY', locale: 'ja-JP', label: 'Yen (¥)', icon: '🇯🇵', symbol: '¥' },
];

interface FinanceHeaderProps {
    selectedMonthKey: string;
    onMonthChange: (val: number | string) => void;
    onOpenTrxModal: () => void;
    onOpenBudgetModal?: () => void;
    activeCurrency: string;
    onCurrencyChange: (code: string) => void;
    transactions?: any[];
}

export default function FinanceHeader({
    selectedMonthKey,
    onMonthChange,
    onOpenTrxModal,
    activeCurrency,
    onCurrencyChange,
    transactions = []
}: FinanceHeaderProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';
    
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    const activeCurrencyObj = SUPPORTED_CURRENCIES.find(c => c.code === activeCurrency) || SUPPORTED_CURRENCIES[0];

    const exportTaxReport = () => {
        if (!transactions.length) return alert('No transactions to export.');
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        
        let html = `
            <html>
            <head>
                <title>Laporan Pajak - ${selectedMonthKey}</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #333; }
                    h1 { font-size: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .income { color: green; }
                    .expense { color: red; }
                    .summary { margin-top: 20px; border-top: 2px solid #333; padding-top: 10px; }
                </style>
            </head>
            <body>
                <h1>Laporan Keuangan Bulanan - ${selectedMonthKey}</h1>
                <p>Mata Uang: ${activeCurrency}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Judul</th>
                            <th>Kategori</th>
                            <th>Tipe</th>
                            <th>Nominal</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        let totalIncome = 0;
        let totalExpense = 0;
        
        const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        sorted.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('en-CA');
            const amt = Number(t.amount);
            if (t.type === 'income') totalIncome += amt;
            else totalExpense += amt;
            
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${t.title}</td>
                    <td>${t.category}</td>
                    <td class="${t.type}">${t.type.toUpperCase()}</td>
                    <td>${amt.toLocaleString()}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
                <div class="summary">
                    <h3>Ringkasan Bulan Ini</h3>
                    <p>Total Pemasukan (Bruto): <b>${totalIncome.toLocaleString()}</b></p>
                    <p>Total Pengeluaran: <b>${totalExpense.toLocaleString()}</b></p>
                    <p>Surplus / Defisit: <b>${(totalIncome - totalExpense).toLocaleString()}</b></p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
        
        printWindow.document.write(html);
        printWindow.document.close();
        setIsExportOpen(false);
    };

    return (
        <ModuleHeader
            icon={<PieChart size={18} strokeWidth={2.5} />}
            iconHref="/finance/dashboard"
            iconTitle={isIndo ? 'Overview Finansial Tahunan' : 'Annual Financial Overview'}
            title={t('finance_plan') || (isIndo ? 'Perencanaan Finansial' : 'Finance & Budgeting')}
            subtitle={isIndo ? 'Arus kas, anggaran bulanan & analitik kekayaan' : 'Cashflow, monthly budgeting & net worth tracking'}
            centerContent={
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Custom Month Picker */}
                    <FinanceMonthPicker 
                        selectedMonthKey={selectedMonthKey} 
                        onMonthChange={onMonthChange} 
                    />

                    {/* Currency Selector Dropdown */}
                    <div className="relative shrink-0">
                        <button 
                            type="button"
                            onClick={() => { setIsCurrencyOpen(!isCurrencyOpen); setIsExportOpen(false); }}
                            className="flex items-center justify-center h-10 px-3 transition border bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 rounded-xl gap-1.5 hover:bg-white dark:hover:bg-slate-700 shadow-xs group"
                        >
                            <span className="text-base">{activeCurrencyObj.icon}</span>
                            <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">{activeCurrencyObj.code}</span>
                        </button>

                        {isCurrencyOpen && (
                            <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-1.5 z-[100] origin-top transition-colors">
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsCurrencyOpen(false)}></div>
                                <div className="relative z-10 space-y-0.5">
                                    {SUPPORTED_CURRENCIES.map(c => (
                                        <button 
                                            key={c.code}
                                            type="button"
                                            onClick={() => {
                                                onCurrencyChange(c.code);
                                                setIsCurrencyOpen(false);
                                            }} 
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${activeCurrency === c.code ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                                        >
                                            <span className="text-lg">{c.icon}</span>
                                            <span className="font-bold">{c.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
            actions={
                <div className="flex items-center gap-2">
                    {/* Export Actions */}
                    <div className="relative shrink-0">
                        <button 
                            type="button"
                            onClick={() => { setIsExportOpen(!isExportOpen); setIsCurrencyOpen(false); }}
                            className={`flex items-center justify-center h-10 px-3.5 transition border rounded-xl gap-1.5 shadow-xs text-xs font-bold ${isExportOpen ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <Download size={14} className="text-slate-500 dark:text-slate-400" />
                            <span>{t('export') || (isIndo ? 'Ekspor' : 'Export')}</span>
                        </button>

                        {isExportOpen && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-1.5 z-[100] origin-top-right">
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsExportOpen(false)}></div>
                                <div className="relative z-10 space-y-0.5">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsExportOpen(false); setIsExportModalOpen(true); }} 
                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all group/item text-left"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <FileText size={14} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{isIndo ? 'Ekspor CSV / JSON' : 'Export CSV / JSON'}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{isIndo ? 'Tahunan / Bulanan' : 'Yearly / Monthly'}</p>
                                        </div>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={exportTaxReport} 
                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all group/item text-left"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            <FileText size={14} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{isIndo ? 'Laporan Pajak' : 'Tax / Fiscal Report'}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Format Fiscal PDF</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        <ExportModal
                            isOpen={isExportModalOpen}
                            onClose={() => setIsExportModalOpen(false)}
                            moduleType="finance"
                            defaultYear={Number(selectedMonthKey.split('-')[0]) || new Date().getFullYear()}
                            defaultMonth={Number(selectedMonthKey.split('-')[1]) || (new Date().getMonth() + 1)}
                            currentData={transactions}
                        />
                    </div>

                    {/* Primary Action Button */}
                    <button 
                        type="button"
                        onClick={onOpenTrxModal}
                        className="flex items-center justify-center h-10 px-4 sm:px-5 transition shadow-md bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-indigo-500/20 text-white font-black text-xs gap-1.5 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>{t('btn_transaction') || (isIndo ? 'Tambah Transaksi' : 'Add Transaction')}</span>
                    </button>
                </div>
            }
        />
    );
}
