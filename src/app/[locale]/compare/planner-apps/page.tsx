'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, Check, X, Calendar, Clock, Sparkles } from 'lucide-react';

export default function PlannerAppsComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: 'How is Tranvas different from standalone planner or to-do apps?',
            a: 'Most planner apps isolate your tasks in a checklist disconnected from your actual habits, energy levels, and financial goals. Tranvas unifies your daily schedule with automated habit tracking, calendar time-blocking, and AI neural assistance in one seamless system.'
        },
        {
            q: 'Can I use time-blocking with Tranvas Daily Planner?',
            a: 'Yes! Tranvas features deep work time-blocking, Eisenhower matrix categorization, and visual timeline scheduling so you assign real hours to your highest-leverage tasks rather than endless wishlists.'
        },
        {
            q: 'Is Tranvas suitable for both personal and professional planning?',
            a: 'Absolutely. Tranvas is engineered for students, freelancers, and ambitious professionals who need to manage career milestones, daily execution, and personal routines without app fragmentation.'
        }
    ];

    return (
        <GuestLayout>
            <main id="planner-apps-compare" className="overflow-x-hidden">
                {/* HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 relative border-b border-indigo-100">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <div className="mb-4">
                                <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase opacity-70">
                                    Next-Gen Productivity System
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider border border-indigo-200">
                                🎯 Tranvas vs Standalone Planner Apps
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                Stop listing tasks. <br/>
                                <span className="text-indigo-600">Start executing flow.</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                                Standard to-do and planner apps create guilt-inducing lists that disconnect from your reality. Tranvas transforms planning into a living, unified operating system.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-200 hover:-translate-y-1 transform">
                                    Experience Tranvas Planner Free
                                </Link>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 font-medium">Free plan available &bull; No credit card required &bull; Instant sync</p>
                        </div>

                        <div className="relative h-[420px] flex items-center justify-center">
                            <div className="absolute w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative w-full max-w-md bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-2xl space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="font-bold text-slate-900 text-sm">Today&apos;s Unified Timeline</span>
                                    <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">In Flow</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border-l-4 border-indigo-500">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold">09:00 - 11:30</p>
                                            <p className="text-sm font-bold text-slate-800">Deep Work: Product Roadmap</p>
                                        </div>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">High Impact</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border-l-4 border-emerald-500">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold">12:00 - 13:00</p>
                                            <p className="text-sm font-bold text-slate-800">Mindful Break & Nutrition</p>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Habit Sync</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border-l-4 border-purple-500">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold">14:00 - 16:00</p>
                                            <p className="text-sm font-bold text-slate-800">Sprint Execution & Review</p>
                                        </div>
                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Goal Linked</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* THE PROBLEM */}
                <section className="py-[80px] px-6 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                Why Traditional Planner Apps <span className="text-red-500">Break Down</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">
                                Endless to-do lists provide the illusion of productivity while increasing anxiety and cognitive fragmentation.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-6">✕</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Disconnected Wishlists</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Tasks live in isolation without time boundaries, creating unrealistic backlogs that never get completed.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-6">✕</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">No Habit & Goal Context</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">You check off boxes without knowing if they actually push your long-term goals or compound into lasting daily habits.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mb-6">✕</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">App Fragmentation</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Using 5 separate apps for your calendar, habits, to-dos, expenses, and notes drains focus and requires manual syncing.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE SOLUTION */}
                <section className="py-[80px] px-6 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(99,102,241,0.15)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">
                                The <span className="text-indigo-400">Tranvas Advantage</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400">
                                Everything you need to plan, execute, and reflect in one unified interface.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors">
                                <div className="w-14 h-14 bg-indigo-900/50 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-6">📅</div>
                                <h3 className="text-xl font-bold mb-3">Time-Blocked Agendas</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Assign realistic time slots with the Eisenhower Priority Matrix so you protect deep work periods.</p>
                            </div>
                            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors transform md:-translate-y-4">
                                <div className="w-14 h-14 bg-indigo-900/50 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-6">🌱</div>
                                <h3 className="text-xl font-bold mb-3">Live Habit Integration</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Daily habits surface inside your planner schedule automatically, ensuring routines aren&apos;t forgotten.</p>
                            </div>
                            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors">
                                <div className="w-14 h-14 bg-indigo-900/50 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-6">🧠</div>
                                <h3 className="text-xl font-bold mb-3">Neural OS Pacing</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Intelligent AI recommendations evaluate your cognitive load and reschedule overbooked days gracefully.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURE COMPARISON TABLE */}
                <section className="py-[80px] px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-4">
                                Feature Comparison
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">
                                Detailed breakdown of capabilities
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-6 text-xs text-slate-500 uppercase tracking-widest w-1/3">Capability</th>
                                        <th className="p-6 text-xs text-slate-500 uppercase tracking-widest w-1/3">Standard Planner Apps</th>
                                        <th className="p-6 text-xs text-indigo-600 font-black uppercase tracking-widest w-1/3 bg-indigo-50/50">Tranvas Life OS</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">Task Scheduling</td>
                                        <td className="p-6 text-slate-500">Static checkbox list</td>
                                        <td className="p-6 font-bold text-indigo-600 bg-indigo-50/30">Time-blocked calendar view</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">Habit Synchronization</td>
                                        <td className="p-6 text-slate-500">Separate app or none</td>
                                        <td className="p-6 font-bold text-indigo-600 bg-indigo-50/30">Native bidirectional sync</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">Finance & Expense Tracking</td>
                                        <td className="p-6 text-slate-500">Not supported</td>
                                        <td className="p-6 font-bold text-indigo-600 bg-indigo-50/30">Integrated Finance OS</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 font-bold text-slate-800">AI Cognitive Coaching</td>
                                        <td className="p-6 text-slate-500">None</td>
                                        <td className="p-6 font-bold text-indigo-600 bg-indigo-50/30">Neural OS Brain Engine</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-[80px] px-6 bg-white text-center border-t border-slate-100">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">
                            Build Your Ideal Day with Tranvas
                        </h2>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-[0_20px_40px_rgba(99,102,241,0.3)] font-bold">
                            Get Started Free Today
                        </Link>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
