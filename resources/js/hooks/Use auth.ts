/**
 * useAuth — Centralized auth state & permission hook
 *
 * Usage:
 *   const { user, can, hasRole, isVerified, roleMeta } = useAuth();
 *   if (can('manage:users')) { ... }
 */

import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import {
    can as checkPermission,
    getDashboardPath,
    getRoleMeta,
    hasAnyRole,
    hasRole as checkRole,
    isEmailVerified,
    isTwoFactorRequired,
    resolveRole,
    type Permission,
    type Role,
    type RoleMeta,
} from '@/lib/Permissions';
import type { User } from '@/types';

type ExtendedUser = User & {
    role?: string;
    email_verified_at?: string | null;
};

type AuthPageProps = {
    auth?: {
        user?: ExtendedUser;
    };
};

type UseAuthReturn = {
    /** The authenticated user, or null if guest */
    user: ExtendedUser | null;

    /** Whether any user is authenticated */
    isAuthenticated: boolean;

    /** Whether the user is a guest (not logged in) */
    isGuest: boolean;

    /** The user's resolved role */
    role: Role;

    /** Role metadata (label, badge class, etc.) */
    roleMeta: RoleMeta;

    /** Check if user has a specific permission */
    can: (permission: Permission) => boolean;

    /** Check if user has a specific role */
    hasRole: (role: Role) => boolean;

    /** Check if user has any of the given roles */
    hasAnyRole: (roles: Role[]) => boolean;

    /** Whether the user's email is verified */
    isVerified: boolean;

    /** Whether 2FA is required for this user's role */
    requires2FA: boolean;

    /** The appropriate dashboard path for this user */
    dashboardPath: string;
};

export function useAuth(): UseAuthReturn {
    const { auth } = usePage().props as AuthPageProps;
    const user = auth?.user ?? null;

    return useMemo(
        () => ({
            user,
            isAuthenticated: user !== null,
            isGuest: user === null,
            role: resolveRole(user),
            roleMeta: getRoleMeta(user),
            can: (permission: Permission) => checkPermission(user, permission),
            hasRole: (role: Role) => checkRole(user, role),
            hasAnyRole: (roles: Role[]) => hasAnyRole(user, roles),
            isVerified: isEmailVerified(user),
            requires2FA: isTwoFactorRequired(user),
            dashboardPath: getDashboardPath(user),
        }),
        [user],
    );
}