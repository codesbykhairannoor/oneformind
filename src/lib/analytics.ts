/**
 * Safe client-side Google Analytics 4 & Conversion Tracking Utility
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean | undefined | null>
) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
};

export const trackCTAClick = (location: string, label: string, destination?: string) => {
  trackEvent('cta_click', {
    cta_location: location,
    cta_label: label,
    destination: destination || '/register',
  });
};

export const trackPricingSelect = (plan: string, billingCycle: 'monthly' | 'yearly' | 'lifetime', price?: number | string) => {
  trackEvent('pricing_plan_select', {
    plan_name: plan,
    billing_cycle: billingCycle,
    price: price,
  });
};

export const trackCheckoutInitiate = (gateway: 'duitku' | 'paypal', plan: string, amount?: number | string) => {
  trackEvent('begin_checkout', {
    payment_gateway: gateway,
    plan_name: plan,
    value: amount,
  });
};
