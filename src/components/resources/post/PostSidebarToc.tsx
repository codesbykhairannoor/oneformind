'use client';

import { Link } from '@/i18n/routing';

export interface TocItem {
    id: string;
    text: string;
    level: string;
}

interface PostSidebarTocProps {
    tocItems: TocItem[];
    activeId: string;
    onScrollTo: (id: string) => void;
}

export default function PostSidebarToc({ tocItems, activeId, onScrollTo }: PostSidebarTocProps) {
    return (
        <aside className="hidden lg:block lg:col-span-3 sticky top-40 h-fit space-y-12">
            {/* Table of Contents */}
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-4">
                    On This Stream
                </h4>
                <div className="space-y-4">
                    {tocItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onScrollTo(item.id);
                            }}
                            className={`block text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeId === item.id
                                    ? 'text-indigo-600 translate-x-1'
                                    : item.level === 'H2'
                                    ? 'text-slate-500 hover:text-indigo-600'
                                    : 'text-slate-400 hover:text-indigo-600 pl-4 opacity-70'
                            }`}
                        >
                            {item.text}
                        </a>
                    ))}
                </div>
            </div>

            {/* Experience OS CTA */}
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700" />
                <h5 className="text-sm font-black mb-4 relative z-10">Experience the OS</h5>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-6 relative z-10 uppercase tracking-wider">
                    Unify your habits, finances, and planning in one neural engine.
                </p>
                <Link
                    href="/register"
                    className="block w-full py-3 bg-indigo-600 text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition relative z-10"
                >
                    Get Started Free
                </Link>
            </div>
        </aside>
    );
}
