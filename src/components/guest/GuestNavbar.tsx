'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

interface GuestNavbarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (v: boolean) => void;
    scrolled: boolean;
    activeMenu: string | null;
    setActiveMenu: (m: string | null) => void;
    langOpen: boolean;
    setLangOpen: (open: boolean) => void;
    locale: string;
    idHref: string;
    enHref: string;
    switchLang: (lang: 'id' | 'en') => void;
    user: any;
}

export default function GuestNavbar({
    mobileMenuOpen,
    setMobileMenuOpen,
    scrolled,
    activeMenu,
    setActiveMenu,
    langOpen,
    setLangOpen,
    locale,
    idHref,
    enHref,
    switchLang,
    user
}: GuestNavbarProps) {
    return (
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
                        <Link href="/features" className="px-3 py-1.5 rounded-full text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-1 group-hover:text-indigo-600">
                            Features
                            <svg className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeMenu === 'features' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </Link>
                        
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
                                            <Link href="/resources/affiliate" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group/item">
                                                <span className="text-lg group-hover/item:scale-110 transition-transform">💎</span>
                                                <div><h4 className="font-bold text-slate-900 text-sm">Affiliate Program</h4><p className="text-[10px] font-medium text-slate-500">Earn 60% recurring.</p></div>
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
                    {/* Language Dropdown */}
                    <div className="hidden lg:relative lg:block">
                        <button 
                            type="button"
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
                                <a 
                                    href={idHref}
                                    onClick={(e) => { e.preventDefault(); switchLang('id'); }} 
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${locale === 'id' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                >
                                    <span>Bahasa Indonesia</span>
                                    {locale === 'id' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                </a>
                                <a 
                                    href={enHref}
                                    onClick={(e) => { e.preventDefault(); switchLang('en'); }} 
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${locale === 'en' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                >
                                    <span>English</span>
                                    {locale === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                </a>
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
                                <Link 
                                    href="/login" 
                                    onClick={() => trackCTAClick('header_nav', 'Log in', '/login')}
                                    className="text-[13px] font-bold text-slate-600 hover:text-indigo-600 transition"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    href="/register" 
                                    onClick={() => trackCTAClick('header_nav', 'Get started', '/register')}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[13px] font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5 active:scale-95"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* MOBILE HAMBURGER BUTTON */}
                    <button 
                        type="button"
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
        </nav>
    );
}
