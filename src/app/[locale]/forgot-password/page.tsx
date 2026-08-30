'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import InputError from '@/components/InputError';

export default function ForgotPassword({ searchParams }: { searchParams?: { status?: string } }) {
    const t = useTranslations();
    const [status, setStatus] = useState(searchParams?.status || '');

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white selection:bg-indigo-100 selection:text-indigo-700 p-6 overflow-hidden">
            
            <div className="absolute top-0 w-full h-96 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-blue-50/50 blur-3xl -z-10 pointer-events-none" />

            <div className="w-full max-w-[420px] flex flex-col relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform duration-500 hover:rotate-[360deg]">
                        <img src="/favicon.svg?v=2" alt="Tranvas Logo" className="h-8 w-8 brightness-0 invert" />
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                        {t('auth_reset_title') || 'Reset password'}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                        {t('auth_reset_desc') || "Forgot your password? No problem. Just let us know your email address and we will email you a password reset link."}
                    </p>
                </div>

                {status && (
                    <div className="mb-6 font-bold text-sm text-indigo-600 bg-indigo-50 p-4 rounded-xl border border-indigo-100/50 flex items-center justify-center gap-3 text-center">
                        <span className="text-lg">📧</span> {status}
                    </div>
                )}

                <form action="/forgot-password" method="POST" className="space-y-4">
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t('auth_placeholder_email') || 'Alamat Email'}
                            className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all outline-none focus:border-indigo-500 focus:ring-indigo-500/10"
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 text-white font-black py-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>{t('auth_btn_reset') || 'Send Recovery Link'}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </button>

                    <div className="text-center mt-6">
                        <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition inline-flex items-center justify-center gap-1.5 group">
                            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            {t('auth_back_login') || 'Back to sign in'}
                        </Link>
                    </div>
                </form>
                
                <div className="mt-10 text-center font-medium">
                    <Link href="/resources/help" className="text-[11px] text-slate-500 hover:text-indigo-600 transition-colors">{t('auth_footer_help') || 'Help Center'}</Link>
                </div>
            </div>
        </div>
    );
}
