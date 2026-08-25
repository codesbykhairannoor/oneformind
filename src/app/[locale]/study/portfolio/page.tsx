'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import StudyCompetencyRadar from '../components/StudyCompetencyRadar';
import StudyArchetypeMatches from '../components/StudyArchetypeMatches';
import StudyMaterialList, { StudyMaterial } from '../components/StudyMaterialList';
import StudyUploadForm from '../components/StudyUploadForm';
import { Sparkles, ArrowLeft, Copy, RefreshCw, CheckCircle2, Plus, X, ExternalLink, ShieldCheck, PenLine } from 'lucide-react';

export default function StudyPortfolioPage() {
    const t = useTranslations();
    const [username, setUsername] = useState('student_oneformind');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Initial Coursework Materials state
    const [materials, setMaterials] = useState<StudyMaterial[]>([
        {
            id: 1,
            course_name: 'Pemrograman Web & Next.js App Router',
            week: 'Minggu 08',
            grade: 96,
            status: 'completed',
            metadata: {
                field_of_study: 'Software Engineering',
                competencies: {
                    'System Architecture': 96,
                    'React & Next.js': 94,
                    'Web Performance': 90
                }
            },
            context_data: {
                link: 'https://nextjs.org/docs',
                link_name: 'Next.js Official Documentation',
                text: 'Silabus arsitektur aplikasi berbasis Next.js Server Components.'
            },
            artifact_data: {
                link: 'https://github.com/example/nextjs-architecture',
                link_name: 'GitHub Project Repository',
                text: 'Implementasi IPoW & App Router Next.js 16.'
            }
        },
        {
            id: 2,
            course_name: 'Algoritma & Struktur Data',
            week: 'Minggu 05',
            grade: 90,
            status: 'completed',
            metadata: {
                field_of_study: 'Computer Science',
                competencies: {
                    'Graph Theory': 90,
                    'Dijkstra Algorithm': 88,
                    'Dynamic Programming': 85
                }
            },
            context_data: {
                text: 'Modul praktikum graf & algoritma pencarian jalur terpendek.'
            },
            artifact_data: {
                text: 'Hasil analisis kompleksitas Big-O & kode C++ Dijkstra.'
            }
        }
    ]);

    const [publicUrl, setPublicUrl] = useState(`https://oneformind.app/p/${username}`);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setPublicUrl(`${window.location.origin}/p/${username}`);
        }
    }, [username]);

    const copyLink = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(publicUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const handleOptimisticDelete = (id: number | string) => {
        setMaterials(prev => prev.filter(m => m.id !== id));
    };

    const handleOptimisticUpdate = (updated: StudyMaterial) => {
        setMaterials(prev => prev.map(m => m.id === updated.id ? updated : m));
    };

    const handleAddMaterial = (newMaterial: StudyMaterial) => {
        setMaterials(prev => [newMaterial, ...prev]);
    };

    return (
        <AuthenticatedLayout>
            {/* 1:1 from Portfolio/Index.vue line 81-253 */}
            <div className="min-h-screen bg-white dark:bg-slate-950 pb-32 transition-colors overflow-x-hidden">
                {/* Ambient Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                {/* Sub Header */}
                <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 md:px-6 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-50">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link
                            href="/study"
                            className="group p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500 active:scale-90 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shrink-0"
                        >
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">
                                {t('study_neural_portfolio_title') || 'Neural Portfolio'}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-[9px] md:text-[10px] font-black text-indigo-500 tracking-[0.2em] md:tracking-[0.25em]">
                                    {t('study_portfolio_subtitle') || 'AI Competency Showcase'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-[10px] md:text-[11px] tracking-wider transition-all active:scale-95 disabled:opacity-50 border border-slate-200/50 dark:border-slate-700/50 shadow-sm group whitespace-nowrap"
                        >
                            <RefreshCw className={`h-4 w-4 shrink-0 ${isRefreshing ? 'animate-spin text-indigo-500' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            <span>{t('study_refresh_data') || 'Refresh Data'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] md:text-[11px] tracking-wider transition-all active:scale-95 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 border border-indigo-500/50 whitespace-nowrap"
                        >
                            <Plus className="h-4 w-4 shrink-0" />
                            <span>{t('study_new_analysis') || 'Input Card'}</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10">
                    
                    {/* URL Identity Banner */}
                    <div className="mb-8 md:mb-12 p-1 bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden group">
                        <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-[2.25rem] md:rounded-[3.25rem] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-start md:items-center gap-4 md:gap-8">
                                <div className="relative shrink-0 mt-2 md:mt-0">
                                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        <ShieldCheck className="h-8 w-8 md:h-10 md:w-10" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 h-6 w-6 md:h-8 md:w-8 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white">
                                        <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white mb-1.5 tracking-tight">
                                        {t('study_public_url') || 'Public Portfolio URL'}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold max-w-md leading-relaxed">
                                        {t('study_portfolio_url_desc') || 'Bagikan link portofolio akademikmu yang dapat diakses publik secara profesional.'}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full lg:w-auto lg:min-w-[320px]">
                                {isEditingUsername ? (
                                    <div className="bg-slate-100 dark:bg-slate-800/50 p-2 rounded-3xl md:rounded-[2rem] border border-slate-200 dark:border-slate-700/50">
                                        <form onSubmit={(e) => { e.preventDefault(); setIsEditingUsername(false); }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Username"
                                                required
                                                className="bg-white dark:bg-slate-900 sm:bg-transparent sm:dark:bg-transparent border border-slate-200 dark:border-slate-700 sm:border-none rounded-2xl text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 sm:focus:ring-0 w-full px-5 py-3 sm:py-0"
                                            />
                                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditingUsername(false)}
                                                    className="px-5 py-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px] tracking-widest transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] tracking-widest shadow-lg active:scale-95 transition-all"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 px-6 py-4 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 flex items-center justify-between gap-4 group/url">
                                            <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px] tracking-tight">
                                                {publicUrl}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditingUsername(true)}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 text-slate-500 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded-xl transition-all shadow-sm active:scale-90 border border-slate-100 dark:border-slate-600 font-bold text-[11px] tracking-wider"
                                                >
                                                    <PenLine className="h-3.5 w-3.5" />
                                                    Edit URL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={copyLink}
                                                    className="p-2.5 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm active:scale-90 border border-slate-100 dark:border-slate-600"
                                                >
                                                    {!copied ? <Copy className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                                </button>
                                            </div>
                                        </div>
                                        <a
                                            href={publicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[11px] tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
                                        >
                                            {t('study_visit_link') || 'Kunjungi Link'}
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="space-y-12">
                        {/* AI Analysis Grid (50/50) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <StudyCompetencyRadar />
                            <StudyArchetypeMatches />
                        </div>

                        {/* Materials List */}
                        <div>
                            <StudyMaterialList
                                materials={materials}
                                user={{ username }}
                                onOptimisticDelete={handleOptimisticDelete}
                                onOptimisticUpdate={handleOptimisticUpdate}
                            />
                        </div>
                    </div>

                </main>

                {/* Premium Upload Modal */}
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
                        <div className="relative w-full max-w-6xl max-h-full overflow-hidden bg-white dark:bg-slate-950 rounded-[4rem] shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95 duration-200">
                            <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 px-10 py-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 border border-indigo-500/50">
                                        <Sparkles className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                            {t('study_input_material') || 'Analyze New Coursework'}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-[0.3em]">
                                                {t('study_neural_analysis') || 'Neural Skill Mapping Engine'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsUploadModalOpen(false)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-3xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                    <X className="h-8 w-8" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                <div className="max-w-5xl mx-auto">
                                    <StudyUploadForm
                                        materials={materials}
                                        onClose={() => setIsUploadModalOpen(false)}
                                        onAddMaterial={handleAddMaterial}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
