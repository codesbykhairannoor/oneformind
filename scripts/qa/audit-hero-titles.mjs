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

const h1List = [];
const noH1Pages = [];

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const h1Matches = [...content.matchAll(/<h1[^>]*className=["']([^"']*)["'][^>]*>/gs)];
    
    if (h1Matches.length > 0) {
        h1Matches.forEach(m => {
            const cls = m[1];
            const textSizes = cls.split(/\s+/).filter(c => /(?:^|:)text-(xs|sm|base|lg|xl|[0-9]xl)/.test(c)).join(' ');
            h1List.push({ file: rel, textSizes, cls });
        });
    } else if (file.endsWith('page.tsx')) {
        noH1Pages.push(rel);
    }
});

console.log('Total H1 tags found:', h1List.length);
console.log('--- H1 Text Size Distribution ---');
const dist = {};
h1List.forEach(item => {
    dist[item.textSizes] = (dist[item.textSizes] || 0) + 1;
});
console.log(dist);

console.log('\n--- H1s Detail by Size ---');
Object.keys(dist).forEach(sizeKey => {
    console.log(`\nSize: [${sizeKey}] (Count: ${dist[sizeKey]})`);
    h1List.filter(item => item.textSizes === sizeKey).forEach(item => {
        console.log(`  - ${item.file}`);
    });
});

console.log('\n--- Pages without inline H1 (delegating to subcomponent Hero) ---');
console.log(noH1Pages);
