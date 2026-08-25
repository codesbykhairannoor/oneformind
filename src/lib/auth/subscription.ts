/**
 * Legacy Laravel Subscription Logic Mapped to Next.js
 */

export type PlanType = 'explorer' | 'architect' | 'quantum' | 'legendary' | 'trial';

export interface UserSubscriptionInfo {
  isPremium: boolean;
  planType: PlanType;
  premiumUntil?: Date | null;
  hasUsedTrial: boolean;
  createdAt: Date;
  settings: Record<string, any>;
}

export function isExplorer(user: UserSubscriptionInfo): boolean {
  return user.planType === 'explorer';
}

export function isArchitect(user: UserSubscriptionInfo): boolean {
  // User is considered Architect if isPremium is active OR plan label allows it
  return user.isPremium || ['architect', 'quantum', 'legendary', 'trial'].includes(user.planType);
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
