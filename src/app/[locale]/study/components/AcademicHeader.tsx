'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Trash2, Plus } from 'lucide-react';

interface AcademicHeaderProps {
    userSettings: Record<string, any>;
    terms: Record<string, string>;
    availableSemesters: number[];
    selectedSemester: number | string;
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
    onSelectSemester,
    onDeleteSpecificSemester,
    onAddSemesterClick,
    onAddCourseClick
}: AcademicHeaderProps) {
    const t = useTranslations();
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

    return (
        // 1:1 from AcademicHeader.vue line 37-104
        <header className="relative z-40 transition-all bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-500">
            <div className="w-full min-w-0 px-4 md:px-8 py-4">
                <div className="flex flex-col items-stretch justify-between gap-4 min-w-0 md:flex-row md:items-center">
                    
                    {/* Header Title */}
                    <div className="flex items-center gap-2 w-full min-w-0 md:w-auto md:max-w-[min(100%,22rem)]">
                        <p className="shrink-0 text-[13px] font-black tracking-wide text-slate-700 dark:text-slate-300 mr-2 pr-4">
                            {t('study_academic_binder_title') || 'Academic Binder'} &bull;{' '}
                            <span className="text-slate-400">{userSettings.major || terms.course || 'Akademik'}</span>
                        </p>
                    </div>

                    {/* Actions & Semester Switcher */}
                    <div className="flex min-w-0 flex-wrap items-center w-full gap-3 md:w-auto md:flex-nowrap md:justify-end">
                        
                        {/* Dynamic Semester Selector */}
                        <div className="relative min-w-0 flex-1 md:flex-none md:max-w-xs z-50" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-full min-w-0 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-4 pr-3 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all active:scale-95 outline-none"
                            >
                                <div className="flex min-w-0 flex-1 flex-col items-start leading-none text-left">
                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mb-0.5">{terms.semester || 'Semester'}</span>
                                    <span className="w-full truncate text-xs">{selectedSemester}</span>
                                </div>
                                <div className="p-1 bg-white dark:bg-slate-800 border shadow-sm rounded-lg border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                    <ChevronDown className="h-3 w-3 text-indigo-500" />
                                </div>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-2 z-[60] max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                                    {availableSemesters.map((sem) => (
                                        <div key={sem} className="relative group flex items-center w-full mb-1">
                                            <button
                                                type="button"
                                                onClick={() => { onSelectSemester(sem); setIsMenuOpen(false); }}
                                                className={`flex-1 text-left px-4 py-3 rounded-2xl text-[11px] font-black transition-all ${
                                                    Number(selectedSemester) === sem
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                                        : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                }`}
                                            >
                                                {terms.semester || 'Semester'} {sem}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); onDeleteSpecificSemester(sem); setIsMenuOpen(false); }}
                                                className="absolute right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all z-20"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="border-t border-slate-100 dark:border-slate-800 my-2 mx-2"></div>

                                    <button
                                        type="button"
                                        onClick={() => { onAddSemesterClick(); setIsMenuOpen(false); }}
                                        className="group flex w-full items-center px-4 py-3 rounded-2xl text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> {t('study_custom') || 'Custom'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Add Course Button */}
                        <button
                            type="button"
                            onClick={onAddCourseClick}
                            className="h-[46px] shrink-0 px-5 flex items-center gap-3 text-white rounded-xl font-bold hover:-translate-y-0.5 active:translate-y-0 shadow-lg transition-all duration-300 whitespace-nowrap bg-indigo-600 shadow-indigo-100 dark:shadow-indigo-900/40 hover:bg-indigo-700"
                        >
                            <div className="bg-white/20 rounded-lg p-0.5 flex items-center justify-center">
                                <Plus className="h-4 w-4" />
                            </div>
                            <span className="hidden md:inline text-xs tracking-wide font-black">
                                {t('study_add_course_btn') || 'Tambah'} {terms.course || 'Mata Kuliah'}
                            </span>
                        </button>

                    </div>
                </div>
            </div>
        </header>
    );
}
