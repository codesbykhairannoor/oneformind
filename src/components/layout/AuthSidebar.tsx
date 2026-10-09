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
    Zap,
    Settings,
    ShieldCheck,
    X
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
    isAdmin?: boolean;
    onCloseMobileDrawer?: () => void;
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
    isActive,
    isAdmin = false,
    onCloseMobileDrawer
}: AuthSidebarProps) {
    const handleNavClick = () => {
        if (onCloseMobileDrawer) {
            onCloseMobileDrawer();
        }
    };

    return (
        <aside 
            aria-label="Application Navigation Drawer"
            className={`bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
                /* Mobile: sleek off-canvas drawer sliding from the left */
                `fixed top-0 bottom-0 left-0 z-[80] w-[285px] sm:w-[320px] max-w-[84vw] rounded-r-3xl shadow-2xl border-r border-slate-200/90 dark:border-slate-800/90 ${
                    isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                } ` +
                /* Desktop: standard in-flow column */
                `md:static md:top-auto md:bottom-auto md:left-auto md:z-[10] md:translate-x-0 md:rounded-none md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:dark:shadow-none md:border-r md:h-full ${
                    isSidebarCollapsed ? 'md:w-[68px]' : 'md:w-[232px]'
                }`
            }`}
        >
            {/* MOBILE DRAWER HEADER */}
            <div className="md:hidden flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <img src="/favicon.svg" alt="Tranvas Logo" className="w-4 h-4 brightness-0 invert" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-black text-slate-900 dark:text-white tracking-tight">Tranvas</span>
                            <span className="text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">PRO</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium leading-none">Life OS Ecosystem</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onCloseMobileDrawer}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
                    aria-label="Tutup Menu"
                >
                    <X size={16} />
                </button>
            </div>

            <nav className={`flex-1 overflow-y-auto py-2.5 custom-scrollbar space-y-0.5 pb-8 md:pb-4 ${isSidebarCollapsed ? 'px-2' : 'px-2.5'}`}>
                
                {/* ── 1. SYSTEM CORE SECTION ── */}
                <button
                    type="button"
                    onClick={toggleCore}
                    className={`w-full flex items-center justify-between px-2 py-1 mb-0.5 rounded-lg group transition-all duration-200 ${
                        isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                >
                    {isSidebarCollapsed ? (
                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-1.5" />
                    ) : (
                        <>
                            <span className="text-[9.5px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase ml-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
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
                            onClick={handleNavClick}
                            className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                            } ${
                                isActive('/dashboard')
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                            }`}
                        >
                            <LayoutDashboard size={17} className={isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                            {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Dashboard</span>}
                            {isActive('/dashboard') && !isSidebarCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                            )}
                        </Link>

                        {/* Habits */}
                        {moduleSettings.habit && (
                            <Link 
                                href="/habits"
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/habits')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Flame size={17} className={isActive('/habits') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Habits</span>}
                                {isActive('/habits') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Planner */}
                        {moduleSettings.planner && (
                            <Link 
                                href="/planner"
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/planner')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Calendar size={17} className={isActive('/planner') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Planner</span>}
                                {isActive('/planner') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Finance */}
                        {moduleSettings.finance && (
                            <Link 
                                href="/finance"
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/finance')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Wallet size={17} className={isActive('/finance') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Finance</span>}
                                {isActive('/finance') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Study */}
                        {moduleSettings.study !== false && (
                            <Link 
                                href="/study"
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/study')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <GraduationCap size={17} className={isActive('/study') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Study</span>}
                                {isActive('/study') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}
                    </div>
                )}

                <div className="h-2" />

                {/* ── 2. PLATINUM SUITE SECTION ── */}
                <button
                    type="button"
                    onClick={togglePlatinum}
                    className={`w-full flex items-center justify-between px-2 py-1 mb-0.5 rounded-lg group transition-all duration-200 ${
                        isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                >
                    {isSidebarCollapsed ? (
                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-1.5" />
                    ) : (
                        <>
                            <span className="text-[9.5px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase ml-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
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
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/journal')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <BookOpen size={17} className={isActive('/journal') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Journal</span>}
                                {isActive('/journal') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Calendar */}
                        {moduleSettings.calendar && (
                            <Link 
                                href="/calendar"
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/calendar')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <CalendarDays size={17} className={isActive('/calendar') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Calendar</span>}
                                {isActive('/calendar') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Jobs */}
                        {moduleSettings.job && (
                            <Link 
                                href="/jobs"
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/jobs')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Briefcase size={17} className={isActive('/jobs') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Jobs</span>}
                                {isActive('/jobs') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}

                        {/* Goals */}
                        {moduleSettings.goal && (
                            <Link 
                                href="/goals"
                                onClick={handleNavClick}
                                className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                    isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                                } ${
                                    isActive('/goals')
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                                }`}
                            >
                                <Target size={17} className={isActive('/goals') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold tracking-tight truncate">Goals</span>}
                                {isActive('/goals') && !isSidebarCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                                )}
                            </Link>
                        )}
                    </div>
                )}

                <div className="h-2" />

                {/* ── 3. NEURAL OS SECTION ── */}
                <div className="px-2 py-1 mb-0.5">
                    {!isSidebarCollapsed && (
                        <span className="text-[9.5px] font-black text-indigo-400/90 dark:text-indigo-500 tracking-wider uppercase ml-1">
                            Neural OS
                        </span>
                    )}
                </div>

                <Link 
                    href="/coach"
                    onClick={handleNavClick}
                    className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                        isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                    } ${
                        isActive('/coach')
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 hover:text-indigo-700 font-medium'
                    }`}
                >
                    <Sparkles size={17} className="text-indigo-500 shrink-0" />
                    {!isSidebarCollapsed && (
                        <>
                            <span className="text-[13.5px] font-semibold tracking-tight truncate flex-1 text-left">Coach</span>
                            <span className="text-[7.5px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-100 dark:bg-indigo-500/20 px-1.5 py-0.5 rounded-full shrink-0 tracking-wider">
                                QUANTUM
                            </span>
                        </>
                    )}
                    {isActive('/coach') && !isSidebarCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-500 rounded-r-full" />
                    )}
                </Link>


                {/* ── 4. TRIAL PROGRESS CARD ── */}
                {trial.isActive && !isSidebarCollapsed && (
                    <div className="pt-3 px-0.5">
                        <div className="p-3 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/40 border border-indigo-100 dark:border-indigo-500/20 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5 text-[9.5px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                                    <Zap size={11} className="text-amber-500 fill-amber-500" />
                                    <span>Pro Free Trial</span>
                                </div>
                                <span className="text-[9.5px] font-black text-indigo-600 dark:text-indigo-400">
                                    {locale === 'id' ? `${trial.daysRemaining} hari` : `${trial.daysRemaining}d left`}
                                </span>
                            </div>
                            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium leading-tight mb-2">
                                {locale === 'id' ? 'Akses penuh seluruh modul aktif.' : 'Full access to all modules active.'}
                            </p>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 h-1.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, Math.max(10, ((14 - trial.daysRemaining) / 14) * 100))}%` }}
                                />
                            </div>
                            <Link
                                href="/billing"
                                onClick={handleNavClick}
                                className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95"
                            >
                                <Crown size={10} />
                                <span>{locale === 'id' ? 'Kunci Akses' : 'Keep Access'}</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── 5. PREFERENCES & ADMIN ── */}
                <div className="h-2" />
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-0.5">
                    {/* Admin Console Link (Visible only to authorized platform administrators) */}
                    {isAdmin && (
                        <Link 
                            href="/admin"
                            onClick={handleNavClick}
                            className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                                isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                            } ${
                                isActive('/admin')
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30'
                                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-medium'
                            }`}
                        >
                            <ShieldCheck size={17} className={isActive('/admin') ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500'} />
                            {!isSidebarCollapsed && (
                                <>
                                    <span className="text-[13px] font-bold tracking-tight truncate flex-1 text-left">
                                        {locale === 'id' ? 'Konsol Admin' : 'Admin Console'}
                                    </span>
                                    <span className="text-[7.5px] font-black text-emerald-700 dark:text-emerald-300 uppercase bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0 tracking-wider">
                                        ADMIN
                                    </span>
                                </>
                            )}
                            {isActive('/admin') && !isSidebarCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500 rounded-r-full" />
                            )}
                        </Link>
                    )}

                    {/* Settings / Pengaturan Link */}
                    <Link 
                        href="/settings"
                        onClick={handleNavClick}
                        className={`relative flex items-center w-full rounded-xl transition-all duration-150 ${
                            isSidebarCollapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.5 gap-2.5'
                        } ${
                            isActive('/settings')
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                        }`}
                    >
                        <Settings size={17} className={isActive('/settings') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                        {!isSidebarCollapsed && (
                            <span className="text-[13px] font-semibold tracking-tight truncate">
                                {locale === 'id' ? 'Pengaturan' : 'Settings'}
                            </span>
                        )}
                        {isActive('/settings') && !isSidebarCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                        )}
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
