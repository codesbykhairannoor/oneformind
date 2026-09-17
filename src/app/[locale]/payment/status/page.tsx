'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { ShieldCheck, Check, Clock, X, ArrowRight } from 'lucide-react';
import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";

interface PaymentStatusPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ status?: string; plan?: string }>;
}

export default function PaymentStatusPage({ searchParams }: PaymentStatusPageProps) {
    const t = useTranslations();
    const { data: session } = useSession();
    const [status, setStatus] = React.useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
    const [plan, setPlan] = React.useState<string>('Architect');
    const [hasUpdatedSession, setHasUpdatedSession] = React.useState(false);
    
    const userName = session?.user?.user_metadata?.full_name?.split(' ')[0] || 'Member';

    useEffect(() => {
        searchParams.then(resolved => {
            const rawStatus = resolved.status?.toLowerCase();
            const currentPlan = resolved.plan || 'Architect';
            let calculatedStatus: 'success' | 'pending' | 'failed' = 'failed';
            
            // Handle Duitku resultCode: '00' = success, '01' = pending, others = failed/cancelled
            const resultCode = (resolved as any).resultCode;
            if (resultCode) {
                if (resultCode === '00') calculatedStatus = 'success';
                else if (resultCode === '01') calculatedStatus = 'pending';
                else calculatedStatus = 'failed';
            } else if (rawStatus === 'success') {
                calculatedStatus = 'success';
            } else if (rawStatus === 'pending') {
                calculatedStatus = 'pending';
            } else {
                calculatedStatus = 'failed';
            }
            
            setStatus(calculatedStatus);
            setPlan(currentPlan);

            if (calculatedStatus === 'success' && !hasUpdatedSession) {
                setHasUpdatedSession(true);
            }
        }).catch(() => {
            setStatus('failed');
        });
    }, [searchParams, hasUpdatedSession]);

    if (status === 'loading') {
        return (
            <AuthenticatedLayout>
                <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50/30 dark:bg-slate-950/20">
                    <div className="max-w-xl w-full text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {t('payment_verifying') || 'Verifying payment status...'}
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50/30 dark:bg-slate-950/20">
                <div className="max-w-xl w-full text-center animate-in fade-in zoom-in-95 duration-700">
                    
                    {/* SUCCESS ICON */}
                    {status === 'success' && (
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none rotate-6 hover:rotate-0 transition-transform duration-500">
                                <ShieldCheck size={64} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                                <Check size={20} strokeWidth={4} />
                            </div>
                        </div>
                    )}

                    {/* PENDING ICON */}
                    {status === 'pending' && (
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-amber-500 flex items-center justify-center text-white shadow-2xl shadow-amber-200 dark:shadow-none hover:scale-105 transition-transform duration-500">
                                <Clock size={64} />
                            </div>
                        </div>
                    )}

                    {/* FAILED / CANCELLED ICON */}
                    {status === 'failed' && (
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-rose-500 flex items-center justify-center text-white shadow-2xl shadow-rose-200 dark:shadow-none -rotate-6 hover:rotate-0 transition-transform duration-500">
                                <X size={64} />
                            </div>
                        </div>
                    )}

                    {/* TEXT CONTENT */}
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                        {status === 'success' && (t('payment_success_title') || 'Upgrade Complete!')}
                        {status === 'pending' && (t('payment_pending_title') || 'Payment Pending')}
                        {status === 'failed' && (t('payment_failed_title') || 'Payment Cancelled')}
                    </h1>

                    {status === 'success' && (
                        <p className="text-lg md:text-xl font-bold text-slate-500 dark:text-slate-400 mb-10">
                            {t('payment_welcome_msg') || 'Welcome to the elite ecosystem,'} <span className="text-indigo-600 dark:text-indigo-400">{userName}</span>. {t('payment_quantum_praise') || 'Your potential is now officially expanded.'}
                        </p>
                    )}
                    {status === 'pending' && (
                        <p className="text-lg md:text-xl font-bold text-slate-500 dark:text-slate-400 mb-10">
                            {t('payment_pending_msg') || 'Your payment is currently being processed. We will notify you once it is confirmed.'}
                        </p>
                    )}
                    {status === 'failed' && (
                        <p className="text-lg md:text-xl font-bold text-slate-500 dark:text-slate-400 mb-10">
                            {t('payment_failed_msg') || 'Your payment was cancelled or failed. You can try again anytime.'}
                        </p>
                    )}

                    {/* PLAN BADGE */}
                    {status === 'success' && (
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                                {plan} Membership Active
                            </span>
                        </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {status === 'success' ? (
                            <Link 
                                href="/dashboard" 
                                className="px-8 py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-3xl font-black text-sm tracking-wide hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none block"
                            >
                                {t('payment_btn_dashboard') || 'Go to Dashboard'}
                            </Link>
                        ) : (
                            <Link 
                                href="/pricing" 
                                className="px-8 py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-3xl font-black text-sm tracking-wide hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none block"
                            >
                                {t('payment_btn_pricing') || 'Back to Pricing'}
                            </Link>
                        )}

                        {status === 'success' ? (
                            <Link 
                                href="/coach" 
                                className="px-8 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-3xl font-black text-sm tracking-wide hover:bg-slate-50 dark:hover:bg-slate-700 transition-all block"
                            >
                                {t('payment_btn_ai') || 'Talk to AI Coach'}
                            </Link>
                        ) : (
                            <Link 
                                href="/dashboard" 
                                className="px-8 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-3xl font-black text-sm tracking-wide hover:bg-slate-50 dark:hover:bg-slate-700 transition-all block"
                            >
                                {t('payment_btn_dashboard') || 'Go to Dashboard'}
                            </Link>
                        )}
                    </div>

                    {status === 'success' && (
                        <div className="mt-16 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                            <span className="w-12 h-px bg-slate-200 dark:bg-slate-800"></span>
                            <span>SECURE ACCESS GRANTED</span>
                            <span className="w-12 h-px bg-slate-200 dark:bg-slate-800"></span>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
