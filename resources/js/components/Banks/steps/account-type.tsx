'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, LayoutGrid } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CATEGORIES, ESTABLISHMENT_TYPES, BUSINESS_ACTIVITY_SECTORS } from '../BankAccountData';
import type { AccountCategory, CommonStepProps } from '../types';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function StepAccountType({ formData, errors, isRtl, t, set }: CommonStepProps) {
  function handleCategorySelect(value: AccountCategory) {
    set('accountCategory', value);
    if (value !== 'business') {
      set('establishmentType', '');
      set('businessSector', '');
      set('businessActivity', '');
    }
    set('accountType', '');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
          <LayoutGrid className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold" id="step-category-heading">{t('Select Account Type', 'اختر نوع الحساب')}</h2>
          <p className="text-sm text-muted-foreground">{t('Choose the category that best fits your account purpose.', 'اختر الفئة الأنسب لطبيعة حسابك.')}</p>
        </div>
      </div>

      <div role="radiogroup" aria-labelledby="step-category-heading" aria-required="true" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = formData.accountCategory === cat.value;
          return (
            <motion.button
              key={cat.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleCategorySelect(cat.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCategorySelect(cat.value); } }}
              className={cn(
                'group relative flex w-full items-start gap-4 rounded-2xl border p-5 text-start backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected ? cat.activeClass : 'border-border/60 bg-card/60 hover:border-border hover:bg-card/90',
              )}
            >
              <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200', isSelected ? cat.iconClass : 'border-border bg-muted/60 text-muted-foreground')} aria-hidden="true">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{isRtl ? cat.labelAr : cat.labelEn}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{isRtl ? cat.descriptionAr : cat.descriptionEn}</p>
              </div>
              <AnimatePresence>
                {isSelected && (
                  <motion.span key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground" aria-hidden="true">
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {errors.accountCategory && (
          <motion.p key="cat-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {errors.accountCategory}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formData.accountCategory === 'business' && (
          <motion.div key="biz-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="space-y-4 rounded-2xl border border-border/50 p-5 backdrop-blur-sm bg-muted/30">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t('Business Classification', 'تصنيف النشاط التجاري')}
              </p>

              <div className="space-y-1.5">
                <label htmlFor="est-type" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('Establishment Type', 'نوع المنشأة')}
                  <span className="text-destructive" aria-label={t('required', 'مطلوب')}>*</span>
                </label>
                <Select value={formData.establishmentType} onValueChange={(v) => set('establishmentType', v)}>
                  <SelectTrigger id="est-type" className={cn('h-10 bg-background/60 text-sm backdrop-blur-sm', errors.establishmentType && 'border-destructive')} aria-invalid={!!errors.establishmentType} aria-describedby={errors.establishmentType ? 'est-type-error' : undefined}>
                    <SelectValue placeholder={t('Select establishment type', 'اختر نوع المنشأة')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTABLISHMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{isRtl ? type.labelAr : type.labelEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id="est-type-error" message={errors.establishmentType} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="biz-sector" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('Business Sector', 'القطاع التجاري')}
                  <span className="text-destructive" aria-label={t('required', 'مطلوب')}>*</span>
                </label>
                <Select value={formData.businessSector} onValueChange={(v) => set('businessSector', v)}>
                  <SelectTrigger id="biz-sector" className={cn('h-10 bg-background/60 text-sm backdrop-blur-sm', errors.businessSector && 'border-destructive')} aria-invalid={!!errors.businessSector} aria-describedby={errors.businessSector ? 'biz-sector-error' : undefined}>
                    <SelectValue placeholder={t('Select business sector', 'اختر القطاع التجاري')} />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_ACTIVITY_SECTORS.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>{isRtl ? sector.labelAr : sector.labelEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id="biz-sector-error" message={errors.businessSector} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="biz-activity" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('Business Activity Description', 'وصف نشاط العمل')}
                </label>
                <input
                  id="biz-activity"
                  type="text"
                  value={formData.businessActivity}
                  onChange={(e) => set('businessActivity', e.target.value)}
                  placeholder={t('Describe main business activity', 'صف النشاط الرئيسي للمنشأة')}
                  className={cn('h-10 w-full rounded-lg border bg-background/60 px-3 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60', errors.businessActivity ? 'border-destructive' : 'border-border')}
                  aria-invalid={!!errors.businessActivity}
                  aria-describedby={errors.businessActivity ? 'biz-activity-error' : undefined}
                />
                <FieldError id="biz-activity-error" message={errors.businessActivity} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}