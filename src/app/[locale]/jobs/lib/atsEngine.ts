export interface AtsScanResult {
    matchScore: number;
    matchGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
    matchLabel: { id: string; en: string };
    matchedKeywords: string[];
    missingKeywords: string[];
    criticalGaps: string[];
    recommendations: Array<{ id: string; en: string }>;
    summaryText: { id: string; en: string };
}

// Master dictionary of common industry & technical keywords
const COMMON_SKILL_KEYWORDS = [
    // Web & Software
    'react', 'next.js', 'vue', 'typescript', 'javascript', 'html', 'css', 'tailwind', 'node.js', 'express',
    'python', 'django', 'fastapi', 'flask', 'golang', 'go', 'rust', 'c++', 'c#', '.net', 'java', 'spring boot',
    'php', 'laravel', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest api', 'docker',
    'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'git', 'github', 'linux', 'microservices', 'devops',
    
    // Data & AI
    'machine learning', 'deep learning', 'nlp', 'data science', 'pandas', 'numpy', 'scikit-learn', 'pytorch',
    'tensorflow', 'tableau', 'power bi', 'bigquery', 'data engineering', 'etl', 'sql server', 'spark',
    
    // Product & Design
    'figma', 'ui/ux', 'wireframing', 'prototyping', 'user research', 'agile', 'scrum', 'kanban', 'jira',
    'product management', 'okr', 'kpi', 'roadmap', 'design system', 'a/b testing', 'analytics',
    
    // Business, Marketing & Finance
    'seo', 'sem', 'google ads', 'copywriting', 'content strategy', 'crm', 'salesforce', 'hubspot',
    'b2b', 'b2c', 'financial modeling', 'budgeting', 'accounting', 'excel', 'market research',
    
    // Soft Skills & Methodologies
    'leadership', 'project management', 'communication', 'problem solving', 'teamwork', 'critical thinking',
    'negotiation', 'stakeholder management', 'collaboration', 'time management', 'mentoring', 'cross-functional'
];

/**
 * Extracts recognized skill keywords from arbitrary text
 */
export function extractKeywords(text: string): string[] {
    if (!text) return [];
    const normalized = text.toLowerCase();
    const found = new Set<string>();

    COMMON_SKILL_KEYWORDS.forEach(keyword => {
        // Simple word boundary check or exact inclusion
        const regex = new RegExp(`\\b${keyword.replace('+', '\\+').replace('.', '\\.')}\\b`, 'i');
        if (regex.test(normalized) || normalized.includes(keyword)) {
            found.add(keyword);
        }
    });

    // Also extract capitalized acronyms or technical terms (e.g. ATS, CRM, SDK, CI/CD, ERP)
    const acronymMatches = text.match(/\b[A-Z]{2,6}\b/g);
    if (acronymMatches) {
        acronymMatches.forEach(ac => {
            if (!['THE', 'AND', 'FOR', 'WITH', 'YOU', 'OUR', 'NOT', 'ALL'].includes(ac)) {
                found.add(ac.toLowerCase());
            }
        });
    }

    return Array.from(found);
}

/**
 * Analyzes ATS match between Master CV and Job Description
 */
export function runAtsScan(cvText: string, jobDescText: string, isIndo: boolean = true): AtsScanResult {
    const cvKeywords = new Set(extractKeywords(cvText));
    const jobKeywords = extractKeywords(jobDescText);

    if (jobKeywords.length === 0) {
        // Fallback if job description has generic keywords
        return {
            matchScore: 78,
            matchGrade: 'B',
            matchLabel: { id: 'Kecocokan Standar', en: 'Standard Match' },
            matchedKeywords: Array.from(cvKeywords).slice(0, 5),
            missingKeywords: ['agile', 'communication', 'leadership'],
            criticalGaps: ['communication'],
            recommendations: [
                { 
                    id: 'Tambahkan detail kuantitatif (angka/persentase) pada pencapaian proyek Anda.', 
                    en: 'Quantify your past project achievements with metrics and percentages.' 
                },
                { 
                    id: 'Sertakan lebih banyak kata kunci industri yang relevan dengan spesifikasi lowongan ini.', 
                    en: 'Include more domain-specific keywords relevant to this job role.' 
                }
            ],
            summaryText: {
                id: 'CV Anda memiliki keselarasan umum yang cukup baik. Tambahkan beberapa istilah kunci dari deskripsi pekerjaan untuk memperkuat posisi Anda di screening ATS.',
                en: 'Your CV has solid general alignment. Add key terminology from the job description to boost your ATS screening score.'
            }
        };
    }

    const matched: string[] = [];
    const missing: string[] = [];

    jobKeywords.forEach(kw => {
        if (cvKeywords.has(kw)) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    });

    // Score calculation
    const rawScore = (matched.length / jobKeywords.length) * 100;
    const matchScore = Math.min(98, Math.max(35, Math.round(rawScore)));

    let matchGrade: AtsScanResult['matchGrade'] = 'B';
    let matchLabel = { id: 'Peluang Bagus', en: 'Good Match' };

    if (matchScore >= 88) {
        matchGrade = 'A+';
        matchLabel = { id: 'Sangat Siap Lolos ATS 🚀', en: 'Highly ATS Optimized 🚀' };
    } else if (matchScore >= 75) {
        matchGrade = 'A';
        matchLabel = { id: 'Kecocokan Kuat 🟢', en: 'Strong Match 🟢' };
    } else if (matchScore >= 60) {
        matchGrade = 'B';
        matchLabel = { id: 'Peluang Cukup Bagus 💡', en: 'Fair Match 💡' };
    } else {
        matchGrade = 'C';
        matchLabel = { id: 'Perlu Penyesuaian Keyword ⚠️', en: 'Needs Keyword Tailoring ⚠️' };
    }

    const criticalGaps = missing.slice(0, 4);

    const recommendations: Array<{ id: string; en: string }> = [];

    if (missing.length > 0) {
        const missingPreview = missing.slice(0, 3).join(', ');
        recommendations.push({
            id: `Sisipkan kata kunci penting yang belum terdeteksi di CV: [${missingPreview}].`,
            en: `Incorporate missing high-impact keywords into your CV: [${missingPreview}].`
        });
    }

    recommendations.push({
        id: 'Gunakan metode STAR (Situation, Task, Action, Result) pada ringkasan pengalaman kerja.',
        en: 'Format experience bullet points using the STAR method (Situation, Task, Action, Result).'
    });

    if (matched.length >= 3) {
        recommendations.push({
            id: `Sorot keahlian unggulan Anda (${matched.slice(0, 2).join(' & ')}) di baris teratas ringkasan profil.`,
            en: `Highlight your matched strengths (${matched.slice(0, 2).join(' & ')}) in the top section of your profile summary.`
        });
    }

    const summaryText = {
        id: `Master CV Anda memiliki skor keselarasan ${matchScore}% (${matchGrade}) dengan posisi ini. Terdeteksi ${matched.length} keahlian cocok dan ${missing.length} peluang kata kunci untuk ditingkatkan.`,
        en: `Your Master CV matches ${matchScore}% (${matchGrade}) of the job requirements. Found ${matched.length} matching skills and ${missing.length} keyword enhancement opportunities.`
    };

    return {
        matchScore,
        matchGrade,
        matchLabel,
        matchedKeywords: matched,
        missingKeywords: missing,
        criticalGaps,
        recommendations,
        summaryText
    };
}
