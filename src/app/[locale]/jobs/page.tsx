'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import JobStats, { JobStatsData } from './components/JobStats';
import JobFilterBar, { JobFilterParams } from './components/JobFilterBar';
import JobTable, { JobRowItem } from './components/JobTable';
import MasterCvModal from './components/MasterCvModal';
import ResumeAiModal from './components/ResumeAiModal';

const fetcher = (url: string) => fetch(url).then(res => res.json());
import GatedPage from '@/components/GatedPage';
import { Briefcase, Plus, Sparkles } from 'lucide-react';

export default function JobsPage() {
    const t = useTranslations();

    const { data: fetchedJobs, mutate: mutateJobs } = useSWR('/api/jobs', fetcher);

    const parsedJobs = useMemo(() => {
        if (!fetchedJobs) return null;
        return fetchedJobs.map((j: any) => ({
            id: j.id,
            _key: `db_${j.id}`,
            company: j.company,
            title: j.title,
            location: j.location || '',
            applied_date: j.appliedDate ? j.appliedDate.split('T')[0] : '',
            status: j.status,
            notes: j.notes || '',
            is_new: false,
            is_saving: false
        }));
    }, [fetchedJobs]);

    const [jobs, setJobs] = useState<JobRowItem[]>(parsedJobs || []);

    useEffect(() => {
        if (parsedJobs) {
            setJobs(parsedJobs);
        }
    }, [parsedJobs]);

    const [filters, setFilters] = useState<JobFilterParams>({ search: '', status: 'all', days: null });
    const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [activeJobForScan, setActiveJobForScan] = useState<JobRowItem | null>(null);

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

    // Compute Stats dynamically
    const stats: JobStatsData = useMemo(() => {
        const res: JobStatsData = { total: jobs.length, wishlist: 0, applied: 0, interview: 0, offer: 0, rejected: 0, accepted: 0 };
        jobs.forEach(j => {
            if (j.status && typeof (res as any)[j.status] === 'number') {
                (res as any)[j.status]++;
            }
        });
        return res;
    }, [jobs]);

    // Unique Job Titles for Autocomplete
    const uniqueTitles = useMemo(() => {
        const set = new Set<string>();
        jobs.forEach(j => { if (j.title) set.add(j.title); });
        return Array.from(set).sort();
    }, [jobs]);

    // Filtered Jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter(j => {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const matchComp = j.company?.toLowerCase().includes(q);
                const matchTitle = j.title?.toLowerCase().includes(q);
                const matchLoc = j.location?.toLowerCase().includes(q);
                if (!matchComp && !matchTitle && !matchLoc) return false;
            }
            if (filters.status && filters.status !== 'all' && j.status !== filters.status) {
                return false;
            }
            if (filters.days && j.applied_date) {
                const jobDate = new Date(j.applied_date).getTime();
                const now = new Date().getTime();
                const diffDays = (now - jobDate) / (1000 * 3600 * 24);
                if (diffDays > filters.days) return false;
            }
            return true;
        });
    }, [jobs, filters]);

    // Add empty row
    const addEmptyRow = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const newRow: JobRowItem = {
            id: 'temp_' + Date.now(),
            _key: 'temp_key_' + Date.now(),
            is_new: true,
            company: '',
            title: '',
            location: '',
            applied_date: todayStr,
            status: 'wishlist',
            is_saving: false
        };
        setJobs(prev => [newRow, ...prev]);
    };

    // Auto save row
    const handleAutoSaveRow = async (updatedJob: JobRowItem) => {
        setJobs(prev => prev.map(j => (j.id === updatedJob.id || j._key === updatedJob._key) ? { ...j, is_saving: true } : j));

        try {
            if (updatedJob.is_new) {
                const res = await fetch('/api/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: updatedJob.title || 'Untitled',
                        company: updatedJob.company || 'Unknown',
                        status: updatedJob.status || 'wishlist',
                        location: updatedJob.location,
                        applied_date: updatedJob.applied_date,
                        notes: updatedJob.notes
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setJobs(prev => prev.map(j => (j.id === updatedJob.id || j._key === updatedJob._key) ? { ...j, id: data.id, is_new: false, is_saving: false } : j));
                }
            } else {
                const res = await fetch(`/api/jobs/${updatedJob.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: updatedJob.title,
                        company: updatedJob.company,
                        status: updatedJob.status,
                        location: updatedJob.location,
                        applied_date: updatedJob.applied_date,
                        notes: updatedJob.notes
                    })
                });
                if (res.ok) {
                    setJobs(prev => prev.map(j => j.id === updatedJob.id ? { ...j, is_saving: false } : j));
                }
            }
        } catch (error) {
            console.error('Failed to save job:', error);
            setJobs(prev => prev.map(j => (j.id === updatedJob.id || j._key === updatedJob._key) ? { ...j, is_saving: false } : j));
        }
    };

    // Delete job
    const handleDeleteJob = async (id: number | string) => {
        setJobs(prev => prev.filter(j => j.id !== id));
        if (typeof id === 'number' || !String(id).startsWith('temp_')) {
            try {
                await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Failed to delete job:', error);
            }
        }
    };

    // Open AI scan modal
    const handleOpenScan = (job: JobRowItem) => {
        setActiveJobForScan(job);
        setIsAiModalOpen(true);
    };

    // Save master CV
    const handleSaveMasterCv = async (fileData: string, filename: string) => {
        const extractedText = `Master CV (${filename}) extracted data & intelligence preview.`;
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
                {/* 1:1 from Index.vue line 65-148 */}
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
                
                {/* SUB HEADER: Title + Total Badge + Actions — 1:1 from Index.vue line 67-103 */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 relative z-50 transition-colors duration-500">
                    <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 md:flex-nowrap">
                            
                            {/* Title & Total Badge */}
                            <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-initial md:max-w-[min(100%,28rem)]">
                                <p className="shrink-0 text-[13px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 mr-2 pr-4">
                                    {t('job_page_title') || 'Job Tracker'}
                                </p>
                                {jobs.length > 0 && (
                                    <div className="flex min-w-0 flex-1 items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                                        <span className="shrink-0 ml-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-full transition-colors duration-500">
                                            {jobs.length}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Right Actions */}
                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                {/* Master CV Button */}
                                <button 
                                    onClick={() => setIsMasterModalOpen(true)}
                                    className="px-4 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 group relative"
                                >
                                    <Briefcase size={16} className={hasMasterCv ? 'text-emerald-500' : 'text-slate-400'} />
                                    <span className="text-[10px] font-bold hidden lg:inline">
                                        {hasMasterCv ? (t('job_master_cv_ready') || 'CV Ready') : (t('job_master_cv_needs_setup') || 'Setup Master CV')}
                                    </span>
                                    {!hasMasterCv && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                                    )}
                                </button>

                                {/* Add Row Button */}
                                <button 
                                    onClick={addEmptyRow}
                                    className="bg-indigo-600 h-11 text-white font-black px-4 sm:px-6 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 shrink-0 relative overflow-hidden group"
                                >
                                    <Plus size={16} strokeWidth={4} />
                                    <span className="hidden sm:inline text-[11px] font-bold">
                                        {t('job_add_row') || 'Tambah Baris'}
                                    </span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Main Content Body — 1:1 from Index.vue line 105-146 */}
                <div className="w-full max-w-[98%] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 min-w-0 overflow-x-hidden transition-all duration-500">
                    
                    {/* Neural Bridge Banner */}
                    <div className="group relative overflow-hidden bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wide">
                                        Neural Bridge (Job Tracker)
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "Menghubungkan target karier dan histori lamaran kerja secara otomatis untuk mengkalkulasi skor kecocokan CV."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Job Stats Cards */}
                    <JobStats stats={stats} />

                    {/* Smart Filter Bar */}
                    <JobFilterBar
                        filters={filters}
                        uniqueTitles={uniqueTitles}
                        localJobs={jobs}
                        totalCount={filteredJobs.length}
                        onFilterChange={setFilters}
                    />

                    {/* Job Table */}
                    <JobTable
                        jobs={filteredJobs}
                        onAutoSave={handleAutoSaveRow}
                        onDelete={handleDeleteJob}
                        onScan={handleOpenScan}
                        onJobChange={(index, field, val) => {
                            const target = filteredJobs[index];
                            if (target) {
                                setJobs(prev => prev.map(j => 
                                    (j.id === target.id || j._key === target._key) 
                                        ? { ...j, [field]: val } 
                                        : j
                                ));
                            }
                        }}
                    />

                    {/* Modals */}
                    <ResumeAiModal
                        show={isAiModalOpen}
                        initialJobDescription={activeJobForScan?.notes || activeJobForScan?.title}
                        jobTitle={activeJobForScan?.title}
                        company={activeJobForScan?.company}
                        hasMasterCv={hasMasterCv}
                        masterCvName={masterCvFilename}
                        onClose={() => setIsAiModalOpen(false)}
                    />

                    <MasterCvModal
                        show={isMasterModalOpen}
                        hasMasterCv={hasMasterCv}
                        resumeFilename={masterCvFilename}
                        resumeText={masterCvText}
                        onClose={() => setIsMasterModalOpen(false)}
                        onSaveMasterCv={handleSaveMasterCv}
                    />

                    {/* Tips Box — 1:1 from Index.vue line 141-145 */}
                    <div className="mt-5 flex items-center justify-start">
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-500/10 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm transition-all duration-500">
                            <span className="text-indigo-500 dark:text-indigo-400 text-base">💡</span> 
                            {t('job_tips') || 'Tips: Klik sel pada tabel untuk mengedit. Data otomatis tersimpan saat berpindah sel.'}
                        </p>
                    </div>

                </div>

                </div>
            </GatedPage>
        </AuthenticatedLayout>
    );
}
