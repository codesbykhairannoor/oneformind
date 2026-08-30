import fs from 'fs';
import path from 'path';

const dir = './src/app';

const titleMappings = {
    // Marketing & Solutions
    'Student': 'For Students',
    'Personalgrowth': 'Personal Growth',
    'Ai Trust': 'AI Trust & Privacy',
    'Finance Mastery': 'Finance Tracker',
    'Second Brain': 'Second Brain System',
    'Deep Work': 'Deep Work Mode',
    'Career Accelerator': 'Career Accelerator',
    'Atomic System': 'Atomic Habit System',
    'Freelancer': 'For Freelancers',
    'Habit': 'Habit Tracker',
    'Planner': 'Daily Planner',
    'Journal': 'Private Journal',
    'Neural Os': 'Neural OS',
    'Finance': 'Finance Manager',
    
    // Auth & Legal
    'Register': 'Sign Up',
    'Login': 'Log In',
    'Forgot Password': 'Forgot Password',
    'Pricing': 'Pricing & Plans',
    
    // Resources
    'Post': 'Blog Post',
    'Stories': 'Success Stories',
    'Guide': 'User Guide',
    'Help': 'Help Center'
};

function processTitleMatch(match, originalTitle, separator, brandName) {
    let newTitleStr = originalTitle;
    
    // Check our specific mappings
    if (titleMappings[originalTitle]) {
        newTitleStr = titleMappings[originalTitle];
    }
    
    // Marketing & external pages use ' | Brand'
    // Internal dashboard pages use ' - Brand'
    // We can infer internal pages if they are dashboard, settings, profile, etc.
    const internalPages = ['Settings', 'Dashboard', 'Profile', 'Finance'];
    
    let newSeparator = ' | ';
    if (internalPages.includes(newTitleStr)) {
        newSeparator = ' - ';
    } else if (newTitleStr === 'Log In' || newTitleStr === 'Sign Up') {
        newSeparator = ' | '; // Auth is external
    }
    
    return `title: '${newTitleStr}${newSeparator}Tranvas'`;
}

function walkAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walkAndReplace(fullPath);
        } else if (fullPath.endsWith('layout.tsx') || fullPath.endsWith('page.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Match title: 'Something | Tranvas'
            content = content.replace(/title:\s*['"](.*?)[\s]*[|-][\s]*Tranvas['"]/gi, (match, p1) => {
                return processTitleMatch(match, p1.trim(), '|', 'Tranvas');
            });
            
            // Also match metadata objects in page.tsx if any
            content = content.replace(/title:\s*`(.*?)[\s]*[|-][\s]*Tranvas`/gi, (match, p1) => {
                return processTitleMatch(match, p1.trim(), '|', 'Tranvas').replace(/'/g, '`');
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated title in: ${fullPath}`);
            }
        }
    }
}

walkAndReplace(dir);
console.log("Done updating titles.");
