'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Plus, RotateCcw, Download, CheckSquare } from 'lucide-react';
import PlannerDatePicker from './PlannerDatePicker';
import ModuleHeader from '@/components/layout/ModuleHeader';

interface PlannerHeaderProps {
    selectedDate: string; // YYYY-MM-DD
    onDateChange: (val: string) => void;
    tasks: any[];
    stats: { percent: number; completed: number; pending: number };
    onOpenTaskModal: () => void;
    onResetBoard: () => void;
    onOpenExportModal?: () => void;
}

export default function PlannerHeader({
    selectedDate,
    onDateChange,
    tasks,
    stats,
    onOpenTaskModal,
    onResetBoard,
    onOpenExportModal
}: PlannerHeaderProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';
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
        
        if (dateStr === todayStr) return isIndo ? 'Hari ini' : 'Today';
        
        const [y, m, d] = dateStr.split('-').map(Number);
        const localDate = new Date(y, m - 1, d);
        
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const diffTime = localDate.getTime() - todayMidnight.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return isIndo ? 'Besok' : 'Tomorrow';
        if (diffDays === -1) return isIndo ? 'Kemarin' : 'Yesterday';
        
        return localDate.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    return (
        <ModuleHeader
            icon={<CheckSquare size={18} strokeWidth={2.5} />}
            title={isIndo ? 'Daily Planner & Tugas' : 'Daily Planner & Tasks'}
            subtitle={isIndo ? 'Manajemen jadwal harian, fokus & eksekusi tugas' : 'Daily execution, focus scheduling & task breakdown'}
            centerContent={
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full md:w-auto">
                    {/* Date Navigation */}
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-0.5">
                        <button 
                            type="button"
                            onClick={() => navigateDate(-1)} 
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition"
                            title={isIndo ? 'Hari sebelumnya' : 'Previous day'}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        
                        <div className="relative">
                            <button 
                                type="button"
                                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} 
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
                            >
                                <Calendar size={13} className="text-indigo-500" />
                                <span>{formatDateLabel(selectedDate)}</span>
                                <ChevronDown size={10} strokeWidth={3} className={`text-slate-400 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isDatePickerOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 z-[100] origin-top">
                                    <PlannerDatePicker 
                                        selectedDate={selectedDate}
                                        onDateChange={onDateChange}
                                        tasks={tasks}
                                        onClose={() => setIsDatePickerOpen(false)}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <button 
                            type="button"
                            onClick={() => navigateDate(1)} 
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition"
                            title={isIndo ? 'Hari berikutnya' : 'Next day'}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full sm:w-48 lg:w-56 min-w-0">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                            <span className="flex items-center gap-1">
                                <span>{isIndo ? 'Progres' : 'Progress'}</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-black">({stats.percent}%)</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {stats.completed}
                                </span>
                                <span className="flex items-center gap-0.5 text-amber-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    {stats.pending}
                                </span>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-700/60">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out" 
                                style={{ width: `${stats.percent}%` }} 
                            />
                        </div>
                    </div>
                </div>
            }
            actions={
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {onOpenExportModal && (
                        <button 
                            type="button"
                            onClick={onOpenExportModal} 
                            title={isIndo ? 'Ekspor Data Planner (CSV/JSON)' : 'Export Planner Data (CSV/JSON)'} 
                            className="h-10 px-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs active:scale-95 shadow-xs"
                        >
                            <Download size={14} className="text-slate-500 dark:text-slate-400" />
                            <span>{isIndo ? 'Ekspor' : 'Export'}</span>
                        </button>
                    )}

                    <button 
                        type="button"
                        onClick={onResetBoard} 
                        title={isIndo ? "Kosongkan jadwal hari ini" : "Clear today's schedule"} 
                        className="h-10 w-10 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition border border-rose-100 dark:border-rose-500/20 active:scale-95 shadow-xs"
                    >
                        <RotateCcw size={15} strokeWidth={2.5} />
                    </button>

                    <button 
                        type="button"
                        onClick={onOpenTaskModal} 
                        className="h-10 px-4 sm:px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 text-xs active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>{isIndo ? 'Tambah Tugas' : 'Add Task'}</span>
                    </button>
                </div>
            }
        />
    );
}
