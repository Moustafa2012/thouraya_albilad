import { Link, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    Shield,
    Sparkles,
    User as UserIcon,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { ROLES } from '@/lib/Permissions';
import { login } from '@/routes';
import type { User } from '@/types';

/** Role badge configuration — extend as needed for your role system */
const ROLE_BADGE_MAP: Record<
    string,
    {
        labelEn: string;
        labelAr: string;
        icon: React.ElementType;
        className: string;
    }
> = {
    [ROLES.SUPER_ADMIN]: {
        labelEn: 'Super Admin',
        labelAr: 'مدير عام',
        icon: Shield,
        className:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    [ROLES.ADMIN]: {
        labelEn: 'Admin',
        labelAr: 'مشرف',
        icon: BadgeCheck,
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    [ROLES.MANAGER]: {
        labelEn: 'Manager',
        labelAr: 'مدير',
        icon: BadgeCheck,
        className:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    [ROLES.USER]: {
        labelEn: 'User',
        labelAr: 'مستخدم',
        icon: UserIcon,
        className: 'bg-muted text-muted-foreground',
    },
    [ROLES.VISITOR]: {
        labelEn: 'Visitor',
        labelAr: 'زائر',
        icon: Sparkles,
        className: 'bg-muted text-muted-foreground',
    },
    default: {
        labelEn: 'Visitor',
        labelAr: 'زائر',
        icon: UserIcon,
        className: 'bg-muted text-muted-foreground',
    },
};

function RoleBadge({ role }: { role?: string }) {
    const { t } = useLanguage();

    if (!role) return null;
    const config =
        ROLE_BADGE_MAP[role.toLowerCase()] ?? ROLE_BADGE_MAP['default'];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
        >
            <Icon className="size-2.5" />
            {t(config.labelEn, config.labelAr)}
        </span>
    );
}

function GuestSidebarButton() {
    const { t } = useLanguage();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    size="lg"
                    className="group border border-dashed border-border/60 hover:border-border"
                >
                    <Link href={login()}>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-muted">
                            <UserIcon className="size-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5 leading-none">
                            <span className="text-sm font-medium">
                                {t('Sign in', 'تسجيل الدخول')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {t('Access your account', 'الوصول إلى حسابك')}
                            </span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export function NavUser() {
    const { auth } = usePage().props as {
        auth?: { user?: User & { role?: string; email_verified?: boolean } };
    };
    const { state } = useSidebar();
    const { t } = useLanguage();
    const isMobile = useIsMobile();
    const user = auth?.user ?? null;

    if (!user) {
        return <GuestSidebarButton />;
    }

    const role = (user as any).role as string | undefined;
    const isEmailVerified = Boolean((user as any).email_verified_at);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={user as any} />
                            <div className="ms-auto flex items-center gap-1.5">
                                {!isEmailVerified && (
                                    <span
                                        className="h-2 w-2 rounded-full bg-amber-500"
                                        title={t(
                                            'Email not verified',
                                            'البريد الإلكتروني غير موثق',
                                        )}
                                        aria-label={t(
                                            'Email not verified',
                                            'البريد الإلكتروني غير موثق',
                                        )}
                                    />
                                )}
                                <ChevronsUpDown className="size-4 text-muted-foreground" />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        {/* User header */}
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex flex-col gap-2 p-3">
                                <div className="flex items-center gap-2">
                                    <UserInfo user={user as any} showEmail />
                                </div>
                                <div className="flex items-center gap-2">
                                    <RoleBadge role={role} />
                                    {!isEmailVerified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            <Bell className="size-2.5" />
                                            {t('Verify email', 'تحقق من البريد')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <UserMenuContent user={user as any} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
