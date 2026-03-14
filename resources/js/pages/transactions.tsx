import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useLanguage } from '@/components/language-provider';

export default function Transactions() {
    const { t } = useLanguage();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('transactions.title', 'المعاملات'),
            href: '/transactions',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('transactions.title', 'المعاملات')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                <h1 className="text-xl font-semibold">{t('transactions.title', 'المعاملات')}</h1>
            </div>
        </AppLayout>
    );
}
