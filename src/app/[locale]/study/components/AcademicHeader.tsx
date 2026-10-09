'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { 
    ChevronDown, Trash2, Plus, BookOpen, 
    Calendar, Clock, BrainCircuit, Sparkles, 
    ExternalLink, Layers, CheckSquare, Bookmark, Download, Leaf, GraduationCap
} from 'lucide-react';
import ModuleHeader from '@/components/layout/ModuleHeader';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export type StudyActiveTab = 'courses' | 'assignments' | 'focus' | 'flashcards' | 'books' | 'portfolio';

interface AcademicHeaderProps {
    userSettings: Record<string, any>;
    terms: Record<string, string>;
    availableSemesters: number[];
    selectedSemester: number | string;
    activeTab: StudyActiveTab;
    onSelectTab: (tab: StudyActiveTab) => void;
    onSelectSemester: (sem: number) => void;
    onDeleteSpecificSemester: (sem: number | string) => void;
    onAddSemesterClick: () => void;
    onAddCourseClick: () => void;
    onOpenExportModal?: () => void;
}

export default function AcademicHeader({
    userSettings,
    terms,
    availableSemesters,
    selectedSemester,
    activeTab,
    onSelectTab,
    onSelectSemester,
    onDeleteSpecificSemester,
    onAddSemesterClick,
    onAddCourseClick,
    onOpenExportModal
}: AcademicHeaderProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cross-Module Life OS: Study Habit Consistency
    const { data: rawHabits } = useSWR('/api/habits', fetcher);
    const studyHabitStats = useMemo(() => {
        if (!rawHabits || !Array.isArray(rawHabits)) return null;
        const studyHabits = rawHabits.filter((h: any) => {
            const name = (h.name || '').toLowerCase();
            return name.includes('belajar') || name.includes('study') || name.includes('baca') || 
                   name.includes('read') || name.includes('kuliah') || name.includes('fokus') || 
                   name.includes('coding') || name.includes('matkul');
        });
        if (studyHabits.length === 0) return null;

        let totalTarget = 0;
        let totalCompleted = 0;
        studyHabits.forEach((h: any) => {
            const target = h.monthlyTarget || 30;
            const completed = (h.logs || []).filter((l: any) => l.status === 'completed').length;
            totalTarget += target;
            totalCompleted += completed;
        });

        const percent = totalTarget > 0 ? Math.min(100, Math.round((totalCompleted / totalTarget) * 100)) : 0;
        return {
            percent,
            completed: totalCompleted,
            target: totalTarget
        };
    }, [rawHabits]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const tabs: { id: StudyActiveTab; label: string; icon: React.ReactNode }[] = [
        {
            id: 'courses',
            label: isIndo ? 'Mata Kuliah' : 'Courses',
            icon: <BookOpen size={15} />
        },
        {
            id: 'assignments',
            label: isIndo ? 'Radar Deadline' : 'Assignments',
            icon: <CheckSquare size={15} />
        },
        {
            id: 'focus',
            label: isIndo ? 'Ruang Fokus' : 'Focus Room',
            icon: <Clock size={15} />
        },
        {
            id: 'flashcards',
            label: isIndo ? 'Flashcards' : 'Active Recall',
            icon: <BrainCircuit size={15} />
        },
        {
            id: 'books',
            label: isIndo ? 'Rak Bacaan & Buku' : 'Book Tracker',
            icon: <Bookmark size={15} />
        },
        {
            id: 'portfolio',
            label: isIndo ? 'Neural Portfolio' : 'Neural Portfolio',
            icon: <Sparkles size={15} />
        }
    ];

    return (
        <ModuleHeader
            icon={<GraduationCap size={18} strokeWidth={2.5} />}
            title={t('study_academic_binder_title') || (isIndo ? 'Academic Command Center' : 'Academic Command Center')}
            badge={
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-black border border-indigo-100/60 dark:border-indigo-800/40">
                        {terms.semester || 'Semester'} {selectedSemester}
                    </span>
                    {studyHabitStats && (
                        <span 
                            className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center gap-1"
                            title={isIndo ? 'Konsistensi kebiasaan belajar bulan ini' : 'Study habit consistency this month'}
                        >
                            <Leaf size={10} className="text-emerald-500" />
                            <span>Habit: {studyHabitStats.percent}% ({studyHabitStats.completed}/{studyHabitStats.target}d)</span>
                        </span>
                    )}
                </div>
            }
            subtitle={userSettings.major || (isIndo ? 'Teknik Informatika / Software Engineering' : 'Software Engineering')}
            actions={
                <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap sm:flex-wrap">
                    {/* Semester Selector Dropdown */}
                    <div className="relative min-w-0 shrink-0" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 px-2.5 sm:px-3.5 h-8 sm:h-10 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition active:scale-95 whitespace-nowrap"
                        >
                            <span>{terms.semester || 'Semester'} {selectedSemester}</span>
                            <ChevronDown size={12} className="text-indigo-500 sm:w-3.5 sm:h-3.5" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-52 origin-top-right bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[60] max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                                {availableSemesters.map((sem) => (
                                    <div key={sem} className="relative group flex items-center w-full mb-1">
                                        <button
                                            type="button"
                                            onClick={() => { onSelectSemester(sem); setIsMenuOpen(false); }}
                                            className={`flex-1 text-left px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                                                Number(selectedSemester) === sem
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            {terms.semester || 'Semester'} {sem}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onDeleteSpecificSemester(sem); setIsMenuOpen(false); }}
                                            className="absolute right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded-lg transition"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}

                                <div className="border-t border-slate-100 dark:border-slate-800 my-1.5"></div>

                                <button
                                    type="button"
                                    onClick={() => { onAddSemesterClick(); setIsMenuOpen(false); }}
                                    className="flex w-full items-center px-4 py-2.5 rounded-2xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                                >
                                    <Plus size={14} className="mr-1.5" />
                                    <span>{isIndo ? 'Semester Kustom' : 'Custom Term'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Portfolio Tab Trigger */}
                    <button
                        type="button"
                        onClick={() => onSelectTab('portfolio')}
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 h-8 sm:h-10 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition active:scale-95 border shrink-0 whitespace-nowrap ${
                            activeTab === 'portfolio'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                                : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-slate-200/80 dark:border-slate-800'
                        }`}
                    >
                        <Sparkles size={13} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">{isIndo ? 'Portofolio Bento' : 'Bento Portfolio'}</span>
                    </button>

                    {/* Export Button */}
                    {onOpenExportModal && (
                        <button
                            type="button"
                            onClick={onOpenExportModal}
                            title={isIndo ? 'Ekspor Data Akademik (CSV/JSON)' : 'Export Academic Data (CSV/JSON)'}
                            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 h-8 sm:h-10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold shadow-xs active:scale-95 transition shrink-0 whitespace-nowrap"
                        >
                            <Download size={13} className="text-slate-500 dark:text-slate-400 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">{isIndo ? 'Ekspor' : 'Export'}</span>
                        </button>
                    )}

                    {/* Add Course Button */}
                    <button
                        type="button"
                        onClick={onAddCourseClick}
                        className="flex items-center gap-1.5 px-3 sm:px-5 h-8 sm:h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition shrink-0 whitespace-nowrap"
                    >
                        <Plus size={15} strokeWidth={3} className="sm:w-4 sm:h-4" />
                        <span>{t('study_add_course_btn') || (isIndo ? 'Tambah Matakuliah' : 'Add Course')}</span>
                    </button>
                </div>
            }
        >
            {/* Bottom Row: Main Views Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1.5 no-scrollbar border-t border-slate-100 dark:border-slate-800/80">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onSelectTab(tab.id)}
                            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black whitespace-nowrap transition active:scale-95 [&>svg]:w-3.5 [&>svg]:h-3.5 ${
                                isActive
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </ModuleHeader>
    );
}
