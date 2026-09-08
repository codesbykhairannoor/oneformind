import { Link } from '@/i18n/routing';

const RELATED_POSTS = [
    { title: 'Build a Personal Operating System in 30 Minutes', img: 'photo-1484480974693-6ca0a78fb36b' },
    { title: 'From Planner Chaos to Clarity: The Weekly Reset Framework', img: 'photo-1506905925346-21bda4d32df4' },
    { title: 'Atomic Finance Habits That Compound Like Interest', img: 'photo-1550565118-3a14e8d0386f' },
];

export default function PostRelatedPosts() {
    return (
        <section className="bg-slate-50/50 py-24 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <h3 className="text-2xl font-black text-slate-900 mb-12 uppercase tracking-tighter">
                    Synchronized Intelligence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {RELATED_POSTS.map((rel, idx) => (
                        <Link
                            key={idx}
                            href="/resources/blog"
                            className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                        >
                            <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`https://images.unsplash.com/${rel.img}?w=600&q=75`}
                                    alt={rel.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 block italic">
                                Module
                            </span>
                            <h4 className="font-black text-slate-900 text-lg leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                                {rel.title}
                            </h4>
                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">Read Module</span>
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
