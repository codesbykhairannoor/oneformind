'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
    X, Save, GraduationCap, 
    Brain, Target, Loader2,
    BookOpen, FileText, Upload
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';

interface EditMaterialModalProps {
    show: boolean;
    material?: Record<string, any> | null;
    userSettings?: Record<string, any>;
    onClose: () => void;
    onSave: (updatedMaterial: Record<string, any>) => void;
}

export default function EditMaterialModal({
    show,
    material = null,
    userSettings = {},
    onClose,
    onSave
}: EditMaterialModalProps) {
    const t = useTranslations();

    const [courseName, setCourseName] = useState('');
    const [week, setWeek] = useState('');
    const [grade, setGrade] = useState('');
    const [contextLink, setContextLink] = useState('');
    const [contextLinkName, setContextLinkName] = useState('');
    const [contextText, setContextText] = useState('');
    const [artifactLink, setArtifactLink] = useState('');
    const [artifactLinkName, setArtifactLinkName] = useState('');
    const [artifactText, setArtifactText] = useState('');
    const [careerTarget, setCareerTarget] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (material) {
            setCourseName(material.course_name || '');
            setWeek(material.week || '');
            setGrade(material.grade !== undefined ? String(material.grade) : '');
            
            const ctx = material.context_data || {};
            setContextLink(typeof ctx === 'string' ? '' : (ctx.link || ''));
            setContextLinkName(typeof ctx === 'string' ? '' : (ctx.link_name || ''));
            setContextText(typeof ctx === 'string' ? '' : (ctx.text || ''));

            const art = material.artifact_data || {};
            setArtifactLink(typeof art === 'string' ? '' : (art.link || ''));
            setArtifactLinkName(typeof art === 'string' ? '' : (art.link_name || ''));
            setArtifactText(typeof art === 'string' ? '' : (art.text || ''));

            setCareerTarget(userSettings?.career_target || '');
        }
    }, [material, userSettings]);

    if (!show || !material) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const updated = {
            ...material,
            course_name: courseName,
            week: week,
            grade: grade ? Number(grade) : null,
            context_data: {
                link: contextLink,
                link_name: contextLinkName,
                text: contextText
            },
            artifact_data: {
                link: artifactLink,
                link_name: artifactLinkName,
                text: artifactText
            }
        };

        setTimeout(() => {
            onSave(updated);
            setIsSaving(false);
            onClose();
        }, 500);
    };

    return (
        // 1:1 from EditMaterialModal.vue line 144-371
        <ModalPortal><div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                {t('study_edit_material') || 'Edit Coursework & Intelligence'}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 tracking-widest">{material.course_name} • IPoW Edit Mode</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {/* Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                        <div className="md:col-span-6">
                            <label className="block text-[10px] font-black tracking-widest text-slate-400 mb-2">{t('study_course_name') || 'Nama Matkul / Modul'}</label>
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 transition outline-none"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-[10px] font-black tracking-widest text-slate-400 mb-2">{t('study_week') || 'Minggu / Topik'}</label>
                            <input
                                type="text"
                                value={week}
                                onChange={(e) => setWeek(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 transition outline-none"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-[10px] font-black tracking-widest text-slate-400 mb-2">{t('study_grade') || 'Nilai'}</label>
                            <input
                                type="number"
                                step="0.01"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full px-5 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 transition outline-none"
                            />
                        </div>
                    </div>

                    {/* Two Panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Context Panel */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-blue-100/60 dark:border-blue-900/30 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <span className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400">Context Evidence</span>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <div>
                                    <label className="block text-[10px] font-black tracking-widest text-slate-400 mb-2">Reference Link</label>
                                    <input
                                        type="url"
                                        value={contextLink}
                                        onChange={(e) => setContextLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-white outline-none mb-3"
                                    />
                                    <input
                                        type="text"
                                        value={contextLinkName}
                                        onChange={(e) => setContextLinkName(e.target.value)}
                                        placeholder="Nama Tautan Konteks"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-white outline-none"
                                    />
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="block text-[10px] font-black tracking-widest text-slate-400 mb-2">Notes / Context Text</label>
                                    <textarea
                                        value={contextText}
                                        onChange={(e) => setContextText(e.target.value)}
                                        rows={4}
                                        placeholder="Tulis detail konteks silabus/modul..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition focus:ring-1 focus:ring-blue-500 resize-none text-slate-800 dark:text-white outline-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Artifact Panel */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-emerald-100/60 dark:border-emerald-900/30 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
                                <FileText className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-400">Artifact Deliverables</span>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <div>
                                    <label className="block text-[10px] font-black tracking-widest text-slate-400 mb-2">Deliverable Link</label>
                                    <input
                                        type="url"
                                        value={artifactLink}
                                        onChange={(e) => setArtifactLink(e.target.value)}
                                        placeholder="https://github.com/..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white outline-none mb-3"
                                    />
                                    <input
                                        type="text"
                                        value={artifactLinkName}
                                        onChange={(e) => setArtifactLinkName(e.target.value)}
                                        placeholder="Nama Tautan Artefak"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white outline-none"
                                    />
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="block text-[10px] font-black tracking-widest text-slate-400 mb-2">Notes / Artifact Text</label>
                                    <textarea
                                        value={artifactText}
                                        onChange={(e) => setArtifactText(e.target.value)}
                                        rows={4}
                                        placeholder="Tulis detail hasil karya / laporan tugas..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition focus:ring-1 focus:ring-emerald-500 resize-none text-slate-800 dark:text-white outline-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-4 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition tracking-widest"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3 group"
                    >
                        {isSaving ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        )}
                        <span>SAVE AUDIT DATA</span>
                    </button>
                </div>
            </div>
        </div></ModalPortal>
    );
}
