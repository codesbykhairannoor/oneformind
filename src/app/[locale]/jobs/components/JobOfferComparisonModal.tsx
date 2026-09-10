'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Award, CheckCircle2, DollarSign, MapPin, 
    Building2, Sparkles, X, Briefcase, ThumbsUp, Shield
} from 'lucide-react';
import { JobRowItem, formatSalaryDisplay } from '../lib/jobAnalytics';

interface JobOfferComparisonModalProps {
    jobs: JobRowItem[];
    onAcceptOffer?: (job: JobRowItem) => void;
    onEditJob?: (job: JobRowItem) => void;
}

export default function JobOfferComparisonModal({
    jobs,
    onAcceptOffer,
    onEditJob
}: JobOfferComparisonModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const offerJobs = jobs.filter(j => j.status === 'offer' || j.status === 'accepted');

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="p-6 rounded-[2.5rem] bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-indigo-600/10 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">
                            {isIndo ? 'Matriks Komparasi Penawaran Kerja (Offer Matrix)' : 'Job Offer Comparison Matrix'}
                        </h3>
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                        {isIndo 
                            ? 'Bandingkan penawaran gaji pokok, tunjangan, model kerja (Remote/Hybrid/WFO), dan kultur tim berdampingan untuk membuat keputusan karier terbaik.'
                            : 'Compare base salary, bonuses, work models, and team culture side-by-side to make the best career decision.'}
                    </p>
                </div>

                <div className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs text-center shadow-lg shadow-emerald-500/20 shrink-0">
                    <span>{offerJobs.length} {isIndo ? 'Tawaran Aktif' : 'Active Offers'}</span>
                </div>
            </div>

            {/* Comparison Grid */}
            {offerJobs.length > 0 ? (
                <div className="overflow-x-auto custom-scrollbar pb-4">
                    <div className="grid grid-flow-col auto-cols-[320px] sm:auto-cols-[360px] gap-6 items-stretch">
                        {offerJobs.map((job) => {
                            const isAccepted = job.status === 'accepted';
                            const salaryFormatted = formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, isIndo);

                            return (
                                <div
                                    key={job.id}
                                    className={`rounded-3xl p-6 border flex flex-col justify-between space-y-6 transition-all shadow-sm ${
                                        isAccepted 
                                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-700 ring-2 ring-emerald-500/20' 
                                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md'
                                    }`}
                                >
                                    {/* Top Card Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                                    {job.company}
                                                </span>
                                                <h4 className="text-lg font-black text-slate-800 dark:text-white leading-snug">
                                                    {job.title}
                                                </h4>
                                            </div>

                                            {isAccepted && (
                                                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0 shadow-sm">
                                                    {isIndo ? 'Pilihan Akhir 🏆' : 'Accepted 🏆'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Salary Highlight Box */}
                                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                                            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 block">
                                                {isIndo ? 'Penawaran Kompensasi' : 'Compensation Package'}
                                            </span>
                                            <div className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                                                {salaryFormatted}
                                            </div>
                                        </div>

                                        {/* Work Model & Location */}
                                        <div className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-400">{isIndo ? 'Model Kerja' : 'Work Model'}:</span>
                                                <span className="capitalize">{job.work_model || 'Remote'}</span>
                                            </div>

                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-400">{isIndo ? 'Lokasi' : 'Location'}:</span>
                                                <span className="truncate max-w-[180px]">{job.location || '-'}</span>
                                            </div>

                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-400">{isIndo ? 'Tipe Kontrak' : 'Job Type'}:</span>
                                                <span className="capitalize">{job.job_type || 'Full-time'}</span>
                                            </div>
                                        </div>

                                        {/* Benefits & Perks */}
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                {isIndo ? 'Fasilitas & Tunjangan' : 'Benefits & Perks'}
                                            </span>
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                {job.benefits ? (
                                                    <p>{typeof job.benefits === 'string' ? job.benefits : job.benefits.join(', ')}</p>
                                                ) : (
                                                    <p className="italic text-slate-400">{isIndo ? 'Belum ada catatan benefit' : 'No benefits specified'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        {!isAccepted && onAcceptOffer && (
                                            <button
                                                type="button"
                                                onClick={() => onAcceptOffer(job)}
                                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={16} />
                                                <span>{isIndo ? 'Terima Penawaran Ini' : 'Accept This Offer'}</span>
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => onEditJob?.(job)}
                                            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                                        >
                                            {isIndo ? 'Edit Rincian' : 'Edit Details'}
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-4xl">🎉</span>
                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                        {isIndo ? 'Belum Ada Penawaran Kerja (Offer)' : 'No Job Offers to Compare Yet'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {isIndo 
                            ? 'Ubah status salah satu lamaran menjadi "Tawaran Kerja (Offer)" untuk mulai membandingkan rincian gaji dan benefit di matriks ini.'
                            : 'Mark any application as "Offer" to compare compensation packages and benefits side-by-side.'}
                    </p>
                </div>
            )}

        </div>
    );
}
