import fs from 'fs';
import path from 'path';

// Files and directories to ignore
const ignoreDirs = ['node_modules', '.next', '.git', 'dist', 'build', 'prisma', 'public'];

function walkAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                walkAndReplace(fullPath);
            }
        } else {
            // Only process text files we care about
            if (fullPath.match(/\.(tsx|ts|js|jsx|json|md|html|css|env.*)$/)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content;

                // Replace exact case OneForMind -> Tranvas
                newContent = newContent.replace(/OneForMind/g, 'Tranvas');
                // Replace exact case oneformind -> tranvas
                newContent = newContent.replace(/oneformind/g, 'tranvas');
                // Replace exact case ONEFORMIND -> TRANVAS
                newContent = newContent.replace(/ONEFORMIND/g, 'TRANVAS');

                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

console.log("Starting global rename...");
walkAndReplace(process.cwd());
console.log("Done.");
