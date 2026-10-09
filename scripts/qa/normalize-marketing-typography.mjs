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

console.log(`Processing ${allFiles.length} files with surgical token-based normalization...`);

let modifiedFiles = 0;
const modifiedList = [];

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Single-pass H2 Normalization
    content = content.replace(/(<h2\b[^>]*?\bclassName=["'])([^"']*?)(["'])/gs, (match, prefix, classNames, suffix) => {
        const textSizeRegex = /(?:^|\s)(?:(?:sm|md|lg|xl|2xl):)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g;
        const matchedSizes = classNames.match(textSizeRegex);
        
        if (!matchedSizes) return match;
        const joinedSizes = matchedSizes.map(s => s.trim()).join(' ');

        // Check if it's one of the chaotic/non-responsive patterns
        const isChaotic = 
            joinedSizes.includes('text-5xl') || 
            joinedSizes.includes('text-6xl') || 
            joinedSizes.includes('md:text-6xl') || 
            joinedSizes.includes('md:text-7xl') ||
            joinedSizes.includes('md:text-8xl') ||
            joinedSizes === 'text-4xl' ||
            joinedSizes === 'text-4xl md:text-5xl';

        if (!isChaotic) return match;

        // Choose replacement token based on scale:
        let replacement = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl';
        if (joinedSizes.includes('md:text-7xl') || joinedSizes.includes('text-6xl') || joinedSizes.includes('md:text-8xl')) {
            replacement = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';
        }

        // Remove old text size classes and inject replacement cleanly
        let updatedClasses = classNames.replace(textSizeRegex, ' ').replace(/\s+/g, ' ').trim();
        updatedClasses = `${replacement} ${updatedClasses}`.trim();

        return `${prefix}${updatedClasses}${suffix}`;
    });

    // 2. Single-pass H1 Normalization
    content = content.replace(/(<h1\b[^>]*?\bclassName=["'])([^"']*?)(["'])/gs, (match, prefix, classNames, suffix) => {
        const textSizeRegex = /(?:^|\s)(?:(?:sm|md|lg|xl|2xl):)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g;
        const matchedSizes = classNames.match(textSizeRegex);
        if (!matchedSizes) return match;
        const joinedSizes = matchedSizes.map(s => s.trim()).join(' ');

        const isChaotic = 
            joinedSizes.includes('md:text-8xl') || 
            joinedSizes.includes('md:text-7xl') ||
            joinedSizes === 'text-4xl md:text-6xl' ||
            joinedSizes === 'text-4xl sm:text-5xl md:text-6xl';

        if (!isChaotic) return match;

        const replacement = 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl';
        let updatedClasses = classNames.replace(textSizeRegex, ' ').replace(/\s+/g, ' ').trim();
        updatedClasses = `${replacement} ${updatedClasses}`.trim();

        return `${prefix}${updatedClasses}${suffix}`;
    });

    // 3. Single-pass Section Padding Normalization
    content = content.replace(/(<(?:section|header)\b[^>]*?\bclassName=["'])([^"']*?)(["'])/gs, (match, prefix, classNames, suffix) => {
        let updatedClasses = classNames;
        if (/\bpy-32\b/.test(updatedClasses) && !updatedClasses.includes('sm:py-') && !updatedClasses.includes('lg:py-')) {
            updatedClasses = updatedClasses.replace(/\bpy-32\b/g, 'py-14 sm:py-20 lg:py-28');
        } else if (/\bpy-40\b/.test(updatedClasses) && !updatedClasses.includes('sm:py-') && !updatedClasses.includes('lg:py-')) {
            updatedClasses = updatedClasses.replace(/\bpy-40\b/g, 'py-16 sm:py-24 lg:py-32');
        } else if (/\bpy-24\b/.test(updatedClasses) && !updatedClasses.includes('sm:py-') && !updatedClasses.includes('lg:py-')) {
            updatedClasses = updatedClasses.replace(/\bpy-24\b/g, 'py-12 sm:py-16 lg:py-24');
        }

        return `${prefix}${updatedClasses}${suffix}`;
    });

    // 4. Transform Oversized Bento/Card Padding
    content = content.replace(/\bp-10\s+rounded-\[3rem\]/g, 'p-5 sm:p-7 lg:p-9 rounded-2xl sm:rounded-3xl');
    content = content.replace(/\bp-10\s+rounded-\[2\.5rem\]/g, 'p-5 sm:p-7 lg:p-9 rounded-2xl sm:rounded-3xl');
    content = content.replace(/\bp-12\s+rounded-\[3rem\]/g, 'p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl');

    // 5. Transform Subtitle Paragraphs (under H1/H2 with static text-xl)
    content = content.replace(/(<p\b[^>]*?\bclassName=["'][^"']*?)\btext-xl\s+(text-(?:gray|slate)-(?:400|500|600))/g, '$1text-base sm:text-lg md:text-xl $2');

    if (content !== original) {
        modifiedFiles++;
        modifiedList.push(path.relative(process.cwd(), file).replace(/\\/g, '/'));
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log(`\nSurgical normalization complete!`);
console.log(`Files modified: ${modifiedFiles} out of ${allFiles.length}`);
console.log(`Sample modified files:`, modifiedList.slice(0, 15));
