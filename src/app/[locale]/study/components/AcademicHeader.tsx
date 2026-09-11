'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { 
    ChevronDown, Trash2, Plus, BookOpen, 
    Calendar, Clock, BrainCircuit, Sparkles, 
    ExternalLink, Layers, CheckSquare, Bookmark
} from 'lucide-react';

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
    onAddCourseClick
}: AcademicHeaderProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        <header className="relative z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
                
                {/* Top Row: Title, Major, Semester Picker, Public Portfolio & Add Course */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Title & Major info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20">
                            🎓
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                    {t('study_academic_binder_title') || (isIndo ? 'Academic Command Center' : 'Academic Command Center')}
                                </h1>
                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
                                    {terms.semester || 'Semester'} {selectedSemester}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                                {userSettings.major || (isIndo ? 'Teknik Informatika / Software Engineering' : 'Software Engineering')}
                            </p>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap">
                        
                        {/* Semester Selector Dropdown */}
                        <div className="relative min-w-0" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition active:scale-95"
                            >
                                <span>{terms.semester || 'Semester'} {selectedSemester}</span>
                                <ChevronDown size={14} className="text-indigo-500" />
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
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition active:scale-95 border ${
                                activeTab === 'portfolio'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                                    : 'bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60'
                            }`}
                        >
                            <Sparkles size={14} />
                            <span>{isIndo ? 'Portofolio Bento' : 'Bento Portfolio'}</span>
                        </button>

                        {/* Add Course Button */}
                        <button
                            type="button"
                            onClick={onAddCourseClick}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition"
                        >
                            <Plus size={15} />
                            <span>{t('study_add_course_btn') || (isIndo ? 'Tambah Matakuliah' : 'Add Course')}</span>
                        </button>

                    </div>
                </div>

                {/* Bottom Row: 4 Main Views Switcher */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 custom-scrollbar border-t border-slate-100 dark:border-slate-800/80">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onSelectTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition active:scale-95 ${
                                    isActive
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

            </div>
        </header>
    );
}
