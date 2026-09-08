'use client';

import PlannerTaskModal from './PlannerTaskModal';
import PlannerBatchModal from './PlannerBatchModal';
import { TaskItem, BatchTaskInput } from '../types';

interface PlannerModalsContainerProps {
    showTaskModal: boolean;
    setShowTaskModal: (show: boolean) => void;
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
    showBatchModal: boolean;
    setShowBatchModal: (show: boolean) => void;
    batchTasks: BatchTaskInput[];
    setBatchTasks: React.Dispatch<React.SetStateAction<BatchTaskInput[]>>;
    submitBatchTasks: () => Promise<void>;
}

export default function PlannerModalsContainer({
    showTaskModal,
    setShowTaskModal,
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
    showBatchModal,
    setShowBatchModal,
    batchTasks,
    setBatchTasks,
    submitBatchTasks
}: PlannerModalsContainerProps) {
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
                onOpenBatch={() => {
                    setShowTaskModal(false);
                    setShowBatchModal(true);
                }}
            />

            <PlannerBatchModal 
                show={showBatchModal}
                onClose={() => setShowBatchModal(false)}
                onSwitchToSingle={() => {
                    setShowBatchModal(false);
                    setShowTaskModal(true);
                }}
                tasks={batchTasks}
                setTasks={setBatchTasks}
                onSubmit={submitBatchTasks}
                isExplorer={false}
            />
        </>
    );
}
