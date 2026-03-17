import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useLanguage } from '@/components/language-provider';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const { t, isRTL } = useLanguage();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: t('Light', 'نهاري') },
        { value: 'dark', icon: Moon, label: t('Dark', 'ليلي') },
        { value: 'system', icon: Monitor, label: t('System', 'النظام') },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-sm bg-accent/50 shadow-sm p-1',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-sm px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'bg-accent/80 shadow-sm'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black',
                    )}
                >
                    <Icon className={isRTL ? 'mr-2 h-4 w-4' : 'ml-2 h-4 w-4'} />
                    <span className={isRTL ? 'mr-3 text-sm' : 'ml-3 text-sm'}>{label}</span>
                </button>
            ))}
        </div>
    );
}
