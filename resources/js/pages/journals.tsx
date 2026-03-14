import { Head } from '@inertiajs/react';
import { useLanguage } from '@/components/language-provider';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function Journals() {
    const { t } = useLanguage();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('journals.title', 'الجورنال'),
            href: '/journals',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('journals.title', 'الجورنال')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                <h1 className="text-xl font-semibold">{t('journals.title', 'الجورنال')}</h1>
            </div>
        </AppLayout>
    );
}
