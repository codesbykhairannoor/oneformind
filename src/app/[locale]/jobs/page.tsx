'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import useSWR from 'swr';
import { 
    Briefcase, Plus, Sparkles, Table, 
    Calendar, BarChart3, SlidersHorizontal, ArrowUpDown,
    CheckCircle2, AlertCircle, Award, Zap, Trash2, X
} from 'lucide-react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import GatedPage from '@/components/GatedPage';
import ModalPortal from '@/components/ModalPortal';
import JobStats from './components/JobStats';
import JobFilterBar, { JobFilterParams, JobViewMode } from './components/JobFilterBar';
import JobTable from './components/JobTable';
import JobInterviewsCalendarView from './components/JobInterviewsCalendarView';
import JobOfferComparisonModal from './components/JobOfferComparisonModal';
import JobModal from './components/JobModal';
import JobDetailDrawer from './components/JobDetailDrawer';
import MasterCvModal from './components/MasterCvModal';
import ResumeAiModal from './components/ResumeAiModal';
import { 
    JobRowItem, 
    calculateJobFunnelStats, 
    serializeJobPayload, 
    deserializeJobPayload 
} from './lib/jobAnalytics';
import ExportModal from '@/components/export/ExportModal';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function JobsPage() {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const [isExportOpen, setIsExportOpen] = useState(false);

    const { data: fetchedJobs, mutate: mutateJobs } = useSWR('/api/jobs', fetcher);

    const parsedJobs = useMemo(() => {
        if (!fetchedJobs || !Array.isArray(fetchedJobs)) return null;
        return fetchedJobs.map((j: any) => deserializeJobPayload(j));
    }, [fetchedJobs]);

    const [jobs, setJobs] = useState<JobRowItem[]>([]);

    useEffect(() => {
        if (parsedJobs) {
            setJobs(parsedJobs);
        }
    }, [parsedJobs]);

    // View state (Table view is the clean primary default)
    const [viewMode, setViewMode] = useState<JobViewMode>('table');
    const [filters, setFilters] = useState<JobFilterParams>({ 
        search: '', 
        status: 'all', 
        workModel: 'all', 
        days: null,
        sortBy: 'applied_date'
    });

    // Delete Confirmation Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<JobRowItem | null>(null);

    // Fast Side Drawer state (Default click inspector)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedJobForDrawer, setSelectedJobForDrawer] = useState<JobRowItem | null>(null);

    // Full Modal state (For comprehensive editing)
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedJobForEdit, setSelectedJobForEdit] = useState<JobRowItem | null>(null);
    
    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [activeJobForScan, setActiveJobForScan] = useState<JobRowItem | null>(null);

    // User Master CV
    const [masterCvFilename, setMasterCvFilename] = useState<string>('');
    const [masterCvText, setMasterCvText] = useState<string>('');

    useEffect(() => {
        const fetchUserResume = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    setMasterCvFilename(data.resumeFilename || '');
                    setMasterCvText(data.resumeText || '');
                }
            } catch (err) {
                console.error('Failed to fetch user resume:', err);
            }
        };
        fetchUserResume();
    }, []);

    const hasMasterCv = Boolean(masterCvText || masterCvFilename);

    // Funnel & Velocity Analytics
    const funnelStats = useMemo(() => {
        return calculateJobFunnelStats(jobs);
    }, [jobs]);

    // Unique Job Titles
    const uniqueTitles = useMemo(() => {
        const set = new Set<string>();
        jobs.forEach(j => { if (j.title) set.add(j.title); });
        return Array.from(set).sort();
    }, [jobs]);

    // Filter & Sort Logic
    const filteredJobs = useMemo(() => {
        const result = jobs.filter(j => {
            // Search
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const matchComp = j.company?.toLowerCase().includes(q);
                const matchTitle = j.title?.toLowerCase().includes(q);
                const matchLoc = j.location?.toLowerCase().includes(q);
                const matchRec = j.recruiter_name?.toLowerCase().includes(q);
                if (!matchComp && !matchTitle && !matchLoc && !matchRec) return false;
            }

            // Status
            if (filters.status && filters.status !== 'all' && j.status !== filters.status) {
                return false;
            }

            // Work Model
            if (filters.workModel && filters.workModel !== 'all' && j.work_model !== filters.workModel) {
                return false;
            }

            // Days Horizon
            if (filters.days && j.applied_date) {
                const jobDate = new Date(j.applied_date).getTime();
                const now = new Date().getTime();
                const diffDays = (now - jobDate) / (1000 * 3600 * 24);
                if (diffDays > filters.days) return false;
            }

            return true;
        });

        // Sorting
        result.sort((a, b) => {
            if (filters.sortBy === 'salary') {
                const salA = a.salary_max || a.salary_min || 0;
                const salB = b.salary_max || b.salary_min || 0;
                return salB - salA;
            }
            if (filters.sortBy === 'company') {
                return (a.company || '').localeCompare(b.company || '');
            }
            if (filters.sortBy === 'status') {
                return (a.status || '').localeCompare(b.status || '');
            }
            // default: applied_date desc
            const dateA = a.applied_date ? new Date(a.applied_date).getTime() : 0;
            const dateB = b.applied_date ? new Date(b.applied_date).getTime() : 0;
            return dateB - dateA;
        });

        return result;
    }, [jobs, filters]);

    // Handlers
    const handleOpenDrawer = (job: JobRowItem) => {
        setSelectedJobForDrawer(job);
        setIsDrawerOpen(true);
    };

    const handleOpenCreateModal = (defaultStatus = 'applied') => {
        setSelectedJobForEdit({
            id: '',
            company: '',
            title: '',
            location: 'Remote',
            applied_date: new Date().toISOString().split('T')[0],
            status: defaultStatus,
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
        setIsJobModalOpen(true);
    };

    const handleOpenEditModal = (job: JobRowItem) => {
        setIsDrawerOpen(false);
        setSelectedJobForEdit(job);
        setIsJobModalOpen(true);
    };

    // Cross-Module Life OS: Auto-Complete Job Application Habit
    const [jobHabitNotice, setJobHabitNotice] = useState<string | null>(null);

    const triggerJobHabitAutoCompletion = async () => {
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const periodStr = todayStr.substring(0, 7);
            const res = await fetch(`/api/habits?period=${periodStr}`);
            if (!res.ok) return;
            const habits = await res.json();
            if (!Array.isArray(habits)) return;

            const jobHabit = habits.find((h: any) => {
                let meta: any = {};
                if (h.status && typeof h.status === 'string' && h.status.startsWith('{')) {
                    try { meta = JSON.parse(h.status); } catch {}
                } else if (h.status && typeof h.status === 'object') {
                    meta = h.status;
                }

                if (meta.syncedTabs && Array.isArray(meta.syncedTabs)) {
                    return meta.syncedTabs.includes('jobs');
                }

                const name = (h.name || '').toLowerCase();
                return name.includes('lamar') || name.includes('apply') || name.includes('job') || 
                       name.includes('karir') || name.includes('career') || name.includes('kerja');
            });

            if (jobHabit) {
                await fetch(`/api/habits/${jobHabit.id}/logs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: todayStr,
                        status: 'completed'
                    })
                });
                setJobHabitNotice(jobHabit.name);
                setTimeout(() => setJobHabitNotice(null), 7000);
            }
        } catch (e) {
            console.error('Failed to auto-complete job habit:', e);
        }
    };

    // FAST INSTANT OPTIMISTIC QUICK ADD (NO MODAL!)
    const handleQuickAddJob = async (company: string, title: string, status: string = 'applied', workModel: string = 'remote', linkUrl?: string) => {
        const tempId = 'temp_' + Date.now();
        const newJob: JobRowItem = {
            id: tempId,
            company: company || (isIndo ? 'Perusahaan Target' : 'Target Company'),
            title: title || (isIndo ? 'Posisi Lamaran' : 'Job Title'),
            location: workModel === 'remote' ? 'Remote' : 'Jakarta',
            applied_date: new Date().toISOString().split('T')[0],
            status: status || 'applied',
            work_model: workModel || 'remote',
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
            notes: linkUrl ? `Job Link: ${linkUrl}` : ''
        };

        // Instant optimistic update to state
        setJobs(prev => [newJob, ...prev]);

        if (status === 'applied') {
            triggerJobHabitAutoCompletion();
        }

        // Post payload to backend API
        try {
            const payload = serializeJobPayload(newJob);
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                setJobs(prev => prev.map(j => j.id === tempId ? { ...j, id: data.id } : j));
                mutateJobs();
            }
        } catch (err) {
            console.error('Failed to quick add job:', err);
        }
    };

    const handleSaveJob = async (jobForm: JobRowItem) => {
        setIsJobModalOpen(false);
        setIsDrawerOpen(false);

        const isNew = !jobForm.id || String(jobForm.id).startsWith('temp_');
        const payload = serializeJobPayload(jobForm);

        if (isNew) {
            // Optimistic create
            const tempId = 'temp_' + Date.now();
            const optimisticJob: JobRowItem = { ...jobForm, id: tempId };
            setJobs(prev => [optimisticJob, ...prev]);

            if (jobForm.status === 'applied') {
                triggerJobHabitAutoCompletion();
            }

            try {
                const res = await fetch('/api/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    setJobs(prev => prev.map(j => j.id === tempId ? { ...j, id: data.id } : j));
                    mutateJobs();
                }
            } catch (err) {
                console.error('Failed to create job:', err);
            }
        } else {
            // Optimistic update
            setJobs(prev => prev.map(j => j.id === jobForm.id ? jobForm : j));

            try {
                const res = await fetch(`/api/jobs/${jobForm.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    mutateJobs();
                }
            } catch (err) {
                console.error('Failed to update job:', err);
            }
        }
    };

    const handleStatusChange = async (job: JobRowItem, newStatus: string) => {
        const updated = { ...job, status: newStatus };
        setJobs(prev => prev.map(j => j.id === job.id ? updated : j));

        try {
            const payload = serializeJobPayload(updated);
            await fetch(`/api/jobs/${job.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            mutateJobs();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleRequestDelete = (jobOrId: JobRowItem | number | string) => {
        if (typeof jobOrId === 'object' && jobOrId !== null) {
            setJobToDelete(jobOrId);
        } else {
            const found = jobs.find(j => j.id === jobOrId) || null;
            if (found) {
                setJobToDelete(found);
            } else {
                setJobToDelete({ id: jobOrId, company: '', title: '' } as JobRowItem);
            }
        }
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!jobToDelete) return;
        const id = jobToDelete.id;

        // Optimistic UI update
        setJobs(prev => prev.filter(j => j.id !== id));
        setDeleteModalOpen(false);
        setJobToDelete(null);

        if (typeof id === 'number' || !String(id).startsWith('temp_')) {
            try {
                await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
                mutateJobs();
            } catch (error) {
                console.error('Failed to delete job:', error);
            }
        }
    };

    const handleOpenScan = (job: JobRowItem) => {
        setActiveJobForScan(job);
        setIsAiModalOpen(true);
    };

    const handleSaveMasterCv = async (fileData: string, filename: string, textData?: string) => {
        const extractedText = textData || `Master CV (${filename}) extracted intelligence baseline.`;
        setMasterCvFilename(filename);
        setMasterCvText(extractedText);
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeFilename: filename, resumeText: extractedText })
            });
        } catch (err) {
            console.error('Failed to save resume to DB', err);
        }
    };

    return (
        <AuthenticatedLayout>
            <GatedPage feature="job">
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
                    
                    {/* TOP NAVBAR / SUB HEADER */}
                    <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 relative z-40 transition-colors duration-500">
                        <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-3.5">
                            <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 md:flex-nowrap">
                                
                                {/* Title & Pipeline Count Badge */}
                                <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-initial">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                                        <Briefcase size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-800 dark:text-white truncate">
                                            {isIndo ? 'Pusat Manajemen Lamaran & Karier' : 'Job Tracker & Career Command'}
                                        </h1>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                                            {isIndo ? 'Pipeline Lamaran • Multi-Round Interview • ATS Optimization' : 'Application Pipeline • Interview Hub • ATS Engine'}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions: Master CV & New Job Button */}
                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    {/* Master CV Setup Trigger */}
                                    <button 
                                        type="button"
                                        onClick={() => setIsMasterModalOpen(true)}
                                        className="px-3.5 sm:px-4 h-11 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2 group relative shadow-sm"
                                    >
                                        <Briefcase size={16} className={hasMasterCv ? 'text-emerald-500' : 'text-slate-400'} />
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden md:inline">
                                            {hasMasterCv ? (isIndo ? 'Master CV Terhubung' : 'Master CV Connected') : (isIndo ? 'Setup Master CV' : 'Setup Master CV')}
                                        </span>
                                        {!hasMasterCv && (
                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        )}
                                    </button>

                                    {/* New Job Full Modal Button */}
                                    <button 
                                        type="button"
                                        onClick={() => handleOpenCreateModal('applied')}
                                        className="bg-indigo-600 hover:bg-indigo-700 h-11 text-white font-black px-4 sm:px-6 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 shrink-0"
                                    >
                                        <Plus size={16} strokeWidth={3} />
                                        <span className="text-xs font-black tracking-wide">
                                            {isIndo ? 'Tambah Lamaran' : 'New Application'}
                                        </span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTAINER */}
                    <div className="w-full max-w-[98%] mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-4 space-y-3 min-w-0 transition-all duration-500">
                        
                        {/* Cross-Module Life OS: Habit Auto-Completion Banner */}
                        {jobHabitNotice && (
                            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-700 dark:text-emerald-300 animate-in fade-in slide-in-from-top-2 shadow-xs">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-base">🎯</span>
                                    <p className="text-xs font-bold">
                                        {isIndo 
                                            ? `Lamaran berhasil dicatat! Kebiasaan "${jobHabitNotice}" otomatis tersinkronisasi dan tuntas hari ini.` 
                                            : `Application logged! Habit "${jobHabitNotice}" marked completed today automatically.`}
                                    </p>
                                </div>
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white shrink-0">
                                    {isIndo ? 'Satu Data OS' : 'Unified OS'}
                                </span>
                            </div>
                        )}

                        {/* Recruitment Funnel Stats & Velocity Cards */}
                        <JobStats 
                            stats={funnelStats} 
                            onOpenOfferComparison={() => setViewMode('compare')}
                        />

                        {/* Filter Bar & 4-View Switcher */}
                        <JobFilterBar
                            filters={filters}
                            onFilterChange={setFilters}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            uniqueTitles={uniqueTitles}
                            jobs={jobs}
                            totalCount={jobs.length}
                            filteredCount={filteredJobs.length}
                            onOpenExportModal={() => setIsExportOpen(true)}
                        />

                        {/* ================= VIEW 1: TABLE VIEW (PRIMARY COMMAND REGISTER) ================= */}
                        {viewMode === 'table' && (
                            <JobTable
                                jobs={filteredJobs}
                                onEdit={handleOpenDrawer}
                                onDelete={handleRequestDelete}
                                onScan={handleOpenScan}
                                onStatusChange={handleStatusChange}
                                onQuickAddJob={(comp, tit, st, wm) => handleQuickAddJob(comp, tit, st, wm)}
                            />
                        )}

                        {/* ================= VIEW 2: INTERVIEWS HUB ================= */}
                        {viewMode === 'interviews' && (
                            <JobInterviewsCalendarView
                                jobs={jobs}
                                onEditJob={handleOpenDrawer}
                                onAddInterview={(j) => handleOpenDrawer(j)}
                            />
                        )}

                        {/* ================= VIEW 3: OFFER COMPARISON ================= */}
                        {viewMode === 'compare' && (
                            <JobOfferComparisonModal
                                jobs={jobs}
                                onAcceptOffer={(j) => handleStatusChange(j, 'accepted')}
                                onEditJob={handleOpenDrawer}
                            />
                        )}

                    </div>

                    {/* MODALS & DRAWERS */}
                    
                    {/* Fast Slide-Over Drawer Inspector */}
                    <JobDetailDrawer
                        show={isDrawerOpen}
                        job={selectedJobForDrawer}
                        onClose={() => setIsDrawerOpen(false)}
                        onSave={handleSaveJob}
                        onDelete={handleRequestDelete}
                        onScanATS={handleOpenScan}
                        onOpenFullModal={handleOpenEditModal}
                    />

                    {/* Full Create / Edit Job Modal */}
                    <JobModal
                        show={isJobModalOpen}
                        job={selectedJobForEdit}
                        onClose={() => setIsJobModalOpen(false)}
                        onSave={handleSaveJob}
                        onDelete={handleRequestDelete}
                        onScanATS={handleOpenScan}
                    />

                    {/* ATS Resume Scan Modal */}
                    <ResumeAiModal
                        show={isAiModalOpen}
                        initialJobDescription={activeJobForScan?.notes || activeJobForScan?.title}
                        jobTitle={activeJobForScan?.title}
                        company={activeJobForScan?.company}
                        hasMasterCv={hasMasterCv}
                        masterCvName={masterCvFilename}
                        masterCvText={masterCvText}
                        onClose={() => setIsAiModalOpen(false)}
                    />

                    {/* Master CV Setup Modal */}
                    <MasterCvModal
                        show={isMasterModalOpen}
                        hasMasterCv={hasMasterCv}
                        resumeFilename={masterCvFilename}
                        resumeText={masterCvText}
                        onClose={() => setIsMasterModalOpen(false)}
                        onSaveMasterCv={handleSaveMasterCv}
                    />

                    {/* DEDICATED IN-APP DELETE CONFIRMATION MODAL */}
                    {deleteModalOpen && (
                        <ModalPortal>
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                                {/* Backdrop */}
                                <div 
                                    className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
                                    onClick={() => setDeleteModalOpen(false)} 
                                />

                                {/* Modal Card */}
                                <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 space-y-5 animate-in zoom-in-95 fade-in duration-200">
                                    
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/40 shadow-sm">
                                            <Trash2 size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-black text-slate-800 dark:text-white">
                                                {isIndo ? 'Hapus Lamaran Kerja?' : 'Delete Job Application?'}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                {isIndo 
                                                    ? 'Tindakan ini tidak dapat dibatalkan. Riwayat wawancara, catatan recruiter, dan follow-up akan dihapus.' 
                                                    : 'This action cannot be undone. All interview history, recruiter CRM notes, and follow-ups will be deleted.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Target Job Info Card */}
                                    {jobToDelete && (
                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                                                {jobToDelete.company ? jobToDelete.company.charAt(0).toUpperCase() : '💼'}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">
                                                    {jobToDelete.title || (isIndo ? 'Posisi Lamaran' : 'Job Title')}
                                                </h4>
                                                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                                                    {jobToDelete.company || (isIndo ? 'Perusahaan' : 'Company')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-2.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDeleteModalOpen(false);
                                                setJobToDelete(null);
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition"
                                        >
                                            {isIndo ? 'Batal' : 'Cancel'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleConfirmDelete}
                                            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-500/25 active:scale-95 transition flex items-center gap-1.5"
                                        >
                                            <Trash2 size={14} />
                                            <span>{isIndo ? 'Ya, Hapus Lamaran' : 'Yes, Delete'}</span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </ModalPortal>
                    )}

                    {/* Universal Export Modal (CSV & JSON) */}
                    <ExportModal
                        isOpen={isExportOpen}
                        onClose={() => setIsExportOpen(false)}
                        moduleType="jobs"
                        currentData={jobs}
                    />

                </div>
            </GatedPage>
        </AuthenticatedLayout>
    );
}
