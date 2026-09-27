export interface CategoryBundle {
    name: string;
    icon: string;
    color: string;
}

const STORAGE_KEY = 'oneformind_goal_category_bundles';

export function getCategoryBundles(allGoals?: any[]): Record<string, CategoryBundle> {
    const bundles: Record<string, CategoryBundle> = {};

    // 1. Load from localStorage if available
    if (typeof window !== 'undefined') {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    Object.entries(parsed).forEach(([_, v]: [string, any]) => {
                        if (v && typeof v.name === 'string' && v.name.trim()) {
                            bundles[v.name.toLowerCase().trim()] = {
                                name: v.name.trim(),
                                icon: v.icon || '🎯',
                                color: v.color || '#6366f1'
                            };
                        }
                    });
                }
            }
        } catch {}
    }

    // 2. Scan allGoals to harvest or augment categories
    if (Array.isArray(allGoals)) {
        allGoals.forEach(g => {
            const cat = (g.category || '').trim();
            if (cat && cat.toLowerCase() !== 'other') {
                const key = cat.toLowerCase();
                let icon = g.icon;
                if (!icon && g.specific_days && typeof g.specific_days === 'string') {
                    try {
                        const m = JSON.parse(g.specific_days);
                        if (m.icon) icon = m.icon;
                    } catch {}
                }
                const color = g.color || '#6366f1';
                
                if (!bundles[key]) {
                    bundles[key] = {
                        name: cat,
                        icon: icon || '🎯',
                        color: color
                    };
                } else {
                    if (icon && bundles[key].icon === '🎯') {
                        bundles[key].icon = icon;
                    }
                    if (color && color !== '#6366f1' && bundles[key].color === '#6366f1') {
                        bundles[key].color = color;
                    }
                }
            }
        });
    }

    return bundles;
}

export function saveCategoryBundle(bundle: CategoryBundle) {
    if (typeof window === 'undefined' || !bundle.name?.trim()) return;
    try {
        const key = bundle.name.toLowerCase().trim();
        const bundles = getCategoryBundles();
        bundles[key] = {
            name: bundle.name.trim(),
            icon: bundle.icon || '🎯',
            color: bundle.color || '#6366f1'
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bundles));
    } catch {}
}

export function removeCategoryBundle(catName: string) {
    if (typeof window === 'undefined' || !catName?.trim()) return;
    try {
        const key = catName.toLowerCase().trim();
        const bundles = getCategoryBundles();
        delete bundles[key];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bundles));
    } catch {}
}
