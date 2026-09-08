import { Link } from '@/i18n/routing';

interface PostHeaderProps {
    title: string;
}

export default function PostHeader({ title }: PostHeaderProps) {
    return (
        <header className="pt-24 md:pt-40 pb-12 md:pb-20 px-6 bg-slate-50/50 border-b border-slate-100">
            <div className="max-w-4xl mx-auto text-center">
                <nav className="flex justify-center items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
                    <Link href="/" className="hover:text-indigo-600">Home</Link>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <Link href="/resources/blog" className="hover:text-indigo-600">Blog</Link>
                </nav>

                <span className="inline-flex px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                    Methodology
                </span>

                <h1 className="text-3xl md:text-7xl text-slate-900 leading-[1.1] mb-8 md:mb-12 tracking-tighter font-black">
                    {title}
                </h1>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center font-black text-indigo-600 text-sm">
                            A
                        </div>
                        <div className="text-left">
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Admin</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Field Commander</p>
                        </div>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
                    <time className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Aug 18, 2026
                    </time>
                </div>
            </div>
        </header>
    );
}
