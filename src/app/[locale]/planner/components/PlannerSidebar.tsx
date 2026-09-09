'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle, Clock, Flame, Briefcase, Sparkles, Check, GripVertical, Play, Pause, RotateCcw, X } from 'lucide-react';
import { InboxTask } from '../types';

interface PlannerSidebarProps {
    notes: string;
    setNotes: (val: string) => void;
    meals: { breakfast: string, lunch: string, dinner: string };
    setMeals: (val: { breakfast: string, lunch: string, dinner: string }) => void;
    waterGlasses: number;
    setWaterGlasses: (val: number) => void;
    taskInbox: InboxTask[];
    setTaskInbox: (val: InboxTask[]) => void;
    saveStatus?: 'idle' | 'saving' | 'saved';
    durationMinutes?: number;
    pomodoroTime: number;
    isTimerRunning: boolean;
    focusedTaskTitle?: string | null;
    setTimerPreset?: (mins: number) => void;
    toggleTimer: () => void;
    resetTimer: () => void;
    formatTimer: () => string;
    clearFocusedTask?: () => void;
}

export default function PlannerSidebar({
    notes, setNotes,
    meals, setMeals,
    waterGlasses, setWaterGlasses,
    taskInbox, setTaskInbox,
    saveStatus = 'idle',
    durationMinutes = 25,
    pomodoroTime, isTimerRunning,
    focusedTaskTitle,
    setTimerPreset,
    toggleTimer, resetTimer, formatTimer,
    clearFocusedTask
}: PlannerSidebarProps) {
    const t = useTranslations();
    const [newInboxTitle, setNewInboxTitle] = useState('');
    
    // Inbox Themes
    const getInboxTaskTheme = (type: number) => {
        switch (type) {
            case 1: return { icon: '🔥', style: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' };
            case 2: return { icon: '💼', style: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' };
            case 3: return { icon: '🌱', style: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' };
            default: return { icon: '📝', style: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700' };
        }
    };

    const handleAddQuickInbox = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newInboxTitle.trim()) return;
        const newTask: InboxTask = {
            id: Date.now(),
            title: newInboxTitle.trim(),
            completed: false,
            type: 2
        };
        setTaskInbox([newTask, ...taskInbox]);
        setNewInboxTitle('');
    };

    const toggleInboxTask = (id: number) => setTaskInbox(taskInbox.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const cycleInboxTaskType = (id: number) => setTaskInbox(taskInbox.map(t => t.id === id ? { ...t, type: t.type >= 4 ? 1 : t.type + 1 } : t));
    const updateInboxTask = (id: number, val: string) => setTaskInbox(taskInbox.map(t => t.id === id ? { ...t, title: val } : t));
    const removeInboxTask = (id: number) => setTaskInbox(taskInbox.filter(t => t.id !== id));

    const handleInboxDragStart = (e: React.DragEvent, task: InboxTask) => {
        e.dataTransfer.dropEffect = 'copy';
        e.dataTransfer.effectAllowed = 'copyMove';
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'INBOX_TASK',
            id: task.id,
            title: task.title,
            taskType: task.type
        }));
        e.dataTransfer.setData('text/plain', task.title);
    };

    return (
        <div className="flex flex-col gap-6 pb-10 select-none">
            
            {/* AUTOSAVE BADGE INDICATOR */}
            <div className="flex items-center justify-between px-2 -mb-2">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Papan Produktivitas
                </span>
                <div className="text-[10px] font-bold flex items-center gap-1.5 transition-all">
                    {saveStatus === 'saving' && (
                        <span className="text-amber-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                            Menyimpan...
                        </span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                            <Check size={12} strokeWidth={3} />
                            Tersimpan
                        </span>
                    )}
                </div>
            </div>

            {/* POMODORO TIMER */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group transition-colors duration-500">
                <div className="absolute -right-24 -top-24 w-64 h-64 border-[40px] border-slate-50 dark:border-slate-800/50 rounded-full pointer-events-none group-hover:scale-105 transition-all duration-1000"></div>
                
                <div className="relative z-10 flex flex-col">
                    <div className="w-full min-w-0 flex justify-between items-start gap-3 mb-4">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-black text-slate-800 dark:text-white text-sm tracking-tight flex min-w-0 items-center gap-2 transition-colors duration-500">
                                <span className={`w-2.5 h-2.5 shrink-0 rounded-full ${isTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-400'}`}></span>
                                <span className="min-w-0 truncate">{t('sidebar_pomodoro_title') || 'Timer Fokus Sesi'}</span>
                            </h3>
                            {focusedTaskTitle && (
                                <div className="flex items-center gap-1.5 mt-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-indigo-100 dark:border-indigo-500/20 max-w-full truncate animate-in fade-in">
                                    <span className="shrink-0">🎯</span>
                                    <span className="truncate">{focusedTaskTitle}</span>
                                    {clearFocusedTask && (
                                        <button onClick={clearFocusedTask} className="ml-auto text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200">
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <button onClick={resetTimer} title={t('sidebar_pomodoro_reset') || 'Reset Sesi'} className="shrink-0 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <RotateCcw size={14} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Presets */}
                    {setTimerPreset && (
                        <div className="grid grid-cols-3 gap-1.5 mb-4 p-1 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            {[
                                { mins: 25, label: '25m Pomo' },
                                { mins: 50, label: '50m Deep' },
                                { mins: 5, label: '5m Break' }
                            ].map(p => (
                                <button
                                    key={p.mins}
                                    onClick={() => setTimerPreset(p.mins)}
                                    className={`py-1.5 px-2 rounded-xl text-[10px] font-black tracking-tight transition-all ${durationMinutes === p.mins ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center items-center py-2 text-center">
                        <div className="text-6xl font-black text-slate-800 dark:text-white tracking-tighter tabular-nums transition-colors duration-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {formatTimer()}
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <button onClick={toggleTimer} 
                            className={`w-full py-3.5 rounded-2xl font-black tracking-wider uppercase text-xs transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${isTimerRunning ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'}`}>
                            
                            {isTimerRunning ? (
                                <span className="flex items-center gap-2">
                                    <Pause size={16} strokeWidth={3} />
                                    {t('sidebar_pomodoro_pause') || 'Jeda Fokus'}
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Play size={16} strokeWidth={3} />
                                    {t('sidebar_pomodoro_start') || 'Mulai Fokus'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* INBOX (PERSISTENT BACKLOG) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-500">
                <div className="flex min-w-0 justify-between items-center gap-3 mb-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-lg sm:text-xl shadow-inner">📥</div>
                        <div className="min-w-0">
                            <h3 className="font-black text-slate-800 dark:text-white text-sm tracking-tight transition-colors duration-500 truncate">{t('sidebar_inbox_title') || 'Kotak Masuk (Backlog)'}</h3>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider transition-colors duration-500 truncate">Tarik ke timeline untuk jadwalkan</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {taskInbox.length}
                    </span>
                </div>

                {/* Quick Add Form */}
                <form onSubmit={handleAddQuickInbox} className="mb-4">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={newInboxTitle}
                            onChange={(e) => setNewInboxTitle(e.target.value)}
                            placeholder="Ketik tugas cepat & Enter..."
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 pr-10 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newInboxTitle.trim()}
                            className={`absolute right-1.5 w-7 h-7 rounded-xl flex items-center justify-center transition-all ${newInboxTitle.trim() ? 'bg-indigo-600 text-white shadow-md active:scale-90' : 'bg-transparent text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
                        >
                            <span className="text-sm leading-none font-bold">+</span>
                        </button>
                    </div>
                </form>
                
                {taskInbox.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] bg-slate-50/30 dark:bg-slate-800/10 transition-colors duration-500">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wide">Kotak masuk kosong</p>
                        <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">Tulis ide atau tugas yang belum terjadwal di atas</p>
                    </div>
                ) : (
                    <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                        {taskInbox.map((task) => {
                            const theme = getInboxTaskTheme(task.type);
                            return (
                                <div 
                                    key={task.id} 
                                    draggable
                                    onDragStart={(e) => handleInboxDragStart(e, task)}
                                    className={`group flex items-center justify-between gap-2 p-2.5 rounded-2xl border bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing shadow-sm ${task.completed ? 'opacity-50 grayscale-[0.5] bg-slate-50 dark:bg-slate-800/50' : 'border-slate-100 dark:border-slate-800'}`}
                                    title="Tarik ke timeline untuk menjadwalkan"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <button 
                                            onClick={() => toggleInboxTask(task.id)} 
                                            className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
                                        >
                                            {task.completed && <Check size={12} strokeWidth={4} />}
                                        </button>
                                        <button 
                                            onClick={() => cycleInboxTaskType(task.id)} 
                                            className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs transition active:scale-90 shrink-0 ${theme.style}`}
                                            title="Ubah Kategori"
                                        >
                                            {theme.icon}
                                        </button>
                                        <input 
                                            value={task.title} 
                                            onChange={(e) => updateInboxTask(task.id, e.target.value)} 
                                            className={`flex-1 bg-transparent border-0 focus:ring-0 p-0 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-700 truncate transition-colors duration-500 ${task.completed ? 'line-through text-slate-400 dark:text-slate-600' : ''}`} 
                                            placeholder="..." 
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <GripVertical size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 cursor-grab" />
                                        <button 
                                            onClick={() => removeInboxTask(task.id)} 
                                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
                                            title="Hapus"
                                        >
                                            <X size={14} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* QUICK NOTES */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-1 rounded-[2.5rem] shadow-sm border border-yellow-200 dark:border-yellow-900/40 transform rotate-1 transition-all hover:rotate-0 duration-500">
                <div className="bg-yellow-100/50 dark:bg-yellow-900/20 p-5 rounded-[2.2rem] border-dashed border-2 border-yellow-200/60 dark:border-yellow-900/40">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] font-black text-yellow-700/70 uppercase tracking-widest flex items-center gap-1.5">
                            📌 {t('sidebar_notes_title') || 'Catatan Cepat'}
                        </h3>
                        <span className="text-[9px] font-bold text-yellow-600/60 uppercase">Autosave</span>
                    </div>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-0 text-xs font-medium text-slate-700 dark:text-yellow-200 placeholder-yellow-400/60 dark:placeholder-yellow-700 p-0 h-28 resize-none leading-[22px] transition-colors duration-500 custom-scrollbar" 
                        style={{ backgroundImage: 'linear-gradient(transparent, transparent 21px, #eab30820 22px)', backgroundSize: '100% 22px' }}
                        placeholder={t('sidebar_notes_placeholder') || 'Tulis ide dadakan atau memo hari ini...'}
                    />
                </div>
            </div>

            {/* MEALS */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-500">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 transition-colors duration-500">
                    <span className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 p-1.5 rounded-lg text-xs">🍽️</span> {t('sidebar_meal_title') || 'Menu Makan Hari Ini'}
                </h3>
                <div className="space-y-2.5">
                    {[
                        { key: 'breakfast', icon: '🍳', placeholder: t('placeholder_breakfast') || 'Sarapan apa?' },
                        { key: 'lunch', icon: '🍱', placeholder: t('placeholder_lunch') || 'Makan siang...' },
                        { key: 'dinner', icon: '🥗', placeholder: t('placeholder_dinner') || 'Makan malam...' }
                    ].map(meal => (
                        <div key={meal.key} className="flex items-center gap-3 p-2.5 rounded-2xl bg-orange-50/30 dark:bg-orange-500/5 border border-orange-100/50 dark:border-orange-900/20 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-orange-200 dark:focus-within:border-orange-500/40 transition-all">
                            <span className="text-base shrink-0">{meal.icon}</span>
                            <input 
                                value={meals[meal.key as keyof typeof meals] || ''} 
                                onChange={(e) => setMeals({ ...meals, [meal.key]: e.target.value })}
                                className="w-full text-xs font-bold border-0 focus:ring-0 p-0 bg-transparent text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 transition-colors duration-500" 
                                placeholder={meal.placeholder} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* WATER */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-500">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 transition-colors duration-500">
                        <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg text-xs">💧</span> {t('sidebar_water_title') || 'Hidrasi Harian'}
                    </h3>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full transition-colors duration-500">{waterGlasses} / 8 Gelas</span>
                </div>
                <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">
                    {[1,2,3,4,5,6,7,8].map(glass => (
                        <button 
                            key={glass} 
                            type="button"
                            onClick={() => setWaterGlasses(glass === waterGlasses ? glass - 1 : glass)}
                            className={`h-9 flex items-center justify-center transition-all duration-300 transform active:scale-75 rounded-xl ${glass <= waterGlasses ? 'bg-white dark:bg-slate-700 shadow-md scale-105' : 'opacity-25 grayscale dark:opacity-30'}`}
                            title={`Gelas ${glass}`}
                        >
                            <span className="text-base">💧</span>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
