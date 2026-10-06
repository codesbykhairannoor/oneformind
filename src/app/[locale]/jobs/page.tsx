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
import ModuleHeader from '@/components/layout/ModuleHeader';

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


    // Fast Side Drawer state (Default click inspector)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedJobForDrawer, setSelectedJobForDrawer] = useState<JobRowItem | null>(null);

    // Spreadsheet Inline Adding Row Trigger
    const [isAddingRowActive, setIsAddingRowActive] = useState(false);
    
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
            if (dateB !== dateA) return dateB - dateA;

            // Secondary sort: ensure temp/newest jobs stay immediately on top
            const isTempA = typeof a.id === 'string' && a.id.startsWith('temp_');
            const isTempB = typeof b.id === 'string' && b.id.startsWith('temp_');
            if (isTempA && !isTempB) return -1;
            if (!isTempA && isTempB) return 1;

            const idA = Number(a.id) || 0;
            const idB = Number(b.id) || 0;
            return idB - idA;
        });

        return result;
    }, [jobs, filters]);

    // Handlers
    const handleOpenDrawer = (job: JobRowItem) => {
        setSelectedJobForDrawer(job);
        setIsDrawerOpen(true);
    };

    const handleStartAddingRow = () => {
        setIsAddingRowActive(true);
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

    const handleInlineCellUpdate = async (job: JobRowItem, field: keyof JobRowItem, value: any) => {
        if (job[field] === value) return;
        let finalVal = value;
        if (typeof value === 'string') {
            const val = value.trim();
            if (field === 'company') {
                finalVal = val || (isIndo ? 'Perusahaan Target' : 'Target Company');
            } else if (field === 'title') {
                finalVal = val || (isIndo ? 'Posisi Lamaran' : 'Job Title');
            } else {
                finalVal = val;
            }
        }
        const updated: JobRowItem = { ...job, [field]: finalVal };

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
            console.error('Failed to update job cell:', err);
        }
    };

    // Instant Direct Delete (No confirmation modal)
    const handleDirectDelete = async (jobOrId: JobRowItem | number | string) => {
        let id: string | number;
        if (typeof jobOrId === 'object' && jobOrId !== null) {
            id = jobOrId.id;
        } else {
            id = jobOrId;
        }

        // Close drawer if the deleted job was open in drawer
        if (selectedJobForDrawer && selectedJobForDrawer.id === id) {
            setIsDrawerOpen(false);
            setSelectedJobForDrawer(null);
        }

        // Instant optimistic UI removal
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
                    <ModuleHeader
                        icon={<Briefcase size={18} strokeWidth={2.5} />}
                        title={isIndo ? 'Pusat Manajemen Lamaran & Karier' : 'Job Tracker & Career Command'}
                        subtitle={isIndo ? 'Pipeline lamaran, jadwal interview & optimasi ATS' : 'Application pipeline, interview schedule & ATS optimization'}
                        actions={
                            <div className="flex items-center gap-2">
                                {/* Master CV Setup Trigger */}
                                <button 
                                    type="button"
                                    onClick={() => setIsMasterModalOpen(true)}
                                    className="h-10 px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2 group relative shadow-xs"
                                >
                                    <Briefcase size={15} className={hasMasterCv ? 'text-emerald-500' : 'text-slate-400'} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden md:inline">
                                        {hasMasterCv ? (isIndo ? 'Master CV Terhubung' : 'Master CV Connected') : (isIndo ? 'Setup Master CV' : 'Setup Master CV')}
                                    </span>
                                    {!hasMasterCv && (
                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    )}
                                </button>

                                {/* New Job Spreadsheet Button */}
                                <button 
                                    type="button"
                                    onClick={handleStartAddingRow}
                                    className="h-10 px-4 sm:px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    <span>
                                        {isIndo ? 'Tambah Lamaran' : 'Add Application'}
                                    </span>
                                </button>
                            </div>
                        }
                    />

                    {/* MAIN CONTAINER */}
                    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 min-w-0 transition-all duration-500">
                        
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

                        {/* ================= VIEW 1: TABLE VIEW (SPREADSHEET REGISTER) ================= */}
                        {viewMode === 'table' && (
                            <JobTable
                                jobs={filteredJobs}
                                onEdit={handleOpenDrawer}
                                onDelete={handleDirectDelete}
                                onScan={handleOpenScan}
                                onStatusChange={handleStatusChange}
                                onCellChange={handleInlineCellUpdate}
                                onQuickAddJob={(comp, tit, st, wm) => handleQuickAddJob(comp, tit, st, wm)}
                                isAddingRowActive={isAddingRowActive}
                                onCloseAddingRow={() => setIsAddingRowActive(false)}
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
                    
                    {/* Fast Slide-Over Drawer Inspector (Notion / Linear Style) */}
                    <JobDetailDrawer
                        show={isDrawerOpen}
                        job={selectedJobForDrawer}
                        onClose={() => setIsDrawerOpen(false)}
                        onSave={handleSaveJob}
                        onDelete={handleDirectDelete}
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
