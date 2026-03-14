import { type ReactNode } from 'react';
import { useAuth } from '@/hooks/Use auth';
import type { Permission, Role } from '@/lib/Permissions';

type GuardProps = {
    children: ReactNode;
    fallback?: ReactNode;
};

/**
 * Only renders children if the user is authenticated
 */
export function AuthGuard({ children, fallback = null }: GuardProps) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}

/**
 * Only renders children if the user is NOT authenticated (guest)
 */
export function GuestGuard({ children, fallback = null }: GuardProps) {
    const { isGuest } = useAuth();
    return isGuest ? <>{children}</> : <>{fallback}</>;
}

/**
 * Only renders children if the user has the exact role
 */
export function RoleGuard({
    children,
    fallback = null,
    role,
}: GuardProps & { role: Role }) {
    const { hasRole } = useAuth();
    return hasRole(role) ? <>{children}</> : <>{fallback}</>;
}

/**
 * Only renders children if the user has any of the given roles
 */
export function AnyRoleGuard({
    children,
    fallback = null,
    roles,
}: GuardProps & { roles: Role[] }) {
    const { hasAnyRole } = useAuth();
    return hasAnyRole(roles) ? <>{children}</> : <>{fallback}</>;
}

/**
 * Only renders children if the user has the given permission
 */
export function PermissionGuard({
    children,
    fallback = null,
    permission,
}: GuardProps & { permission: Permission }) {
    const { can } = useAuth();
    return can(permission) ? <>{children}</> : <>{fallback}</>;
}

/**
 * Only renders children if the user's email is verified
 */
export function VerifiedGuard({ children, fallback = null }: GuardProps) {
    const { isVerified } = useAuth();
    return isVerified ? <>{children}</> : <>{fallback}</>;
}

/**
 * Only renders children if the user's email is NOT verified
 */
export function UnverifiedGuard({ children, fallback = null }: GuardProps) {
    const { isVerified } = useAuth();
    return !isVerified ? <>{children}</> : <>{fallback}</>;
}