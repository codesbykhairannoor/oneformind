'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    Briefcase, DollarSign, Calendar, Users, 
    FileText, Plus, Trash2, Video, CheckCircle2, 
    X, Sparkles, MapPin, Building2, Link as LinkIcon, 
    Clock, Award, HelpCircle
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { JobRowItem, InterviewRound, InterviewRoundType } from '../lib/jobAnalytics';

interface JobModalProps {
    show: boolean;
    job?: JobRowItem | null;
    onClose: () => void;
    onSave: (form: JobRowItem) => void;
    onDelete?: (jobOrId: JobRowItem | number | string) => void;
    onScanATS?: (job: JobRowItem) => void;
}

export default function JobModal({
    show,
    job,
    onClose,
    onSave,
    onDelete,
    onScanATS
}: JobModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [activeTab, setActiveTab] = useState<'overview' | 'interviews' | 'crm' | 'star_notes'>('overview');

    const [form, setForm] = useState<JobRowItem>({
        id: '',
        company: '',
        title: '',
        location: 'Remote',
        applied_date: new Date().toISOString().split('T')[0],
        status: 'applied',
        work_model: 'remote',
        job_type: 'fulltime',
        salary_min: null,
        salary_max: null,
        salary_currency: 'IDR',
        salary_period: 'monthly',
        benefits: '',
        recruiter_name: '',
        recruiter_email: '',
        recruiter_linkedin: '',
        follow_up_date: null,
        follow_up_status: 'pending',
        interview_rounds: [],
        star_situation: '',
        star_task: '',
        star_action: '',
        star_result: '',
        notes: ''
    });

    useEffect(() => {
        if (job) {
            setForm(JSON.parse(JSON.stringify(job)));
        } else {
            setForm({
                id: '',
                company: '',
                title: '',
                location: 'Remote',
                applied_date: new Date().toISOString().split('T')[0],
                status: 'applied',
                work_model: 'remote',
                job_type: 'fulltime',
                salary_min: null,
                salary_max: null,
                salary_currency: 'IDR',
                salary_period: 'monthly',
                benefits: '',
                recruiter_name: '',
                recruiter_email: '',
                recruiter_linkedin: '',
                follow_up_date: null,
                follow_up_status: 'pending',
                interview_rounds: [],
                star_situation: '',
                star_task: '',
                star_action: '',
                star_result: '',
                notes: ''
            });
        }
        setActiveTab('overview');
    }, [job, show]);

    const formatDisplay = (val: string | number | null | undefined) => {
        if (val === undefined || val === null || val === '') return '';
        const str = val.toString().replace(/[^0-9]/g, '');
        if (!str) return '';
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    if (!show) return null;

    const handleSave = () => {
        if (!form.company?.trim() || !form.title?.trim()) {
            alert(isIndo ? 'Nama Perusahaan & Posisi wajib diisi!' : 'Company name and Job title are required!');
            return;
        }
        onSave(form);
    };

    // Interview Round Helpers
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
        setForm(prev => ({
            ...prev,
            interview_rounds: [...(prev.interview_rounds || []), newRound]
        }));
    };

    const updateInterviewRound = (idx: number, field: keyof InterviewRound, val: any) => {
        setForm(prev => {
            const list = [...(prev.interview_rounds || [])];
            list[idx] = { ...list[idx], [field]: val };
            return { ...prev, interview_rounds: list };
        });
    };

    const deleteInterviewRound = (idx: number) => {
        setForm(prev => {
            const list = [...(prev.interview_rounds || [])];
            list.splice(idx, 1);
            return { ...prev, interview_rounds: list };
        });
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/80 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Top Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
                                <Briefcase size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-black text-slate-800 dark:text-white truncate">
                                    {job?.id 
                                        ? (isIndo ? 'Kelola Detail Lamaran' : 'Job Application Details') 
                                        : (isIndo ? 'Tambah Lamaran Baru' : 'Add New Job Application')}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                    {form.company || (isIndo ? 'Perusahaan' : 'Company')} • {form.title || (isIndo ? 'Posisi' : 'Title')}
                                </p>
                            </div>
                        </div>

                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 4 Tabs Header */}
                    <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 md:px-8 gap-2 shrink-0 bg-white dark:bg-slate-900 overflow-x-auto no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setActiveTab('overview')}
                            className={`py-3 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                                activeTab === 'overview'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Briefcase size={14} />
                            <span>{isIndo ? 'Ringkasan & Gaji' : 'Overview & Salary'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('interviews')}
                            className={`py-3 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                                activeTab === 'interviews'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Calendar size={14} />
                            <span>{isIndo ? 'Tahapan Interview' : 'Interviews'}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                {form.interview_rounds?.length || 0}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('crm')}
                            className={`py-3 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                                activeTab === 'crm'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Users size={14} />
                            <span>{isIndo ? 'Kontak Recruiter' : 'Recruiter CRM'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('star_notes')}
                            className={`py-3 px-3 text-xs font-black border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                                activeTab === 'star_notes'
                                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <FileText size={14} />
                            <span>{isIndo ? 'Metode STAR' : 'STAR Method'}</span>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                        
                        {/* ================= TAB 1: OVERVIEW & SALARY ================= */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                
                                {/* Company & Title */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                            {isIndo ? 'Nama Perusahaan' : 'Company Name'} *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.company}
                                            onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
                                            placeholder={isIndo ? "Contoh: Google / GoTo / Startup..." : "E.g. Google, Stripe, Apple..."}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                            {isIndo ? 'Posisi Pekerjaan' : 'Job Title'} *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder={isIndo ? "Contoh: Senior Frontend Engineer" : "E.g. Product Designer"}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Status & Applied Date */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                            {isIndo ? 'Tahapan Status' : 'Pipeline Stage'}
                                        </label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                                        >
                                            <option value="wishlist">{isIndo ? '💭 Daftar Incaran (Wishlist)' : '💭 Wishlist'}</option>
                                            <option value="applied">{isIndo ? '📤 Sudah Dilamar (Applied)' : '📤 Applied'}</option>
                                            <option value="interview">{isIndo ? '🎯 Proses Wawancara (Interview)' : '🎯 Interviewing'}</option>
                                            <option value="offer">{isIndo ? '🎉 Tawaran Kerja (Offer)' : '🎉 Job Offer'}</option>
                                            <option value="accepted">{isIndo ? '🏆 Diterima Kerja (Accepted)' : '🏆 Accepted'}</option>
                                            <option value="rejected">{isIndo ? '❌ Belum Berjodoh (Rejected)' : '❌ Rejected'}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                            {isIndo ? 'Tanggal Melamar' : 'Date Applied'}
                                        </label>
                                        <input
                                            type="date"
                                            value={form.applied_date}
                                            onChange={(e) => setForm(prev => ({ ...prev, applied_date: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Work Model, Location & Job Type */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                            {isIndo ? 'Model Kerja' : 'Work Model'}
                                        </label>
                                        <select
                                            value={form.work_model || 'remote'}
                                            onChange={(e) => setForm(prev => ({ ...prev, work_model: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white"
                                        >
                                            <option value="remote">Remote 🌐</option>
                                            <option value="hybrid">Hybrid 🏢</option>
                                            <option value="onsite">On-site 📍</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                            {isIndo ? 'Lokasi Kantor' : 'Office Location'}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.location || ''}
                                            onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                                            placeholder={isIndo ? "Jakarta / Singapore / Global" : "City / Country"}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                            {isIndo ? 'Tipe Kontrak' : 'Job Type'}
                                        </label>
                                        <select
                                            value={form.job_type || 'fulltime'}
                                            onChange={(e) => setForm(prev => ({ ...prev, job_type: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white"
                                        >
                                            <option value="fulltime">Full-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="freelance">Freelance</option>
                                            <option value="internship">Internship</option>
                                            <option value="parttime">Part-time</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Structured Compensation Tracker */}
                                <div className="p-5 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-4">
                                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                        <DollarSign size={16} />
                                        {isIndo ? 'Struktur Gaji & Kompensasi' : 'Salary & Compensation'}
                                    </span>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                                                {isIndo ? 'Gaji Min' : 'Min Salary'}
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={formatDisplay(form.salary_min)}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                                    setForm(prev => ({ ...prev, salary_min: raw ? Number(raw) : null }));
                                                }}
                                                placeholder="15.000.000"
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                                                {isIndo ? 'Gaji Max' : 'Max Salary'}
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={formatDisplay(form.salary_max)}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                                    setForm(prev => ({ ...prev, salary_max: raw ? Number(raw) : null }));
                                                }}
                                                placeholder="25.000.000"
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                                                {isIndo ? 'Mata Uang' : 'Currency'}
                                            </label>
                                            <select
                                                value={form.salary_currency || 'IDR'}
                                                onChange={(e) => setForm(prev => ({ ...prev, salary_currency: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                            >
                                                <option value="IDR">IDR (Rp)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="SGD">SGD (S$)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                                                {isIndo ? 'Periode' : 'Period'}
                                            </label>
                                            <select
                                                value={form.salary_period || 'monthly'}
                                                onChange={(e) => setForm(prev => ({ ...prev, salary_period: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                            >
                                                <option value="monthly">{isIndo ? 'Per Bulan' : 'Monthly'}</option>
                                                <option value="yearly">{isIndo ? 'Per Tahun' : 'Yearly'}</option>
                                                <option value="hourly">{isIndo ? 'Per Jam' : 'Hourly'}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                                            {isIndo ? 'Fasilitas & Tunjangan (Benefits)' : 'Benefits & Perks'}
                                        </label>
                                        <input
                                            type="text"
                                            value={typeof form.benefits === 'string' ? form.benefits : (form.benefits || []).join(', ')}
                                            onChange={(e) => setForm(prev => ({ ...prev, benefits: e.target.value }))}
                                            placeholder={isIndo ? "Asuransi kesehatan swasta, BPJS, budget WFH Rp 5jt, 14 hari cuti..." : "Health insurance, 401k match, WFH stipend..."}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* ================= TAB 2: INTERVIEWS ================= */}
                        {activeTab === 'interviews' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                            {isIndo ? 'Tahapan Wawancara Kerja' : 'Multi-Round Interview Timeline'}
                                        </h4>
                                        <p className="text-[11px] text-slate-400">
                                            {isIndo ? 'Catat setiap jadwal interview, interviewer, dan link meeting' : 'Track each round, interviewer, and meeting URL'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addInterviewRound}
                                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                                    >
                                        <Plus size={14} />
                                        <span>{isIndo ? 'Tambah Ronde' : 'Add Round'}</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(form.interview_rounds || []).map((round, idx) => (
                                        <div 
                                            key={round.id || idx}
                                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 relative group"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                                    Ronde #{idx + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteInterviewRound(idx)}
                                                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                        {isIndo ? 'Tipe Tahapan' : 'Round Type'}
                                                    </label>
                                                    <select
                                                        value={round.round_type}
                                                        onChange={(e) => updateInterviewRound(idx, 'round_type', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                                    >
                                                        <option value="hr_screening">HR Screening</option>
                                                        <option value="technical_test">Technical / Live Code</option>
                                                        <option value="user_interview">User / Manager Interview</option>
                                                        <option value="case_study">Case Study Presentation</option>
                                                        <option value="culture_fit">Culture Fit</option>
                                                        <option value="final_executive">Final C-Level</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                        {isIndo ? 'Tanggal & Jam' : 'Scheduled Date & Time'}
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={round.scheduled_at || ''}
                                                        onChange={(e) => updateInterviewRound(idx, 'scheduled_at', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                        {isIndo ? 'Status Ronde' : 'Status'}
                                                    </label>
                                                    <select
                                                        value={round.status}
                                                        onChange={(e) => updateInterviewRound(idx, 'status', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                                    >
                                                        <option value="upcoming">{isIndo ? 'Mendatang' : 'Upcoming'}</option>
                                                        <option value="completed">{isIndo ? 'Selesai' : 'Completed'}</option>
                                                        <option value="passed">{isIndo ? 'Lolos 🎉' : 'Passed 🎉'}</option>
                                                        <option value="failed">{isIndo ? 'Gagal' : 'Failed'}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                        {isIndo ? 'Nama Pewawancara' : 'Interviewer Name'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={round.interviewer_name || ''}
                                                        onChange={(e) => updateInterviewRound(idx, 'interviewer_name', e.target.value)}
                                                        placeholder="Cth: Sarah (Engineering Lead)"
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-800 dark:text-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                        {isIndo ? 'Link Video Meeting (Zoom/Meet)' : 'Meeting Link (Zoom/Meet)'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={round.meeting_link || ''}
                                                        onChange={(e) => updateInterviewRound(idx, 'meeting_link', e.target.value)}
                                                        placeholder="https://meet.google.com/..."
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-800 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(!form.interview_rounds || form.interview_rounds.length === 0) && (
                                        <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                                            <p className="text-xs font-bold text-slate-400">
                                                {isIndo ? 'Belum ada tahapan interview yang ditambahkan' : 'No interview rounds added yet'}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={addInterviewRound}
                                                className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                + {isIndo ? 'Tambah Ronde Pertama' : 'Add First Round'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ================= TAB 3: RECRUITER CRM ================= */}
                        {activeTab === 'crm' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
                                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                        <Users size={16} />
                                        {isIndo ? 'Informasi Recruiter & HR' : 'Recruiter & Hiring Contact'}
                                    </span>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                {isIndo ? 'Nama Recruiter / Talent Acquisition' : 'Recruiter Name'}
                                            </label>
                                            <input
                                                type="text"
                                                value={form.recruiter_name || ''}
                                                onChange={(e) => setForm(prev => ({ ...prev, recruiter_name: e.target.value }))}
                                                placeholder="Cth: Jessica Miller"
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Email Recruiter' : 'Email Address'}
                                                </label>
                                                <input
                                                    type="email"
                                                    value={form.recruiter_email || ''}
                                                    onChange={(e) => setForm(prev => ({ ...prev, recruiter_email: e.target.value }))}
                                                    placeholder="recruiter@company.com"
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Profil LinkedIn' : 'LinkedIn Profile URL'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.recruiter_linkedin || ''}
                                                    onChange={(e) => setForm(prev => ({ ...prev, recruiter_linkedin: e.target.value }))}
                                                    placeholder="https://linkedin.com/in/..."
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Follow-up Schedule */}
                                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 space-y-3">
                                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                        <Clock size={16} />
                                        {isIndo ? 'Jadwal Follow-Up Email' : 'Follow-Up Schedule'}
                                    </span>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                                                {isIndo ? 'Target Tanggal Follow-Up' : 'Follow-Up Due Date'}
                                            </label>
                                            <input
                                                type="date"
                                                value={form.follow_up_date || ''}
                                                onChange={(e) => setForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                                                {isIndo ? 'Status Follow-Up' : 'Status'}
                                            </label>
                                            <select
                                                value={form.follow_up_status || 'pending'}
                                                onChange={(e) => setForm(prev => ({ ...prev, follow_up_status: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                            >
                                                <option value="pending">{isIndo ? '⏳ Menunggu Waktu' : '⏳ Pending'}</option>
                                                <option value="sent">{isIndo ? '✅ Sudah Dikirim' : '✅ Email Sent'}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= TAB 4: STAR METHOD NOTES ================= */}
                        {activeTab === 'star_notes' && (
                            <div className="space-y-4">
                                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300">
                                    💡 <strong>{isIndo ? 'Metode STAR:' : 'STAR Method:'}</strong> {isIndo 
                                        ? 'Gunakan framework Situation, Task, Action, dan Result untuk menjawab pertanyaan studi kasus / behavioral dengan memukau.' 
                                        : 'Use Situation, Task, Action, and Result framework to ace behavioral questions.'}
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                            {isIndo ? '1. Situation (Konteks & Latar Belakang Masalah)' : '1. Situation (Context & Problem)'}
                                        </label>
                                        <textarea
                                            value={form.star_situation || ''}
                                            onChange={(e) => setForm(prev => ({ ...prev, star_situation: e.target.value }))}
                                            rows={2}
                                            placeholder={isIndo ? "Contoh: Di perusahaan sebelumnya, sistem checkout lambat dan drop 20%..." : "Describe the situation..."}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                            {isIndo ? '2. Task (Tanggung Jawab & Target Saya)' : '2. Task (Your Responsibility)'}
                                        </label>
                                        <textarea
                                            value={form.star_task || ''}
                                            onChange={(e) => setForm(prev => ({ ...prev, star_task: e.target.value }))}
                                            rows={2}
                                            placeholder={isIndo ? "Contoh: Tugas saya adalah merancang arsitektur cache baru dan optimasi database..." : "Describe your role..."}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                            {isIndo ? '3. Action (Langkah Konkret & Solusi yang Saya Eksekusi)' : '3. Action (Concrete Steps Taken)'}
                                        </label>
                                        <textarea
                                            value={form.star_action || ''}
                                            onChange={(e) => setForm(prev => ({ ...prev, star_action: e.target.value }))}
                                            rows={2}
                                            placeholder={isIndo ? "Contoh: Mengimplementasikan Redis caching dan re-index PostgreSQL query..." : "Describe your actions..."}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                                            {isIndo ? '4. Result (Hasil Kuantitatif & Dampak Positif)' : '4. Result (Metrics & Impact)'}
                                        </label>
                                        <textarea
                                            value={form.star_result || ''}
                                            onChange={(e) => setForm(prev => ({ ...prev, star_result: e.target.value }))}
                                            rows={2}
                                            placeholder={isIndo ? "Contoh: Latency turun 60% dan konversi checkout naik Rp 400jt per bulan..." : "Describe the measurable outcome..."}
                                            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            {form.id && onDelete && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onDelete(form);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition text-xs font-bold flex items-center gap-1.5"
                                    title={isIndo ? 'Hapus Lamaran' : 'Delete Application'}
                                >
                                    <Trash2 size={14} />
                                    <span>{isIndo ? 'Hapus Lamaran' : 'Delete'}</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                className="text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition px-3 py-2"
                            >
                                {isIndo ? 'Batal' : 'Cancel'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {onScanATS && (
                                <button
                                    type="button"
                                    onClick={() => { onClose(); onScanATS(form); }}
                                    className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center gap-1.5 hover:bg-indigo-100 transition"
                                >
                                    <Sparkles size={14} />
                                    <span>ATS Scan</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition flex items-center gap-1.5"
                            >
                                <CheckCircle2 size={15} />
                                <span>{isIndo ? 'Simpan Lamaran' : 'Save Application'}</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
