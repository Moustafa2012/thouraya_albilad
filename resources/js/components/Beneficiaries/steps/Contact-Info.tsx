import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AtSign, Contact, Info, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { CommonBeneficiaryStepProps } from '../types';

interface FieldProps {
  label: string;
  labelAr: string;
  error?: string;
  hint?: string;
  required?: boolean;
  isRtl: boolean;
  children: React.ReactNode;
}

function Field({ label, labelAr, error, hint, required, isRtl, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {isRtl ? labelAr : label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-xs font-medium text-destructive"
          >
            <AlertCircle className="size-3 shrink-0" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
          >
            <Info className="mt-0.5 size-3 shrink-0" />
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const inputClass = 'h-10 bg-background text-sm';

export function StepContactInfo({ formData, errors, isRtl, t, set }: CommonBeneficiaryStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Contact className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Contact Information', 'معلومات الاتصال')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('All fields are optional.', 'جميع الحقول اختيارية.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Email Address"
          labelAr="البريد الإلكتروني"
          error={errors.email}
          isRtl={isRtl}
        >
          <div className="relative">
            <AtSign className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              type="email"
              value={formData.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
              placeholder="name@company.com"
              className={cn(inputClass, isRtl ? 'pr-9' : 'pl-9', errors.email && 'border-destructive')}
            />
          </div>
        </Field>

        <Field
          label="Phone Number"
          labelAr="رقم الهاتف"
          error={errors.phone}
          isRtl={isRtl}
        >
          <div className="relative">
            <Phone className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              type="tel"
              value={formData.phone ?? ''}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+966 5X XXX XXXX"
              className={cn(inputClass, isRtl ? 'pr-9' : 'pl-9', errors.phone && 'border-destructive')}
            />
          </div>
        </Field>
      </div>

      <Field
        label="Address"
        labelAr="العنوان"
        isRtl={isRtl}
      >
        <div className="relative">
          <MapPin className={cn('absolute left-3 top-3 size-4 text-muted-foreground', isRtl && 'left-auto right-3')} />
          <Textarea
            value={formData.address ?? ''}
            onChange={(e) => set('address', e.target.value)}
            placeholder={t('Street address, city, country', 'الشارع، المدينة، الدولة')}
            rows={3}
            className={cn('resize-none bg-background text-sm', isRtl ? 'pr-9' : 'pl-9')}
          />
        </div>
      </Field>

      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          {t(
            'Contact details help you identify and reach your beneficiaries quickly. They are not used for verification.',
            'تساعدك معلومات الاتصال على التعرف على مستفيديك والوصول إليهم بسرعة. لا تُستخدم للتحقق.',
          )}
        </p>
      </div>
    </div>
  );
}