'use client';

import type { RequestPayload } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CalendarDays, CheckCircle2, FileText, Save, Tag, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type JournalFormData = {
  date: string;
  description: string;
  reference: string;
  type: 'general' | 'transfer' | 'fee' | 'adjustment';
  status: 'posted' | 'pending' | 'reversed';
  amount: string;
  currency: 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED';
  notes: string;
};

type JournalErrors = Partial<Record<keyof JournalFormData, string>>;

type PageProps = {
  flash?: { success?: string; error?: string };
};

const INITIAL_FORM: JournalFormData = {
  date: '',
  description: '',
  reference: '',
  type: 'general',
  status: 'posted',
  amount: '',
  currency: 'SAR',
  notes: '',
};

const TYPE_OPTIONS: Array<{ value: JournalFormData['type']; en: string; ar: string }> = [
  { value: 'general', en: 'General', ar: 'عام' },
  { value: 'transfer', en: 'Transfer', ar: 'تحويل' },
  { value: 'fee', en: 'Fee', ar: 'رسوم' },
  { value: 'adjustment', en: 'Adjustment', ar: 'تسوية' },
];

const STATUS_OPTIONS: Array<{ value: JournalFormData['status']; en: string; ar: string }> = [
  { value: 'posted', en: 'Posted', ar: 'مُرحلة' },
  { value: 'pending', en: 'Pending', ar: 'قيد المعالجة' },
  { value: 'reversed', en: 'Reversed', ar: 'مُرجعة' },
];

const CURRENCY_OPTIONS: Array<{ value: JournalFormData['currency']; en: string }> = [
  { value: 'SAR', en: 'SAR' },
  { value: 'USD', en: 'USD' },
  { value: 'EUR', en: 'EUR' },
  { value: 'GBP', en: 'GBP' },
  { value: 'AED', en: 'AED' },
];

function validate(form: JournalFormData, t: (en: string, ar: string) => string): JournalErrors {
  const errors: JournalErrors = {};

  if (!form.date) errors.date = t('Select entry date.', 'اختر تاريخ القيد.');
  if (!form.description.trim()) errors.description = t('Description is required.', 'الوصف مطلوب.');
  if (!form.amount || Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
    errors.amount = t('Enter a valid amount.', 'أدخل مبلغًا صحيحًا.');
  }

  return errors;
}

export default function CreateJournal() {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const { flash } = usePage().props as unknown as PageProps;
  const uid = useId();
  const dateId = `${uid}-date`;
  const descriptionId = `${uid}-description`;
  const referenceId = `${uid}-reference`;
  const amountId = `${uid}-amount`;
  const notesId = `${uid}-notes`;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('Journals', 'القيود المختلفة'), href: '/journals' },
    { title: t('Add entry', 'إضافة قيد'), href: '/journals/create' },
  ];

  const [form, setForm] = useState<JournalFormData>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<JournalErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(() => {
    if (flash?.success) return { type: 'success', message: flash.success };
    if (flash?.error) return { type: 'error', message: flash.error };
    return null;
  });

  const amountPreview = useMemo(() => {
    const value = Number(form.amount);
    if (!Number.isFinite(value) || value <= 0) return '—';
    try {
      return new Intl.NumberFormat(isRtl ? 'ar' : 'en-US', {
        style: 'currency',
        currency: form.currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${form.currency}`;
    }
  }, [form.amount, form.currency, isRtl]);

  function set<K extends keyof JournalFormData>(key: K, value: JournalFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function submit() {
    const newErrors = validate(form, t);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    const payload: RequestPayload = {
      date: form.date,
      description: form.description,
      reference: form.reference || null,
      type: form.type,
      status: form.status,
      amount: form.amount,
      currency: form.currency,
      notes: form.notes || null,
    };

    router.post('/journals', payload, {
      onError: (serverErrors) => {
        const mapped: JournalErrors = {};
        for (const [key, value] of Object.entries(serverErrors)) {
          mapped[key as keyof JournalFormData] = Array.isArray(value) ? value[0] : String(value);
        }
        setErrors(mapped);
        setNotification({ type: 'error', message: t('Please fix the highlighted fields.', 'يرجى تصحيح الحقول المطلوبة.') });
      },
      onFinish: () => {
        setSubmitting(false);
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Add entry', 'إضافة قيد')} />

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
              : <X className="mt-0.5 size-5 shrink-0 text-destructive" />}
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
              aria-label={t('Dismiss', 'إغلاق')}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <header className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary" aria-hidden="true">
                  <BookOpen className="size-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{t('Add journal entry', 'إضافة قيد')}</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t(
                      'Create a structured entry with reference, type, and posting status.',
                      'أنشئ قيدًا منظمًا مع مرجع ونوع وحالة ترحيل.',
                    )}
                  </p>
                </div>
              </div>

              <Link href="/journals">
                <Button variant="outline" className="shrink-0 font-semibold">
                  {t('Back', 'رجوع')}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-2xl border border-border bg-card">
                <div className="border-b border-border px-6 py-5">
                  <h2 className="text-base font-semibold">{t('Entry details', 'تفاصيل القيد')}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('Required fields are validated before submission.', 'يتم التحقق من الحقول المطلوبة قبل الإرسال.')}
                  </p>
                </div>

                <div className="space-y-6 px-6 py-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={dateId} className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {t('Date', 'التاريخ')}
                      </Label>
                      <Input
                        id={dateId}
                        type="date"
                        value={form.date}
                        onChange={(e) => set('date', e.target.value)}
                        className={cn('h-10 bg-background/60', errors.date && 'border-destructive')}
                      />
                      {errors.date && <p className="text-xs font-medium text-destructive">{errors.date}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Tag className="size-3.5" aria-hidden="true" />
                        {t('Type', 'النوع')}
                      </Label>
                      <Select value={form.type} onValueChange={(v) => set('type', v as JournalFormData['type'])}>
                        <SelectTrigger className="h-10 bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {isRtl ? opt.ar : opt.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={descriptionId} className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <FileText className="size-3.5" aria-hidden="true" />
                      {t('Description', 'الوصف')}
                    </Label>
                    <Input
                      id={descriptionId}
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder={t('e.g. Office supplies', 'مثال: مستلزمات مكتبية')}
                      className={cn('h-10 bg-background/60', errors.description && 'border-destructive')}
                    />
                    {errors.description && <p className="text-xs font-medium text-destructive">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={referenceId} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Reference (optional)', 'المرجع (اختياري)')}
                      </Label>
                      <Input
                        id={referenceId}
                        value={form.reference}
                        onChange={(e) => set('reference', e.target.value)}
                        placeholder={t('e.g. INV-2026-001', 'مثال: INV-2026-001')}
                        className="h-10 bg-background/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Status', 'الحالة')}
                      </Label>
                      <Select value={form.status} onValueChange={(v) => set('status', v as JournalFormData['status'])}>
                        <SelectTrigger className="h-10 bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {isRtl ? opt.ar : opt.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={amountId} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Amount', 'المبلغ')}
                      </Label>
                      <Input
                        id={amountId}
                        type="number"
                        inputMode="decimal"
                        min="0.01"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) => set('amount', e.target.value)}
                        placeholder={t('0.00', '0.00')}
                        className={cn('h-10 bg-background/60', errors.amount && 'border-destructive')}
                      />
                      {errors.amount && <p className="text-xs font-medium text-destructive">{errors.amount}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Currency', 'العملة')}
                      </Label>
                      <Select value={form.currency} onValueChange={(v) => set('currency', v as JournalFormData['currency'])}>
                        <SelectTrigger className="h-10 bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={notesId} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('Notes (optional)', 'ملاحظات (اختياري)')}
                    </Label>
                    <Textarea
                      id={notesId}
                      value={form.notes}
                      onChange={(e) => set('notes', e.target.value)}
                      placeholder={t('Add any additional context...', 'أضف أي سياق إضافي...')}
                      className="bg-background/60"
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-muted-foreground">
                      {t('Preview', 'المعاينة')}{': '}
                      <span className="font-semibold text-foreground">{amountPreview}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                    >
                      <Save className="size-4" aria-hidden="true" />
                      {submitting ? t('Submitting...', 'جارٍ الإرسال...') : t('Create entry', 'إنشاء القيد')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">{t('What happens next?', 'ماذا يحدث بعد ذلك؟')}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(
                    'The entry will be saved and appear in the journals list.',
                    'سيتم حفظ القيد وسيظهر في قائمة القيود.',
                  )}
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    { label: t('Type', 'النوع'), value: form.type },
                    { label: t('Status', 'الحالة'), value: form.status },
                    { label: t('Currency', 'العملة'), value: form.currency },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-border bg-muted/20 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
