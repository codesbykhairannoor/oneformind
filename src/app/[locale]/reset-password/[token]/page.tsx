'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import InputError from '@/components/InputError';
import { useParams, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

export default function ResetPassword() {
    const t = useTranslations();
    const params = useParams();
    const searchParams = useSearchParams();
    
    const token = params.token as string;
    const emailFromParams = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailFromParams);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        let hasError = false;
        const newErrors: Record<string, string> = {};

        if (password.length < 8) {
            newErrors.password = t('auth_val_pass_min') || 'Password minimal 8 karakter';
            hasError = true;
        }

        if (password !== passwordConfirmation) {
            newErrors.password_confirmation = t('auth_val_pass_match') || 'Konfirmasi password tidak cocok';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setPassword('');
            setPasswordConfirmation('');
        }, 1000);
    };

    return (
        <GuestLayout>
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/70 rounded-full blur-[100px] -z-10" />

                <div className="w-full max-w-[450px] bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative z-10">
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm font-black">
                            🔑
                        </div>
                        <h2 className="text-2xl font-black text-indigo-950">{t('reset_title') || 'Atur Ulang Password'}</h2>
                        <p className="text-gray-500 mt-2 text-sm">{t('reset_desc') || 'Masukkan password baru Anda di bawah ini.'}</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block font-bold text-gray-700 ml-1 mb-1 text-sm">{t('reset_label_email') || 'Email'}</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed py-3 px-4 outline-none text-sm font-medium"
                                required
                                readOnly
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div>
                            <label htmlFor="password" className="block font-bold text-gray-700 ml-1 mb-1 text-sm">{t('reset_label_pass') || 'Password Baru'}</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 py-3 px-4 outline-none transition-all text-sm font-medium"
                                required
                                autoFocus
                                autoComplete="new-password"
                                placeholder={t('reset_placeholder_pass') || 'Masukkan password baru'}
                            />
                            <InputError className="mt-2" message={errors.password} />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block font-bold text-gray-700 ml-1 mb-1 text-sm">{t('reset_label_confirm') || 'Konfirmasi Password'}</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="mt-1 block w-full rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 py-3 px-4 outline-none transition-all text-sm font-medium"
                                required
                                autoComplete="new-password"
                            />
                            <InputError className="mt-2" message={errors.password_confirmation} />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-indigo-950 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-900 transition transform hover:-translate-y-0.5 disabled:opacity-75"
                        >
                            {t('reset_btn') || 'Simpan Password Baru'}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
