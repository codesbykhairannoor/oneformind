const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.go')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Remove any Cache-Control if it has max-age
    if (content.includes('Cache-Control') && !content.includes('no-store')) {
        content = content.replace(/w\.Header\(\)\.Set\("Cache-Control",.*?\)/g, 'w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")');
        changed = true;
    }

    if (!content.includes('default_query_exec_mode=') && content.includes('sql.Open("pgx"')) {
        // inject before sql.Open
        content = content.replace(/(.*)(db[\w]*,?\s*err\s*=\s*sql\.Open\("pgx",\s*connStr\))/, 
`	if !strings.Contains(connStr, "default_query_exec_mode=") { 
		if strings.Contains(connStr, "?") { 
			connStr += "&default_query_exec_mode=simple_protocol" 
		} else { 
			connStr += "?default_query_exec_mode=simple_protocol" 
		} 
	}
$1$2`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

processDir(path.join(__dirname, 'backend'));
console.log("Done");
