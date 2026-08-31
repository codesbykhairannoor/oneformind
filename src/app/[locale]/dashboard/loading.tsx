export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
            </div>

            {/* Stat cards skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                        <div className="h-8 w-12 bg-slate-300 dark:bg-slate-600 rounded-lg mb-2" />
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Main content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-64" />
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-64" />
            </div>
        </div>
    );
}
