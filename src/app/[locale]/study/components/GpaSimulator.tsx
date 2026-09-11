'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Calculator, TrendingUp, Award, Sparkles, 
    ChevronDown, ChevronUp, RefreshCw, CheckCircle2,
    SlidersHorizontal, Target, BookOpen
} from 'lucide-react';
import { CourseRecord } from './CourseCard';

interface GpaSimulatorProps {
    courses: CourseRecord[];
    terms: Record<string, string>;
    userSettings: Record<string, any>;
    onUpdateCourseGrade?: (courseId: number | string, grade: string) => void;
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
    terms,
    userSettings,
    onUpdateCourseGrade
}: GpaSimulatorProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [isExpanded, setIsExpanded] = useState(false);
    const [targetIpk, setTargetIpk] = useState<number>(3.80);
    
    // Local simulation overrides
    const [simulatedGrades, setSimulatedGrades] = useState<Record<string, string>>({});

    // Reset simulation
    const handleResetSimulation = () => {
        setSimulatedGrades({});
    };

    // Calculate Actual vs Simulated Semester GPA (IPS)
    const { totalSks, currentIps, simulatedIps, totalQualityPoints } = useMemo(() => {
        let sksSum = 0;
        let pointsSum = 0;
        let simulatedPointsSum = 0;

        courses.forEach(c => {
            const sksVal = Number(c.sks) || 3;
            sksSum += sksVal;

            const actualGrade = c.grade || 'A';
            const gradeWeight = GRADE_POINTS[actualGrade] ?? 4.0;
            pointsSum += (gradeWeight * sksVal);

            const simGrade = simulatedGrades[String(c.id)] || actualGrade;
            const simWeight = GRADE_POINTS[simGrade] ?? 4.0;
            simulatedPointsSum += (simWeight * sksVal);
        });

        const curIps = sksSum > 0 ? (pointsSum / sksSum) : 0;
        const simIps = sksSum > 0 ? (simulatedPointsSum / sksSum) : 0;

        return {
            totalSks: sksSum,
            currentIps: Number(curIps.toFixed(2)),
            simulatedIps: Number(simIps.toFixed(2)),
            totalQualityPoints: Number(pointsSum.toFixed(2))
        };
    }, [courses, simulatedGrades]);

    // Cumulative IPK Estimation
    const priorSks = Number(userSettings.prior_sks) || 40;
    const priorIpk = Number(userSettings.prior_ipk) || 3.75;
    const priorPoints = priorSks * priorIpk;

    const estimatedCumulativeIpk = useMemo(() => {
        const combinedSks = priorSks + totalSks;
        if (combinedSks === 0) return 0;
        const combinedPoints = priorPoints + (simulatedIps * totalSks);
        return Number((combinedPoints / combinedSks).toFixed(2));
    }, [priorSks, priorPoints, totalSks, simulatedIps]);

    const getHonorBadge = (gpa: number) => {
        if (gpa >= 3.80) return { title: isIndo ? 'Summa Cum Laude 🏆' : 'High Honors 🏆', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
        if (gpa >= 3.50) return { title: isIndo ? 'Cum Laude ✨' : 'Dean\'s List ✨', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' };
        if (gpa >= 3.00) return { title: isIndo ? 'Sangat Memuaskan 🎯' : 'Good Standing 🎯', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
        return { title: isIndo ? 'Perlu Ditingkatkan 📚' : 'Needs Focus 📚', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
    };

    const honorBadge = getHonorBadge(estimatedCumulativeIpk);

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
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                                {isIndo ? 'Simulator Target IPK & Beban SKS' : 'Interactive GPA & Credit Simulator'}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${honorBadge.color}`}>
                                {honorBadge.title}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isIndo 
                                ? `Simulasi kalkulasi nilai semester ini (${totalSks} SKS) & proyeksi IPK kumulatif.` 
                                : `Simulate this semester's grades (${totalSks} Credits) and cumulative GPA projection.`}
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
                                {simulatedIps.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">/ 4.00</span>
                        </div>
                    </div>

                    {/* Proyeksi IPK Kumulatif */}
                    <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 min-w-[120px]">
                        <span className="text-[10px] font-black uppercase text-indigo-200 tracking-wider block">
                            {terms.ipk || 'Proyeksi IPK'}
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xl sm:text-2xl font-black font-mono text-white">
                                {estimatedCumulativeIpk.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-200">/ 4.00</span>
                        </div>
                    </div>

                    {/* Expand Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-3.5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black transition flex items-center gap-1.5 shrink-0 active:scale-95"
                    >
                        <SlidersHorizontal size={14} className="text-indigo-500" />
                        <span>{isExpanded ? (isIndo ? 'Tutup Simulator' : 'Hide Simulator') : (isIndo ? 'Buka Simulator' : 'Simulate Grades')}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                </div>

            </div>

            {/* Expanded Interactive Course Grade Tweaker */}
            {isExpanded && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-6 animate-in fade-in duration-200">
                    
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                {isIndo ? 'Ubah Prediksi Nilai per Mata Kuliah' : 'Tweak Grade Predictions per Course'}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                                {isIndo 
                                    ? 'Pilih kombinasi target nilai huruf untuk melihat dampaknya ke IPS semester ini secara instan.' 
                                    : 'Select letter grade targets to instantly test scenarios on your GPA.'}
                            </p>
                        </div>

                        {Object.keys(simulatedGrades).length > 0 && (
                            <button
                                type="button"
                                onClick={handleResetSimulation}
                                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 text-[11px] font-bold flex items-center gap-1 transition"
                            >
                                <RefreshCw size={12} />
                                <span>{isIndo ? 'Reset Simulasi' : 'Reset to Actual'}</span>
                            </button>
                        )}
                    </div>

                    {/* Course Sliders Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {courses.map((course) => {
                            const currentGrade = simulatedGrades[String(course.id)] || course.grade || 'A';

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
                                            onUpdateCourseGrade?.(course.id, val);
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

                </div>
            )}

        </div>
    );
}
