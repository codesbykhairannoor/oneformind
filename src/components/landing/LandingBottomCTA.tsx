'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

export default function LandingBottomCTA() {
    const t = useTranslations();

    return (
        <section className="py-56 px-6 text-center relative overflow-hidden bg-white">
            {/* Aesthetic Accents */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.05)_0%,transparent_50%)]"></div>
            
            <div className="max-w-5xl mx-auto relative z-10">
                <h2 className="text-5xl md:text-[6rem] mb-12 leading-[1] tracking-tight text-slate-900 font-[900]">
                    {t('cta_final_title')}
                </h2>
                <p className="text-slate-500 text-lg md:text-xl mb-16 max-w-xl mx-auto font-medium opacity-80">
                    {t('cta_final_desc')}
                </p>
                
                <div className="flex flex-col items-center gap-6">
                    <Link 
                        href="/register" 
                        onClick={() => trackCTAClick('final_cta_section', 'Get Started Free', '/register')}
                        className="inline-block bg-indigo-600 text-white px-16 py-6 rounded-2xl font-bold text-xl hover:bg-indigo-700 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition transform hover:-translate-y-1 active:scale-95 font-sans"
                    >
                        {t('cta_final_btn')}
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span> Free Plan Available
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span> No Card Needed
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span> Instant Cloud Sync
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
