import { Globe, Moon, Sun } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type AppSidebarHeaderProps = {
    breadcrumbs?: BreadcrumbItemType[];
    onSidebarToggle?: () => void;
};

export function AppSidebarHeader({
    breadcrumbs = [],
    onSidebarToggle,
}: AppSidebarHeaderProps) {
    const { language, setLanguage, t } = useLanguage();
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleLanguage = () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    };

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ms-1" onClick={onSidebarToggle} />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLanguage}
                    className="text-muted-foreground h-9 w-9 sm:h-10 sm:w-10"
                    title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                    aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                >
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">{language === 'ar' ? 'English' : 'العربية'}</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-muted-foreground h-9 w-9 sm:h-10 sm:w-10"
                    title={
                        resolvedAppearance === 'dark'
                            ? t('Switch to Light Mode', 'التبديل إلى الوضع النهاري')
                            : t('Switch to Dark Mode', 'التبديل إلى الوضع الليلي')
                    }
                    aria-label={
                        resolvedAppearance === 'dark'
                            ? t('Switch to Light Mode', 'التبديل إلى الوضع النهاري')
                            : t('Switch to Dark Mode', 'التبديل إلى الوضع الليلي')
                    }
                >
                    {resolvedAppearance === 'dark' ? (
                        <Sun className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    ) : (
                        <Moon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                        {resolvedAppearance === 'dark'
                            ? t('Light Mode', 'الوضع النهاري')
                            : t('Dark Mode', 'الوضع الليلي')}
                    </span>
                </Button>
            </div>
        </header>
    );
}
