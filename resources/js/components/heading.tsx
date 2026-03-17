import { useLanguage } from '@/components/language-provider';

export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    const { isRTL } = useLanguage();
    
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <h2
                className={
                    variant === 'small'
                        ? `mb-0.5 text-base font-medium ${isRTL ? 'text-right' : 'text-left'}`
                        : `text-xl font-semibold tracking-tight ${isRTL ? 'text-right' : 'text-left'}`
                }
            >
                {title}
            </h2>
            {description && (
                <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{description}</p>
            )}
        </header>
    );
}
