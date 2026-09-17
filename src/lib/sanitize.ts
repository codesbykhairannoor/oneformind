/**
 * High-performance, zero-dependency HTML Sanitizer for user-generated rich text.
 * Strictly strips dangerous elements, attributes, event handlers, and protocol smuggling (e.g. javascript:, data:, vbscript:).
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'span', 'div',
  'a'
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel', 'class']),
  span: new Set(['class']),
  div: new Set(['class']),
  p: new Set(['class']),
  code: new Set(['class']),
  pre: new Set(['class']),
  blockquote: new Set(['class']),
  h1: new Set(['class']),
  h2: new Set(['class']),
  h3: new Set(['class']),
  h4: new Set(['class']),
  h5: new Set(['class']),
  h6: new Set(['class']),
  ul: new Set(['class']),
  ol: new Set(['class']),
  li: new Set(['class']),
};

const DANGEROUS_PROTOCOLS = /^(javascript|vbscript|data|file):/i;

/**
 * Strips all script tags, event handlers (onload, onerror, onclick, etc.),
 * and unknown/dangerous HTML elements from raw user content.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  // 1. Remove comments, script, iframe, object, embed, form, input, button tags entirely
  let clean = dirtyHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');

  // 2. Parse and filter tags
  clean = clean.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, tagName, rawAttrs) => {
    const tag = tagName.toLowerCase();
    
    // If tag is not allowed, strip the tag but keep inner text
    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    // Closing tag
    if (match.startsWith('</')) {
      return `</${tag}>`;
    }

    // Self-closing or opening tag: parse attributes
    const allowedForTag = ALLOWED_ATTRS[tag] || new Set();
    const safeAttrs: string[] = [];

    // Match attribute patterns: name="value" or name='value' or name=value
    const attrRegex = /([a-zA-Z0-9_\-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      // Strictly ignore any attribute starting with 'on' (e.g. onclick, onerror, onload)
      if (attrName.startsWith('on')) {
        continue;
      }

      // Check if attribute is allowlisted for this tag
      if (!allowedForTag.has(attrName)) {
        continue;
      }

      // If attribute is href, validate protocol
      if (attrName === 'href') {
        const trimmedVal = attrValue.trim().replace(/[\x00-\x20]/g, '');
        if (DANGEROUS_PROTOCOLS.test(trimmedVal)) {
          continue; // Strip dangerous URI scheme
        }
        safeAttrs.push(`href="${encodeURI(trimmedVal)}"`);
        if (tag === 'a') {
          // Force secure rel for links
          safeAttrs.push('rel="noopener noreferrer"');
        }
        continue;
      }

      // For class or title, escape quotes
      const escapedValue = attrValue
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      safeAttrs.push(`${attrName}="${escapedValue}"`);
    }

    const attrString = safeAttrs.length > 0 ? ` ${safeAttrs.join(' ')}` : '';
    const isSelfClosing = tag === 'br' || tag === 'hr';
    return isSelfClosing ? `<${tag}${attrString} />` : `<${tag}${attrString}>`;
  });

  return clean;
}
