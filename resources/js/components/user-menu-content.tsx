import { Link, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    LogOut,
    Settings,
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
import { logout } from '@/routes';
import type { User } from '@/types';

type Props = {
    user: User & { role?: string; email_verified_at?: string | null };
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const { t } = useLanguage();
    const role = user.role;

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            {/* Dashboard link — only for SUPER_ADMIN, ADMIN, MANAGER */}
            {(role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN || role === ROLES.MANAGER) && (
                <>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/dashboard"
                            className="flex cursor-pointer items-center gap-2"
                            onClick={cleanup}
                        >
                            <LayoutDashboard className="size-4 text-muted-foreground" />
                            <span>{t('Dashboard', 'لوحة التحكم')}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </>
            )}

            {/* Settings button for all logged-in users */}
            <DropdownMenuItem asChild>
                <Link
                    href="/settings/profile"
                    className="flex cursor-pointer items-center gap-2"
                    onClick={cleanup}
                >
                    <Settings className="size-4 text-muted-foreground" />
                    <span>{t('Settings', 'الإعدادات')}</span>
                </Link>
            </DropdownMenuItem>

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
