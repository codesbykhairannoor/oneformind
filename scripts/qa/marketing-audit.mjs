import fs from 'fs';
import path from 'path';

function getFiles(dir, matchExt = ['.tsx']) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath, matchExt));
        } else if (matchExt.some(ext => file.endsWith(ext))) {
            results.push(fullPath);
        }
    });
    return results;
}

const targetDirs = [
    'src/app/[locale]/solutions',
    'src/app/[locale]/features',
    'src/app/[locale]/compare',
    'src/app/[locale]/company',
    'src/app/[locale]/resources',
    'src/app/[locale]/pricing',
    'src/app/[locale]/about',
    'src/components/landing',
    'src/components/features',
    'src/components/solutions',
    'src/components/compare',
    'src/components/resources'
];

let allFiles = [];
targetDirs.forEach(d => {
    const p = path.resolve(d);
    if (fs.existsSync(p)) allFiles = allFiles.concat(getFiles(p));
});
allFiles.push(path.resolve('src/app/[locale]/page.tsx'));

console.log(`Total marketing/guest files to audit: ${allFiles.length}`);

const h1Sizes = {};
const h2Sizes = {};
const h3Sizes = {};
const pySizes = {};
const cardPaddings = {};
const pageBreakdowns = [];

allFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

    const h1s = [...content.matchAll(/<h1[^>]*className=["']([^"']*)["']/g)];
    const h2s = [...content.matchAll(/<h2[^>]*className=["']([^"']*)["']/g)];
    const h3s = [...content.matchAll(/<h3[^>]*className=["']([^"']*)["']/g)];
    const sections = [...content.matchAll(/<(?:section|header)[^>]*className=["']([^"']*)["']/g)];
    const cards = [...content.matchAll(/<div[^>]*className=["']([^"']*(?:rounded-\[?[0-9a-z]+\]?|shadow-)[^"']*)["']/g)];

    h1s.forEach(m => {
        const sizes = m[1].split(/\s+/).filter(c => /(?:^|:)text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/.test(c)).join(' ');
        h1Sizes[sizes] = (h1Sizes[sizes] || 0) + 1;
    });

    h2s.forEach(m => {
        const sizes = m[1].split(/\s+/).filter(c => /(?:^|:)text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/.test(c)).join(' ');
        h2Sizes[sizes] = (h2Sizes[sizes] || 0) + 1;
    });

    h3s.forEach(m => {
        const sizes = m[1].split(/\s+/).filter(c => /(?:^|:)text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/.test(c)).join(' ');
        h3Sizes[sizes] = (h3Sizes[sizes] || 0) + 1;
    });

    sections.forEach(m => {
        const pys = m[1].split(/\s+/).filter(c => /(?:^|:)py-\d+/.test(c)).join(' ');
        if (pys) pySizes[pys] = (pySizes[pys] || 0) + 1;
    });

    cards.forEach(m => {
        const paddings = m[1].split(/\s+/).filter(c => /(?:^|:)p-\d+/.test(c)).join(' ');
        if (paddings) cardPaddings[paddings] = (cardPaddings[paddings] || 0) + 1;
    });

    pageBreakdowns.push({
        file: rel,
        sectionsCount: sections.length,
        h1Count: h1s.length,
        h2Count: h2s.length,
        h3Count: h3s.length,
        h2Sample: h2s.map(m => m[1].split(/\s+/).filter(c => /(?:^|:)text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/.test(c)).join(' ')).filter(Boolean)
    });
});

console.log('\n=== TOP H1 SIZES ===');
console.log(Object.entries(h1Sizes).sort((a,b) => b[1] - a[1]));

console.log('\n=== TOP H2 SIZES (THE CHAOS) ===');
console.log(Object.entries(h2Sizes).sort((a,b) => b[1] - a[1]));

console.log('\n=== TOP H3 SIZES ===');
console.log(Object.entries(h3Sizes).sort((a,b) => b[1] - a[1]).slice(0, 10));

console.log('\n=== TOP SECTION PY PADDING ===');
console.log(Object.entries(pySizes).sort((a,b) => b[1] - a[1]).slice(0, 10));

console.log('\n=== PAGES WITH SECTIONS DETAIL (SAMPLE) ===');
console.log(JSON.stringify(pageBreakdowns.filter(p => p.sectionsCount > 0).slice(0, 15), null, 2));

const totalSections = pageBreakdowns.reduce((acc, p) => acc + p.sectionsCount, 0);
console.log(`\nTotal sections across all marketing files: ${totalSections}`);
