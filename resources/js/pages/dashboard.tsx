import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Banknote,
    BookOpen,
    Plus,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type Transfer = {
    id: string;
    transferNumber?: string;
    amount: number;
    currency: string;
    transferDate?: string | null;
    status: string;
    bankAccount?: { bankName?: string };
    beneficiary?: { nameEn?: string; nameAr?: string };
};

type PageProps = {
    stats?: {
        transfersThisMonth: number;
        totalAmountThisMonth: number;
        activeBeneficiaries: number;
        bankAccounts: number;
    };
    latestTransfers?: { data: Transfer[] };
    transfersByCurrency?: Array< { currency: string; count: number; total: number } >;
    volumeOverTime?: Array< { date: string; count: number; total: number } >;
};

function formatMoney(amount: number, currency: string, isRtl: boolean): string {
    try {
        return new Intl.NumberFormat(isRtl ? 'ar' : 'en-US', {
            style: 'currency',
            currency: currency || 'SAR',
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${Number(amount).toFixed(2)} ${currency}`;
    }
}

function statusLabel(status: string, t: (en: string, ar: string) => string): string {
    const s = (status || '').toLowerCase();
    if (s === 'emailed') return t('Sent', 'تم الإرسال');
    if (s === 'email_failed') return t('Failed', 'فشل');
    return t('Submitted', 'مرسل');
}

export default function Dashboard({
    stats = {
        transfersThisMonth: 0,
        totalAmountThisMonth: 0,
        activeBeneficiaries: 0,
        bankAccounts: 0,
    },
    latestTransfers = { data: [] },
    transfersByCurrency = [],
    volumeOverTime = [],
}: PageProps) {
    const { t, direction } = useLanguage();
    const isRtl = direction === 'rtl';
    const transfers = Array.isArray(latestTransfers) ? latestTransfers : latestTransfers?.data ?? [];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Dashboard', 'لوحة التحكم'), href: '/dashboard' },
    ];

    const cards = [
        {
            title: t('Transfers this month', 'التحويلات هذا الشهر'),
            value: stats.transfersThisMonth,
            icon: ArrowLeftRight,
            href: '/transfers',
            color: 'bg-primary/10 text-primary border-primary/20',
        },
        {
            title: t('Amount this month', 'المبلغ هذا الشهر'),
            value: formatMoney(stats.totalAmountThisMonth, 'SAR', isRtl),
            icon: TrendingUp,
            href: '/transfers',
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        },
        {
            title: t('Beneficiaries', 'المستفيدون'),
            value: stats.activeBeneficiaries,
            icon: Users,
            href: '/beneficiaries',
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        },
        {
            title: t('Bank accounts', 'الحسابات البنكية'),
            value: stats.bankAccounts,
            icon: Banknote,
            href: '/bank-accounts',
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        },
    ];

    const maxCurrencyTotal = Math.max(1, ...transfersByCurrency.map((c) => c.total));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Dashboard', 'لوحة التحكم')} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t('Dashboard', 'لوحة التحكم')}</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {t('Operational overview', 'نظرة عامة على العمليات')}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" className="gap-2">
                            <Link href="/transfers/create">
                                <Plus className="size-4" />
                                {t('New transfer', 'تحويل جديد')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="gap-2">
                            <Link href="/beneficiaries/create">
                                <Users className="size-4" />
                                {t('New beneficiary', 'مستفيد جديد')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="gap-2">
                            <Link href="/journals/create">
                                <BookOpen className="size-4" />
                                {t('Journal entry', 'قيد يومية')}
                            </Link>
                        </Button>
                    </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={card.title}
                                href={card.href}
                                className={cn(
                                    'rounded-xl border p-5 transition-colors hover:bg-muted/50',
                                    card.color,
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-90">{card.title}</p>
                                        <p className="mt-2 text-2xl font-bold">{card.value}</p>
                                    </div>
                                    <span className="rounded-lg border border-current/20 bg-white/50 dark:bg-black/10 p-2">
                                        <Icon className="size-5" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {transfersByCurrency.length > 0 && (
                        <div className="rounded-xl border bg-card p-5">
                            <h2 className="text-base font-semibold">{t('Transfers by currency (this month)', 'التحويلات حسب العملة (هذا الشهر)')}</h2>
                            <div className="mt-4 space-y-3">
                                {transfersByCurrency.map((row) => (
                                    <div key={row.currency} className="flex items-center gap-3">
                                        <span className="w-12 font-medium">{row.currency}</span>
                                        <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${Math.min(100, (row.total / maxCurrencyTotal) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium tabular-nums">
                                            {formatMoney(row.total, row.currency, isRtl)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">{t('Latest transfers', 'آخر التحويلات')}</h2>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/transfers">{t('View all', 'عرض الكل')}</Link>
                            </Button>
                        </div>
                        <div className="mt-4">
                            {transfers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">{t('No transfers yet.', 'لا توجد تحويلات بعد.')}</p>
                            ) : (
                                <ul className="space-y-2">
                                    {transfers.map((tx) => (
                                        <li key={tx.id}>
                                            <Link
                                                href={`/transfers/${tx.id}`}
                                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">
                                                        {tx.transferNumber ?? `#${tx.id}`} · {(tx.beneficiary?.nameEn || tx.beneficiary?.nameAr) ?? '—'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {tx.transferDate ?? ''} · {statusLabel(tx.status, t)}
                                                    </p>
                                                </div>
                                                <span className="ml-2 shrink-0 font-semibold tabular-nums">
                                                    {formatMoney(tx.amount, tx.currency, isRtl)}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {volumeOverTime.length > 0 && (
                    <div className="rounded-xl border bg-card p-5">
                        <h2 className="text-base font-semibold">{t('Volume over time (last 14 days)', 'الحجم عبر الوقت (آخر 14 يوم)')}</h2>
                        <div className="mt-4 flex items-end gap-1 h-24">
                            {volumeOverTime.map((d) => (
                                <div
                                    key={d.date}
                                    className="flex-1 min-w-0 rounded-t bg-primary/70 hover:bg-primary"
                                    style={{
                                        height: `${Math.max(4, (d.total / (Math.max(1, ...volumeOverTime.map((x) => x.total))) * 100))}%`,
                                    }}
                                    title={`${d.date}: ${d.count} transfers, ${formatMoney(d.total, 'SAR', isRtl)}`}
                                />
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{t('By transfer date', 'حسب تاريخ التحويل')}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
