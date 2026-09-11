'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Calculator, Award, Sparkles, 
    ChevronDown, ChevronUp, RefreshCw, CheckCircle2,
    SlidersHorizontal, Settings2, Save, Check
} from 'lucide-react';
import { CourseRecord } from './CourseCard';

interface GpaSimulatorProps {
    courses: CourseRecord[]; // Current semester courses
    allCourses?: CourseRecord[]; // All courses across all semesters from Supabase
    terms: Record<string, string>;
    userSettings: Record<string, any>;
    onSaveBatchCourseGrades?: (updates: { id: number | string; grade: string }[]) => Promise<void>;
    onSaveUserSettings?: (updatedSettings: Record<string, any>) => Promise<void>;
}

const GRADE_POINTS: Record<string, number> = {
    'A': 4.0,
    'A-': 3.75,
    'B+': 3.5,
    'B': 3.0,
    'B-': 2.75,
    'C+': 2.5,
    'C': 2.0,
    'D': 1.0,
    'E': 0.0
};

export default function GpaSimulator({
    courses,
    allCourses = [],
    terms,
    userSettings,
    onSaveBatchCourseGrades,
    onSaveUserSettings
}: GpaSimulatorProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [isExpanded, setIsExpanded] = useState(false);
    const [showPriorModal, setShowPriorModal] = useState(false);
    
    // Local simulation overrides for current semester courses
    const [simulatedGrades, setSimulatedGrades] = useState<Record<string, string>>({});
    const [isApplyingGrades, setIsApplyingGrades] = useState(false);
    const [appliedSuccess, setAppliedSuccess] = useState(false);

    // Prior academic credentials (explicit user transfer SKS / IPK, default 0 - NO DUMMY!)
    const [priorSksInput, setPriorSksInput] = useState<number>(Number(userSettings.prior_sks) || 0);
    const [priorIpkInput, setPriorIpkInput] = useState<number>(Number(userSettings.prior_ipk) || 0);
    const [isSavingPrior, setIsSavingPrior] = useState(false);

    const priorSks = Number(userSettings.prior_sks) || 0;
    const priorIpk = Number(userSettings.prior_ipk) || 0;
    const priorPoints = priorSks * priorIpk;

    // Reset simulation
    const handleResetSimulation = () => {
        setSimulatedGrades({});
    };

    // Calculate Semester IPS (for current semester)
    const { totalSksSemester, currentIps, simulatedIps } = useMemo(() => {
        let sksSum = 0;
        let pointsSum = 0;
        let simulatedPointsSum = 0;

        courses.forEach(c => {
            const sksVal = Number(c.sks) || 0;
            sksSum += sksVal;

            const actualGrade = (c.grade || '').trim().toUpperCase() || 'A';
            const gradeWeight = GRADE_POINTS[actualGrade] ?? 4.0;
            pointsSum += (gradeWeight * sksVal);

            const simGrade = simulatedGrades[String(c.id)] || (c.grade || '').trim().toUpperCase() || 'A';
            const simWeight = GRADE_POINTS[simGrade] ?? 4.0;
            simulatedPointsSum += (simWeight * sksVal);
        });

        const curIps = sksSum > 0 ? (pointsSum / sksSum) : 0;
        const simIps = sksSum > 0 ? (simulatedPointsSum / sksSum) : 0;

        return {
            totalSksSemester: sksSum,
            currentIps: Number(curIps.toFixed(2)),
            simulatedIps: Number(simIps.toFixed(2))
        };
    }, [courses, simulatedGrades]);

    // Calculate Cumulative IPK across ALL courses in Supabase + Prior SKS
    const { totalCumulativeSks, actualCumulativeIpk, simulatedCumulativeIpk } = useMemo(() => {
        // Use allCourses if available, fallback to courses
        const coursesPool = allCourses.length > 0 ? allCourses : courses;
        
        let actualTotalPoints = priorPoints;
        let simulatedTotalPoints = priorPoints;
        let actualTotalSks = priorSks;

        coursesPool.forEach(c => {
            const sksVal = Number(c.sks) || 0;
            actualTotalSks += sksVal;

            const actualGrade = (c.grade || '').trim().toUpperCase() || 'A';
            const weight = GRADE_POINTS[actualGrade] ?? 4.0;
            actualTotalPoints += (weight * sksVal);

            // If this course is in the current semester and has simulation override:
            const isSimulated = simulatedGrades[String(c.id)];
            const simGrade = isSimulated ? isSimulated : actualGrade;
            const simWeight = GRADE_POINTS[simGrade] ?? 4.0;
            simulatedTotalPoints += (simWeight * sksVal);
        });

        const actualIpk = actualTotalSks > 0 ? (actualTotalPoints / actualTotalSks) : 0;
        const simIpk = actualTotalSks > 0 ? (simulatedTotalPoints / actualTotalSks) : 0;

        return {
            totalCumulativeSks: actualTotalSks,
            actualCumulativeIpk: Number(actualIpk.toFixed(2)),
            simulatedCumulativeIpk: Number(simIpk.toFixed(2))
        };
    }, [allCourses, courses, simulatedGrades, priorPoints, priorSks]);

    const getHonorBadge = (gpa: number, totalCredits: number) => {
        if (totalCredits === 0) {
            return {
                title: isIndo ? 'Belum Ada Nilai' : 'No Grades Yet',
                color: 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            };
        }
        if (gpa >= 3.80) return { title: isIndo ? 'Summa Cum Laude 🏆' : 'High Honors 🏆', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
        if (gpa >= 3.50) return { title: isIndo ? 'Cum Laude ✨' : 'Dean\'s List ✨', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' };
        if (gpa >= 3.00) return { title: isIndo ? 'Sangat Memuaskan 🎯' : 'Good Standing 🎯', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
        return { title: isIndo ? 'Perlu Ditingkatkan 📚' : 'Needs Focus 📚', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
    };

    const honorBadge = getHonorBadge(simulatedCumulativeIpk, totalCumulativeSks);

    // Save batch simulated grades to Supabase
    const handleApplySimulation = async () => {
        if (!onSaveBatchCourseGrades) return;
        const updates = Object.entries(simulatedGrades).map(([id, grade]) => ({ id, grade }));
        if (updates.length === 0) return;

        setIsApplyingGrades(true);
        try {
            await onSaveBatchCourseGrades(updates);
            setAppliedSuccess(true);
            setTimeout(() => setAppliedSuccess(false), 2500);
        } catch (e) {
            console.error('Failed to apply grades', e);
        } finally {
            setIsApplyingGrades(false);
        }
    };

    // Save prior academic credentials
    const handleSavePriorSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSaveUserSettings) return;
        setIsSavingPrior(true);
        try {
            await onSaveUserSettings({
                ...userSettings,
                prior_sks: Number(priorSksInput) || 0,
                prior_ipk: Number(priorIpkInput) || 0
            });
            setShowPriorModal(false);
        } catch (e) {
            console.error('Failed to save prior settings', e);
        } finally {
            setIsSavingPrior(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            
            {/* Top Bar Summary */}
            <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent">
                
                {/* Left: Metric Cards */}
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                                {isIndo ? 'Kalkulator & Simulator IPK Riil' : 'Live GPA & Credit Simulator'}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${honorBadge.color}`}>
                                {honorBadge.title}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isIndo 
                                ? `Kalkulasi akurat dari data mata kuliah Supabase (${totalSksSemester} SKS semester ini, total ${totalCumulativeSks} SKS kumulatif).` 
                                : `Live calculation from Supabase courses (${totalSksSemester} credits this semester, ${totalCumulativeSks} cumulative credits).`}
                        </p>
                    </div>
                </div>

                {/* Right: Quick Stats Scoreboard */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    
                    {/* Semester IPS */}
                    <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm min-w-[110px]">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                            {terms.ips || 'IPS Semester'}
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl sm:text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                                {totalSksSemester > 0 ? simulatedIps.toFixed(2) : '0.00'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">/ 4.00</span>
                        </div>
                    </div>

                    {/* Proyeksi IPK Kumulatif Riil */}
                    <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 min-w-[120px]">
                        <span className="text-[10px] font-black uppercase text-indigo-200 tracking-wider block">
                            {terms.ipk || 'IPK Kumulatif'}
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl sm:text-2xl font-black font-mono text-white">
                                {totalCumulativeSks > 0 ? simulatedCumulativeIpk.toFixed(2) : '0.00'}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-200">/ 4.00</span>
                        </div>
                    </div>

                    {/* Prior Transfer Credits Configuration Button */}
                    <button
                        type="button"
                        onClick={() => setShowPriorModal(!showPriorModal)}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition shrink-0 active:scale-95"
                        title={isIndo ? 'Atur SKS Awal / Transfer' : 'Configure Transfer Credits'}
                    >
                        <Settings2 size={16} />
                    </button>

                    {/* Expand Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-3.5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black transition flex items-center gap-1.5 shrink-0 active:scale-95"
                    >
                        <SlidersHorizontal size={14} className="text-indigo-500" />
                        <span>{isExpanded ? (isIndo ? 'Tutup Simulator' : 'Hide') : (isIndo ? 'Simulasi Nilai' : 'Simulate')}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                </div>

            </div>

            {/* Prior Transfer Settings Modal / Section */}
            {showPriorModal && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                {isIndo ? 'Konfigurasi SKS & IPK Awal (Transfer / Kampus Sebelumnya)' : 'Configure Prior Transfer Credits & GPA'}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {isIndo 
                                    ? 'Isi hanya jika Anda mahasiswa transfer/pindahan yang memiliki nilai dari semester terdahulu sebelum menggunakan Tranvas. Jika murni dari awal, biarkan 0.' 
                                    : 'Only fill this if you have transfer credits from a prior institution. Default is 0.'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSavePriorSettings} className="flex items-end gap-3 flex-wrap pt-2">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                                {isIndo ? 'SKS Awal' : 'Prior Credits'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="160"
                                value={priorSksInput}
                                onChange={(e) => setPriorSksInput(Number(e.target.value) || 0)}
                                className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                                {isIndo ? 'IPK Awal' : 'Prior GPA'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="4"
                                step="0.01"
                                value={priorIpkInput}
                                onChange={(e) => setPriorIpkInput(Number(e.target.value) || 0)}
                                className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSavingPrior}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition active:scale-95 disabled:opacity-50"
                        >
                            {isSavingPrior ? '...' : (isIndo ? 'Simpan' : 'Save')}
                        </button>
                    </form>
                </div>
            )}

            {/* Expanded Interactive Course Grade Tweaker */}
            {isExpanded && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-6 animate-in fade-in duration-200">
                    
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                {isIndo ? 'Simulasi Nilai per Mata Kuliah' : 'Tweak Grade Predictions per Course'}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                                {isIndo 
                                    ? 'Ubah prediksi nilai untuk melihat efek langsung ke IPS semester ini dan IPK kumulatif.' 
                                    : 'Change grade predictions to instantly preview the impact on your GPA.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {Object.keys(simulatedGrades).length > 0 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleResetSimulation}
                                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
                                    >
                                        <RefreshCw size={12} />
                                        <span>{isIndo ? 'Reset' : 'Reset'}</span>
                                    </button>

                                    {onSaveBatchCourseGrades && (
                                        <button
                                            type="button"
                                            onClick={handleApplySimulation}
                                            disabled={isApplyingGrades}
                                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center gap-1.5 shadow-sm transition active:scale-95"
                                        >
                                            {appliedSuccess ? <Check size={13} /> : <Save size={13} />}
                                            <span>
                                                {appliedSuccess
                                                    ? (isIndo ? 'Tersimpan!' : 'Saved!')
                                                    : isApplyingGrades
                                                    ? '...'
                                                    : (isIndo ? 'Terapkan ke Matakuliah' : 'Apply to Courses')}
                                            </span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Course Sliders Grid */}
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {courses.map((course) => {
                                const currentGrade = simulatedGrades[String(course.id)] || (course.grade || '').trim().toUpperCase() || 'A';

                                return (
                                    <div 
                                        key={course.id}
                                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0 space-y-0.5">
                                            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                                                {course.sks} {terms.sks || 'SKS'}
                                            </span>
                                            <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                                                {course.course_name}
                                            </h5>
                                        </div>

                                        {/* Grade Picker Selector */}
                                        <select
                                            value={currentGrade}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSimulatedGrades(prev => ({ ...prev, [String(course.id)]: val }));
                                            }}
                                            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-black text-xs border border-indigo-200 dark:border-indigo-800 outline-none cursor-pointer hover:bg-indigo-100"
                                        >
                                            <option value="A">A (4.00)</option>
                                            <option value="A-">A- (3.75)</option>
                                            <option value="B+">B+ (3.50)</option>
                                            <option value="B">B (3.00)</option>
                                            <option value="B-">B- (2.75)</option>
                                            <option value="C+">C+ (2.50)</option>
                                            <option value="C">C (2.00)</option>
                                            <option value="D">D (1.00)</option>
                                            <option value="E">E (0.00)</option>
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                            {isIndo ? 'Tambahkan mata kuliah pada semester ini untuk memulai simulasi.' : 'Add courses in this semester to begin simulation.'}
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}
