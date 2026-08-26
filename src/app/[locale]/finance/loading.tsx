import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">Memuat modul Keuangan...</p>
        </div>
    );
}
