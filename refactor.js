const fs = require('fs'); 
const path = require('path'); 
function walk(dir) { 
  let results = []; 
  const list = fs.readdirSync(dir); 
  list.forEach(file => { 
    file = path.resolve(dir, file); 
    const stat = fs.statSync(file); 
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file)); 
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file); 
    } 
  }); 
  return results; 
} 

const files = walk('d:/oneformind/src'); 
files.forEach(file => { 
  let content = fs.readFileSync(file, 'utf8'); 
  let modified = false; 
  if (content.includes('next-auth/react')) { 
    content = content.replace(/import\s+\{\s*useSession\s*\}\s+from\s+['"]next-auth\/react['"];?/g, 'import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";'); 
    content = content.replace(/import\s+\{\s*useSession\s*,\s*signOut\s*\}\s+from\s+['"]next-auth\/react['"];?/g, 'import { useSupabaseSession as useSession } from "@/hooks/useSupabaseSession";\nimport { createClient } from "@/utils/supabase/client";'); 
    content = content.replace(/import\s+\{\s*SessionProvider\s*\}\s+from\s+['"]next-auth\/react['"];?/g, ''); 
    modified = true; 
  } 
  if (modified) { 
    fs.writeFileSync(file, content); 
    console.log('Updated ' + file); 
  } 
});
