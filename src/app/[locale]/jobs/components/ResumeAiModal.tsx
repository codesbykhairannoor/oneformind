'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
    Sparkles, X, FileText, ArrowRight, Wand2, 
    RefreshCw, Loader2, Award, Check, AlertTriangle, 
    CheckCircle2, Target, Zap
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { runAtsScan, AtsScanResult } from '../lib/atsEngine';

interface ResumeAiModalProps {
    show: boolean;
    initialJobDescription?: string;
    jobTitle?: string;
    company?: string;
    hasMasterCv?: boolean;
    masterCvName?: string;
    masterCvText?: string;
    onClose: () => void;
}

export default function ResumeAiModal({
    show,
    initialJobDescription = '',
    jobTitle = '',
    company = '',
    hasMasterCv = false,
    masterCvName = '',
    masterCvText = '',
    onClose
}: ResumeAiModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [jobDescription, setJobDescription] = useState(initialJobDescription);
    const [isLoading, setIsLoading] = useState(false);
    const [scanResult, setScanResult] = useState<AtsScanResult | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setJobDescription(initialJobDescription || '');
        setScanResult(null);
        setError('');
    }, [initialJobDescription, show]);

    if (!show) return null;

    const handleRunAnalysis = () => {
        if (!hasMasterCv) {
            setError(isIndo ? 'Harap upload atau atur Master CV terlebih dahulu!' : 'Please set up your Master CV first!');
            return;
        }
        if (!jobDescription.trim()) {
            setError(isIndo ? 'Masukkan deskripsi pekerjaan atau kualifikasi posisi!' : 'Please enter the job description or qualification requirements!');
            return;
        }

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            try {
                const res = runAtsScan(masterCvText || masterCvName, jobDescription, isIndo);
                setScanResult(res);
            } catch (err: any) {
                setError(err?.message || (isIndo ? 'Gagal memproses ATS Scan' : 'Failed to process ATS Scan'));
            } finally {
                setIsLoading(false);
            }
        }, 600);
    };

    const coachMessage = encodeURIComponent(
        isIndo
            ? `Halo AI Coach, saya baru saja melakukan ATS Scan untuk posisi ${jobTitle || 'pekerjaan ini'} di ${company || 'perusahaan'}. Skor keselarasan saya ${scanResult?.matchScore || 80}%. Kata kunci yang kurang: ${scanResult?.missingKeywords.slice(0, 3).join(', ')}. Bisakah bantu saya merevisi bullet points CV dan latihan simulasi interview?`
            : `Hello AI Coach, I ran an ATS Match Scan for ${jobTitle} at ${company}. My score is ${scanResult?.matchScore}%. Missing keywords: ${scanResult?.missingKeywords.slice(0, 3).join(', ')}. Can you help optimize my CV and do an interview prep simulation?`
    );
    const coachLink = `/coach?initial_message=${coachMessage}`;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

                <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-slate-800 dark:text-white">
                                    {isIndo ? 'Pemindai Keselarasan ATS & Resume' : 'ATS Resume Match Engine'}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {company ? `${company} • ${jobTitle}` : (isIndo ? 'Kalkulasi Keselarasan Peluang' : 'Real Keyword Alignment')}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        
                        {/* Master CV Status Badge */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${hasMasterCv ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {hasMasterCv ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 block truncate">
                                        {masterCvName || (hasMasterCv ? 'Master CV Active' : (isIndo ? 'Belum Ada Master CV' : 'No Master CV'))}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {hasMasterCv 
                                            ? (isIndo ? 'Digunakan sebagai acuan scan kata kunci' : 'Used as base for ATS keyword extraction') 
                                            : (isIndo ? 'Buka tombol "Master CV" di pojok atas untuk setup' : 'Click "Master CV" on header to setup')}
                                    </span>
                                </div>
                            </div>

                            {!hasMasterCv && (
                                <span className="text-[10px] font-black text-rose-500 uppercase shrink-0">
                                    {isIndo ? 'Perlu Setup' : 'Needs Setup'}
                                </span>
                            )}
                        </div>

                        {/* Job Description Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                                <span>{isIndo ? 'Deskripsi Pekerjaan / Kualifikasi Kunci' : 'Job Description / Requirements'}</span>
                                <span className="text-slate-400 font-normal">({jobDescription.length} {isIndo ? 'karakter' : 'chars'})</span>
                            </label>
                            <textarea 
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={4}
                                className="w-full rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs font-medium p-4 resize-none transition text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder={isIndo 
                                    ? "Paste teks lowongan kerja, kualifikasi teknis, atau requirements dari LinkedIn / Jobstreet di sini..." 
                                    : "Paste job requirements, tech stacks, or qualifications from LinkedIn here..."}
                            />
                        </div>

                        {/* Scan Button */}
                        <button 
                            type="button"
                            onClick={handleRunAnalysis}
                            disabled={isLoading || !hasMasterCv || !jobDescription.trim()}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Zap size={16} />
                            )}
                            <span>{isLoading ? (isIndo ? 'Memindai Kata Kunci ATS...' : 'Scanning ATS Engine...') : (isIndo ? 'Kalkulasi Keselarasan ATS' : 'Calculate ATS Match Score')}</span>
                        </button>

                        {/* Scan Result Card */}
                        {scanResult && (
                            <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                                
                                {/* Score Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center shrink-0 shadow-sm">
                                            <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                                                {scanResult.matchScore}%
                                            </span>
                                            <span className="text-[9px] font-black uppercase text-indigo-400">
                                                {scanResult.matchGrade}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider block">
                                                {isIndo ? 'Hasil Evaluasi ATS' : 'ATS Evaluation Result'}
                                            </span>
                                            <h4 className="text-base font-black text-slate-800 dark:text-white">
                                                {isIndo ? scanResult.matchLabel.id : scanResult.matchLabel.en}
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {isIndo ? scanResult.summaryText.id : scanResult.summaryText.en}
                                </p>

                                {/* Keywords Breakdown */}
                                <div className="space-y-3">
                                    {/* Matched Keywords */}
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 size={12} />
                                            {isIndo ? 'Keahlian yang Sudah Cocok' : 'Matched Skills'} ({scanResult.matchedKeywords.length})
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {scanResult.matchedKeywords.map((kw) => (
                                                <span key={kw} className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                                    ✓ {kw}
                                                </span>
                                            ))}
                                            {scanResult.matchedKeywords.length === 0 && (
                                                <span className="text-xs text-slate-400 italic">{isIndo ? 'Belum ada kata kunci yang cocok' : 'No matched keywords'}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Missing Keywords */}
                                    {scanResult.missingKeywords.length > 0 && (
                                        <div className="space-y-1.5 pt-2">
                                            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                <AlertTriangle size={12} />
                                                {isIndo ? 'Peluang Kata Kunci yang Perlu Ditambahkan' : 'High-Impact Missing Keywords'} ({scanResult.missingKeywords.length})
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {scanResult.missingKeywords.map((kw) => (
                                                    <span key={kw} className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                                                        + {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actionable Tips */}
                                <div className="space-y-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/50">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                                        💡 {isIndo ? 'Rekomendasi Optimasi' : 'Optimization Recommendations'}
                                    </span>
                                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                        {scanResult.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-indigo-500 font-bold">•</span>
                                                <span>{isIndo ? rec.id : rec.en}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* AI Coach Bridge */}
                                <div className="pt-3">
                                    <Link
                                        href={coachLink}
                                        className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition"
                                    >
                                        <Award size={15} />
                                        <span>{isIndo ? 'Simulasi Interview & Revisi CV dengan AI Coach' : 'Interview Prep & CV Polish with AI Coach'}</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>

                            </div>
                        )}

                        {error && (
                            <p className="text-center text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
                                {error}
                            </p>
                        )}

                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
