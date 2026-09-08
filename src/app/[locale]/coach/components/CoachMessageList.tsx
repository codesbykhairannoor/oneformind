'use client';

import React from 'react';
import { Edit3 } from 'lucide-react';
import { ChatMessage } from '../types';

interface CoachMessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onEditMessage: (index: number) => void;
}

export default function CoachMessageList({
    messages,
    isLoading,
    onEditMessage,
}: CoachMessageListProps) {
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
                                    onClick={() => onEditMessage(index)}
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
    );
}
