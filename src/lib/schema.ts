/**
 * Standard 2026-2027 Schema.org JSON-LD structured data generators for Tranvas
 * Optimizes for Google Rich Results, Google Knowledge Graph, Perplexity Citations, and ChatGPT Search.
 */

const BASE_URL = process.env.APP_URL || 'https://tranvas.com';

export interface FaqItem {
  q: string;
  a: string;
}

export interface BreadcrumbEntry {
  name: string;
  url: string;
}

export interface ArticleData {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  category?: string;
}

/**
 * Global SoftwareApplication Schema
 * Enables Google Software App rich snippets, app category indexing, and price badges.
 */
export function getSoftwareApplicationSchema(locale: string = 'en') {
  const isId = locale === 'id';
  const url = isId ? `${BASE_URL}/id` : BASE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tranvas',
    alternateName: ['Tranvas Life OS', 'Tranvas App'],
    url: url,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'All, Web, iOS, Android',
    browserRequirements: 'Requires JavaScript and HTML5 support',
    description: isId
      ? 'Tranvas adalah Life Operating System terpadu: satukan Daily Planner, Habit Matrix 28 Hari, Smart Finance, WOOP Goals, Pipeline Karir, dan Jurnal Refleksi dalam satu sistem cerdas.'
      : 'Tranvas is the unified Life Operating System: seamlessly align daily planning, 28-day habit streaks, zero-based budgeting, WOOP goal cascading, career pipeline, and mindful reflections.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: isId ? 'IDR' : 'USD',
      availability: 'https://schema.org/InStock',
      category: 'Personal Life Operating System',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1240',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Time-blocked Daily Planner with Eisenhower Matrix',
      '28-Day Habit Streaks based on Atomic Habits',
      'Zero-Based Personal Finance & Cashflow Budgeting',
      'WOOP Goal Cascading and Milestones',
      'Career Kanban Job Search Pipeline',
      'Mindful Gratitude & Reflection Markdown Journal',
      'Academic Course & GPA Forecasting',
      'Unified Schedule Calendar',
    ],
    screenshot: `${BASE_URL}/icon.png`,
    author: {
      '@type': 'Organization',
      name: 'Tranvas Technologies',
      url: BASE_URL,
    },
  };
}

/**
 * Organization Schema with Knowledge Graph Entity Grounding
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tranvas',
    legalName: 'Tranvas Technologies',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    image: `${BASE_URL}/icon.png`,
    description: 'Tranvas develops the unified Life Operating System designed to eliminate productivity fragmentation for ambitious individuals.',
    sameAs: [
      'https://twitter.com/tranvas_app',
      'https://github.com/codesbykhairannoor/oneformind',
      'https://www.linkedin.com/company/tranvas',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${BASE_URL}/contact`,
    },
  };
}

/**
 * WebSite Schema with Sitelinks Searchbox
 */
export function getWebSiteSchema(locale: string = 'en') {
  const isId = locale === 'id';
  const url = isId ? `${BASE_URL}/id` : BASE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tranvas',
    url: url,
    inLanguage: isId ? 'id-ID' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/features?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * FAQPage Schema (AEO Engine Optimizer)
 * Critical for direct inclusion in Google AI Overviews and Perplexity Q&A citations.
 */
export function getFaqPageSchema(faqs: FaqItem[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: BreadcrumbEntry[]) {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Blog Article / BlogPosting Schema
 */
export function getArticleSchema(article: ArticleData, locale: string = 'en') {
  const isId = locale === 'id';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    url: article.url.startsWith('http') ? article.url : `${BASE_URL}${article.url}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    inLanguage: isId ? 'id-ID' : 'en-US',
    image: article.image || `${BASE_URL}/icon.png`,
    author: {
      '@type': 'Person',
      name: article.authorName || 'Tranvas Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tranvas',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.svg`,
      },
    },
    articleSection: article.category || 'Productivity',
  };
}
