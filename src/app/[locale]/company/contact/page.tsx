'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';

export default function ContactPage() {
    const t = useTranslations();
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'support', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <GuestLayout>
            <div className="pt-32 pb-24 px-4 bg-slate-50 dark:bg-slate-900/50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-black text-[10px] mb-6 uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                            ✨ {t('contact_title')}
                        </div>
                        <h1 className="text-4xl md:text-6xl text-slate-900 dark:text-white tracking-tight mb-6 font-black">
                            {t('contact_title')}
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-bold">
                            {t('contact_subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-left-6 duration-700">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">{t('contact_info_title')}</h3>
                                
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                            🏢
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">{t('contact_info_hq')}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{t('contact_info_jakarta')}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                            ✉️
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">{t('contact_info_support')}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">tranvasapp@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform cursor-pointer">
                                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                            💬
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black mb-1">{t('contact_info_chat')}</h4>
                                            <p className="text-xs font-bold">{t('contact_info_chat_status')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick FAQ Card */}
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                                <h3 className="text-lg font-black mb-4 relative z-10">{t('contact_faq_title')}</h3>
                                <p className="text-xs text-slate-400 font-bold mb-6 relative z-10 leading-relaxed">
                                    {t('contact_faq_desc')}
                                </p>
                                <Link href="/resources/guide" className="block w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-center text-xs font-black transition relative z-10">
                                    {t('contact_faq_btn')}
                                </Link>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-right-6 duration-700">
                                {submitted ? (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                                            ✅
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pesan Berhasil Terkirim!</h3>
                                        <p className="text-slate-500 text-sm">Tim kami akan membalas ke alamat email Anda secepatnya.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                                                    {t('contact_form_name')}
                                                </label>
                                                <input 
                                                    name="name" 
                                                    type="text" 
                                                    required 
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 font-bold text-sm transition" 
                                                    placeholder={t('contact_form_name_placeholder')} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                                                    {t('contact_form_email')}
                                                </label>
                                                <input 
                                                    name="email" 
                                                    type="email" 
                                                    required 
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 font-bold text-sm transition" 
                                                    placeholder={t('contact_form_email_placeholder')} 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                                                {t('contact_form_subject')}
                                            </label>
                                            <select 
                                                name="subject" 
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-6 py-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 font-bold text-sm transition appearance-none cursor-pointer"
                                            >
                                                <option value="support">{t('contact_info_support')}</option>
                                                <option value="billing">{t('contact_info_billing')}</option>
                                                <option value="partnership">{t('contact_subject_partnership')}</option>
                                                <option value="other">{t('contact_subject_other')}</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                                                {t('contact_form_message')}
                                            </label>
                                            <textarea 
                                                name="message" 
                                                rows={6} 
                                                required 
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-6 py-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 font-bold text-sm transition resize-none" 
                                                placeholder={t('contact_form_message_placeholder')}
                                            ></textarea>
                                        </div>

                                        <button type="submit" className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-sm transition transform active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3">
                                            {t('contact_btn_send')}
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
