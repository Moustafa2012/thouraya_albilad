import { useLanguage } from '@/components/language-provider';
import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    collapsed?: boolean;
}

export default function AppLogo({ collapsed = false }: AppLogoProps) {
    const { t } = useLanguage();

    return (
        <div className="flex items-center gap-3 transition-all duration-300">
                <AppLogoIcon className="size-8 transition-transform duration-300 group-hover:scale-110" />  
            {/* Text Content */}
            {!collapsed && (
                <div className={`grid flex-1 text-start transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="truncate text-sm font-semibold leading-tight text-sidebar-foreground">
                        {t('Thouraya Albilad', 'ثريا البلاد ')}
                    </span>
                </div>
            )}
        </div>
    );
}