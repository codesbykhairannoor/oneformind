/**
 * Administrator Authorization Helper
 */

export const DEFAULT_ADMIN_EMAILS = [
    'tranvasapp@gmail.com',
    'admin@tranvas.com',
    'khairan@tranvas.com',
    'codesbykhairannoor@gmail.com'
];

export function isAdminUser(userOrEmail?: any): boolean {
    if (!userOrEmail) return false;
    const email = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email;
    if (!email) return false;

    const cleanEmail = email.trim().toLowerCase();

    // Check environment variable configuration
    const envAdmins = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

    if (envAdmins.includes(cleanEmail)) return true;
    if (DEFAULT_ADMIN_EMAILS.includes(cleanEmail)) return true;

    // Check metadata role
    if (typeof userOrEmail === 'object') {
        const role = userOrEmail?.user_metadata?.role || userOrEmail?.role;
        if (role === 'admin' || role === 'superadmin' || userOrEmail?.user_metadata?.is_admin === true) {
            return true;
        }
    }

    return false;
}
