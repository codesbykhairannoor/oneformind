'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    Calendar, Clock, CheckCircle2, AlertTriangle, 
    Plus, Trash2, Filter, LayoutGrid, List,
    BookOpen, Sparkles, Check, ChevronRight, Tag, ArrowRight
} from 'lucide-react';
import { CourseRecord } from './CourseCard';
import ModalPortal from '@/components/ModalPortal';

export type AssignmentType = 'assignment' | 'quiz' | 'uts' | 'uas' | 'project';
export type AssignmentStatus = 'todo' | 'in_progress' | 'due_soon' | 'completed';
export type PriorityLevel = 'urgent' | 'medium' | 'normal';

export interface AssignmentItem {
    id: string;
    course_id?: string | number;
    course_name: string;
    title: string;
    description?: string;
    due_date: string; // YYYY-MM-DD or ISO string
    type: AssignmentType;
    priority: PriorityLevel;
    status: AssignmentStatus;
    grade?: number | null;
}

interface AssignmentRadarProps {
    courses: CourseRecord[];
    terms: Record<string, string>;
    assignments?: AssignmentItem[];
    onSaveAssignments?: (items: AssignmentItem[]) => void;
}

export default function AssignmentRadar({ 
    courses, 
    terms,
    assignments = [],
    onSaveAssignments 
}: AssignmentRadarProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [filterCourse, setFilterCourse] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    
    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        course_name: courses[0]?.course_name || '',
        due_date: '',
        type: 'assignment' as AssignmentType,
        priority: 'medium' as PriorityLevel,
        description: ''
    });

    const saveAssignments = (items: AssignmentItem[]) => {
        onSaveAssignments?.(items);
    };

    const handleCreateAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const newItem: AssignmentItem = {
            id: Date.now().toString(),
            title: formData.title,
            course_name: formData.course_name || (courses[0]?.course_name || 'Matakuliah'),
            due_date: formData.due_date || new Date().toISOString().split('T')[0],
            type: formData.type,
            priority: formData.priority,
            description: formData.description,
            status: 'todo'
        };

        const updated = [newItem, ...assignments];
        saveAssignments(updated);
        setIsAddModalOpen(false);
        setFormData({
            title: '',
            course_name: courses[0]?.course_name || '',
            due_date: '',
            type: 'assignment',
            priority: 'medium',
            description: ''
        });
    };

    const handleUpdateStatus = (id: string, newStatus: AssignmentStatus) => {
        const updated = assignments.map(a => a.id === id ? { ...a, status: newStatus } : a);
        saveAssignments(updated);
    };

    const handleDeleteAssignment = (id: string) => {
        const updated = assignments.filter(a => a.id !== id);
        saveAssignments(updated);
    };

    // Helper: calculate days remaining
    const getDeadlineBadge = (dueDateStr: string) => {
        if (!dueDateStr) return null;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const due = new Date(dueDateStr);
        due.setHours(0, 0, 0, 0);
        
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                label: isIndo ? `Terlewat (${Math.abs(diffDays)} hari)` : `Overdue (${Math.abs(diffDays)}d)`,
                color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
                urgent: true
            };
        } else if (diffDays === 0) {
            return {
                label: isIndo ? 'Hari Ini! 🔥' : 'Due Today! 🔥',
                color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
                urgent: true
            };
        } else if (diffDays === 1) {
            return {
                label: isIndo ? 'Besok! ⏳' : 'Tomorrow! ⏳',
                color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
                urgent: true
            };
        } else if (diffDays <= 3) {
            return {
                label: isIndo ? `H-${diffDays} Hari` : `${diffDays} days left`,
                color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50',
                urgent: false
            };
        } else {
            return {
                label: isIndo ? `${diffDays} Hari lagi` : `${diffDays} days left`,
                color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
                urgent: false
            };
        }
    };

    const getTypeLabel = (type: AssignmentType) => {
        switch (type) {
            case 'uts': return isIndo ? 'UTS (Midterm)' : 'Midterm Exam';
            case 'uas': return isIndo ? 'UAS (Final)' : 'Final Exam';
            case 'quiz': return isIndo ? 'Kuis' : 'Quiz';
            case 'project': return isIndo ? 'Proyek / Paper' : 'Project / Paper';
            default: return isIndo ? 'Tugas Kuliah' : 'Assignment';
        }
    };

    const getTypeBadgeColor = (type: AssignmentType) => {
        switch (type) {
            case 'uts':
            case 'uas': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'project': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'quiz': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    const getPriorityBadge = (priority: PriorityLevel) => {
        switch (priority) {
            case 'urgent': return { label: isIndo ? 'Prioritas Tinggi' : 'High Priority', color: 'text-rose-500' };
            case 'medium': return { label: isIndo ? 'Sedang' : 'Medium', color: 'text-amber-500' };
            default: return { label: isIndo ? 'Santai' : 'Normal', color: 'text-slate-400' };
        }
    };

    // Filter assignments
    const filteredAssignments = assignments.filter(a => {
        if (filterCourse !== 'all' && a.course_name !== filterCourse) return false;
        if (filterType !== 'all' && a.type !== filterType) return false;
        return true;
    });

    const kanbanColumns: { id: AssignmentStatus; label: string; count: number; color: string }[] = [
        {
            id: 'todo',
            label: isIndo ? 'Belum Mulai' : 'To Do',
            count: filteredAssignments.filter(a => a.status === 'todo').length,
            color: 'border-t-slate-400'
        },
        {
            id: 'in_progress',
            label: isIndo ? 'Sedang Dikerjakan' : 'In Progress',
            count: filteredAssignments.filter(a => a.status === 'in_progress').length,
            color: 'border-t-indigo-500'
        },
        {
            id: 'due_soon',
            label: isIndo ? 'Mendekati Deadline (H-3)' : 'Due Soon',
            count: filteredAssignments.filter(a => a.status === 'due_soon').length,
            color: 'border-t-amber-500'
        },
        {
            id: 'completed',
            label: isIndo ? 'Selesai & Dinilai' : 'Completed',
            count: filteredAssignments.filter(a => a.status === 'completed').length,
            color: 'border-t-emerald-500'
        }
    ];

    return (
        <div className="space-y-6">
            
            {/* Action Bar & Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                
                <div className="flex items-center gap-3 flex-wrap">
                    {/* View Switcher */}
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setViewMode('kanban')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                viewMode === 'kanban'
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                            }`}
                        >
                            <LayoutGrid size={14} />
                            <span>Kanban</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                            }`}
                        >
                            <List size={14} />
                            <span>{isIndo ? 'Daftar' : 'List'}</span>
                        </button>
                    </div>

                    {/* Filter Course */}
                    <select
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                    >
                        <option value="all">{isIndo ? 'Semua Matakuliah' : 'All Courses'}</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.course_name}>{c.course_name}</option>
                        ))}
                    </select>

                    {/* Filter Type */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                    >
                        <option value="all">{isIndo ? 'Semua Tipe' : 'All Types'}</option>
                        <option value="assignment">{isIndo ? 'Tugas Kuliah' : 'Assignment'}</option>
                        <option value="quiz">{isIndo ? 'Kuis' : 'Quiz'}</option>
                        <option value="uts">UTS (Midterm)</option>
                        <option value="uas">UAS (Final)</option>
                        <option value="project">{isIndo ? 'Proyek / Paper' : 'Project / Paper'}</option>
                    </select>
                </div>

                {/* Add Assignment Button */}
                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wide shadow-lg shadow-indigo-500/20 active:scale-95 transition"
                >
                    <Plus size={15} />
                    <span>{isIndo ? 'Tambah Deadline' : 'Add Assignment'}</span>
                </button>

            </div>

            {/* View Mode: Kanban */}
            {viewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {kanbanColumns.map((col) => {
                        const items = filteredAssignments.filter(a => a.status === col.id);

                        return (
                            <div 
                                key={col.id}
                                className={`flex flex-col bg-slate-100/70 dark:bg-slate-900/60 rounded-[2rem] p-4 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${col.color}`}
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        {col.label}
                                    </h4>
                                    <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400">
                                        {items.length}
                                    </span>
                                </div>

                                {/* Items Container */}
                                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1 custom-scrollbar">
                                    {items.length === 0 ? (
                                        <div className="py-10 text-center text-slate-400 text-xs font-semibold">
                                            {isIndo ? 'Kosong' : 'No items'}
                                        </div>
                                    ) : (
                                        items.map((item) => {
                                            const countdown = getDeadlineBadge(item.due_date);
                                            const priority = getPriorityBadge(item.priority);

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3 group"
                                                >
                                                    {/* Course & Type Badges */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 truncate max-w-[130px]">
                                                            {item.course_name}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getTypeBadgeColor(item.type)}`}>
                                                            {getTypeLabel(item.type)}
                                                        </span>
                                                    </div>

                                                    {/* Title & Description */}
                                                    <div>
                                                        <h5 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                                                            {item.title}
                                                        </h5>
                                                        {item.description && (
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Due Date & Countdown */}
                                                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
                                                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                                                            <Calendar size={12} />
                                                            <span>{item.due_date}</span>
                                                        </div>
                                                        {countdown && (
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${countdown.color}`}>
                                                                {countdown.label}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Quick Move Status Actions */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => handleUpdateStatus(item.id, e.target.value as AssignmentStatus)}
                                                            className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 border-none outline-none cursor-pointer"
                                                        >
                                                            <option value="todo">{isIndo ? 'Belum' : 'To Do'}</option>
                                                            <option value="in_progress">{isIndo ? 'Progress' : 'Doing'}</option>
                                                            <option value="due_soon">{isIndo ? 'H-3' : 'Due Soon'}</option>
                                                            <option value="completed">{isIndo ? 'Selesai' : 'Done'}</option>
                                                        </select>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteAssignment(item.id)}
                                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded transition"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>

                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* View Mode: List */
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredAssignments.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 font-semibold">
                                {isIndo ? 'Tidak ada deadline ditemukan.' : 'No assignments found.'}
                            </div>
                        ) : (
                            filteredAssignments.map((item) => {
                                const countdown = getDeadlineBadge(item.due_date);
                                const isDone = item.status === 'completed';

                                return (
                                    <div
                                        key={item.id}
                                        className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                                            isDone ? 'opacity-60 bg-slate-50/30 dark:bg-slate-950/30' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Status check toggle */}
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateStatus(item.id, isDone ? 'todo' : 'completed')}
                                                className={`mt-1 w-6 h-6 rounded-xl flex items-center justify-center border transition ${
                                                    isDone 
                                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                                                }`}
                                            >
                                                {isDone && <Check size={14} />}
                                            </button>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                                                        {item.course_name}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getTypeBadgeColor(item.type)}`}>
                                                        {getTypeLabel(item.type)}
                                                    </span>
                                                    {countdown && (
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${countdown.color}`}>
                                                            {countdown.label}
                                                        </span>
                                                    )}
                                                </div>

                                                <h5 className={`text-sm font-black text-slate-900 dark:text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                                                    {item.title}
                                                </h5>

                                                {item.description && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 self-end sm:self-center">
                                            <div className="text-right text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <span className="block text-[10px] uppercase text-slate-400">{isIndo ? 'Batas Waktu' : 'Due Date'}</span>
                                                <span>{item.due_date}</span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAssignment(item.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Add Assignment Modal */}
            {isAddModalOpen && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                {isIndo ? 'Tambah Deadline & Tugas Baru' : 'Add New Assignment / Exam'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                {isIndo ? 'Jadwalkan tugas atau ujian agar radar countdown selalu update.' : 'Keep track of upcoming deadlines with live countdown.'}
                            </p>

                            <form onSubmit={handleCreateAssignment} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        {isIndo ? 'Judul Tugas / Ujian' : 'Title'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder={isIndo ? 'Contoh: Laporan Akhir Praktikum' : 'e.g. Final Project Report'}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>

                                {/* Course & Type */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {terms.course || (isIndo ? 'Matakuliah' : 'Course')}
                                        </label>
                                        <select
                                            value={formData.course_name}
                                            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                                            className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        >
                                            {courses.map(c => (
                                                <option key={c.id} value={c.course_name}>{c.course_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Tipe' : 'Type'}
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as AssignmentType })}
                                            className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        >
                                            <option value="assignment">{isIndo ? 'Tugas Kuliah' : 'Assignment'}</option>
                                            <option value="quiz">{isIndo ? 'Kuis' : 'Quiz'}</option>
                                            <option value="uts">UTS (Midterm)</option>
                                            <option value="uas">UAS (Final)</option>
                                            <option value="project">{isIndo ? 'Proyek / Paper' : 'Project / Paper'}</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Due Date & Priority */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Tanggal Deadline' : 'Due Date'}
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.due_date}
                                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Prioritas' : 'Priority'}
                                        </label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
                                            className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        >
                                            <option value="urgent">{isIndo ? 'Tinggi / Mendesak' : 'High / Urgent'}</option>
                                            <option value="medium">{isIndo ? 'Sedang' : 'Medium'}</option>
                                            <option value="normal">{isIndo ? 'Santai / Normal' : 'Normal'}</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        {isIndo ? 'Keterangan Singkat (Opsional)' : 'Description (Optional)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder={isIndo ? 'Petunjuk pengerjaan, format PDF, link repo...' : 'Guidelines, file format, repo link...'}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none resize-none"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    >
                                        {isIndo ? 'Batal' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wide shadow-lg shadow-indigo-500/20 active:scale-95 transition"
                                    >
                                        {isIndo ? 'Simpan Deadline' : 'Save Assignment'}
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </ModalPortal>
            )}

        </div>
    );
}
