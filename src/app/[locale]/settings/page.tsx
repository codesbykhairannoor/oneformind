'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { 
    User, Lock, LayoutGrid, Bell, CreditCard, ShieldCheck, 
    HelpCircle, Check 
} from 'lucide-react';
import { getTrialStatus } from '@/lib/auth/subscription';
import SettingsGeneralTab from './components/SettingsGeneralTab';
import SettingsSecurityTab from './components/SettingsSecurityTab';
import SettingsModulesTab from './components/SettingsModulesTab';
import SettingsNotificationsTab from './components/SettingsNotificationsTab';
import SettingsBillingTab from './components/SettingsBillingTab';
import SettingsPrivacyTab from './components/SettingsPrivacyTab';
import SettingsHelpTab from './components/SettingsHelpTab';
import SettingsFaq from './components/SettingsFaq';

export default function SettingsPage() {
    const t = useTranslations();
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<string>('general');

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
    const [email, setEmail] = useState('alexander@tranvas.com');

    // Security state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification toggles
    const [dailySummary, setDailySummary] = useState(true);
    const [habitReminders, setHabitReminders] = useState(true);

    // Save notification
    const [savedMsg, setSavedMsg] = useState(false);

    // Modules state
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
    const { data: session, status } = useSession();

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
            window.dispatchEvent(new Event('auth_change'));
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
        created_at: userData.createdAt || session?.user?.created_at,
        trial_started_at: userData.trialStartedAt || (session?.user as any)?.trialStartedAt,
        trial_ends_at: userData.trialEndsAt || (session?.user as any)?.trialEndsAt,
    } : {
        name,
        email,
        plan_type: 'Explorer',
        is_premium: false,
        premium_until: null,
        created_at: session?.user?.created_at,
        trial_started_at: (session?.user as any)?.trialStartedAt,
        trial_ends_at: (session?.user as any)?.trialEndsAt,
    };

    const trial = getTrialStatus(user);
    const isExplorer = !user.is_premium && !trial.isActive;
    const planLabel = trial.isActive 
        ? (locale === 'id' ? `Free (Trial ${trial.daysRemaining} Hari Tersisa)` : `Free (${trial.daysRemaining}d Trial Left)`)
        : (user.plan_type || 'Explorer');

    const premiumUntilFormatted = (() => {
        const raw = user?.premium_until || (trial.isActive ? trial.trialEndsAt : null);
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
                    {activeTab === 'general' && (
                        <SettingsGeneralTab 
                            name={name} 
                            setName={setName} 
                            email={email} 
                            setEmail={setEmail} 
                            onSave={handleSave} 
                        />
                    )}

                    {activeTab === 'security' && (
                        <SettingsSecurityTab 
                            currentPassword={currentPassword} 
                            setCurrentPassword={setCurrentPassword} 
                            newPassword={newPassword} 
                            setNewPassword={setNewPassword} 
                            confirmPassword={confirmPassword} 
                            setConfirmPassword={setConfirmPassword} 
                            onSave={handleSave} 
                        />
                    )}

                    {activeTab === 'modules' && (
                        <SettingsModulesTab 
                            modules={modules} 
                            onToggleModule={toggleModule} 
                        />
                    )}

                    {activeTab === 'notifications' && (
                        <SettingsNotificationsTab 
                            dailySummary={dailySummary} 
                            setDailySummary={setDailySummary} 
                            habitReminders={habitReminders} 
                            setHabitReminders={setHabitReminders} 
                        />
                    )}

                    {activeTab === 'billing' && (
                        <SettingsBillingTab 
                            planLabel={planLabel} 
                            trial={trial} 
                            isPremium={user.is_premium} 
                            isExplorer={isExplorer} 
                            premiumUntilFormatted={premiumUntilFormatted} 
                        />
                    )}

                    {activeTab === 'privacy' && (
                        <SettingsPrivacyTab />
                    )}

                    {activeTab === 'help' && (
                        <SettingsHelpTab />
                    )}
                </div>

                <SettingsFaq />
            </div>
        </AuthenticatedLayout>
    );
}
