'use client';

import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, CalendarDays, CheckCircle2, CreditCard, Landmark, Mail, Save, Users, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { BankAccount } from '@/components/Banks/types';
import type { Beneficiary } from '@/components/Beneficiaries/types';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type TransferFormData = {
  bankAccountId: string;
  beneficiaryId: string;
  amount: string;
  currency: string;
  transferDate: string;
  referenceNumber: string;
  notes: string;
};

type TransferErrors = Partial<Record<keyof TransferFormData, string>>;

type PageProps = {
  accounts?: BankAccount[];
  beneficiaries?: Beneficiary[];
  balanceInfo?: { balance: number; currency: string; sufficient: boolean } | null;
  flash?: { success?: string; error?: string };
};

const INITIAL_FORM_DATA: TransferFormData = {
  bankAccountId: '',
  beneficiaryId: '',
  amount: '',
  currency: '',
  transferDate: '',
  referenceNumber: '',
  notes: '',
};

function validate(form: TransferFormData, t: (en: string, ar: string) => string): TransferErrors {
  const errors: TransferErrors = {};

  if (!form.bankAccountId) errors.bankAccountId = t('Select a bank account.', 'اختر حسابًا بنكيًا.');
  if (!form.beneficiaryId) errors.beneficiaryId = t('Select a beneficiary.', 'اختر مستفيدًا.');

  const amount = Number(form.amount);
  if (!form.amount || Number.isNaN(amount) || amount <= 0) errors.amount = t('Enter a valid amount.', 'أدخل مبلغًا صحيحًا.');

  if (!form.currency) errors.currency = t('Select currency.', 'اختر العملة.');
  if (!form.transferDate) errors.transferDate = t('Select transfer date.', 'اختر تاريخ التحويل.');
  if (!form.referenceNumber.trim()) errors.referenceNumber = t('Reference number is required.', 'رقم المرجع مطلوب.');

  return errors;
}

function formatMoney(amount: number, currency: string, isRtl: boolean): string {
  try {
    return new Intl.NumberFormat(isRtl ? 'ar' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function CreateTransfer() {
  const page = usePage();
  const { accounts = [], beneficiaries = [], balanceInfo: balanceInfoProp = null, flash } = page.props as unknown as PageProps;

  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('Transfers', 'التحويلات'), href: '/transfers' },
    { title: t('Add Transfer', 'إضافة تحويل'), href: '/transfers/create' },
  ];

  const [balanceInfo, setBalanceInfo] = useState<{ balance: number; currency: string; sufficient: boolean } | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(() => {
    if (flash?.success) return { type: 'success', message: flash.success };
    if (flash?.error) return { type: 'error', message: flash.error };
    return null;
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const form = useForm<TransferFormData>({ ...INITIAL_FORM_DATA });
  const errors = form.errors as TransferErrors;
  const submitting = form.processing;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setBalanceInfo(balanceInfoProp);
  }, [balanceInfoProp]);

  const selectedAccount = useMemo(() => accounts.find((a) => a.id === form.data.bankAccountId) ?? null, [accounts, form.data.bankAccountId]);
  const selectedBeneficiary = useMemo(() => beneficiaries.find((b) => b.id === form.data.beneficiaryId) ?? null, [beneficiaries, form.data.beneficiaryId]);

  function scheduleBalanceCheck(nextAmount: string, nextBankAccountId: string) {
    const amount = Number(nextAmount);
    if (!nextBankAccountId || !Number.isFinite(amount) || amount <= 0) {
      setBalanceInfo(null);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      router.get(
        '/transfers/create',
        { bankAccountId: nextBankAccountId, amount: nextAmount },
        { preserveState: true, preserveScroll: true, replace: true, only: ['balanceInfo'] },
      );
    }, 350);
  }

  const localSufficient = useMemo(() => {
    if (!selectedAccount) return true;
    const amount = Number(form.data.amount);
    if (!Number.isFinite(amount) || amount <= 0) return true;
    if (selectedAccount.balance == null) return true;
    return Number(selectedAccount.balance) >= amount;
  }, [form.data.amount, selectedAccount]);

  const sufficient = balanceInfo ? balanceInfo.sufficient : localSufficient;

  function set<K extends keyof TransferFormData>(key: K, value: TransferFormData[K]) {
    if (key === 'bankAccountId') {
      const nextId = String(value);
      const nextAccount = accounts.find((a) => a.id === nextId) ?? null;
      const nextCurrency = nextAccount ? nextAccount.currency : form.data.currency;

      setBalanceInfo(null);
      form.setData((prev) => ({ ...prev, bankAccountId: nextId, currency: nextCurrency }));
      scheduleBalanceCheck(form.data.amount, nextId);
    } else if (key === 'amount') {
      const nextAmount = String(value);
      form.setData((prev) => ({ ...prev, amount: nextAmount }));
      scheduleBalanceCheck(nextAmount, form.data.bankAccountId);
    } else {
      form.setData(key, value as any);
    }
    form.clearErrors(key);
  }

  function submit() {
    const newErrors = validate(form.data, t);
    if (!sufficient) newErrors.amount = t('Insufficient balance for this transfer.', 'الرصيد غير كافٍ لهذا التحويل.');

    if (Object.keys(newErrors).length > 0) {
      form.setError(newErrors);
      return;
    }

    form.post('/transfers', {
      onError: () => {
        setNotification({ type: 'error', message: t('Please fix the highlighted fields.', 'يرجى تصحيح الحقول المطلوبة.') });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Add Transfer', 'إضافة تحويل')} />

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
            <button type="button" onClick={() => setNotification(null)} className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100" aria-label={t('Dismiss', 'إغلاق')}>
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
                  <h1 className="text-2xl font-bold tracking-tight">{t('Create Transfer', 'إنشاء تحويل')}</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t(
                      'Initiate a transfer request from a registered bank account to a beneficiary.',
                      'إنشاء طلب تحويل من حساب بنكي مسجل إلى مستفيد.',
                    )}
                  </p>
                </div>
              </div>

              <Link href="/transfers">
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
                  <h2 className="text-base font-semibold">{t('Transfer details', 'تفاصيل التحويل')}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('All fields marked are required for processing.', 'جميع الحقول مطلوبة للمعالجة.')}
                  </p>
                </div>

                <div className="space-y-6 px-6 py-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Landmark className="size-3.5" aria-hidden="true" />
                        {t('Source account', 'الحساب المصدر')}
                      </Label>
                      <Select value={form.data.bankAccountId} onValueChange={(v) => set('bankAccountId', v)}>
                        <SelectTrigger className={cn('h-10 bg-background/60', errors.bankAccountId && 'border-destructive')}>
                          <SelectValue placeholder={t('Select bank account', 'اختر الحساب البنكي')} />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {(a.bankName ? `${a.bankName} · ` : '') + (a.iban ? a.iban.slice(0, 6) + '••••' + a.iban.slice(-4) : a.id)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.bankAccountId && <p className="text-xs font-medium text-destructive">{errors.bankAccountId}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Users className="size-3.5" aria-hidden="true" />
                        {t('Beneficiary', 'المستفيد')}
                      </Label>
                      <Select value={form.data.beneficiaryId} onValueChange={(v) => set('beneficiaryId', v)}>
                        <SelectTrigger className={cn('h-10 bg-background/60', errors.beneficiaryId && 'border-destructive')}>
                          <SelectValue placeholder={t('Select beneficiary', 'اختر المستفيد')} />
                        </SelectTrigger>
                        <SelectContent>
                          {beneficiaries.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {(b.nameAr || b.nameEn) + (b.bankName ? ` · ${b.bankName}` : '')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.beneficiaryId && <p className="text-xs font-medium text-destructive">{errors.beneficiaryId}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2 md:col-span-1">
                      <Label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <CreditCard className="size-3.5" aria-hidden="true" />
                        {t('Amount', 'المبلغ')}
                      </Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        min="0.01"
                        step="0.01"
                        value={form.data.amount}
                        onChange={(e) => set('amount', e.target.value)}
                        placeholder={t('0.00', '0.00')}
                        className={cn('h-10 bg-background/60', errors.amount && 'border-destructive')}
                      />
                      {errors.amount && <p className="text-xs font-medium text-destructive">{errors.amount}</p>}
                      {selectedAccount && (
                        <p className={cn('text-xs', sufficient ? 'text-muted-foreground' : 'text-destructive')}>
                          {t('Available balance', 'الرصيد المتاح')}{': '}
                          {formatMoney(Number(selectedAccount.balance ?? 0), selectedAccount.currency, isRtl)}
                        </p>
                      )}
                      {balanceInfo && selectedAccount && (
                        <p className={cn('text-xs', balanceInfo.sufficient ? 'text-muted-foreground' : 'text-destructive')}>
                          {t('Live check', 'فحص مباشر')}{': '}
                          {formatMoney(balanceInfo.balance, balanceInfo.currency, isRtl)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-1">
                      <Label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Mail className="size-3.5" aria-hidden="true" />
                        {t('Currency', 'العملة')}
                      </Label>
                      <Input
                        value={form.data.currency}
                        onChange={(e) => set('currency', e.target.value.toUpperCase())}
                        placeholder={t('SAR', 'SAR')}
                        className={cn('h-10 bg-background/60', errors.currency && 'border-destructive')}
                      />
                      {errors.currency && <p className="text-xs font-medium text-destructive">{errors.currency}</p>}
                      {selectedAccount && (
                        <p className="text-xs text-muted-foreground">
                          {t('Account currency', 'عملة الحساب')}{': '}
                          <span className="font-semibold text-foreground">{selectedAccount.currency}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-1">
                      <Label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {t('Transfer date', 'تاريخ التحويل')}
                      </Label>
                      <Input
                        type="date"
                        value={form.data.transferDate}
                        onChange={(e) => set('transferDate', e.target.value)}
                        className={cn('h-10 bg-background/60', errors.transferDate && 'border-destructive')}
                      />
                      {errors.transferDate && <p className="text-xs font-medium text-destructive">{errors.transferDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Reference number', 'رقم المرجع')}
                      </Label>
                      <Input
                        value={form.data.referenceNumber}
                        onChange={(e) => set('referenceNumber', e.target.value)}
                        placeholder={t('e.g. INV-2026-001', 'مثال: INV-2026-001')}
                        className={cn('h-10 bg-background/60', errors.referenceNumber && 'border-destructive')}
                      />
                      {errors.referenceNumber && <p className="text-xs font-medium text-destructive">{errors.referenceNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Notes (optional)', 'ملاحظات (اختياري)')}
                      </Label>
                      <Textarea
                        value={form.data.notes}
                        onChange={(e) => set('notes', e.target.value)}
                        placeholder={t('Add a note for the bank...', 'أضف ملاحظة للبنك...')}
                        className="min-h-10 bg-background/60"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-muted-foreground">
                      {selectedAccount?.bankEmail
                        ? t('Will be emailed to', 'سيتم الإرسال إلى') + `: ${selectedAccount.bankEmail}`
                        : t('Selected bank account must include a bank email.', 'يجب أن يحتوي الحساب البنكي المختار على بريد البنك.')}
                    </div>
                    <Button
                      type="button"
                      onClick={submit}
                      disabled={submitting || accounts.length === 0 || beneficiaries.length === 0}
                      className="gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                    >
                      <Save className="size-4" aria-hidden="true" />
                      {submitting ? t('Submitting...', 'جارٍ الإرسال...') : t('Create transfer', 'إنشاء التحويل')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold">{t('Preview', 'معاينة')}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('A finalized SVG/PDF preview is available after submission.', 'تتوفر معاينة SVG/PDF النهائية بعد الإرسال.')}
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    { label: t('From', 'من'), value: selectedAccount?.bankName || '—', icon: Landmark },
                    { label: t('To', 'إلى'), value: selectedBeneficiary?.nameAr || selectedBeneficiary?.nameEn || '—', icon: Users },
                    { label: t('Amount', 'المبلغ'), value: form.data.amount && form.data.currency ? `${form.data.amount} ${form.data.currency}` : '—', icon: CreditCard },
                    { label: t('Date', 'التاريخ'), value: form.data.transferDate || '—', icon: CalendarDays },
                    { label: t('Reference', 'المرجع'), value: form.data.referenceNumber || '—', icon: Mail },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-3 py-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {(accounts.length === 0 || beneficiaries.length === 0) && (
                  <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                    {accounts.length === 0 && (
                      <p>
                        {t('No active bank accounts found.', 'لا توجد حسابات بنكية نشطة.')} <Link className="text-primary hover:underline" href="/bank-accounts/create">{t('Add one', 'أضف حسابًا')}</Link>.
                      </p>
                    )}
                    {beneficiaries.length === 0 && (
                      <p className={cn(accounts.length === 0 && 'mt-2')}>
                        {t('No beneficiaries found.', 'لا يوجد مستفيدون.')} <Link className="text-primary hover:underline" href="/beneficiaries/create">{t('Add one', 'أضف مستفيدًا')}</Link>.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
