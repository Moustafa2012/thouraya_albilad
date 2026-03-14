import { Head } from '@inertiajs/react';
import { useLanguage } from '@/components/language-provider';
import { Azan } from '@/components/ui/Azan';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

export default function Dashboard() {
    const { t } = useLanguage();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.title', 'لوحة التحكم'),
            href: dashboard().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title', 'لوحة التحكم')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Azan variant="glass" />
            </div>
        </AppLayout>
    );
}
