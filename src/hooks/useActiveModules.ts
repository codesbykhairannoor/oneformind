'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabaseSession as useSession } from '@/hooks/useSupabaseSession';
import { getTrialStatus } from '@/lib/auth/subscription';

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

export const MAX_FREE_ACTIVE_MODULES = 3;
export const TRIAL_GRACE_DAYS = 30;

const DEFAULT_MODULES: Record<ModuleKey, boolean> = {
    habit: true,
    planner: true,
    study: true,
    finance: false,
    journal: false,
    calendar: false,
    job: false,
    goal: false,
};

export function useActiveModules() {
    const { data: session, status } = useSession();
    const [modules, setModules] = useState<Record<string, boolean>>(DEFAULT_MODULES);
    const [activatedAt, setActivatedAt] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);

    const user = session?.user ? {
        plan_type: (session.user as any).planType || 'Explorer',
        trial_started_at: (session.user as any).trialStartedAt,
        trial_ends_at: (session.user as any).trialEndsAt,
        is_premium: (session.user as any).isPremium,
    } : null;

    const trial = getTrialStatus(user);
    const isPremium = Boolean(user?.is_premium);
    // If user has paid subscription (Architect / Quantum), they have unlimited tabs unlocked
    const isUnlimited = isPremium || (user?.plan_type && user.plan_type.toLowerCase() !== 'explorer' && !trial.isExpired);

    // Hydrate state from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('tranvas_user_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.modules) {
                    setModules(prev => ({ ...prev, ...parsed.modules }));
                }
                if (parsed && parsed.tabs_activated_at) {
                    setActivatedAt(parsed.tabs_activated_at);
                }
            }
        } catch (err) {
            console.error('Failed to parse local active modules:', err);
        }
        setHasHydrated(true);
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
                    if (data.settings.modules) {
                        setModules(prev => ({ ...prev, ...data.settings.modules }));
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

    // Calculate days remaining in 30-day grace period
    const { daysRemaining, isLocked } = useMemo(() => {
        if (isUnlimited) {
            return { daysRemaining: 999, isLocked: false };
        }

        const baseDate = activatedAt ? new Date(activatedAt) : (session?.user?.created_at ? new Date(session.user.created_at) : new Date());
        const elapsedMs = Date.now() - baseDate.getTime();
        const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, TRIAL_GRACE_DAYS - elapsedDays);

        // If 30 days have elapsed and user is not upgraded, tabs are permanently locked
        const locked = remaining <= 0 && !isUnlimited;

        return {
            daysRemaining: remaining,
            isLocked: locked
        };
    }, [activatedAt, isUnlimited, session?.user?.created_at]);

    // Active count
    const activeKeys = useMemo(() => {
        return Object.entries(modules)
            .filter(([_, isEnabled]) => Boolean(isEnabled))
            .map(([k]) => k as ModuleKey);
    }, [modules]);

    const activeCount = activeKeys.length;
    const canActivateMore = isUnlimited || activeCount < MAX_FREE_ACTIVE_MODULES;

    // AI Coach is only enabled for Quantum plan
    const isAiEnabled = useMemo(() => {
        if (!user) return false;
        const plan = (user.plan_type)?.toLowerCase();
        return plan === 'quantum' || plan === 'legendary';
    }, [user]);

    const isTabActive = useCallback((key: string): boolean => {
        // System Core: Dashboard is always active
        if (key === 'dashboard') return true;
        // AI Coach requires Quantum tier
        if (key === 'coach') return isAiEnabled;
        return Boolean(modules[key]);
    }, [modules, isAiEnabled]);

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

    // Toggle a module on or off with 3-tab limit and lock validation
    const toggleTab = useCallback(async (key: ModuleKey): Promise<{ success: boolean; reason?: 'limit_reached' | 'locked' }> => {
        const isCurrentlyActive = Boolean(modules[key]);

        // If turning off, always allow (frees up a slot)
        if (isCurrentlyActive) {
            const next = { ...modules, [key]: false };
            await persistModules(next);
            return { success: true };
        }

        // If attempting to turn on:
        // Check if locked
        if (isLocked) {
            return { success: false, reason: 'locked' };
        }

        // Check if 3-tab limit reached
        if (!isUnlimited && activeCount >= MAX_FREE_ACTIVE_MODULES) {
            return { success: false, reason: 'limit_reached' };
        }

        const next = { ...modules, [key]: true };
        await persistModules(next);
        return { success: true };
    }, [modules, isLocked, isUnlimited, activeCount, persistModules]);

    // Swap an active tab with an inactive tab
    const swapTab = useCallback(async (
        deactivateKey: ModuleKey,
        activateKey: ModuleKey
    ): Promise<{ success: boolean; reason?: 'locked' }> => {
        if (isLocked) {
            return { success: false, reason: 'locked' };
        }

        const next = {
            ...modules,
            [deactivateKey]: false,
            [activateKey]: true
        };
        await persistModules(next);
        return { success: true };
    }, [modules, isLocked, persistModules]);

    // Apply a preset pack (e.g. Scholar, Career, Mindful)
    const applyPreset = useCallback(async (presetId: string): Promise<{ success: boolean; reason?: 'locked' }> => {
        if (isLocked) {
            return { success: false, reason: 'locked' };
        }

        const preset = MODULE_PRESETS.find(p => p.id === presetId);
        if (!preset) return { success: false };

        const next: Record<string, boolean> = {};
        ALL_MODULE_KEYS.forEach(k => {
            next[k] = preset.modules.includes(k);
        });

        await persistModules(next);
        return { success: true };
    }, [isLocked, persistModules]);

    return {
        modules,
        activeKeys,
        activeCount,
        maxAllowed: MAX_FREE_ACTIVE_MODULES,
        canActivateMore,
        daysRemaining,
        isLocked,
        isUnlimited,
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
