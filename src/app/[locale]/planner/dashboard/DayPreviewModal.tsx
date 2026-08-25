'use client';

import React from 'react';
import { X, CheckCircle2, Droplets, Inbox, Calendar, ArrowRight, Flame, Coffee, Circle, UtensilsCrossed, StickyNote } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';

interface TaskItem {
    id: number;
    title: string;
    is_completed: boolean;
    type: number;
    start_time?: string;
    end_time?: string;
    notes?: string;
}

interface DayData {
    date: Date;
    dateStr: string;
    tasks: { completed: number; total: number; items: TaskItem[] };
    water: number;
    inbox: { items: any[] };
    meals: { breakfast: boolean; lunch: boolean; dinner: boolean } | null;
    notes: string;
}

interface Props {
    show: boolean;
    day: DayData | null;
    onClose: () => void;
}

export default function DayPreviewModal({ show, day, onClose }: Props) {
    const router = useRouter();

    const locale = useLocale();

    if (!show) return null;

    const openDailyPlanner = () => {
        if (day && day.dateStr) {
            router.push(`/planner?date=${day.dateStr}`); 
        }
    };

    const formatDayStr = (dateObj: Date | undefined) => {
        if (!dateObj) return '';
        return dateObj.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getPriorityIcon = (type: number) => {
        switch (Number(type)) {
            case 3: return <Flame size={14} className="text-rose-500 shrink-0" strokeWidth={3} />;
            case 2: return <Circle size={14} className="text-amber-500 shrink-0" strokeWidth={3} />;
            case 1: return <Coffee size={14} className="text-sky-500 shrink-0" strokeWidth={3} />;
            default: return <Circle size={14} className="text-slate-400 shrink-0" strokeWidth={3} />;
        }
    };

    const meals = day?.meals || { breakfast: false, lunch: false, dinner: false };

    return (
        <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            
            <div 
                className="absolute inset-0 bg-slate-900/80 dark:bg-slate-950/90 transition-all duration-300"
                onClick={onClose}
            ></div>

            <div 
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col h-auto max-h-[85vh] transform transition-all border border-slate-100 dark:border-slate-800 zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-between relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-md transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-md transform -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-inner">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white/80 tracking-wider">Preview Harian</h3>
                            <p className="text-xl font-black text-white drop-shadow-sm">{formatDayStr(day?.date)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="relative z-10 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30 dark:bg-slate-950/30">
                    
                    <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-indigo-500" />
                                Tugas Utama
                            </h4>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                {day?.tasks?.completed || 0}/{day?.tasks?.total || 0} Selesai
                            </span>
                        </div>

                        {day?.tasks?.items && day.tasks.items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {day.tasks.items.map((task) => (
                                    <div 
                                        key={task.id}
                                        className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${task.is_completed ? 'bg-slate-50 border-transparent dark:bg-slate-800/50 opacity-60' : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            <CheckCircle2 size={20} className={task.is_completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-base font-bold truncate transition-colors ${task.is_completed ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>{task.title}</p>
                                                {getPriorityIcon(task.type)}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                {task.start_time && (
                                                    <p className="text-[10px] font-black tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                        {task.start_time} {task.end_time ? `- ${task.end_time}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                            {task.notes && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 line-clamp-2">"{task.notes}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-sm text-slate-400 font-medium">Hari yang santai! Belum ada tugas.</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <Inbox size={16} className="text-orange-500" />
                                        Kotak Masuk
                                    </h4>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">
                                        {day?.inbox?.items?.length || 0} Item
                                    </span>
                                </div>
                                {day?.inbox?.items && day.inbox.items.length > 0 ? (
                                    <div className="space-y-2">
                                        {day.inbox.items.slice(0, 3).map((item, i) => (
                                            <div key={i} className="text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 truncate font-medium">
                                                {item.title || item}
                                            </div>
                                        ))}
                                        {day.inbox.items.length > 3 && (
                                            <p className="text-xs text-center text-slate-400 font-medium pt-1">+ {day.inbox.items.length - 3} item lainnya</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Tidak ada catatan liar.</p>
                                )}
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <UtensilsCrossed size={16} className="text-rose-500" />
                                        Makanan
                                    </h4>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${meals.breakfast ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                                        <div className={`w-3 h-3 rounded-full ${meals.breakfast ? 'bg-rose-400 shadow-[0_0_10px_rgba(2fb,113,133,0.5)]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-wider">Pagi</span>
                                    </div>
                                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${meals.lunch ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                                        <div className={`w-3 h-3 rounded-full ${meals.lunch ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-wider">Siang</span>
                                    </div>
                                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${meals.dinner ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400' : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                                        <div className={`w-3 h-3 rounded-full ${meals.dinner ? 'bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-wider">Malam</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-[140px] flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <Droplets size={16} className="text-cyan-500" />
                                        Hidrasi Air
                                    </h4>
                                </div>
                                <div className="flex-1 flex flex-col justify-end">
                                    <div className="flex justify-between items-end gap-1 px-2">
                                        {[1,2,3,4,5,6,7,8].map(i => {
                                            const isActive = i <= (day?.water || 0);
                                            return (
                                                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                                                    <div className={`w-full rounded-t-sm transition-all duration-300 ${isActive ? 'bg-cyan-400 dark:bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`} style={{ height: isActive ? '32px' : '12px' }}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <StickyNote size={16} className="text-purple-500" />
                                        Jurnal Singkat
                                    </h4>
                                </div>
                                <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 italic min-h-[60px]">
                                        {day?.notes ? `"${day.notes}"` : 'Tidak ada catatan harian di hari ini.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
                    <button 
                        onClick={openDailyPlanner}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                        Buka Daily Planner
                        <ArrowRight size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div></ModalPortal>
    );
}
