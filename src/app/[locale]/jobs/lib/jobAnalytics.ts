export type JobStatus = 
    | 'wishlist' 
    | 'applied' 
    | 'screening' 
    | 'interview' 
    | 'offer' 
    | 'rejected' 
    | 'accepted' 
    | 'withdrawn'
    | string;

export type JobWorkModel = 'remote' | 'hybrid' | 'onsite' | string;
export type JobType = 'fulltime' | 'contract' | 'freelance' | 'internship' | 'parttime' | string;
export type SalaryPeriod = 'monthly' | 'yearly' | 'hourly' | string;
export type InterviewRoundType = 'hr_screening' | 'technical_test' | 'user_interview' | 'case_study' | 'culture_fit' | 'final_executive' | string;

export interface InterviewRound {
    id: string | number;
    round_type: InterviewRoundType;
    round_title?: string;
    scheduled_at?: string | null;
    interviewer_name?: string;
    meeting_link?: string;
    status: 'upcoming' | 'completed' | 'passed' | 'failed' | string;
    notes?: string;
}

export interface JobRowItem {
    id: number | string;
    _key?: string;
    is_new?: boolean;
    company: string;
    title: string;
    location: string;
    applied_date: string;
    status: JobStatus;
    work_model?: JobWorkModel;
    job_type?: JobType;
    
    // Compensation
    salary_min?: number | null;
    salary_max?: number | null;
    salary_currency?: 'IDR' | 'USD' | 'EUR' | 'SGD' | string;
    salary_period?: SalaryPeriod;
    benefits?: string[] | string;
    
    // Recruiter CRM
    recruiter_name?: string;
    recruiter_email?: string;
    recruiter_linkedin?: string;
    follow_up_date?: string | null;
    follow_up_status?: 'pending' | 'sent' | 'overdue' | string;
    
    // Multi-Round Interviews
    interview_rounds?: InterviewRound[];
    
    // STAR Method Notes
    star_situation?: string;
    star_task?: string;
    star_action?: string;
    star_result?: string;
    notes?: string;
    
    // ATS Match
    match_score?: number | null;
    matched_keywords?: string[];
    missing_keywords?: string[];
    
    is_saving?: boolean;
}

export interface JobFunnelStats {
    total: number;
    wishlist: number;
    applied: number;
    interview: number;
    offer: number;
    accepted: number;
    rejected: number;
    
    // Conversion Rates
    screeningRate: number; // % applied that got to interview
    offerRate: number;     // % interview that got to offer
    overallSuccessRate: number; // % total that got to offer/accepted
    
    // Upcoming interviews
    upcomingInterviewsCount: number;
    nextInterview: {
        company: string;
        title: string;
        scheduled_at: string;
        round_title: string;
        meeting_link?: string;
    } | null;
    
    // Overdue Follow-ups
    overdueFollowUpsCount: number;
    
    // Average salary offer (in IDR & USD)
    avgOfferSalaryIdr: number | null;
    avgOfferSalaryUsd: number | null;
}

/**
 * Calculates comprehensive recruitment funnel velocity and conversion metrics
 */
export function calculateJobFunnelStats(jobs: JobRowItem[]): JobFunnelStats {
    if (!jobs || jobs.length === 0) {
        return {
            total: 0,
            wishlist: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            accepted: 0,
            rejected: 0,
            screeningRate: 0,
            offerRate: 0,
            overallSuccessRate: 0,
            upcomingInterviewsCount: 0,
            nextInterview: null,
            overdueFollowUpsCount: 0,
            avgOfferSalaryIdr: null,
            avgOfferSalaryUsd: null,
        };
    }

    let wishlist = 0;
    let applied = 0;
    let interview = 0;
    let offer = 0;
    let accepted = 0;
    let rejected = 0;
    let overdueFollowUpsCount = 0;

    const allUpcomingInterviews: Array<{
        company: string;
        title: string;
        scheduled_at: string;
        round_title: string;
        meeting_link?: string;
    }> = [];

    const offerSalariesIdr: number[] = [];
    const offerSalariesUsd: number[] = [];

    const now = new Date().getTime();

    jobs.forEach(j => {
        const s = j.status;
        if (s === 'wishlist') wishlist++;
        else if (s === 'applied') applied++;
        else if (s === 'screening' || s === 'interview') interview++;
        else if (s === 'offer') offer++;
        else if (s === 'accepted') accepted++;
        else if (s === 'rejected') rejected++;

        // Collect upcoming interview rounds
        if (j.interview_rounds && Array.isArray(j.interview_rounds)) {
            j.interview_rounds.forEach(r => {
                if (r.status === 'upcoming' && r.scheduled_at) {
                    const schedTime = new Date(r.scheduled_at).getTime();
                    if (schedTime >= now - 86400000) { // Future or today
                        allUpcomingInterviews.push({
                            company: j.company,
                            title: j.title,
                            scheduled_at: r.scheduled_at,
                            round_title: r.round_title || r.round_type,
                            meeting_link: r.meeting_link
                        });
                    }
                }
            });
        }

        // Follow-up status check
        if (j.follow_up_date && (j.status === 'applied' || j.status === 'interview')) {
            const fDate = new Date(j.follow_up_date).getTime();
            if (fDate < now && j.follow_up_status !== 'sent') {
                overdueFollowUpsCount++;
            }
        }

        // Salary stats for offers/accepted
        if (s === 'offer' || s === 'accepted') {
            const salVal = j.salary_max || j.salary_min;
            if (salVal && salVal > 0) {
                if (j.salary_currency === 'USD') {
                    offerSalariesUsd.push(salVal);
                } else {
                    offerSalariesIdr.push(salVal);
                }
            }
        }
    });

    const totalAppliedOrBeyond = applied + interview + offer + accepted + rejected;
    const totalInterviewOrBeyond = interview + offer + accepted;
    const totalOfferOrBeyond = offer + accepted;

    // Conversion rates
    const screeningRate = totalAppliedOrBeyond > 0 
        ? Math.round((totalInterviewOrBeyond / totalAppliedOrBeyond) * 100) 
        : 0;

    const offerRate = totalInterviewOrBeyond > 0 
        ? Math.round((totalOfferOrBeyond / totalInterviewOrBeyond) * 100) 
        : 0;

    const overallSuccessRate = jobs.length > 0 
        ? Math.round((totalOfferOrBeyond / jobs.length) * 100) 
        : 0;

    // Sort upcoming interviews by nearest date
    allUpcomingInterviews.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    const nextInterview = allUpcomingInterviews[0] || null;

    const avgOfferSalaryIdr = offerSalariesIdr.length > 0 
        ? Math.round(offerSalariesIdr.reduce((a, b) => a + b, 0) / offerSalariesIdr.length) 
        : null;

    const avgOfferSalaryUsd = offerSalariesUsd.length > 0 
        ? Math.round(offerSalariesUsd.reduce((a, b) => a + b, 0) / offerSalariesUsd.length) 
        : null;

    return {
        total: jobs.length,
        wishlist,
        applied,
        interview,
        offer,
        accepted,
        rejected,
        screeningRate,
        offerRate,
        overallSuccessRate,
        upcomingInterviewsCount: allUpcomingInterviews.length,
        nextInterview,
        overdueFollowUpsCount,
        avgOfferSalaryIdr,
        avgOfferSalaryUsd
    };
}

/**
 * Packs extended career metadata into notes payload safely
 */
export function serializeJobPayload(job: JobRowItem): {
    title: string;
    company: string;
    status: string;
    location: string;
    appliedDate: string;
    notes: string;
} {
    const meta = {
        work_model: job.work_model || 'remote',
        job_type: job.job_type || 'fulltime',
        salary_min: job.salary_min ?? null,
        salary_max: job.salary_max ?? null,
        salary_currency: job.salary_currency || 'IDR',
        salary_period: job.salary_period || 'monthly',
        benefits: job.benefits || '',
        recruiter_name: job.recruiter_name || '',
        recruiter_email: job.recruiter_email || '',
        recruiter_linkedin: job.recruiter_linkedin || '',
        follow_up_date: job.follow_up_date || null,
        follow_up_status: job.follow_up_status || 'pending',
        interview_rounds: job.interview_rounds || [],
        star_situation: job.star_situation || '',
        star_task: job.star_task || '',
        star_action: job.star_action || '',
        star_result: job.star_result || '',
        raw_notes: job.notes || ''
    };

    return {
        title: job.title || 'Untitled Position',
        company: job.company || 'Unknown Company',
        status: job.status || 'applied',
        location: job.location || 'Remote',
        appliedDate: job.applied_date || new Date().toISOString().split('T')[0],
        notes: JSON.stringify(meta)
    };
}

/**
 * Unpacks job payload from API / Database into rich JobRowItem
 */
export function deserializeJobPayload(j: any): JobRowItem {
    let parsedMeta: any = {};
    let rawNotes = '';

    if (j.notes) {
        try {
            if (typeof j.notes === 'string' && j.notes.trim().startsWith('{')) {
                parsedMeta = JSON.parse(j.notes);
                rawNotes = parsedMeta.raw_notes || '';
            } else {
                rawNotes = j.notes;
            }
        } catch {
            rawNotes = j.notes;
        }
    }

    return {
        id: j.id,
        _key: `job_${j.id}`,
        company: j.company || '',
        title: j.title || '',
        location: j.location || parsedMeta.location || 'Remote',
        applied_date: j.appliedDate ? j.appliedDate.split('T')[0] : (parsedMeta.applied_date || new Date().toISOString().split('T')[0]),
        status: j.status || 'applied',
        work_model: parsedMeta.work_model || j.work_model || 'remote',
        job_type: parsedMeta.job_type || j.job_type || 'fulltime',
        salary_min: parsedMeta.salary_min !== undefined ? parsedMeta.salary_min : (j.salary_min ?? null),
        salary_max: parsedMeta.salary_max !== undefined ? parsedMeta.salary_max : (j.salary_max ?? null),
        salary_currency: parsedMeta.salary_currency || j.salary_currency || 'IDR',
        salary_period: parsedMeta.salary_period || j.salary_period || 'monthly',
        benefits: parsedMeta.benefits || j.benefits || '',
        recruiter_name: parsedMeta.recruiter_name || j.recruiter_name || '',
        recruiter_email: parsedMeta.recruiter_email || j.recruiter_email || '',
        recruiter_linkedin: parsedMeta.recruiter_linkedin || j.recruiter_linkedin || '',
        follow_up_date: parsedMeta.follow_up_date || j.follow_up_date || null,
        follow_up_status: parsedMeta.follow_up_status || j.follow_up_status || 'pending',
        interview_rounds: parsedMeta.interview_rounds || j.interview_rounds || [],
        star_situation: parsedMeta.star_situation || j.star_situation || '',
        star_task: parsedMeta.star_task || j.star_task || '',
        star_action: parsedMeta.star_action || j.star_action || '',
        star_result: parsedMeta.star_result || j.star_result || '',
        notes: rawNotes,
        is_new: false,
        is_saving: false
    };
}

/**
 * Formats structured currency values cleanly
 */
export function formatSalaryDisplay(
    min?: number | null, 
    max?: number | null, 
    currency: string = 'IDR', 
    period: string = 'monthly',
    isIndo: boolean = true
): string {
    if (!min && !max) {
        return isIndo ? 'Gaji Dirahasiakan' : 'Undisclosed Salary';
    }

    const currSymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'SGD' ? 'S$' : 'Rp';
    const periodLabel = period === 'yearly' 
        ? (isIndo ? '/thn' : '/yr') 
        : period === 'hourly' 
        ? (isIndo ? '/jam' : '/hr') 
        : (isIndo ? '/bln' : '/mo');

    const formatNum = (n: number) => {
        if (currency === 'IDR') {
            if (n >= 1000000) {
                return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + ' Juta';
            }
            return n.toLocaleString('id-ID');
        }
        if (n >= 1000) {
            return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
        }
        return n.toLocaleString('en-US');
    };

    if (min && max && min !== max) {
        return `${currSymbol} ${formatNum(min)} - ${formatNum(max)} ${periodLabel}`;
    }
    const val = (max || min) as number;
    return `${currSymbol} ${formatNum(val)} ${periodLabel}`;
}
