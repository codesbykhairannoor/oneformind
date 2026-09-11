import { BookCategory } from '../../types/books';

export const STORAGE_KEY_BOOKS = 'tranvas_study_books';
export const STORAGE_KEY_GOAL = 'tranvas_study_reading_goal';

export const COVER_GRADIENTS = [
    'from-indigo-600 via-indigo-700 to-slate-900',
    'from-emerald-600 via-teal-700 to-slate-900',
    'from-purple-600 via-pink-700 to-slate-900',
    'from-amber-500 via-orange-600 to-slate-900',
    'from-blue-600 via-cyan-700 to-slate-900',
    'from-rose-600 via-red-700 to-slate-900'
];

export const getCategoryBadge = (cat: BookCategory, isIndo: boolean) => {
    switch (cat) {
        case 'academic': 
            return { label: isIndo ? '🎓 Akademik' : '🎓 Academic', color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
        case 'tech': 
            return { label: isIndo ? '💻 Software & Tech' : '💻 Tech & Code', color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' };
        case 'self_growth': 
            return { label: isIndo ? '🚀 Self-Growth' : '🚀 Self-Growth', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
        case 'philosophy': 
            return { label: isIndo ? '🧠 Filsafat' : '🧠 Philosophy', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
        case 'fiction': 
            return { label: isIndo ? '📚 Fiksi' : '📚 Fiction', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
        default: 
            return { label: isIndo ? '📖 Non-Fiksi' : '📖 General', color: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
};
