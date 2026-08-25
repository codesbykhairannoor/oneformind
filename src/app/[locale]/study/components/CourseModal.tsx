'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { CourseRecord } from './CourseCard';

interface CourseModalProps {
    isOpen: boolean;
    isEdit?: boolean;
    course?: CourseRecord | null;
    terms: Record<string, string>;
    selectedSemester: number | string;
    onClose: () => void;
    onSubmit: (data: { course_name: string; sks: number; grade: string }) => void;
}

export default function CourseModal({
    isOpen,
    isEdit = false,
    course = null,
    terms,
    selectedSemester,
    onClose,
    onSubmit
}: CourseModalProps) {
    const t = useTranslations();
    const [courseName, setCourseName] = useState('');
    const [sks, setSks] = useState<number | string>(1);
    const [grade, setGrade] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (isEdit && course) {
                setCourseName(course.course_name || '');
                setSks(course.sks || 1);
                setGrade(course.grade || '');
            } else {
                setCourseName('');
                setSks(1);
                setGrade('');
            }
        }
    }, [isOpen, isEdit, course]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            course_name: courseName,
            sks: Number(sks) || 1,
            grade: grade
        });
    };

    return (
        // 1:1 from CourseModal.vue line 48-84
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">
                        {isEdit
                            ? `${t('study_edit') || 'Edit'} ${terms.course || 'Mata Kuliah'}`
                            : (t('study_add_new_data') || 'Tambah Data Baru')}
                    </h3>
                    <p className="text-xs font-bold text-indigo-500 tracking-wide mt-1">
                        {terms.semester || 'Semester'} {selectedSemester}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-1.5">
                            Nama {terms.course || 'Mata Kuliah'} *
                        </label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-1.5">
                                {terms.sks || 'SKS'} *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={sks}
                                onChange={(e) => setSks(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-1.5">
                                Target {terms.grade || 'Nilai'}
                            </label>
                            <input
                                type="text"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                placeholder="A / B+"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg transition-all mt-2"
                    >
                        {isEdit ? (t('study_save_changes') || 'Simpan Perubahan') : (t('study_save_data') || 'Simpan Data')}
                    </button>
                </form>
            </div>
        </div>
    );
}
