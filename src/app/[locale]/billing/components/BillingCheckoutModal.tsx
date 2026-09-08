'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { ChevronDown, Loader2 } from 'lucide-react';

interface BillingCheckoutModalProps {
    isOpen: boolean;
    plan: string;
    step: 'selection' | 'loading_duitku' | 'loading_paypal' | 'paypal_sdk' | 'processing';
    error: string | null;
    isAnnual: boolean;
    onClose: () => void;
    onLemonSqueezy: () => void;
    onDuitku: () => void;
    onPayPal: () => void;
}

export default function BillingCheckoutModal({
    isOpen,
    plan,
    step,
    error,
    isAnnual,
    onClose,
    onLemonSqueezy,
    onDuitku,
    onPayPal
}: BillingCheckoutModalProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">!</div>
                            {error}
                        </div>
                    )}

                    {step === 'selection' && (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('payment_select_title')}</h3>
                                <p className="text-sm font-bold text-slate-500">{t('payment_select_desc')}</p>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    type="button"
                                    onClick={onLemonSqueezy} 
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-950/30 hover:border-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-sm flex items-center justify-center font-black text-white text-xs">
                                            💳
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-xs text-slate-900 dark:text-white">{t('payment_btn_card')}</span>
                                                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase">
                                                    {plan === 'legendary' ? (isId ? 'Akses Seumur Hidup' : 'Lifetime Access') : (isId ? '14 Hari Free Trial' : '14d Free Trial')}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Visa, Mastercard, Amex, Apple Pay</p>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-indigo-500 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                                </button>

                                <button 
                                    type="button"
                                    onClick={onDuitku} 
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-0.5 transition-all group bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center font-black text-indigo-600 border border-slate-100 dark:border-slate-700 text-xs">Rp</div>
                                        <div className="text-left">
                                            <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{t('payment_btn_duitku')}</span>
                                            <p className="text-[10px] font-medium text-slate-500">QRIS, BCA, Mandiri, BRI, BNI</p>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90 group-hover:text-indigo-500 transition-colors" />
                                </button>

                                <button 
                                    type="button"
                                    onClick={onPayPal} 
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-0.5 transition-all group bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center font-black text-sky-500 border border-slate-100 dark:border-slate-700 text-xs">$</div>
                                        <div className="text-left">
                                            <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{t('payment_btn_paypal')}</span>
                                            <p className="text-[10px] font-medium text-slate-500">PayPal Balance & International</p>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90 group-hover:text-indigo-500 transition-colors" />
                                </button>
                            </div>

                            <button onClick={onClose} className="w-full mt-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                {t('payment_btn_cancel')}
                            </button>
                        </>
                    )}

                    {(step === 'loading_duitku' || step === 'loading_paypal' || step === 'processing') && (
                        <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 text-indigo-500 mx-auto animate-spin mb-6" />
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                                {step === 'loading_duitku' ? t('payment_preparing') : step === 'loading_paypal' ? t('payment_init_paypal') : t('payment_processing')}
                            </h3>
                            <p className="text-sm font-bold text-slate-500">
                                {step === 'loading_duitku' ? t('payment_connecting') : step === 'loading_paypal' ? t('payment_wait') : t('payment_verifying')}
                            </p>
                        </div>
                    )}

                    {step === 'paypal_sdk' && (
                        <div className="text-center">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">Checkout with PayPal</h3>
                            <div id="paypal-button-container" className="min-h-[150px]"></div>
                            <button onClick={onClose} className="w-full mt-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800">
                                {t('payment_close')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ModalPortal>
    );
}
