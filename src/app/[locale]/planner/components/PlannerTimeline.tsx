'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, CheckCircle2, Circle } from 'lucide-react';

const VIEW_LIMIT = 24;
const HOUR_HEIGHT = 80;
const TIME_COL_WIDTH = 80;

interface PlannerTimelineProps {
    tasks: any[];
    selectedDate: string;
    now: Date;
    startHour: number;
    setStartHour: (val: number) => void;
    editTask: (task: any) => void;
    toggleTask: (id: number) => void;
    onOpenTaskModal: (defaultTime?: string) => void;
    onMoveTask: (taskId: number, newStartTime: string) => void;
}

export default function PlannerTimeline({
    tasks, selectedDate, now, startHour, setStartHour, editTask, toggleTask, onOpenTaskModal, onMoveTask
}: PlannerTimelineProps) {
    const t = useTranslations();
    const [isStartHourOpen, setIsStartHourOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const currentH = now.getHours();
            let diff = currentH - startHour;
            if (diff < 0) diff += 24;
            const scrollTarget = Math.max(0, (diff - 1) * HOUR_HEIGHT);
            scrollContainerRef.current.scrollTop = scrollTarget;
        }
    }, [startHour]);

    const handleDragStart = (e: React.DragEvent, taskId: number) => {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', taskId.toString());
    };

    const handleDrop = (e: React.DragEvent, newStartTime: string) => {
        e.preventDefault();
        const taskIdStr = e.dataTransfer.getData('text/plain');
        if (!taskIdStr) return;
        const taskId = parseInt(taskIdStr);
        onMoveTask(taskId, newStartTime);
    };

    const normalizeDate = (d: any) => {
        if (!d) return '';
        return String(d).split('T')[0];
    };

    const parseTimeMinutes = (timeStr: any): number => {
        if (!timeStr) return 0;
        const clean = String(timeStr).trim();
        let timePart = clean;
        if (clean.includes('T')) {
            timePart = clean.split('T')[1];
        }
        const parts = timePart.split(':');
        const h = parseInt(parts[0] || '0', 10);
        const m = parseInt(parts[1] || '0', 10);
        return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    };

    const formatDisplayTime = (timeStr: any): string => {
        if (!timeStr) return '';
        const clean = String(timeStr).trim();
        let timePart = clean;
        if (clean.includes('T')) {
            timePart = clean.split('T')[1];
        }
        const parts = timePart.split(':');
        const h = String(parseInt(parts[0] || '0', 10)).padStart(2, '0');
        const m = String(parseInt(parts[1] || '0', 10)).padStart(2, '0');
        return `${h}:${m}`;
    };

    // Helpers
    const getTaskTheme = (type: number) => {
        switch (type) {
            case 1:
                return {
                    icon: '🔥',
                    label: 'Urgent',
                    card: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 hover:border-rose-300 dark:hover:border-rose-500/40',
                    text: 'text-rose-900 dark:text-rose-100',
                    subtext: 'text-rose-500 dark:text-rose-400',
                    badge: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20',
                    check: 'text-rose-300 dark:text-rose-700 border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40'
                };
            case 2:
                return {
                    icon: '💼',
                    label: 'Work',
                    card: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-500/40',
                    text: 'text-indigo-900 dark:text-indigo-100',
                    subtext: 'text-indigo-500 dark:text-indigo-400',
                    badge: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20',
                    check: 'text-indigo-300 dark:text-indigo-700 border-indigo-300 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                };
            case 3:
                return {
                    icon: '🌱',
                    label: 'Normal',
                    card: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40',
                    text: 'text-emerald-900 dark:text-emerald-100',
                    subtext: 'text-emerald-500 dark:text-emerald-400',
                    badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
                    check: 'text-emerald-300 dark:text-emerald-700 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                };
            default:
                return {
                    icon: '📝',
                    label: 'Task',
                    card: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm',
                    text: 'text-slate-800 dark:text-white',
                    subtext: 'text-slate-500 dark:text-slate-400',
                    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                    check: 'text-slate-300 dark:text-slate-700 border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                };
        }
    };

    const getDurationMinutes = (task: any) => {
        const rawStart = task.start_time || task.startTime;
        const rawEnd = task.end_time || task.endTime;
        if (!rawStart) return 30;
        
        const startM = parseTimeMinutes(rawStart);
        let endM = rawEnd ? parseTimeMinutes(rawEnd) : startM + 30;
        let duration = endM - startM;
        if (duration < 0) duration += 1440;
        if (duration === 0) duration = 30;
        return duration;
    };

    const getTaskStyle = (task: any) => {
        const rawStart = task.start_time || task.startTime;
        const rawEnd = task.end_time || task.endTime;
        if (!rawStart) return { display: 'none' };
        
        const taskStartMinutes = parseTimeMinutes(rawStart);
        let duration = getDurationMinutes(task);

        const viewStartMinutes = startHour * 60;

        let relStart = taskStartMinutes - viewStartMinutes;
        if (relStart < 0) relStart += 1440;

        if (relStart >= VIEW_LIMIT * 60) return { display: 'none' };

        const renderStart = Math.max(0, relStart);
        const renderEnd = Math.min(VIEW_LIMIT * 60, relStart + duration);
        const renderDuration = renderEnd - renderStart;

        if (renderDuration <= 0) return { display: 'none' };

        const topPx = (renderStart / 60) * HOUR_HEIGHT;
        const heightPx = (renderDuration / 60) * HOUR_HEIGHT;
        const finalHeight = Math.max(heightPx - 8, 28);

        return {
            top: `${topPx}px`,
            height: `${finalHeight}px`,
            left: `${TIME_COL_WIDTH + 8}px`,  
            right: '8px', 
            zIndex: duration < 30 ? 20 : 10
        };
    };

    const getCurrentTimeIndicatorStyle = () => {
        const todayStr = (() => {
            const today = new Date();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            return `${today.getFullYear()}-${m}-${d}`;
        })();
        
        if (normalizeDate(selectedDate) !== todayStr) return { display: 'none' };

        const currentH = now.getHours();
        const currentM = now.getMinutes();
        let diff = currentH - startHour;
        if (diff < 0) diff += 24; 
        if (diff >= VIEW_LIMIT) return { display: 'none' };
        const minutesFromStart = (diff * 60) + currentM;
        return { top: `${(minutesFromStart / 60) * HOUR_HEIGHT}px`, left: `0px`, right: '0px' };
    };

    const timeSlots = Array.from({ length: VIEW_LIMIT }, (_, i) => {
        const h = (startHour + i) % 24;
        return `${String(h).padStart(2, '0')}:00`;
    });

    const activeTasks = tasks.filter(t => normalizeDate(t.date) === normalizeDate(selectedDate));

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden select-none flex flex-col h-full transition-colors duration-500">
            {/* Timeline Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm dark:shadow-none flex min-w-0 justify-between items-center gap-3 shrink-0 transition-colors duration-500">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-base sm:text-lg shadow-indigo-200 dark:shadow-none shadow-lg">📅</div>
                        <h3 className="min-w-0 truncate font-black text-slate-800 dark:text-white text-sm sm:text-base leading-none transition-colors duration-500">{t('timeline_title') || 'Timeline Hari Ini'}</h3>
                    </div>
                    
                    <div className="relative shrink-0">
                        <button onClick={() => setIsStartHourOpen(!isStartHourOpen)} className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 px-2 uppercase tracking-tighter transition-colors duration-500">{t('label_start') || 'Mulai'}</span>
                            <div className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors duration-500">
                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">{String(startHour).padStart(2, '0')}:00</span>
                                <ChevronDown size={12} strokeWidth={3} className={`text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 transition-transform ${isStartHourOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        
                        {isStartHourOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-4 z-[60] animate-in fade-in zoom-in-95 duration-200 transition-colors duration-500">
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-500">{t('select_hour') || 'Pilih Jam'}</span>
                                    <button onClick={() => setIsStartHourOpen(false)} className="text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {Array.from({length: 24}).map((_, h) => (
                                        <button 
                                            key={h}
                                            onClick={() => { setStartHour(h); setIsStartHourOpen(false); }}
                                            className={`py-2.5 flex items-center justify-center rounded-xl text-[10px] font-black font-mono transition-all border-2 ${startHour === h ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-500/20'}`}
                                        >
                                            {String(h).padStart(2, '0')}:00
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {isStartHourOpen && <div className="fixed inset-0 z-50" onClick={() => setIsStartHourOpen(false)}></div>}
                    </div>
                </div>

                {/* Timeline Body */}
                <div ref={scrollContainerRef} className="flex-1 relative w-full bg-white dark:bg-slate-900 overflow-y-auto overflow-x-hidden transition-colors duration-500 custom-scrollbar">
                    <div className="relative w-full" style={{ height: `${VIEW_LIMIT * HOUR_HEIGHT}px` }}>
                        
                        {/* Grid Lines & Time Slots */}
                        {timeSlots.map((time, i) => (
                            <div key={time} className="absolute w-full flex border-b border-slate-100 dark:border-slate-800" style={{ top: `${i * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}>
                                <div className="w-[80px] shrink-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex justify-center pt-3 transition-colors duration-500">
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono transition-colors duration-500">{time}</span>
                                </div>
                                <div 
                                    onClick={() => onOpenTaskModal(time)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, time)}
                                    className="flex-1 relative group/slot cursor-pointer hover:bg-indigo-50/10 dark:hover:bg-indigo-500/5 transition-all"
                                >
                                    <div className="absolute inset-x-2 top-0.5 bottom-0.5 rounded border border-transparent group-hover/slot:border-indigo-100 dark:group-hover/slot:border-indigo-500/30 flex items-center justify-center transition-all">
                                        <span className="opacity-0 group-hover/slot:opacity-100 text-indigo-400 dark:text-indigo-500 text-[10px] font-bold tracking-widest">{t('btn_add_timeline') || '+ Tambah Tugas'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Current Time Indicator */}
                        <div className="absolute z-30 flex items-center pointer-events-none w-full" style={getCurrentTimeIndicatorStyle()}>
                            <div className="w-[80px] flex justify-end pr-2">
                                <span className="text-[9px] font-black text-white bg-rose-500 px-1.5 rounded-sm shadow-sm dark:shadow-none">{t('timeline_now') || 'Sekarang'}</span>
                            </div>
                            <div className="flex-1 h-[2px] bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] dark:shadow-none"></div>
                        </div>

                        {/* Tasks */}
                        {activeTasks.map((task) => {
                            const theme = getTaskTheme(task.type);
                            const style = getTaskStyle(task);
                            const duration = getDurationMinutes(task);
                            const viewMode = duration < 45 ? 'MICRO' : 'NORMAL';

                            return (
                                <div 
                                    key={task.id}
                                    onClick={() => editTask(task)}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    className={`group absolute rounded-lg border px-0 py-0 shadow-sm dark:shadow-none cursor-pointer overflow-hidden transition-all hover:shadow-md dark:hover:shadow-none hover:scale-[1.005] ${theme.card} ${task.completed ? 'opacity-60 grayscale filter' : ''} select-none`}
                                    style={style}
                                >
                                    <div className="w-full h-full relative" title={task.notes ? `📝 ${task.notes}` : ''}>
                                        
                                        {viewMode === 'MICRO' ? (
                                            <div className="flex items-center justify-between h-full px-2 gap-2">
                                                <div className="flex items-center gap-1.5 overflow-hidden flex-1 min-w-0">
                                                    <span className="text-xs shrink-0 opacity-80">{theme.icon}</span>
                                                    <span className={`font-bold text-xs truncate leading-none ${theme.text} ${task.completed ? 'line-through' : ''}`}>
                                                        {task.title}
                                                    </span>
                                                    <span className={`text-[10px] font-mono opacity-60 whitespace-nowrap shrink-0 ${theme.subtext}`}>
                                                        ({formatDisplayTime(task.start_time || task.startTime)} - {formatDisplayTime(task.end_time || task.endTime) || '??'})
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors bg-white dark:bg-slate-800 hover:scale-110 ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : theme.check}`}
                                                >
                                                    {task.completed && <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full px-3 py-2 gap-1">
                                                <div className="flex justify-between items-center shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-1 shadow-sm dark:shadow-none opacity-90 ${theme.badge}`}>
                                                            {theme.icon} {theme.label}
                                                        </span>
                                                        <span className={`text-[10px] font-mono font-bold opacity-60 ${theme.text}`}>
                                                            {formatDisplayTime(task.start_time || task.startTime)} - {formatDisplayTime(task.end_time || task.endTime) || '??'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                                        className={`w-5 h-5 rounded border bg-white dark:bg-slate-800 flex items-center justify-center hover:scale-110 transition-transform shrink-0 shadow-sm dark:shadow-none ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : theme.check}`}
                                                    >
                                                        {task.completed && <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 min-h-0">
                                                    <h4 className={`font-black text-sm leading-tight truncate shrink-0 max-w-[50%] ${theme.text} ${task.completed ? 'line-through opacity-50' : ''}`}>
                                                        {task.title}
                                                    </h4>
                                                </div>
                                                {task.notes && (
                                                    <div className="min-h-0 flex-1 overflow-hidden mt-0.5">
                                                        <p className={`text-[10px] leading-relaxed italic opacity-70 ${theme.text}`}>
                                                            "{task.notes}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
    );
}
