'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
    GraduationCap, BookOpen, Clock, BarChart3, 
    Sparkles, FileText, ExternalLink, ShieldCheck, 
    Briefcase, CheckCircle2, TrendingUp, Award
} from 'lucide-react';

interface PublicPortfolioPageProps {
    params: Promise<{
        locale: string;
        username: string;
    }>;
}

export default function PublicPortfolioShowPage({ params }: PublicPortfolioPageProps) {
    const t = useTranslations();
    const resolvedParams = React.use(params);
    const username = resolvedParams.username || 'student';

    const competencies: Record<string, number> = {
        'Software Architecture': 96,
        'React & Next.js': 94,
        'Web Performance': 90,
        'Graph Theory': 90,
        'Database Systems': 85
    };

    const archetypes: Record<string, number> = {
        'Fullstack Software Engineer': 95,
        'Frontend Technical Lead': 90,
        'Backend Architect': 86
    };

    const materials = [
        {
            id: 1,
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
            }
        },
        {
            id: 2,
            course_name: 'Algoritma & Struktur Data',
            week: 'Minggu 05',
            grade: 90,
            context_data: {
                text: 'Modul praktikum graf & algoritma pencarian jalur terpendek.'
            },
            artifact_data: {
                text: 'Hasil analisis kompleksitas Big-O & kode C++ Dijkstra.'
            }
        }
    ];

    return (
        // 1:1 from PublicPortfolio/Show.vue line 210-790
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white pb-32">
            
            {/* Top Navigation */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
                            O
                        </div>
                        <div>
                            <span className="text-base font-black text-slate-900 dark:text-white leading-none">Tranvas OS</span>
                            <p className="text-[10px] font-bold text-indigo-500 tracking-wider">VERIFIED PUBLIC PORTFOLIO</p>
                        </div>
                    </div>

                    <Link
                        href={`/study`}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wider transition shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        <span>Claim Your Portfolio</span>
                        <Sparkles className="h-4 w-4" />
                    </Link>
                </div>
            </header>

            {/* Profile Header Banner */}
            <section className="bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white pt-16 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="relative">
                        <div className="h-28 w-28 md:h-36 md:w-36 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-4xl md:text-5xl font-black border-4 border-white/20 shadow-2xl">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 border-4 border-indigo-950 flex items-center justify-center text-white">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black tracking-wider mb-4">
                            <ShieldCheck className="h-4 w-4" />
                            VERIFIED ACADEMIC IDENTITY
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">@{username}</h1>
                        <p className="text-indigo-200/80 text-sm md:text-base font-semibold max-w-xl leading-relaxed mb-6">
                            Verified Academic Competency Portfolio powered by Tranvas Neural Skill Mapping.
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold">
                            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-indigo-400" />
                                <span>Software Engineering Major</span>
                            </div>
                            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <Award className="h-4 w-4 text-emerald-400" />
                                <span>IPK 3.92 (High Distinction)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 space-y-12">
                
                {/* Competency Radar & Archetype Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Radar / Competencies */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <BarChart3 className="h-6 w-6 text-indigo-500" />
                            Competency Radar
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mb-8">Verified skill index based on coursework archives</p>

                        <div className="space-y-4">
                            {Object.entries(competencies).map(([label, score]) => (
                                <div key={label} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-black text-slate-700 dark:text-slate-300">
                                        <span>{label}</span>
                                        <span className="text-indigo-600 dark:text-indigo-400">{score}%</span>
                                    </div>
                                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Career Archetype Matches */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-purple-500" />
                            Career Archetype Predictions
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mb-8">Predicted by local ML classification engine</p>

                        <div className="space-y-6">
                            {Object.entries(archetypes).map(([archetype, score]) => (
                                <div key={archetype} className="space-y-2">
                                    <div className="flex justify-between text-sm font-black text-slate-800 dark:text-slate-200">
                                        <span>{archetype}</span>
                                        <span className="text-purple-600 dark:text-purple-400">{score}% Match</span>
                                    </div>
                                    <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" style={{ width: `${score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Verified Coursework Materials Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-emerald-500" />
                        Verified Coursework & Projects
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                        {materials.map((item) => (
                            <div key={item.id} className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
                                            {item.week}
                                        </span>
                                        <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                                            Nilai: {item.grade}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{item.course_name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.artifact_data?.text || item.context_data?.text}</p>
                                </div>

                                <Link
                                    href={`/p/${username}/card/${item.id}`}
                                    className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs tracking-wider hover:scale-105 transition shadow-lg shrink-0 flex items-center gap-2"
                                >
                                    <span>Detail Card</span>
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
