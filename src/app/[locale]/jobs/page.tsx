'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import useSWR from 'swr';
import { 
    Briefcase, Plus, Sparkles, Table, 
    Calendar, BarChart3, SlidersHorizontal, ArrowUpDown,
    CheckCircle2, AlertCircle, Award, Zap
} from 'lucide-react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import GatedPage from '@/components/GatedPage';
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

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function JobsPage() {
    const locale = useLocale();
    const isIndo = locale === 'id';

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

    const handleDeleteJob = async (id: number | string) => {
        const confirmed = window.confirm(
            isIndo ? 'Apakah Anda yakin ingin menghapus lamaran ini?' : 'Are you sure you want to delete this application?'
        );
        if (!confirmed) return;

        setJobs(prev => prev.filter(j => j.id !== id));
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
                        />

                        {/* ================= VIEW 1: TABLE VIEW (PRIMARY COMMAND REGISTER) ================= */}
                        {viewMode === 'table' && (
                            <JobTable
                                jobs={filteredJobs}
                                onEdit={handleOpenDrawer}
                                onDelete={handleDeleteJob}
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
                        onDelete={handleDeleteJob}
                        onScanATS={handleOpenScan}
                        onOpenFullModal={handleOpenEditModal}
                    />

                    {/* Full Create / Edit Job Modal */}
                    <JobModal
                        show={isJobModalOpen}
                        job={selectedJobForEdit}
                        onClose={() => setIsJobModalOpen(false)}
                        onSave={handleSaveJob}
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

                </div>
            </GatedPage>
        </AuthenticatedLayout>
    );
}
