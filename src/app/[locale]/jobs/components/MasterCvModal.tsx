'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Briefcase, X, Plus, Check, Loader2, Sparkles } from 'lucide-react';

interface MasterCvModalProps {
    show: boolean;
    hasMasterCv?: boolean;
    resumeFilename?: string;
    resumeText?: string;
    onClose: () => void;
    onSaveMasterCv: (fileData: string, filename: string) => Promise<void>;
}

export default function MasterCvModal({
    show,
    hasMasterCv = false,
    resumeFilename = '',
    resumeText = '',
    onClose,
    onSaveMasterCv
}: MasterCvModalProps) {
    const t = useTranslations();
    const cvInputRef = useRef<HTMLInputElement>(null);

    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>(resumeFilename || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!show) return null;

    const triggerFileInput = () => {
        cvInputRef.current?.click();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                setError('Ukuran file terlalu besar (Max 15MB)');
                return;
            }
            setError('');
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFilePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!filePreview) return;
        setIsLoading(true);
        setError('');
        try {
            await onSaveMasterCv(filePreview, fileName);
            onClose();
        } catch (e: any) {
            setError(e.message || 'Gagal menyimpan Master CV.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 1:1 from MasterCvModal.vue line 97-195
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                            <Briefcase size={20} />
                        </div>
                        <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                            {t('job_master_cv_setup') || 'Master CV Setup'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-all">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Dropzone / Status */}
                    <div 
                        onClick={triggerFileInput}
                        className={`relative h-48 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden ${
                            hasMasterCv && !filePreview 
                                ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-500/5' 
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-500'
                        }`}
                    >
                        <input 
                            type="file" 
                            ref={cvInputRef} 
                            className="hidden" 
                            accept=".pdf,image/*" 
                            onChange={handleFile} 
                        />
                        
                        {!filePreview && !hasMasterCv && (
                            <>
                                <Plus size={32} className="text-slate-300" />
                                <p className="text-[10px] font-black text-slate-500 uppercase">
                                    {t('job_master_cv_upload_label') || 'Upload PDF atau Gambar (Max 15MB)'}
                                </p>
                            </>
                        )}

                        {hasMasterCv && !filePreview && (
                            <div className="relative z-10 text-center">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                                    <Check size={28} className="text-emerald-500" />
                                </div>
                                <p className="text-xs font-black text-slate-800 dark:text-white truncate px-4 max-w-[250px]">
                                    {resumeFilename || 'Master CV Active'}
                                </p>
                                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mt-1 tracking-widest">
                                    Intelligence Connected
                                </p>
                            </div>
                        )}

                        {filePreview && (
                            <>
                                <div className="absolute inset-0 w-full h-full">
                                    {filePreview.startsWith('data:application/pdf') ? (
                                        <embed src={filePreview} type="application/pdf" className="w-full h-full opacity-40 pointer-events-none" />
                                    ) : (
                                        <img src={filePreview} alt="Preview" className="w-full h-full object-cover opacity-40" />
                                    )}
                                </div>
                                <div className="relative z-10 text-center bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                                    <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">{fileName}</p>
                                    <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1">
                                        Ready to Intelligence-Sync
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button 
                            type="button"
                            onClick={handleSave} 
                            disabled={isLoading || !filePreview}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                                filePreview ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <span>
                                    {isLoading 
                                        ? (t('job_master_cv_extracting') || 'Extracting Text Intelligence...') 
                                        : (hasMasterCv 
                                            ? (t('job_master_cv_update') || 'Replace / Update CV') 
                                            : (t('job_master_cv_save') || 'Save & Extract CV'))}
                                </span>
                            )}
                        </button>
                        
                        {error && (
                            <p className="text-[10px] text-rose-500 font-bold text-center uppercase">{error}</p>
                        )}

                        {/* Extracted Intelligence Text Preview */}
                        {hasMasterCv && !filePreview && resumeText && (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                                     <Sparkles size={10} /> Extracted Intelligence Preview
                                </p>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">
                                    {resumeText}
                                </div>
                            </div>
                        )}
                        
                        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-900/30">
                            <p className="text-[10px] text-slate-400 font-bold text-center italic leading-relaxed">
                                💡 {t('job_master_cv_storage_tip') || 'Storage Optimization: Large PDF files (MB) will be compressed by AI into pure text data (KB) for database efficiency & analysis speed.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
