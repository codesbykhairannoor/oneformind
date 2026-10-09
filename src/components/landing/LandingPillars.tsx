'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function LandingPillars() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    return (
        <section className="py-20 sm:py-28 lg:py-36 bg-slate-50 border-t border-slate-200/80 scroll-mt-20" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs sm:text-sm mb-6 tracking-wider uppercase border border-indigo-200/80 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        {t('pill_badge')}
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 font-black tracking-tight leading-[1.1]">
                        {t('home_pillars_title')}
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                        {t('home_pillars_desc')}
                    </p>
                </div>

                {/* Tactile Asymmetric Bento Grid (8 Modules) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    
                    {/* BENTO 1: PLANNER (2-Col Span) */}
                    <div className="lg:col-span-2 group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    📋
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                    Core Execution
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_1_title')}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-xl">
                                {t('pill_1_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: Tasks & Progress */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 mb-1">
                                <span>{isId ? 'Timeline Hari Ini' : "Today's Timeline"}</span>
                                <span className="text-indigo-600 font-bold">
                                    {isId ? '4/5 Selesai (80%)' : '4/5 Done (80%)'}
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs sm:text-sm gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                                    <span className="font-semibold text-slate-400 line-through">08:30 • Deep Work: Sprint Architecture</span>
                                </div>
                                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold shrink-0">
                                    {isId ? 'SELESAI' : 'DONE'}
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200/80 flex items-center justify-between text-xs sm:text-sm gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-4 h-4 rounded border-2 border-indigo-500 flex items-center justify-center shrink-0"></span>
                                    <span className="font-bold text-slate-900">
                                        {isId ? '14:15 • Evaluasi Finansial & Habit Review' : '14:15 • Finance & Habit Review'}
                                    </span>
                                </div>
                                <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-600 text-white font-bold animate-pulse shrink-0">
                                    {isId ? 'FOKUS' : 'FOCUS'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* BENTO 2: HABITS (1-Col Span) */}
                    <div className="group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    🌱
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                    Consistency
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_2_title')}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                                {t('pill_2_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: 28-Day Heatmap */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                                <span className="text-slate-600">
                                    {isId ? 'Streak: Membaca 30 Menit' : 'Streak: 30-Min Reading'}
                                </span>
                                <span className="text-emerald-600">
                                    {isId ? '🔥 24 Hari' : '🔥 24 Days'}
                                </span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 pt-1">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-full aspect-square rounded-[3px] transition-transform duration-200 hover:scale-125 ${
                                            i > 23 ? 'bg-slate-200' : 'bg-emerald-500'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BENTO 3: FINANCE (1-Col Span) */}
                    <div className="group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl border border-amber-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    💰
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                    Cashflow
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_3_title')}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                                {t('pill_3_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: Budget Balance */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="text-xs sm:text-sm text-slate-500">
                                {isId ? 'Saldo Bersih Tersimpan' : 'Net Saved Balance'}
                            </div>
                            <div className="text-xl font-black text-slate-900">
                                {isId ? 'Rp 24.850.000' : '$1,650.00'}
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                                <div className="bg-amber-500 h-full w-[78%] transition-all duration-500"></div>
                            </div>
                            <div className="text-xs text-emerald-600 font-semibold text-right">
                                {isId ? 'Alokasi 50/30/20 Sehat' : 'Healthy 50/30/20 Ratio'}
                            </div>
                        </div>
                    </div>

                    {/* BENTO 4: GOALS (2-Col Span) */}
                    <div className="lg:col-span-2 group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-purple-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl border border-purple-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    🎯
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                                    WOOP Framework
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_4_title')}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                                {t('pill_4_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: WOOP Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs sm:text-sm">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
                                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Wish</div>
                                <div className="font-bold text-slate-800 mt-1">
                                    {isId ? 'Target Skala Global' : 'Scale Global Reach'}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors">
                                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Outcome</div>
                                <div className="font-bold text-slate-800 mt-1">
                                    {isId ? 'Impact & Kemerdekaan' : 'Impact & Autonomy'}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-colors">
                                <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Obstacle</div>
                                <div className="font-bold text-slate-800 mt-1">
                                    {isId ? 'Distraksi Multi-task' : 'Context Switching'}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 hover:border-purple-400 transition-colors">
                                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Plan</div>
                                <div className="font-bold text-purple-900 mt-1">
                                    {isId ? 'If-Then Deep Work' : 'If-Then Deep Work'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BENTO 5: JOURNAL (1-Col Span) */}
                    <div className="group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-violet-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center text-2xl border border-violet-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    ✍️
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                                    Clarity
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_5_title')}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                                {t('pill_5_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: Journal Note */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm space-y-1.5 hover:border-violet-300 transition-colors">
                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                                <span>{isId ? 'Refleksi Malam' : 'Evening Reflection'}</span>
                                <span className="text-violet-600 font-bold">⚡ In Flow</span>
                            </div>
                            <p className="text-slate-600 italic line-clamp-2">
                                {isId 
                                    ? '“Semua task dan habit tersinkron otomatis, kepala terasa jauh lebih ringan dan damai...”' 
                                    : '“All tasks and habits sync automatically, my mind feels completely clear and at peace...”'}
                            </p>
                        </div>
                    </div>

                    {/* BENTO 6: JOBS (1-Col Span) */}
                    <div className="group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-sky-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center text-2xl border border-sky-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    💼
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                                    Pipeline
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_6_title')}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                                {t('pill_6_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: Job Pipeline Badges */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs sm:text-sm font-bold hover:border-sky-300 transition-colors">
                            <div className="text-center">
                                <div className="text-slate-500 text-xs font-semibold">Applied</div>
                                <div className="text-slate-800 text-base font-black mt-0.5">8</div>
                            </div>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div className="text-center">
                                <div className="text-amber-600 text-xs font-semibold">Interview</div>
                                <div className="text-amber-600 text-base font-black mt-0.5">3</div>
                            </div>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div className="text-center">
                                <div className="text-emerald-600 text-xs font-semibold">Offer</div>
                                <div className="text-emerald-600 text-base font-black mt-0.5">1 🎉</div>
                            </div>
                        </div>
                    </div>

                    {/* BENTO 7: STUDY (1-Col Span) */}
                    <div className="group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-rose-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-2xl border border-rose-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    📚
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                                    Retention
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_7_title')}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                                {t('pill_7_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: Pomodoro Timer */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs sm:text-sm hover:border-rose-300 transition-colors">
                            <div>
                                <div className="font-bold text-slate-800">Pomodoro Focus</div>
                                <div className="text-xs text-slate-500 font-medium">
                                    {isId ? 'Sesi Belajar #3' : 'Study Session #3'}
                                </div>
                            </div>
                            <span className="text-base font-mono font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 animate-pulse">
                                25:00
                            </span>
                        </div>
                    </div>

                    {/* BENTO 8: CALENDAR (2-Col Span) */}
                    <div className="lg:col-span-2 group bg-white p-5 sm:p-8 lg:p-9 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    🗓️
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                    Unified Sync
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                {t('pill_8_title')}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                                {t('pill_8_desc')}
                            </p>
                        </div>

                        {/* Mini UI Widget: Synced Timeline Schedule */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm">
                            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 hover:border-indigo-300 transition-colors">
                                <div className="font-bold text-indigo-700">09:00 - 11:30</div>
                                <div className="text-slate-800 font-medium mt-0.5">Task: Deep Architecture</div>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:border-emerald-300 transition-colors">
                                <div className="font-bold text-emerald-700">14:00 - 14:30</div>
                                <div className="text-slate-800 font-medium mt-0.5">Finance: Cashflow Check</div>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 hover:border-purple-300 transition-colors">
                                <div className="font-bold text-purple-700">20:30 - 21:00</div>
                                <div className="text-slate-800 font-medium mt-0.5">
                                    {isId ? 'Habit: Refleksi Malam' : 'Habit: Evening Reflection'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
