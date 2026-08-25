'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { X, Edit3, Trash2, Clock, ArrowRight } from 'lucide-react';
import { CalendarDayItem, CalendarEvent } from './CalendarGrid';

interface CalendarDayDetailProps {
    show: boolean;
    date: string; // YYYY-MM-DD
    calendarDays: CalendarDayItem[];
    onClose: () => void;
    onEditEvent?: (date: string, ev: CalendarEvent) => void;
    onDeleteEvent?: (id: number | string) => void;
}

export default function CalendarDayDetail({
    show, date, calendarDays, onClose, onEditEvent, onDeleteEvent
}: CalendarDayDetailProps) {
    const t = useTranslations();

    if (!show || !date) return null;

    const dayData = calendarDays.find(d => d.date === date);
    const dayNumberStr = date ? date.split('-')[2] : '01';

    const displayDateStr = (() => {
        try {
            return new Date(date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return date;
        }
    })();

    const events = dayData?.events || [];
    const milestones = dayData?.milestones || [];
    const habitCount = dayData?.habitDone || 0;
    const planner = dayData?.planner || null;
    const expense = dayData?.expense || 0;

    const plannerProgress = planner && planner.total > 0 ? Math.round((planner.done / planner.total) * 100) : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        // 1:1 from CalendarDayDetail.vue line 57-238
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/50 dark:ring-slate-800 transition-colors duration-500">
                
                {/* Header */}
                <div className="px-6 py-6 sm:px-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 relative overflow-hidden transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 dark:from-indigo-900/10 to-transparent"></div>
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center text-2xl shadow-xl shadow-indigo-200 dark:shadow-none font-black transition-all duration-500 transform hover:scale-105">
                            {dayNumberStr}
                        </div>
                        <div>
                            <p className="text-indigo-600 dark:text-indigo-400 text-[11px] font-bold tracking-widest mb-1 transition-colors duration-500">
                                {t('calendar_day_overview') || 'Command center'}
                            </p>
                            <h2 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none transition-colors duration-500 capitalize">
                                {displayDateStr}
                            </h2>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-90"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/50 transition-colors duration-500">
                    <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
                        
                        {/* Events Schedule Column */}
                        <div className="lg:col-span-3 space-y-10">
                            <div className="flex items-center justify-between border-b border-slate-100/80 dark:border-slate-800/80 pb-5 transition-colors duration-500">
                                <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-3 transition-colors duration-500">
                                    <span className="text-xl">📅</span> {t('calendar_events_schedule') || 'Events schedule'}
                                </h3>
                                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm transition-colors duration-500 tracking-widest">
                                    {events.length} {t('calendar_events_count') || 'events'}
                                </span>
                            </div>
                            
                            {events.length === 0 ? (
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none transition-colors duration-500">
                                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 text-5xl transition-colors duration-500">🍃</div>
                                    <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2 transition-colors duration-500">
                                        {t('calendar_no_events_title') || 'Empty day'}
                                    </h4>
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed transition-colors duration-500">
                                        {t('calendar_no_events_desc') || 'Use this time to rest or focus on your personal life OS.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="relative border-l-[3px] border-slate-100 dark:border-slate-800 ml-6 space-y-10 transition-colors duration-500">
                                    <div className="absolute -top-3 -left-[6.5px] w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-500"></div>

                                    {events.map((ev) => (
                                        <div key={ev.id} className="relative pl-10 group">
                                            <div className="absolute top-2 -left-[9px] w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-950 shadow-xl ring-4 ring-slate-100/50 dark:ring-slate-800/50 transition-all duration-500 group-hover:scale-125" style={{ backgroundColor: ev.color || '#6366f1' }}></div>
                                            
                                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none group-hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: ev.color || '#6366f1' }}></div>
                                                
                                                <div className="flex justify-between items-start gap-6">
                                                    <div className="flex-1">
                                                        <h4 className="font-black text-slate-800 dark:text-white text-lg sm:text-xl leading-tight transition-colors duration-500">
                                                            {ev.title}
                                                        </h4>
                                                        <div className="flex items-center gap-4 mt-3">
                                                            {ev.start_time ? (
                                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 transition-colors duration-500">
                                                                    <Clock className="w-4 h-4 stroke-[2.5]" />
                                                                    {ev.start_time} {ev.end_time && <span className="mx-1.5 opacity-50">• {ev.end_time}</span>}
                                                                </span>
                                                            ) : ev.is_all_day ? (
                                                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20 transition-colors duration-500 tracking-widest">
                                                                    All day
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                        {ev.description && (
                                                            <div className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 transition-colors duration-500">
                                                                {ev.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                                        <button 
                                                            type="button"
                                                            onClick={() => onEditEvent?.(date, ev)} 
                                                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-slate-700 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white rounded-2xl shadow-sm transition-all active:scale-95"
                                                        >
                                                            <Edit3 className="w-4.5 h-4.5" />
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => onDeleteEvent?.(ev.id)} 
                                                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-100 dark:border-slate-700 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white rounded-2xl shadow-sm transition-all active:scale-95"
                                                        >
                                                            <Trash2 className="w-4.5 h-4.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Life OS Summary Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="border-b border-slate-100/80 dark:border-slate-800/80 pb-5 mb-3 transition-colors duration-500">
                                <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-3 transition-colors duration-500">
                                    <span className="text-xl">⚡</span> {t('calendar_life_os_summary') || 'Life OS summary'}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                {/* Goals Card */}
                                <Link href="/goals" className="bg-orange-500 rounded-[3rem] p-6 text-white relative overflow-hidden group shadow-2xl shadow-orange-200 dark:shadow-none hover:-translate-y-2 transition-all duration-500 block">
                                    <div className="absolute -right-6 -top-6 text-9xl opacity-20 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">🎯</div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-center mb-4 md:mb-6">
                                            <span className="text-[10px] sm:text-[11px] font-black tracking-widest bg-white/20 px-3 py-1.5 rounded-xl border border-white/20">
                                                {t('calendar_goals') || 'Goals & milestones'}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-orange-500 transition-all duration-500">
                                                <ArrowRight className="w-4 h-4 stroke-[3]" />
                                            </div>
                                        </div>
                                        {milestones.length > 0 ? (
                                            <div className="space-y-3">
                                                {milestones.map((ms) => (
                                                    <div key={ms.id} className="bg-white/10 px-4 py-3 rounded-2xl flex items-center justify-between border border-white/10 group-hover:border-white/30 transition-all shadow-lg">
                                                        <div className="min-w-0 pr-4">
                                                            <p className="text-[10px] font-bold tracking-widest text-orange-100/80 mb-0.5 leading-none">{ms.goal_title}</p>
                                                            <p className="text-[13px] font-black text-white truncate leading-tight">{ms.title}</p>
                                                        </div>
                                                        {(ms.completed || ms.is_completed) ? (
                                                            <span className="text-[10px] font-black bg-emerald-500/80 text-white px-2 py-1 rounded-lg ml-2 shrink-0 shadow-sm">DONE</span>
                                                        ) : (
                                                            <span className="text-[10px] font-black bg-white/20 text-white px-2 py-1 rounded-lg ml-2 shrink-0">PENDING</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-4">
                                                <p className="text-sm font-bold text-orange-50 leading-relaxed">
                                                    {t('calendar_empty_goals') || 'No milestones due for this date.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Planner Card */}
                                <Link href={`/planner?date=${date}`} className="bg-blue-600 rounded-[3rem] p-6 text-white relative overflow-hidden group shadow-2xl shadow-blue-200 dark:shadow-none hover:-translate-y-2 transition-all duration-500 block">
                                    <div className="absolute -right-6 -top-6 text-9xl opacity-20 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">✅</div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-center mb-4 md:mb-6">
                                            <span className="text-[10px] sm:text-[11px] font-black tracking-widest bg-white/20 px-3 py-1.5 rounded-xl border border-white/20">
                                                {t('calendar_planner') || 'Daily planner'}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all duration-500">
                                                <ArrowRight className="w-4 h-4 stroke-[3]" />
                                            </div>
                                        </div>
                                        {planner && planner.total > 0 ? (
                                            <div>
                                                <div className="flex items-end gap-3 mb-4">
                                                    <span className="text-5xl font-black leading-none drop-shadow-md">{planner.done}</span>
                                                    <span className="text-blue-100 font-bold mb-1.5 text-base">/ {planner.total} tasks completed</span>
                                                </div>
                                                <div className="w-full bg-white/20 rounded-full h-4 mt-4 overflow-hidden border border-white/10">
                                                    <div className="bg-white h-4 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ width: `${plannerProgress}%` }}></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-4">
                                                <p className="text-sm font-bold text-blue-50 leading-relaxed">
                                                    {t('calendar_empty_planner') || 'No tasks recorded for this period.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                
                                {/* Habits & Finance Grid */}
                                <div className="grid grid-cols-2 gap-5">
                                    <Link href="/habits" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-slate-200/20 dark:shadow-none min-h-[160px] flex flex-col justify-between block">
                                        <div className="absolute -right-3 -bottom-3 text-6xl opacity-[0.05] group-hover:scale-125 transition-transform duration-700 pointer-events-none">🌱</div>
                                        <div>
                                            <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-emerald-500 mb-2 md:mb-3 block leading-none">
                                                {t('calendar_habits') || 'Habits'}
                                            </span>
                                            {habitCount > 0 ? (
                                                <div>
                                                    <span className="text-5xl font-black text-slate-800 dark:text-white block leading-none mb-2">{habitCount}</span>
                                                    <span className="text-[11px] font-bold text-slate-400 tracking-wide">{t('calendar_habits_done') || 'Items completed'}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-bold text-slate-300 dark:text-slate-600 block italic">No habits done</span>
                                            )}
                                        </div>
                                    </Link>

                                    <Link href="/finance" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-slate-200/20 dark:shadow-none min-h-[160px] flex flex-col justify-between block">
                                        <div className="absolute -right-3 -bottom-3 text-6xl opacity-[0.05] group-hover:scale-125 transition-transform duration-700 pointer-events-none">💸</div>
                                        <div>
                                            <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-rose-500 mb-2 md:mb-3 block leading-none">
                                                {t('calendar_finance') || 'Finance'}
                                            </span>
                                            {expense > 0 ? (
                                                <div>
                                                    <span className="text-2xl font-black text-slate-800 dark:text-white block leading-none mb-2 truncate">{formatCurrency(expense)}</span>
                                                    <span className="text-[11px] font-bold text-slate-400 tracking-wide">Expense</span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-bold text-slate-300 dark:text-slate-600 block italic">No expenses</span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
