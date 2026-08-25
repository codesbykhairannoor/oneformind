'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, PlusCircle, FolderOpen, Calendar, Plus, Trash2, FileText, ExternalLink, Download, Loader2 } from 'lucide-react';
import { CourseRecord } from './CourseCard';

export interface ArchiveItem {
    id: number | string;
    academic_record_id?: number | string;
    file_name?: string;
    file_path?: string;
    link_url?: string;
    meeting_tag: string;
    type: 'Modul' | 'Soal' | 'Jawaban' | 'Referensi' | 'Catatan' | string;
}

interface ClassroomViewProps {
    course: CourseRecord;
    terms: Record<string, string>;
    onBack: () => void;
    onAddArchiveClick: (tag?: string) => void;
    onDeleteArchive: (id: number | string) => void;
}

export default function ClassroomView({
    course,
    terms,
    onBack,
    onAddArchiveClick,
    onDeleteArchive
}: ClassroomViewProps) {
    const t = useTranslations();

    // Group archives by meeting_tag
    const groupedArchives = useMemo(() => {
        if (!course || !course.archives) return {};
        const groups: Record<string, ArchiveItem[]> = {};
        course.archives.forEach((arc: ArchiveItem) => {
            const tag = arc.meeting_tag || 'Umum';
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push(arc);
        });
        return groups;
    }, [course]);

    const getTypeColor = (type: string) => {
        if (type === 'Modul') return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
        if (type === 'Soal') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        if (type === 'Jawaban') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
        return 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    };

    return (
        // 1:1 from ClassroomView.vue line 45-129
        <div>
            {/* Header Mode Kelas — 1:1 from ClassroomView.vue line 47-69 */}
            <header className="bg-indigo-600 dark:bg-indigo-900 px-4 sm:px-8 pt-8 pb-16 sm:pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="max-w-[1600px] w-full md:w-[95%] mx-auto relative z-10">
                    <button
                        type="button"
                        onClick={onBack}
                        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-bold transition-colors w-max"
                    >
                        <ArrowLeft className="h-4 w-4" /> {t('study_back') || 'Kembali'}
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-indigo-500/50 text-white text-[10px] font-black capitalize tracking-wide px-3 py-1 rounded-lg border border-white/20">
                                    {terms.semester || 'Semester'} {course.semester}
                                </span>
                                <span className="bg-white/10 text-indigo-100 text-[10px] font-bold px-3 py-1 rounded-lg">
                                    {course.sks} {terms.sks || 'SKS'}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2 max-w-4xl capitalize">
                                {course.course_name}
                            </h1>
                        </div>
                        <div className="shrink-0">
                            <button
                                type="button"
                                onClick={() => onAddArchiveClick('')}
                                className="px-6 py-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black shadow-xl transition-transform hover:scale-105 flex items-center gap-3"
                            >
                                <PlusCircle className="h-5 w-5" />
                                {t('study_input_meeting_new') || `Input ${terms.meeting || 'Pertemuan'} Baru`}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Meeting Blocks Grid — 1:1 from ClassroomView.vue line 72-128 */}
            <div className="max-w-[1600px] w-full md:w-[95%] mx-auto px-4 sm:px-8 -mt-8 sm:-mt-12 relative z-20 space-y-6 pb-20">
                {Object.keys(groupedArchives).length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="h-20 w-20 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <FolderOpen className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-700 dark:text-slate-200 mb-2">
                            {t('study_class_is_empty') || 'Kelas Ini Masih Kosong'}
                        </h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            {t('study_empty_class_desc') || `Belum ada berkas atau materi yang diunggah untuk ${terms.meeting || 'pertemuan'} ini.`}
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedArchives).map(([tag, archives]) => (
                        <div key={tag} className="bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                                <h4 className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-3 capitalize">
                                    <Calendar className="h-5 w-5 text-indigo-500" /> {tag}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => onAddArchiveClick(tag)}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
                                >
                                    <Plus className="h-3.5 w-3.5" /> {t('study_add_file') || 'Tambah Berkas'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {archives.map((arc) => (
                                    <div
                                        key={arc.id}
                                        className="group relative p-6 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col transition-all hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-6">
                                            <div className="flex-1 min-w-0">
                                                <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-black capitalize tracking-wider mb-3 shadow-sm border ${getTypeColor(arc.type)}`}>
                                                    {arc.type}
                                                </span>
                                                <p className="text-base font-black text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
                                                    {arc.file_name || arc.link_url || (t('study_untitled_archive') || 'Tanpa Judul')}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteArchive(arc.id)}
                                                className="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="mt-auto space-y-2">
                                            {/* Link External */}
                                            {arc.link_url && (
                                                <a
                                                    href={arc.link_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex justify-center items-center gap-2 px-3 py-3 text-[11px] font-black tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl transition-all active:scale-95 border border-blue-100 dark:border-blue-900/50"
                                                >
                                                    <ExternalLink className="h-4 w-4" /> {t('study_visit_link') || 'Buka Link'}
                                                </a>
                                            )}

                                            {/* File Actions */}
                                            {arc.file_path && arc.file_path !== 'pending' && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <a
                                                        href={arc.file_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex justify-center items-center gap-2 px-2 py-3 text-[11px] font-black tracking-wider text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-2xl transition-all active:scale-95 border border-indigo-100 dark:border-indigo-900/50"
                                                    >
                                                        <FileText className="h-4 w-4" /> {t('study_view_pdf') || 'Lihat'}
                                                    </a>
                                                    <a
                                                        href={arc.file_path}
                                                        download
                                                        className="flex justify-center items-center gap-2 px-2 py-3 text-[11px] font-black tracking-wider text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl transition-all active:scale-95 border border-emerald-100 dark:border-emerald-900/50"
                                                    >
                                                        <Download className="h-4 w-4" /> {t('study_download_pdf') || 'Unduh'}
                                                    </a>
                                                </div>
                                            )}

                                            {arc.file_path === 'pending' && (
                                                <span className="w-full flex justify-center items-center gap-2 px-3 py-3 text-[11px] font-black tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                                    <Loader2 className="h-4 w-4 animate-spin" /> {t('study_uploading') || 'Mengunggah...'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
