import { Link, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Bell,
    KeyRound,
    LayoutDashboard,
    LogOut,
    Palette,
    Settings,
    Shield,
    ShieldCheck,
    SlidersHorizontal,
    User as UserIcon,
    UserCog,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { ROLES } from '@/lib/Permissions';
import { logout, dashboard } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { show as showTwoFactor } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import type { User } from '@/types';

type Props = {
    user: User & { role?: string; email_verified_at?: string | null };
};

/** Role-based menu items — extend for your permission model */
function getRoleMenuItems(
    role?: string,
    t?: (en: string, ar: string) => string,
) {
    const items: {
        href: string;
        label: string;
        icon: React.ElementType;
        'data-test'?: string;
    }[] = [];

    if (role === ROLES.SUPER_ADMIN) {
        items.push({
            href: '/admin',
            label: t ? t('Admin Panel', 'لوحة الإدارة') : 'Admin Panel',
            icon: Shield,
        });
    }

    if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) {
        items.push({
            href: '/admin/users',
            label: t ? t('Manage Users', 'إدارة المستخدمين') : 'Manage Users',
            icon: UserCog,
        });
    }

    return items;
}

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const { t } = useLanguage();
    const role = user.role;
    const isEmailVerified = Boolean(user.email_verified_at);
    const roleMenuItems = getRoleMenuItems(role, t);

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            {/* Role-specific admin items */}
            {roleMenuItems.length > 0 && (
                <>
                    <DropdownMenuGroup>
                            <DropdownMenuLabel className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {t('Administration', 'الإدارة')}
                            </DropdownMenuLabel>
                        {roleMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <DropdownMenuItem key={item.href} asChild>
                                    <Link
                                        href={item.href}
                                        className="flex cursor-pointer items-center gap-2"
                                        onClick={cleanup}
                                    >
                                        <Icon className="size-4 text-muted-foreground" />
                                        <span>{item.label}</span>
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                </>
            )}

            {/* Core navigation */}
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        href={dashboard()}
                        className="flex cursor-pointer items-center gap-2"
                        onClick={cleanup}
                    >
                        <LayoutDashboard className="size-4 text-muted-foreground" />
                        <span>{t('Dashboard', 'لوحة التحكم')}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Settings */}
            <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('Account', 'الحساب')}
                </DropdownMenuLabel>

                <DropdownMenuItem asChild>
                    <Link
                        href={editProfile()}
                        className="flex cursor-pointer items-center gap-2"
                        prefetch
                        onClick={cleanup}
                    >
                        <UserIcon className="size-4 text-muted-foreground" />
                        <span>{t('Profile', 'الملف الشخصي')}</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href={editPassword()}
                        className="flex cursor-pointer items-center gap-2"
                        prefetch
                        onClick={cleanup}
                    >
                        <KeyRound className="size-4 text-muted-foreground" />
                        <span>{t('Password', 'كلمة المرور')}</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href={showTwoFactor()}
                        className="flex cursor-pointer items-center gap-2"
                        prefetch
                        onClick={cleanup}
                    >
                            <ShieldCheck className="size-4 text-muted-foreground" />
                            <div className="flex flex-1 items-center justify-between gap-2">
                                <span>
                                    {t(
                                        'Two-Factor Auth',
                                        'المصادقة الثنائية',
                                    )}
                                </span>
                            </div>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href="/settings/appearance"
                        className="flex cursor-pointer items-center gap-2"
                        onClick={cleanup}
                    >
                        <Palette className="size-4 text-muted-foreground" />
                        <span>{t('Appearance', 'المظهر')}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Email verification notice */}
            {!isEmailVerified && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href="/email/verify"
                            className="flex cursor-pointer items-center gap-2 text-amber-600 dark:text-amber-400"
                            onClick={cleanup}
                        >
                            <Bell className="size-4" />
                            <span className="text-sm">
                                {t(
                                    'Verify email address',
                                    'تحقق من البريد الإلكتروني',
                                )}
                            </span>
                        </Link>
                    </DropdownMenuItem>
                </>
            )}

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem asChild>
                <Link
                    href={logout()}
                    as="button"
                    className="flex w-full cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="size-4" />
                    <span>{t('Log out', 'تسجيل الخروج')}</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
