export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    VISITOR: 'visitor',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
    ADMIN_ACCESS: 'admin:access',
    MANAGE_USERS: 'manage:users',
    MANAGE_CONTENT: 'manage:content',
    VIEW_ANALYTICS: 'view:analytics',
    EXPORT_DATA: 'export:data',
    BILLING_ACCESS: 'billing:access',
    SETTINGS_ADVANCED: 'settings:advanced',
    TWO_FACTOR_REQUIRE: 'two-factor:require',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type RoleMeta = {
    label: string;
    description: string;
    badgeClass: string;
    dashboardPath: string;
    permissions: Permission[];
};

/** Role configuration — single source of truth */
export const ROLE_CONFIG: Record<Role, RoleMeta> = {
    [ROLES.SUPER_ADMIN]: {
        label: 'Super Admin',
        description: 'Full platform access and global administration',
        badgeClass:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        dashboardPath: '/admin',
        permissions: [
            PERMISSIONS.ADMIN_ACCESS,
            PERMISSIONS.MANAGE_USERS,
            PERMISSIONS.MANAGE_CONTENT,
            PERMISSIONS.VIEW_ANALYTICS,
            PERMISSIONS.EXPORT_DATA,
            PERMISSIONS.BILLING_ACCESS,
            PERMISSIONS.SETTINGS_ADVANCED,
            PERMISSIONS.TWO_FACTOR_REQUIRE,
        ],
    },
    [ROLES.ADMIN]: {
        label: 'Admin',
        description: 'Area administration and user management',
        badgeClass:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        dashboardPath: '/admin',
        permissions: [
            PERMISSIONS.ADMIN_ACCESS,
            PERMISSIONS.MANAGE_USERS,
            PERMISSIONS.MANAGE_CONTENT,
            PERMISSIONS.VIEW_ANALYTICS,
        ],
    },
    [ROLES.VISITOR]: {
        label: 'Visitor',
        description: 'Standard access to platform features',
        badgeClass: 'bg-muted text-muted-foreground',
        dashboardPath: '/dashboard',
        permissions: [],
    },
};

type UserLike = {
    role?: string;
    email_verified_at?: string | null;
    can?: string[];
};

/**
 * Resolve a user's role — defaults to 'visitor' if not set
 */
export function resolveRole(user?: UserLike | null): Role {
    const raw = user?.role?.toLowerCase() ?? ROLES.VISITOR;
    return raw in ROLE_CONFIG ? (raw as Role) : ROLES.VISITOR;
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: UserLike | null | undefined, role: Role): boolean {
    return resolveRole(user) === role;
}

/**
 * Check if a user has any of the given roles
 */
export function hasAnyRole(
    user: UserLike | null | undefined,
    roles: Role[],
): boolean {
    return roles.includes(resolveRole(user));
}

/**
 * Check if a user has a specific permission
 */
export function can(
    user: UserLike | null | undefined,
    permission: Permission,
): boolean {
    if (!user) return false;
    
    // Prefer backend provided permissions to prevent drift
    if (user.can && Array.isArray(user.can)) {
        return user.can.includes(permission);
    }

    const role = resolveRole(user);
    return ROLE_CONFIG[role].permissions.includes(permission);
}

/**
 * Get role metadata for display
 */
export function getRoleMeta(user?: UserLike | null): RoleMeta {
    return ROLE_CONFIG[resolveRole(user)];
}

/**
 * Get the appropriate dashboard redirect path for a user's role
 */
export function getDashboardPath(user?: UserLike | null): string {
    return getRoleMeta(user).dashboardPath;
}

/**
 * Check if a user's email is verified
 */
export function isEmailVerified(user?: UserLike | null): boolean {
    return Boolean(user?.email_verified_at);
}

/**
 * Check if 2FA is required for the user's role
 */
export function isTwoFactorRequired(user?: UserLike | null): boolean {
    return can(user, 'two-factor:require');
}
