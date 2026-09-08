'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export default function AffiliateFaq() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: isId ? 'Berapa persen komisi yang saya dapatkan?' : 'What is the commission percentage?',
            a: isId 
                ? 'Anda mendapatkan 60% recurring revenue share dari setiap pembayaran langganan aktif pengguna selama hingga 8 bulan masa langganan mereka, serta 60% flat dari penjualan paket Legendary Lifetime. Komisi ini jauh melampaui standar industri SaaS biasa (15-25%).' 
                : 'You earn a generous 60% monthly recurring commission for every active paying subscriber you refer for up to 8 months of their subscription, as well as 60% flat on Legendary Lifetime sales. This is double to triple the typical 15-25% SaaS affiliate rate.'
        },
        {
            q: isId ? 'Bagaimana cara kerja Komisi 8 Bulan?' : 'How does the 8-Month Recurring Commission work?',
            a: isId
                ? 'Cukup ajak pengguna mendaftar melalui link afiliasi unik Anda. Ketika mereka mulai berlangganan, akun Anda otomatis ditandai di sistem kami. Anda akan menerima komisi 60% setiap bulan selama pengguna tersebut aktif berlangganan, hingga maksimal 8 bulan.'
                : 'Simply share your unique referral link. When your referral subscribes, your affiliate ID is automatically tagged in our system, and you will receive 60% recurring commission every month they stay active, for up to 8 full months.'
        },
        {
            q: isId ? 'Berapa lama masa berlaku cookie tracking?' : 'How long does the cookie tracking last?',
            a: isId
                ? 'Cookie pelacakan kami berlaku selama 90 hari. Jika seseorang mengklik link referral Anda hari ini dan baru mendaftar hingga 90 hari ke depan, atribusi referral tetap 100% tercatat atas nama Anda.'
                : 'We provide a 90-day cookie window. If a visitor clicks your affiliate link today and converts anytime within 90 days, you get 100% attribution for that customer.'
        },
        {
            q: isId ? 'Kapan dan bagaimana pembayaran komisi dicairkan?' : 'When and how are commissions paid out?',
            a: isId
                ? 'Komisi ditransfer setiap tanggal 1 dan 15 setiap bulannya secara otomatis melalui Transfer Bank Lokal Indonesia (BCA, Mandiri, BRI, QRIS), PayPal, Wise, atau portal resmi Lemon Squeezy.'
                : 'Payouts are processed bi-weekly (1st and 15th of every month) directly via PayPal, Wise, Local Bank Transfer, or via your Lemon Squeezy affiliate portal.'
        },
        {
            q: isId ? 'Apakah ada biaya untuk bergabung menjadi affiliate?' : 'Is there any fee to join the affiliate program?',
            a: isId
                ? 'Sama sekali TIDAK ADA biaya ($0 / 100% Gratis). Tidak ada syarat minimum follower atau kuota bulanan. Cukup daftar dan bagikan link unik Anda.'
                : 'Zero fees ($0 / 100% Free forever). There are no minimum follower requirements or sales quotas. Simply register and start sharing your link immediately.'
        }
    ];

    return (
        <section className="py-24 px-6 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                        {t('affiliate_faq_badge')}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t('affiliate_faq_title')}
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full px-8 py-6 text-left font-black text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base gap-4"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown className={`transform transition-transform shrink-0 ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                            </button>
                            {openFaq === idx && (
                                <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
