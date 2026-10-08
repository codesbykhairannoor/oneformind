export default function AppLoading() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-slate-50/50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800/80 rounded-lg"></div>
          <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/40 rounded-md"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800/80 rounded-xl"></div>
          <div className="h-9 w-28 bg-indigo-200 dark:bg-indigo-950/60 rounded-xl"></div>
        </div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="h-48 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
            <div className="h-16 w-full bg-slate-50 dark:bg-slate-800/20 rounded-xl mt-4"></div>
          </div>
          <div className="h-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-32 w-full bg-slate-50 dark:bg-slate-800/30 rounded-xl"></div>
          </div>
        </div>
        <div className="col-span-1 space-y-4">
          <div className="h-72 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
