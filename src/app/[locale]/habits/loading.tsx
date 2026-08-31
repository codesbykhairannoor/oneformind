export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 animate-pulse">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-9 w-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl" />
            </div>

            {/* Table skeleton */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Header row */}
                <div className="h-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800" />

                {/* Habit rows */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-50 dark:border-slate-800">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
                        <div className="flex-1">
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                            <div className="h-2 w-48 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        </div>
                        <div className="flex gap-1.5">
                            {[...Array(8)].map((_, j) => (
                                <div key={j} className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
