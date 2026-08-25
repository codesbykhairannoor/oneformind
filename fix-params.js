const fs = require('fs');
const path = require('path');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('route.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allRouteFiles = getAllFiles(path.join(__dirname, 'src/app/api'));
const dynamicRouteFiles = allRouteFiles.filter(f => f.includes('['));

console.log('Found dynamic route files:', dynamicRouteFiles.length);

dynamicRouteFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace single parameter like { params: { id: string } }
    let modified = content.replace(
        /export async function (GET|POST|PUT|DELETE)\(req: Request, \{ params \}: \{ params: \{ ([a-zA-Z0-9_]+): string \} \}\) \{/g,
        'export async function $1(req: Request, props: { params: Promise<{ $2: string }> }) {\n  const params = await props.params;'
    );

    // Replace multiple parameters like { params: { id: string, milestoneId: string } }
    modified = modified.replace(
        /export async function (GET|POST|PUT|DELETE)\(req: Request, \{ params \}: \{ params: \{ ([a-zA-Z0-9_]+): string, ([a-zA-Z0-9_]+): string \} \}\) \{/g,
        'export async function $1(req: Request, props: { params: Promise<{ $2: string, $3: string }> }) {\n  const params = await props.params;'
    );

    if (modified !== content) {
        fs.writeFileSync(file, modified);
        console.log('Fixed:', file);
    }
});
