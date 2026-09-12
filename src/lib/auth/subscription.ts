/**
 * Legacy Laravel Subscription Logic Mapped to Next.js
 */

export type PlanType = 'explorer' | 'architect' | 'quantum' | 'legendary' | 'trial' | 'lifetime';

export interface UserSubscriptionInfo {
  isPremium: boolean;
  planType: PlanType;
  premiumUntil?: Date | null;
  hasUsedTrial: boolean;
  createdAt: Date;
  trialStartedAt?: Date | null;
  trialEndsAt?: Date | null;
  settings: Record<string, any>;
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

export const TRIAL_DURATION_DAYS = 30;

/**
 * Calculates 30-day free trial / grace period status for any user object
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
  const isPaid = user.isPremium === true || user.is_premium === true ||
                 ['architect', 'quantum', 'legendary', 'lifetime'].includes(plan);

  // If paid subscription is active and not an explicit trial status
  if (isPaid && plan !== 'trial' && !user.is_trial && !user.on_trial) {
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

  // Modern SaaS Card-Required Free Trial:
  // User only has active trial if they initiated checkout with card (trial_ends_at is present, or plan is trial)
  const rawEnd = user.trial_ends_at || user.trialEndsAt;
  const rawStart = user.trial_started_at || user.trialStartedAt;

  if (!rawEnd && plan !== 'trial' && !user.is_trial && !user.on_trial) {
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

  const isActive = daysRemaining > 0;
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

export function isExplorer(user: UserSubscriptionInfo): boolean {
  const trial = getTrialStatus(user);
  return user.planType === 'explorer' && !trial.isActive;
}

export function isArchitect(user: UserSubscriptionInfo): boolean {
  const trial = getTrialStatus(user);
  return user.isPremium || ['architect', 'quantum', 'legendary', 'trial', 'lifetime'].includes(user.planType) || trial.isActive;
}

export function isQuantum(user: UserSubscriptionInfo): boolean {
  return user.planType === 'quantum';
}

export function isLegendary(user: UserSubscriptionInfo): boolean {
  return user.planType === 'legendary';
}

export function hasFeature(user: UserSubscriptionInfo, featureGroup: string): boolean {
  const freeGroups = ['habits', 'finance', 'planner'];
  
  if (freeGroups.includes(featureGroup)) {
      return true;
  }

  return isArchitect(user);
}

export function hasAiFeature(user: UserSubscriptionInfo): boolean {
  if (isQuantum(user)) {
      return true;
  }

  if (isLegendary(user)) {
      // Legendary users get 2 months free AI bonus
      const bonusUntil = user.settings?.ai_bonus_until;
      if (bonusUntil) {
          return new Date() < new Date(bonusUntil);
      }
      
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      return new Date(user.createdAt) > twoMonthsAgo;
  }

  return false;
}
