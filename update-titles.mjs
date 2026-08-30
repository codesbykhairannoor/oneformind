import fs from 'fs';
import path from 'path';

const dir = './src/app';

const titleMappings = {
    // Competitor Comparisons
    'Ynab': 'Tranvas vs YNAB',
    'Ticktick': 'Tranvas vs TickTick',
    'Wallet': 'Tranvas vs Wallet',
    'Trello': 'Tranvas vs Trello',
    'Todoist': 'Tranvas vs Todoist',
    'Streaks': 'Tranvas vs Streaks',
    'Spendee': 'Tranvas vs Spendee',
    'Spreadsheet': 'Tranvas vs Spreadsheets',
    'Obsidian': 'Tranvas vs Obsidian',
    'Notion': 'Tranvas vs Notion',
    'Monday': 'Tranvas vs Monday.com',
    'Habitify': 'Tranvas vs Habitify',
    'Habitica': 'Tranvas vs Habitica',
    'Five Apps': 'Tranvas vs App Clutter',
    
    // Category Comparisons
    'Habit Apps': 'Best Habit Tracker Apps',
    'Management Tools': 'Best Management Tools',
    'Notes Apps': 'Best Note-Taking Apps',
    
    // Other Features
    'Job': 'Job Tracker',
    'Goal': 'Goal Tracker',
    'Calendar': 'Smart Calendar',
    
    // Company / Legal
    'Press Kit': 'Press Kit & Brand Assets',
    'Status': 'System Status',
    'Contact': 'Contact Us',
    'About': 'About Us',
    'Privacy Policy': 'Privacy Policy',
    'Terms Of Service': 'Terms of Service'
};

function processTitleMatch(match, originalTitle, separator, brandName) {
    let newTitleStr = originalTitle;
    
    if (titleMappings[originalTitle]) {
        newTitleStr = titleMappings[originalTitle];
    }
    
    // If it's a comparison page (starts with 'Tranvas vs'), we don't append | Tranvas again
    if (newTitleStr.startsWith('Tranvas vs') || newTitleStr.startsWith('Best ')) {
        return `title: '${newTitleStr} | ${brandName}'`;
    }
    
    const internalPages = ['Settings', 'Dashboard', 'Profile', 'Finance'];
    
    let newSeparator = ' | ';
    if (internalPages.includes(newTitleStr)) {
        newSeparator = ' - ';
    } else if (newTitleStr === 'Log In' || newTitleStr === 'Sign Up') {
        newSeparator = ' | ';
    }
    
    return `title: '${newTitleStr}${newSeparator}${brandName}'`;
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

            content = content.replace(/title:\s*['"](.*?)[\s]*[|-][\s]*Tranvas['"]/gi, (match, p1) => {
                return processTitleMatch(match, p1.trim(), '|', 'Tranvas');
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
