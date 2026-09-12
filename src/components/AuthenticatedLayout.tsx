'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";
import { createClient } from "@/utils/supabase/client";
import { getTrialStatus } from '@/lib/auth/subscription';

import AuthHeader from './layout/AuthHeader';
import AuthSidebar from './layout/AuthSidebar';
import AuthLogoutModal from './layout/AuthLogoutModal';
import AuthCoachFloatingButton from './layout/AuthCoachFloatingButton';
import AuthMobileBottomNav from './layout/AuthMobileBottomNav';
import ActiveModulesSetupModal from './ActiveModulesSetupModal';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    user?: any;
}

export default function AuthenticatedLayout({ children, user: initialUser }: AuthenticatedLayoutProps) {
    const t = useTranslations();
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const { data: session, status } = useSession();
    
    // User data derived from session
    const user = session?.user ? {
        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
        email: session.user.email || '',
        plan_type: (session.user as any).planType || 'Explorer',
        avatar_url: session.user.user_metadata?.avatar_url || null,
        created_at: session.user.created_at,
        trial_started_at: (session.user as any).trialStartedAt,
        trial_ends_at: (session.user as any).trialEndsAt,
        is_premium: (session.user as any).isPremium,
    } : initialUser ? initialUser : {
        name: status === 'loading' ? 'Loading...' : 'Guest',
        email: status === 'loading' ? '...' : '',
        plan_type: 'Explorer',
        avatar_url: null,
    };

    const trial = getTrialStatus(session?.user || user);
    const isExplorer = (!user?.plan_type || user.plan_type.toLowerCase() === 'explorer') && !trial.isActive;
    const isUnlimited = Boolean(user?.is_premium) || trial.isActive || (user?.plan_type && user.plan_type.toLowerCase() !== 'explorer' && !trial.isExpired);

    // Layout States
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
        study: true,
        journal: true,
        calendar: true,
        job: true,
        goal: true,
    });

    // If unlimited (Architect / Quantum / 14-day credit card trial), all 8 modules are unlocked
    const effectiveModuleSettings = useMemo(() => {
        if (isUnlimited) {
            return {
                habit: true,
                planner: true,
                finance: true,
                study: true,
                journal: true,
                calendar: true,
                job: true,
                goal: true,
            };
        }
        return moduleSettings;
    }, [isUnlimited, moduleSettings]);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleStorage = () => {
            const saved = localStorage.getItem('tranvas_user_settings');
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

    useEffect(() => {
        setIsMobileDrawerOpen(false);
    }, [pathname]);

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
            localStorage.removeItem('tranvas_user_profile');
            localStorage.removeItem('tranvas_auth');
        } catch (e) {
            console.error(e);
        }
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const goToCoachWithContext = () => {
        router.push('/coach');
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white relative transition-colors duration-500">
            
            {/* GLOBAL AUTH HEADER */}
            <AuthHeader
                isDesktop={isDesktop}
                isSidebarCollapsed={isSidebarCollapsed}
                isMobileDrawerOpen={isMobileDrawerOpen}
                setIsMobileDrawerOpen={setIsMobileDrawerOpen}
                toggleSidebar={toggleSidebar}
                t={t}
                locale={locale}
                todayLabel={todayLabel}
                trial={trial}
                isExplorer={isExplorer}
                isDark={isDark}
                toggleTheme={toggleTheme}
                user={user}
                workingStatus={workingStatus}
                setWorkingStatus={setWorkingStatus}
                statusOptions={statusOptions}
                currentStatus={currentStatus}
                showProfileDropdown={showProfileDropdown}
                setShowProfileDropdown={setShowProfileDropdown}
                switchLang={switchLang}
                onOpenLogoutModal={() => setShowLogoutModal(true)}
            />

            {/* BODY WITH SIDEBAR & MAIN CONTENT */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* Mobile Drawer Overlay */}
                {(!isDesktop && isMobileDrawerOpen) && (
                    <div 
                        className="fixed inset-0 top-[72px] sm:top-16 bg-slate-900/50 z-[60] md:hidden backdrop-blur-sm transition-opacity animate-in fade-in" 
                        onClick={() => setIsMobileDrawerOpen(false)}
                    />
                )}

                {/* SIDEBAR */}
                <AuthSidebar
                    isDesktop={isDesktop}
                    isSidebarCollapsed={isSidebarCollapsed}
                    isMobileDrawerOpen={isMobileDrawerOpen}
                    coreExpanded={coreExpanded}
                    platinumExpanded={platinumExpanded}
                    moduleSettings={effectiveModuleSettings}
                    trial={trial}
                    locale={locale}
                    pathname={pathname}
                    toggleCore={toggleCore}
                    togglePlatinum={togglePlatinum}
                    isActive={isActive}
                />

                {/* MAIN CONTENT AREA */}
                <main className={`flex-1 relative w-full bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0 transition-colors duration-500 custom-scrollbar ${
                    pathname?.includes('/coach') ? '!pb-0 flex flex-col overflow-hidden' : 'overflow-y-auto'
                }`}>
                    <div key={pathname} className={`w-full relative z-0 px-0 pb-8 md:pb-10 animate-slide-up-fade ${pathname?.includes('/coach') ? '!pb-0 flex-1 flex flex-col min-h-0' : ''}`}>
                        {children}
                    </div>
                </main>
            </div>

            {/* LOGOUT CONFIRMATION MODAL */}
            <AuthLogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={handleLogout}
            />

            {/* INITIAL 3-TAB SETUP MODAL */}
            <ActiveModulesSetupModal />

            {/* FLOATING AI COACH BUTTON */}
            <AuthCoachFloatingButton
                pathname={pathname}
                onClick={goToCoachWithContext}
            />

            {/* MOBILE BOTTOM NAVIGATION BAR */}
            <AuthMobileBottomNav moduleSettings={effectiveModuleSettings} />

        </div>
    );
}
