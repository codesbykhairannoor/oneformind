import type { Metadata } from 'next';

const BASE_URL = process.env.APP_URL || 'https://tranvas.com';

export interface PageMetadataOptions {
  locale?: string;
  path: string; // e.g. '', '/features', '/pricing', '/about', '/features/planner'
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

/**
 * Centralized SEO helper that ensures:
 * 1. Absolute canonical URLs matching the exact route path (no 307 /en redirects)
 * 2. Complete reciprocal hreflang links (en, id, x-default)
 * 3. Complete OpenGraph tags (title, description, url matching canonical, images)
 * 4. Complete Twitter Card metadata
 * 5. Strictly controlled meta description length (<= 155 characters)
 */
export function constructPageMetadata({
  locale = 'en',
  path,
  title,
  description,
  keywords,
  image = '/icon.png',
  noIndex = false,
}: PageMetadataOptions): Metadata {
  // Normalize path: empty string for root, otherwise leading slash without trailing slash
  let cleanPath = path.trim();
  if (cleanPath === '/' || cleanPath === '') {
    cleanPath = '';
  } else {
    if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
    if (cleanPath.endsWith('/') && cleanPath.length > 1) cleanPath = cleanPath.slice(0, -1);
  }

  // Exact canonical URLs
  // English (default): prefix-less (https://tranvas.com/features) -> 200 OK
  // Indonesian: /id prefix (https://tranvas.com/id/features) -> 200 OK
  const enUrl = `${BASE_URL}${cleanPath}`;
  const idUrl = `${BASE_URL}/id${cleanPath}`;
  const canonicalUrl = locale === 'id' ? idUrl : enUrl;

  // Enforce strict character limit on description (<= 155 chars)
  const trimmedDesc = description.trim();
  const cleanDescription =
    trimmedDesc.length > 155
      ? trimmedDesc.substring(0, 152).trim() + '...'
      : trimmedDesc;

  const fullTitle = title.includes('Tranvas') ? title : `${title} | Tranvas`;
  const absoluteImageUrl = image.startsWith('http')
    ? image
    : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  return {
    title: fullTitle,
    description: cleanDescription,
    keywords: keywords || [
      'Tranvas',
      'life operating system',
      'productivity app',
      'habit tracker',
      'daily planner',
      'personal finance',
      'digital journal',
      'neural os',
      'second brain',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: enUrl,
        id: idUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title: fullTitle,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'Tranvas',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [
        {
          url: absoluteImageUrl,
          width: 512,
          height: 512,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: cleanDescription,
      images: [absoluteImageUrl],
      creator: '@tranvas_app',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}
