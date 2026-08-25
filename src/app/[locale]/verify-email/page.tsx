'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';

export default function VerifyEmail({ user }: { user?: any }) {
    const t = useTranslations();
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');
    
    const userEmail = user?.email || 'user@example.com';

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStatus('verification-link-sent');
        }, 1000);
    };

    const verificationLinkSent = status === 'verification-link-sent';

    return (
        <GuestLayout user={user}>
            <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/70 rounded-full blur-[100px] -z-10" />

                <div className="w-full max-w-[450px] bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative z-10 text-center space-y-6">
                    
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-sm font-black">
                        📩
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-gray-900">{t('auth_verify_header') || 'Cek Inbox Lo!'}</h2>
                        
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('auth_verify_p1') || 'Makasih udah daftar! Satu langkah lagi nih.'}
                        </p>
                    </div>

                    <div>
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-full text-xs border border-slate-200">
                            {userEmail}
                        </span>
                    </div>

                    {verificationLinkSent && (
                        <div className="font-bold text-sm text-indigo-700 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                            ✨ {t('auth_verify_resent_success') || 'Link verifikasi baru sudah dikirim. Cek inbox atau folder spam ya!'}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <button 
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                        >
                            <span>{t('auth_verify_btn_resend') || 'Kirim Ulang Verifikasi'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                console.log('logout');
                            }}
                            className="text-sm text-gray-400 font-bold hover:text-gray-900 transition underline decoration-gray-300 underline-offset-4 block w-full text-center"
                        >
                            {t('auth_verify_logout') || 'Log Out / Ganti Akun'}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
