'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import {
    Search,
    CalendarDays,
    Crown,
    Zap,
    Bell,
    HelpCircle,
    Sun,
    Moon,
    ChevronDown,
    User,
    Settings as SettingsIcon,
    LogOut
} from 'lucide-react';

interface AuthHeaderProps {
    isDesktop: boolean;
    isSidebarCollapsed: boolean;
    isMobileDrawerOpen: boolean;
    setIsMobileDrawerOpen: (v: boolean) => void;
    toggleSidebar: () => void;
    t: any;
    locale: string;
    todayLabel: string;
    trial: { isActive: boolean; daysRemaining: number };
    isExplorer: boolean;
    isDark: boolean;
    toggleTheme: () => void;
    user: any;
    workingStatus: string;
    setWorkingStatus: (s: string) => void;
    statusOptions: Array<{ key: string; label: string; dot: string }>;
    currentStatus: { key: string; label: string; dot: string };
    showProfileDropdown: boolean;
    setShowProfileDropdown: (show: boolean) => void;
    switchLang: (locale: string) => void;
    onOpenLogoutModal: () => void;
}

export default function AuthHeader({
    isDesktop,
    isSidebarCollapsed,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    toggleSidebar,
    t,
    locale,
    todayLabel,
    trial,
    isExplorer,
    isDark,
    toggleTheme,
    user,
    workingStatus,
    setWorkingStatus,
    statusOptions,
    currentStatus,
    showProfileDropdown,
    setShowProfileDropdown,
    switchLang,
    onOpenLogoutModal
}: AuthHeaderProps) {
    return (
        <header className="h-[72px] sm:h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/60 sticky top-0 z-[70] transition-all duration-500 shadow-sm">
            <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
                
                {/* LEFT: HAMBURGER + LOGO */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <button 
                        type="button"
                        onClick={() => {
                            if (!isDesktop) {
                                setIsMobileDrawerOpen(!isMobileDrawerOpen);
                            } else {
                                toggleSidebar();
                            }
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-900 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        <div className="w-5 flex flex-col items-end gap-[5px]">
                            <span className={`h-[2px] bg-current transition-all duration-300 ${(!isSidebarCollapsed && isDesktop) || (isMobileDrawerOpen && !isDesktop) ? 'rotate-45 translate-y-[7px] w-5' : 'w-5'}`} />
                            <span className={`h-[2px] bg-current transition-all duration-300 ${(!isSidebarCollapsed && isDesktop) || (isMobileDrawerOpen && !isDesktop) ? 'opacity-0' : 'w-3.5'}`} />
                            <span className={`h-[2px] bg-current transition-all duration-300 ${(!isSidebarCollapsed && isDesktop) || (isMobileDrawerOpen && !isDesktop) ? '-rotate-45 -translate-y-[7px] w-5' : 'w-4'}`} />
                        </div>
                    </button>

                    <Link href="/dashboard" className="group flex items-center gap-2 z-[110] hover:opacity-80 transition-opacity">
                        <div className="w-9 h-9 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
                            <img src="/favicon.svg" alt="Tranvas Logo" className="w-5 h-5 sm:w-4 sm:h-4 brightness-0 invert" />
                        </div>
                        <span className="text-[17px] font-black text-slate-900 dark:text-white tracking-tight">Tranvas</span>
                    </Link>
                </div>

                {/* CENTER: SEARCH BAR */}
                <div className="relative hidden min-w-0 max-w-lg flex-1 px-1 md:block md:px-2">
                    <div className="flex w-full items-center gap-3 rounded-2xl border-2 border-transparent bg-slate-100/60 px-4 py-2.5 shadow-sm transition-all hover:border-indigo-100 hover:bg-white dark:bg-slate-800/60 dark:hover:border-indigo-500/20 dark:hover:bg-slate-800">
                        <Search size={14} className="text-slate-400" />
                        <span className="text-[13px] font-bold text-slate-400 dark:text-slate-500">
                            {t('nav_search_anything') || 'Search anything...'}
                        </span>
                    </div>
                </div>

                {/* RIGHT: ACTIONS & PROFILE */}
                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                    {/* Date Pill */}
                    <div className="hidden md:block relative mr-1.5">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 text-xs font-black text-slate-600 dark:text-slate-300 shadow-sm border border-transparent hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <CalendarDays size={13} className="text-slate-400" />
                            <span className="whitespace-nowrap">{todayLabel}</span>
                        </div>
                    </div>

                    {/* Upgrade CTA or Active Trial Pill */}
                    {trial.isActive ? (
                        <Link 
                            href="/billing" 
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-xl transition-all shadow-sm active:scale-95 mr-1 group"
                            title="14-Day Free Trial Active"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                            </span>
                            <Zap size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-[11px] font-black tracking-tight">
                                {locale === 'id' ? `Trial: ${trial.daysRemaining} Hari Lagi` : `Trial: ${trial.daysRemaining}d left`}
                            </span>
                        </Link>
                    ) : isExplorer ? (
                        <Link 
                            href="/billing" 
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg transition-all shadow-sm active:scale-95 mr-1"
                        >
                            <Crown size={11} />
                            <span className="text-[10px] font-black uppercase tracking-wide">Upgrade</span>
                        </Link>
                    ) : null}

                    {/* Notifications */}
                    <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                    </button>

                    {/* Help */}
                    <Link href="/settings?tab=help" className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <HelpCircle size={18} />
                    </Link>

                    {/* Theme Toggle */}
                    <button type="button" onClick={toggleTheme} className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
                    </button>

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 sm:mx-1.5" />

                    {/* PROFILE DROPDOWN */}
                    <div className="relative">
                        <button 
                            type="button"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                        >
                            <div className="relative">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-lg object-cover shadow-sm" />
                                ) : (
                                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                                        {user?.name?.charAt(0)}
                                    </div>
                                )}
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px] border-white dark:border-slate-900 ${currentStatus.dot}`} />
                            </div>
                            <span className="hidden lg:block text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[80px]">
                                {user?.name?.split(' ')[0]}
                            </span>
                            <ChevronDown size={11} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </button>

                        {/* Profile Menu Popup */}
                        {showProfileDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[11px] font-black capitalize shrink-0">
                                                {user?.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[12px] font-black text-slate-800 dark:text-white truncate leading-none">{user?.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <span className="shrink-0 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                            {trial.isActive ? (locale === 'id' ? `Trial (${trial.daysRemaining}h)` : `Trial (${trial.daysRemaining}d)`) : (user?.plan_type || 'Explorer')}
                                        </span>
                                    </div>

                                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Working Status</p>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {statusOptions.map(s => (
                                                <button
                                                    key={s.key}
                                                    type="button"
                                                    onClick={() => setWorkingStatus(s.key)}
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                                        workingStatus === s.key
                                                            ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white'
                                                            : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                                                    <span>{s.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Language</p>
                                            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => switchLang('id')}
                                                    className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all ${
                                                        locale === 'id' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                                                    }`}
                                                >ID</button>
                                                <button
                                                    type="button"
                                                    onClick={() => switchLang('en')}
                                                    className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all ${
                                                        locale === 'en' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                                                    }`}
                                                >EN</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-1.5 space-y-0.5">
                                        <Link 
                                            href="/settings"
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-700 dark:text-slate-200 text-[12px] font-medium"
                                        >
                                            <User size={15} className="text-slate-400" />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link 
                                            href="/settings"
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-700 dark:text-slate-200 text-[12px] font-medium"
                                        >
                                            <SettingsIcon size={15} className="text-slate-400" />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={toggleTheme}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-700 dark:text-slate-200 text-[12px] font-medium"
                                        >
                                            {isDark ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-slate-400" />}
                                            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                        </button>
                                    </div>

                                    {/* Upgrade CTA inside dropdown */}
                                    {(isExplorer || trial.isActive) && (
                                        <div className="px-2 pb-2">
                                            <Link 
                                                href="/billing" 
                                                onClick={() => setShowProfileDropdown(false)}
                                                className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-black text-[11px] uppercase tracking-wide transition-all active:scale-95 shadow-sm shadow-indigo-200 dark:shadow-none"
                                            >
                                                <Crown size={11} />
                                                <span>{trial.isActive ? (locale === 'id' ? 'Kunci Akses Pro (Diskon 40%)' : 'Keep Pro Access (Save 40%)') : 'Upgrade to Architect'}</span>
                                            </Link>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-100 dark:border-slate-800 p-1.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowProfileDropdown(false);
                                                onOpenLogoutModal();
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all text-left text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 text-[12px] font-medium"
                                        >
                                            <LogOut size={15} className="text-slate-400 hover:text-rose-500" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}
