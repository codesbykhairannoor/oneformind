export interface CategoryOption {
    id?: number;
    slug: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
    limit?: number;
}
