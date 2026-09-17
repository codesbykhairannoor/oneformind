/**
 * Legacy Laravel Subscription Logic Mapped to Next.js
 * Strict Tier Hierarchy & Expiration Boundaries
 */

export type PlanType = 'explorer' | 'architect' | 'quantum' | 'legendary' | 'trial' | 'lifetime';

export interface UserSubscriptionInfo {
  isPremium?: boolean;
  is_premium?: boolean;
  planType?: PlanType | string;
  plan_type?: PlanType | string;
  premiumUntil?: Date | string | null;
  premium_until?: Date | string | null;
  premiumEndsAt?: Date | string | null;
  premium_ends_at?: Date | string | null;
  hasUsedTrial?: boolean;
  createdAt?: Date | string;
  created_at?: Date | string;
  trialStartedAt?: Date | string | null;
  trial_started_at?: Date | string | null;
  trialEndsAt?: Date | string | null;
  trial_ends_at?: Date | string | null;
  is_trial?: boolean;
  on_trial?: boolean;
  ai_bonus_until?: Date | string | null;
  settings?: Record<string, any>;
}

export interface TrialStatus {
  isTrial: boolean;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  daysUsed: number;
  totalDays: number;
  trialEndsAt: Date | null;
  trialStartedAt: Date | null;
  percentRemaining: number;
}

export const TRIAL_DURATION_DAYS = 14;

/**
 * Calculates 14-day credit card free trial status (unlocks all tabs and AI)
 */
export function getTrialStatus(user: any): TrialStatus {
  if (!user) {
    return {
      isTrial: false,
      isActive: false,
      isExpired: false,
      daysRemaining: 0,
      daysUsed: 0,
      totalDays: TRIAL_DURATION_DAYS,
      trialEndsAt: null,
      trialStartedAt: null,
      percentRemaining: 0,
    };
  }

  const plan = String(user.planType || user.plan_type || 'explorer').toLowerCase();

  // Lifetime / Legendary plans don't need trial
  if (plan === 'lifetime' || plan === 'legendary') {
    return {
      isTrial: false,
      isActive: false,
      isExpired: false,
      daysRemaining: 0,
      daysUsed: 0,
      totalDays: TRIAL_DURATION_DAYS,
      trialEndsAt: null,
      trialStartedAt: null,
      percentRemaining: 0,
    };
  }

  const rawEnd = user.trial_ends_at || user.trialEndsAt;
  const rawStart = user.trial_started_at || user.trialStartedAt || user.created_at || user.createdAt;

  // Modern SaaS Card-Required Free Trial:
  // User only has active trial if they initiated checkout with card (trial_ends_at is present, or plan is trial, or is_trial flag)
  const isTrialFlag = plan === 'trial' || Boolean(user.is_trial) || Boolean(user.on_trial) || Boolean(rawEnd);

  if (!isTrialFlag) {
    return {
      isTrial: false,
      isActive: false,
      isExpired: false,
      daysRemaining: 0,
      daysUsed: 0,
      totalDays: TRIAL_DURATION_DAYS,
      trialEndsAt: null,
      trialStartedAt: null,
      percentRemaining: 0,
    };
  }

  const startDate = rawStart ? new Date(rawStart) : new Date();
  const endDate = rawEnd ? new Date(rawEnd) : new Date(startDate.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);

  const now = Date.now();
  const msRemaining = endDate.getTime() - now;
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const msUsed = now - startDate.getTime();
  const daysUsed = Math.min(TRIAL_DURATION_DAYS, Math.max(0, Math.floor(msUsed / (1000 * 60 * 60 * 24))));

  const isActive = daysRemaining > 0 && msRemaining > 0;
  const isExpired = !isActive;
  const percentRemaining = Math.max(0, Math.min(100, Math.round((daysRemaining / TRIAL_DURATION_DAYS) * 100)));

  return {
    isTrial: true,
    isActive,
    isExpired,
    daysRemaining: isActive ? daysRemaining : 0,
    daysUsed,
    totalDays: TRIAL_DURATION_DAYS,
    trialEndsAt: endDate,
    trialStartedAt: startDate,
    percentRemaining,
  };
}

/**
 * Strict check if a user's subscription or trial is currently active and not expired
 */
export function isSubscriptionActive(user: any): boolean {
  if (!user) return false;

  const plan = String(user.planType || user.plan_type || 'explorer').toLowerCase();

  // Lifetime / Legendary plans never expire
  if (plan === 'lifetime' || plan === 'legendary') {
    return true;
  }

  // Active trial is valid active access
  const trial = getTrialStatus(user);
  if (trial.isActive) {
    return true;
  }

  const isPaidPlan = ['architect', 'quantum'].includes(plan);
  const isPremFlag = user.isPremium === true || user.is_premium === true;

  if (!isPaidPlan && !isPremFlag) {
    return false;
  }

  // Check expiration date timestamp
  const rawUntil = user.premiumUntil || user.premium_until || user.premiumEndsAt || user.premium_ends_at;
  if (rawUntil) {
    const untilDate = new Date(rawUntil);
    if (!isNaN(untilDate.getTime())) {
      // If expiration timestamp is in the past, subscription is strictly EXPIRED
      if (untilDate.getTime() <= Date.now()) {
        return false;
      }
      return true;
    }
  }

  // If no expiration date is explicitly present, fall back to isPremium boolean flag
  return isPremFlag;
}

/**
 * Returns effective tier level:
 * 1: Explorer (Free)
 * 2: Architect (Pro: Systems & Power Tools) / Trial (14-day card trial)
 * 3: Quantum (Neural AI OS)
 * 4: Legendary / Lifetime (VIP All-Inclusive)
 * 
 * Strict Invariant:
 * Downgrades to 1 (Explorer) if paid subscription or trial has expired.
 */
export function getEffectiveTier(user: any): number {
  if (!user) return 1;

  const plan = String(user.planType || user.plan_type || 'explorer').toLowerCase();

  // Lifetime / Legendary is always Tier 4 (VIP)
  if (plan === 'lifetime' || plan === 'legendary') {
    return 4;
  }

  // Active 14-day card trial gives Tier 2 (Architect) access
  const trial = getTrialStatus(user);
  if (trial.isActive) {
    return 2;
  }

  // If expired or inactive, downgrade to Explorer (Tier 1)
  if (!isSubscriptionActive(user)) {
    return 1;
  }

  if (plan === 'quantum') {
    return 3;
  }

  if (plan === 'architect') {
    return 2;
  }

  const isPremFlag = user.isPremium === true || user.is_premium === true;
  if (isPremFlag) {
    return 2;
  }

  return 1;
}

export function isExplorer(user: any): boolean {
  return getEffectiveTier(user) === 1;
}

/**
 * ARCHITECT ACCESS:
 * Level 2 (Architect), Level 3 (Quantum), and Level 4 (Legendary/Lifetime)
 * ALL have full access to Architect features (Batch Modals, CSV/JSON Export, etc.).
 * Guarantees: What Architect can access, Quantum and Legendary CAN access.
 */
export function isArchitect(user: any): boolean {
  return getEffectiveTier(user) >= 2;
}

/**
 * QUANTUM ACCESS:
 * Level 3 (Quantum) and Level 4 (Legendary/Lifetime with AI bonus) have access to Quantum AI OS.
 */
export function isQuantum(user: any): boolean {
  return getEffectiveTier(user) === 3;
}

/**
 * LEGENDARY ACCESS:
 * Level 4 (Legendary/Lifetime) has lifetime access.
 */
export function isLegendary(user: any): boolean {
  return getEffectiveTier(user) === 4;
}

export function hasFeature(user: any, featureGroup: string): boolean {
  const freeGroups = ['habits', 'finance', 'planner', 'journal', 'goals', 'jobs', 'study', 'calendar', 'dashboard'];
  
  if (freeGroups.includes(featureGroup.toLowerCase())) {
      return true;
  }

  if (featureGroup.toLowerCase() === 'ai' || featureGroup.toLowerCase() === 'quantum' || featureGroup.toLowerCase() === 'coach') {
      return hasAiFeature(user);
  }

  return isArchitect(user);
}

export function hasAiFeature(user: any): boolean {
  if (!user) return false;

  // Active 14-day credit card free trial includes AI features
  const trial = getTrialStatus(user);
  if (trial.isActive) return true;

  const tier = getEffectiveTier(user);

  // Active Quantum plan has full AI access
  if (tier === 3) return true;

  // Legendary users get 2 months free AI bonus
  if (tier === 4) {
      const bonusUntil = user.settings?.ai_bonus_until || user.ai_bonus_until || user.aiBonusUntil;
      if (bonusUntil) {
          const bonusDate = new Date(bonusUntil);
          if (!isNaN(bonusDate.getTime())) {
              return Date.now() < bonusDate.getTime();
          }
      }
      
      const createdAtStr = user.created_at || user.createdAt;
      if (createdAtStr) {
          const createdAt = new Date(createdAtStr);
          if (!isNaN(createdAt.getTime())) {
              const bonusEndDate = new Date(createdAt);
              bonusEndDate.setMonth(bonusEndDate.getMonth() + 2);
              return Date.now() < bonusEndDate.getTime();
          }
      }
      
      return true; // Fallback if no creation date
  }

  return false;
}
