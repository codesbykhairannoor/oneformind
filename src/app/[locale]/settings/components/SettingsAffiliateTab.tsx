'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSupabaseSession as useSession } from '@/hooks/useSupabaseSession';
import { isAdminUser } from '@/lib/auth/admin';
import AffiliatePortalDashboard from '@/components/affiliate/AffiliatePortalDashboard';
import AdminAffiliatePortal from '@/components/affiliate/AdminAffiliatePortal';
import { ShieldCheck, UserCheck } from 'lucide-react';

export default function SettingsAffiliateTab() {
    const locale = useLocale();
    const isId = locale === 'id';
    const { data: session } = useSession();
    const searchParams = useSearchParams();

    const isAdmin = isAdminUser(session?.user);
    const [viewMode, setViewMode] = useState<'partner' | 'admin'>('partner');

    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'admin' && isAdmin) {
            setViewMode('admin');
        }
    }, [searchParams, isAdmin]);

    return (
        <div className="w-full space-y-6">
            {/* Admin Switcher Header (Visible only to authorized platform administrators) */}
            {isAdmin && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-neutral-900 dark:text-white">
                                    {isId ? 'Konsol Administrasi Afiliasi' : 'Affiliate Admin Console'}
                                </span>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    ADMIN
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {isId 
                                    ? 'Kelola mitra affiliator, pantau komisi gateway (Duitku/Lemon/PayPal), dan setujui penarikan.' 
                                    : 'Manage affiliate partners, monitor gateway escrow, and approve payout disbursements.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center self-start sm:self-auto bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700/60 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setViewMode('partner')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                viewMode === 'partner'
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            {isId ? 'Tampilan Mitra' : 'Partner View'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('admin')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                viewMode === 'admin'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {isId ? 'Konsol Admin' : 'Admin Console'}
                        </button>
                    </div>
                </div>
            )}

            {/* Render view according to selected mode */}
            {isAdmin && viewMode === 'admin' ? (
                <AdminAffiliatePortal />
            ) : (
                <AffiliatePortalDashboard />
            )}
        </div>
    );
}
