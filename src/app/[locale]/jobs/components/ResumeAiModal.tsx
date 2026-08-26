'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Sparkles, X, FileText, ArrowRight, Wand2, RefreshCw, Loader2, Award, Check } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { JobRowItem } from './JobTable';

interface ResumeAiModalProps {
    show: boolean;
    initialJobDescription?: string;
    jobTitle?: string;
    company?: string;
    hasMasterCv?: boolean;
    masterCvName?: string;
    onClose: () => void;
    onRunScan?: (jobDesc: string) => Promise<string>;
}

export default function ResumeAiModal({
    show,
    initialJobDescription = '',
    jobTitle = '',
    company = '',
    hasMasterCv = false,
    masterCvName = '',
    onClose,
    onRunScan
}: ResumeAiModalProps) {
    const [jobDescription, setJobDescription] = useState(initialJobDescription);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState('');

    if (!show) return null;

    const handleRunAnalysis = async () => {
        if (!hasMasterCv || !jobDescription.trim()) {
            setError('Harap atur Master CV terlebih dahulu dan masukkan deskripsi pekerjaan.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            if (onRunScan) {
                const res = await onRunScan(jobDescription);
                setAnalysisResult(res);
            } else {
                // Mock scanning result fallback
                setTimeout(() => {
                    setAnalysisResult(`### Match Score: 85%\n\nCV Anda memiliki keselarasan **85%** dengan posisi **${jobTitle || 'Pekerjaan ini'}** di **${company || 'Perusahaan'}**.\n\n- **Kelebihan**: Pengalaman relevan dan keterampilan teknis cocok.\n- **Saran**: Tambahkan beberapa keyword spesifik untuk meningkatkan skor ATS.`);
                    setIsLoading(false);
                }, 1200);
                return;
            }
        } catch (e: any) {
            setError(e.message || 'Gagal menganalisis CV. Coba lagi nanti.');
        } finally {
            setIsLoading(false);
        }
    };

    const coachMessage = encodeURIComponent(`Halo AI Coach, saya baru saja scan Master CV saya untuk posisi ${jobTitle} di ${company}. Berdasarkan scan, dapet hasil ini: ${analysisResult.slice(0, 100)}... Bisa bantu saya optimalkan CV atau simulasi interview?`);
    const coachLink = `/coach?initial_message=${coachMessage}`;

    return (
        // 1:1 from ResumeAiModal.vue line 66-139
        <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 " onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                
                {/* Header — 1:1 from ResumeAiModal.vue line 71-81 */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                            <Sparkles size={20} />
                        </div>
                        <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                            Neural Probability
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-all">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Body — 1:1 from ResumeAiModal.vue line 83-136 */}
                <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                    
                    {/* Master CV Status */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                <Check size={16} strokeWidth={3} />
                            </div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">
                                {masterCvName || (hasMasterCv ? 'Master CV Active' : 'Belum ada Master CV')}
                            </span>
                        </div>
                        {!hasMasterCv && (
                            <div className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
                                <X size={12} /> Perlu Setup
                            </div>
                        )}
                    </div>

                    {/* Job Description (Pre-filled/Editable) */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                            Deskripsi Pekerjaan / Title
                        </label>
                        <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full h-32 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 text-sm font-bold p-4 resize-none transition-all placeholder-slate-300 dark:placeholder-slate-700 text-slate-800 dark:text-white"
                            placeholder="Masukkan deskripsi kerja atau posisi..."
                        ></textarea>
                    </div>

                    <button 
                        type="button"
                        onClick={handleRunAnalysis}
                        disabled={isLoading || !hasMasterCv || !jobDescription.trim()}
                        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Sparkles size={16} strokeWidth={3} />
                        )}
                        <span>{isLoading ? 'Predicting Chance...' : 'Hitung Persentase Peluang'}</span>
                    </button>

                    {/* Result Card */}
                    {analysisResult && (
                        <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 space-y-6">
                            <div className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-h1:text-3xl prose-h1:text-indigo-600 dark:prose-h1:text-indigo-400 prose-h1:font-black prose-p:font-bold prose-p:text-slate-700 dark:prose-p:text-slate-300">
                                {analysisResult}
                            </div>
                            
                            <div className="h-px bg-indigo-100 dark:bg-indigo-500/20"></div>

                            <div className="flex flex-col gap-3">
                                <Link 
                                    href={coachLink} 
                                    className="w-full py-4 rounded-xl bg-indigo-600 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                                >
                                    <Award size={14} />
                                    Diskusi Detail dengan AI Coach
                                </Link>
                                <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-tighter">
                                    AI Coach akan memberimu simulasi interview & optimasi CV secara mendalam.
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-center text-rose-500 text-xs font-bold">{error}</p>
                    )}
                </div>

            </div>
        </div></ModalPortal>
    );
}
