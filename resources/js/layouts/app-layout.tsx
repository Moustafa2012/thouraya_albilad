import { memo } from 'react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

const AppLayout = ({ children, breadcrumbs = [], ...props }: AppLayoutProps) => {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};

AppLayout.displayName = 'AppLayout';

export default memo(AppLayout);