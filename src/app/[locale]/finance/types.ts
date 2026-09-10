export interface CategoryOption {
    id?: number;
    slug: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
    limit?: number;
}

export interface WalletOption {
    id: string;
    name: string;
    type: 'bank' | 'ewallet' | 'cash' | 'investment';
    balance: number;
    icon: string;
    color: string;
    accountNumber?: string;
}
