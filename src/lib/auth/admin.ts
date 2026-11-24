/**
 * Administrator Authorization Helper
 * SECURITY: Never trust client-writable `user_metadata` (editable via supabase.auth.updateUser).
 * Only trust explicit email allowlists and server/service-role-only `app_metadata`.
 */

export const DEFAULT_ADMIN_EMAILS = [
    'hello@tranvas.com',
    'tranvasapp@gmail.com',
    'admin@tranvas.com',
    'khairan@tranvas.com',
    'codesbykhairannoor@gmail.com',
    'khairking6@gmail.com'
];

export function isAdminUser(userOrEmail?: any): boolean {
    if (!userOrEmail) return false;
    const email = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email;
    if (!email) return false;

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check server environment variable configuration
    const rawEnv = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
    const envAdmins = rawEnv
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

    if (envAdmins.includes(cleanEmail)) return true;
    if (DEFAULT_ADMIN_EMAILS.includes(cleanEmail)) return true;

    // 2. Check server-controlled app_metadata ONLY (NEVER user_metadata)
    if (typeof userOrEmail === 'object') {
        const appRole = userOrEmail?.app_metadata?.role;
        if (appRole === 'admin' || appRole === 'superadmin' || userOrEmail?.app_metadata?.is_admin === true) {
            return true;
        }
    }

    return false;
}
