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
        <div className="lg:hidden fixed inset-0 w-full h-full bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl z-[95] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="min-h-full flex flex-col justify-between pt-16 px-5 pb-16 sm:pb-20">
                <div className="space-y-1 pt-2">
                    {/* Features */}
                    <div className="border-b border-slate-100 dark:border-slate-800/60">
                        <button 
                            type="button"
                            onClick={() => setMobilePanel(mobilePanel === 'features' ? null : 'features')} 
                            className="w-full py-3.5 flex justify-between items-center text-base font-bold text-slate-900 dark:text-white"
                        >
                            <span>{locale === 'id' ? 'Fitur' : 'Features'}</span>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${mobilePanel === 'features' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {mobilePanel === 'features' && (
                            <div className="grid grid-cols-2 gap-1.5 pb-3.5 pt-1">
                                <Link href="/features/planner" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span>🎯</span> Daily Planner</Link>
                                <Link href="/features/habit" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span>🌱</span> Habit Tracker</Link>
                                <Link href="/features/finance" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span>💰</span> Finance OS</Link>
                                <Link href="/features/journal" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span>📔</span> Journal</Link>
                                <Link href="/features/calendar" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span>📅</span> Calendar</Link>
                                <Link href="/features/goal" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span>🎯</span> Goal Tracker</Link>
                                <Link href="/features/job" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><span>💼</span> Job Tracker</Link>
                                <Link href="/features/neural-os" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 transition"><span>🧠</span> Neural OS AI</Link>
                            </div>
                        )}
                    </div>

                    {/* Solutions */}
                    <div className="border-b border-slate-100 dark:border-slate-800/60">
                        <button 
                            type="button"
                            onClick={() => setMobilePanel(mobilePanel === 'solutions' ? null : 'solutions')} 
                            className="w-full py-3.5 flex justify-between items-center text-base font-bold text-slate-900 dark:text-white"
                        >
                            <span>{locale === 'id' ? 'Solusi' : 'Solutions'}</span>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${mobilePanel === 'solutions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {mobilePanel === 'solutions' && (
                            <div className="grid grid-cols-2 gap-1.5 pb-3.5 pt-1">
                                <Link href="/solutions/student" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>🎓</span> Students</Link>
                                <Link href="/solutions/freelancer" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>💻</span> Freelancers</Link>
                                <Link href="/solutions/personalgrowth" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>🚀</span> Personal Growth</Link>
                                <Link href="/solutions/finance-mastery" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>💰</span> Financial Clarity</Link>
                                <Link href="/solutions/deep-work" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>⚡</span> Deep Work</Link>
                                <Link href="/solutions/atomic-system" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>🌱</span> Atomic OS</Link>
                            </div>
                        )}
                    </div>

                    {/* Resources */}
                    <div className="border-b border-slate-100 dark:border-slate-800/60">
                        <button 
                            type="button"
                            onClick={() => setMobilePanel(mobilePanel === 'resources' ? null : 'resources')} 
                            className="w-full py-3.5 flex justify-between items-center text-base font-bold text-slate-900 dark:text-white"
                        >
                            <span>{locale === 'id' ? 'Sumber Daya' : 'Resources'}</span>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${mobilePanel === 'resources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {mobilePanel === 'resources' && (
                            <div className="grid grid-cols-2 gap-1.5 pb-3.5 pt-1">
                                <Link href="/resources/guide" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>📖</span> User Guide</Link>
                                <Link href="/resources/help" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>🙋‍♂️</span> Help Center</Link>
                                <Link href="/resources/blog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>✍️</span> Blog</Link>
                                <Link href="/resources/changelog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>🚀</span> Changelog</Link>
                                <Link href="/resources/community" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>🌍</span> Community</Link>
                                <Link href="/resources/affiliate" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 transition"><span>💎</span> Affiliate</Link>
                            </div>
                        )}
                    </div>

                    <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-3.5 text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/60">
                        {locale === 'id' ? 'Harga' : 'Pricing'}
                    </Link>
                </div>

                {/* Bottom Actions & Language Selector */}
                <div className="pt-6 pb-4 space-y-3 shrink-0 mt-auto">
                    <div className="flex items-center justify-between p-2.5 px-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/60">
                        <span className="text-xs font-bold text-slate-500">{locale === 'id' ? 'Bahasa' : 'Language'}</span>
                        <div className="flex gap-1.5">
                            <a 
                                href={idHref} 
                                onClick={(e) => { e.preventDefault(); switchLang('id'); setMobileMenuOpen(false); }} 
                                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${locale === 'id' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                            >
                                ID
                            </a>
                            <a 
                                href={enHref} 
                                onClick={(e) => { e.preventDefault(); switchLang('en'); setMobileMenuOpen(false); }} 
                                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${locale === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'}`}
                            >
                                EN
                            </a>
                        </div>
                    </div>
                    
                    {!user ? (
                        <div className="grid grid-cols-2 gap-2">
                            <Link 
                                href="/login" 
                                onClick={() => { setMobileMenuOpen(false); trackCTAClick('mobile_menu', 'Log in', '/login'); }} 
                                className="w-full py-3 text-center font-bold text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs hover:border-slate-300 active:scale-95 transition-all"
                            >
                                {locale === 'id' ? 'Masuk' : 'Log in'}
                            </Link>
                            <Link 
                                href="/register" 
                                onClick={() => { setMobileMenuOpen(false); trackCTAClick('mobile_menu', 'Get Started', '/register'); }} 
                                className="w-full py-3 text-center font-bold text-xs text-white bg-indigo-600 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                                {locale === 'id' ? 'Mulai Sekarang' : 'Get Started'}
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center font-bold text-xs text-white bg-slate-900 dark:bg-slate-800 rounded-xl shadow-md active:scale-95 transition-all">
                                {locale === 'id' ? 'Buka Dashboard' : 'Go to Dashboard'}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
