'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import {
    LayoutDashboard,
    Calendar,
    Wallet,
    BookOpen,
    GraduationCap,
    CalendarDays,
    Briefcase,
    Target,
    Sparkles,
    ChevronDown,
    Crown,
    Flame,
    Zap
} from 'lucide-react';

interface AuthSidebarProps {
    isDesktop: boolean;
    isSidebarCollapsed: boolean;
    isMobileDrawerOpen: boolean;
    coreExpanded: boolean;
    platinumExpanded: boolean;
    moduleSettings: Record<string, boolean>;
    trial: { isActive: boolean; daysRemaining: number };
    locale: string;
    pathname: string | null;
    toggleCore: () => void;
    togglePlatinum: () => void;
    isActive: (path: string) => boolean;
}

export default function AuthSidebar({
    isDesktop,
    isSidebarCollapsed,
    isMobileDrawerOpen,
    coreExpanded,
    platinumExpanded,
    moduleSettings,
    trial,
    locale,
    pathname,
    toggleCore,
    togglePlatinum,
    isActive
}: AuthSidebarProps) {
    return (
        <aside 
            className={`bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none shrink-0 transition-all duration-300 ease-in-out ${
                !isDesktop ? 'fixed top-[72px] sm:top-16 bottom-0 left-0 z-[61]' : 'relative z-[10]'
            } ${
                !isDesktop 
                    ? (isMobileDrawerOpen ? 'translate-x-0 w-full' : '-translate-x-full w-full') 
                    : (isSidebarCollapsed ? 'w-[68px] translate-x-0' : 'w-[232px] translate-x-0')
            }`}
        >
            <nav className={`flex-1 overflow-y-auto py-3 custom-scrollbar space-y-0.5 ${isSidebarCollapsed ? 'px-2' : 'px-2.5'}`}>
                
                {/* ── 1. SYSTEM CORE SECTION ── */}
                <button
                    type="button"
                    onClick={toggleCore}
                    className={`w-full flex items-center justify-between px-2 py-1.5 mb-0.5 rounded-lg group transition-all duration-200 ${
                        isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                >
                    {isSidebarCollapsed ? (
                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-2" />
                    ) : (
                        <>
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 tracking-wide ml-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                                System Core
                            </span>
                            <ChevronDown size={10} className={`text-slate-300 transition-transform duration-200 ${coreExpanded ? '' : '-rotate-90'}`} />
                        </>
                    )}
                </button>

                {(coreExpanded || isSidebarCollapsed) && (
                    <div className="space-y-0.5">
                        {/* Dashboard */}
                        <Link 
                            href="/dashboard"
                            className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                            } ${
                                isActive('/dashboard')
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                            }`}
                        >
                            <LayoutDashboard size={18} className={isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                            {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Dashboard</span>}
                            {isActive('/dashboard') && !isSidebarCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                            )}
                        </Link>

                        {/* Habits */}
                        {moduleSettings.habit && (
                            <Link 
                                href="/habits"
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                                } ${
                                    isActive('/habits')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Flame size={18} className={isActive('/habits') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Habits</span>}
                                {isActive('/habits') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Planner */}
                        {moduleSettings.planner && (
                            <Link 
                                href="/planner"
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                                } ${
                                    isActive('/planner')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Calendar size={18} className={isActive('/planner') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Planner</span>}
                                {isActive('/planner') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Finance */}
                        {moduleSettings.finance && (
                            <Link 
                                href="/finance"
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                                } ${
                                    isActive('/finance')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Wallet size={18} className={isActive('/finance') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Finance</span>}
                                {isActive('/finance') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Study */}
                        <Link 
                            href="/study"
                            className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                            } ${
                                isActive('/study')
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                            }`}
                        >
                            <GraduationCap size={18} className={isActive('/study') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                            {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Study</span>}
                            {isActive('/study') && !isSidebarCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                            )}
                        </Link>
                    </div>
                )}

                <div className="h-3" />

                {/* ── 2. PLATINUM SUITE SECTION ── */}
                <button
                    type="button"
                    onClick={togglePlatinum}
                    className={`w-full flex items-center justify-between px-2 py-1.5 mb-0.5 rounded-lg group transition-all duration-200 ${
                        isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                >
                    {isSidebarCollapsed ? (
                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-2" />
                    ) : (
                        <>
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 tracking-wide ml-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                                Platinum Suite
                            </span>
                            <ChevronDown size={10} className={`text-slate-300 transition-transform duration-200 ${platinumExpanded ? '' : '-rotate-90'}`} />
                        </>
                    )}
                </button>

                {(platinumExpanded || isSidebarCollapsed) && (
                    <div className="space-y-0.5">
                        {/* Journal */}
                        {moduleSettings.journal && (
                            <Link 
                                href="/journal"
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                                } ${
                                    isActive('/journal')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <BookOpen size={18} className={isActive('/journal') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Journal</span>}
                                {isActive('/journal') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Calendar */}
                        {moduleSettings.calendar && (
                            <Link 
                                href="/calendar"
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                                } ${
                                    isActive('/calendar')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <CalendarDays size={18} className={isActive('/calendar') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Calendar</span>}
                                {isActive('/calendar') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Jobs */}
                        {moduleSettings.job && (
                            <Link 
                                href="/jobs"
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                                } ${
                                    isActive('/jobs')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Briefcase size={18} className={isActive('/jobs') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Jobs</span>}
                                {isActive('/jobs') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Goals */}
                        {moduleSettings.goal && (
                            <Link 
                                href="/goals"
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                                } ${
                                    isActive('/goals')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Target size={18} className={isActive('/goals') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[15px] font-semibold tracking-tight truncate">Goals</span>}
                                {isActive('/goals') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}
                    </div>
                )}

                <div className="h-3" />

                {/* ── 3. NEURAL OS SECTION ── */}
                <div className="px-2 py-1.5 mb-0.5">
                    {!isSidebarCollapsed && (
                        <span className="text-[9px] font-black text-indigo-400/80 dark:text-indigo-600/80 tracking-wide ml-1">
                            Neural OS
                        </span>
                    )}
                </div>

                <Link 
                    href="/coach"
                    className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                        isSidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2 gap-3'
                    } ${
                        isActive('/coach')
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 hover:text-indigo-700 font-medium'
                    }`}
                >
                    <Sparkles size={18} className="text-indigo-500 shrink-0" />
                    {!isSidebarCollapsed && (
                        <>
                            <span className="text-[15px] font-semibold tracking-tight truncate flex-1 text-left">Coach</span>
                            <span className="text-[8px] font-black text-indigo-500 uppercase bg-indigo-100 dark:bg-indigo-500/20 px-1.5 py-0.5 rounded-full shrink-0">AI</span>
                        </>
                    )}
                    {isActive('/coach') && !isSidebarCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r-full" />
                    )}
                </Link>

                {/* ── 4. TRIAL PROGRESS CARD ── */}
                {trial.isActive && !isSidebarCollapsed && (
                    <div className="pt-4 px-1">
                        <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/40 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                                    <Zap size={11} className="text-amber-500 fill-amber-500" />
                                    <span>Pro Free Trial</span>
                                </div>
                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                                    {locale === 'id' ? `${trial.daysRemaining} hari` : `${trial.daysRemaining}d left`}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mb-2">
                                {locale === 'id' ? 'Akses penuh seluruh modul aktif.' : 'Full access to all modules active.'}
                            </p>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 h-1.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, Math.max(10, ((14 - trial.daysRemaining) / 14) * 100))}%` }}
                                />
                            </div>
                            <Link
                                href="/billing"
                                className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95"
                            >
                                <Crown size={10} />
                                <span>{locale === 'id' ? 'Kunci Akses' : 'Keep Access'}</span>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    );
}
