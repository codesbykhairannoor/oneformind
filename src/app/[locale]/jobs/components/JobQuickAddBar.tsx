'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Zap, Plus, Link as LinkIcon, Building2, Briefcase, Globe } from 'lucide-react';

interface JobQuickAddBarProps {
    onQuickAdd: (company: string, title: string, status: string, workModel: string, linkUrl?: string) => void;
}

export default function JobQuickAddBar({ onQuickAdd }: JobQuickAddBarProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [inputVal, setInputVal] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('applied');
    const [selectedWorkModel, setSelectedWorkModel] = useState('remote');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleQuickAddSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const raw = inputVal.trim();
        if (!raw) return;

        setIsSubmitting(true);

        let company = '';
        let title = '';
        let linkUrl = '';

        // Case 1: Pasted URL
        if (raw.startsWith('http://') || raw.startsWith('https://')) {
            linkUrl = raw;
            try {
                const parsedUrl = new URL(raw);
                const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
                // Extract possible slug text
                const slugPart = pathParts.find(p => p.length > 5 && p.includes('-')) || pathParts[pathParts.length - 1] || parsedUrl.hostname;
                const words = slugPart.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                
                title = words || 'Job Application';
                company = parsedUrl.hostname.replace('www.', '').split('.')[0].toUpperCase();
            } catch {
                title = 'Bookmarked Job';
                company = 'Web Job Listing';
            }
        } 
        // Case 2: Typed "Company - Position Title"
        else if (raw.includes('-')) {
            const parts = raw.split('-');
            company = parts[0].trim();
            title = parts.slice(1).join('-').trim();
        } 
        // Case 3: Single name
        else {
            title = raw;
            company = isIndo ? 'Perusahaan Target' : 'Target Company';
        }

        onQuickAdd(company, title, selectedStatus, selectedWorkModel, linkUrl);
        setInputVal('');
        setIsSubmitting(false);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-purple-950/90 rounded-3xl p-4 sm:p-5 border border-indigo-500/30 shadow-xl text-white space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                        <Zap size={18} className="text-white fill-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-2">
                            <span>{isIndo ? 'Input Cepat Lamaran (Anti-Modal)' : 'Fast Quick Add (No Modal)'}</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-black uppercase">
                                0.1s Fast Add
                            </span>
                        </h3>
                        <p className="text-[10px] font-semibold text-slate-300">
                            {isIndo 
                                ? 'Tempel Link Job (LinkedIn/Jobstreet) atau ketik "Perusahaan - Posisi" & tekan Enter' 
                                : 'Paste a Job Link or type "Company - Position Title" and hit Enter'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    {/* Status Pill Selection */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="wishlist">💭 {isIndo ? 'Incaran (Wishlist)' : 'Wishlist'}</option>
                        <option value="applied">📤 {isIndo ? 'Dilamar (Applied)' : 'Applied'}</option>
                        <option value="interview">🎯 {isIndo ? 'Interview' : 'Interviewing'}</option>
                    </select>

                    {/* Work Model Selection */}
                    <select
                        value={selectedWorkModel}
                        onChange={(e) => setSelectedWorkModel(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="remote">🌐 Remote</option>
                        <option value="hybrid">🏢🌐 Hybrid</option>
                        <option value="onsite">🏢 On-site</option>
                    </select>
                </div>
            </div>

            {/* Input Form Bar */}
            <form onSubmit={handleQuickAddSubmit} className="flex items-center gap-2">
                <div className="flex-1 relative flex items-center">
                    <div className="absolute left-4 text-slate-400">
                        {inputVal.startsWith('http') ? <LinkIcon size={16} className="text-indigo-400" /> : <Briefcase size={16} />}
                    </div>
                    <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder={isIndo 
                            ? 'misal: Tokopedia - Lead Frontend Dev  ATAU  https://linkedin.com/jobs/...' 
                            : 'e.g. Stripe - Senior Backend Engineer  OR  paste job URL...'}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/20 dark:border-slate-800 text-xs font-bold text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!inputVal.trim() || isSubmitting}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 transition flex items-center gap-1.5 shrink-0"
                >
                    <Plus size={16} strokeWidth={3} />
                    <span className="hidden sm:inline">{isIndo ? 'Tambah Instan' : 'Quick Save'}</span>
                </button>
            </form>
        </div>
    );
}
