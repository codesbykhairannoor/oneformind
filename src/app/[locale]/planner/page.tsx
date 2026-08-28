'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ModalPortal from '@/components/ModalPortal';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { usePageTitle } from '@/hooks/usePageTitle';
import PlannerHeader from './components/PlannerHeader';
import PlannerSidebar from './components/PlannerSidebar';
import PlannerTimeline from './components/PlannerTimeline';
import PlannerBatchModal from './components/PlannerBatchModal';
import { X } from 'lucide-react';

interface TaskItem {
    id: number;
    date: string;
    title: string;
    start_time: string;
    end_time: string;
    type: number;
    notes?: string;
    completed: boolean;
}

interface InboxTask {
    id: number;
    title: string;
    completed: boolean;
    type: number;
}

export default function PlannerPage() {
    usePageTitle('Planner');
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const [selectedDate, setSelectedDate] = useState(dateParam || todayStr);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        const params = new URLSearchParams(searchParams.toString());
        params.set('date', date);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [notes, setNotes] = useState('');
    const [meals, setMeals] = useState({ breakfast: '', lunch: '', dinner: '' });
    const [waterGlasses, setWaterGlasses] = useState(0);
    const [taskInbox, setTaskInbox] = useState<InboxTask[]>([]);
    
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    const [startHour, setStartHour] = useState(6);
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);

    // Modal state
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskStartTime, setTaskStartTime] = useState('09:00');
    const [taskEndTime, setTaskEndTime] = useState('10:00');
    const [taskType, setTaskType] = useState(2);
    const [taskNotes, setTaskNotes] = useState('');
    const [conflictError, setConflictError] = useState<string | null>(null);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [batchTasks, setBatchTasks] = useState([
        { title: '', start_time: '09:00', end_time: '10:00', type: 2 }
    ]);

    useEffect(() => {
        if (dateParam && dateParam !== selectedDate) {
            setSelectedDate(dateParam);
        }
    }, [dateParam]);

    // Initial Hydration
    useEffect(() => {
        const savedStart = localStorage.getItem('planner_start_time');
        if (savedStart) setStartHour(parseInt(savedStart));
        
        const fetchTasks = async () => {
            try {
                const res = await fetch(`/api/planner/tasks?date=${selectedDate}`);
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data.map((t: any) => ({
                        id: t.id,
                        date: t.date.split('T')[0],
                        title: t.title,
                        start_time: t.startTime ? t.startTime.substring(11, 16) : '',
                        end_time: t.endTime ? t.endTime.substring(11, 16) : '',
                        type: t.type,
                        notes: t.notes || '',
                        completed: t.isCompleted
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchTasks();

        const clockInterval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(clockInterval);
    }, [selectedDate]);

    // Effect for loading specific date data when selectedDate changes
    useEffect(() => {
        if (!isLoaded) return;
        
        const fetchDaily = async () => {
            try {
                const res = await fetch(`/api/planner/daily?date=${selectedDate}`);
                if (res.ok) {
                    const data = await res.json();
                    
                    setNotes(data.notes || '');
                    
                    if (data.meals) {
                        setMeals(data.meals);
                    } else {
                        setMeals({ breakfast: '', lunch: '', dinner: '' });
                    }
                    
                    setWaterGlasses(data.waterGlasses || 0);
                    
                    if (data.inbox) {
                        setTaskInbox(data.inbox);
                    } else {
                        setTaskInbox([]);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch daily data", e);
            }
        };

        fetchDaily();
    }, [selectedDate, isLoaded]);

    const syncDaily = (payload: any) => {
        fetch('/api/planner/daily', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: selectedDate, ...payload })
        }).catch(e => console.error("Sync failed", e));
    };

    const handleSetNotes = (val: string) => {
        setNotes(val);
        syncDaily({ notes: val });
    };

    const handleSetMeals = (val: { breakfast: string, lunch: string, dinner: string }) => {
        setMeals(val);
        syncDaily({ meals: val });
    };

    const handleSetWaterGlasses = (val: number) => {
        setWaterGlasses(val);
        syncDaily({ waterGlasses: val });
    };

    const handleSetTaskInbox = (val: InboxTask[]) => {
        setTaskInbox(val);
        syncDaily({ inbox: val });
    };

    // Time conversion & conflict validation helpers
    const timeToMin = (tStr: string) => {
        if (!tStr) return 0;
        const [h, m] = tStr.split(':').map(Number);
        return h * 60 + m;
    };

    const checkTimeConflict = (start: string, end: string, excludeId?: number | null) => {
        if (!start || !end) return null;
        const newStart = timeToMin(start);
        let newEnd = timeToMin(end);
        if (newEnd < newStart) newEnd += 1440;

        const duration = newEnd - newStart;
        if (duration < 15) {
            return t('error_duration_min') || 'Minimal 15 menit!';
        }

        const hasConflict = tasks.some(task => {
            if (excludeId && task.id === excludeId) return false;
            if (task.date !== selectedDate) return false;
            if (!task.start_time || !task.end_time) return false;

            const taskStart = timeToMin(task.start_time);
            let taskEnd = timeToMin(task.end_time);
            if (taskEnd < taskStart) taskEnd += 1440;

            return (newStart < taskEnd && newEnd > taskStart);
        });

        if (hasConflict) return t('error_conflict') || 'Jadwal bentrok!';
        return null;
    };

    // Auto check conflict as typing in modal
    useEffect(() => {
        if (showTaskModal) {
            const err = checkTimeConflict(taskStartTime, taskEndTime, editingTaskId);
            setConflictError(err);
        } else {
            setConflictError(null);
        }
    }, [taskStartTime, taskEndTime, editingTaskId, tasks, showTaskModal, selectedDate]);

    const updateTasksState = (updater: TaskItem[] | ((prev: TaskItem[]) => TaskItem[])) => {
        setTasks(prev => {
            const newTasks = typeof updater === 'function' ? updater(prev) : updater;
            window.dispatchEvent(new Event('planner_updated'));
            return newTasks;
        });
    };

    const activeTasks = tasks.filter(t => t.date === selectedDate);
    const completedCount = activeTasks.filter(t => t.completed).length;
    const pendingCount = activeTasks.length - completedCount;
    const progressPercent = activeTasks.length > 0 ? Math.round((completedCount / activeTasks.length) * 100) : 0;

    const toggleTimer = () => {
        if (isTimerRunning) {
            if (timerInterval) clearInterval(timerInterval);
            setIsTimerRunning(false);
        } else {
            const interval = setInterval(() => {
                setPomodoroTime(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsTimerRunning(false);
                        alert(t('sidebar_pomodoro_alert') || 'Waktu fokus selesai!');
                        return 25 * 60;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerInterval(interval);
            setIsTimerRunning(true);
        }
    };

    const resetTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        setIsTimerRunning(false);
        setPomodoroTime(25 * 60);
    };

    const formatTimer = () => {
        const mins = Math.floor(pomodoroTime / 60);
        const secs = pomodoroTime % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const toggleTask = async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        
        updateTasksState(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        
        try {
            await fetch(`/api/planner/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: !task.completed })
            });
        } catch (error) {
            console.error('Failed to toggle task:', error);
            // Revert on error
            updateTasksState(prev => prev.map(t => t.id === id ? { ...t, completed: task.completed } : t));
        }
    };

    const openNewTaskModal = (defaultTime?: string) => {
        setEditingTaskId(null);
        setTaskTitle('');
        
        let start = defaultTime || '09:00';
        if (!defaultTime) {
            const occupied = (timeStr: string) => {
                const startM = timeToMin(timeStr);
                const endM = startM + 60;
                return tasks.some(t => {
                    if (t.date !== selectedDate || !t.start_time || !t.end_time) return false;
                    const tS = timeToMin(t.start_time);
                    let tE = timeToMin(t.end_time);
                    if (tE < tS) tE += 1440;
                    return (startM < tE && endM > tS);
                });
            };

            for (let h = 8; h <= 20; h++) {
                const candidate = `${String(h).padStart(2, '0')}:00`;
                if (!occupied(candidate)) {
                    start = candidate;
                    break;
                }
            }
        }

        setTaskStartTime(start);
        
        const [h, m] = start.split(':').map(Number);
        const endH = String((h + 1) % 24).padStart(2, '0');
        const endM = String(m).padStart(2, '0');
        setTaskEndTime(`${endH}:${endM}`);
        
        setTaskType(2);
        setTaskNotes('');
        setShowTaskModal(true);
    };

    const editTask = (task: TaskItem) => {
        setEditingTaskId(task.id); 
        setTaskTitle(task.title); 
        setTaskStartTime(task.start_time); 
        setTaskEndTime(task.end_time);
        setTaskType(task.type); 
        setTaskNotes(task.notes || ''); 
        setShowTaskModal(true);
    };

    const submitSingleTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;
        
        const err = checkTimeConflict(taskStartTime, taskEndTime, editingTaskId);
        if (err) {
            setConflictError(err);
            return;
        }

        try {
            if (editingTaskId) {
                const res = await fetch(`/api/planner/tasks/${editingTaskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: taskTitle, startTime: taskStartTime, endTime: taskEndTime, type: taskType, notes: taskNotes
                    })
                });
                if (res.ok) {
                    updateTasksState(prev => prev.map(t => t.id === editingTaskId ? { ...t, title: taskTitle, start_time: taskStartTime, end_time: taskEndTime, type: taskType, notes: taskNotes } : t));
                }
            } else {
                const res = await fetch('/api/planner/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: selectedDate, title: taskTitle, startTime: taskStartTime, endTime: taskEndTime, type: taskType, notes: taskNotes
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    updateTasksState(prev => [...prev, { id: data.id, date: selectedDate, title: taskTitle, start_time: taskStartTime, end_time: taskEndTime, type: taskType, notes: taskNotes, completed: false }]);
                }
            }
        } catch (error) {
            console.error('Failed to save task:', error);
        }
        setShowTaskModal(false);
    };

    const handleMoveTask = async (taskId: number, newStartTime: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const [startH, startM] = task.start_time.split(':').map(Number);
        let [endH, endM] = task.end_time ? task.end_time.split(':').map(Number) : [startH + 1, startM];
        let duration = (endH * 60 + endM) - (startH * 60 + startM);
        if (duration < 0) duration += 1440;
        
        const [newStartH, newStartM] = newStartTime.split(':').map(Number);
        const newEndMinutes = (newStartH * 60 + newStartM) + duration;
        const finalEndH = String(Math.floor(newEndMinutes / 60) % 24).padStart(2, '0');
        const finalEndM = String(newEndMinutes % 60).padStart(2, '0');
        const newEndTime = `${finalEndH}:${finalEndM}`;

        const err = checkTimeConflict(newStartTime, newEndTime, taskId);
        if (err) {
            alert(`Gagal memindahkan jadwal: ${err}`);
            return;
        }

        updateTasksState(prev => prev.map(t => t.id === taskId ? { ...t, start_time: newStartTime, end_time: newEndTime } : t));

        try {
            await fetch(`/api/planner/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startTime: newStartTime, endTime: newEndTime })
            });
        } catch (error) {
            console.error('Failed to move task:', error);
            // Revert on error
            updateTasksState(prev => prev.map(t => t.id === taskId ? { ...t, start_time: task.start_time, end_time: task.end_time } : t));
        }
    };

    const deleteTask = async () => {
        if (editingTaskId) {
            updateTasksState(prev => prev.filter(t => t.id !== editingTaskId));
            try {
                await fetch(`/api/planner/tasks/${editingTaskId}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
        setShowTaskModal(false);
    };

    if (!isLoaded) {
        return (
            <AuthenticatedLayout>
                <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-12 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col min-h-screen">
                
                {/* Planner Header Component */}
                <PlannerHeader 
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    tasks={tasks}
                    stats={{ percent: progressPercent, completed: completedCount, pending: pendingCount }}
                    onOpenTaskModal={() => openNewTaskModal()}
                    onResetBoard={() => setTasks(tasks.filter(t => t.date !== selectedDate))}
                />

                {/* Main Content */}
                <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-500 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 lg:items-start max-w-full mx-auto pb-20">
                        
                        {/* Sidebar */}
                        <div className="lg:col-span-2 order-2 lg:order-1 w-full space-y-6 md:sticky md:top-8">
                            <PlannerSidebar 
                                notes={notes} setNotes={handleSetNotes}
                                meals={meals} setMeals={handleSetMeals}
                                waterGlasses={waterGlasses} setWaterGlasses={handleSetWaterGlasses}
                                taskInbox={taskInbox} setTaskInbox={handleSetTaskInbox}
                                pomodoroTime={pomodoroTime} isTimerRunning={isTimerRunning}
                                toggleTimer={toggleTimer} resetTimer={resetTimer} formatTimer={formatTimer}
                            />
                        </div>

                        {/* Timeline */}
                        <div className="lg:col-span-3 order-1 lg:order-2 w-full">
                             <PlannerTimeline 
                                 tasks={tasks}
                                 selectedDate={selectedDate}
                                 now={now}
                                 startHour={startHour}
                                 setStartHour={(h) => {
                                     setStartHour(h);
                                     localStorage.setItem('planner_start_time', h.toString());
                                 }}
                                 editTask={editTask}
                                 toggleTask={toggleTask}
                                 onOpenTaskModal={openNewTaskModal}
                                 onMoveTask={handleMoveTask}
                             />
                        </div>
                    </div>
                </div>

                {/* MODAL (Single Task) */}
                {showTaskModal && (
                    <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60  animate-in fade-in duration-200">
                        <div className="absolute inset-0" onClick={() => setShowTaskModal(false)}></div>
                        <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                            
                            <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
                                <div>
                                    <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">{editingTaskId ? (t('modal_edit_title') || 'Edit Tugas') : (t('modal_new_title') || 'Tugas Baru')}</h3>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{new Date(selectedDate).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!editingTaskId && (
                                        <button onClick={() => { setShowTaskModal(false); setShowBatchModal(true); }} type="button" 
                                            className="text-[10px] font-black tracking-widest px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition flex items-center gap-1 active:scale-95">
                                            Batch
                                        </button>
                                    )}
                                    <button onClick={() => setShowTaskModal(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                        <X size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={submitSingleTask} className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('modal_label_task_name') || 'Judul Tugas'}</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        placeholder={t('modal_placeholder_task_name') || 'Misal: Review Laporan Bulanan'}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('label_start_time') || 'Mulai'}</label>
                                        <input 
                                            type="time" 
                                            required
                                            value={taskStartTime}
                                            onChange={(e) => setTaskStartTime(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('label_end_time') || 'Selesai'}</label>
                                        <input 
                                            type="time" 
                                            required
                                            value={taskEndTime}
                                            onChange={(e) => setTaskEndTime(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('label_priority') || 'Kategori / Prioritas'}</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: 1, label: t('label_urgent') || 'Urgent', icon: '🔥', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
                                            { id: 2, label: t('label_work') || 'Work', icon: '💼', color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
                                            { id: 3, label: t('prio_normal') || 'Normal', icon: '🌱', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
                                            { id: 4, label: t('label_todo') || 'Task', icon: '📝', color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
                                        ].map(type => (
                                            <button 
                                                key={type.id}
                                                type="button"
                                                onClick={() => setTaskType(type.id)}
                                                className={`py-3 px-1 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${taskType === type.id ? type.color + ' ring-2 ring-indigo-500/50 shadow-md scale-105' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            >
                                                <span className="text-xl leading-none">{type.icon}</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('label_notes') || 'Catatan Tambahan (Opsional)'}</label>
                                    <textarea 
                                        value={taskNotes}
                                        onChange={(e) => setTaskNotes(e.target.value)}
                                        placeholder={t('placeholder_notes') || 'Konteks, link, atau detail lain...'}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 min-h-[100px] resize-none"
                                    />
                                </div>

                                {conflictError && (
                                    <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
                                        <span>{conflictError}</span>
                                    </div>
                                )}

                                <div className="pt-2 flex gap-3 shrink-0">
                                    {editingTaskId && (
                                        <button type="button" onClick={deleteTask} className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                                            {t('yes_delete') || 'Hapus'}
                                        </button>
                                    )}
                                    <button type="submit" className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all">
                                        {editingTaskId ? (t('btn_save_all') || 'Simpan Perubahan') : (t('modal_new_title') || 'Tambahkan Tugas')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div></ModalPortal>
                )}

                {/* BATCH MODAL */}
                <PlannerBatchModal 
                    show={showBatchModal}
                    onClose={() => setShowBatchModal(false)}
                    onSwitchToSingle={() => {
                        setShowBatchModal(false);
                        setShowTaskModal(true);
                    }}
                    tasks={batchTasks}
                    setTasks={setBatchTasks}
                    onSubmit={() => {
                        // Submit batch logic would go here
                        setShowBatchModal(false);
                    }}
                    isExplorer={false} // Currently set to false so the user can test the batch UI
                />

            </div>
        </AuthenticatedLayout>
    );
}
