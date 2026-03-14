import { motion } from 'framer-motion';
import { FileText, Tag } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { CommonBeneficiaryStepProps } from '../types';
import { CATEGORY_CONFIG } from '../types';

export function StepClassification({ formData, errors, isRtl, t, set }: CommonBeneficiaryStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Tag className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Classification', 'التصنيف')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('Categorize this beneficiary for better organization.', 'صنّف هذا المستفيد لتنظيم أفضل.')}
          </p>
        </div>
      </div>

      <div>
        <Label className="mb-3 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t('Category', 'الفئة')}
          <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORY_CONFIG.map((cat) => {
            const isSelected = formData.category === cat.value;

            return (
              <motion.button
                key={cat.value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => set('category', cat.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-150',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-xl border text-sm font-bold',
                    isSelected ? 'border-primary/30 bg-primary/15 text-primary' : cat.color,
                  )}
                >
                  <Tag className="size-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {isRtl ? cat.labelAr : cat.labelEn}
                </span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-bold text-primary"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
        {errors.category && (
          <p className="mt-2 text-sm text-destructive">{errors.category}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <FileText className="size-3.5" />
          {t('Notes', 'ملاحظات')}
          <span className="font-normal normal-case text-muted-foreground/60">({t('Optional', 'اختياري')})</span>
        </Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder={t(
            'Any additional notes about this beneficiary...',
            'أي ملاحظات إضافية حول هذا المستفيد...',
          )}
          rows={4}
          className="resize-none bg-background text-sm"
        />
        <p className="text-[11px] text-muted-foreground">
          {formData.notes.length}/500 {t('characters', 'حرف')}
        </p>
      </div>
    </div>
  );
}