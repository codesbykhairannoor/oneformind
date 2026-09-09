'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, ArrowLeft, Plus, RotateCcw } from 'lucide-react';
import PlannerDatePicker from './PlannerDatePicker';

interface PlannerHeaderProps {
    selectedDate: string; // YYYY-MM-DD
    onDateChange: (val: string) => void;
    tasks: any[];
    stats: { percent: number; completed: number; pending: number };
    onOpenTaskModal: () => void;
    onResetBoard: () => void;
}

export default function PlannerHeader({
    selectedDate,
    onDateChange,
    tasks,
    stats,
    onOpenTaskModal,
    onResetBoard
}: PlannerHeaderProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const navigateDate = (offset: number) => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d + offset);
        const newY = dateObj.getFullYear();
        const newM = String(dateObj.getMonth() + 1).padStart(2, '0');
        const newD = String(dateObj.getDate()).padStart(2, '0');
        onDateChange(`${newY}-${newM}-${newD}`);
    };

    const formatDateLabel = (dateStr: string) => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        if (dateStr === todayStr) return t('label_today') || 'Hari ini';
        
        const [y, m, d] = dateStr.split('-').map(Number);
        const localDate = new Date(y, m - 1, d);
        
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const diffTime = localDate.getTime() - todayMidnight.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return t('label_tomorrow') || 'Besok';
        if (diffDays === -1) return t('label_yesterday') || 'Kemarin';
        
        return localDate.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    return (
        <div className="relative z-[60] transition-all bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4">
                    
                    {/* Top Row on Mobile: Nav & Date + Quick Actions */}
                    <div className="flex items-center justify-between gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Link href="/planner/dashboard" className="shrink-0 flex items-center gap-1 text-xs font-black capitalize tracking-wide text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors pr-2 sm:pr-3 border-r border-slate-200 dark:border-slate-700">
                                <ArrowLeft size={13} strokeWidth={2.5} />
                                <span className="hidden xs:inline">Dashboard</span>
                            </Link>
                            
                            <div className="flex items-center gap-0.5 sm:gap-1">
                                <button onClick={() => navigateDate(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors">
                                    <ChevronLeft size={15} />
                                </button>
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} 
                                        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-colors font-bold text-xs ${isDatePickerOpen ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-300'}`}
                                    >
                                        <Calendar size={13} className="text-indigo-500" />
                                        <span>{formatDateLabel(selectedDate)}</span>
                                        <ChevronDown size={10} strokeWidth={3} className={`text-slate-400 dark:text-slate-500 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isDatePickerOpen && (
                                        <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-3 z-[100] origin-top">
                                            <PlannerDatePicker 
                                                selectedDate={selectedDate}
                                                onDateChange={onDateChange}
                                                tasks={tasks}
                                                onClose={() => setIsDatePickerOpen(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <button onClick={() => navigateDate(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors">
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Actions: Add + Reset */}
                        <div className="flex md:hidden items-center gap-1.5 shrink-0">
                            <button onClick={onOpenTaskModal} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-1 text-xs active:scale-95">
                                <Plus size={14} strokeWidth={3} /> <span>{t('btn_add_timeline') || 'Tambah'}</span>
                            </button>
                            <button onClick={onResetBoard} title="Kosongkan jadwal hari ini" className="w-8 h-8 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl font-black hover:bg-rose-100 dark:hover:bg-rose-500/20 transition border border-rose-100 dark:border-rose-500/20 active:scale-95">
                                <RotateCcw size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar Row */}
                    <div className="flex-1 w-full min-w-0 md:px-6 lg:px-10 max-w-3xl">
                        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 mb-1">
                            <span className="flex items-center gap-1">
                                <span>{t('header_progress') || 'Progress'}</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold">({stats.percent}%)</span>
                            </span>
                            <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>{stats.completed} {t('header_completed') || 'Selesai'}</span>
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{stats.pending} {t('header_pending') || 'Tertunda'}</span>
                            </div>
                        </div>
                        <div className="h-1.5 sm:h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out" style={{ width: `${stats.percent}%` }} />
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex gap-2.5 items-center shrink-0">
                        <button onClick={onOpenTaskModal} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 text-xs active:scale-95">
                            <Plus size={16} strokeWidth={3} /> {t('btn_add_timeline') || 'Tambah'}
                        </button>
                        <button onClick={onResetBoard} title="Kosongkan jadwal hari ini" className="w-10 h-10 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-2xl font-black hover:bg-rose-100 dark:hover:bg-rose-500/20 transition border border-rose-100 dark:border-rose-500/20 active:scale-95 shadow-sm dark:shadow-none">
                            <RotateCcw size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
