'use client';

import { useTranslations } from 'next-intl';
import { X, CheckCircle2, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface BatchTask {
    title: string;
    start_time: string;
    end_time: string;
    type: number;
}

interface PlannerBatchModalProps {
    show: boolean;
    onClose: () => void;
    onSwitchToSingle: () => void;
    tasks: BatchTask[];
    setTasks: (tasks: BatchTask[]) => void;
    onSubmit: () => void;
    isExplorer?: boolean; // Mock for gating
}

export default function PlannerBatchModal({
    show,
    onClose,
    onSwitchToSingle,
    tasks,
    setTasks,
    onSubmit,
    isExplorer = true
}: PlannerBatchModalProps) {
    const t = useTranslations();

    if (!show) return null;

    const addRow = () => {
        setTasks([...tasks, { title: '', start_time: '09:00', end_time: '10:00', type: 2 }]);
    };

    const removeRow = (index: number) => {
        if (tasks.length > 1) {
            setTasks(tasks.filter((_, i) => i !== index));
        }
    };

    const updateTask = (index: number, field: keyof BatchTask, value: string | number) => {
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setTasks(newTasks);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] flex flex-col max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800">
                
                {/* LOCKED STATE */}
                {isExplorer ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 min-h-[500px]">
                        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-50 font-bold">✕</button>
                        
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>

                        <div className="relative z-10 max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="relative w-20 h-20 mx-auto">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                                <div className="relative w-20 h-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center">
                                    <Zap size={32} className="text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                                </div>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 shadow-sm">
                                    <Sparkles size={10} className="text-indigo-500" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
                                        {t('gating.lock_title_required')}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter leading-tight">
                                    {t('gating.planner_batch.title')}
                                </h3>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {t('gating.planner_batch.description')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={12} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 tracking-tight">
                                            {t(`gating.planner_batch.benefit_${i}` as any)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 space-y-3">
                                <Link href="/pricing" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 group">
                                    {t('gating.btn_upgrade')}
                                    <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button onClick={onClose} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-full h-10">
                                     {t('gating.btn_stay')}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="px-6 md:px-8 py-5 md:py-7 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 z-20 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl text-white shadow-xl shadow-indigo-500/20">
                                    ✨
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-1.5 transition-colors">
                                        {t('batch_mode_title') || 'Batch Entry Mode'}
                                    </h2>
                                    <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] transition-colors">
                                        {t('modal_new_simple_title') || 'Collective scheduling'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 md:gap-3">
                                <button onClick={onSwitchToSingle} 
                                    type="button"
                                    className="hidden sm:flex h-10 text-[9px] font-black uppercase tracking-widest px-5 rounded-xl border-2 border-slate-50 dark:border-slate-800 text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 items-center gap-2">
                                    <span>↩️</span> {t('btn_single_mode') || 'Single'}
                                </button>
                                <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-90 flex items-center justify-center font-bold">
                                    <X size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950/30 p-4 md:p-8 transition-colors relative">
                            <div className="space-y-6">
                                {tasks.map((task, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-900 p-6 md:p-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none relative group animate-in fade-in duration-200">
                                        
                                        {/* Card Header */}
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                                                {t('task_label') || 'TASK'} #{index + 1}
                                            </span>
                                            <button onClick={() => removeRow(index)} type="button" 
                                                disabled={tasks.length <= 1}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${tasks.length <= 1 ? 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 opacity-50 cursor-not-allowed' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400'}`}>
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Row 1: Activity Title (Full Width) */}
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1.5 ml-1 block">{t('col_activity') || 'ACTIVITY'}</label>
                                                <input 
                                                    value={task.title}
                                                    onChange={(e) => updateTask(index, 'title', e.target.value)}
                                                    placeholder={t('placeholder_activity') || 'What needs to be done?'}
                                                    className="w-full text-sm font-bold h-14 px-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all dark:text-white shadow-sm" 
                                                />
                                            </div>

                                            {/* Row 2: Times and Priority (Split) */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1.5 ml-1 block">{t('time_range') || 'TIME RANGE'}</label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="time" 
                                                            value={task.start_time}
                                                            onChange={(e) => updateTask(index, 'start_time', e.target.value)}
                                                            className="flex-1 h-14 border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-2xl text-xs text-center font-black text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-0 transition-all shadow-sm" />
                                                        <span className="text-slate-300 dark:text-slate-700 font-bold">-</span>
                                                        <input type="time" 
                                                            value={task.end_time}
                                                            onChange={(e) => updateTask(index, 'end_time', e.target.value)}
                                                            className="flex-1 h-14 border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-2xl text-xs text-center font-black text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-0 transition-all shadow-sm" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1.5 ml-1 block">{t('col_priority') || 'PRIORITY'}</label>
                                                    <div className="relative">
                                                        <select 
                                                            value={task.type}
                                                            onChange={(e) => updateTask(index, 'type', parseInt(e.target.value))}
                                                            className={`w-full h-14 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] pl-5 pr-10 font-black focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-0 appearance-none cursor-pointer transition-all shadow-sm
                                                                ${task.type === 1 ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10' : 
                                                                task.type === 2 ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' : 
                                                                'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                                            <option value={1}>{t('priority_urgent') || 'Urgent'}</option>
                                                            <option value={2}>{t('priority_work') || 'Work'}</option>
                                                            <option value={3}>{t('priority_normal') || 'Normal'}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button onClick={addRow} type="button" className="mt-8 w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-slate-400 dark:text-slate-600 font-bold text-[10px] hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-sm">
                                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">+</span> 
                                    {t('btn_add_another') || 'Add another task'}
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 transition-colors">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-600 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                {t('total_label') || 'Total'} <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black">{tasks.length}</span> {t('total_suffix') || 'tasks'}
                            </div>
                            
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button onClick={onClose} className="flex-1 py-3.5 px-6 rounded-xl text-[10px] font-bold border-2 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    {t('btn_cancel') || 'Cancel'}
                                </button>
                                
                                <button onClick={onSubmit} 
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 rounded-xl py-3.5 px-8 shadow-xl shadow-indigo-100 dark:shadow-none transition-all transform active:scale-95 font-bold text-white text-[10px]">
                                    {t('btn_save_all') || 'Save All'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
