'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function LandingSolutions() {
    const t = useTranslations();

    const solutionPaths = [
        { name: 'Student', route: '/solutions/student', icon: '🎓', color: 'from-blue-500/10 to-indigo-500/10' },
        { name: 'Career Accelerator', route: '/solutions/career-accelerator', icon: '💼', color: 'from-emerald-500/10 to-teal-500/10' },
        { name: 'Personal Growth', route: '/solutions/personalgrowth', icon: '🌱', color: 'from-purple-500/10 to-pink-500/10' },
        { name: 'Finance Mastery', route: '/solutions/finance-mastery', icon: '💰', color: 'from-amber-500/10 to-orange-500/10' },
        { name: 'Atomic System', route: '/solutions/atomic-system', icon: '⚛️', color: 'from-lime-500/10 to-green-500/10' },
        { name: 'Mental Clarity', route: '/solutions/mental-clarity', icon: '🧠', color: 'from-slate-500/10 to-gray-500/10' },
        { name: 'Deep Work', route: '/solutions/deep-work', icon: '⚡', color: 'from-cyan-500/10 to-blue-500/10' },
        { name: 'Freelancer', route: '/solutions/freelancer', icon: '🚀', color: 'from-rose-500/10 to-red-500/10' },
        { name: 'Second Brain', route: '/solutions/second-brain', icon: '💎', color: 'from-indigo-500/10 to-purple-500/10' },
    ];

    return (
        <section className="py-40 bg-slate-900 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-2xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/5 blur-2xl rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] font-bold tracking-[0.3em] mb-6 border border-white/10 uppercase">
                        🚀 {t('home_solutions_badge')}
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-8 tracking-tight font-[900]">{t('home_solutions_title')}</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium opacity-80">
                        {t('home_solutions_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {solutionPaths.map((path, idx) => (
                        <Link key={idx} href={path.route} className="group block p-[1px] rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-500">
                            <div className={`relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br ${path.color} p-8 h-full flex flex-col items-center text-center`}>
                                <div className="text-4xl mb-4 group-hover:scale-110 transition duration-500">
                                    {path.icon}
                                </div>
                                <h3 className="text-white font-bold tracking-tight text-sm">
                                    {path.name}
                                </h3>
                                <div className="mt-6 opacity-40 group-hover:opacity-100 transition duration-500 flex items-center gap-2 text-[10px] text-white/60 font-bold uppercase tracking-widest">
                                    Explore <svg className="w-3 h-3 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
