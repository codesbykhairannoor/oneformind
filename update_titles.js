const fs = require('fs');
const path = require('path');

function getCatchyTitle(filePath) {
    const parts = filePath.split(path.sep);
    const pageName = parts[parts.length - 2];
    const category = parts[parts.length - 3];
    
    const mapping = {
        'student': 'For Students — Optimize Your Learning',
        'second-brain': 'Second Brain — Your Digital Knowledge Map',
        'personalgrowth': 'Personal Growth — Master Your Self-System',
        'mental-clarity': 'Mental Health — Journaling & Mindfulness',
        'freelancer': 'For Freelancers — Scale Your Workflow',
        'deep-work': 'Deep Work — Uninterrupted Focus',
        'finance-mastery': 'Financial Clarity — Manage Assets & Cashflow',
        'atomic-system': 'Atomic Habits — Small Steps, Big Results',
        'career-accelerator': 'Career Tracker — Focus on Professional Growth',
        'calendar': 'Smart Calendar — Sync Your Schedules',
        'finance': 'Finance OS — Master Your Money Flow',
        'goal': 'Goal Tracker — Track Your Milestones',
        'habit': 'Habit Tracker — Build Consistency Every Day',
        'job': 'Job Tracker — Manage Career Growth',
        'journal': 'Digital Journal — Capture Your Thoughts',
        'neural-os': 'Neural OS AI — Powered by Gemini Brain',
        'planner': 'Daily Planner — Focus on What Matters',
        'pricing': 'Pricing & Plans — Choose Your Journey',
        'register': 'Sign Up — Start Your Journey',
        'login': 'Log In — Welcome Back',
        'blog': 'Blog — Productivity Insights',
        'changelog': "Changelog — What's New",
        'community': 'Community — Connect with Users',
        'guide': 'User Guide — Master the OS',
        'help': 'Help Center — Find Solutions',
        'post': 'Blog Post — Productivity Insights',
        'stories': 'Success Stories — User Transformations',
        'ai-trust': 'AI Transparency — Our Commitment',
        'about': 'About Us — Our Mission',
    };

    if (mapping[pageName]) return mapping[pageName];
    if (category === 'compare') {
        const titleCase = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        return 'Tranvas vs ' + titleCase + ' — Which is Better?';
    }
    return null;
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('d:\\\\oneformind\\\\src\\\\app\\\\[locale]', function(filePath) {
    if (filePath.endsWith('layout.tsx') && !filePath.endsWith('[locale]\\\\layout.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        const catchy = getCatchyTitle(filePath);
        
        let originalContent = content;
        if (catchy) {
            content = content.replace(/title:\s*['\"].*?['\"]/g, `title: '${catchy}'`);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log('Updated ' + filePath);
        }
    }
});
