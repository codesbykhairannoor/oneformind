'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle } from 'lucide-react';

interface InboxTask {
    id: number;
    title: string;
    completed: boolean;
    type: number;
}

interface PlannerSidebarProps {
    notes: string;
    setNotes: (val: string) => void;
    meals: { breakfast: string, lunch: string, dinner: string };
    setMeals: (val: { breakfast: string, lunch: string, dinner: string }) => void;
    waterGlasses: number;
    setWaterGlasses: (val: number) => void;
    taskInbox: InboxTask[];
    setTaskInbox: (val: InboxTask[]) => void;
    pomodoroTime: number;
    isTimerRunning: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    formatTimer: () => string;
}

export default function PlannerSidebar({
    notes, setNotes,
    meals, setMeals,
    waterGlasses, setWaterGlasses,
    taskInbox, setTaskInbox,
    pomodoroTime, isTimerRunning,
    toggleTimer, resetTimer, formatTimer
}: PlannerSidebarProps) {
    const t = useTranslations();
    
    // Inbox Helpers
    const getInboxTaskTheme = (type: number) => {
        switch (type) {
            case 1: return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
            case 2: return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20';
            case 3: return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
            default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700';
        }
    };

    const getInboxTaskIcon = (type: number) => {
        switch (type) {
            case 1: return { icon: '🔥', style: 'bg-rose-50 border-rose-100 text-rose-500' };
            case 2: return { icon: '⚡', style: 'bg-amber-50 border-amber-100 text-amber-500' };
            case 3: return { icon: '☕', style: 'bg-indigo-50 border-indigo-100 text-indigo-500' };
            default: return { icon: '📝', style: 'bg-slate-50 border-slate-100 text-slate-500' };
        }
    };

    const addNewInboxTask = () => setTaskInbox([{ id: Date.now(), title: '', completed: false, type: 2 }, ...taskInbox]);
    const toggleInboxTask = (id: number) => setTaskInbox(taskInbox.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const cycleInboxTaskType = (id: number) => setTaskInbox(taskInbox.map(t => t.id === id ? { ...t, type: t.type >= 3 ? 1 : t.type + 1 } : t));
    const updateInboxTask = (id: number, val: string) => setTaskInbox(taskInbox.map(t => t.id === id ? { ...t, title: val } : t));
    const removeInboxTask = (id: number) => setTaskInbox(taskInbox.filter(t => t.id !== id));

    return (
        <div className="flex flex-col gap-6 pb-10 select-none">
            
            {/* NEURAL BRIDGE */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-indigo-500/20 p-5 rounded-[2rem] shadow-[0_0_30px_-5px_rgba(79,70,229,0.15)] flex justify-between items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
                <div className="absolute -left-20 -top-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/30 shrink-0">
                        <div className="w-full h-full bg-[#0f172a] rounded-[15px] flex items-center justify-center">
                            <span className="text-xl">🌌</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white tracking-wide">Neural Bridge</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-[200px] leading-relaxed">{t('gating.lock_title_required')}</p>
                    </div>
                </div>
                
                <button className="relative z-10 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-500/20 shrink-0">
                    {t('gating.btn_upgrade')}
                </button>
            </div>

            {/* POMODORO TIMER */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group transition-colors duration-500">
                <div className="absolute -right-24 -top-24 w-64 h-64 border-[40px] border-slate-50 dark:border-slate-800/50 rounded-full pointer-events-none group-hover:scale-105 transition-all duration-1000"></div>
                
                <div className="relative z-10 flex flex-col">
                    <div className="w-full min-w-0 flex justify-between items-start gap-3 mb-6">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-black text-slate-800 dark:text-white text-sm tracking-tight flex min-w-0 items-center gap-2 transition-colors duration-500">
                                <span className={`w-2 h-2 shrink-0 rounded-full ${isTimerRunning ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
                                <span className="min-w-0 truncate">{t('sidebar_pomodoro_title') || 'Fokus & Konsentrasi'}</span>
                            </h3>
                        </div>
                        <button onClick={resetTimer} title={t('sidebar_pomodoro_reset') || 'Reset Sesi'} className="shrink-0 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    </div>

                    <div className="flex justify-center items-center py-4 text-center">
                        <div className="text-6xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tighter tabular-nums transition-colors duration-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {formatTimer()}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button onClick={toggleTimer} 
                            className={`w-full py-4 rounded-2xl font-black tracking-widest uppercase transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${isTimerRunning ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'}`}>
                            
                            {isTimerRunning ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                                    {t('sidebar_pomodoro_pause') || 'Jeda'}
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                                    {t('sidebar_pomodoro_start') || 'Mulai Sesi'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* INBOX */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-500">
                <div className="flex min-w-0 justify-between items-center gap-3 mb-5">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-lg sm:text-xl">📥</div>
                        <div className="min-w-0">
                            <h3 className="font-black text-slate-800 dark:text-white text-sm tracking-tight transition-colors duration-500 truncate">{t('sidebar_inbox_title') || 'Kotak Masuk'}</h3>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter italic transition-colors duration-500 truncate">{t('sidebar_persistent') || '(SIMPANAN OTOMATIS)'}</p>
                        </div>
                    </div>
                    <button onClick={addNewInboxTask} className="shrink-0 p-2.5 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all active:scale-90 shadow-md">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
                
                {taskInbox.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] bg-slate-50/30 dark:bg-slate-800/10 transition-colors duration-500">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-black italic tracking-widest">{t('sidebar_inbox_empty') || 'KOTAK MASUK KOSONG'}</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-none">
                        {taskInbox.map((task) => (
                            <div key={task.id} 
                                className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all ${task.completed ? 'opacity-50 grayscale-[0.5] bg-slate-50 dark:bg-slate-800/50' : ''}`}>
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <button onClick={() => toggleInboxTask(task.id)} 
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-indigo-400'}`}>
                                        {task.completed && <svg className="w-4 h-4 stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                                    </button>
                                    <button onClick={() => cycleInboxTaskType(task.id)} className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm transition active:scale-90 flex-shrink-0 ${getInboxTaskIcon(task.type).style}`}>
                                        {getInboxTaskIcon(task.type).icon}
                                    </button>
                                    <input value={task.title} onChange={(e) => updateInboxTask(task.id, e.target.value)} 
                                        className={`flex-1 bg-transparent border-0 focus:ring-0 p-0 text-sm font-black text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-700 truncate transition-colors duration-500 ${task.completed ? 'line-through text-slate-400 dark:text-slate-600' : ''}`} 
                                        placeholder="..." />
                                </div>
                                <button onClick={() => removeInboxTask(task.id)} className="opacity-0 group-hover:opacity-100 text-rose-300 hover:text-rose-600 transition-all flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QUICK NOTES */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-1 rounded-[2.5rem] shadow-sm border border-yellow-200 dark:border-yellow-900/40 transform rotate-1 transition-all hover:rotate-0 duration-500">
                <div className="bg-yellow-100/50 dark:bg-yellow-900/20 p-6 rounded-[2.2rem] border-dashed border-2 border-yellow-200/60 dark:border-yellow-900/40">
                    <h3 className="text-[10px] font-black text-yellow-700/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                        📌 {t('sidebar_notes_title') || 'Catatan Cepat'}
                    </h3>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-transparent border-0 focus:ring-0 text-sm font-medium text-slate-700 dark:text-yellow-200 placeholder-yellow-400/50 dark:placeholder-yellow-700 p-0 h-32 resize-none leading-[24px] transition-colors duration-500" 
                        style={{ backgroundImage: 'linear-gradient(transparent, transparent 23px, #eab30820 24px)', backgroundSize: '100% 24px' }}
                        placeholder={t('sidebar_notes_placeholder') || 'Tulis ide dadakan di sini...'}
                    />
                </div>
            </div>

            {/* MEALS */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-500">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors duration-500">
                    <span className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 p-1.5 rounded-lg text-xs">🍽️</span> {t('sidebar_meal_title') || 'Menu Makan'}
                </h3>
                <div className="space-y-3">
                    {[
                        { key: 'breakfast', icon: '🍳', placeholder: t('placeholder_breakfast') || 'Sarapan apa?' },
                        { key: 'lunch', icon: '🍱', placeholder: t('placeholder_lunch') || 'Makan Siang...' },
                        { key: 'dinner', icon: '🥗', placeholder: t('placeholder_dinner') || 'Makan Malam...' }
                    ].map(meal => (
                        <div key={meal.key} className="flex items-center gap-3 p-3 rounded-2xl bg-orange-50/30 dark:bg-orange-500/5 border border-orange-50 dark:border-orange-900/20 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-orange-200 dark:focus-within:border-orange-500/40 transition-all">
                            <span className="text-xl flex-shrink-0">{meal.icon}</span>
                            <input 
                                value={meals[meal.key as keyof typeof meals] || ''} 
                                onChange={(e) => setMeals({ ...meals, [meal.key]: e.target.value })}
                                className="w-full text-xs font-black border-0 focus:ring-0 p-0 bg-transparent text-slate-700 dark:text-slate-200 placeholder-orange-200 dark:placeholder-orange-900 transition-colors duration-500" 
                                placeholder={meal.placeholder} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* WATER */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 transition-colors duration-500">
                        <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg text-xs">💧</span> {t('sidebar_water_title') || 'Hidrasi'}
                    </h3>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full transition-colors duration-500">{waterGlasses} / 8</span>
                </div>
                <div className="grid grid-cols-4 gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 transition-colors duration-500">
                    {[1,2,3,4,5,6,7,8].map(glass => (
                        <button key={glass} type="button"
                            onClick={() => setWaterGlasses(glass === waterGlasses ? glass - 1 : glass)}
                            className={`h-10 flex items-center justify-center transition-all duration-300 transform active:scale-75 rounded-xl ${glass <= waterGlasses ? 'bg-white dark:bg-slate-700 shadow-md' : 'opacity-20 grayscale dark:opacity-30'}`}>
                            <span className="text-lg">💧</span>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
