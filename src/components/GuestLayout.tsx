'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';

export default function GuestLayout({ children, user = null }: { children: React.ReactNode, user?: any }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobilePanel, setMobilePanel] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [langOpen, setLangOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Programmatically prefetch all public route bundles for instant transitions
        const publicRoutes = ['/login', '/register', '/pricing', '/about', '/features'];
        publicRoutes.forEach(route => {
            router.prefetch(route);
        });
    }, [router]);

    const switchLang = (newLang: 'id' | 'en') => {
        window.dispatchEvent(new CustomEvent('switch-locale', { detail: { locale: newLang } }));
        setLangOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-700 relative">
            {/* 1:1 GLOBAL HEADER (UNIFIED DESIGN) */}
            <nav 
                className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
                    mobileMenuOpen
                        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm'
                        : (scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'bg-transparent')
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] sm:h-16 flex justify-between items-center relative">
                    {/* UNIFIED LOGO */}
                    <Link href="/" className="group flex items-center gap-2 z-[110] hover:opacity-80 transition-opacity">
                        <div className="w-9 h-9 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-lg shadow-indigo-200 shrink-0">
                            <img src="/favicon.svg" alt="Tranvas Logo" className="w-5 h-5 sm:w-4 sm:h-4 brightness-0 invert" />
                        </div>
                        <span className="text-[17px] sm:text-[17px] font-black tracking-tight text-slate-900 hidden sm:block">Tranvas</span>
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {/* DROPDOWN: FEATURES */}
                        <div className="relative group" onMouseEnter={() => setActiveMenu('features')} onMouseLeave={() => setActiveMenu(null)}>
                            <button className="px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-1 group-hover:text-indigo-600">
                                Features
                                <svg className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeMenu === 'features' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {activeMenu === 'features' && (
                                <div className="absolute top-full left-0 w-[500px] pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="bg-white border border-slate-100 shadow-2xl rounded-[2rem] overflow-hidden p-4 text-left">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href="/features/habit" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">🌱</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Habit Tracker</h4><p className="text-[11px] font-medium text-slate-500">Build consistency every day.</p></div>
                                            </Link>
                                            <Link href="/features/finance" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">💰</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Finance OS</h4><p className="text-[11px] font-medium text-slate-500">Master your money flow.</p></div>
                                            </Link>
                                            <Link href="/features/planner" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">🎯</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Daily Planner</h4><p className="text-[11px] font-medium text-slate-500">Focus on what matters.</p></div>
                                            </Link>
                                            <Link href="/features/journal" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">📔</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Journal</h4><p className="text-[11px] font-medium text-slate-500">Capture your thoughts.</p></div>
                                            </Link>
                                            <Link href="/features/calendar" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">📅</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Calendar</h4><p className="text-[11px] font-medium text-slate-500">Sync your schedules.</p></div>
                                            </Link>
                                            <Link href="/features/goal" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">🎯</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Goal Tracker</h4><p className="text-[11px] font-medium text-slate-500">Track your milestones.</p></div>
                                            </Link>
                                            <Link href="/features/job" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">💼</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Job Tracker</h4><p className="text-[11px] font-medium text-slate-500">Manage career growth.</p></div>
                                            </Link>
                                            <Link href="/features/neural-os" className="p-3 rounded-xl hover:bg-slate-50 transition group/item flex items-start gap-3">
                                                <span className="text-xl group-hover/item:scale-110 transition-transform">🧠</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Neural OS AI</h4><p className="text-[11px] font-medium text-slate-500">Powered by Gemini Brain.</p></div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DROPDOWN: SOLUTIONS */}
                        <div className="relative group" onMouseEnter={() => setActiveMenu('solutions')} onMouseLeave={() => setActiveMenu(null)}>
                            <button className="px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition flex items-center gap-1 group-hover:text-indigo-600">
                                Solutions
                                <svg className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeMenu === 'solutions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {activeMenu === 'solutions' && (
                                <div className="absolute top-full -left-32 w-[860px] pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-8 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] grid grid-cols-3 gap-6 text-left">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 px-3">By Role</p>
                                            <div className="space-y-1.5">
                                                <Link href="/solutions/student" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🎓</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Students</h4><p className="text-[10px] font-medium text-slate-500">Optimize your learning.</p></div>
                                                </Link>
                                                <Link href="/solutions/freelancer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">💻</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Freelancers</h4><p className="text-[10px] font-medium text-slate-500">Scale your workflow.</p></div>
                                                </Link>
                                                <Link href="/solutions/personalgrowth" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🚀</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Personal Growth</h4><p className="text-[10px] font-medium text-slate-500">Master your self-system.</p></div>
                                                </Link>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 px-3">By Use Case</p>
                                            <div className="space-y-1.5">
                                                <Link href="/solutions/finance-mastery" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">💰</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Financial Clarity</h4><p className="text-[10px] font-medium text-slate-500">Manage assets & cashflow.</p></div>
                                                </Link>
                                                <Link href="/solutions/career-accelerator" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">💼</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Career Tracker</h4><p className="text-[10px] font-medium text-slate-500">Focus on professional growth.</p></div>
                                                </Link>
                                                <Link href="/solutions/mental-clarity" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🧘</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Mental Health</h4><p className="text-[10px] font-medium text-slate-500">Journaling & mindfulness.</p></div>
                                                </Link>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-5 px-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                By Methodology
                                            </p>
                                            <div className="space-y-1.5">
                                                <Link href="/solutions/atomic-system" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🌱</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Atomic Habits</h4><p className="text-[10px] font-medium text-slate-500">Small steps, big results.</p></div>
                                                </Link>
                                                <Link href="/solutions/deep-work" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">⚡</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Deep Work</h4><p className="text-[10px] font-medium text-slate-500">Uninterrupted focus.</p></div>
                                                </Link>
                                                <Link href="/solutions/second-brain" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🧠</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Second Brain</h4><p className="text-[10px] font-medium text-slate-500">Digital knowledge map.</p></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DROPDOWN: RESOURCES */}
                        <div className="relative group" onMouseEnter={() => setActiveMenu('resources')} onMouseLeave={() => setActiveMenu(null)}>
                            <button className="px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition flex items-center gap-1 group-hover:text-indigo-600">
                                Resources
                                <svg className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeMenu === 'resources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeMenu === 'resources' && (
                                <div className="absolute top-full -left-20 w-[600px] pt-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-8 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 px-3">Knowledge & Help</p>
                                            <div className="space-y-1">
                                                <Link href="/resources/guide" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">📖</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">User Guide</h4><p className="text-[10px] font-medium text-slate-500">Master the OS.</p></div>
                                                </Link>
                                                <Link href="/resources/help" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🙋‍♂️</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Help Center</h4><p className="text-[10px] font-medium text-slate-500">Find solutions.</p></div>
                                                </Link>
                                                <Link href="/resources/changelog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🚀</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">What's New</h4><p className="text-[10px] font-medium text-slate-500">Track app updates.</p></div>
                                                </Link>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 px-3">Social & Community</p>
                                            <div className="space-y-1">
                                                <Link href="/resources/community" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">🌍</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Community</h4><p className="text-[10px] font-medium text-slate-500">Connect with users.</p></div>
                                                </Link>
                                                <Link href="/resources/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">✍️</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Blog</h4><p className="text-[10px] font-medium text-slate-500">Productivity insights.</p></div>
                                                </Link>
                                                <Link href="/resources/stories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                    <span className="text-lg group-hover/item:scale-110 transition-transform">✨</span>
                                                    <div><h4 className="font-bold text-slate-900 text-sm">Success Stories</h4><p className="text-[10px] font-medium text-slate-500">User transformations.</p></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/pricing" className="px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition">
                            Pricing
                        </Link>
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-3">
                        {/* Premium Language Dropdown */}
                        <div className="hidden lg:relative lg:block">
                            <button 
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all shadow-sm group"
                            >
                                <span className="text-[11px] font-black text-slate-600 group-hover:text-indigo-600 uppercase tracking-tighter">
                                    {locale}
                                </span>
                                <svg className={`w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {langOpen && (
                                <div className="absolute top-full right-0 mt-3 w-40 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50 p-2 text-left">
                                    <button 
                                        onClick={() => switchLang('id')} 
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${locale === 'id' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                    >
                                        <span>Bahasa Indonesia</span>
                                        {locale === 'id' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                    </button>
                                    <button 
                                        onClick={() => switchLang('en')} 
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${locale === 'en' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                    >
                                        <span>English</span>
                                        {locale === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Login/Register (Desktop) */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <Link href="/dashboard" className="px-5 py-2 bg-slate-900 text-white rounded-full text-[13px] font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-[13px] font-bold text-slate-600 hover:text-indigo-600 transition">
                                        Log in
                                    </Link>
                                    <Link href="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[13px] font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 active:scale-95">
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* MOBILE HAMBURGER BUTTON (UNIFIED) */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl text-slate-900 transition-all hover:bg-slate-100 active:scale-95 relative z-[110] focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <div className="w-5 flex flex-col items-end gap-[5px]">
                                <span className={`h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px] w-5' : 'w-5'}`} />
                                <span className={`h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-3.5'}`} />
                                <span className={`h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px] w-5' : 'w-4'}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-x-0 top-[72px] sm:top-16 z-[95] bg-white/95 backdrop-blur-2xl flex flex-col h-[calc(100vh-[72px])] sm:h-[calc(100vh-4rem)] w-full overflow-hidden border-t border-slate-200/50 text-left animate-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-6 pt-8 pb-10 space-y-6">
                            <Link href="/features/planner" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[22px] font-black text-slate-900 tracking-tight">Features</Link>
                            <Link href="/solutions/student" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[22px] font-black text-slate-900 tracking-tight">Solutions</Link>
                            <Link href="/resources/guide" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[22px] font-black text-slate-900 tracking-tight">Resources</Link>
                            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[22px] font-black text-slate-900 tracking-tight">Pricing</Link>
                            
                            <div className="pt-8 mt-4 border-t border-slate-200/50 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Language</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => switchLang('id')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${locale === 'id' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>ID</button>
                                        <button onClick={() => switchLang('en')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${locale === 'en' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>EN</button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center font-bold text-slate-800 bg-white border-2 border-slate-200 rounded-2xl text-[15px] hover:border-slate-300 transition-colors">Log in</Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center font-bold text-white bg-indigo-600 rounded-2xl text-[15px] shadow-xl shadow-indigo-200 active:scale-95 transition-transform">Get started</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* MAIN CONTENT */}
            <main className="flex-grow">
                {children}
            </main>

            {/* FOOTER - 6 COLUMNS PARITY */}
            <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12 md:gap-12 mb-16 text-left">
                        {/* COL 1: BRAND */}
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-6">
                                <img src="/favicon.svg" alt="Tranvas Logo" className="w-7 h-7" />
                                <span className="text-lg font-black tracking-tighter text-slate-900">Tranvas</span>
                            </Link>
                            <p className="text-sm text-slate-700 leading-relaxed mb-6 max-w-xs font-medium">
                                The unified productivity system designed to bring clarity to your life, habits, and finances.
                            </p>
                            <div className="text-xs text-slate-600 space-y-2 mt-4 font-bold">
                                <p><strong>Email:</strong> tranvasapp@gmail.com</p>
                                <p><strong>Status:</strong> HQ Jakarta, ID</p>
                            </div>
                        </div>

                        {/* COL 2: PRODUCT */}
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-5">Product</p>
                            <ul className="space-y-4 text-sm font-bold text-slate-700">
                                <li><Link href="/features/habit" className="hover:text-indigo-600 transition">Habit Tracker</Link></li>
                                <li><Link href="/features/finance" className="hover:text-indigo-600 transition">Finance OS</Link></li>
                                <li><Link href="/features/planner" className="hover:text-indigo-600 transition">Daily Planner</Link></li>
                                <li><Link href="/features/journal" className="hover:text-indigo-600 transition">Digital Journal</Link></li>
                                <li><Link href="/features/calendar" className="hover:text-indigo-600 transition">Smart Calendar</Link></li>
                                <li><Link href="/features/goal" className="hover:text-indigo-600 transition">Goal Tracker</Link></li>
                                <li><Link href="/features/job" className="hover:text-indigo-600 transition">Job Tracker</Link></li>
                                <li><Link href="/features/neural-os" className="hover:text-indigo-600 transition">Neural OS AI</Link></li>
                            </ul>
                        </div>

                        {/* COL 3: COMPARE */}
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-5">Compare</p>
                            <ul className="space-y-4 text-sm font-bold text-slate-700">
                                <li><Link href="/compare/notion" className="hover:text-indigo-600 transition">Vs. Notion</Link></li>
                                <li><Link href="/compare/clickup" className="hover:text-indigo-600 transition">Vs. ClickUp</Link></li>
                                <li><Link href="/compare/todoist" className="hover:text-indigo-600 transition">Vs. Todoist</Link></li>
                                <li><Link href="/compare/trello" className="hover:text-indigo-600 transition">Vs. Trello</Link></li>
                                <li><Link href="/compare/asana" className="hover:text-indigo-600 transition">Vs. Asana</Link></li>
                                <li><Link href="/compare/habitica" className="hover:text-indigo-600 transition">Vs. Habitica</Link></li>
                                <li><Link href="/compare/obsidian" className="hover:text-indigo-600 transition">Vs. Obsidian</Link></li>
                            </ul>
                        </div>

                        {/* COL 4: RESOURCES */}
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-5">Resources</p>
                            <ul className="space-y-4 text-sm font-bold text-slate-700">
                                <li><Link href="/resources/help" className="hover:text-indigo-600 transition">Help Center</Link></li>
                                <li><Link href="/resources/blog" className="hover:text-indigo-600 transition">Blog</Link></li>
                                <li><Link href="/resources/changelog" className="hover:text-indigo-600 transition">Changelog</Link></li>
                                <li><Link href="/resources/community" className="hover:text-indigo-600 transition">Community</Link></li>
                                <li><Link href="/resources/stories" className="hover:text-indigo-600 transition">Success Stories</Link></li>
                                <li><Link href="/resources/guide" className="hover:text-indigo-600 transition">User Guide</Link></li>
                                <li><Link href="/resources/ai-trust" className="hover:text-indigo-600 transition">AI Transparency</Link></li>
                            </ul>
                        </div>

                        {/* COL 5: COMPANY */}
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-5">Company</p>
                            <ul className="space-y-4 text-sm font-bold text-slate-700">
                                <li><Link href="/company/privacy" className="hover:text-indigo-600 transition">Privacy policy</Link></li>
                                <li><Link href="/company/terms" className="hover:text-indigo-600 transition">Terms of service</Link></li>
                                <li><Link href="/company/refund" className="hover:text-indigo-600 transition">Refund policy</Link></li>
                                <li><Link href="/company/contact" className="hover:text-indigo-600 transition">Contact us</Link></li>
                                <li><Link href="/company/security" className="hover:text-indigo-600 transition">Security</Link></li>
                                <li><Link href="/about" className="hover:text-indigo-600 transition">About us</Link></li>
                                <li><Link href="/company/status" className="hover:text-indigo-600 transition">System status</Link></li>
                            </ul>
                        </div>

                        {/* COL 6: CONNECT */}
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-5">Connect</p>
                            <div className="flex gap-4">
                                <a href="https://x.com/Tranvas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm" aria-label="X">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239h-2.19L17.607 20.65z"/></svg>
                                </a>
                                <a href="https://instagram.com/tranvas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm" aria-label="Instagram">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                </a>
                                <a href="https://facebook.com/tranvas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm" aria-label="Facebook">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-700">
                        <p>&copy; {new Date().getFullYear()} Tranvas. All rights reserved.</p>
                        <p>Made with ❤️ for better focus.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
