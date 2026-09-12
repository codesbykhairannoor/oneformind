'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { useGating } from '@/hooks/useGating';
import { 
    Menu, 
    Sparkles, 
    Lock, 
    Brain, 
    ArrowRight, 
    Check, 
    Zap, 
    ShieldCheck, 
    ChevronRight,
    Loader2 
} from 'lucide-react';
import { ChatMessage, ChatSession, QuickAction } from './types';
import CoachSidebar from './components/CoachSidebar';
import CoachWelcomeView from './components/CoachWelcomeView';
import CoachMessageList from './components/CoachMessageList';
import CoachInputBar from './components/CoachInputBar';

export default function CoachPage() {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';
    const { isAiEnabled, isLoading: isGatingLoading } = useGating();
    const [userName] = useState('Kamu');

    // SESSIONS & MESSAGES STATE
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

    const quickActions: QuickAction[] = [
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

        setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
                const title = s.messages.length === 0 ? userText.slice(0, 25) + '...' : s.title;
                return { ...s, title, messages: updatedMsgs };
            }
            return s;
        }));

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

    if (isGatingLoading) {
        return (
            <AuthenticatedLayout>
                <div className="flex-1 flex flex-col items-center justify-center min-h-[75vh] p-6 text-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-sm font-bold text-slate-400 animate-pulse">
                        {isIndo ? 'Memverifikasi izin Neural OS...' : 'Verifying Neural OS permissions...'}
                    </p>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!isAiEnabled) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-950">
                    <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950/60 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-center">
                        
                        {/* Glow effects */}
                        <div className="absolute -right-24 -top-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Quantum Icon */}
                        <div className="relative z-10 flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/25">
                                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
                                    <Sparkles className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[11px] font-black uppercase tracking-wider mb-4">
                            <Lock size={12} />
                            <span>{isIndo ? 'Fitur Eksklusif Quantum Plan' : 'Exclusive Quantum Tier Feature'}</span>
                        </div>

                        <h2 className="relative z-10 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isIndo ? 'Neural AI Coach Terkunci' : 'Neural AI Coach Locked'}
                        </h2>

                        <p className="relative z-10 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto leading-relaxed font-medium">
                            {isIndo
                                ? 'Neural AI Coach hanya tersedia untuk member Quantum Plan atau selama 14 Hari Free Trial (dengan kartu kredit yang membuka semua tab & AI). Akun Free 3-Tab tanpa kartu kredit dan paket Architect tidak mencakup akses AI Coach.'
                                : 'Neural AI Coach is exclusive to Quantum Plan or during the 14-Day Card Trial (which unlocks all tabs & AI). Free 3-Tab accounts and Architect tiers do not include AI Coach access.'}
                        </p>

                        {/* Highlights Grid */}
                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 my-8 text-left">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 shrink-0">
                                    <Brain size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        {isIndo ? 'Memori Konteks Hidup' : 'Contextual Life Memory'}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                        {isIndo ? 'AI memahami data habit, agenda, dan finansial Anda.' : 'AI connects your habits, planner tasks, and cashflow.'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 shrink-0">
                                    <Zap size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        {isIndo ? 'Audit & Intervensi Harian' : 'Daily Life Audits'}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                        {isIndo ? 'Evaluasi korelasi performa dan pencegahan burnout.' : 'Detect performance drops and prevent burnout.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/billing"
                                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                            >
                                <Sparkles size={14} />
                                <span>{isIndo ? 'Upgrade ke Quantum Plan' : 'Upgrade to Quantum Plan'}</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
                            >
                                {isIndo ? 'Kembali ke Dashboard' : 'Back to Dashboard'}
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-950 relative z-[60] h-[calc(100vh-4rem)]">
                
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-950/50 z-[69] md:hidden transition-opacity duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                <CoachSidebar 
                    isOpen={isSidebarOpen}
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    onStartNewChat={startNewChat}
                    onSwitchSession={switchSession}
                    onDeleteSession={deleteSession}
                />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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

                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                        {isWelcomeState ? (
                            <CoachWelcomeView 
                                firstName={firstName}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                onKeyDown={handleKeydown}
                                onInput={autoResize}
                                textareaRef={textareaRef}
                                fileInputRef={fileInputRef}
                                onFileChange={handleFile}
                                isRecording={isRecording}
                                onStartRecording={startRecording}
                                onSendMessage={sendMessage}
                                imagePreview={imagePreview}
                                isLoading={isLoading}
                                quickActions={quickActions}
                                onQuickActionClick={(prompt) => {
                                    setNewMessage(prompt);
                                    setTimeout(() => sendMessage(), 50);
                                }}
                            />
                        ) : (
                            <CoachMessageList 
                                messages={messages}
                                isLoading={isLoading}
                                onEditMessage={editMessage}
                            />
                        )}
                    </div>

                    {!isWelcomeState && (
                        <CoachInputBar 
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            onKeyDown={handleKeydown}
                            onInput={autoResize}
                            textareaRef={textareaRef}
                            fileInputRef={fileInputRef}
                            onFileChange={handleFile}
                            isRecording={isRecording}
                            onStartRecording={startRecording}
                            onSendMessage={sendMessage}
                            imagePreview={imagePreview}
                            onRemoveImage={removeImage}
                            isLoading={isLoading}
                            onStopLoading={() => setIsLoading(false)}
                            editingIndex={editingIndex}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
