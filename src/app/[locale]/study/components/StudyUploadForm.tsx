'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { 
    Sparkles, Loader2, Link2, BookOpen, FileText,
    Upload, X, File, AlertTriangle
} from 'lucide-react';
import { StudyMaterial } from './StudyMaterialList';

interface StudyUploadFormProps {
    materials: StudyMaterial[];
    settings?: Record<string, any>;
    onClose: () => void;
    onAddMaterial?: (newMaterial: StudyMaterial) => void;
}

export default function StudyUploadForm({
    materials,
    settings = {},
    onClose,
    onAddMaterial
}: StudyUploadFormProps) {
    const t = useTranslations();

    const [courseName, setCourseName] = useState('');
    const [week, setWeek] = useState('');
    const [grade, setGrade] = useState('');

    const [contextLink, setContextLink] = useState('');
    const [contextLinkName, setContextLinkName] = useState('');
    const [contextText, setContextText] = useState('');
    const [contextFiles, setContextFiles] = useState<File[]>([]);

    const [artifactLink, setArtifactLink] = useState('');
    const [artifactLinkName, setArtifactLinkName] = useState('');
    const [artifactText, setArtifactText] = useState('');
    const [artifactFiles, setArtifactFiles] = useState<File[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const contextFileInputRef = useRef<HTMLInputElement>(null);
    const artifactFileInputRef = useRef<HTMLInputElement>(null);

    const isLimitReached = materials.length >= 6;

    const handleFileSelect = (type: 'context' | 'artifact', files: FileList | null) => {
        if (!files) return;
        const arr = Array.from(files);
        if (type === 'context') {
            setContextFiles(prev => [...prev, ...arr]);
        } else {
            setArtifactFiles(prev => [...prev, ...arr]);
        }
    };

    const removeFile = (type: 'context' | 'artifact', index: number) => {
        if (type === 'context') {
            setContextFiles(prev => prev.filter((_, i) => i !== index));
        } else {
            setArtifactFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!courseName.trim()) {
            alert(t('study_course_name_required_alert') || 'Nama Mata Kuliah / Modul wajib diisi.');
            return;
        }

        if (isLimitReached) {
            alert(t('study_upload_limit_reached_alert') || 'Batas maksimum 6 kartu coursework tercapai.');
            return;
        }

        setIsSubmitting(true);

        const newMaterial: StudyMaterial = {
            id: 'mat_' + Date.now(),
            course_name: courseName,
            week: week || undefined,
            grade: grade ? Number(grade) : undefined,
            status: 'completed',
            metadata: {
                field_of_study: 'Software Engineering',
                competencies: {
                    'System Architecture': 90,
                    'Code Quality': 88,
                    'Problem Solving': 92
                }
            },
            context_data: {
                link: contextLink,
                link_name: contextLinkName,
                text: contextText,
                files: contextFiles.map(f => ({ name: f.name }))
            },
            artifact_data: {
                link: artifactLink,
                link_name: artifactLinkName,
                text: artifactText,
                files: artifactFiles.map(f => ({ name: f.name }))
            }
        };

        setTimeout(() => {
            if (onAddMaterial) {
                onAddMaterial(newMaterial);
            }
            setIsSubmitting(false);
            onClose();
        }, 600);
    };

    return (
        // 1:1 from StudyUploadForm.vue line 205-565
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Global Meta Header (Course Name, Week, Grade) */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">📚</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {t('study_global_meta_title') || 'Informasi Utama Coursework'}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-6">
                        <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-2">
                            {t('study_course_name') || 'Nama Mata Kuliah / Modul'} *
                        </label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="Cth: Algoritma & Struktur Data"
                            required
                            className="w-full px-5 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-2">
                            {t('study_week') || 'Minggu / Topik'}
                        </label>
                        <input
                            type="text"
                            value={week}
                            onChange={(e) => setWeek(e.target.value)}
                            placeholder="Minggu 04"
                            className="w-full px-5 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-2">
                            {t('study_grade') || 'Nilai (0-100)'}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="95"
                            className="w-full px-5 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Two Column Layout: Context Panel & Artifact Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Context Evidence Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-blue-100 dark:border-blue-900/40 overflow-hidden flex flex-col p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-blue-50 dark:border-blue-900/30">
                        <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-base font-black text-slate-900 dark:text-white">
                                {t('study_context_title') || 'Context Evidence'}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold">Silabus • Lembar Soal • Modul PDF</p>
                        </div>
                    </div>

                    {/* File Dropzone */}
                    <div>
                        <input
                            ref={contextFileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.docx,.pptx"
                            className="hidden"
                            onChange={(e) => handleFileSelect('context', e.target.files)}
                        />
                        <div
                            onClick={() => contextFileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center cursor-pointer hover:border-blue-400 transition bg-slate-50/50 dark:bg-slate-950/30"
                        >
                            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {t('study_drop_files_click') || 'Upload PDF / Silabus Konteks'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">Maksimal 10MB per berkas (.pdf, .docx, .pptx)</p>
                        </div>

                        {contextFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {contextFiles.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate flex items-center gap-2">
                                            <File className="h-4 w-4 text-blue-500" /> {f.name}
                                        </span>
                                        <button type="button" onClick={() => removeFile('context', i)} className="text-rose-500 p-1 hover:bg-rose-50 rounded-xl">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* URL Link */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black tracking-widest text-slate-400">
                            {t('study_context_link') || 'Tautan Link Konteks'}
                        </label>
                        <input
                            type="url"
                            value={contextLink}
                            onChange={(e) => setContextLink(e.target.value)}
                            placeholder="https://silabus-drive.google.com/..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-white outline-none"
                        />
                        <input
                            type="text"
                            value={contextLinkName}
                            onChange={(e) => setContextLinkName(e.target.value)}
                            placeholder="Nama Tautan Konteks"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-white outline-none"
                        />
                    </div>

                    {/* Rich Text Notes */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black tracking-widest text-slate-400">
                            {t('study_context_text_placeholder') || 'Tulis atau tempel detail konteks...'}
                        </label>
                        <textarea
                            value={contextText}
                            onChange={(e) => setContextText(e.target.value)}
                            rows={4}
                            placeholder="Catatan tambahan mengenai silabus / instruksi tugas..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-blue-500 resize-none text-slate-800 dark:text-white outline-none"
                        ></textarea>
                    </div>
                </div>

                {/* Artifact Deliverables Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-emerald-100 dark:border-emerald-900/40 overflow-hidden flex flex-col p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-emerald-50 dark:border-emerald-900/30">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-base font-black text-slate-900 dark:text-white">
                                {t('study_artifact_title') || 'Artifact Deliverables'}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold">Laporan Tugas • Presentasi • Kode GitHub</p>
                        </div>
                    </div>

                    {/* File Dropzone */}
                    <div>
                        <input
                            ref={artifactFileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.docx,.pptx"
                            className="hidden"
                            onChange={(e) => handleFileSelect('artifact', e.target.files)}
                        />
                        <div
                            onClick={() => artifactFileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center cursor-pointer hover:border-emerald-400 transition bg-slate-50/50 dark:bg-slate-950/30"
                        >
                            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {t('study_drop_files_click') || 'Upload PDF Hasil Karya / Laporan'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">Maksimal 10MB per berkas (.pdf, .docx, .pptx)</p>
                        </div>

                        {artifactFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {artifactFiles.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate flex items-center gap-2">
                                            <File className="h-4 w-4 text-emerald-500" /> {f.name}
                                        </span>
                                        <button type="button" onClick={() => removeFile('artifact', i)} className="text-rose-500 p-1 hover:bg-rose-50 rounded-xl">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* URL Link */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black tracking-widest text-slate-400">
                            {t('study_artifact_link') || 'Tautan Link Artefak'}
                        </label>
                        <input
                            type="url"
                            value={artifactLink}
                            onChange={(e) => setArtifactLink(e.target.value)}
                            placeholder="https://github.com/my-repo..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white outline-none"
                        />
                        <input
                            type="text"
                            value={artifactLinkName}
                            onChange={(e) => setArtifactLinkName(e.target.value)}
                            placeholder="Nama Tautan Artefak"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white outline-none"
                        />
                    </div>

                    {/* Rich Text Notes */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black tracking-widest text-slate-400">
                            {t('study_artifact_text_placeholder') || 'Tulis atau tempel detail artefak...'}
                        </label>
                        <textarea
                            value={artifactText}
                            onChange={(e) => setArtifactText(e.target.value)}
                            rows={4}
                            placeholder="Rangkuman hasil karya, temuan utama, atau deskripsi proyek..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-emerald-500 resize-none text-slate-800 dark:text-white outline-none"
                        ></textarea>
                    </div>
                </div>

            </div>

            {/* Submit Action Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-4 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition tracking-widest"
                >
                    Batal
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting || isLimitReached}
                    className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Sparkles className="h-5 w-5" />
                    )}
                    <span>{isSubmitting ? (t('study_analyzing') || 'Sedang Menganalisis...') : (t('study_analyze_upload') || 'Analisis & Unggah')}</span>
                </button>
            </div>

        </form>
    );
}
