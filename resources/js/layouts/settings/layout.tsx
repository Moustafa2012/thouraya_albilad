import { Link } from '@inertiajs/react';
import {
    User,
    KeyRound,
    ShieldCheck,
    Palette,
    UserCog,
    Mail,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/Use auth';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';

/* ── Nav items factory (with translations + icons) ─────────────── */
const getSettingsNavItems = (
    t: (en: string, ar: string) => string,
    canManageUsers: boolean,
    canManageSmtp: boolean,
): (NavItem & { icon: React.ElementType })[] => [
    {
        title: t('Profile', 'الملف الشخصي'),
        href: edit().url,
        icon: User,
    },
    {
        title: t('Password', 'كلمة المرور'),
        href: editPassword().url,
        icon: KeyRound,
    },
    {
        title: t('Two-Factor Auth', 'المصادقة الثنائية'),
        href: show().url,
        icon: ShieldCheck,
    },
    {
        title: t('Appearance', 'المظهر'),
        href: editAppearance().url,
        icon: Palette,
    },
    ...(canManageUsers
        ? [
              {
                  title: t('Users & Roles', 'إدارة المستخدمين'),
                  href: '/settings/users',
                  icon: UserCog,
              },
          ]
        : []),
    ...(canManageSmtp
        ? [
              {
                  title: t('SMTP Email', 'إعدادات SMTP'),
                  href: '/settings/smtp',
                  icon: Mail,
              },
          ]
        : []),
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();
    const { t }            = useLanguage();
    const { can }          = useAuth();

    /* SSR guard */
    if (typeof window === 'undefined') return null;

    const navItems = getSettingsNavItems(t, can('manage:users'), can('settings:advanced'));

    return (
        <div className="animate-fade-in px-4 py-6 sm:px-6 lg:px-8">
            <Heading
                title={t('Settings', 'الإعدادات')}
                description={t(
                    'Manage your profile and account settings',
                    'إدارة ملفك الشخصي وإعدادات حسابك',
                )}
            />

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
                {/* ── Sidebar nav ─────────────────────────── */}
                <aside className="w-full shrink-0 lg:w-52">
                    <nav
                        className="flex flex-row gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0"
                        aria-label={t('Settings navigation', 'تنقل الإعدادات')}
                    >
                        {navItems.map((item, index) => {
                            const isActive = isCurrentUrl(item.href);
                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'h-9 shrink-0 justify-start gap-2.5 rounded-lg px-3 text-sm transition-all duration-200',
                                        'lg:w-full',
                                        isActive
                                            ? 'bg-primary/10 font-medium text-primary hover:bg-primary/15'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                    )}
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2.5"
                                    >
                                        <item.icon
                                            className={cn(
                                                'h-4 w-4 shrink-0 transition-colors duration-200',
                                                isActive
                                                    ? 'text-primary'
                                                    : 'text-muted-foreground',
                                            )}
                                        />
                                        <span className="whitespace-nowrap">
                                            {item.title}
                                        </span>
                                        {/* Active indicator dot */}
                                        {isActive && (
                                            <span className="ms-auto hidden h-1.5 w-1.5 rounded-full bg-primary lg:block" />
                                        )}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                {/* ── Separator — mobile only ─────────────── */}
                <Separator className="lg:hidden" />

                {/* ── Page content ─────────────────────────── */}
                <div className="min-w-0 flex-1">
                    <section className="max-w-3xl space-y-10">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
