'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

interface GuestMobileMenuProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    mobilePanel: string | null;
    setMobilePanel: (panel: string | null) => void;
    locale: string;
    idHref: string;
    enHref: string;
    switchLang: (lang: 'id' | 'en') => void;
    user: any;
}

export default function GuestMobileMenu({
    mobileMenuOpen,
    setMobileMenuOpen,
    mobilePanel,
    setMobilePanel,
    locale,
    idHref,
    enHref,
    switchLang,
    user
}: GuestMobileMenuProps) {
    if (!mobileMenuOpen) return null;

    return (
        <div className="lg:hidden fixed inset-0 top-0 bg-white dark:bg-slate-950 z-[90] pt-24 px-6 pb-24 flex flex-col h-[100dvh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex-grow space-y-2">
                {/* Features */}
                <div className="border-b border-slate-50 dark:border-slate-800/50">
                    <button 
                        type="button"
                        onClick={() => setMobilePanel(mobilePanel === 'features' ? null : 'features')} 
                        className="w-full py-5 flex justify-between items-center text-xl font-black text-slate-900 dark:text-white"
                    >
                        <span>Features</span>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${mobilePanel === 'features' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {mobilePanel === 'features' && (
                        <div className="grid grid-cols-1 gap-1 pb-4">
                            <Link href="/features/planner" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>🎯</span> Daily Planner</Link>
                            <Link href="/features/habit" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>🌱</span> Habit Tracker</Link>
                            <Link href="/features/finance" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>💰</span> Finance OS</Link>
                            <Link href="/features/journal" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>📔</span> Digital Journal</Link>
                            <Link href="/features/goal" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>🎯</span> Goal Tracker</Link>
                            <Link href="/features/calendar" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>📅</span> Smart Calendar</Link>
                            <Link href="/features/job" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>💼</span> Job Tracker</Link>
                        </div>
                    )}
                </div>

                {/* Solutions */}
                <div className="border-b border-slate-50 dark:border-slate-800/50">
                    <button 
                        type="button"
                        onClick={() => setMobilePanel(mobilePanel === 'solutions' ? null : 'solutions')} 
                        className="w-full py-5 flex justify-between items-center text-xl font-black text-slate-900 dark:text-white"
                    >
                        <span>Solutions</span>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${mobilePanel === 'solutions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {mobilePanel === 'solutions' && (
                        <div className="pb-6 space-y-6">
                            <div>
                                <p className="text-[10px] font-black tracking-wide text-slate-400 mb-3 px-3 uppercase">By Role</p>
                                <div className="grid grid-cols-1 gap-1">
                                    <Link href="/solutions/student" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>🎓</span> For Students</Link>
                                    <Link href="/solutions/freelancer" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>💻</span> For Freelancers</Link>
                                    <Link href="/solutions/personalgrowth" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>🚀</span> Personal Growth</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resources */}
                <div className="border-b border-slate-50 dark:border-slate-800/50">
                    <button 
                        type="button"
                        onClick={() => setMobilePanel(mobilePanel === 'resources' ? null : 'resources')} 
                        className="w-full py-5 flex justify-between items-center text-xl font-black text-slate-900 dark:text-white"
                    >
                        <span>Resources</span>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${mobilePanel === 'resources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {mobilePanel === 'resources' && (
                        <div className="grid grid-cols-1 gap-1 pb-4">
                            <Link href="/resources/guide" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>📖</span> User Guide</Link>
                            <Link href="/resources/blog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>✍️</span> Blog</Link>
                            <Link href="/resources/community" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>🌍</span> Community</Link>
                            <Link href="/resources/affiliate" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"><span>💎</span> Affiliate Program</Link>
                        </div>
                    )}
                </div>

                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-5 text-xl font-black text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800/50">Pricing</Link>
            </div>

            <div className="pt-8 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <span className="text-sm font-bold text-slate-500">Language</span>
                    <div className="flex gap-2">
                        <a 
                            href={idHref} 
                            onClick={(e) => { e.preventDefault(); switchLang('id'); setMobileMenuOpen(false); }} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${locale === 'id' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}
                        >
                            ID
                        </a>
                        <a 
                            href={enHref} 
                            onClick={(e) => { e.preventDefault(); switchLang('en'); setMobileMenuOpen(false); }} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${locale === 'en' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}
                        >
                            EN
                        </a>
                    </div>
                </div>
                
                {!user ? (
                    <div className="grid grid-cols-1 gap-3">
                        <Link 
                            href="/login" 
                            onClick={() => { setMobileMenuOpen(false); trackCTAClick('mobile_menu', 'Log in', '/login'); }} 
                            className="w-full py-4 text-center font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-200"
                        >
                            Log in
                        </Link>
                        <Link 
                            href="/register" 
                            onClick={() => { setMobileMenuOpen(false); trackCTAClick('mobile_menu', 'Get Started', '/register'); }} 
                            className="w-full py-4 text-center font-black text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 transition-transform"
                        >
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full py-4 text-center font-black text-white bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-xl active:scale-95 transition-transform">Go to Dashboard</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
