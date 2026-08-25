'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import ModalPortal from '@/components/ModalPortal';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Zap,
    Calendar,
    Wallet,
    BookOpen,
    GraduationCap,
    CalendarDays,
    Briefcase,
    Target,
    Sparkles,
    Search,
    Bell,
    HelpCircle,
    Sun,
    Moon,
    Menu,
    X,
    ChevronDown,
    LogOut,
    User,
    Settings as SettingsIcon,
    Crown,
    Lock,
    Check,
    ChevronRight,
    MessageSquare,
    Flame
} from 'lucide-react';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    user?: any;
}

export default function AuthenticatedLayout({ children, user: initialUser }: AuthenticatedLayoutProps) {
    const t = useTranslations();
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const { data: session } = useSession();
    
    // We derive the user data directly from the active NextAuth session
    const user = session?.user ? {
        name: session.user.name || 'User',
        email: session.user.email || '',
        plan_type: 'Architect', // Mocking plan_type for now since it's not in default JWT
        avatar_url: session.user.image || null,
    } : initialUser || {
        name: 'Alexander',
        email: 'alexander@oneformind.com',
        plan_type: 'Architect',
        avatar_url: null,
    };

    const isExplorer = !user?.plan_type || user.plan_type.toLowerCase() === 'explorer';

    // State matching AuthenticatedLayout.vue line 17-57
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [coreExpanded, setCoreExpanded] = useState(true);
    const [platinumExpanded, setPlatinumExpanded] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [workingStatus, setWorkingStatus] = useState('active');
    const [isDesktop, setIsDesktop] = useState(true);

    const [moduleSettings, setModuleSettings] = useState<Record<string, boolean>>({
        habit: true,
        planner: true,
        finance: true,
        journal: true,
        calendar: true,
        job: true,
        goal: true,
    });

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleStorage = () => {
            const saved = localStorage.getItem('oneformind_user_settings');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.modules) {
                        setModuleSettings(prev => ({ ...prev, ...parsed.modules }));
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        handleStorage();
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebar_collapsed');
        if (savedState !== null) setIsSidebarCollapsed(savedState === 'true');

        const savedCore = localStorage.getItem('sidebar_core_expanded');
        if (savedCore !== null) setCoreExpanded(savedCore !== 'false');

        const savedPlatinum = localStorage.getItem('sidebar_platinum_expanded');
        if (savedPlatinum !== null) setPlatinumExpanded(savedPlatinum !== 'false');

        const isThemeDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isThemeDark) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    useEffect(() => {
        // Programmatically prefetch all authenticated dashboard route bundles for instant transitions
        const routes = [
            '/dashboard',
            '/habits',
            '/planner',
            '/finance',
            '/journal',
            '/calendar',
            '/jobs',
            '/goals',
            '/settings',
            '/billing'
        ];
        routes.forEach(route => {
            router.prefetch(route);
        });
    }, [router]);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('sidebar_collapsed', String(newState));
    };

    const toggleCore = () => {
        if (isSidebarCollapsed) return;
        const newState = !coreExpanded;
        setCoreExpanded(newState);
        localStorage.setItem('sidebar_core_expanded', String(newState));
    };

    const togglePlatinum = () => {
        if (isSidebarCollapsed) return;
        const newState = !platinumExpanded;
        setPlatinumExpanded(newState);
        localStorage.setItem('sidebar_platinum_expanded', String(newState));
    };

    const switchLang = (newLocale: string) => {
        if (newLocale === locale) return;
        window.dispatchEvent(new CustomEvent('switch-locale', { detail: { locale: newLocale } }));
    };

    const statusOptions = [
        { key: 'active', label: 'Active', dot: 'bg-emerald-500' },
        { key: 'away', label: 'Away', dot: 'bg-amber-400' },
        { key: 'busy', label: 'Do Not Disturb', dot: 'bg-rose-500' },
        { key: 'offline', label: 'Appear Offline', dot: 'bg-slate-400' },
    ];
    const currentStatus = statusOptions.find(s => s.key === workingStatus) || statusOptions[0];

    const todayLabel = new Date().toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'short', day: 'numeric', month: 'short'
    });

    const isActive = (path: string) => {
        if (path === '/dashboard' && (pathname === '/dashboard' || pathname === '/')) return true;
        return pathname?.startsWith(path);
    };

    const handleLogout = async () => {
        setShowLogoutModal(false);
        try {
            localStorage.removeItem('oneformind_user_profile');
            localStorage.removeItem('oneformind_auth');
        } catch (e) {
            console.error(e);
        }
        await signOut({ callbackUrl: '/login' });
    };

    const goToCoachWithContext = () => {
        let contextMsg = '';
        if (pathname?.includes('/habits')) contextMsg = 'Saya sedang melihat halaman Habit. Berikan saya audit singkat atau saran mengenai habit saya saat ini.';
        else if (pathname?.includes('/finance')) contextMsg = 'Saya sedang melihat halaman Keuangan. Tolong analisis pengeluaran dan pemasukan saya bulan ini.';
        else if (pathname?.includes('/planner')) contextMsg = 'Saya sedang melihat halaman Planner. Bantu saya menyusun prioritas tugas hari ini.';
        else if (pathname?.includes('/journal')) contextMsg = 'Saya sedang melihat halaman Jurnal. Berikan insight atau prompt refleksi diri untuk hari ini.';
        else if (pathname?.includes('/calendar')) contextMsg = 'Saya sedang melihat halaman Kalender. Bagaimana jadwal saya saat ini?';
        else if (pathname?.includes('/goals')) contextMsg = 'Saya sedang melihat halaman Goals. Apa langkah terbaik untuk mencapai target saya?';
        else if (pathname?.includes('/jobs')) contextMsg = 'Saya sedang melihat halaman Lamaran Kerja. Berikan tips terkait pencarian kerja saya.';
        
        router.push('/coach');
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white relative transition-colors duration-500">
            
            {/* 1:1 GLOBAL HEADER (UNIFIED DESIGN) */}
            <header className="h-[72px] sm:h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/60 sticky top-0 z-[70] transition-all duration-500 shadow-sm">
                <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
                    
                    {/* LEFT: HAMBURGER + LOGO */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        {/* UNIFIED ANIMATED HAMBURGER */}
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

                        {/* UNIFIED LOGO (Matches Marketing Site) */}
                        <Link href="/dashboard" className="group flex items-center gap-2 z-[110] hover:opacity-80 transition-opacity">
                            <div className="w-9 h-9 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
                                <img src="/favicon.svg" alt="OneForMind Logo" className="w-5 h-5 sm:w-4 sm:h-4 brightness-0 invert" />
                            </div>
                            <span className="text-[17px] font-black text-slate-900 dark:text-white tracking-tight hidden sm:block">OneForMind</span>
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
                    <div className="flex shrink-0 items-center gap-1 sm:gap-1">
                        {/* Date Pill */}
                        <div className="hidden md:block relative mr-1.5">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 text-xs font-black text-slate-600 dark:text-slate-300 shadow-sm border border-transparent hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                <CalendarDays size={13} className="text-slate-400" />
                                <span className="whitespace-nowrap">{todayLabel}</span>
                            </div>
                        </div>

                        {/* Upgrade CTA */}
                        {isExplorer && (
                            <Link 
                                href="/billing" 
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg transition-all shadow-sm active:scale-95 mr-1"
                            >
                                <Crown size={11} />
                                <span className="text-[10px] font-black uppercase tracking-wide">Upgrade</span>
                            </Link>
                        )}

                        {/* Notifications */}
                        <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                        </button>

                        {/* Help */}
                        <Link href="/settings?tab=help" className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                            <HelpCircle size={18} />
                        </Link>

                        {/* Theme Toggle */}
                        <button type="button" onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
                        </button>

                        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1.5"></div>

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
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px] border-white dark:border-slate-900 ${currentStatus.dot}`}></div>
                                </div>
                                <span className="hidden lg:block text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[80px]">
                                    {user?.name?.split(' ')[0]}
                                </span>
                                <ChevronDown size={11} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                            </button>

                            {/* Profile Menu Popup */}
                            {showProfileDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)}></div>
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
                                                {user?.plan_type || 'Architect'}
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
                                                        <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`}></span>
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
                                        {isExplorer && (
                                            <div className="px-2 pb-2">
                                                <Link 
                                                    href="/billing"
                                                    onClick={() => setShowProfileDropdown(false)}
                                                    className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-black text-[11px] uppercase tracking-wide transition-all active:scale-95 shadow-sm shadow-indigo-200 dark:shadow-none"
                                                >
                                                    <Crown size={11} />
                                                    <span>Upgrade to Architect</span>
                                                </Link>
                                            </div>
                                        )}

                                        <div className="border-t border-slate-100 dark:border-slate-800 p-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowProfileDropdown(false);
                                                    setShowLogoutModal(true);
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

            {/* 1:1 BODY LAYOUT WITH SIDEBAR & MAIN (Line 143-239) */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* 1:1 DESKTOP SIDEBAR (AppSidebarNav.vue 1:1 hierarchy) */}
                <aside 
                    className={`bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 hidden md:flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none shrink-0 transition-all duration-300 ease-in-out relative ${
                        isSidebarCollapsed ? 'w-[68px]' : 'w-[232px]'
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
                                <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-2"></div>
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
                                    {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Dashboard</span>}
                                    {isActive('/dashboard') && !isSidebarCollapsed && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
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
                                        {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Habits</span>}
                                        {isActive('/habits') && !isSidebarCollapsed && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
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
                                        {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Planner</span>}
                                        {isActive('/planner') && !isSidebarCollapsed && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
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
                                        {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Finance</span>}
                                        {isActive('/finance') && !isSidebarCollapsed && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
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
                                    {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Study</span>}
                                    {isActive('/study') && !isSidebarCollapsed && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
                                    )}
                                </Link>
                            </div>
                        )}

                        <div className="h-3"></div>

                        {/* ── 2. PLATINUM SUITE SECTION ── */}
                        <button
                            type="button"
                            onClick={togglePlatinum}
                            className={`w-full flex items-center justify-between px-2 py-1.5 mb-0.5 rounded-lg group transition-all duration-200 ${
                                isSidebarCollapsed ? 'justify-center' : ''
                            }`}
                        >
                            {isSidebarCollapsed ? (
                                <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-2"></div>
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
                                        {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Journal</span>}
                                        {isActive('/journal') && !isSidebarCollapsed && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
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
                                        {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Calendar</span>}
                                        {isActive('/calendar') && !isSidebarCollapsed && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
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
                                        {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Jobs</span>}
                                        {isActive('/jobs') && !isSidebarCollapsed && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
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
                                        {!isSidebarCollapsed && <span className="text-[13px] font-semibold tracking-tight truncate">Goals</span>}
                                        {isActive('/goals') && !isSidebarCollapsed && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full"></div>
                                        )}
                                    </Link>
                                )}
                            </div>
                        )}

                        <div className="h-3"></div>

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
                                    <span className="text-[13px] font-semibold tracking-tight truncate flex-1 text-left">Coach</span>
                                    <span className="text-[8px] font-black text-indigo-500 uppercase bg-indigo-100 dark:bg-indigo-500/20 px-1.5 py-0.5 rounded-full shrink-0">AI</span>
                                </>
                            )}
                            {isActive('/coach') && !isSidebarCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r-full"></div>
                            )}
                        </Link>
                    </nav>
                </aside>

                {/* 1:1 MAIN CONTENT AREA (Line 231-238) */}
                <main className={`flex-1 relative w-full bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0 transition-colors duration-500 custom-scrollbar ${
                    pathname?.includes('/coach') ? '!pb-0 flex flex-col overflow-hidden' : 'overflow-y-auto'
                }`}>
                    <div key={pathname} className={`w-full relative z-0 px-0 pb-8 md:pb-10 animate-slide-up-fade ${pathname?.includes('/coach') ? '!pb-0 flex-1 flex flex-col min-h-0' : ''}`}>
                        {children}
                    </div>
                </main>
            </div>

            {/* 1:1 LOGOUT MODAL (Line 241-305) */}
            {showLogoutModal && (
                <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60" onClick={() => setShowLogoutModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <LogOut size={36} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
                                Keluar Akun?
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                Sesi Anda akan diakhiri.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full bg-rose-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-600 active:scale-[0.98] transition-all"
                            >
                                Ya, Keluar
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div></ModalPortal>
            )}

            {/* 1:1 FLOATING AI COACH BUTTON (Line 307-343) */}
            {!pathname?.includes('/coach') && (
                <button
                    type="button"
                    onClick={goToCoachWithContext}
                    className="hidden md:block fixed bottom-10 right-10 z-[100] group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                        <div className="relative w-14 h-14 bg-slate-900 dark:bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 active:scale-95 ring-4 ring-white dark:ring-slate-950 group-hover:ring-indigo-50 dark:group-hover:ring-indigo-500/20 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Sparkles size={24} strokeWidth={2} className="text-white group-hover:rotate-[20deg] transition-transform duration-500 relative z-10" />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse z-20"></span>
                        </div>
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-4 py-2.5 rounded-2xl whitespace-nowrap opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-2xl border border-white/10 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span>Neural OS AI Active</span>
                        </div>
                    </div>
                </button>
            )}

        </div>
    );
}
