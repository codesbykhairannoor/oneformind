'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import InputError from '@/components/InputError';
import { useRouter } from '@/i18n/routing';

export default function ConfirmPassword({ user }: { user?: any }) {
    const t = useTranslations();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        let hasError = false;
        const newErrors: Record<string, string> = {};

        if (!password) {
            newErrors.password = t('auth_val_pass_min') || 'Password wajib diisi';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <GuestLayout user={user}>
            <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-50/70 rounded-full blur-[100px] -z-10" />

                <div className="w-full max-w-[450px] bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative z-10 text-center space-y-6">
                    
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm font-black">
                        🔒
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-indigo-950">{t('auth_confirm_title') || 'Konfirmasi Password'}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('auth_confirm_desc') || 'Ini adalah area aman aplikasi. Harap konfirmasi password Anda sebelum melanjutkan.'}
                        </p>
                    </div>

                    <form onSubmit={submit} className="text-left space-y-5">
                        <div>
                            <label htmlFor="password" className="block font-bold text-gray-700 ml-1 mb-1 text-sm">{t('auth_label_password') || 'Password'}</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 py-3 px-4 outline-none transition-all text-sm font-medium"
                                required
                                autoComplete="current-password"
                                autoFocus
                                placeholder={t('auth_placeholder_pass') || 'Masukkan password Anda'}
                            />
                            <InputError className="mt-2" message={errors.password} />
                        </div>

                        <button 
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-indigo-950 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-900 transition transform hover:-translate-y-0.5 disabled:opacity-75" 
                        >
                            {t('auth_btn_confirm') || 'Konfirmasi'}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
