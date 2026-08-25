'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSession } from 'next-auth/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { 
    User, Lock, LayoutGrid, Bell, CreditCard, ShieldCheck, 
    HelpCircle, Download, Check, Save, Sparkles, ChevronRight,
    ExternalLink, Mail, MessageSquare, AlertCircle, ArrowRight
} from 'lucide-react';

export default function SettingsPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>('general');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['general', 'security', 'modules', 'notifications', 'billing', 'privacy', 'help'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tabId);
        window.history.pushState({}, '', url.pathname + url.search);
    };

    // Profile state
    const [name, setName] = useState('Alexander');
    const [email, setEmail] = useState('alexander@oneformind.com');

    // Security state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification toggles
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [dailySummary, setDailySummary] = useState(true);
    const [habitReminders, setHabitReminders] = useState(true);

    // Save notification
    const [savedMsg, setSavedMsg] = useState(false);

    // Modules state (from AppearanceTab.vue)
    const [modules, setModules] = useState<Record<string, boolean>>({
        habit: true,
        planner: true,
        finance: true,
        journal: true,
        calendar: true,
        job: true,
        goal: true,
    });

    // User subscription details from DB
    const [userData, setUserData] = useState<any>(null);
    const { status } = useSession();

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === 'authenticated') {
                try {
                    const res = await fetch('/api/user');
                    if (res.ok) {
                        const data = await res.json();
                        setUserData(data);
                        setName(data.name || '');
                        setEmail(data.email || '');
                        if (data.settings?.modules) {
                            setModules(prev => ({ ...prev, ...data.settings.modules }));
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };
        fetchUserData();
    }, [status]);

    const toggleModule = async (key: string) => {
        const nextModules = { ...modules, [key]: !modules[key] };
        setModules(nextModules);
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: { modules: nextModules } })
            });
            setSavedMsg(true);
            setTimeout(() => setSavedMsg(false), 2000);
        } catch (error) {
            console.error('Failed to update modules:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            setSavedMsg(true);
            setTimeout(() => setSavedMsg(false), 3000);
            window.dispatchEvent(new Event('auth_change')); // To trigger re-fetches elsewhere if needed
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const user = userData ? {
        name: userData.name,
        email: userData.email,
        plan_type: userData.planType || 'Explorer',
        is_premium: userData.isPremium || false,
        premium_until: userData.premiumUntil,
    } : {
        name,
        email,
        plan_type: 'Explorer',
        is_premium: false,
        premium_until: null,
    };

    const isExplorer = !user.is_premium;
    const planLabel = user.plan_type || 'Explorer';

    const premiumUntilFormatted = (() => {
        const raw = user?.premium_until;
        if (!raw) return null;
        const loc = locale === 'id' ? 'id-ID' : 'en-US';
        return new Date(raw).toLocaleDateString(loc, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    })();

    const tabs = [
        { id: 'general', label: t('settings_nav_general'), icon: User },
        { id: 'security', label: t('settings_nav_security'), icon: Lock },
        { id: 'modules', label: t('settings_nav_modules'), icon: LayoutGrid },
        { id: 'notifications', label: t('settings_nav_notifications'), icon: Bell },
        { id: 'billing', label: t('settings_nav_billing'), icon: CreditCard },
        { id: 'privacy', label: t('settings_nav_privacy'), icon: ShieldCheck },
        { id: 'help', label: t('settings_nav_help'), icon: HelpCircle },
    ];

    const tabMeta: Record<string, { title: string; subtitle: string }> = {
        general: { title: t('settings_page_general_title'), subtitle: t('settings_page_general_subtitle') },
        security: { title: t('settings_page_security_title'), subtitle: t('settings_page_security_subtitle') },
        modules: { title: t('settings_page_modules_title'), subtitle: t('settings_page_modules_subtitle') },
        notifications: { title: t('settings_page_notifications_title'), subtitle: t('settings_page_notifications_subtitle') },
        billing: { title: t('settings_page_billing_title'), subtitle: t('settings_page_billing_subtitle') },
        privacy: { title: t('settings_page_privacy_title'), subtitle: t('settings_page_privacy_subtitle') },
        help: { title: t('settings_page_help_title'), subtitle: t('settings_page_help_subtitle') },
    };

    const currentMeta = tabMeta[activeTab] || tabMeta.general;

    return (
        <AuthenticatedLayout>
            <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-10 pb-28">
                
                {/* Header */}
                <div style={{ marginBottom: '80px' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white tracking-tight">
                        {currentMeta.title}
                    </h1>
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
                        {currentMeta.subtitle}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="relative z-20 -mx-3 sm:mx-0 mb-6 sm:mb-8">
                    <div className="px-3 sm:px-0">
                        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm">
                            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 py-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`shrink-0 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/30 dark:shadow-none'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <Icon size={16} />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Save Feedback Banner */}
                {savedMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in duration-300">
                        <Check size={18} />
                        <span className="text-sm font-bold">{t('settings_saved_success')}</span>
                    </div>
                )}

                {/* Tab Content Box */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm">
                    
                    {/* TAB 1: GENERAL */}
                    {activeTab === 'general' && (
                        <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
                            <div>
                                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white mb-2">
                                    {t('profile_info_title')}
                                </h3>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400">
                                    {t('profile_info_desc')}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        {t('profile_label_name')}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        placeholder={t('profile_placeholder_name')}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        {t('profile_label_email')}
                                    </label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        placeholder={t('profile_placeholder_email')}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2">
                                    <Save size={16} />
                                    <span>{t('profile_btn_save')}</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 2: SECURITY */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
                            <div>
                                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white mb-2">
                                    {t('password_security_title')}
                                </h3>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400">
                                    {t('password_security_desc')}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        {t('current_password')}
                                    </label>
                                    <input 
                                        type="password" 
                                        value={currentPassword} 
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        {t('new_password')}
                                    </label>
                                    <input 
                                        type="password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                        {t('confirm_new_password')}
                                    </label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2">
                                    <Save size={16} />
                                    <span>{t('update_password')}</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 3: MODULES (1:1 from AppearanceTab.vue) */}
                    {activeTab === 'modules' && (
                        <div className="space-y-10 pb-12">
                            <div>
                                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-800 dark:text-white tracking-tight">
                                    {t('settings_modules_title')}
                                </h3>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400 mt-1">
                                    {t('settings_modules_desc')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(modules).map(([key, enabled]) => {
                                    const emojiMap: Record<string, string> = {
                                        habit: '🌱',
                                        planner: '📋',
                                        finance: '💸',
                                        journal: '📓',
                                        calendar: '📅',
                                        job: '💼',
                                        goal: '🎯'
                                    };
                                    const labelMap: Record<string, string> = {
                                        habit: t('settings_notification_module_habit'),
                                        planner: t('settings_notification_module_planner'),
                                        finance: t('settings_notification_module_finance'),
                                        journal: t('settings_notification_module_journal'),
                                        calendar: t('module_calendar_title'),
                                        job: t('module_job_title'),
                                        goal: t('module_goal_title')
                                    };
                                    const descMap: Record<string, string> = {
                                        habit: t('module_habit_desc'),
                                        planner: t('module_planner_desc'),
                                        finance: t('module_finance_desc'),
                                        journal: t('module_journal_desc'),
                                        calendar: t('module_calendar_desc'),
                                        job: t('module_job_desc'),
                                        goal: t('module_goal_desc')
                                    };
                                    return (
                                        <div
                                            key={key}
                                            id={`module-card-${key}`}
                                            className="group flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/40 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform"
                                                >
                                                    {emojiMap[key]}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm capitalize">
                                                        {labelMap[key]}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                        {descMap[key]}
                                                    </p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                <input
                                                    id={`module-toggle-${key}`}
                                                    checked={enabled}
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    onChange={() => toggleModule(key)}
                                                />
                                                <div
                                                    className="w-11 h-6 bg-slate-100 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner border border-slate-100 dark:border-slate-700"
                                                />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white mb-2">
                                    {t('settings_notif_page_title')}
                                </h3>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400">
                                    {t('settings_notif_page_desc')}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                                            {t('settings_notif_digest_title')}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {t('settings_notif_digest_desc')}
                                        </p>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={dailySummary} 
                                        onChange={(e) => setDailySummary(e.target.checked)}
                                        className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                                            {t('settings_notif_habit_title')}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {t('settings_notif_habit_desc')}
                                        </p>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={habitReminders} 
                                        onChange={(e) => setHabitReminders(e.target.checked)}
                                        className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: BILLING */}
                    {activeTab === 'billing' && (
                        <div className="space-y-8 max-w-3xl">
                            <div>
                                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-800 dark:text-white tracking-tight">
                                    {t('settings_billing_section_title')}
                                </h3>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400 mt-1">
                                    {t('settings_billing_section_desc')}
                                </p>
                            </div>

                            {/* Current plan (Notion / ClickUp style: one summary card) */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                                    <div className="space-y-3 min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            {t('settings_billing_current_label')}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{planLabel}</span>
                                            {user?.is_premium && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    {t('settings_billing_active_badge')}
                                                </span>
                                            )}
                                        </div>
                                        {premiumUntilFormatted ? (
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                <span className="text-slate-500 dark:text-slate-400">{t('billing_valid_until')}: </span>
                                                {premiumUntilFormatted}
                                            </p>
                                        ) : (
                                            !isExplorer && user?.is_premium && (
                                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                                    {t('settings_billing_no_expiry')}
                                                </p>
                                            )
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => router.push('/billing')}
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/40 transition hover:bg-indigo-700 dark:shadow-none"
                                    >
                                        {t('settings_billing_open_pricing')}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-600/50 pt-4">
                                    {t('settings_billing_pricing_note')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: PRIVACY */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-8 max-w-2xl">
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                            {t('settings_export_title')}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            {t('settings_export_desc')}
                                        </p>
                                    </div>
                                    <button 
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>{t('settings_export_btn')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 7: HELP & SUPPORT */}
                    {activeTab === 'help' && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white mb-2">
                                    {t('settings_page_help_title')}
                                </h3>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400">
                                    {t('settings_page_help_subtitle')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a 
                                    href="mailto:oneformindapp@gmail.com" 
                                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all group"
                                >
                                    <Mail className="w-8 h-8 text-indigo-600 mb-3" />
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                        {t('help_support_direct_title')}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {t('help_support_direct_desc')}
                                    </p>
                                </a>

                                <a 
                                    href="/coach" 
                                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all group"
                                >
                                    <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Assistant</h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {locale === 'id' ? 'Dapatkan bantuan instant 24/7 melalui AI Life Coach.' : 'Get instant 24/7 help through our AI Life Coach.'}
                                    </p>
                                </a>
                            </div>
                        </div>
                    )}

                </div>

                {/* FAQ Section */}
                <section style={{ marginTop: '80px', paddingTop: '80px' }} className="border-t border-slate-200 dark:border-slate-850">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white">
                                {t('settings_faq_title')}
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { q: t('settings_faq_q1'), a: t('settings_faq_a1') },
                                { q: t('settings_faq_q2'), a: t('settings_faq_a2') },
                                { q: t('settings_faq_q3'), a: t('settings_faq_a3') }
                            ].map((faq, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-6 py-5 text-left font-bold text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronRight className={`transform transition-transform ${openFaq === idx ? 'rotate-90 text-indigo-600' : 'text-slate-400'}`} size={18} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-850/50 pt-4 text-xs md:text-sm">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </AuthenticatedLayout>
    );
}
