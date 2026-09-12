'use client';

import PlannerTaskModal from './PlannerTaskModal';
import PlannerRoutineModal from './PlannerRoutineModal';
import ModalPortal from '@/components/ModalPortal';
import { TaskItem } from '../types';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';

interface PlannerModalsContainerProps {
    showTaskModal: boolean;
    setShowTaskModal: (show: boolean) => void;
    showRoutineModal?: boolean;
    setShowRoutineModal?: (show: boolean) => void;
    onRoutineSuccess?: () => void;
    editingTaskId: number | null;
    selectedDate: string;
    tasks: TaskItem[];
    taskTitle: string;
    setTaskTitle: (title: string) => void;
    taskStartTime: string;
    setTaskStartTime: (time: string) => void;
    taskEndTime: string;
    setTaskEndTime: (time: string) => void;
    taskType: number;
    setTaskType: (type: number) => void;
    taskNotes: string;
    setTaskNotes: (notes: string) => void;
    submitSingleTask: (e: React.FormEvent) => Promise<void>;
    deleteTask: () => Promise<void>;
    showResetConfirmModal?: boolean;
    setShowResetConfirmModal?: (show: boolean) => void;
    confirmResetBoard?: () => Promise<void>;
}

export default function PlannerModalsContainer({
    showTaskModal,
    setShowTaskModal,
    showRoutineModal = false,
    setShowRoutineModal,
    onRoutineSuccess,
    editingTaskId,
    selectedDate,
    tasks,
    taskTitle,
    setTaskTitle,
    taskStartTime,
    setTaskStartTime,
    taskEndTime,
    setTaskEndTime,
    taskType,
    setTaskType,
    taskNotes,
    setTaskNotes,
    submitSingleTask,
    deleteTask,
    showResetConfirmModal,
    setShowResetConfirmModal,
    confirmResetBoard
}: PlannerModalsContainerProps) {
    const locale = useLocale();
    const formattedDate = new Date(selectedDate).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <>
            <PlannerTaskModal 
                show={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                editingTaskId={editingTaskId}
                selectedDate={selectedDate}
                tasks={tasks}
                taskTitle={taskTitle}
                setTaskTitle={setTaskTitle}
                taskStartTime={taskStartTime}
                setTaskStartTime={setTaskStartTime}
                taskEndTime={taskEndTime}
                setTaskEndTime={setTaskEndTime}
                taskType={taskType}
                setTaskType={setTaskType}
                taskNotes={taskNotes}
                setTaskNotes={setTaskNotes}
                onSave={submitSingleTask}
                onDelete={deleteTask}
            />

            <PlannerRoutineModal
                show={showRoutineModal}
                onClose={() => setShowRoutineModal?.(false)}
                selectedDate={selectedDate}
                onSuccess={() => {
                    if (onRoutineSuccess) onRoutineSuccess();
                }}
            />

            {/* Reset Confirmation Dialog */}
            {showResetConfirmModal && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 animate-in fade-in duration-200 backdrop-blur-sm">
                        <div className="absolute inset-0" onClick={() => setShowResetConfirmModal?.(false)}></div>
                        <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 w-full max-w-md p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-4 shadow-inner">
                                <Trash2 size={28} strokeWidth={2.5} />
                            </div>

                            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                Kosongkan Timeline Hari Ini?
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                Semua jadwal tugas pada <span className="font-bold text-slate-700 dark:text-slate-200">{formattedDate}</span> akan dihapus dari database. Kotak masuk dan catatan harian Anda tetap aman.
                            </p>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowResetConfirmModal?.(false)}
                                    type="button"
                                    className="flex-1 py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmResetBoard}
                                    type="button"
                                    className="flex-1 py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95 transition"
                                >
                                    Ya, Kosongkan
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </>
    );
}
