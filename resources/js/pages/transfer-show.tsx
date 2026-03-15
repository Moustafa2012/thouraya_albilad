import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeftRight, CheckCircle2, Download, Mail, RefreshCw, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type Transfer = {
  id: string;
  status: string;
  bankEmail?: string | null;
  referenceNumber: string;
  amount: number;
  currency: string;
  transferDate?: string | null;
  bankAccount?: { bankName?: string; iban?: string; currency?: string; balance?: number; bankEmail?: string | null };
  beneficiary?: { nameAr?: string; nameEn?: string; bankName?: string; iban?: string };
};

type PageProps = {
  transfer: Transfer;
  flash?: { success?: string; error?: string };
};

function statusMeta(status: string) {
  const key = (status ?? '').toString().toLowerCase();
  if (key === 'emailed') {
    return {
      className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      Icon: CheckCircle2,
    };
  }
  if (key === 'email_failed') {
    return {
      className: 'border-destructive/25 bg-destructive/10 text-destructive',
      Icon: AlertCircle,
    };
  }
  return {
    className: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Icon: Mail,
  };
}

export default function TransferShow() {
  const { t } = useLanguage();

  const { transfer, flash } = usePage().props as unknown as PageProps;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('Transfers', 'التحويلات'), href: '/transfers' },
    { title: `${t('Transfer', 'تحويل')} #${transfer.id}`, href: `/transfers/${transfer.id}` },
  ];

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(() => {
    if (flash?.success) return { type: 'success', message: flash.success };
    if (flash?.error) return { type: 'error', message: flash.error };
    return null;
  });

  const status = useMemo(() => statusMeta(transfer.status), [transfer.status]);
  const beneficiaryName = transfer.beneficiary?.nameAr || transfer.beneficiary?.nameEn || t('Beneficiary', 'المستفيد');
  const fromBank = transfer.bankAccount?.bankName || t('Bank account', 'الحساب البنكي');

  function resend() {
    router.post(`/transfers/${transfer.id}/resend`);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${t('Transfer', 'تحويل')} #${transfer.id}`} />

      <AnimatePresence>
        {notification && (
          <motion.div
            key="flash"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={cn(
              'fixed inset-x-4 top-4 z-50 mx-auto flex max-w-xl items-start gap-3 rounded-xl border px-4 py-3 shadow-lg md:inset-x-auto md:left-1/2 md:-translate-x-1/2',
              notification.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                : 'border-destructive/30 bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-200',
            )}
          >
            {notification.type === 'success'
              ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              : <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />}
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
            >
              <span className="sr-only">{t('Dismiss', 'إغلاق')}</span>
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <header className="border-b border-border/60 bg-card/70 backdrop-blur-md">
          <div className="px-6 py-4">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary" aria-hidden="true">
                  <ArrowLeftRight className="size-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {t('Transfer Request', 'طلب تحويل')} #{transfer.id}
                  </h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {beneficiaryName} · {fromBank}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <a href={`/transfers/${transfer.id}/document.pdf`}>
                  <Button variant="outline" className="gap-2 font-semibold">
                    <Download className="size-4" aria-hidden="true" />
                    {t('Download PDF', 'تحميل PDF')}
                  </Button>
                </a>
                <Button onClick={resend} className="gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                  <RefreshCw className="size-4" aria-hidden="true" />
                  {t('Send to bank', 'إرسال إلى البنك')}
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold', status.className)}>
                <status.Icon className="size-4 opacity-80" aria-hidden="true" />
                {(transfer.status ?? '').toString()}
              </span>
              {transfer.bankEmail && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Mail className="size-4 opacity-70" aria-hidden="true" />
                  {transfer.bankEmail}
                </span>
              )}
              <Link href="/transfers">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary">
                  {t('Back to transfers', 'العودة للتحويلات')}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{t('Summary', 'الملخص')}</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: t('Reference', 'المرجع'), value: transfer.referenceNumber },
                    { label: t('Date', 'التاريخ'), value: transfer.transferDate ?? '—' },
                    { label: t('Amount', 'المبلغ'), value: `${transfer.amount.toFixed(2)} ${transfer.currency}` },
                    { label: t('Status', 'الحالة'), value: (transfer.status ?? '—').toString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-muted/30 px-3 py-2.5">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="truncate text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold">{t('Transfer Request Document', 'مستند طلب التحويل')}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t('Preview generated SVG document', 'معاينة المستند بصيغة SVG')}
                    </p>
                  </div>
                  <a href={`/transfers/${transfer.id}/document.svg`} className="text-xs font-semibold text-primary hover:underline">
                    {t('Open SVG', 'فتح SVG')}
                  </a>
                </div>

                <div className="bg-muted/20 p-4">
                  <div className="overflow-hidden rounded-xl bg-background shadow-sm ring-1 ring-border">
                    <object
                      data={`/transfers/${transfer.id}/document.svg`}
                      type="image/svg+xml"
                      className="h-[520px] w-full"
                    >
                      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                        <AlertCircle className="mb-3 size-6 text-muted-foreground" aria-hidden="true" />
                        <p className="text-sm font-semibold">{t('Failed to load preview', 'تعذر تحميل المعاينة')}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t('Try downloading the PDF instead.', 'جرّب تحميل ملف PDF بدلاً من ذلك.')}
                        </p>
                      </div>
                    </object>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
