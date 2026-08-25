'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { 
    Plus, MessageSquare, Trash2, Menu, Sparkles, Paperclip, 
    Mic, Send, Square, Edit3, X, Check, Bot, User 
} from 'lucide-react';

interface ChatMessage {
    id?: string | number;
    role: 'user' | 'assistant';
    content: string;
    image?: string | null;
    timestamp?: string;
}

interface ChatSession {
    id: string;
    title: string;
    date: string;
    messages: ChatMessage[];
}

export default function CoachPage() {
    const t = useTranslations();
    const [userName] = useState('Kamu');

    // 1. SESSIONS & MESSAGES STATE
    const [sessions, setSessions] = useState<ChatSession[]>([
        {
            id: 'session_1',
            title: 'Audit Kebiasaan & Rencana Hari',
            date: '24 Agt 2026',
            messages: [
                {
                    id: 1,
                    role: 'assistant',
                    content: 'Hai! Saya Neural OS AI Life Coach Anda. Berdasarkan data sistem Anda hari ini, konsistensi habit berada di angka 85% dan Anda memiliki 3 target aktif. Ada yang ingin kita diskusikan atau evaluasi hari ini?'
                }
            ]
        }
    ]);

    const [currentSessionId, setCurrentSessionId] = useState<string>('session_1');
    const [messages, setMessages] = useState<ChatMessage[]>(sessions[0].messages);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isWelcomeState = !currentSessionId || !messages.some(m => m.role === 'user');
    const firstName = userName.split(' ')[0];

    // Scroll to Bottom Helper
    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Handle Window Resize for Sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Quick Actions
    const quickActions = [
        {
            label: 'Audit Kebiasaan',
            emoji: '🏃',
            color: '#7c3aed',
            prompt: 'Berikan audit mendalam tentang kebiasaan saya minggu ini. Apa yang sudah berjalan baik dan apa yang perlu diperbaiki? Berikan saran konkret.'
        },
        {
            label: 'Cek Keuangan',
            emoji: '💰',
            color: '#059669',
            prompt: 'Analisis kondisi keuangan saya bulan ini. Identifikasi pola pengeluaran yang perlu diperhatikan dan bantu buat rencana yang lebih baik.'
        },
        {
            label: 'Rencanakan Hari',
            emoji: '📋',
            color: '#2563eb',
            prompt: 'Bantu saya membuat rencana hari ini yang produktif berdasarkan tugas dan tujuan yang ada. Prioritaskan hal yang paling berdampak.'
        },
        {
            label: 'Brainstorm',
            emoji: '🧠',
            color: '#db2777',
            prompt: 'Bantu saya brainstorm ide-ide kreatif untuk meningkatkan produktivitas dan mencapai tujuan lebih cepat. Berikan perspektif yang segar dan praktis.'
        },
        {
            label: 'Susun Target',
            emoji: '🎯',
            color: '#d97706',
            prompt: 'Bantu saya menyusun target yang SMART dan realistis untuk bulan depan berdasarkan progress dan kondisi saat ini.'
        },
        {
            label: 'Review Jurnal',
            emoji: '📖',
            color: '#0891b2',
            prompt: 'Bantu saya merefleksikan jurnal terbaru. Berikan insight tentang pola pikir, emosi, dan pertumbuhan saya berdasarkan apa yang sudah saya tuliskan.'
        }
    ];

    // Session Switch & CRUD
    const startNewChat = () => {
        const newId = `session_${Date.now()}`;
        const newSess: ChatSession = {
            id: newId,
            title: t('new_chat') || 'Chat Baru',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            messages: []
        };
        setSessions(prev => [newSess, ...prev]);
        setCurrentSessionId(newId);
        setMessages([]);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const switchSession = (sid: string) => {
        setCurrentSessionId(sid);
        const target = sessions.find(s => s.id === sid);
        if (target) setMessages(target.messages);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const deleteSession = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof window !== 'undefined' && window.confirm('Hapus Riwayat? Percakapan ini akan dihapus permanen.')) {
            const updated = sessions.filter(s => s.id !== sessionId);
            setSessions(updated);
            if (currentSessionId === sessionId && updated.length > 0) {
                setCurrentSessionId(updated[0].id);
                setMessages(updated[0].messages);
            } else if (updated.length === 0) {
                startNewChat();
            }
        }
    };

    // Voice & Image Actions
    const startRecording = () => {
        if (typeof window === 'undefined') return;
        const SR = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || 
                   (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
        if (!SR) {
            alert('Browser tidak mendukung pendiktean suara.');
            return;
        }
        const rec = new SR();
        rec.lang = 'id-ID';
        rec.onstart = () => setIsRecording(true);
        rec.onend = () => setIsRecording(false);
        rec.onresult = (e: any) => {
            setNewMessage(prev => prev + ' ' + e.results[0][0].transcript);
        };
        rec.start();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const autoResize = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;
        target.style.height = 'auto';
        target.style.height = Math.min(target.scrollHeight, 180) + 'px';
    };

    const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const editMessage = (index: number) => {
        setEditingIndex(index);
        setNewMessage(messages[index].content);
        if (textareaRef.current) textareaRef.current.focus();
    };

    // Send Message Logic
    const sendMessage = () => {
        if ((!newMessage.trim() && !imagePreview) || isLoading) return;

        const userText = newMessage;
        const userImg = imagePreview;

        let updatedMsgs: ChatMessage[] = [...messages];

        if (editingIndex !== null) {
            updatedMsgs[editingIndex].content = userText;
            setEditingIndex(null);
        } else {
            updatedMsgs.push({
                role: 'user',
                content: userText,
                image: userImg || undefined
            });
        }

        setMessages(updatedMsgs);
        setNewMessage('');
        removeImage();
        setIsLoading(true);
        scrollToBottom();

        // Update session state
        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                const title = s.messages.length === 0 ? userText.slice(0, 25) + '...' : s.title;
                return { ...s, title, messages: updatedMsgs };
            }
            return s;
        }));

        // Simulated AI Response (Gemini OS Simulation)
        setTimeout(() => {
            let aiReply = 'Tentu! Saya telah menganalisis permintaan Anda. Berdasarkan data produktivitas dan sistem Neural OS Anda, berikut adalah langkah strategis yang direkomendasikan:\n\n1. **Fokus Prioritas Utama**: Selesaikan tugas berkode *Vital* sebelum jam 12:00 siang.\n2. **Evaluasi Kebiasaan**: Pertahankan *streak* habit yang telah mencapai >80% konsistensi.\n3. **Refleksi Strategis**: Luangkan 5 menit di sore hari untuk mencatat insight penting di Journal OS.';

            if (userText.toLowerCase().includes('keuangan')) {
                aiReply = '📊 **Analisis Keuangan Neural OS**:\n\nPengeluaran Anda bulan ini cukup terkontrol dengan efisiensi tabungan di angka 32%. Pastikan untuk terus memantau kategori *Food & Entertainment* agar tetap berada dalam batas anggaran bulanan.';
            } else if (userText.toLowerCase().includes('target') || userText.toLowerCase().includes('goal')) {
                aiReply = '🎯 **Rekomendasi Target SMART**:\n\n- **Specific**: Selesaikan modul integrasi Next.js 16.\n- **Measurable**: 100% rute terkompilasi tanpa type error.\n- **Achievable**: Dipecah menjadi 3 sub-task harian.\n- **Relevant**: Memperkuat arsitektur Life OS.\n- **Time-bound**: Selesai sebelum akhir minggu ini.';
            }

            const finalMsgs: ChatMessage[] = [...updatedMsgs, { role: 'assistant', content: aiReply }];
            setMessages(finalMsgs);
            setIsLoading(false);

            setSessions(prev => prev.map(s => {
                if (s.id === currentSessionId) {
                    return { ...s, messages: finalMsgs };
                }
                return s;
            }));

            scrollToBottom();
        }, 1200);
    };

    // Render simple markdown formatted text
    const renderMarkdown = (content: string) => {
        if (!content) return null;
        const paragraphs = content.split('\n\n');
        return paragraphs.map((p, i) => {
            const formatted = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
                <p 
                    key={i} 
                    className="mb-3 last:mb-0 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatted }}
                />
            );
        });
    };

    return (
        <AuthenticatedLayout>
            {/* 1:1 from AiCoach/Index.vue line 292-927 */}
            <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-950 relative z-[60] h-[calc(100vh-4rem)]">
                
                {/* MOBILE SIDEBAR BACKDROP */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-950/50 z-[69] md:hidden transition-opacity duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* SIDEBAR */}
                <aside 
                    className={`${
                        isSidebarOpen 
                            ? 'flex fixed md:relative h-full w-64 md:w-56 top-0 left-0 z-[70] md:z-auto' 
                            : 'hidden md:flex md:w-0 md:overflow-hidden'
                    } flex-col shrink-0 bg-white dark:bg-[#0c0c0c] border-r border-slate-100 dark:border-white/[0.06] transition-all duration-300 overflow-hidden`}
                >
                    {/* New Chat Button */}
                    <div className="p-3 border-b border-slate-100 dark:border-white/[0.05]">
                        <button 
                            type="button"
                            onClick={startNewChat}
                            className="w-full flex items-center gap-2.5 px-3 h-10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-colors group"
                        >
                            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black group-hover:scale-110 transition-transform shadow-sm">
                                +
                            </div>
                            <span>Chat Baru</span>
                        </button>
                    </div>

                    {/* Session List */}
                    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 custom-scrollbar">
                        {sessions.length > 0 && (
                            <p className="px-3 py-2 text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
                                Riwayat
                            </p>
                        )}

                        {sessions.map((session) => (
                            <div key={session.id} className="relative group">
                                <button 
                                    type="button"
                                    onClick={() => switchSession(session.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-start gap-2.5 ${
                                        currentSessionId === session.id 
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                                    <div className="min-w-0 flex-1 pr-6">
                                        <p className="font-semibold text-xs truncate">{session.title}</p>
                                        <p className="text-[10px] opacity-50 mt-0.5">{session.date}</p>
                                    </div>
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={(e) => deleteSession(session.id, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Hapus Percakapan"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}

                        {sessions.length === 0 && (
                            <div className="px-3 py-8 text-center">
                                <p className="text-[11px] text-slate-400 dark:text-slate-600">
                                    Belum ada percakapan
                                </p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* MAIN CHAT AREA */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    
                    {/* Header */}
                    <header className="h-14 shrink-0 flex items-center px-4 gap-3 border-b border-slate-100 dark:border-white/[0.06] bg-white/80 dark:bg-[#0a0a0a]/80 z-10">
                        <button 
                            type="button"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors shrink-0"
                        >
                            <Menu className="w-4.5 h-4.5" />
                        </button>

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-300/30 dark:shadow-none select-none">
                                ✦
                            </div>
                            <div className="leading-none">
                                <p className="text-[13px] font-black text-slate-900 dark:text-white">
                                    Neural OS
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                                    AI Life Coach
                                </p>
                            </div>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Online</span>
                            </div>
                            <button 
                                type="button"
                                onClick={startNewChat}
                                className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-black text-lg"
                            >
                                +
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Chat / Welcome Area */}
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                        
                        {/* WELCOME STATE */}
                        {isWelcomeState ? (
                            <div className="min-h-full flex flex-col items-center justify-center px-4 py-10 md:py-16">
                                <div className="relative mb-7 md:mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-3xl opacity-[0.18] scale-[2.5]"></div>
                                    <div className="relative w-[68px] h-[68px] md:w-[80px] md:h-[80px] rounded-[1.4rem] md:rounded-[1.6rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-300/30 dark:shadow-none select-none">
                                        <span className="text-3xl md:text-4xl">✦</span>
                                    </div>
                                </div>

                                <h1 className="text-[2rem] md:text-[2.75rem] font-black text-slate-900 dark:text-white tracking-tight text-center leading-tight mb-2">
                                    Hai {firstName},
                                </h1>
                                <p className="text-[15px] md:text-base text-slate-400 dark:text-slate-500 text-center mb-8 md:mb-10 max-w-[280px] md:max-w-sm leading-relaxed">
                                    Apa yang ingin kamu capai hari ini?
                                </p>

                                {/* Big Input Box */}
                                <div className="w-full max-w-xl md:max-w-2xl relative group/box mb-8 md:mb-10">
                                    <div className="absolute -inset-[2px] rounded-[1.6rem] bg-gradient-to-r from-rose-400 via-purple-500 to-emerald-400 opacity-0 group-focus-within/box:opacity-70 transition-all duration-700 blur-[3px] pointer-events-none"></div>

                                    <div className="relative bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/[0.08] group-focus-within/box:border-transparent rounded-[1.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300 overflow-hidden">
                                        <textarea
                                            ref={textareaRef}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeydown}
                                            onInput={autoResize}
                                            rows={3}
                                            placeholder="Tanyakan apa saja kepada Neural OS..."
                                            className="w-full bg-transparent px-5 pt-5 pb-3 text-[15px] font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none focus:ring-0 resize-none leading-relaxed max-h-40 custom-scrollbar outline-none"
                                        ></textarea>

                                        <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-slate-50 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    title="Lampirkan gambar"
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-500 transition-all"
                                                >
                                                    <Paperclip className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={startRecording}
                                                    title="Rekam suara"
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                        isRecording ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 animate-pulse' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-500'
                                                    }`}
                                                >
                                                    <Mic className="w-4 h-4" />
                                                </button>
                                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                                            </div>

                                            <button 
                                                type="button"
                                                onClick={sendMessage}
                                                disabled={(!newMessage.trim() && !imagePreview) || isLoading}
                                                className="h-9 px-5 rounded-[0.875rem] bg-indigo-600 text-white text-[13px] font-black hover:bg-indigo-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2"
                                            >
                                                <span>Kirim</span>
                                                <kbd className="hidden sm:inline text-[10px] opacity-60 font-bold not-italic">↵</kbd>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Action Chips */}
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] text-center mb-5">
                                    Mulai dengan cepat
                                </p>

                                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 px-2 w-full max-w-xl md:max-w-2xl justify-start md:justify-center no-scrollbar">
                                    {quickActions.map((action) => (
                                        <button 
                                            key={action.label}
                                            type="button"
                                            onClick={() => {
                                                setNewMessage(action.prompt);
                                                setTimeout(() => sendMessage(), 50);
                                            }}
                                            className="flex flex-col items-center gap-2.5 group shrink-0 w-[72px]"
                                        >
                                            <div 
                                                className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-2xl transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-1.5 group-active:scale-95"
                                                style={{
                                                    background: action.color + '14',
                                                    border: '1.5px solid ' + action.color + '30',
                                                    boxShadow: '0 4px 16px ' + action.color + '12'
                                                }}
                                            >
                                                {action.emoji}
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight">
                                                {action.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.25em] mt-10 md:mt-12">
                                    Powered by Gemini Intelligence
                                </p>
                            </div>
                        ) : (
                            /* CHAT STATE */
                            <div className="py-6 pb-36 px-4">
                                <div className="max-w-5xl mx-auto space-y-5">
                                    {messages.map((msg, index) => (
                                        <div key={msg.id || index} className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role === 'user' ? (
                                                <div className="group relative max-w-[80%] md:max-w-[72%]">
                                                    <div className="bg-[#f4f4f5] dark:bg-[#2a2a2a] text-slate-900 dark:text-slate-100 px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
                                                        {msg.image && (
                                                            <img src={msg.image} alt="Upload" className="max-w-[180px] mb-2.5 rounded-xl shadow-md" />
                                                        )}
                                                        <span className="font-medium">{msg.content}</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => editMessage(index)}
                                                        className="absolute -left-8 top-2 w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                        title="Edit pesan"
                                                    >
                                                        <Edit3 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3 max-w-[94%] md:max-w-[86%]">
                                                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-md shadow-indigo-200/40 dark:shadow-none select-none">
                                                        ✦
                                                    </div>
                                                    <div className="text-[13.5px] md:text-sm leading-relaxed text-slate-700 dark:text-slate-200 pt-0.5">
                                                        {renderMarkdown(msg.content)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex gap-3 justify-start">
                                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-md shadow-indigo-200/40 dark:shadow-none select-none">
                                                ✦
                                            </div>
                                            <div className="flex items-center gap-1.5 py-3 px-1">
                                                <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce [animation-duration:1.2s]"></div>
                                                <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce [animation-duration:1.2s] [animation-delay:0.15s]"></div>
                                                <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce [animation-duration:1.2s] [animation-delay:0.3s]"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* BOTTOM INPUT BAR (Chat State Only) */}
                    {!isWelcomeState && (
                        <div className="shrink-0 border-t border-slate-100 dark:border-white/[0.05] bg-white/95 dark:bg-[#0a0a0a]/95 px-4 pt-3 pb-4 md:pb-5 z-10">
                            {imagePreview && (
                                <div className="flex items-center gap-2 mb-2 w-fit">
                                    <div className="relative p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                                        <button 
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black hover:bg-rose-600 transition-colors shadow-md"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="max-w-5xl mx-auto">
                                <div className="flex items-end gap-2 bg-[#f4f4f5] dark:bg-[#1c1c1c] border border-transparent dark:border-white/[0.06] rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400/30 dark:focus-within:ring-indigo-600/25 transition-all shadow-sm">
                                    <div className="flex items-center gap-0.5 shrink-0 pb-1">
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Lampirkan gambar"
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/5 transition-all"
                                        >
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={startRecording}
                                            title="Rekam suara"
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                isRecording ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 animate-pulse' : 'text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <Mic className="w-4 h-4" />
                                        </button>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                                    </div>

                                    <textarea
                                        ref={textareaRef}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeydown}
                                        onInput={autoResize}
                                        rows={1}
                                        placeholder={editingIndex !== null ? 'Revisi pesanmu...' : 'Pesan...'}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none py-2 min-h-[36px] max-h-[180px] leading-relaxed custom-scrollbar outline-none"
                                    ></textarea>

                                    {isLoading ? (
                                        <button 
                                            type="button"
                                            onClick={() => setIsLoading(false)}
                                            className="w-9 h-9 shrink-0 mb-0.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-all active:scale-90 shadow-md"
                                            title="Stop"
                                        >
                                            <Square className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim() && !imagePreview}
                                            className="w-9 h-9 shrink-0 mb-0.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shadow-md shadow-indigo-200 dark:shadow-none"
                                            title="Kirim (Enter)"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <p className="text-[9px] font-bold text-center text-slate-400 dark:text-slate-700 mt-2 uppercase tracking-widest">
                                    Enter untuk kirim · Shift+Enter baris baru · Gemini AI
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
