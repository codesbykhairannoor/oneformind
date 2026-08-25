'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MoreVertical, Edit3, Trash2, FileText } from 'lucide-react';

export interface CourseRecord {
    id: number | string;
    course_name: string;
    semester: number;
    sks: number;
    grade?: string;
    archives?: any[];
}

interface CourseCardProps {
    record: CourseRecord;
    terms: Record<string, string>;
    onClick: (record: CourseRecord) => void;
    onEdit: (record: CourseRecord) => void;
    onDelete: (id: number | string) => void;
}

export default function CourseCard({
    record,
    terms,
    onClick,
    onEdit,
    onDelete
}: CourseCardProps) {
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
        // 1:1 from CourseCard.vue line 26-67
        <div
            onClick={() => onClick(record)}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden flex flex-col justify-between min-h-[180px]"
        >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-50 dark:bg-indigo-900/20 group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>

            <div className="relative z-20 flex justify-between items-start mb-6">
                <h5 className="text-base font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-8 leading-tight capitalize">
                    {record.course_name}
                </h5>

                {/* Action Menu */}
                <div
                    className="absolute right-0 top-0 translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30"
                    ref={menuRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors outline-none"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl outline-none overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                type="button"
                                onClick={() => { onEdit(record); setIsMenuOpen(false); }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Edit3 className="h-4 w-4" /> {t('study_edit') || 'Edit'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { onDelete(record.id); setIsMenuOpen(false); }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" /> {t('study_delete') || 'Hapus'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 flex justify-between items-end mt-auto">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide">
                        {terms.sks || 'SKS'}: <span className="text-slate-600 dark:text-slate-300">{record.sks}</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide">
                        {terms.grade || 'Nilai'}: <span className="text-emerald-600 dark:text-emerald-400 text-xs">{record.grade || '-'}</span>
                    </span>
                </div>
                <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-xl flex items-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText className="h-4 w-4" /> {record.archives?.length || 0}
                </div>
            </div>
        </div>
    );
}
