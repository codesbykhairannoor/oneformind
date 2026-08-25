'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
    BookOpen, Clock, FileText, CheckCircle2, 
    XCircle, Trash2, AlertTriangle, Edit3, ExternalLink, Download,
    FileSearch, Link2, Loader2
} from 'lucide-react';
import EditMaterialModal from './EditMaterialModal';

export interface StudyMaterial {
    id: number | string;
    course_name: string;
    week?: string;
    grade?: number | string | null;
    status?: 'processing' | 'completed' | 'failed' | string;
    metadata?: {
        field_of_study?: string;
        competencies?: Record<string, number>;
    };
    context_data?: any;
    artifact_data?: any;
}

interface StudyMaterialListProps {
    materials: StudyMaterial[];
    user?: Record<string, any>;
    userSettings?: Record<string, any>;
    onOptimisticDelete: (id: number | string) => void;
    onOptimisticUpdate: (updated: StudyMaterial) => void;
}

export default function StudyMaterialList({
    materials,
    user,
    userSettings,
    onOptimisticDelete,
    onOptimisticUpdate
}: StudyMaterialListProps) {
    const t = useTranslations();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [materialToDeleteId, setMaterialToDeleteId] = useState<number | string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [materialToEdit, setMaterialToEdit] = useState<StudyMaterial | null>(null);
    const [copiedCardId, setCopiedCardId] = useState<number | string | null>(null);

    const openDeleteModal = (id: number | string) => {
        setMaterialToDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (materialToDeleteId) {
            onOptimisticDelete(materialToDeleteId);
            setShowDeleteModal(false);
            setMaterialToDeleteId(null);
        }
    };

    const openEditModal = (material: StudyMaterial) => {
        setMaterialToEdit(material);
        setShowEditModal(true);
    };

    const copyCardLink = (id: number | string) => {
        const username = user?.username || 'user';
        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${username}/card/${id}`;
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(url);
            setCopiedCardId(id);
            setTimeout(() => setCopiedCardId(null), 2000);
        }
    };

    const getMaterialSummary = (data: any) => {
        if (!data) return 'None';
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { return 'None'; }
        }
        const parts = [];
        if (data.files && data.files.length) parts.push(`${data.files.length} file(s)`);
        if (data.link) parts.push('1 link');
        if (data.text) parts.push('Notes');
        return parts.length ? parts.join(', ') : 'None';
    };

    const parseData = (data: any) => {
        if (!data) return {};
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch (e) { return {}; }
        }
        return data;
    };

    return (
        // 1:1 from StudyMaterialList.vue line 155-394
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 md:p-10 rounded-[3rem] border border-slate-200/50 dark:border-slate-800/80 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.05)] transition-all">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    {t('study_coursework_materials') || 'Coursework & Materials'}
                </h2>
                {materials.length > 0 && (
                    <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500">
                        {materials.length} / 6 {t('study_tab_cards') || 'Cards'}
                    </div>
                )}
            </div>

            {/* Empty State */}
            {materials.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex items-center justify-center text-5xl mb-6 mx-auto animate-bounce">
                        📚
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-2">
                        {t('study_no_coursework_materials') || 'Belum Ada Berkas Coursework'}
                    </h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto font-medium">
                        {t('study_empty_state') || 'Mulai analisis berkas tugas & silabus kuliah Anda untuk mengaktifkan AI Competency Framework.'}
                    </p>
                </div>
            ) : (
                /* Materials List */
                <div className="grid grid-cols-1 gap-6">
                    {materials.map((material) => {
                        const ctx = parseData(material.context_data);
                        const art = parseData(material.artifact_data);

                        return (
                            <div
                                key={material.id}
                                className="group p-6 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-900/40 rounded-[2.5rem] hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                    <div className="min-w-0 flex-1">
                                        
                                        {/* Badge Header */}
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            {material.metadata?.field_of_study && (
                                                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wider bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40">
                                                    {material.metadata.field_of_study}
                                                </span>
                                            )}

                                            {material.week && (
                                                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-[9px] text-slate-400 dark:text-slate-500 font-black tracking-wider flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" />
                                                    {material.week}
                                                </span>
                                            )}

                                            {material.grade !== null && material.grade !== undefined && (
                                                <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-black tracking-wider border border-emerald-100/50 dark:border-emerald-900/40">
                                                    {t('study_grade') || 'Nilai'}: {material.grade}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 dark:text-white truncate mb-4">
                                            {material.course_name}
                                        </h3>
                                        
                                        {/* Content Details */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Context Section */}
                                            {material.context_data && (
                                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-[9px] font-black tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded-md">
                                                            {t('study_context_badge') || 'Context'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">{getMaterialSummary(material.context_data)}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {ctx.link && (
                                                            <a href={ctx.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition">
                                                                <ExternalLink className="h-3.5 w-3.5" /> {ctx.link_name || ctx.link}
                                                            </a>
                                                        )}
                                                        {ctx.text && (
                                                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                                                                "{ctx.text}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Artifact Section */}
                                            {material.artifact_data && (
                                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-[9px] font-black tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-md">
                                                            {t('study_artifact_badge') || 'Artifact'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">{getMaterialSummary(material.artifact_data)}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {art.link && (
                                                            <a href={art.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition">
                                                                <ExternalLink className="h-3.5 w-3.5" /> {art.link_name || art.link}
                                                            </a>
                                                        )}
                                                        {art.text && (
                                                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                                                                "{art.text}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Competencies tags */}
                                        {material.metadata?.competencies && (
                                            <div className="flex flex-wrap gap-2 mt-6">
                                                {Object.entries(material.metadata.competencies).slice(0, 5).map(([comp]) => (
                                                    <span
                                                        key={comp}
                                                        className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-wider border border-slate-100 dark:border-slate-800 shadow-sm"
                                                    >
                                                        {comp}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Column */}
                                    <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-10 border-slate-100 dark:border-slate-900/60 min-w-[140px]">
                                        <div className="flex flex-col items-center gap-1">
                                            {material.status === 'processing' ? (
                                                <>
                                                    <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                                                    <span className="text-indigo-500 text-[10px] font-black tracking-widest">{t('study_processing') || 'PROCESSING'}</span>
                                                </>
                                            ) : material.status === 'completed' || !material.status ? (
                                                <>
                                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                    <span className="text-slate-400 text-[10px] font-black tracking-widest">{t('study_status_completed') || 'VERIFIED'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-6 w-6 text-red-500" />
                                                    <span className="text-red-500 text-[10px] font-black tracking-widest">{t('study_status_failed') || 'FAILED'}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => copyCardLink(material.id)}
                                                className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-2xl transition-all relative"
                                                title="Bagikan Kartu"
                                            >
                                                <Link2 className="h-5 w-5" />
                                                {copiedCardId === material.id && (
                                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] rounded-xl font-black shadow-xl whitespace-nowrap z-20">
                                                        Tersalin!
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openEditModal(material)}
                                                className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-2xl transition-all"
                                                title="Edit"
                                            >
                                                <Edit3 className="h-5 w-5" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(material.id)}
                                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <EditMaterialModal
                show={showEditModal}
                material={materialToEdit}
                userSettings={userSettings}
                onClose={() => setShowEditModal(false)}
                onSave={(updated) => {
                    onOptimisticUpdate(updated as StudyMaterial);
                }}
            />

            {showDeleteModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
                            <AlertTriangle className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                            {t('study_delete_confirm_title') || 'Hapus Berkas Coursework?'}
                        </h3>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                            {t('study_delete_confirm_desc') || 'Data ini akan dihapus dari repositori kompetensi dan tidak dapat dikembalikan.'}
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs tracking-widest transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-red-500/20 transition active:scale-95"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
