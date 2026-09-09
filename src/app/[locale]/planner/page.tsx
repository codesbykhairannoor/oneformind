'use client';

import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import PlannerHeader from './components/PlannerHeader';
import PlannerSidebar from './components/PlannerSidebar';
import PlannerTimeline from './components/PlannerTimeline';
import PlannerModalsContainer from './components/PlannerModalsContainer';
import { usePlannerState } from './hooks/usePlannerState';

export default function PlannerPage() {
    usePageTitle('Planner');
    const planner = usePlannerState();
    const [mobileTab, setMobileTab] = useState<'timeline' | 'sidebar'>('timeline');

    // Global keyboard shortcuts (T: today, N: new task, ArrowLeft/Right: date navigation)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeTag = (document.activeElement?.tagName || '').toLowerCase();
            const isInput = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;
            if (isInput) return;

            if (e.key === 't' || e.key === 'T') {
                const today = new Date();
                const m = String(today.getMonth() + 1).padStart(2, '0');
                const d = String(today.getDate()).padStart(2, '0');
                planner.handleDateChange(`${today.getFullYear()}-${m}-${d}`);
            } else if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                planner.openNewTaskModal();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const [y, m, d] = planner.selectedDate.split('-').map(Number);
                const prev = new Date(y, m - 1, d - 1);
                const py = prev.getFullYear();
                const pm = String(prev.getMonth() + 1).padStart(2, '0');
                const pd = String(prev.getDate()).padStart(2, '0');
                planner.handleDateChange(`${py}-${pm}-${pd}`);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const [y, m, d] = planner.selectedDate.split('-').map(Number);
                const next = new Date(y, m - 1, d + 1);
                const ny = next.getFullYear();
                const nm = String(next.getMonth() + 1).padStart(2, '0');
                const nd = String(next.getDate()).padStart(2, '0');
                planner.handleDateChange(`${ny}-${nm}-${nd}`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [planner.selectedDate, planner.handleDateChange, planner.openNewTaskModal]);

    if (!planner.isLoaded) {
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
            <div className="flex flex-col lg:h-[calc(100vh-72px)] lg:overflow-hidden min-h-screen lg:min-h-0">
                <PlannerHeader 
                    selectedDate={planner.selectedDate}
                    onDateChange={planner.handleDateChange}
                    tasks={planner.tasks}
                    stats={{ 
                        percent: planner.progressPercent, 
                        completed: planner.completedCount, 
                        pending: planner.pendingCount 
                    }}
                    onOpenTaskModal={() => planner.openNewTaskModal()}
                    onResetBoard={planner.requestResetBoard}
                />

                <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950 px-3 sm:px-5 lg:px-6 py-3 lg:py-4 transition-colors duration-500 min-h-0 flex flex-col">
                    
                    {/* Mobile Segmented Switcher (< lg) */}
                    <div className="flex lg:hidden items-center justify-center p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl mb-3 max-w-sm mx-auto w-full shrink-0">
                        <button 
                            onClick={() => setMobileTab('timeline')}
                            className={`flex-1 py-1.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
                                mobileTab === 'timeline' 
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                        >
                            <span>📅 Timeline</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono">
                                {planner.tasks.filter(t => String(t.date).split('T')[0] === planner.selectedDate).length}
                            </span>
                        </button>
                        <button 
                            onClick={() => setMobileTab('sidebar')}
                            className={`flex-1 py-1.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
                                mobileTab === 'sidebar' 
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                        >
                            <span>📥 Hub & Timer</span>
                            {planner.taskInbox.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono font-bold">
                                    {planner.taskInbox.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Main Workspace Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 flex-1 min-h-0 max-w-full mx-auto w-full">
                        
                        {/* Sidebar Column: Timer + Inbox + 3-Tab Daily Hub */}
                        <div className={`lg:col-span-2 w-full lg:h-full lg:overflow-y-auto custom-scrollbar pr-0 lg:pr-1 ${
                            mobileTab === 'sidebar' ? 'block pb-24' : 'hidden lg:block'
                        }`}>
                            <PlannerSidebar 
                                notes={planner.notes} 
                                setNotes={planner.handleSetNotes}
                                meals={planner.meals} 
                                setMeals={planner.handleSetMeals}
                                waterGlasses={planner.waterGlasses} 
                                setWaterGlasses={planner.handleSetWaterGlasses}
                                taskInbox={planner.taskInbox} 
                                setTaskInbox={planner.handleSetTaskInbox}
                                saveStatus={planner.saveStatus}
                                durationMinutes={planner.durationMinutes}
                                pomodoroTime={planner.pomodoroTime} 
                                isTimerRunning={planner.isTimerRunning}
                                focusedTaskTitle={planner.focusedTaskTitle}
                                setTimerPreset={planner.setTimerPreset}
                                toggleTimer={planner.toggleTimer} 
                                resetTimer={planner.resetTimer} 
                                formatTimer={planner.formatTimer}
                                clearFocusedTask={planner.clearFocusedTask}
                                onScheduleInboxTaskModal={(inboxTask) => {
                                    planner.openNewTaskModal(undefined, { title: inboxTask.title, type: inboxTask.type });
                                }}
                            />
                        </div>

                        {/* Timeline Column */}
                        <div className={`lg:col-span-3 w-full lg:h-full lg:overflow-hidden min-h-0 ${
                            mobileTab === 'timeline' ? 'block h-[calc(100vh-210px)] min-h-[500px] lg:h-full pb-20 lg:pb-0' : 'hidden lg:block'
                        }`}>
                             <PlannerTimeline 
                                 tasks={planner.tasks}
                                 selectedDate={planner.selectedDate}
                                 now={planner.now}
                                 startHour={planner.startHour}
                                 setStartHour={planner.handleSetStartHour}
                                 editTask={planner.editTask}
                                 toggleTask={planner.toggleTask}
                                 onOpenTaskModal={planner.openNewTaskModal}
                                 onMoveTask={planner.handleMoveTask}
                                 onScheduleInboxTask={planner.handleScheduleInboxTask}
                                 showRolloverBanner={planner.showRolloverBanner}
                                 unfinishedYesterdayTasks={planner.unfinishedYesterdayTasks}
                                 onAcceptRollover={planner.handleAcceptRollover}
                                 onDismissRollover={planner.handleDismissRollover}
                                 onFocusTask={planner.focusOnTask}
                             />
                        </div>
                    </div>
                </div>

                <PlannerModalsContainer 
                    showTaskModal={planner.showTaskModal}
                    setShowTaskModal={planner.setShowTaskModal}
                    editingTaskId={planner.editingTaskId}
                    selectedDate={planner.selectedDate}
                    tasks={planner.tasks}
                    taskTitle={planner.taskTitle}
                    setTaskTitle={planner.setTaskTitle}
                    taskStartTime={planner.taskStartTime}
                    setTaskStartTime={planner.setTaskStartTime}
                    taskEndTime={planner.taskEndTime}
                    setTaskEndTime={planner.setTaskEndTime}
                    taskType={planner.taskType}
                    setTaskType={planner.setTaskType}
                    taskNotes={planner.taskNotes}
                    setTaskNotes={planner.setTaskNotes}
                    submitSingleTask={planner.submitSingleTask}
                    deleteTask={planner.deleteTask}
                    showResetConfirmModal={planner.showResetConfirmModal}
                    setShowResetConfirmModal={planner.setShowResetConfirmModal}
                    confirmResetBoard={planner.confirmResetBoard}
                />
            </div>
        </AuthenticatedLayout>
    );
}
