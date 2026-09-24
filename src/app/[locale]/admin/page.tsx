'use client';

import React, { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { useSupabaseSession as useSession } from '@/hooks/useSupabaseSession';
import { isAdminUser } from '@/lib/auth/admin';
import AdminAffiliatePortal from '@/components/affiliate/AdminAffiliatePortal';
import { ShieldAlert, ShieldCheck, ArrowLeft, ExternalLink, Settings as SettingsIcon } from 'lucide-react';

export default function AdminConsolePage() {
    const locale = useLocale();
    const router = useRouter();
    const isId = locale === 'id';
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?next=/admin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <AuthenticatedLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-slate-400 font-semibold">
                        {isId ? 'Memverifikasi otorisasi admin...' : 'Verifying admin authorization...'}
                    </p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const isAdmin = isAdminUser(session?.user);

    if (!isAdmin) {
        return (
            <AuthenticatedLayout>
                <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center ring-1 ring-rose-500/20">
                        <ShieldAlert size={28} />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">
                        {isId ? 'Akses Khusus Administrator' : 'Administrator Access Only'}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
                        {isId
                            ? 'Akun Anda saat ini tidak memiliki izin untuk mengakses Konsol Administrator. Jika Anda yakin ini adalah kesalahan, hubungi superadmin platform.'
                            : 'Your account does not possess permissions to access the Administrator Console. If you believe this is an error, contact platform management.'}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link
                            href="/dashboard"
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                        >
                            {isId ? 'Kembali ke Dashboard' : 'Back to Dashboard'}
                        </Link>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
                
                {/* Executive Top Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {isId ? 'Konsol Administrasi Platform' : 'Platform Administrator Console'}
                                </h1>
                                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 uppercase tracking-widest border border-emerald-500/30">
                                    SUPERADMIN
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {isId 
                                    ? `Login sebagai ${session?.user?.email} • Otorisasi penuh sistem, approval payout, & log transaksi.`
                                    : `Logged in as ${session?.user?.email} • Full system authority, payout approvals, & audit streams.`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                        <Link
                            href="/settings?tab=affiliate&view=partner"
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            <ExternalLink size={14} className="text-slate-400" />
                            <span>{isId ? 'Tampilan Mitra Afiliasi' : 'Partner Affiliate View'}</span>
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            <SettingsIcon size={14} className="text-slate-400" />
                            <span>{isId ? 'Pengaturan' : 'Settings'}</span>
                        </Link>
                    </div>
                </div>

                {/* Main Admin Console */}
                <AdminAffiliatePortal />
            </div>
        </AuthenticatedLayout>
    );
}
