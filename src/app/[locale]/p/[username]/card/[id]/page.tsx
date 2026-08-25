'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
    GraduationCap, BookOpen, Clock, FileText, 
    ExternalLink, ShieldCheck, ArrowLeft, CheckCircle2
} from 'lucide-react';

interface PublicCardPageProps {
    params: Promise<{
        locale: string;
        username: string;
        id: string;
    }>;
}

export default function PublicPortfolioCardPage({ params }: PublicCardPageProps) {
    const t = useTranslations();
    const resolvedParams = React.use(params);
    const username = resolvedParams.username || 'student';
    const id = resolvedParams.id;

    const material = {
        id: id,
        course_name: 'Pemrograman Web & Next.js App Router',
        week: 'Minggu 08',
        grade: 96,
        context_data: {
            link: 'https://nextjs.org/docs',
            link_name: 'Next.js Official Documentation',
            text: 'Silabus arsitektur aplikasi berbasis Next.js Server Components.'
        },
        artifact_data: {
            link: 'https://github.com/example/nextjs-architecture',
            link_name: 'GitHub Project Repository',
            text: 'Implementasi IPoW & App Router Next.js 16.'
        },
        competencies: {
            'System Architecture': 96,
            'React & Next.js': 94,
            'Web Performance': 90
        }
    };

    return (
        // 1:1 from PublicPortfolio/ShowCard.vue line 180-450
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white pb-32">
            
            {/* Header Navigation */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link
                        href={`/p/${username}`}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Portofolio @{username}</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-widest text-indigo-500">VERIFIED CARD</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200/80 dark:border-slate-800 p-8 md:p-12 shadow-2xl space-y-10">
                    
                    {/* Header Details */}
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black">
                                    {material.week}
                                </span>
                                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black">
                                    Nilai: {material.grade}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">{material.course_name}</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white">@{username}</p>
                                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Verifikasi Berhasil
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Context & Artifact Panels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Context */}
                        <div className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-4">
                            <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-2">
                                <BookOpen className="h-4 w-4" /> Context Evidence
                            </h3>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{material.context_data.text}</p>
                            {material.context_data.link && (
                                <a href={material.context_data.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-indigo-500 hover:underline">
                                    <ExternalLink className="h-3.5 w-3.5" /> {material.context_data.link_name}
                                </a>
                            )}
                        </div>

                        {/* Artifact */}
                        <div className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-4">
                            <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Artifact Deliverable
                            </h3>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{material.artifact_data.text}</p>
                            {material.artifact_data.link && (
                                <a href={material.artifact_data.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:underline">
                                    <ExternalLink className="h-3.5 w-3.5" /> {material.artifact_data.link_name}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Competency Badges */}
                    <div>
                        <h3 className="text-xs font-black tracking-widest text-slate-400 mb-4">VERIFIED COMPETENCIES</h3>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(material.competencies).map(([comp, score]) => (
                                <div key={comp} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400">
                                    <span>{comp}</span>
                                    <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-lg text-[10px]">{score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
