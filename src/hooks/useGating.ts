'use client';

import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";
import { useMemo } from 'react';
import { 
    getTrialStatus, 
    getEffectiveTier, 
    hasAiFeature, 
    isSubscriptionActive,
    TrialStatus 
} from '@/lib/auth/subscription';

// Feature -> tier mapping
const FEATURE_TIERS: Record<string, string> = {
    // Free (Explorer) - All 8 Core Modules Unlocked
    dashboard:        'explorer',
    habit:            'explorer',
    finance:          'explorer',
    journal:          'explorer',
    calendar:         'explorer',
    job:              'explorer',
    goals:            'explorer',
    study:            'explorer',

    // Architect - Systems & Power Tools Engine
    habit_batch:      'architect',
    finance_batch:    'architect',
    finance_savings:  'architect',
    planner_batch:    'architect',
    planner_recurring:'architect',
    finance_budget:   'architect',
    finance_export:   'architect',
    batch_engine_pro: 'architect',
    infinite_analytics: 'architect',
    data_export_pdf:  'architect',
    the_vault_pro:    'architect',
    cross_sync:       'architect',
    custom_themes:    'architect',

    // Quantum - Neural AI OS Engine
    ai_coach:         'quantum',
    neural_os:        'quantum',
    journal_analyze:  'quantum',
    finance_audit:    'quantum',
    ai_command:       'quantum',
    ai_goal_breakdown:'quantum',
};

const PLAN_LABELS: Record<string, string> = {
    explorer:  'Explorer',
    architect: 'Architect',
    trial:     'Trial',
    quantum:   'Quantum',
    legendary: 'Legendary',
    lifetime:  'Lifetime',
};

export const useGating = () => {
    const { data: session, status } = useSession();
    
    const isLoading = status === 'loading';
    
    // In NextAuth v5 custom adapter or Supabase, user subscription fields are in session.user
    const user = session?.user as any;

    const trial: TrialStatus = useMemo(() => {
        return getTrialStatus(user);
    }, [user]);
    
    // Strictly computed effective tier (1: Explorer, 2: Architect/Trial, 3: Quantum, 4: Legendary/Lifetime)
    // Automatically downgrades expired subscriptions to 1 (Explorer)
    const tier = useMemo(() => {
        return getEffectiveTier(user);
    }, [user]);

    const isSubActive = useMemo(() => {
        return isSubscriptionActive(user);
    }, [user]);

    // AI is enabled for active Quantum users, active 14-day card trial users, and Legendary users with active AI bonus
    const isAiEnabled = useMemo(() => {
        return hasAiFeature(user);
    }, [user]);

    const isExplorer  = tier === 1;
    // INVARIANT: Everything Architect can access is 100% accessible to Quantum (tier 3) and Legendary (tier 4)
    const isArchitect = tier >= 2;
    const isQuantum   = tier === 3;
    const isLegendary = tier === 4;

    const canUse = (feature: string) => {
        const required = FEATURE_TIERS[feature] ?? 'architect';

        if (required === 'explorer') return true;

        if (required === 'quantum' || required === 'ai') {
            return isAiEnabled;
        }

        // Level 2 (Architect), Level 3 (Quantum), Level 4 (Legendary), and active trial users all have full access
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
        isSubscriptionActive: isSubActive,
        trial,
        isTrialActive: trial.isActive,
        trialDaysRemaining: trial.daysRemaining,
        user,
        isLoading,
        PLAN_LABELS,
    };
};
