'use client';

import { Bell, FileText, Settings2, ShieldCheck, Star, Zap } from 'lucide-react';
import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { CommonStepProps } from '../types';

function ToggleCard({ id, icon: Icon, title, description, checked, onCheckedChange, highlight }: {
  id: string; icon: React.ElementType; title: string; description: string;
  checked: boolean; onCheckedChange: (v: boolean) => void; highlight?: boolean;
}) {
  return (
    <div className={cn(
      'flex items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-200 backdrop-blur-sm',
      checked && highlight ? 'border-primary/25 bg-primary/[0.07] shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]'
        : checked ? 'border-border/60 bg-muted/30'
        : 'border-border/40 bg-card/40',
    )}>
      <div className="flex items-start gap-3">
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors', checked && highlight ? 'bg-primary/15 text-primary' : checked ? 'bg-muted text-muted-foreground' : 'bg-muted/60 text-muted-foreground/60')} aria-hidden="true">
          <Icon className="size-4" />
        </span>
        <div>
          <p id={`${id}-title`} className="font-medium text-foreground">{title}</p>
          <p id={`${id}-desc`} className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} />
    </div>
  );
}

export function StepSettings({ formData, errors, isRtl, t, set }: CommonStepProps) {
  const uid = useId();
  const notesLength = formData.notes.length;
  const notesApproaching = notesLength > 450;
  const notesAtLimit = notesLength >= 500;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
          <Settings2 className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Account Settings', 'إعدادات الحساب')}</h2>
          <p className="text-sm text-muted-foreground">{t('Configure preferences and additional notes.', 'ضبط التفضيلات والملاحظات الإضافية.')}</p>
        </div>
      </div>

      <div className="space-y-2.5" role="group" aria-label={t('Account preferences', 'تفضيلات الحساب')}>
        <ToggleCard id={`${uid}-default`} icon={Star} title={t('Default Account', 'الحساب الافتراضي')} description={t('Use this account as default for all new transactions.', 'استخدم هذا الحساب افتراضيًا لجميع العمليات الجديدة.')} checked={formData.isDefault} onCheckedChange={(v) => set('isDefault', v)} highlight />
        <ToggleCard id={`${uid}-active`} icon={Zap} title={t('Active', 'نشط')} description={t('Enable this account for use in transfers and payouts.', 'تفعيل هذا الحساب للاستخدام في التحويلات والمدفوعات.')} checked={formData.isActive} onCheckedChange={(v) => set('isActive', v)} />
        <ToggleCard id={`${uid}-low-balance`} icon={Bell} title={t('Low Balance Alerts', 'تنبيهات انخفاض الرصيد')} description={t('Receive alerts when balance falls below a threshold.', 'استقبال تنبيهات عند انخفاض الرصيد عن حد معين.')} checked={formData.lowBalanceAlerts} onCheckedChange={(v) => set('lowBalanceAlerts', v)} />
        <ToggleCard id={`${uid}-large-tx`} icon={Bell} title={t('Large Transaction Alerts', 'تنبيهات العمليات الكبيرة')} description={t('Notify you when transactions exceed a specified amount.', 'إشعارك عند تجاوز المعاملات لمبلغ محدد.')} checked={formData.largeTransactionAlerts} onCheckedChange={(v) => set('largeTransactionAlerts', v)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor={`${uid}-opening-balance`}
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t('Opening Balance', 'الرصيد الافتتاحي')}
          </Label>
          <Input
            id={`${uid}-opening-balance`}
            value={formData.openingBalance}
            onChange={(e) => set('openingBalance', e.target.value)}
            inputMode="decimal"
            placeholder={t('e.g. 750,000.00', 'مثال: 750,000.00')}
            className="h-10 bg-background/60 text-sm backdrop-blur-sm"
            aria-invalid={Boolean(errors.openingBalance)}
          />
          {errors.openingBalance && (
            <p className="text-xs text-destructive">{errors.openingBalance}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-purpose`} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="size-3.5" aria-hidden="true" />
            {t('Account Purpose', 'غرض الحساب')}
          </Label>
          <Textarea id={`${uid}-purpose`} value={formData.accountPurpose} onChange={(e) => set('accountPurpose', e.target.value)} placeholder={t('Describe the primary purpose of this account…', 'صف الغرض الأساسي من هذا الحساب…')} rows={3} className="resize-none bg-background/60 text-sm backdrop-blur-sm" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-tx-limit`} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Monthly Transaction Limit', 'حد المعاملات الشهري')}
            </Label>
            <Select value={formData.monthlyTransactionLimit} onValueChange={(v) => set('monthlyTransactionLimit', v)}>
              <SelectTrigger id={`${uid}-tx-limit`} className="h-10 bg-background/60 text-sm backdrop-blur-sm">
                <SelectValue placeholder={t('Select limit', 'اختر الحد')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50000">SAR 50,000</SelectItem>
                <SelectItem value="100000">SAR 100,000</SelectItem>
                <SelectItem value="500000">SAR 500,000</SelectItem>
                <SelectItem value="unlimited">{t('No fixed limit', 'بدون حد ثابت')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-statement`} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Statement Delivery', 'تسليم كشف الحساب')}
            </Label>
            <Select value={formData.statementFrequency} onValueChange={(v) => set('statementFrequency', v)}>
              <SelectTrigger id={`${uid}-statement`} className="h-10 bg-background/60 text-sm backdrop-blur-sm">
                <SelectValue placeholder={t('Select frequency', 'اختر التكرار')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t('Monthly statements', 'كشف حساب شهري')}</SelectItem>
                <SelectItem value="quarterly">{t('Quarterly statements', 'كشف حساب ربع سنوي')}</SelectItem>
                <SelectItem value="annually">{t('Annual statements', 'كشف حساب سنوي')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-notes`} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <FileText className="size-3.5" aria-hidden="true" />
          {t('Notes', 'ملاحظات')}
        </Label>
        <Textarea
          id={`${uid}-notes`}
          value={formData.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder={t('Any additional notes about this account…', 'أي ملاحظات إضافية حول هذا الحساب…')}
          rows={4}
          maxLength={500}
          className={cn('resize-none bg-background/60 text-sm backdrop-blur-sm', notesApproaching && !notesAtLimit && 'border-amber-500', notesAtLimit && 'border-destructive')}
          aria-describedby={`${uid}-notes-counter`}
        />
        <p id={`${uid}-notes-counter`} aria-live="polite" className={cn('text-[11px]', notesApproaching ? 'text-amber-600' : 'text-muted-foreground')}>
          {notesLength}/500 {t('characters', 'حرف')}
          {notesApproaching && ` — ${t('Approaching limit', 'تقترب من الحد الأقصى')}`}
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-primary/20 p-4 bg-primary/[0.05] backdrop-blur-sm" role="note">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-semibold text-foreground">{t('Secure & Compliant', 'آمن ومتوافق')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('Your banking details are encrypted and stored securely in compliance with ISO 27001.', 'يتم تشفير بياناتك المصرفية وتخزينها بأمان وفقًا لمعيار ISO 27001.')}
          </p>
        </div>
      </div>
    </div>
  );
}
