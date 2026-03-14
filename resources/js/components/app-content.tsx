import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'main'> & {
    variant?: 'header' | 'sidebar' | 'full';
};

export function AppContent({ variant = 'header', className, children, ...props }: Props) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset
                className={cn('overflow-x-hidden', className)}
                {...props}
            >
                {children}
            </SidebarInset>
        );
    }

    /* 'header' and 'full' */
    return (
        <main
            className={cn(
                'flex flex-1 flex-col gap-4',
                variant === 'full'
                    ? 'w-full'
                    : 'mx-auto h-full w-full max-w-7xl rounded-xl',
                className,
            )}
            {...props}
        >
            {children}
        </main>
    );
}