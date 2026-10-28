import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>> | null | undefined;
}

/**
 * Universal JSON-LD Schema.org Injector Component
 * Emits zero visible DOM footprint, safe for Next.js SSR / SSG output.
 */
export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

