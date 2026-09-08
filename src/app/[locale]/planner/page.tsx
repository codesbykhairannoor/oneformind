'use client';

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
            <div className="flex flex-col min-h-screen">
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
                    onResetBoard={planner.resetBoard}
                />

                <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-500 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 lg:items-start max-w-full mx-auto pb-20">
                        <div className="lg:col-span-2 order-2 lg:order-1 w-full space-y-6 md:sticky md:top-8">
                            <PlannerSidebar 
                                notes={planner.notes} 
                                setNotes={planner.handleSetNotes}
                                meals={planner.meals} 
                                setMeals={planner.handleSetMeals}
                                waterGlasses={planner.waterGlasses} 
                                setWaterGlasses={planner.handleSetWaterGlasses}
                                taskInbox={planner.taskInbox} 
                                setTaskInbox={planner.handleSetTaskInbox}
                                pomodoroTime={planner.pomodoroTime} 
                                isTimerRunning={planner.isTimerRunning}
                                toggleTimer={planner.toggleTimer} 
                                resetTimer={planner.resetTimer} 
                                formatTimer={planner.formatTimer}
                            />
                        </div>

                        <div className="lg:col-span-3 order-1 lg:order-2 w-full">
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
                    showBatchModal={planner.showBatchModal}
                    setShowBatchModal={planner.setShowBatchModal}
                    batchTasks={planner.batchTasks}
                    setBatchTasks={planner.setBatchTasks}
                    submitBatchTasks={planner.submitBatchTasks}
                />
            </div>
        </AuthenticatedLayout>
    );
}
