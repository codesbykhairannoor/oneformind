'use client';

import { useState, useEffect } from 'react';

export default function PostProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const height = document.documentElement.scrollHeight - window.innerHeight;
                    if (height > 0) setProgress((window.scrollY / height) * 100);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-16 left-0 w-full h-[2px] z-[100] bg-slate-50">
            <div
                className="h-full bg-indigo-600 transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
