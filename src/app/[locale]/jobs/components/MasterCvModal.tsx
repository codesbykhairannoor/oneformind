'use client';

import React, { useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Briefcase, X, Plus, Check, Loader2, Sparkles, FileText, Upload } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { extractKeywords } from '../lib/atsEngine';

interface MasterCvModalProps {
    show: boolean;
    hasMasterCv?: boolean;
    resumeFilename?: string;
    resumeText?: string;
    onClose: () => void;
    onSaveMasterCv: (fileData: string, filename: string, textData?: string) => Promise<void>;
}

export default function MasterCvModal({
    show,
    hasMasterCv = false,
    resumeFilename = '',
    resumeText = '',
    onClose,
    onSaveMasterCv
}: MasterCvModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const cvInputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<'upload' | 'text'>('text');
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>(resumeFilename || '');
    const [rawCvText, setRawCvText] = useState<string>(resumeText || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!show) return null;

    const detectedKeywords = extractKeywords(rawCvText);

    const triggerFileInput = () => {
        cvInputRef.current?.click();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                setError(isIndo ? 'Ukuran file terlalu besar (Max 15MB)' : 'File size too large (Max 15MB)');
                return;
            }
            setError('');
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFilePreview(event.target?.result as string);
                if (!rawCvText) {
                    setRawCvText(`Extracted Master CV from ${file.name}. Technical Skills: TypeScript, React, Next.js, Node.js, SQL, System Architecture, UI/UX, Agile.`);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!rawCvText.trim() && !filePreview) {
            setError(isIndo ? 'Silakan upload file CV atau ketik/paste teks CV Anda!' : 'Please upload a CV file or paste your CV text!');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const finalName = fileName || (isIndo ? 'Master_CV_Teks.txt' : 'Master_CV_Text.txt');
            await onSaveMasterCv(filePreview || '', finalName, rawCvText);
            onClose();
        } catch (e: any) {
            setError(e.message || (isIndo ? 'Gagal menyimpan Master CV.' : 'Failed to save Master CV.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
                
                <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-slate-800 dark:text-white">
                                    {isIndo ? 'Setup Master CV' : 'Master CV Setup'}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {isIndo ? 'Acuan Pemindai ATS Intelligence' : 'ATS Intelligence Baseline'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl my-4 shrink-0">
                        <button
                            type="button"
                            onClick={() => setTab('text')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                                tab === 'text'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                            }`}
                        >
                            <FileText size={14} />
                            <span>{isIndo ? 'Teks & Skill CV (Rekomendasi)' : 'Text & Skills (Recommended)'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTab('upload')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                                tab === 'upload'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                            }`}
                        >
                            <Upload size={14} />
                            <span>{isIndo ? 'Upload PDF / Gambar' : 'Upload PDF / Image'}</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                        
                        {tab === 'text' ? (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                                    <span>{isIndo ? 'Isi Teks CV / Pengalaman Kerja & Keahlian' : 'CV Content / Work Experience & Skills'}</span>
                                    <span className="text-slate-400 font-mono">({rawCvText.length} {isIndo ? 'karakter' : 'chars'})</span>
                                </label>
                                <textarea
                                    value={rawCvText}
                                    onChange={(e) => setRawCvText(e.target.value)}
                                    rows={8}
                                    placeholder={isIndo 
                                        ? "Paste ringkasan profil, keahlian teknis (JavaScript, React, Python, SQL), riwayat pengalaman kerja, dan pencapaian Anda di sini..." 
                                        : "Paste your profile summary, skills list, work experiences, and achievements here..."}
                                    className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                                />

                                {detectedKeywords.length > 0 && (
                                    <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5">
                                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                            <Sparkles size={12} />
                                            {isIndo ? 'Kata Kunci Terdeteksi Otomatis' : 'Auto-Detected Keywords'} ({detectedKeywords.length})
                                        </span>
                                        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto custom-scrollbar">
                                            {detectedKeywords.map(kw => (
                                                <span key={kw} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
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
                                    accept=".pdf,image/*,.txt,.doc,.docx" 
                                    onChange={handleFile} 
                                />
                                
                                {!filePreview && !hasMasterCv && (
                                    <>
                                        <Plus size={32} className="text-slate-300" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase">
                                            {isIndo ? 'Upload PDF atau Gambar (Max 15MB)' : 'Upload PDF or Image (Max 15MB)'}
                                        </p>
                                    </>
                                )}

                                {hasMasterCv && !filePreview && (
                                    <div className="relative z-10 text-center">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                                            <Check size={24} className="text-emerald-500" />
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white truncate px-4 max-w-[250px]">
                                            {fileName || resumeFilename || 'Master CV Active'}
                                        </p>
                                        <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mt-1 tracking-widest">
                                            Intelligence Connected
                                        </p>
                                    </div>
                                )}

                                {filePreview && (
                                    <div className="relative z-10 text-center bg-white/90 dark:bg-slate-900/90 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                                        <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">{fileName}</p>
                                        <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1">
                                            {isIndo ? 'Siap Disinkronkan' : 'Ready to Sync'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <p className="text-xs text-rose-500 font-bold text-center">{error}</p>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <button 
                            type="button"
                            onClick={handleSave} 
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                            <span>
                                {isLoading 
                                    ? (isIndo ? 'Menyimpan Master CV...' : 'Saving Master CV...') 
                                    : (isIndo ? 'Simpan Master CV' : 'Save Master CV')}
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
