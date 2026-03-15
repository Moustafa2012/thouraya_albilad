import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Banknote,
    BookOpen,
    CreditCard,
    ArrowLeftRight,
    FileClock,
    LayoutGrid,
    Users,
    ChevronDown,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

interface NavSection {
    label: string;
    items: NavItem[];
}

const getNavSections = (t: (en: string, ar: string) => string): NavSection[] => [
    {
        label: t('Overview', 'نظرة عامة'),
        items: [
            {
                title: t('Dashboard', 'لوحة التحكم'),
                href: dashboard().url,
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: t('Financial', 'المالية'),
        items: [
            {
                title: t('Transfers', 'التحويلات'),
                href: '/transfers',
                icon: ArrowLeftRight,
            },
            {
                title: t('Bank Accounts', 'الحسابات البنكية'),
                href: '/bank-accounts',
                icon: Banknote,
            },
            {
                title: t('Various Journals entries ', 'القيود المختلفة'),
                href: '/journals',
                icon: BookOpen,
            },
        ],
    },
    {
        label: t('Management', 'الإدارة'),
        items: [
            {
                title: t('Beneficiaries', 'المستفيدون'),
                href: '/beneficiaries',
                icon: Users,
            },
        ],
    },
    {
        label: t('System', 'النظام'),
        items: [
            {
                title: t('Audit Logs', 'سجلات التدقيق'),
                href: '/audit-logs',
                icon: FileClock,
            },
        ],
    },
];

// Fallback for non-sectioned navigation
const getMainNavItems = (t: (en: string, ar: string) => string): NavItem[] => [
    {
        title: t('Dashboard', 'لوحة التحكم'),
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: t('Transfers', 'التحويلات'),
        href: '/transfers',
        icon: ArrowLeftRight,
    },
    {
        title: t('Beneficiaries', 'المستفيدون'),
        href: '/beneficiaries',
        icon: Users,
    },
    {
        title: t('Bank Accounts', 'الحسابات البنكية'),
        href: '/bank-accounts',
        icon: Banknote,
    },
    {
        title: t('Various Journals entries ', 'القيود المختلفة'),
        href: '/journals',
        icon: BookOpen,
    },
    {
        title: t('Audit Logs', 'سجلات التدقيق'),
        href: '/audit-logs',
        icon: FileClock,
    },
];

interface AppSidebarProps {
    useSections?: boolean;
    collapsed?: boolean;
    onToggle?: () => void;
    className?: string;
}

export function AppSidebar({ useSections = false, className }: AppSidebarProps) {
    const { t, direction } = useLanguage();
    const { url } = usePage();

    const mainNavItems = getMainNavItems(t);
    const navSections = getNavSections(t);

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            side={direction === 'rtl' ? 'right' : 'left'}
            className={className}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={dashboard().url}
                                prefetch
                                className="group"
                            >
                                <AppLogo />
                                <span className="sr-only">
                                    {t('Go to Dashboard', 'الذهاب إلى لوحة التحكم')}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {useSections ? (
                    // Sectioned navigation with groups
                    navSections.map((section) => (
                        <SidebarGroup key={section.label}>
                            <SidebarGroupLabel>
                                {section.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <NavMain items={section.items} />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                ) : (
                    // Standard flat navigation
                    <NavMain items={mainNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
