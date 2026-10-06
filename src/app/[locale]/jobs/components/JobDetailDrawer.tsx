'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    X, Briefcase, Building2, MapPin, DollarSign, Calendar, 
    Sparkles, Trash2, ExternalLink, Edit3, CheckCircle2, 
    Users, FileText, Clock, Award, ChevronRight, ShieldCheck,
    Plus, Video, Link as LinkIcon
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { JobRowItem, formatSalaryDisplay, InterviewRound, InterviewRoundType } from '../lib/jobAnalytics';

interface JobDetailDrawerProps {
    show: boolean;
    job: JobRowItem | null;
    onClose: () => void;
    onSave: (form: JobRowItem) => void;
    onDelete: (jobOrId: JobRowItem | number | string) => void;
    onScanATS: (job: JobRowItem) => void;
    onOpenFullModal?: (job: JobRowItem) => void;
}

export default function JobDetailDrawer({
    show,
    job,
    onClose,
    onSave,
    onDelete,
    onScanATS
}: JobDetailDrawerProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [form, setForm] = useState<JobRowItem | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'interviews' | 'star' | 'crm'>('details');

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
        const comp = form.company?.trim() || (isIndo ? 'Perusahaan Target' : 'Target Company');
        const tit = form.title?.trim() || (isIndo ? 'Posisi Lamaran' : 'Job Title');
        onSave({ ...form, company: comp, title: tit });
        onClose();
    };

    // Interview Round Helpers inside Drawer
    const addInterviewRound = () => {
        const newRound: InterviewRound = {
            id: 'round_' + Date.now(),
            round_type: 'hr_screening',
            round_title: isIndo ? 'Wawancara HR' : 'HR Screening',
            scheduled_at: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
            interviewer_name: '',
            meeting_link: '',
            status: 'upcoming',
            notes: ''
        };
        setForm(prev => prev ? {
            ...prev,
            interview_rounds: [...(prev.interview_rounds || []), newRound]
        } : null);
    };

    const updateInterviewRound = (idx: number, field: keyof InterviewRound, val: any) => {
        setForm(prev => {
            if (!prev) return null;
            const list = [...(prev.interview_rounds || [])];
            list[idx] = { ...list[idx], [field]: val };
            return { ...prev, interview_rounds: list };
        });
    };

    const deleteInterviewRound = (idx: number) => {
        setForm(prev => {
            if (!prev) return null;
            const list = [...(prev.interview_rounds || [])];
            list.splice(idx, 1);
            return { ...prev, interview_rounds: list };
        });
    };

    const statuses = [
        { id: 'wishlist', label: isIndo ? 'Incaran' : 'Wishlist', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
        { id: 'applied', label: isIndo ? 'Dilamar' : 'Applied', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
        { id: 'interview', label: isIndo ? 'Interview' : 'Interviewing', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' },
        { id: 'offer', label: isIndo ? 'Tawaran' : 'Job Offer', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
        { id: 'accepted', label: isIndo ? 'Diterima 🏆' : 'Accepted', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' },
        { id: 'rejected', label: isIndo ? 'Ditolak' : 'Rejected', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' }
    ];

    const salaryFormatted = formatSalaryDisplay(form.salary_min, form.salary_max, form.salary_currency, form.salary_period, isIndo);

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] overflow-hidden">
                {/* Backdrop Overlay */}
                <div 
                    className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                    onClick={onClose}
                />

                {/* Slide-Over Right Panel (Notion / Linear Style) */}
                <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
                    <div className="w-screen max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/80 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-250">
                        
                        {/* Drawer Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/40">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                                    {form.company ? form.company.charAt(0).toUpperCase() : '💼'}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-white truncate">
                                        {form.title || (isIndo ? 'Posisi Lamaran' : 'Job Title')}
                                    </h3>
                                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                                        {form.company || (isIndo ? 'Nama Perusahaan' : 'Company Name')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onScanATS(form)}
                                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-black flex items-center gap-1 transition"
                                    title="ATS Match Scan"
                                >
                                    <Sparkles size={14} />
                                    <span>ATS</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition"
                                    title="Tutup Panel"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Status Stage Selection Pills */}
                        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 overflow-x-auto custom-scrollbar flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-slate-400 mr-1 shrink-0">
                                {isIndo ? 'Tahap:' : 'Stage:'}
                            </span>
                            {statuses.map((st) => (
                                <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => handleFieldChange('status', st.id)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition border shrink-0 ${
                                        form.status === st.id
                                            ? `${st.color} scale-105 shadow-xs font-black`
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>

                        {/* Drawer Tabs Header */}
                        <div className="px-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-5 text-xs font-bold overflow-x-auto custom-scrollbar">
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                className={`py-3 border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'details'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {isIndo ? '📋 Rincian & Gaji' : '📋 Details & Salary'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('interviews')}
                                className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                                    activeTab === 'interviews'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                <span>{isIndo ? '🎯 Interview' : '🎯 Interviews'}</span>
                                {form.interview_rounds && form.interview_rounds.length > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 text-[10px] font-black">
                                        {form.interview_rounds.length}
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('star')}
                                className={`py-3 border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'star'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {isIndo ? '⭐ Metode STAR' : '⭐ STAR Method'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('crm')}
                                className={`py-3 border-b-2 transition whitespace-nowrap ${
                                    activeTab === 'crm'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                                        : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {isIndo ? '👥 Recruiter & Catatan' : '👥 Recruiter & Notes'}
                            </button>
                        </div>

                        {/* Drawer Body Scroll Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-5">

                            {/* TAB 1: DETAILS & COMPENSATION */}
                            {activeTab === 'details' && (
                                <div className="space-y-4">
                                    {/* Company & Title Editable */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-400">
                                                {isIndo ? 'Perusahaan' : 'Company Name'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.company}
                                                onChange={(e) => handleFieldChange('company', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-400">
                                                {isIndo ? 'Posisi / Role' : 'Job Title'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.title}
                                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Work Model, Type, Location, Date */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-400">
                                                {isIndo ? 'Model Kerja' : 'Work Model'}
                                            </label>
                                            <select
                                                value={form.work_model}
                                                onChange={(e) => handleFieldChange('work_model', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            >
                                                <option value="remote">Remote 🌐</option>
                                                <option value="hybrid">Hybrid 🏢</option>
                                                <option value="onsite">On-site 📍</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-400">
                                                {isIndo ? 'Lokasi' : 'Location'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.location || ''}
                                                onChange={(e) => handleFieldChange('location', e.target.value)}
                                                placeholder="Jakarta / Remote"
                                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-400">
                                                {isIndo ? 'Tgl Melamar' : 'Applied Date'}
                                            </label>
                                            <input
                                                type="date"
                                                value={form.applied_date || ''}
                                                onChange={(e) => handleFieldChange('applied_date', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Salary Range */}
                                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                                                <DollarSign size={14} /> {isIndo ? 'Rentang Gaji & Kompensasi' : 'Compensation'}
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
                                                    value={form.salary_min ?? ''}
                                                    onChange={(e) => handleFieldChange('salary_min', e.target.value ? Number(e.target.value) : null)}
                                                    placeholder="10000000"
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Max Salary</label>
                                                <input
                                                    type="number"
                                                    value={form.salary_max ?? ''}
                                                    onChange={(e) => handleFieldChange('salary_max', e.target.value ? Number(e.target.value) : null)}
                                                    placeholder="18000000"
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Currency</label>
                                                <select
                                                    value={form.salary_currency || 'IDR'}
                                                    onChange={(e) => handleFieldChange('salary_currency', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                                >
                                                    <option value="IDR">IDR (Rp)</option>
                                                    <option value="USD">USD ($)</option>
                                                    <option value="SGD">SGD (S$)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Period</label>
                                                <select
                                                    value={form.salary_period || 'monthly'}
                                                    onChange={(e) => handleFieldChange('salary_period', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                                >
                                                    <option value="monthly">{isIndo ? 'Bulanan' : 'Monthly'}</option>
                                                    <option value="yearly">{isIndo ? 'Tahunan' : 'Yearly'}</option>
                                                    <option value="hourly">{isIndo ? 'Per Jam' : 'Hourly'}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">
                                                {isIndo ? 'Fasilitas & Benefit' : 'Benefits & Perks'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.benefits || ''}
                                                onChange={(e) => handleFieldChange('benefits', e.target.value)}
                                                placeholder={isIndo ? 'BPJS, Asuransi Swasta, Laptop, Kursus' : 'Health Insurance, Equipment, Learning Budget'}
                                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: INTERVIEWS (NATIVE INLINE MANAGEMENT IN DRAWER) */}
                            {activeTab === 'interviews' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">
                                                {isIndo ? 'Daftar Tahapan Interview' : 'Interview Rounds & Schedule'}
                                            </h4>
                                            <p className="text-[11px] text-slate-400">
                                                {isIndo ? 'Catat jadwal, interviewer, dan tautan meeting.' : 'Track interviewers, date/time, and meeting links.'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addInterviewRound}
                                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-md transition"
                                        >
                                            <Plus size={13} strokeWidth={3} />
                                            <span>{isIndo ? 'Tambah Ronde' : 'Add Round'}</span>
                                        </button>
                                    </div>

                                    {(!form.interview_rounds || form.interview_rounds.length === 0) ? (
                                        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                                            <span className="text-3xl block">🎯</span>
                                            <p className="text-xs font-bold text-slate-500">
                                                {isIndo ? 'Belum ada jadwal wawancara untuk lamaran ini.' : 'No interview rounds scheduled yet.'}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={addInterviewRound}
                                                className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-indigo-100 transition"
                                            >
                                                <Plus size={13} />
                                                <span>{isIndo ? 'Tambah Tahapan Pertama' : 'Add First Round'}</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {form.interview_rounds.map((round: InterviewRound, idx: number) => (
                                                <div 
                                                    key={round.id || idx}
                                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center shrink-0">
                                                                {idx + 1}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={round.round_title}
                                                                onChange={(e) => updateInterviewRound(idx, 'round_title', e.target.value)}
                                                                placeholder={isIndo ? 'Judul Ronde (cth: User Interview)' : 'Round Title'}
                                                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold flex-1"
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <select
                                                                value={round.status}
                                                                onChange={(e) => updateInterviewRound(idx, 'status', e.target.value as any)}
                                                                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold"
                                                            >
                                                                <option value="upcoming">⏳ Upcoming</option>
                                                                <option value="completed">✅ Passed</option>
                                                                <option value="rejected">❌ Failed</option>
                                                            </select>

                                                            <button
                                                                type="button"
                                                                onClick={() => deleteInterviewRound(idx)}
                                                                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                                                title="Hapus ronde"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Jadwal Waktu</label>
                                                            <input
                                                                type="datetime-local"
                                                                value={round.scheduled_at || ''}
                                                                onChange={(e) => updateInterviewRound(idx, 'scheduled_at', e.target.value)}
                                                                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Interviewer</label>
                                                            <input
                                                                type="text"
                                                                value={round.interviewer_name || ''}
                                                                onChange={(e) => updateInterviewRound(idx, 'interviewer_name', e.target.value)}
                                                                placeholder="Pak Budi (Engineering Manager)"
                                                                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Meeting Link</label>
                                                        <div className="flex items-center gap-1.5">
                                                            <input
                                                                type="url"
                                                                value={round.meeting_link || ''}
                                                                onChange={(e) => updateInterviewRound(idx, 'meeting_link', e.target.value)}
                                                                placeholder="https://meet.google.com/xyz"
                                                                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                                                            />
                                                            {round.meeting_link && (
                                                                <a
                                                                    href={round.meeting_link}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 hover:bg-indigo-100 transition shrink-0"
                                                                >
                                                                    <ExternalLink size={14} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <textarea
                                                            rows={2}
                                                            value={round.notes || ''}
                                                            onChange={(e) => updateInterviewRound(idx, 'notes', e.target.value)}
                                                            placeholder={isIndo ? 'Pertanyaan yang ditanyakan, impresi, atau catatan ronde ini...' : 'Questions asked, feedback, or impressions...'}
                                                            className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: STAR METHOD (NATIVE IN DRAWER) */}
                            {activeTab === 'star' && (
                                <div className="space-y-4">
                                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                                        <h5 className="font-black text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                                            <Award size={14} />
                                            <span>Kerangka Jawaban Interview Perilaku (Metode STAR)</span>
                                        </h5>
                                        <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed">
                                            Catat cerita atau studi kasus relevan untuk posisi ini agar kamu siap menjawab pertanyaan <i>&quot;Ceritakan pengalaman ketika Anda...&quot;</i>.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                                                Situation (Kondisi / Konteks Permasalahan)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={form.star_situation || ''}
                                                onChange={(e) => handleFieldChange('star_situation', e.target.value)}
                                                placeholder={isIndo ? 'Jelaskan situasi latar belakang atau masalah yang dihadapi...' : 'Describe the situation or context...'}
                                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                                                Task (Tanggung Jawab / Sasaran)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={form.star_task || ''}
                                                onChange={(e) => handleFieldChange('star_task', e.target.value)}
                                                placeholder={isIndo ? 'Apa target atau tanggung jawab yang harus kamu capai?' : 'What task or challenge were you assigned?'}
                                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                                                Action (Tindakan Nyata yang Kamu Lakukan)
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={form.star_action || ''}
                                                onChange={(e) => handleFieldChange('star_action', e.target.value)}
                                                placeholder={isIndo ? 'Langkah spesifik, tool, atau arsitektur yang kamu terapkan...' : 'Specific actions you took to solve the challenge...'}
                                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                                                Result (Hasil Terukur & Dampak)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={form.star_result || ''}
                                                onChange={(e) => handleFieldChange('star_result', e.target.value)}
                                                placeholder={isIndo ? 'Hasil terukur (cth: latensi turun 40%, konversi naik 15%)...' : 'Measurable impact and lessons learned...'}
                                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: RECRUITER CRM & NOTES */}
                            {activeTab === 'crm' && (
                                <div className="space-y-4">
                                    {/* Recruiter & Contact */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-3">
                                        <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                            <Users size={14} /> {isIndo ? 'Kontak Recruiter / HR' : 'Recruiter & HR Info'}
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Recruiter</label>
                                                <input
                                                    type="text"
                                                    value={form.recruiter_name || ''}
                                                    onChange={(e) => handleFieldChange('recruiter_name', e.target.value)}
                                                    placeholder={isIndo ? 'Nama Recruiter' : 'Recruiter Name'}
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                                                <input
                                                    type="email"
                                                    value={form.recruiter_email || ''}
                                                    onChange={(e) => handleFieldChange('recruiter_email', e.target.value)}
                                                    placeholder="recruiter@company.com"
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile</label>
                                                <input
                                                    type="url"
                                                    value={form.recruiter_linkedin || ''}
                                                    onChange={(e) => handleFieldChange('recruiter_linkedin', e.target.value)}
                                                    placeholder="https://linkedin.com/in/recruiter-profile"
                                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Follow Up Date */}
                                    <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
                                            <div>
                                                <h5 className="text-xs font-black text-slate-800 dark:text-white">
                                                    {isIndo ? 'Jadwal Follow-Up Email' : 'Follow-Up Reminder'}
                                                </h5>
                                                <p className="text-[10px] text-slate-400">
                                                    {isIndo ? 'Pengingat untuk menyapa recruiter kembali' : 'Reminder date to ping recruiter'}
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="date"
                                            value={form.follow_up_date || ''}
                                            onChange={(e) => handleFieldChange('follow_up_date', e.target.value)}
                                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono"
                                        />
                                    </div>

                                    {/* Job Specs / Notes */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                                            {isIndo ? 'Deskripsi Pekerjaan / Tautan / Catatan Khusus' : 'Job Specs & Notes'}
                                        </label>
                                        <textarea
                                            rows={6}
                                            value={form.notes || ''}
                                            onChange={(e) => handleFieldChange('notes', e.target.value)}
                                            placeholder={isIndo 
                                                ? 'Tempel link lowongan, kualifikasi pekerjaan, benefit, atau catatan impresi wawancara...' 
                                                : 'Paste job description, links, requirement specs, or interview impressions...'}
                                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Drawer Footer Controls */}
                        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 flex items-center justify-between gap-3">
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
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 active:scale-95 transition flex items-center gap-1.5"
                                >
                                    <CheckCircle2 size={15} />
                                    <span>{isIndo ? 'Simpan Perubahan' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
