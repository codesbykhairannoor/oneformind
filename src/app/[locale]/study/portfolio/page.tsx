'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ModalPortal from '@/components/ModalPortal';
import { 
    Sparkles, ArrowLeft, Copy, RefreshCw, CheckCircle2, 
    Plus, X, ExternalLink, ShieldCheck, PenLine, 
    GraduationCap, Award, BookOpen, Mail, Globe, 
    Download, Code2, Terminal, FileText,
    Star, Trophy, Layers, Check, Share2
} from 'lucide-react';

const GithubIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const LinkedinIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

export interface FeaturedProject {
    id: string;
    title: string;
    description: string;
    tags: string[];
    demo_url?: string;
    github_url?: string;
    role: string;
    stars_or_metric?: string;
}

export interface AcademicHonor {
    id: string;
    title: string;
    issuer: string;
    year: string;
    type: 'competition' | 'publication' | 'certification';
    badge: string;
}

export interface CourseworkEvidence {
    id: string;
    course_name: string;
    grade: string;
    semester: string;
    highlight: string;
    artifact_link?: string;
}

export default function StudyPortfolioPage() {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [username, setUsername] = useState('khairan_noor');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isExportCvModalOpen, setIsExportCvModalOpen] = useState(false);

    // Profile state
    const [profile, setProfile] = useState({
        name: 'Khairan Noor',
        headline: isIndo 
            ? 'Software Engineer & Mahasiswa Teknik Informatika Berprestasi' 
            : 'Software Engineer & High-Distinction Computer Science Student',
        major: isIndo ? 'Teknik Informatika (Software Engineering)' : 'Computer Science & Software Engineering',
        ipk: '3.92',
        sks: '112',
        cumlaude: isIndo ? 'Summa Cum Laude Candidate' : 'Summa Cum Laude Candidate',
        bio: isIndo
            ? 'Fokus pada arsitektur sistem web skala tinggi (Next.js, Go, PostgreSQL), algoritma terdistribusi, dan riset publikasi terindeks SINTA.'
            : 'Focused on high-performance web systems (Next.js, Go, PostgreSQL), distributed algorithms, and SINTA-indexed academic research.',
        github: 'https://github.com/codesbykhairannoor',
        linkedin: 'https://linkedin.com',
        email: 'khairan@tranvas.app',
        website: 'https://tranvas.app'
    });

    // Featured Projects state
    const [projects, setProjects] = useState<FeaturedProject[]>([
        {
            id: '1',
            title: 'Tranvas OS - Next-Gen Productivity Suite',
            description: isIndo 
                ? 'Platform produktivitas modular all-in-one dengan arsitektur multi-tenant, Go backend, dan Next.js 16 App Router.' 
                : 'All-in-one modular productivity platform with multi-tenant architecture, Go backend, and Next.js 16 App Router.',
            tags: ['Next.js 16', 'TypeScript', 'Go', 'PostgreSQL', 'Tailwind CSS'],
            demo_url: 'https://tranvas.app',
            github_url: 'https://github.com/example/tranvas',
            role: 'Lead Architect',
            stars_or_metric: '< 45ms P99 Latency'
        },
        {
            id: '2',
            title: 'Neural Matrix Academic Engine',
            description: isIndo
                ? 'Sistem analisis kurikulum otomatis dan simulator IPK cerdas dengan integrasi Spaced Repetition Flashcards.'
                : 'Automated curriculum analysis and GPA simulator engine with Spaced Repetition active recall integration.',
            tags: ['React', 'Web Audio API', 'Canvas API', 'TypeScript'],
            demo_url: 'https://tranvas.app/study',
            github_url: 'https://github.com/example/academic-engine',
            role: 'Fullstack Creator',
            stars_or_metric: '100% Client-side Offline'
        }
    ]);

    // Academic Honors & Publications
    const [honors, setHonors] = useState<AcademicHonor[]>([
        {
            id: '1',
            title: isIndo ? 'Juara 1 Lomba Karya Tulis Ilmiah (LKTI) Nasional' : '1st Place National Scientific Paper Competition',
            issuer: isIndo ? 'Kementerian Pendidikan & Riset' : 'Ministry of Education & Tech',
            year: '2025',
            type: 'competition',
            badge: '🏆 1st Winner'
        },
        {
            id: '2',
            title: isIndo ? 'Publikasi Jurnal SINTA 2: Optimalisasi Query Graf' : 'SINTA 2 Journal Publication: Graph Query Optimization',
            issuer: 'Journal of Computer Science & Systems',
            year: '2025',
            type: 'publication',
            badge: '📄 SINTA 2'
        },
        {
            id: '3',
            title: isIndo ? 'Dean\'s List of Academic Excellence (4 Semesters)' : 'Dean\'s List of Academic Excellence (4 Semesters)',
            issuer: 'Fakultas Ilmu Komputer',
            year: '2024 - 2026',
            type: 'certification',
            badge: '✨ Honor Roll'
        }
    ]);

    // Coursework Proof Transcripts
    const [coursework, setCoursework] = useState<CourseworkEvidence[]>([
        {
            id: '1',
            course_name: isIndo ? 'Pemrograman Web & Sistem Terdistribusi' : 'Web Systems & Distributed Architecture',
            grade: 'A (4.00)',
            semester: 'Semester 5',
            highlight: isIndo ? 'Implementasi fullstack Server Components & Optimistic UI' : 'Fullstack Server Components & Optimistic UI architecture',
            artifact_link: 'https://github.com/example/web-systems'
        },
        {
            id: '2',
            course_name: isIndo ? 'Algoritma & Struktur Data Lanjut' : 'Advanced Algorithms & Data Structures',
            grade: 'A (4.00)',
            semester: 'Semester 4',
            highlight: isIndo ? 'Analisis kompleksitas Dijkstra, Bellman-Ford, dan Graf Segment Tree' : 'Complexity analysis of Dijkstra, Bellman-Ford & Segment Trees',
            artifact_link: 'https://github.com/example/algo-lab'
        },
        {
            id: '3',
            course_name: isIndo ? 'Desain & Manajemen Basis Data' : 'Database Systems & Architecture',
            grade: 'A (4.00)',
            semester: 'Semester 4',
            highlight: isIndo ? 'Desain skema normalisasi 3NF & tuning PostgreSQL query execution plan' : '3NF schema design & PostgreSQL query execution plan tuning',
            artifact_link: 'https://github.com/example/database-perf'
        }
    ]);

    // New project form state
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        tags: '',
        demo_url: '',
        github_url: '',
        role: 'Fullstack Developer',
        stars_or_metric: ''
    });

    const [publicUrl, setPublicUrl] = useState(`https://tranvas.app/p/${username}`);

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
        setTimeout(() => setIsRefreshing(false), 600);
    };

    const handleAddProjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProject.title.trim()) return;

        const p: FeaturedProject = {
            id: Date.now().toString(),
            title: newProject.title,
            description: newProject.description,
            tags: newProject.tags.split(',').map(s => s.trim()).filter(Boolean),
            demo_url: newProject.demo_url,
            github_url: newProject.github_url,
            role: newProject.role,
            stars_or_metric: newProject.stars_or_metric
        };

        setProjects([p, ...projects]);
        setIsAddProjectModalOpen(false);
        setNewProject({
            title: '',
            description: '',
            tags: '',
            demo_url: '',
            github_url: '',
            role: 'Fullstack Developer',
            stars_or_metric: ''
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 transition-colors font-sans overflow-x-hidden">
                
                {/* Header Navbar */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-3">
                            <Link
                                href="/study"
                                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition active:scale-95"
                            >
                                <ArrowLeft size={16} />
                            </Link>
                            <div>
                                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                    <span>{isIndo ? 'Bento Academic & Developer Portfolio' : 'Bento Academic & Developer Portfolio'}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                                        Live
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-400 font-semibold">
                                    {isIndo ? 'Portofolio kredensial nyata untuk rekruter, beasiswa & kompetisi.' : 'Real credential showcase for recruiters, scholarships & research.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 flex-wrap">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-black transition active:scale-95"
                            >
                                <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-indigo-500' : ''} />
                                <span>{isIndo ? 'Segarkan' : 'Sync'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsExportCvModalOpen(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black transition active:scale-95 shadow-sm"
                            >
                                <Download size={14} />
                                <span>{isIndo ? 'Unduh Resume CV' : 'Export CV'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsAddProjectModalOpen(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition"
                            >
                                <Plus size={14} />
                                <span>{isIndo ? 'Tambah Proyek' : 'Add Project'}</span>
                            </button>
                        </div>

                    </div>
                </header>

                <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    
                    {/* Public URL Identity Bar */}
                    <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    {isIndo ? 'Link Portofolio Publik' : 'Public Portfolio URL'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isIndo ? 'Link ini dapat diakses publik oleh HR, dosen pembimbing, atau juri lomba tanpa login.' : 'Publicly accessible to recruiters, advisors, and competition juries.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                            <div className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                                {publicUrl}
                            </div>
                            <button
                                type="button"
                                onClick={copyLink}
                                className="px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-black flex items-center gap-1.5 transition active:scale-95 shrink-0"
                            >
                                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                <span>{copied ? (isIndo ? 'Tersalin!' : 'Copied!') : (isIndo ? 'Salin Link' : 'Copy Link')}</span>
                            </button>
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95 shrink-0"
                            >
                                <span>{isIndo ? 'Lihat Tampilan Tamu' : 'Visit Guest View'}</span>
                                <ExternalLink size={13} />
                            </a>
                        </div>
                    </div>

                    {/* BENTO GRID SHOWCASE */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        
                        {/* Bento Card 1: Main Academic Hero & Identity (Span 2 cols) */}
                        <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-[3rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-8">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                            {/* Top row */}
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-600 border-2 border-white/20 flex items-center justify-center text-3xl font-black shadow-2xl shrink-0">
                                        {profile.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.name}</h2>
                                            <CheckCircle2 size={20} className="text-emerald-400" />
                                        </div>
                                        <p className="text-xs sm:text-sm text-indigo-200 font-semibold">{profile.headline}</p>
                                        <span className="inline-block text-[11px] font-mono text-indigo-300">@{username}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
                                        {profile.cumlaude}
                                    </span>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="relative z-10 text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
                                {profile.bio}
                            </p>

                            {/* Metrics & Socials */}
                            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-indigo-300 block">{isIndo ? 'IPK Kumulatif' : 'Cumulative GPA'}</span>
                                        <span className="text-2xl sm:text-3xl font-black font-mono text-white">{profile.ipk} <span className="text-xs font-bold text-indigo-300">/ 4.00</span></span>
                                    </div>
                                    <div className="h-8 w-px bg-white/10"></div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-indigo-300 block">{isIndo ? 'Total SKS Lulus' : 'Credits Earned'}</span>
                                        <span className="text-2xl sm:text-3xl font-black font-mono text-white">{profile.sks} <span className="text-xs font-bold text-indigo-300">SKS</span></span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition text-white">
                                        <GithubIcon size={16} />
                                    </a>
                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition text-white">
                                        <LinkedinIcon size={16} />
                                    </a>
                                    <a href={`mailto:${profile.email}`} className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition text-white">
                                        <Mail size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 2: Academic Status & Verified Badges (Span 1 col) */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
                                    <Trophy size={20} />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                    {isIndo ? 'Kredensial Kampus' : 'Academic Standing'}
                                </h4>
                                <p className="text-xs text-slate-400 font-semibold">
                                    {profile.major}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 block">{isIndo ? 'Status Mahasiswa' : 'Student Status'}</span>
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 size={13} />
                                        <span>{isIndo ? 'Aktif - Tingkat Akhir' : 'Active - Senior Year'}</span>
                                    </span>
                                </div>

                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 block">{isIndo ? 'Target Kelulusan' : 'Target Graduation'}</span>
                                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                                        {isIndo ? '2026 (Cum Laude On-Track)' : '2026 (Cum Laude Track)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 3: Featured Projects Showcase (Span 2 cols on Desktop) */}
                        <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Code2 size={20} className="text-indigo-600" />
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        {isIndo ? 'Proyek Unggulan & Portofolio Teknis' : 'Featured Technical Projects'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddProjectModalOpen(true)}
                                    className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                >
                                    <Plus size={13} />
                                    <span>{isIndo ? 'Tambah' : 'Add'}</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {projects.map((proj) => (
                                    <div
                                        key={proj.id}
                                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 hover:border-indigo-300 transition group"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                                                    {proj.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-400">{proj.role}</span>
                                            </div>
                                            {proj.stars_or_metric && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-black border border-indigo-200 dark:border-indigo-800">
                                                    {proj.stars_or_metric}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {proj.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {proj.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-600">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3 pt-2 text-xs font-black">
                                            {proj.demo_url && (
                                                <a href={proj.demo_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                                    <span>Live Demo</span>
                                                    <ExternalLink size={12} />
                                                </a>
                                            )}
                                            {proj.github_url && (
                                                <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
                                                    <GithubIcon size={12} />
                                                    <span>GitHub Repo</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bento Card 4: Academic Honors, Competitions & Publications (Span 2 cols on Desktop) */}
                        <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-2.5">
                                <Award size={20} className="text-amber-500" />
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    {isIndo ? 'Prestasi, Lomba & Publikasi Ilmiah' : 'Honors, Competitions & Publications'}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {honors.map((honor) => (
                                    <div
                                        key={honor.id}
                                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 hover:border-amber-300 transition"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-black border border-amber-200 dark:border-amber-800">
                                                {honor.badge}
                                            </span>
                                            <span className="text-xs font-mono font-bold text-slate-400">{honor.year}</span>
                                        </div>

                                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                                            {honor.title}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-semibold">{honor.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bento Card 5: Verified Coursework & Transcripts (Full Width Span) */}
                        <div className="md:col-span-3 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5">
                                    <BookOpen size={20} className="text-emerald-500" />
                                    <div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                                            {isIndo ? 'Transkrip Matakuliah & Bukti Praktikum Terverifikasi' : 'Verified Coursework & Lab Transcripts'}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-semibold">
                                            {isIndo ? 'Rekap capaian akademik mata kuliah inti bersumber dari sistem perkuliahan.' : 'Academic achievements tied to verified curriculum lab assignments.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {coursework.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                                                {item.semester}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs border border-emerald-200 dark:border-emerald-800">
                                                {item.grade}
                                            </span>
                                        </div>

                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                            {item.course_name}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {item.highlight}
                                        </p>

                                        {item.artifact_link && (
                                            <a
                                                href={item.artifact_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                                            >
                                                <span>{isIndo ? 'Lihat Bukti Repo/Laporan' : 'View Artifact Repo'}</span>
                                                <ExternalLink size={11} />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </main>

                {/* Add Project Modal */}
                {isAddProjectModalOpen && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsAddProjectModalOpen(false)}></div>
                            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
                                
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                    {isIndo ? 'Tambah Proyek Unggulan' : 'Add Featured Project'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    {isIndo ? 'Tampilkan karya terbaikmu di portofolio publik.' : 'Showcase your finest build in your public portfolio.'}
                                </p>

                                <form onSubmit={handleAddProjectSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Judul Proyek' : 'Project Title'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newProject.title}
                                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                            placeholder="e.g. Distributed Task Queue"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Deskripsi Ringkas' : 'Description'}
                                        </label>
                                        <textarea
                                            rows={2}
                                            required
                                            value={newProject.description}
                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                            placeholder={isIndo ? 'Masalah yang diselesaikan & teknologi utama...' : 'Key architecture & solution solved...'}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Tech Stack (Pisahkan dengan koma)' : 'Tech Stack (comma separated)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={newProject.tags}
                                            onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                            placeholder="Next.js, TypeScript, Go, PostgreSQL"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                                Live Demo URL
                                            </label>
                                            <input
                                                type="url"
                                                value={newProject.demo_url}
                                                onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                                                placeholder="https://..."
                                                className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                                GitHub URL
                                            </label>
                                            <input
                                                type="url"
                                                value={newProject.github_url}
                                                onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                                                placeholder="https://github.com/..."
                                                className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddProjectModalOpen(false)}
                                            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                        >
                                            {isIndo ? 'Batal' : 'Cancel'}
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wide shadow-lg shadow-indigo-500/20 active:scale-95 transition"
                                        >
                                            {isIndo ? 'Simpan Proyek' : 'Save Project'}
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </ModalPortal>
                )}

                {/* Export CV Modal */}
                {isExportCvModalOpen && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsExportCvModalOpen(false)}></div>
                            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150 space-y-5">
                                
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                            {isIndo ? 'Ekspor Resume / Master CV' : 'Export Verified Resume CV'}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            {isIndo ? 'Format terstruktur siap cetak atau ATS review.' : 'ATS-ready formatted export.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2 text-slate-600 dark:text-slate-300">
                                    <p className="font-bold text-slate-900 dark:text-white">📄 Data yang disertakan:</p>
                                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                                        <li>Profil Akademik ({profile.name}, IPK {profile.ipk}, {profile.sks} SKS)</li>
                                        <li>{projects.length} Proyek Unggulan Terverifikasi</li>
                                        <li>{honors.length} Prestasi & Publikasi Ilmiah</li>
                                        <li>Transkrip Mata Kuliah Inti & Tautan Bukti</li>
                                    </ul>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsExportCvModalOpen(false)}
                                        className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    >
                                        {isIndo ? 'Tutup' : 'Close'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                window.print();
                                            }
                                            setIsExportCvModalOpen(false);
                                        }}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        <span>{isIndo ? 'Cetak / Simpan PDF' : 'Print / Save PDF'}</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </ModalPortal>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
