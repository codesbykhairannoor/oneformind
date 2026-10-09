'use client';

import React from 'react';
import Link from 'next/link';

export interface ModuleHeaderProps {
    icon: React.ReactNode;
    iconHref?: string;
    iconTitle?: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    badge?: React.ReactNode;
    centerContent?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

/**
 * Standard Global SaaS Header Component for OneForMind
 * Follows a unified 3-zone architecture:
 * [Left: Icon + Title + Badge + Subtitle] | [Center: Time / Filter Controls] | [Right: Actions & CTA]
 */
export default function ModuleHeader({
    icon,
    iconHref,
    iconTitle,
    title,
    subtitle,
    badge,
    centerContent,
    actions,
    children,
    className = ''
}: ModuleHeaderProps) {
    const iconElement = (
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-800/40 flex items-center justify-center shrink-0 shadow-xs transition-colors [&>svg]:w-4.5 [&>svg]:h-4.5 md:[&>svg]:w-[18px] md:[&>svg]:h-[18px]">
            {icon}
        </div>
    );

    return (
        <header className={`relative z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors ${className}`}>
            <div className="w-full max-w-[1800px] mx-auto px-3.5 md:px-6 lg:px-8 py-2.5 md:py-3.5 space-y-2 md:space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                    
                    {/* Left: Module Identity */}
                    <div className="flex items-center gap-2.5 md:gap-3 min-w-0 shrink-0">
                        {iconHref ? (
                            <Link 
                                href={iconHref} 
                                title={iconTitle} 
                                className="group hover:opacity-90 active:scale-95 transition-transform"
                            >
                                {iconElement}
                            </Link>
                        ) : (
                            iconElement
                        )}

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {title}
                                </h1>
                                {badge}
                            </div>
                            {subtitle && (
                                <p className="text-[11.5px] md:text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[240px] md:max-w-md mt-0.5 leading-none">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Controls & Actions (Grouped naturally together on the right, horizontally scrollable on mobile) */}
                    {(centerContent || actions) && (
                        <div className="flex items-center gap-1.5 md:gap-2.5 overflow-x-auto no-scrollbar py-0.5 max-w-full shrink-0 justify-start md:justify-end">
                            {centerContent}
                            {actions}
                        </div>
                    )}
                </div>

                {/* Sub-row (if any, e.g. tabs or notice banner) */}
                {children}
            </div>
        </header>
    );
}
