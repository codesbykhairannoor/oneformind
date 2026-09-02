'use client';

import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";
import { useMemo } from 'react';

// Feature -> tier mapping (1:1 from legacy useGating.js)
const FEATURE_TIERS: Record<string, string> = {
    // Free (Explorer) - Fully Unlocked
    dashboard:      'explorer',
    habit:          'explorer',
    habit_batch:    'explorer',
    finance:        'explorer',
    finance_batch:  'explorer',
    finance_savings:'explorer',
    planner:        'explorer',
    planner_batch:  'explorer',
    planner_recurring: 'explorer',
    finance_budget: 'explorer',
    finance_export: 'explorer',

    // Architect
    journal:       'architect',
    calendar:      'architect',
    job:           'architect',
    goals:         'architect',

    // Quantum / AI
    ai_coach:         'quantum',
    neural_os:        'quantum',
    journal_analyze:  'quantum',
    finance_audit:    'quantum',
};

const PLAN_LEVELS: Record<string, number> = {
    'explorer':  1,
    'architect': 2,
    'trial':     2, 
    'quantum':   3,
    'legendary': 4,
};

export const useGating = () => {
    const { data: session, status } = useSession();
    
    const isLoading = status === 'loading';
    
    // In NextAuth v5 custom adapter, we pass planType and isPremium to the token/session
    const user = session?.user as any;
    
    const tier = useMemo(() => {
        if (!user) return 1;

        if (user.isPremium || user.planType === 'trial' || user.planType === 'legendary' || user.planType === 'quantum') {
            return PLAN_LEVELS[user.planType?.toLowerCase()] || 2;
        }

        return 1; // Explorer
    }, [user]);

    const isExplorer  = tier === 1;
    const isArchitect = tier >= 2;
    const isQuantum   = tier === 3;
    const isLegendary = tier === 4;

    // AI: quantum + legendary
    const isAiEnabled = useMemo(() => {
        if (!user) return false;
        const plan = user.planType?.toLowerCase();
        if (plan === 'quantum') return true;
        if (plan === 'legendary') {
            return true; // Simplified: Legendary always gets AI access
        }
        return false;
    }, [user]);

    const canUse = (feature: string) => {
        const required = FEATURE_TIERS[feature] ?? 'architect';

        if (required === 'explorer') return true;

        if (required === 'quantum' || required === 'ai') {
            return isAiEnabled;
        }

        // architect, legendary all included
        return isArchitect;
    };

    return {
        tier,
        canUse,
        isAiEnabled,
        isExplorer,
        isArchitect,
        isQuantum,
        isLegendary,
        user,
        isLoading,
    };
};
