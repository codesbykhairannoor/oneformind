'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * ModalPortal — renders children directly into document.body via a React Portal.
 *
 * This escapes any CSS containing-block created by parent elements with
 * `overflow` (auto/hidden/scroll), `transform`, `filter`, or `backdrop-filter`.
 * Without this, `position: fixed` modals rendered inside an `overflow-y-auto`
 * container are positioned relative to that container instead of the viewport,
 * causing them to appear at the bottom of the page rather than centered.
 */
export default function ModalPortal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent background scrolling which causes lag and layout thrashing
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
            setMounted(false);
            document.body.style.overflow = originalStyle;
        };
    }, []);

    if (!mounted) return null;

    return createPortal(children, document.body);
}
