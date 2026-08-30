import fs from 'fs';
import path from 'path';

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
            if (fullPath.match(/\.(tsx|ts|js|jsx|json|md|html|css|env.*)$/)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content;

                newContent = newContent.replace(/Oneformind/g, 'Tranvas');
                newContent = newContent.replace(/One Mind/gi, 'Tranvas');

                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

walkAndReplace(process.cwd());
console.log("Done phase 2.");
