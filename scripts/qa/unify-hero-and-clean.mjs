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

console.log(`Auditing and unifying ${allFiles.length} files...`);

const TARGET_H1_CLASSES = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl';
let h1TransformedCount = 0;
let duplicatesCleanedCount = 0;
const affectedFiles = new Set();

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Clean up duplicate tokens first
    if (content.includes('text-base sm:text-lg md:text-base sm:text-lg md:text-xl')) {
        content = content.replaceAll('text-base sm:text-lg md:text-base sm:text-lg md:text-xl', 'text-base sm:text-lg md:text-xl');
        duplicatesCleanedCount++;
        affectedFiles.add(file);
    }
    if (content.includes('text-2xl sm:text-3xl md:text-4xl lg:text-2xl sm:text-3xl md:text-4xl lg:text-5xl')) {
        content = content.replaceAll('text-2xl sm:text-3xl md:text-4xl lg:text-2xl sm:text-3xl md:text-4xl lg:text-5xl', 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl');
        duplicatesCleanedCount++;
        affectedFiles.add(file);
    }
    if (content.includes('text-3xl sm:text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl')) {
        content = content.replaceAll('text-3xl sm:text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl', 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl');
        duplicatesCleanedCount++;
        affectedFiles.add(file);
    }

    // 2. Fix inline style on H1 (ai-trust and community)
    // E.g.: <h1 style={{ fontSize: 'clamp(...)', ... }} className="text-white ...">
    if (file.includes('ai-trust') || file.includes('community')) {
        content = content.replace(/<h1\s+style=\{\{[^}]*fontSize:[^}]*\}\}\s+className=["']([^"']*)["']/g, (m, cls) => {
            let cleanCls = cls.split(/\s+/).filter(c => !/(?:^|:)text-(xs|sm|base|lg|xl|[0-9]xl)/.test(c)).join(' ');
            return `<h1 className="${TARGET_H1_CLASSES} ${cleanCls}".replace(/\s+/g, ' ').trim()}"`;
        });
        // Also cleanup inline style if written without surrounding classes
        content = content.replace(/<h1\s+style=\{\{[^}]*fontSize:[^}]*\}\}/g, `<h1 className="${TARGET_H1_CLASSES}"`);
    }

    // 3. Unify all H1 headings to TARGET_H1_CLASSES
    content = content.replace(/(<h1\b[^>]*?\bclassName=["'])([^"']*?)(["'])/gs, (match, prefix, classNames, suffix) => {
        // Find existing text-size tokens including arbitrary text-[36px]
        const textSizeRegex = /(?:^|\s)(?:(?:sm|md|lg|xl|2xl):)?text-(?:xs|sm|base|lg|xl|[0-9]xl|\[[^\]]+\])\b/g;
        
        let updatedClasses = classNames.replace(textSizeRegex, ' ').replace(/\s+/g, ' ').trim();
        updatedClasses = `${TARGET_H1_CLASSES} ${updatedClasses}`.trim();
        
        if (updatedClasses !== classNames) {
            h1TransformedCount++;
            affectedFiles.add(file);
        }
        return `${prefix}${updatedClasses}${suffix}`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log(`\nUnification Summary:`);
console.log(`- Files touched: ${affectedFiles.size}`);
console.log(`- H1 tags standardized: ${h1TransformedCount}`);
console.log(`- Duplicate token instances cleaned: ${duplicatesCleanedCount}`);
