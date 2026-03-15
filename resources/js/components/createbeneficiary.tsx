import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BadgeCheck, Save, Users } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useEffect, useState } from 'react';
import { validateStep, hasErrors } from '@/components/Beneficiaries/BeneficiaryValidation';
import { StepAccountType } from '@/components/Beneficiaries/steps/Account-Type';
import { StepBankDetails } from '@/components/Beneficiaries/steps/Bank-details';
import { StepBasicInfo } from '@/components/Beneficiaries/steps/Basic-Info';
import { StepClassification } from '@/components/Beneficiaries/steps/Classification';
import { StepContactInfo } from '@/components/Beneficiaries/steps/Contact-Info';
import { BENEFICIARY_STEPS, INITIAL_BENEFICIARY_FORM_DATA } from '@/components/Beneficiaries/types';
import type { Beneficiary, BeneficiaryFormData, BeneficiaryValidationErrors } from '@/components/Beneficiaries/types';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

function beneficiaryToFormData(beneficiary: Beneficiary): BeneficiaryFormData {
  return {
    ...INITIAL_BENEFICIARY_FORM_DATA,
    accountType: beneficiary.accountType,
    nameAr: beneficiary.nameAr,
    nameEn: beneficiary.nameEn,
    nationalId: beneficiary.nationalId ?? '',
    businessRegistration: beneficiary.businessRegistration ?? '',
    taxId: beneficiary.taxId ?? '',
    email: beneficiary.email ?? '',
    phone: beneficiary.phone ?? '',
    address: beneficiary.address ?? '',
    country: beneficiary.country,
    bankName: beneficiary.bankName,
    accountNumber: beneficiary.accountNumber,
    iban: beneficiary.iban,
    swiftCode: beneficiary.swiftCode,
    currency: beneficiary.currency,
    abaNumber: beneficiary.abaNumber ?? '',
    routingNumber: beneficiary.routingNumber ?? '',
    ifscCode: beneficiary.ifscCode ?? '',
    sortCode: beneficiary.sortCode ?? '',
    bsbNumber: beneficiary.bsbNumber ?? '',
    transitNumber: beneficiary.transitNumber ?? '',
    category: beneficiary.category,
    notes: beneficiary.notes ?? '',
  };
}

const BENEFICIARY_STEP_ICONS: Record<string, React.ElementType> = {
  Users: Icons.Users,
  User: Icons.User,
  Contact: Icons.Contact,
  Building2: Icons.Building2,
  Tag: Icons.Tag,
};

export default function CreateBeneficiary() {
  const page = usePage();
  const { beneficiary, isEdit = false } = page.props as { beneficiary?: Beneficiary; isEdit?: boolean };

  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  const breadcrumbs: BreadcrumbItem[] = isEdit
    ? [
        { title: t('Beneficiaries', 'المستفيدون'), href: '/beneficiaries' },
        { title: t('Edit Beneficiary', 'تعديل مستفيد'), href: '#' },
      ]
    : [
        { title: t('Beneficiaries', 'المستفيدون'), href: '/beneficiaries' },
        { title: t('Add Beneficiary', 'إضافة مستفيد'), href: '/beneficiaries/create' },
      ];

  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<BeneficiaryValidationErrors>({});
  const [formData, setFormData] = useState<BeneficiaryFormData>(() =>
    beneficiary ? beneficiaryToFormData(beneficiary) : INITIAL_BENEFICIARY_FORM_DATA,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = BENEFICIARY_STEPS[stepIndex];

  useEffect(() => {
    if (beneficiary) {
      setFormData(beneficiaryToFormData(beneficiary));
    }
  }, [beneficiary?.id]);

  function set(field: keyof BeneficiaryFormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof BeneficiaryValidationErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof BeneficiaryValidationErrors];
        return next;
      });
    }
  }

  function attemptNext() {
    const newErrors = validateStep(currentStep.key, formData, t);
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCompletedSteps((prev) => new Set(prev).add(stepIndex));
    if (stepIndex < BENEFICIARY_STEPS.length - 1) setStepIndex((i) => i + 1);
  }

  function goToStep(i: number) {
    if (i <= stepIndex || completedSteps.has(i - 1)) setStepIndex(i);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validateStep(currentStep.key, formData, t);
    if (hasErrors(newErrors)) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    if (isEdit && beneficiary) {
      router.put(`/beneficiaries/${beneficiary.id}`, formData as any, { onFinish: () => setIsSubmitting(false) });
    } else {
      router.post('/beneficiaries', formData as any, { onFinish: () => setIsSubmitting(false) });
    }
  }

  const commonProps = { formData, errors, isRtl, t, set };

  const stepComponents: Record<string, React.ReactNode> = {
    accountType:    <StepAccountType {...commonProps} />,
    basicInfo:      <StepBasicInfo {...commonProps} />,
    contactInfo:    <StepContactInfo {...commonProps} />,
    bankDetails:    <StepBankDetails {...commonProps} />,
    classification: <StepClassification {...commonProps} />,
  };

  const isLastStep = stepIndex === BENEFICIARY_STEPS.length - 1;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? t('Edit Beneficiary', 'تعديل مستفيد') : t('Add Beneficiary', 'إضافة مستفيد')} />

      <div className="flex h-full flex-1 flex-col overflow-x-hidden bg-background">
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/beneficiaries">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <BackIcon className="size-4" />
                  {t('Back', 'رجوع')}
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <Users className="size-5" />
                </span>
                <div>
                  <h1 className="text-base font-bold">
                    {isEdit ? t('Edit Beneficiary', 'تعديل مستفيد') : t('Add Beneficiary', 'إضافة مستفيد')}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {t('Step', 'الخطوة')} {stepIndex + 1} {t('of', 'من')} {BENEFICIARY_STEPS.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-1 sm:flex">
              {BENEFICIARY_STEPS.map((step, i) => {
                const IconComp = BENEFICIARY_STEP_ICONS[step.icon] ?? Icons.Circle;
                const isCompleted = completedSteps.has(i);
                const isCurrent = i === stepIndex;
                const isAccessible = i <= stepIndex || completedSteps.has(i - 1);

                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => isAccessible && goToStep(i)}
                    disabled={!isAccessible}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all',
                      isCurrent
                        ? 'bg-primary/15 text-primary'
                        : isCompleted
                        ? 'text-primary/70 hover:bg-primary/8'
                        : 'text-muted-foreground',
                      !isAccessible && 'cursor-not-allowed opacity-40',
                    )}
                  >
                    {isCompleted ? (
                      <BadgeCheck className="size-3.5 text-primary" />
                    ) : (
                      <IconComp className="size-3.5" />
                    )}
                    {isRtl ? step.labelAr : step.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${((stepIndex + 1) / BENEFICIARY_STEPS.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.key}
                  initial={{ opacity: 0, x: isRtl ? -24 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 24 : -24 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {stepComponents[currentStep.key]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-border bg-card px-6 py-4">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => stepIndex > 0 && setStepIndex((i) => i - 1)}
                disabled={stepIndex === 0}
                className="gap-1.5"
              >
                <BackIcon className="size-4" />
                {t('Previous', 'السابق')}
              </Button>

              {isLastStep ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-1.5 font-semibold"
                >
                  {isSubmitting ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <Save className="size-4" />
                  )}
                  {t('Save Beneficiary', 'حفظ المستفيد')}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={attemptNext}
                  className="gap-1.5 font-semibold"
                >
                  {t('Next', 'التالي')}
                  <ForwardIcon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
