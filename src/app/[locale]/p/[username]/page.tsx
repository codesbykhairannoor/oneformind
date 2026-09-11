'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { 
    GraduationCap, BookOpen, Clock, BarChart3, 
    Sparkles, FileText, ExternalLink, ShieldCheck, 
    Briefcase, CheckCircle2, TrendingUp, Award,
    Mail, Globe, Code2, Terminal,
    Trophy, Star, ArrowUpRight, Download, Check
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

interface PublicPortfolioPageProps {
    params: Promise<{
        locale: string;
        username: string;
    }>;
}

export default function PublicPortfolioShowPage({ params }: PublicPortfolioPageProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const resolvedParams = React.use(params);
    const username = resolvedParams.username || 'student';

    const [profile, setProfile] = React.useState({
        name: username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        headline: isIndo 
            ? 'Software Engineer & Mahasiswa Berprestasi' 
            : 'Software Engineer & High-Distinction Student',
        major: isIndo ? 'Teknik Informatika (Software Engineering)' : 'Computer Science & Software Engineering',
        ipk: '3.92',
        sks: '0',
        cumlaude: isIndo ? 'Cum Laude Candidate 🏆' : 'Cum Laude Candidate 🏆',
        bio: isIndo
            ? 'Fokus pada arsitektur sistem web performa tinggi (Next.js, Go, PostgreSQL), algoritma terdistribusi, dan riset publikasi.'
            : 'Focused on high-performance web systems (Next.js, Go, PostgreSQL), distributed algorithms, and academic research.',
        github: `https://github.com/${username}`,
        linkedin: 'https://linkedin.com',
        email: `${username}@tranvas.app`,
        website: 'https://tranvas.app'
    });

    const [projects, setProjects] = React.useState<any[]>([]);
    const [honors, setHonors] = React.useState<any[]>([]);
    const [coursework, setCoursework] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchLivePublicData = async () => {
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

                        const ev = coursesData.map((c: any) => {
                            const sksVal = Number(c.sks) || 3;
                            const g = c.grade || 'A';
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
                    const studySettings = userData.settings?.study || {};
                    const calculatedIpk = totalSksCalc > 0 ? (totalPointsCalc / totalSksCalc).toFixed(2) : (studySettings.prior_ipk ? Number(studySettings.prior_ipk).toFixed(2) : '3.92');
                    const calculatedSks = totalSksCalc > 0 ? String(totalSksCalc) : (studySettings.prior_sks ? String(studySettings.prior_sks) : '0');
                    const numIpk = parseFloat(calculatedIpk);

                    setProfile({
                        name: userData.name || username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        headline: studySettings.headline || (isIndo 
                            ? 'Software Engineer & Mahasiswa Berprestasi' 
                            : 'Software Engineer & High-Distinction Student'),
                        major: studySettings.major || (isIndo ? 'Teknik Informatika (Software Engineering)' : 'Computer Science & Software Engineering'),
                        ipk: calculatedIpk,
                        sks: calculatedSks,
                        cumlaude: numIpk >= 3.8 ? 'Summa Cum Laude Candidate 🏆' : numIpk >= 3.5 ? 'Cum Laude Candidate 🏆' : 'Good Standing',
                        bio: studySettings.bio || (isIndo
                            ? 'Fokus pada arsitektur sistem web performa tinggi (Next.js, Go, PostgreSQL), algoritma terdistribusi, dan riset publikasi.'
                            : 'Focused on high-performance web systems (Next.js, Go, PostgreSQL), distributed algorithms, and academic research.'),
                        github: userData.settings?.social_github || `https://github.com/${username}`,
                        linkedin: userData.settings?.social_linkedin || 'https://linkedin.com',
                        email: userData.email || `${username}@tranvas.app`,
                        website: userData.settings?.social_website || 'https://tranvas.app'
                    });

                    if (Array.isArray(userData.settings?.portfolio_projects)) {
                        setProjects(userData.settings.portfolio_projects);
                    }
                    if (Array.isArray(userData.settings?.portfolio_honors)) {
                        setHonors(userData.settings.portfolio_honors);
                    }
                }
            } catch (e) {
                console.error('Failed to load public live data:', e);
            }
        };
        fetchLivePublicData();
    }, [username, isIndo]);

    const competencies = [
        { name: 'Fullstack Architecture (Next.js, React)', level: '96%' },
        { name: 'High-Performance Backend (Go, REST, WebSockets)', level: '94%' },
        { name: 'Database Optimization (PostgreSQL, 3NF Indexing)', level: '92%' },
        { name: 'Algorithms & Data Structures (Big-O, Graphs)', level: '95%' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white pb-32 font-sans">
            
            {/* Top Navigation */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
                            T
                        </div>
                        <div>
                            <span className="text-base font-black text-slate-900 dark:text-white leading-none">Tranvas Registry</span>
                            <p className="text-[10px] font-bold text-indigo-500 tracking-wider">
                                {isIndo ? 'KREDENSIAL AKADEMIK TERVERIFIKASI' : 'VERIFIED ACADEMIC REGISTRY'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => { if (typeof window !== 'undefined') window.print(); }}
                            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-black transition active:scale-95"
                        >
                            <Download size={14} />
                            <span>{isIndo ? 'Cetak CV' : 'Print CV'}</span>
                        </button>

                        <Link
                            href="/study"
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wider transition shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
                        >
                            <span>{isIndo ? 'Klaim Workspace' : 'Claim Workspace'}</span>
                            <Sparkles className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Profile Header Hero */}
            <section className="bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white pt-16 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="relative">
                        <div className="h-28 w-28 md:h-36 md:w-36 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-4xl md:text-5xl font-black border-4 border-white/20 shadow-2xl">
                            {profile.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 border-4 border-indigo-950 flex items-center justify-center text-white">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1 space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black tracking-wider">
                            <ShieldCheck className="h-4 w-4 text-indigo-400" />
                            <span>{isIndo ? 'IDENTITAS MAHASISWA TERVERIFIKASI' : 'VERIFIED ACADEMIC IDENTITY'}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{profile.name}</h1>
                        <p className="text-indigo-200/90 text-sm md:text-base font-semibold max-w-2xl leading-relaxed">
                            {profile.headline}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs font-bold">
                            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-indigo-400" />
                                <span>{profile.major}</span>
                            </div>
                            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <Award className="h-4 w-4 text-emerald-400" />
                                <span>IPK {profile.ipk} ({profile.cumlaude})</span>
                            </div>
                            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-purple-400" />
                                <span>{profile.sks} SKS Lulus</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
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
            </section>

            {/* BENTO GRID SHOWCASE */}
            <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 space-y-10">
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    
                    {/* Featured Projects (Span 2 cols) */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
                        <div className="flex items-center gap-2.5">
                            <Code2 size={20} className="text-indigo-600" />
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                {isIndo ? 'Proyek Unggulan & Portofolio Teknis' : 'Featured Technical Projects'}
                            </h3>
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
                                        {Array.isArray(proj.tags) && proj.tags.map((tag: string) => (
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

                    {/* Honors & Competitions (Span 2 cols) */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
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

                    {/* Technical Competencies Matrix (Span 1 col on 4-col) */}
                    <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 rounded-[3rem] p-7 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-indigo-500" />
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                {isIndo ? 'Keahlian Teknis' : 'Core Skills'}
                            </h4>
                        </div>

                        <div className="space-y-3.5">
                            {competencies.map((comp) => (
                                <div key={comp.name} className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-black text-slate-700 dark:text-slate-300">
                                        <span className="truncate max-w-[150px]">{comp.name}</span>
                                        <span className="text-indigo-600 dark:text-indigo-400">{comp.level}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: comp.level }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verified Coursework Transcripts (Span 3 cols on 4-col) */}
                    <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
                        <div className="flex items-center gap-2.5">
                            <BookOpen size={20} className="text-emerald-500" />
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    {isIndo ? 'Transkrip Matakuliah & Bukti Praktikum Terverifikasi' : 'Verified Coursework & Lab Transcripts'}
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold">
                                    {isIndo ? 'Rekap nilai resmi mata kuliah inti dan tautan repositori praktikum.' : 'Official course transcripts and lab repository proofs.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                            <span>{isIndo ? 'Lihat Bukti Repo' : 'View Repo Proof'}</span>
                                            <ExternalLink size={11} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
