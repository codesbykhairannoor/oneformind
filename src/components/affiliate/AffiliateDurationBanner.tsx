'use client';

import { useLocale } from 'next-intl';

export default function AffiliateDurationBanner() {
    const locale = useLocale();
    const isId = locale === 'id';

    return (
        <section className="py-20 px-6 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-pink-900/10 border-y border-indigo-100 dark:border-indigo-900/40">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider border border-indigo-500/20">
                        ⚡ {isId ? 'Sistem Bagi Hasil Adil' : 'Fair Revenue Share System'}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isId ? 'Komisi 60% Mengalir Setiap Bulan Hingga 8 Bulan' : '60% Commission Every Month for Up to 8 Months'}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {isId 
                            ? 'Cukup ajak pengguna mendaftar sekali. Ketika mereka mulai berlangganan, akun Anda otomatis ditandai di sistem dan Anda langsung menerima 60% komisi setiap bulan selama pengguna tersebut aktif hingga 8 bulan masa langganan!'
                            : 'Simply refer a customer once. When they subscribe, your partner account is tagged and you automatically earn 60% monthly recurring commission for every month they remain active, up to 8 full months!'}
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shrink-0 w-full sm:w-auto text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-3xl mx-auto">
                        📈
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {isId ? '60% Komisi Bulanan' : '60% Monthly Commission'}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold max-w-[200px] mx-auto">
                        {isId ? 'Aktif selama hingga 8 bulan masa langganan user.' : 'Active for up to 8 months of user subscription.'}
                    </p>
                </div>
            </div>
        </section>
    );
}
