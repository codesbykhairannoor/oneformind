export type BookStatus = 'reading' | 'to_read' | 'completed' | 'abandoned';

export type BookCategory = 'academic' | 'tech' | 'self_growth' | 'philosophy' | 'fiction' | 'other';

export interface BookItem {
    id: string;
    title: string;
    author: string;
    cover_url?: string;
    cover_color?: string; // gradient preset e.g. 'from-indigo-600 to-purple-600'
    category: BookCategory;
    status: BookStatus;
    total_pages: number;
    current_page: number;
    rating?: number; // 1 to 5
    summary_notes?: string;
    key_quotes?: string[];
    linked_course_name?: string;
    started_at?: string;
    finished_at?: string;
}

export interface ReadingGoal {
    year: number;
    target_books: number;
}
