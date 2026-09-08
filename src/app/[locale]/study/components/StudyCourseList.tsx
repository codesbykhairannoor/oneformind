'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, FolderOpen, Trash2 } from 'lucide-react';
import CourseCard, { CourseRecord } from './CourseCard';

interface StudyCourseListProps {
    t: any;
    terms: any;
    selectedSemester: number;
    filteredCourses: CourseRecord[];
    onSelectCourse: (c: CourseRecord) => void;
    onEditCourse: (c: CourseRecord) => void;
    onDeleteCourse: (id: number | string) => void;
    onDeleteSemester: (sem: number | string) => void;
    onAddCourseClick: () => void;
}

export default function StudyCourseList({
    t,
    terms,
    selectedSemester,
    filteredCourses,
    onSelectCourse,
    onEditCourse,
    onDeleteCourse,
    onDeleteSemester,
    onAddCourseClick
}: StudyCourseListProps) {
    return (
        <div className="max-w-[1600px] w-full md:w-[95%] mx-auto px-4 sm:px-8 py-8">
            <Link
                href="/study/portfolio"
                className="group relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden rounded-2xl border border-slate-800 transition-all hover:border-indigo-500/50 shadow-lg mb-8 hover:-translate-y-0.5"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-500/30">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-white font-bold text-sm sm:text-base tracking-wide">
                        Neural Portfolio{' '}
                        <span className="hidden sm:inline text-slate-400 font-normal ml-2">
                            &mdash; {t('study_portfolio_banner_sub') || 'Statistik & AI Competency Framework'}
                        </span>
                    </h3>
                </div>
                <ChevronRight className="relative z-10 h-5 w-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-end justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 group/header">
                <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-slate-400" />
                    Daftar {terms.course} ({terms.semester} {selectedSemester})
                    
                    <button
                        type="button"
                        onClick={() => onDeleteSemester(selectedSemester)}
                        className="ml-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition-colors opacity-0 group-hover/header:opacity-100"
                        title={`Hapus ${terms.semester}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </h2>
            </div>

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((record) => (
                        <CourseCard
                            key={record.id}
                            record={record}
                            terms={terms}
                            onClick={onSelectCourse}
                            onEdit={onEditCourse}
                            onDelete={onDeleteCourse}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                    <div className="h-16 w-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FolderOpen className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-600 dark:text-slate-300 mb-1">
                        Belum Ada Data {terms.course}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Belum ada {terms.course} yang terdaftar pada {terms.semester} {selectedSemester}.
                    </p>
                    <button
                        type="button"
                        onClick={onAddCourseClick}
                        className="px-6 py-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 rounded-full font-bold transition-colors"
                    >
                        + Tambah {terms.course} Pertama
                    </button>
                </div>
            )}
        </div>
    );
}
