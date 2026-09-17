'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabaseSession as useSession } from '@/hooks/useSupabaseSession';
import { getTrialStatus, hasAiFeature, isSubscriptionActive } from '@/lib/auth/subscription';

export const ALL_MODULE_KEYS = [
    'habit',
    'planner',
    'finance',
    'study',
    'journal',
    'calendar',
    'job',
    'goal'
] as const;

export type ModuleKey = typeof ALL_MODULE_KEYS[number];

export interface ModulePreset {
    id: string;
    labelId: string;
    labelEn: string;
    descId: string;
    descEn: string;
    emoji: string;
    modules: ModuleKey[];
}

export const MODULE_PRESETS: ModulePreset[] = [
    {
        id: 'scholar',
        emoji: '🎓',
        labelId: 'The Scholar (Pelajar & Mahasiswa)',
        labelEn: 'The Scholar (Students & Academics)',
        descId: 'Manajemen kuliah, tugas, review flashcard, dan kebiasaan belajar harian.',
        descEn: 'Course management, assignment tracking, flashcards, and daily study habits.',
        modules: ['study', 'planner', 'habit']
    },
    {
        id: 'career',
        emoji: '💼',
        labelId: 'The Career Climber (Jobseeker & Profesional)',
        labelEn: 'The Career Climber (Jobseekers & Pros)',
        descId: 'Lacak lamaran kerja, persiapan interview, time-blocking jadwal kerja, dan kalender master.',
        descEn: 'Job applications, interview prep, task time-blocking, and master calendar.',
        modules: ['job', 'planner', 'calendar']
    },
    {
        id: 'mindful',
        emoji: '🧘',
        labelId: 'The Mindful Living (Personal Growth)',
        labelEn: 'The Mindful Living (Personal Growth)',
        descId: 'Kembangkan kebiasaan positif, refleksi emosional harian, dan pantau target hidup jangka panjang.',
        descEn: 'Build atomic habits, daily reflective journaling, and strategic long-term goals.',
        modules: ['habit', 'journal', 'goal']
    },
    {
        id: 'solopreneur',
        emoji: '🚀',
        labelId: 'The Solopreneur (Kreator & Freelancer)',
        labelEn: 'The Solopreneur (Creators & Freelancers)',
        descId: 'Eksekusi proyek harian, pantau arus kas & invoice, serta capai target revenue bisnis.',
        descEn: 'Daily project execution, cashflow & invoice tracking, and revenue milestones.',
        modules: ['planner', 'finance', 'goal']
    },
    {
        id: 'finance_builder',
        emoji: '💰',
        labelId: 'The Wealth Builder (Finansial & Investasi)',
        labelEn: 'The Wealth Builder (Finance & Saving)',
        descId: 'Kendalikan pengeluaran, budgeting tabungan, dan bangun kebiasaan hemat harian.',
        descEn: 'Control expenses, build savings pots, and maintain disciplined spending habits.',
        modules: ['finance', 'planner', 'habit']
    }
];

export const MAX_FREE_ACTIVE_MODULES = 8;
export const TRIAL_GRACE_DAYS = 9999;

const DEFAULT_MODULES: Record<ModuleKey, boolean> = {
    habit: true,
    planner: true,
    study: true,
    finance: true,
    journal: true,
    calendar: true,
    job: true,
    goal: true,
};

export function useActiveModules() {
    const { data: session, status } = useSession();
    const [modules, setModules] = useState<Record<string, boolean>>(DEFAULT_MODULES);
    const [activatedAt, setActivatedAt] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);

    const user = session?.user ? {
        plan_type: (session.user as any).planType || (session.user as any).plan_type || 'Explorer',
        trial_started_at: (session.user as any).trialStartedAt || (session.user as any).trial_started_at,
        trial_ends_at: (session.user as any).trialEndsAt || (session.user as any).trial_ends_at,
        premium_until: (session.user as any).premiumUntil || (session.user as any).premium_until,
        is_premium: (session.user as any).isPremium,
        created_at: session.user.created_at,
    } : null;

    const trial = getTrialStatus(user);
    const isUnlimited = isSubscriptionActive(user) || trial.isActive;

    // Hydrate state from localStorage & listen for storage or custom events
    useEffect(() => {
        const syncFromLocalStorage = () => {
            try {
                const saved = localStorage.getItem('tranvas_user_settings');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.modules && typeof parsed.modules === 'object') {
                        const updated: Record<string, boolean> = { ...DEFAULT_MODULES };
                        ALL_MODULE_KEYS.forEach(k => {
                            if (typeof parsed.modules[k] === 'boolean') {
                                updated[k] = parsed.modules[k];
                            }
                        });
                        setModules(updated);
                    }
                    if (parsed && parsed.tabs_activated_at) {
                        setActivatedAt(parsed.tabs_activated_at);
                    }
                }
            } catch (err) {
                console.error('Failed to parse local active modules:', err);
            }
        };

        syncFromLocalStorage();
        setHasHydrated(true);

        const handleSync = (e?: any) => {
            if (e?.detail && typeof e.detail === 'object') {
                const updated: Record<string, boolean> = { ...DEFAULT_MODULES };
                ALL_MODULE_KEYS.forEach(k => {
                    if (typeof e.detail[k] === 'boolean') {
                        updated[k] = Boolean(e.detail[k]);
                    }
                });
                setModules(updated);
            } else {
                syncFromLocalStorage();
            }
        };

        window.addEventListener('storage', handleSync);
        window.addEventListener('tranvas_active_modules_changed', handleSync);

        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('tranvas_active_modules_changed', handleSync);
        };
    }, []);

    // Sync from API on session ready
    useEffect(() => {
        if (status !== 'authenticated') return;

        let isMounted = true;
        const fetchUserSettings = async () => {
            try {
                const res = await fetch('/api/user');
                if (!res.ok) return;
                const data = await res.json();
                if (isMounted && data?.settings) {
                    if (data.settings.modules && typeof data.settings.modules === 'object') {
                        const updated: Record<string, boolean> = { ...DEFAULT_MODULES };
                        ALL_MODULE_KEYS.forEach(k => {
                            if (typeof data.settings.modules[k] === 'boolean') {
                                updated[k] = data.settings.modules[k];
                            }
                        });
                        setModules(updated);
                    }
                    if (data.settings.tabs_activated_at) {
                        setActivatedAt(data.settings.tabs_activated_at);
                    } else if (data.createdAt) {
                        setActivatedAt(data.createdAt);
                    }
                }
            } catch (error) {
                console.error('Failed to sync active modules from server:', error);
            }
        };

        fetchUserSettings();
        return () => { isMounted = false; };
    }, [status]);

    // All users have unlimited tab activation access (no 30-day lock)
    const daysRemaining = 999;
    const isLocked = false;

    // Effective modules are the user's customized active modules
    const effectiveModules = useMemo(() => {
        return modules;
    }, [modules]);

    // Active count
    const activeKeys = useMemo(() => {
        return Object.entries(effectiveModules)
            .filter(([_, isEnabled]) => Boolean(isEnabled))
            .map(([k]) => k as ModuleKey);
    }, [effectiveModules]);

    const activeCount = activeKeys.length;
    const canActivateMore = true;

    // AI Coach is enabled for Quantum plan OR active 14-day credit card trial (Architect + AI) OR Legendary 2-month bonus
    const isAiEnabled = useMemo(() => {
        return hasAiFeature(user);
    }, [user]);

    const isTabActive = useCallback((key: string): boolean => {
        // System Core: Dashboard is always active
        if (key === 'dashboard') return true;
        // AI Coach requires Quantum tier OR 14-day card trial
        if (key === 'coach') return isAiEnabled;
        return Boolean(effectiveModules[key]);
    }, [effectiveModules, isAiEnabled]);

    // Persist modules both locally and to server
    const persistModules = useCallback(async (
        nextModules: Record<string, boolean>,
        newActivatedAt?: string
    ) => {
        setModules(nextModules);
        const activationDate = newActivatedAt || activatedAt || new Date().toISOString();
        if (!activatedAt) {
            setActivatedAt(activationDate);
        }

        // LocalStorage update
        try {
            const currentSettings = localStorage.getItem('tranvas_user_settings');
            const parsed = currentSettings ? JSON.parse(currentSettings) : {};
            parsed.modules = nextModules;
            parsed.tabs_activated_at = activationDate;
            localStorage.setItem('tranvas_user_settings', JSON.stringify(parsed));
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('tranvas_active_modules_changed', { detail: nextModules }));
        } catch (e) {
            console.error('Failed to write local modules:', e);
        }

        // API update
        setIsSaving(true);
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: {
                        modules: nextModules,
                        tabs_activated_at: activationDate
                    }
                })
            });
        } catch (e) {
            console.error('Failed to sync modules to server:', e);
        } finally {
            setIsSaving(false);
        }
    }, [activatedAt]);

    // Toggle a module on or off without limit or lock
    const toggleTab = useCallback(async (key: ModuleKey): Promise<{ success: boolean; reason?: 'limit_reached' | 'locked' }> => {
        const isCurrentlyActive = Boolean(effectiveModules[key]);
        const next = { ...effectiveModules, [key]: !isCurrentlyActive };
        await persistModules(next);
        return { success: true };
    }, [effectiveModules, persistModules]);

    // Swap an active tab with another
    const swapTab = useCallback(async (
        deactivateKey: ModuleKey,
        activateKey: ModuleKey
    ): Promise<{ success: boolean; reason?: 'locked' }> => {
        const next = {
            ...effectiveModules,
            [deactivateKey]: false,
            [activateKey]: true
        };
        await persistModules(next);
        return { success: true };
    }, [effectiveModules, persistModules]);

    // Apply a preset pack (e.g. Scholar, Career, Mindful)
    const applyPreset = useCallback(async (presetId: string): Promise<{ success: boolean; reason?: 'locked' }> => {
        const preset = MODULE_PRESETS.find(p => p.id === presetId);
        if (!preset) return { success: false };

        const next: Record<string, boolean> = {};
        ALL_MODULE_KEYS.forEach(k => {
            next[k] = preset.modules.includes(k);
        });

        await persistModules(next);
        return { success: true };
    }, [persistModules]);

    return {
        modules: effectiveModules,
        activeKeys,
        activeCount,
        maxAllowed: MAX_FREE_ACTIVE_MODULES,
        canActivateMore,
        daysRemaining,
        isLocked,
        isUnlimited,
        trial,
        isSaving,
        hasHydrated,
        isAiEnabled,
        isTabActive,
        toggleTab,
        swapTab,
        applyPreset,
        persistModules
    };
}
