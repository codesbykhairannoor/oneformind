'use client';

import { useState, useEffect, useRef } from 'react';
import GuestLayout from '@/components/GuestLayout';
import PostProgressBar from '@/components/resources/post/PostProgressBar';
import PostHeader from '@/components/resources/post/PostHeader';
import PostSidebarShare from '@/components/resources/post/PostSidebarShare';
import PostArticleContent from '@/components/resources/post/PostArticleContent';
import PostSidebarToc, { TocItem } from '@/components/resources/post/PostSidebarToc';
import PostRelatedPosts from '@/components/resources/post/PostRelatedPosts';
import PostFaqAccordion from '@/components/resources/post/PostFaqAccordion';

const FAQS = [
    {
        q: 'Mengapa menggabungkan pelacak kebiasaan dan keuangan dalam satu aplikasi lebih efektif dibanding template Notion?',
        a: 'Perilaku keuangan didorong oleh kebiasaan harian. Menyatukan keduanya dalam satu alur kerja mengurangi gesekan kognitif dan meningkatkan konsistensi.',
    },
    {
        q: 'Berapa lama waktu minimal yang dibutuhkan untuk membangun Personal Operating System?',
        a: 'Anda dapat membangun pengaturan awal hanya dalam 30 menit dengan berfokus pada 3 kebiasaan utama, 3 tugas prioritas, dan arus kas keuangan.',
    },
    {
        q: 'Apa itu Weekly Reset Framework?',
        a: 'Weekly Reset adalah proses peninjauan mingguan untuk merefleksikan pencapaian, merekonsiliasi keuangan, dan menyusun ulang prioritas tugas.',
    },
];

const POST_TITLE = 'Why Habit & Finance in One App Beats Notion Templates';

export default function BlogPostPage() {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const articleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!articleRef.current) return;
        const headers = articleRef.current.querySelectorAll('h2, h3');
        const items: TocItem[] = [];
        headers.forEach((header, index) => {
            const id = `section-${index}`;
            header.setAttribute('id', id);
            items.push({ id, text: header.textContent || '', level: header.tagName });
        });
        setTocItems(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.getAttribute('id') || '');
                    }
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );
        headers.forEach((h) => observer.observe(h));
        return () => observer.disconnect();
    }, []);

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const scrollTo = (id: string) => {
        const target = document.getElementById(id);
        if (target) {
            window.scrollTo({ top: target.offsetTop - 120, behavior: 'smooth' });
        }
    };

    return (
        <GuestLayout>
            <main id="blog-post" className="overflow-x-hidden bg-white">
                <PostProgressBar />
                <PostHeader title={POST_TITLE} />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8 lg:gap-16 py-12 md:py-24 relative">
                    <PostSidebarShare url={currentUrl} title={POST_TITLE} />
                    <PostArticleContent articleRef={articleRef} postTitle={POST_TITLE} faqs={FAQS} />
                    <PostSidebarToc tocItems={tocItems} activeId={activeId} onScrollTo={scrollTo} />
                </div>

                <PostRelatedPosts />
                <PostFaqAccordion faqs={FAQS} />
            </main>
        </GuestLayout>
    );
}
