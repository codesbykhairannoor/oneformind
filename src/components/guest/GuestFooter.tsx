'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface GuestFooterProps {
    locale: string;
    enHref: string;
    idHref: string;
    switchLang: (lang: 'id' | 'en') => void;
}

export default function GuestFooter({
    locale,
    enHref,
    idHref,
    switchLang
}: GuestFooterProps) {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12 md:gap-12 mb-16 text-left">
                    {/* COL 1: BRAND */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <img src="/favicon.svg" alt="Tranvas Logo" className="w-7 h-7" />
                            <span className="text-lg font-black tracking-tighter text-slate-900">Tranvas</span>
                        </Link>
                        <p className="text-sm text-slate-700 leading-relaxed mb-6 max-w-xs font-medium">
                            The unified productivity system designed to bring clarity to your life, habits, and finances.
                        </p>
                        <div className="text-xs text-slate-600 space-y-2 mt-4 font-bold">
                            <p><strong>Email:</strong> <span dangerouslySetInnerHTML={{ __html: '<!--email_off--><a href="mailto:tranvasapp@gmail.com" class="hover:underline">tranvasapp@gmail.com</a><!--/email_off-->' }} /></p>
                            <p><strong>Status:</strong> HQ Jakarta, ID</p>
                        </div>
                    </div>

                    {/* COL 2: PRODUCT */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-5">Product</p>
                        <ul className="space-y-4 text-sm font-bold text-slate-700">
                            <li><Link href="/features" className="hover:text-indigo-600 transition">All Features</Link></li>
                            <li><Link href="/features/habit" className="hover:text-indigo-600 transition">Habit Tracker</Link></li>
                            <li><Link href="/features/finance" className="hover:text-indigo-600 transition">Finance OS</Link></li>
                            <li><Link href="/features/planner" className="hover:text-indigo-600 transition">Daily Planner</Link></li>
                            <li><Link href="/features/journal" className="hover:text-indigo-600 transition">Digital Journal</Link></li>
                            <li><Link href="/features/calendar" className="hover:text-indigo-600 transition">Smart Calendar</Link></li>
                            <li><Link href="/features/goal" className="hover:text-indigo-600 transition">Goal Tracker</Link></li>
                            <li><Link href="/features/job" className="hover:text-indigo-600 transition">Job Tracker</Link></li>
                            <li><Link href="/features/neural-os" className="hover:text-indigo-600 transition">Neural OS AI</Link></li>
                        </ul>
                    </div>

                    {/* COL 3: COMPARE */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-5">Compare</p>
                        <ul className="space-y-4 text-sm font-bold text-slate-700">
                            <li><Link href="/compare/notion" className="hover:text-indigo-600 transition">Vs. Notion</Link></li>
                            <li><Link href="/compare/clickup" className="hover:text-indigo-600 transition">Vs. ClickUp</Link></li>
                            <li><Link href="/compare/onenote" className="hover:text-indigo-600 transition">Vs. OneNote</Link></li>
                            <li><Link href="/compare/planner-apps" className="hover:text-indigo-600 transition">Vs. Planner Apps</Link></li>
                            <li><Link href="/compare/todoist" className="hover:text-indigo-600 transition">Vs. Todoist</Link></li>
                            <li><Link href="/compare/trello" className="hover:text-indigo-600 transition">Vs. Trello</Link></li>
                            <li><Link href="/compare/asana" className="hover:text-indigo-600 transition">Vs. Asana</Link></li>
                            <li><Link href="/compare/habitica" className="hover:text-indigo-600 transition">Vs. Habitica</Link></li>
                            <li><Link href="/compare/obsidian" className="hover:text-indigo-600 transition">Vs. Obsidian</Link></li>
                        </ul>
                    </div>

                    {/* COL 4: RESOURCES */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-5">Resources</p>
                        <ul className="space-y-4 text-sm font-bold text-slate-700">
                            <li><Link href="/resources/help" className="hover:text-indigo-600 transition">Help Center</Link></li>
                            <li><Link href="/resources/blog" className="hover:text-indigo-600 transition">Blog</Link></li>
                            <li><Link href="/resources/changelog" className="hover:text-indigo-600 transition">Changelog</Link></li>
                            <li><Link href="/resources/community" className="hover:text-indigo-600 transition">Community</Link></li>
                            <li><Link href="/resources/stories" className="hover:text-indigo-600 transition">Success Stories</Link></li>
                            <li><Link href="/resources/affiliate" className="hover:text-indigo-600 transition">Affiliate Program</Link></li>
                            <li><Link href="/resources/guide" className="hover:text-indigo-600 transition">User Guide</Link></li>
                            <li><Link href="/resources/ai-trust" className="hover:text-indigo-600 transition">AI Transparency</Link></li>
                        </ul>
                    </div>

                    {/* COL 5: COMPANY */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-5">Company</p>
                        <ul className="space-y-4 text-sm font-bold text-slate-700">
                            <li><Link href="/privacy-policy" className="hover:text-indigo-600 transition">Privacy policy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-indigo-600 transition">Terms of service</Link></li>
                            <li><Link href="/company/refund" className="hover:text-indigo-600 transition">Refund policy</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-600 transition">Contact us</Link></li>
                            <li><Link href="/company/security" className="hover:text-indigo-600 transition">Security</Link></li>
                            <li><Link href="/about" className="hover:text-indigo-600 transition">About us</Link></li>
                            <li>
                                <Link href="/affiliates" className="hover:text-indigo-600 transition flex items-center gap-1.5">
                                    <span>Affiliate Program</span>
                                    <span className="px-1.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-700 rounded-full font-black">30%</span>
                                </Link>
                            </li>
                            <li><Link href="/company/status" className="hover:text-indigo-600 transition">System status</Link></li>
                        </ul>
                    </div>

                    {/* COL 6: CONNECT */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-5">Connect</p>
                        <div className="flex gap-4">
                            <a href="https://x.com/Tranvas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm" aria-label="X">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239h-2.19L17.607 20.65z"/></svg>
                            </a>
                            <a href="https://instagram.com/tranvas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            </a>
                            <a href="https://facebook.com/tranvas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm" aria-label="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-700">
                    <p>&copy; {new Date().getFullYear()} Tranvas. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <a href={enHref} onClick={(e) => { e.preventDefault(); switchLang('en'); }} className={`hover:text-indigo-600 transition ${locale === 'en' ? 'text-indigo-600 font-black' : ''}`}>English</a>
                        <span>•</span>
                        <a href={idHref} onClick={(e) => { e.preventDefault(); switchLang('id'); }} className={`hover:text-indigo-600 transition ${locale === 'id' ? 'text-indigo-600 font-black' : ''}`}>Bahasa Indonesia</a>
                    </div>
                    <p>Made with ❤️ for better focus.</p>
                </div>
            </div>
        </footer>
    );
}
