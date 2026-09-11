'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
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
        <rect width="4" height="12" x="9" y="8" />
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

interface StudyPortfolioViewProps {
    showBackButton?: boolean;
}

export default function StudyPortfolioView({ showBackButton = false }: StudyPortfolioViewProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [username, setUsername] = useState('student');
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isExportCvModalOpen, setIsExportCvModalOpen] = useState(false);

    // Profile state from Supabase
    const [profile, setProfile] = useState({
        name: 'Student',
        headline: isIndo 
            ? 'Software Engineer & Mahasiswa Berprestasi' 
            : 'Software Engineer & High-Distinction Student',
        major: isIndo ? 'Teknik Informatika (Software Engineering)' : 'Computer Science & Software Engineering',
        ipk: '0.00',
        sks: '0',
        cumlaude: isIndo ? 'Status Akademik' : 'Academic Standing',
        bio: isIndo
            ? 'Fokus pada arsitektur sistem web skala tinggi (Next.js, Go, PostgreSQL), algoritma terdistribusi, dan riset publikasi.'
            : 'Focused on high-performance web systems (Next.js, Go, PostgreSQL), distributed algorithms, and academic research.',
        github: '',
        linkedin: '',
        email: '',
        website: ''
    });

    // Featured Projects state from Supabase
    const [projects, setProjects] = useState<FeaturedProject[]>([]);

    // Academic Honors & Publications from Supabase
    const [honors, setHonors] = useState<AcademicHonor[]>([]);

    // Coursework Proof Transcripts from Supabase
    const [coursework, setCoursework] = useState<CourseworkEvidence[]>([]);

    // Fetch live Supabase user & study courses
    const loadSupabaseData = async () => {
        try {
            const [userRes, coursesRes] = await Promise.all([
                fetch('/api/user'),
                fetch('/api/study/courses')
            ]);

            let totalSksCalc = 0;
            let totalPointsCalc = 0;

            if (coursesRes.ok) {
                const coursesData = await coursesRes.json();
                if (Array.isArray(coursesData) && coursesData.length > 0) {
                    const gradeWeights: Record<string, number> = {
                        'A': 4.0, 'A-': 3.75, 'B+': 3.5, 'B': 3.0, 'B-': 2.75, 'C+': 2.5, 'C': 2.0, 'D': 1.0, 'E': 0.0
                    };

                    const ev: CourseworkEvidence[] = coursesData.map((c: any) => {
                        const sksVal = Number(c.sks) || 3;
                        const g = (c.grade || '').trim().toUpperCase() || 'A';
                        const w = gradeWeights[g] ?? 4.0;
                        totalSksCalc += sksVal;
                        totalPointsCalc += (w * sksVal);

                        const firstArchive = c.archives && c.archives.length > 0 ? c.archives[0] : null;

                        return {
                            id: String(c.id),
                            course_name: c.courseName || 'Mata Kuliah',
                            grade: `${g} (${w.toFixed(2)})`,
                            semester: `Semester ${c.semester || 1}`,
                            highlight: firstArchive?.fileName ? `Modul: ${firstArchive.fileName}` : (isIndo ? 'Mata Kuliah Kurikulum Inti' : 'Core Curriculum Course'),
                            artifact_link: firstArchive?.linkUrl || (firstArchive?.filePath ? `/storage/${firstArchive.filePath}` : undefined)
                        };
                    });
                    setCoursework(ev);
                }
            }

            if (userRes.ok) {
                const userData = await userRes.json();
                const uName = userData.username || (userData.name ? userData.name.toLowerCase().replace(/\s+/g, '_') : 'student');
                setUsername(uName);

                const studySettings = userData.settings?.study || {};
                const priorSks = Number(studySettings.prior_sks) || 0;
                const priorIpk = Number(studySettings.prior_ipk) || 0;
                const grandTotalSks = totalSksCalc + priorSks;
                const grandTotalPoints = totalPointsCalc + (priorSks * priorIpk);

                const calculatedIpk = grandTotalSks > 0 ? (grandTotalPoints / grandTotalSks).toFixed(2) : '0.00';
                const calculatedSks = String(grandTotalSks);
                const numIpk = parseFloat(calculatedIpk);

                setProfile({
                    name: userData.name || 'Student',
                    headline: studySettings.headline || (isIndo 
                        ? 'Software Engineer & Mahasiswa Berprestasi' 
                        : 'Software Engineer & High-Distinction Student'),
                    major: studySettings.major || (isIndo ? 'Teknik Informatika (Software Engineering)' : 'Computer Science & Software Engineering'),
                    ipk: calculatedIpk,
                    sks: calculatedSks,
                    cumlaude: grandTotalSks === 0 
                        ? (isIndo ? 'Belum Ada Transkrip' : 'No Transcript Yet')
                        : numIpk >= 3.8 
                        ? 'Summa Cum Laude Candidate 🏆' 
                        : numIpk >= 3.5 
                        ? 'Cum Laude Candidate ✨' 
                        : 'Good Standing 🎯',
                    bio: studySettings.bio || (isIndo
                        ? 'Fokus pada arsitektur sistem web skala tinggi (Next.js, Go, PostgreSQL), algoritma terdistribusi, dan riset publikasi.'
                        : 'Focused on high-performance web systems (Next.js, Go, PostgreSQL), distributed algorithms, and academic research.'),
                    github: userData.settings?.social_github || (userData.name ? `https://github.com/${uName}` : 'https://github.com'),
                    linkedin: userData.settings?.social_linkedin || 'https://linkedin.com',
                    email: userData.email || '',
                    website: userData.settings?.social_website || 'https://tranvas.app'
                });

                if (Array.isArray(userData.settings?.portfolio_projects)) {
                    setProjects(userData.settings.portfolio_projects);
                }
                if (Array.isArray(userData.settings?.portfolio_honors)) {
                    setHonors(userData.settings.portfolio_honors);
                }
            }
        } catch (err) {
            console.error('Failed to load portfolio Supabase data:', err);
        }
    };

    useEffect(() => {
        loadSupabaseData();
    }, []);

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

    useEffect(() => {
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

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadSupabaseData();
        setIsRefreshing(false);
    };

    const handleAddProjectSubmit = async (e: React.FormEvent) => {
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

        const updated = [p, ...projects];
        setProjects(updated);
        setIsAddProjectModalOpen(false);

        // Save to Supabase
        try {
            const userRes = await fetch('/api/user');
            if (userRes.ok) {
                const userData = await userRes.json();
                const newSettings = { ...userData.settings, portfolio_projects: updated };
                await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings: newSettings })
                });
            }
        } catch (err) {
            console.error('Failed to save project to Supabase:', err);
        }

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
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Optional Standalone Header with Back button if rendered as separate page */}
            {showBackButton && (
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/study"
                            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition active:scale-95"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>Neural Portfolio</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                                    Live
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                {isIndo ? 'Portofolio kredensial nyata untuk rekruter & beasiswa.' : 'Real credential showcase for recruiters & scholarships.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Bar & Public Link */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {isIndo ? 'Link Portofolio Publik' : 'Public Portfolio Link'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-xs sm:max-w-md">
                            {publicUrl}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    <button
                        type="button"
                        onClick={copyLink}
                        className="px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-black flex items-center gap-1.5 transition active:scale-95 shrink-0"
                    >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        <span>{copied ? (isIndo ? 'Tersalin!' : 'Copied!') : (isIndo ? 'Salin Link' : 'Copy Link')}</span>
                    </button>

                    <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95 shrink-0"
                    >
                        <span>{isIndo ? 'Lihat Tampilan Tamu' : 'Guest View'}</span>
                        <ExternalLink size={13} />
                    </a>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition active:scale-95"
                        title={isIndo ? 'Segarkan Data' : 'Sync'}
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-indigo-500' : ''} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsExportCvModalOpen(true)}
                        className="px-3.5 py-2 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black transition active:scale-95 flex items-center gap-1.5 shadow-xs"
                    >
                        <Download size={13} />
                        <span>{isIndo ? 'Ekspor CV' : 'Export CV'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsAddProjectModalOpen(true)}
                        className="px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-500/20 active:scale-95 transition flex items-center gap-1.5"
                    >
                        <Plus size={14} />
                        <span>{isIndo ? 'Tambah Proyek' : 'Add Project'}</span>
                    </button>
                </div>
            </div>

            {/* BENTO GRID SHOWCASE */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* Bento Card 1: Main Academic Hero & Identity (Span 3 cols) */}
                <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-[2.5rem] p-7 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* Top row */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 border-2 border-white/20 flex items-center justify-center text-2xl sm:text-3xl font-black shadow-xl shrink-0">
                                {profile.name.charAt(0)}
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">{profile.name}</h2>
                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                </div>
                                <p className="text-xs sm:text-sm text-indigo-200 font-semibold">{profile.headline}</p>
                                <span className="inline-block text-[11px] font-mono text-indigo-300">@{username}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
                                {profile.cumlaude}
                            </span>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="relative z-10 text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
                        {profile.bio}
                    </p>

                    {/* Metrics & Socials */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-5 pt-5 border-t border-white/10">
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

                        <div className="flex items-center gap-2">
                            {profile.github && (
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white">
                                    <GithubIcon size={15} />
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white">
                                    <LinkedinIcon size={15} />
                                </a>
                            )}
                            {profile.email && (
                                <a href={`mailto:${profile.email}`} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white">
                                    <Mail size={15} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bento Card 2: Academic Standing */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
                            <Trophy size={18} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {isIndo ? 'Kredensial Kampus' : 'Academic Standing'}
                        </h4>
                        <p className="text-xs text-slate-400 font-semibold">
                            {profile.major}
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-black uppercase text-slate-400 block">{isIndo ? 'Status Mahasiswa' : 'Student Status'}</span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle2 size={13} />
                                <span>{isIndo ? 'Aktif Terverifikasi' : 'Active Verified'}</span>
                            </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                            <span className="text-[10px] font-black uppercase text-indigo-500 block">{isIndo ? 'Klasifikasi Gelar' : 'Honors Classification'}</span>
                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                                {profile.cumlaude}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bento Card 3: Featured Projects (Span 4 cols) */}
                <div className="md:col-span-3 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center">
                                <Code2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    {isIndo ? 'Proyek Unggulan & Kode Produksi' : 'Featured Projects & Production Code'}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {projects.length} {isIndo ? 'proyek terverifikasi' : 'verified projects'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsAddProjectModalOpen(true)}
                            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            <span>{isIndo ? 'Tambah Proyek' : 'Add Project'}</span>
                        </button>
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {projects.map((proj) => (
                                <div
                                    key={proj.id}
                                    className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                                {proj.title}
                                            </h4>
                                            {proj.stars_or_metric && (
                                                <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black border border-amber-500/20">
                                                    {proj.stars_or_metric}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                                            {proj.role}
                                        </span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                            {proj.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <div className="flex flex-wrap gap-1.5">
                                            {proj.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold border border-slate-200 dark:border-slate-700"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3 pt-1">
                                            {proj.demo_url && (
                                                <a
                                                    href={proj.demo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    <span>Live Demo</span>
                                                    <ExternalLink size={12} />
                                                </a>
                                            )}
                                            {proj.github_url && (
                                                <a
                                                    href={proj.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                                >
                                                    <GithubIcon size={13} />
                                                    <span>Source</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                            <p className="text-xs text-slate-400 font-semibold">
                                {isIndo ? 'Belum ada proyek ditambahkan ke portofolio.' : 'No featured projects added yet.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsAddProjectModalOpen(true)}
                                className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                <Plus size={13} />
                                <span>{isIndo ? 'Tambah Proyek Pertama' : 'Add First Project'}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Bento Card 4: Transkrip Bukti Mata Kuliah / Coursework (Span 4 cols) */}
                <div className="md:col-span-3 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                {isIndo ? 'Transkrip Mata Kuliah & Bukti Pembelajaran Nyata' : 'Verified Academic Coursework & Evidence'}
                            </h3>
                            <p className="text-xs text-slate-400">
                                {isIndo ? 'Tersinkronisasi otomatis dari database mata kuliah & arsip berkas tugas.' : 'Live synchronized with your courses & archive files.'}
                            </p>
                        </div>
                    </div>

                    {coursework.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {coursework.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                                            {c.course_name}
                                        </h4>
                                        <span className="shrink-0 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-black border border-emerald-500/20">
                                            {c.grade}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium truncate">
                                        {c.highlight}
                                    </p>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                                        <span>{c.semester}</span>
                                        {c.artifact_link && (
                                            <a
                                                href={c.artifact_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                                            >
                                                <span>Arsip</span>
                                                <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                            {isIndo ? 'Mata kuliah yang dimasukkan di tab Mata Kuliah akan otomatis muncul di sini.' : 'Courses added in Course tab will automatically show here.'}
                        </div>
                    )}
                </div>

            </div>

            {/* Modal Tambah Proyek */}
            {isAddProjectModalOpen && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsAddProjectModalOpen(false)}></div>
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150 space-y-6">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        {isIndo ? 'Tambah Proyek Unggulan' : 'Add Featured Project'}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {isIndo ? 'Tampilkan karya terbaik Anda ke profil publik.' : 'Showcase your best engineering work.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddProjectModalOpen(false)}
                                    className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleAddProjectSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        {isIndo ? 'Judul Proyek' : 'Project Title'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Distributed Database Engine"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        {isIndo ? 'Peran / Role' : 'Role'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Lead Backend Engineer"
                                        value={newProject.role}
                                        onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        {isIndo ? 'Deskripsi Ringkas' : 'Description'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="e.g. Built using Go, Raft consensus algorithm, and gRPC with sub-millisecond latency."
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        {isIndo ? 'Tech Stack (pisahkan dengan koma)' : 'Tech Stack (comma separated)'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Go, PostgreSQL, Docker, Redis"
                                        value={newProject.tags}
                                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://github.com/..."
                                            value={newProject.github_url}
                                            onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Live Demo URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://myproject.com"
                                            value={newProject.demo_url}
                                            onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition"
                                    >
                                        {isIndo ? 'Simpan Proyek' : 'Save Project'}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* Modal Export CV */}
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
    );
}
