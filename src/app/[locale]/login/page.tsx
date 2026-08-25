'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import InputError from '@/components/InputError';

export default function Login({ searchParams }: { searchParams?: { status?: string } }) {
    const t = useTranslations();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [status, setStatus] = useState(searchParams?.status || '');
    
    const canResetPassword = true;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        let hasError = false;
        const newErrors: Record<string, string> = {};

        if (!email.trim() || !email.includes('@')) {
            newErrors.email = t('auth_val_email') || 'Alamat email tidak valid (harus mengandung @)';
            hasError = true;
        }

        if (!password) {
            newErrors.password = t('auth_val_pass_min') || 'Password wajib diisi';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setIsProcessing(true);

        // Save Auth Session to localStorage
        const userName = email.split('@')[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        const userProfile = {
            name: formattedName,
            email,
            headline: 'Member Architect Tier',
            bio: 'Member aktif OneForMind Productivity OS.',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('oneformind_user_profile', JSON.stringify(userProfile));
        localStorage.setItem('oneformind_auth', JSON.stringify({ isAuthenticated: true, user: userProfile }));

        setTimeout(() => {
            setIsProcessing(false);
            router.push('/dashboard');
        }, 600);
    };

    const handleGoogleAuth = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        const userProfile = {
            name: 'Google User',
            email: 'user.google@gmail.com',
            headline: 'Member Architect Tier',
            bio: 'Member aktif OneForMind Productivity OS via Google Login.',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('oneformind_user_profile', JSON.stringify(userProfile));
        localStorage.setItem('oneformind_auth', JSON.stringify({ isAuthenticated: true, user: userProfile }));

        setTimeout(() => {
            setIsProcessing(false);
            router.push('/dashboard');
        }, 600);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white selection:bg-indigo-100 selection:text-indigo-700 p-6 overflow-hidden">
            
            <div className="absolute top-0 w-full h-96 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-blue-50/50 blur-3xl -z-10 pointer-events-none" />

            <div className="w-full max-w-[420px] flex flex-col relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none transition-transform duration-500 hover:rotate-[360deg]">
                        <img src="/favicon.svg?v=2" alt="OneForMind Logo" className="h-8 w-8 brightness-0 invert" />
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-slate-900 mb-1.5 tracking-tight">
                        {t('auth_login_title') || 'Selamat Datang Kembali'}
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        {t('auth_no_account') || 'Belum memiliki akun?'}{' '}
                        <Link href="/register" className="text-indigo-600 hover:text-indigo-800 transition font-bold">{t('auth_link_register') || 'Daftar sekarang'}</Link>
                    </p>
                </div>

                {status && (
                    <div className="mb-6 font-bold text-sm text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-500/20 flex items-center gap-3 shadow-sm dark:shadow-none">
                        <span className="text-lg">✨</span> {status}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="flex items-center justify-center w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-none bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 mb-6 group active:scale-[0.98]">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span className="font-bold text-slate-700 text-sm">{t('auth_btn_google_in') || 'Lanjutkan dengan Google'}</span>
                </button>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-[10px] font-black uppercase text-slate-400 absolute tracking-wider">atau</span>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth_placeholder_email') || 'Alamat Email'}
                            className={`w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all outline-none ${
                                errors.email ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'focus:border-indigo-500 focus:ring-indigo-500/10'
                            }`}
                        />
                        <InputError className="mt-1.5 ml-1" message={errors.email} />
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth_placeholder_pass') || 'Password'}
                            className={`w-full pl-4 pr-10 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 transition-all outline-none ${
                                errors.password ? 'border-red-400 focus:ring-red-100 focus:border-red-500' : 'focus:border-indigo-500 focus:ring-indigo-500/10'
                            }`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none">
                            {!showPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            )}
                        </button>
                        <InputError className="mt-1.5 ml-1" message={errors.password} />
                    </div>

                    <div className="flex justify-end mt-1">
                        {canResetPassword && (
                            <Link href="/forgot-password" className="text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors">
                                {t('auth_forgot_pass') || 'Lupa Password?'}
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full mt-2 bg-indigo-600 text-white font-black py-3.5 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>{isProcessing ? 'Masuk...' : (t('auth_btn_login') || 'Masuk dengan Email')}</span>
                        {!isProcessing && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        )}
                    </button>

                    <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-4">
                        {t('auth_consent_notice') || 'Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.'}
                    </p>
                </form>

                <div className="mt-10 text-center font-medium">
                    <div className="text-[11px] text-slate-500 leading-relaxed">
                        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 font-medium">
                            <Link href="/company/privacy" className="text-[11px] text-slate-500 hover:text-indigo-600 transition-colors">{t('footer_privacy') || 'Kebijakan Privasi'}</Link>
                            <Link href="/company/terms" className="text-[11px] text-slate-500 hover:text-indigo-600 transition-colors">{t('footer_terms') || 'Ketentuan Layanan'}</Link>
                            <Link href="/resources/help" className="text-[11px] text-slate-500 hover:text-indigo-600 transition-colors">{t('auth_footer_help') || 'Pusat Bantuan'}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
