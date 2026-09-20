'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { loadScript } from '@paypal/paypal-js';
import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";
import { getTrialStatus, isSubscriptionActive } from '@/lib/auth/subscription';
import { Link } from '@/i18n/routing';
import { Sparkles, ArrowRight } from 'lucide-react';
import BillingPricingCards from './components/BillingPricingCards';
import BillingComparisonTable from './components/BillingComparisonTable';
import BillingFaq from './components/BillingFaq';
import BillingCheckoutModal from './components/BillingCheckoutModal';

export default function BillingPricingPage() {
    const t = useTranslations();
    const locale = useLocale();
    const { data: session } = useSession();
    const [isAnnual, setIsAnnual] = useState(true);

    const [checkout, setCheckout] = useState<{
        isOpen: boolean;
        plan: string;
        step: 'selection' | 'loading_duitku' | 'loading_paypal' | 'paypal_sdk' | 'processing';
        error: string | null;
    }>({ isOpen: false, plan: '', step: 'selection', error: null });

    const trial = getTrialStatus(session?.user);
    const rawPlan = ((session?.user as any)?.planType || (session?.user as any)?.plan_type || 'explorer').toLowerCase();
    const isExplicitPaid = Boolean(session?.user && isSubscriptionActive(session.user) && rawPlan !== 'explorer');
    
    const userPlan = isExplicitPaid ? rawPlan : 'explorer';
    const planHierarchy = ['explorer', 'architect', 'quantum', 'legendary', 'lifetime'];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const isId = locale === 'id';

    const handleCheckout = (planId: string) => {
        setCheckout({ isOpen: true, plan: planId.toLowerCase(), step: 'selection', error: null });
    };

    const handleDuitku = async () => {
        setCheckout(prev => ({ ...prev, step: 'loading_duitku', error: null }));
        try {
            const res = await fetch('/api/payment/duitku/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: checkout.plan, billing: isAnnual ? 'yearly' : 'monthly' })
            });
            const data = await res.json();
            if (res.ok && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error(data.error || 'Gagal membuat invoice');
            }
        } catch (err: any) {
            setCheckout(prev => ({ ...prev, step: 'selection', error: err.message }));
        }
    };

    const LEMON_CHECKOUT_URLS: Record<string, string> = {
        architect: 'https://tranvas.lemonsqueezy.com/checkout/buy/42544b58-35e6-47d2-b6b4-374bf22a3f40',
        quantum: 'https://tranvas.lemonsqueezy.com/checkout/buy/7334c27d-4b2e-4908-92c3-2303655d4915',
        legendary: 'https://tranvas.lemonsqueezy.com/checkout/buy/ed2c5d53-cd62-4e06-b9ec-242b81b39fd2',
        enterprise: 'https://tranvas.lemonsqueezy.com/checkout/buy/059f572f-f57a-42a8-922d-487ec15e24e9'
    };

    const handleLemonSqueezy = () => {
        const planKey = (checkout.plan || 'architect').toLowerCase();
        let url = LEMON_CHECKOUT_URLS[planKey] || LEMON_CHECKOUT_URLS.architect;
        const email = session?.user?.email ? encodeURIComponent(session.user.email) : '';
        const name = (session?.user as any)?.user_metadata?.full_name ? encodeURIComponent((session?.user as any).user_metadata.full_name) : '';
        const params: string[] = [];
        if (email) params.push(`checkout[email]=${email}`);
        if (name) params.push(`checkout[name]=${name}`);
        if (session?.user?.id) params.push(`checkout[custom][user_id]=${session.user.id}`);
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        window.location.href = url;
    };

    const handlePayPal = async () => {
        setCheckout(prev => ({ ...prev, step: 'loading_paypal', error: null }));
        try {
            const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'BAA4EY4bCAv5qA_E8fi83VMDyIwnokX_4Y1n6G_icl0T5moe4Lu0EMkIRg67CGU9sSNX_HlDrLRXjNMOss';
            const paypal = await loadScript({ 
                clientId: clientId,
                currency: "USD",
                intent: "capture"
            });
            if (!paypal || !paypal.Buttons) throw new Error("PayPal SDK failed to load");
            setCheckout(prev => ({ ...prev, step: 'paypal_sdk' }));
        } catch (err: any) {
            setCheckout(prev => ({ ...prev, step: 'selection', error: err.message }));
        }
    };

    useEffect(() => {
        if (checkout.isOpen && checkout.step === 'paypal_sdk') {
            const renderPayPal = async () => {
                const paypal = (window as any).paypal;
                if (paypal && paypal.Buttons) {
                    const container = document.getElementById('paypal-button-container');
                    if (container && container.children.length === 0) {
                        paypal.Buttons({
                            style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },
                            createOrder: async () => {
                                const res = await fetch('/api/payment/paypal/checkout', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ plan: checkout.plan, billing: isAnnual ? 'yearly' : 'monthly' })
                                });
                                const data = await res.json();
                                if (!res.ok || !data.id) throw new Error(data.error || 'Failed to create PayPal order');
                                return data.id;
                            },
                            onApprove: async (data: any) => {
                                setCheckout(prev => ({ ...prev, step: 'processing' }));
                                const res = await fetch('/api/payment/paypal/capture', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ token: data.orderID, plan: checkout.plan, billing: isAnnual ? 'yearly' : 'monthly' })
                                });
                                const captureData = await res.json();
                                if (res.ok) {
                                    window.location.href = `/payment/status?resultCode=00&reference=${captureData.orderId}`;
                                } else {
                                    setCheckout(prev => ({ ...prev, step: 'selection', error: captureData.error || 'Payment failed' }));
                                }
                            },
                            onError: () => {
                                setCheckout(prev => ({ ...prev, step: 'selection', error: 'PayPal encountered an error' }));
                            }
                        }).render('#paypal-button-container');
                    }
                }
            };
            renderPayPal();
        }
    }, [checkout.step, checkout.isOpen, checkout.plan, isAnnual]);

    return (
        <AuthenticatedLayout>
            <main id="billing-pricing-page" className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden min-h-screen pb-32">
                {/* HERO */}
                <header style={{ marginBottom: '80px' }} className="pt-20 pb-2 px-4 md:px-8 text-center">
                    <div className="max-w-7xl mx-auto space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 mx-auto">
                            {t('pricing_title_1')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                {t('pricing_title_2')}
                            </span>
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 font-bold max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
                            {t('pricing_subtitle')}
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex justify-center mt-8 mb-10">
                            <div className="inline-flex items-center p-1 bg-white dark:bg-slate-950 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 shadow-sm scale-110">
                                <button
                                    type="button"
                                    onClick={() => setIsAnnual(false)}
                                    className={`px-8 py-3 rounded-[1.6rem] text-xs font-black transition-all ${
                                        !isAnnual
                                            ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xl'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {t('pricing_monthly')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAnnual(true)}
                                    className={`px-8 py-3 rounded-[1.6rem] text-xs font-black transition-all relative flex items-center gap-2 ${
                                        isAnnual
                                            ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xl'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {t('pricing_yearly')}
                                    <span className="absolute -top-4 -right-2 px-2 py-1 rounded-lg bg-emerald-500 text-[8px] text-white animate-bounce shadow-lg">
                                        {t('pricing_billing_save')}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* 14-Day Free Trial Notice Banner */}
                        {trial.isActive ? (
                            <div className="max-w-3xl mx-auto p-6 rounded-[2.2rem] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200 dark:border-indigo-500/30 text-left shadow-sm mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                                            {isId ? 'Free Trial 14 Hari Aktif' : '14-Day Free Trial Active'}
                                        </span>
                                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                                            {isId ? `${trial.daysRemaining} hari tersisa` : `${trial.daysRemaining} days remaining`}
                                        </span>
                                    </div>
                                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                                        {isId ? 'Anda sedang menikmati Akses Penuh Pro Architect' : 'You are enjoying full Pro Architect Access'}
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        {isId ? 'Kunci diskon 40% tahunan sekarang sebelum masa percobaan berakhir agar integrasi data Anda tetap berjalan lancar.' : 'Lock in your 40% annual discount now before your trial ends to keep your data and streak uninterrupted.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCheckout('Architect')}
                                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-200 dark:shadow-none transition shrink-0 active:scale-95"
                                >
                                    {isId ? 'Kunci Akses Pro' : 'Lock Pro Access'}
                                </button>
                            </div>
                        ) : !isExplicitPaid ? (
                            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 text-center mb-12">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    ⚡ {isId ? 'Mulai Free Trial 14 Hari Pro Architect ($0 Hari Ini • Masukkan Kartu & Batal Kapan Saja)' : 'Start 14-Day Pro Architect Free Trial ($0 Today • Card Required • Cancel Anytime)'}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </header>

                <BillingPricingCards 
                    isAnnual={isAnnual}
                    userPlanIndex={userPlanIndex}
                    isExplicitPaid={Boolean(isExplicitPaid)}
                    trialIsActive={trial.isActive}
                    onCheckout={handleCheckout}
                />

                {/* 60% RECURRING PARTNER BANNER */}
                <section className="max-w-5xl mx-auto px-6 my-14">
                    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                        <div className="space-y-2 max-w-xl relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/20">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span>60% Recurring Partner Program</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-white">
                                {isId ? 'Dapatkan 60% Komisi Berulang Tiap Bulan' : 'Earn 60% Monthly Recurring Commission'}
                            </h3>
                            <p className="text-indigo-200/80 text-xs md:text-sm leading-relaxed">
                                {isId 
                                    ? 'Ajak teman atau komunitas Anda menggunakan Tranvas. Nikmati bagi hasil 60% rutin setiap bulan selama hingga 8 bulan masa langganan aktif per pengguna.'
                                    : 'Refer friends or your community to Tranvas. Earn a 60% revenue share every month for up to 8 active months per subscriber.'}
                            </p>
                        </div>
                        <Link
                            href="/affiliates"
                            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0 relative z-10"
                        >
                            <span>{isId ? 'Buka Portal Partner' : 'Open Partner Portal'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                <BillingComparisonTable />

                <BillingFaq />
            </main>

            <BillingCheckoutModal 
                isOpen={checkout.isOpen}
                plan={checkout.plan}
                step={checkout.step}
                error={checkout.error}
                isAnnual={isAnnual}
                onClose={() => setCheckout(prev => ({ ...prev, isOpen: false }))}
                onLemonSqueezy={handleLemonSqueezy}
                onDuitku={handleDuitku}
                onPayPal={handlePayPal}
            />
        </AuthenticatedLayout>
    );
}
