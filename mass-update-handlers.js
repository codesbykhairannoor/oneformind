/**
 * mass-fix-handlers.js — smarter version
 * Detects the actual db variable name per handler and fixes initDB() correctly.
 */
const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');

function getHandlerFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...getHandlerFiles(fullPath));
        } else if (entry.name === 'handler.go') {
            results.push(fullPath);
        }
    }
    return results;
}

const handlers = getHandlerFiles(backendDir);

for (const filePath of handlers) {
    const packageName = path.basename(path.dirname(filePath));
    if (packageName === 'shareddb') continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Find actual db variable name (e.g., "db", "dbGoals", "dbDaily", etc.)
    const dbVarMatch = content.match(/^var\s+(db\w*)\s+\*sql\.DB/m);
    if (!dbVarMatch) {
        console.log(`SKIP (no db var): ${filePath}`);
        continue;
    }
    const dbVarName = dbVarMatch[1];

    // 2. Fix initDB() to use the correct variable name
    const badInitDB = /func initDB\(\) \{\n\tdb = shareddb\.Get\(\)\n\}/;
    if (content.match(badInitDB) && dbVarName !== 'db') {
        content = content.replace(
            badInitDB,
            `func initDB() {\n\t${dbVarName} = shareddb.Get()\n}`
        );
        console.log(`FIXED initDB var ${dbVarName}: ${filePath}`);
    } else if (content.includes('shareddb.Get()')) {
        console.log(`OK (already correct): ${filePath}`);
    }

    // 3. Remove unused imports: "os", "strings", "fmt" if only used in old initDB
    // Check if "os." is referenced outside initDB
    const osUsed = /\bos\.\w+/.test(content.replace(/func initDB[\s\S]*?\n\}/, ''));
    const stringsUsed = /\bstrings\.\w+/.test(content.replace(/func initDB[\s\S]*?\n\}/, ''));
    const fmtUsed = /\bfmt\.\w+/.test(content.replace(/func initDB[\s\S]*?\n\}/, ''));
    const timeUsedInInit = content.includes('time.Minute') || content.includes('SetConnMaxLifetime');

    if (!osUsed) {
        content = content.replace(/\t"os"\n/, '');
        console.log(`  Removed unused "os": ${path.basename(filePath)}`);
    }
    if (!stringsUsed) {
        content = content.replace(/\t"strings"\n/, '');
        console.log(`  Removed unused "strings": ${path.basename(filePath)}`);
    }
    if (!fmtUsed) {
        content = content.replace(/\t"fmt"\n/, '');
        console.log(`  Removed unused "fmt": ${path.basename(filePath)}`);
    }

    // 4. Remove time import if only used for SetConnMaxLifetime (now gone)
    // Only remove if time is literally not referenced in handler logic
    const timeInContent = content.replace(/func initDB[\s\S]*?\n\}/, '');
    if (!timeInContent.includes('time.')) {
        content = content.replace(/\t"time"\n/, '');
        console.log(`  Removed unused "time": ${path.basename(filePath)}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\nDone! Run: go build ./backend/... to verify');
