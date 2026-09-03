export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mb-2" />
                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    <div className="h-10 w-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
                {/* Left Panel: Calendar & Inbox Skeleton */}
                <div className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 h-80 border border-slate-100 dark:border-slate-800" />
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 flex-1 border border-slate-100 dark:border-slate-800">
                        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Panel: Timeline Skeleton */}
                <div className="xl:col-span-8 2xl:col-span-9 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800">
                    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8" />
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-4">
                                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded mt-2" />
                                <div className="flex-1 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
