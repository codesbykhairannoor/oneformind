export interface ChatMessage {
    id?: string | number;
    role: 'user' | 'assistant';
    content: string;
    image?: string | null;
    timestamp?: string;
}

export interface ChatSession {
    id: string;
    title: string;
    date: string;
    messages: ChatMessage[];
}

export interface QuickAction {
    label: string;
    emoji: string;
    color: string;
    prompt: string;
}
