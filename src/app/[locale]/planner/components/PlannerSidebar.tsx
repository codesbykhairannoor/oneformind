'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle, Clock, Flame, Briefcase, Sparkles, Check, GripVertical, Play, Pause, RotateCcw, X, Utensils, Droplets, StickyNote } from 'lucide-react';
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
    onScheduleInboxTaskModal?: (task: InboxTask) => void;
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
    clearFocusedTask,
    onScheduleInboxTaskModal
}: PlannerSidebarProps) {
    const t = useTranslations();
    const [newInboxTitle, setNewInboxTitle] = useState('');
    const [dailyHubTab, setDailyHubTab] = useState<'notes' | 'meals' | 'water'>('notes');
    
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

    // Calculate filled meals count
    const filledMealsCount = [meals.breakfast, meals.lunch, meals.dinner].filter(m => m && m.trim().length > 0).length;

    return (
        <div className="flex flex-col gap-4 select-none">
            
            {/* COMPACT HEADER / STATUS BAR */}
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Papan Kerja Harian
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

            {/* 1. COMPACT PRECISION POMODORO TIMER */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 shrink-0 rounded-full ${isTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-400'}`}></span>
                        <h3 className="font-black text-slate-800 dark:text-white text-xs tracking-tight truncate">
                            Timer Fokus
                        </h3>
                        {focusedTaskTitle && (
                            <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 truncate max-w-[130px]" title={focusedTaskTitle}>
                                🎯 {focusedTaskTitle}
                            </span>
                        )}
                    </div>
                    
                    {/* Presets */}
                    {setTimerPreset && (
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl">
                            {[
                                { mins: 25, label: '25m' },
                                { mins: 50, label: '50m' },
                                { mins: 5, label: '5m' }
                            ].map(p => (
                                <button
                                    key={p.mins}
                                    onClick={() => setTimerPreset(p.mins)}
                                    className={`py-0.5 px-2 rounded-lg text-[10px] font-black transition-all ${durationMinutes === p.mins ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tighter tabular-nums font-mono">
                        {formatTimer()}
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleTimer} 
                            className={`h-11 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 ${isTimerRunning ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none'}`}
                        >
                            {isTimerRunning ? <Pause size={14} strokeWidth={3} /> : <Play size={14} strokeWidth={3} />}
                            <span>{isTimerRunning ? 'Jeda' : 'Fokus'}</span>
                        </button>
                        
                        <button 
                            onClick={resetTimer} 
                            title="Reset Timer" 
                            className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700 transition"
                        >
                            <RotateCcw size={14} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. KOTAK MASUK (PERSISTENT BACKLOG & DRAG-TO-TIMELINE) */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
                <div className="flex min-w-0 justify-between items-center gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">📥</span>
                        <h3 className="font-black text-slate-800 dark:text-white text-xs tracking-tight truncate">
                            Kotak Masuk
                        </h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {taskInbox.length}
                        </span>
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">
                        Tarik ke jam di timeline
                    </span>
                </div>

                {/* Quick Add Form */}
                <form onSubmit={handleAddQuickInbox} className="mb-2.5">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={newInboxTitle}
                            onChange={(e) => setNewInboxTitle(e.target.value)}
                            placeholder="Ketik tugas & Enter..."
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-3.5 py-2 pr-9 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newInboxTitle.trim()}
                            className={`absolute right-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${newInboxTitle.trim() ? 'bg-indigo-600 text-white shadow-sm active:scale-90' : 'bg-transparent text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
                        >
                            <span className="text-xs leading-none font-bold">+</span>
                        </button>
                    </div>
                </form>
                
                {taskInbox.length === 0 ? (
                    <div className="text-center py-5 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-800/20">
                        <p className="text-[11px] text-slate-400 font-bold">Kotak masuk kosong</p>
                    </div>
                ) : (
                    <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
                        {taskInbox.map((task) => {
                            const theme = getInboxTaskTheme(task.type);
                            return (
                                <div 
                                    key={task.id} 
                                    draggable
                                    onDragStart={(e) => handleInboxDragStart(e, task)}
                                    className={`group flex items-center justify-between gap-2 p-2 rounded-xl border bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing shadow-sm ${task.completed ? 'opacity-50 grayscale-[0.5] bg-slate-50 dark:bg-slate-800/50' : 'border-slate-100 dark:border-slate-800'}`}
                                    title="Tarik ke timeline untuk menjadwalkan"
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <button 
                                            onClick={() => toggleInboxTask(task.id)} 
                                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
                                        >
                                            {task.completed && <Check size={10} strokeWidth={4} />}
                                        </button>
                                        <button 
                                            onClick={() => cycleInboxTaskType(task.id)} 
                                            className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] transition active:scale-90 shrink-0 ${theme.style}`}
                                            title="Ubah Kategori"
                                        >
                                            {theme.icon}
                                        </button>
                                        <input 
                                            value={task.title} 
                                            onChange={(e) => updateInboxTask(task.id, e.target.value)} 
                                            className={`flex-1 bg-transparent border-0 focus:ring-0 p-0 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-700 truncate ${task.completed ? 'line-through text-slate-400 dark:text-slate-600' : ''}`} 
                                            placeholder="..." 
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {onScheduleInboxTaskModal && (
                                            <button
                                                type="button"
                                                onClick={() => onScheduleInboxTaskModal(task)}
                                                title="Jadwalkan ke timeline"
                                                className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-[10px] font-black flex items-center gap-1 transition active:scale-95"
                                            >
                                                <Clock size={11} strokeWidth={2.5} />
                                                <span className="hidden xs:inline">Jadwal</span>
                                            </button>
                                        )}
                                        <GripVertical size={12} className="hidden sm:block text-slate-300 dark:text-slate-600 group-hover:text-indigo-400" />
                                        <button 
                                            onClick={() => removeInboxTask(task.id)} 
                                            className="opacity-70 sm:opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-0.5"
                                        >
                                            <X size={12} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. UNIFIED COMPACT DAILY HUB (CATATAN, MAKAN, HIDRASI TABBED) */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
                
                {/* Switcher Tabs */}
                <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-3">
                    <button
                        type="button"
                        onClick={() => setDailyHubTab('notes')}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${dailyHubTab === 'notes' ? 'bg-white dark:bg-slate-900 text-yellow-600 dark:text-yellow-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        <span>📌 Catatan</span>
                        {notes.trim().length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                    </button>

                    <button
                        type="button"
                        onClick={() => setDailyHubTab('meals')}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${dailyHubTab === 'meals' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        <span>🍽️ Makan</span>
                        {filledMealsCount > 0 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                                {filledMealsCount}/3
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setDailyHubTab('water')}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${dailyHubTab === 'water' ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        <span>💧 Air</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono">
                            {waterGlasses}/8
                        </span>
                    </button>
                </div>

                {/* Tab 1: Catatan Cepat */}
                {dailyHubTab === 'notes' && (
                    <div className="p-3 bg-yellow-50/70 dark:bg-yellow-950/20 rounded-2xl border border-yellow-200/70 dark:border-yellow-900/30 animate-in fade-in">
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-0 text-xs font-medium text-slate-700 dark:text-yellow-200 placeholder-yellow-400/70 dark:placeholder-yellow-700 p-0 h-24 resize-none leading-[20px] custom-scrollbar" 
                            placeholder={t('sidebar_notes_placeholder') || 'Tulis memo atau ide penting hari ini...'}
                        />
                    </div>
                )}

                {/* Tab 2: Menu Makan */}
                {dailyHubTab === 'meals' && (
                    <div className="space-y-2 animate-in fade-in">
                        {[
                            { key: 'breakfast', icon: '🍳', placeholder: 'Sarapan pagi...' },
                            { key: 'lunch', icon: '🍱', placeholder: 'Makan siang...' },
                            { key: 'dinner', icon: '🥗', placeholder: 'Makan malam...' }
                        ].map(meal => (
                            <div key={meal.key} className="flex items-center gap-2.5 p-2 rounded-xl bg-orange-50/40 dark:bg-orange-500/5 border border-orange-100/60 dark:border-orange-900/20 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                                <span className="text-sm shrink-0">{meal.icon}</span>
                                <input 
                                    value={meals[meal.key as keyof typeof meals] || ''} 
                                    onChange={(e) => setMeals({ ...meals, [meal.key]: e.target.value })}
                                    className="w-full text-xs font-bold border-0 focus:ring-0 p-0 bg-transparent text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600" 
                                    placeholder={meal.placeholder} 
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab 3: Hidrasi */}
                {dailyHubTab === 'water' && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Target 8 Gelas</span>
                            <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{waterGlasses * 250} ml / 2000 ml</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                            {[1,2,3,4,5,6,7,8].map(glass => (
                                <button 
                                    key={glass} 
                                    type="button"
                                    onClick={() => setWaterGlasses(glass === waterGlasses ? glass - 1 : glass)}
                                    className={`h-8 flex items-center justify-center transition-all duration-200 transform active:scale-75 rounded-lg ${glass <= waterGlasses ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-500 font-bold scale-105' : 'opacity-30 grayscale'}`}
                                    title={`Gelas ${glass}`}
                                >
                                    <span className="text-sm">💧</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}
