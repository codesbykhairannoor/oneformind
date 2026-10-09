'use client';

import { useLocale, useTranslations } from 'next-intl';
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

    const locale = useLocale();
    const isId = locale === 'id';

    return (
        <section className="py-16 sm:py-28 lg:py-36 bg-slate-900 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-indigo-500/5 blur-2xl rounded-full pointer-events-none max-w-[100vw]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-purple-500/5 blur-2xl rounded-full pointer-events-none max-w-[100vw]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-12 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 text-white/70 text-xs font-bold tracking-wider mb-6 border border-white/10 uppercase">
                        🚀 {t('home_solutions_badge')}
                    </div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 sm:mb-8 tracking-tight font-[900]">{t('home_solutions_title')}</h2>
                    <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
                        {t('home_solutions_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {solutionPaths.map((path, idx) => (
                        <Link key={idx} href={path.route} className="group block p-[1px] rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 hover:-translate-y-1.5 transition-all duration-300">
                            <div className={`relative overflow-hidden rounded-[calc(1rem-1px)] sm:rounded-[calc(1.5rem-1px)] bg-gradient-to-br ${path.color} p-5 sm:p-6 lg:p-8 h-full flex flex-col items-center text-center`}>
                                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition duration-300">
                                    {path.icon}
                                </div>
                                <h3 className="text-white font-bold tracking-tight text-base sm:text-lg">
                                    {path.name}
                                </h3>
                                <div className="mt-4 sm:mt-6 opacity-80 sm:opacity-40 sm:group-hover:opacity-100 transition duration-300 flex items-center gap-2 text-xs text-white/80 font-bold uppercase tracking-wider">
                                    <span>{isId ? 'Jelajahi' : 'Explore'}</span>
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
