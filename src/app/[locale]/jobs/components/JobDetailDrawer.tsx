'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    X, Briefcase, Building2, MapPin, DollarSign, Calendar, 
    Sparkles, Trash2, ExternalLink, Edit3, CheckCircle2, 
    Users, FileText, Clock, Award, ChevronRight, ShieldCheck
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { JobRowItem, formatSalaryDisplay, InterviewRound } from '../lib/jobAnalytics';

interface JobDetailDrawerProps {
    show: boolean;
    job: JobRowItem | null;
    onClose: () => void;
    onSave: (form: JobRowItem) => void;
    onDelete: (jobOrId: JobRowItem | number | string) => void;
    onScanATS: (job: JobRowItem) => void;
    onOpenFullModal: (job: JobRowItem) => void;
}

export default function JobDetailDrawer({
    show,
    job,
    onClose,
    onSave,
    onDelete,
    onScanATS,
    onOpenFullModal
}: JobDetailDrawerProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [form, setForm] = useState<JobRowItem | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'interviews' | 'notes'>('details');

    useEffect(() => {
        if (job) {
            setForm(JSON.parse(JSON.stringify(job)));
        } else {
            setForm(null);
        }
        setActiveTab('details');
    }, [job, show]);

    if (!show || !form) return null;

    const handleFieldChange = (field: keyof JobRowItem, value: any) => {
        setForm(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSaveDrawer = () => {
        if (!form) return;
        onSave(form);
        onClose();
    };

    const statuses = [
        { id: 'wishlist', label: isIndo ? 'Daftar Incaran' : 'Wishlist', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
        { id: 'applied', label: isIndo ? 'Telah Dilamar' : 'Applied', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
        { id: 'interview', label: isIndo ? 'Interview' : 'Interviewing', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' },
        { id: 'offer', label: isIndo ? 'Tawaran Kerja' : 'Job Offer', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
        { id: 'accepted', label: isIndo ? 'Diterima 🏆' : 'Accepted', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' },
        { id: 'rejected', label: isIndo ? 'Ditolak / Dears' : 'Rejected', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' }
    ];

    const salaryFormatted = formatSalaryDisplay(form.salary_min, form.salary_max, form.salary_currency, form.salary_period, isIndo);

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] overflow-hidden">
                {/* Backdrop Overlay */}
                <div 
                    className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
                />

                {/* Slide-Over Right Panel */}
                <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                    <div className="w-screen max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/80 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
                        
                        {/* Drawer Header */}
                        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                                    {form.company ? form.company.charAt(0).toUpperCase() : '💼'}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white truncate">
                                        {form.title || (isIndo ? 'Posisi Lamaran' : 'Job Application')}
                                    </h3>
                                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                                        {form.company || (isIndo ? 'Nama Perusahaan' : 'Company Name')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onOpenFullModal(form)}
                                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 text-xs font-bold flex items-center gap-1 transition"
                                    title={isIndo ? 'Edit Lengkap' : 'Full Editor'}
                                >
                                    <Edit3 size={15} />
                                    <span className="hidden sm:inline">{isIndo ? 'Editor Lengkap' : 'Full Edit'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Status Stage Selection Pills */}
                        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 overflow-x-auto custom-scrollbar flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 mr-1 shrink-0">
                                {isIndo ? 'Tahapan:' : 'Stage:'}
                            </span>
                            {statuses.map((st) => (
                                <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => handleFieldChange('status', st.id)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition border shrink-0 ${
                                        form.status === st.id
                                            ? `${st.color} scale-105 shadow-sm font-black`
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>

                        {/* Drawer Tabs Header */}
                        <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                className={`py-3 border-b-2 transition ${
                                    activeTab === 'details'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {isIndo ? '📋 Rincian & Gaji' : '📋 Details & Compensation'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('interviews')}
                                className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
                                    activeTab === 'interviews'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                <span>{isIndo ? '🎯 Jadwal Interview' : '🎯 Interviews'}</span>
                                {form.interview_rounds && form.interview_rounds.length > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 text-[10px] font-black">
                                        {form.interview_rounds.length}
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('notes')}
                                className={`py-3 border-b-2 transition ${
                                    activeTab === 'notes'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {isIndo ? '📝 Catatan & Deskripsi' : '📝 Notes & Job Specs'}
                            </button>
                        </div>

                        {/* Drawer Body Scroll Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                            {/* TAB 1: DETAILS & COMPENSATION */}
                            {activeTab === 'details' && (
                                <div className="space-y-5">
                                    {/* Company & Title Editable */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                                {isIndo ? 'Perusahaan' : 'Company Name'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.company}
                                                onChange={(e) => handleFieldChange('company', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                                {isIndo ? 'Posisi / Job Title' : 'Job Title'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.title}
                                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Work Model & Location */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                                {isIndo ? 'Model Kerja' : 'Work Model'}
                                            </label>
                                            <select
                                                value={form.work_model}
                                                onChange={(e) => handleFieldChange('work_model', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            >
                                                <option value="remote">Remote 🌐</option>
                                                <option value="hybrid">Hybrid 🏢🌐</option>
                                                <option value="onsite">On-site 🏢</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                                {isIndo ? 'Lokasi Perusahaan' : 'Location'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.location}
                                                onChange={(e) => handleFieldChange('location', e.target.value)}
                                                placeholder="Jakarta / Remote ID"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Salary Range */}
                                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                                                <DollarSign size={14} /> {isIndo ? 'Ekspektasi Gaji & Periodisitas' : 'Compensation Range'}
                                            </span>
                                            {salaryFormatted && (
                                                <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                                                    {salaryFormatted}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Min Salary</label>
                                                <input
                                                    type="number"
                                                    value={form.salary_min || ''}
                                                    onChange={(e) => handleFieldChange('salary_min', e.target.value ? Number(e.target.value) : null)}
                                                    placeholder="10000000"
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Max Salary</label>
                                                <input
                                                    type="number"
                                                    value={form.salary_max || ''}
                                                    onChange={(e) => handleFieldChange('salary_max', e.target.value ? Number(e.target.value) : null)}
                                                    placeholder="18000000"
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recruiter & Contact */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
                                        <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                            <Users size={14} /> {isIndo ? 'Kontak Recruiter / HR' : 'Recruiter & HR Info'}
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={form.recruiter_name || ''}
                                                onChange={(e) => handleFieldChange('recruiter_name', e.target.value)}
                                                placeholder={isIndo ? 'Nama Recruiter' : 'Recruiter Name'}
                                                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                            />
                                            <input
                                                type="email"
                                                value={form.recruiter_email || ''}
                                                onChange={(e) => handleFieldChange('recruiter_email', e.target.value)}
                                                placeholder="email@company.com"
                                                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    {/* ATS Scan Quick Call */}
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                                                <Sparkles size={16} />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-slate-800 dark:text-white">
                                                    {isIndo ? 'Analisa Kualifikasi CV (ATS Match)' : 'ATS Resume Match Scan'}
                                                </h5>
                                                <p className="text-[10px] font-bold text-slate-400">
                                                    {isIndo ? 'Bandingkan CV Master dengan deskripsi lowongan ini' : 'Scan CV against job requirements'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onScanATS(form)}
                                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition shrink-0"
                                        >
                                            {isIndo ? 'Scan ATS' : 'Scan CV'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: INTERVIEWS */}
                            {activeTab === 'interviews' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">
                                            {isIndo ? 'Daftar Tahapan Interview' : 'Interview Rounds & Schedule'}
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => onOpenFullModal(form)}
                                            className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                        >
                                            <span>+ {isIndo ? 'Kelola Tahapan' : 'Manage Rounds'}</span>
                                        </button>
                                    </div>

                                    {(!form.interview_rounds || form.interview_rounds.length === 0) ? (
                                        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                                            <span className="text-2xl block">🎯</span>
                                            <p className="text-xs font-bold text-slate-500">
                                                {isIndo ? 'Belum ada jadwal interview ditambahkan.' : 'No interview rounds scheduled yet.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {form.interview_rounds.map((round: InterviewRound, idx: number) => (
                                                <div 
                                                    key={round.id || idx}
                                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                                                            <span>Round {idx + 1}:</span>
                                                            <span className="capitalize">{round.round_title || round.round_type}</span>
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
                                                            {round.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-3">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} /> {round.scheduled_at ? new Date(round.scheduled_at).toLocaleDateString() : 'TBD'}
                                                        </span>
                                                        {round.interviewer_name && (
                                                            <span>• {round.interviewer_name}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: NOTES & JOB SPECS */}
                            {activeTab === 'notes' && (
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                            {isIndo ? 'Deskripsi Pekerjaan / Link Lowongan / Catatan' : 'Job Description & Notes'}
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={form.notes || ''}
                                            onChange={(e) => handleFieldChange('notes', e.target.value)}
                                            placeholder={isIndo 
                                                ? 'Tempel syarat lowongan, benefit, link postingan job, atau impresi hasil wawancara...' 
                                                : 'Paste job requirements, salary package notes, or interview feedback...'}
                                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Drawer Footer Controls */}
                        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(form);
                                    onClose();
                                }}
                                className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition text-xs font-bold flex items-center gap-1.5"
                            >
                                <Trash2 size={15} />
                                <span>{isIndo ? 'Hapus' : 'Delete'}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition"
                                >
                                    {isIndo ? 'Batal' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveDrawer}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 active:scale-95 transition"
                                >
                                    {isIndo ? 'Simpan Perubahan' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
