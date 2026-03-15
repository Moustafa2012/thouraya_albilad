'use client';
import type { RequestPayload } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Landmark,
  LayoutGrid,
  Loader2,
  Save,
  Settings2,
  User,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  validateStep,
  validateAllSteps,
  hasErrors,
} from '@/components/Banks/BankAccountValidation';
import { StepAccountType } from '@/components/Banks/steps/account-type';
import { StepBank } from '@/components/Banks/steps/Bank';
import { StepCategory } from '@/components/Banks/steps/category';
import { StepHolder } from '@/components/Banks/steps/holder';
import { StepSettings } from '@/components/Banks/steps/Settings';
import {
  STEPS,
  INITIAL_FORM_DATA,
  type BankAccountFormData,
  type ValidationErrors,
  type BankAccount,
} from '@/components/Banks/types';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

// ─── Step icon map ────────────────────────────────────────────────────────────

const STEP_ICONS: Record<string, React.ElementType> = {
  LayoutGrid,
  User,
  Landmark,
  CreditCard,
  Settings2,
};

// ─── Form Reducer — pure, no mutations ───────────────────────────────────────
// Phase 1: Each action returns a new object. HYDRATE spreads INITIAL_FORM_DATA
//          first so all keys are always present (no undefined fields).

type Action =
  | { type: 'SET_FIELD'; field: keyof BankAccountFormData; value: string | boolean }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; data: BankAccountFormData };

function formReducer(state: BankAccountFormData, action: Action): BankAccountFormData {
  switch (action.type) {
    case 'SET_FIELD':
      if (state[action.field] === action.value) return state;
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return { ...INITIAL_FORM_DATA };
    case 'HYDRATE':
      return { ...INITIAL_FORM_DATA, ...action.data };
    default:
      return state;
  }
}

// ─── Helper: BankAccount → BankAccountFormData ────────────────────────────────
// Phase 3: Produces fully-initialised form data for Edit mode.

function accountToFormData(account: BankAccount): BankAccountFormData {
  return {
    ...INITIAL_FORM_DATA,
    accountCategory: account.accountCategory ?? '',
    holderNameAr: account.holderNameAr ?? '',
    holderNameEn: account.holderNameEn ?? '',
    holderIdType: account.holderIdType ?? '',
    holderId: account.holderId ?? '',
    holderPhone:
      (account.metadata?.holderPhone as string | undefined)?.trim() ||
      account.bankPhone ||
      '',
    holderEmail: (account.metadata?.holderEmail as string | undefined)?.trim() || '',
    bankCountry: account.bankCountry ?? '',
    bankName: account.bankName ?? '',
    bankSwift: account.swiftCode ?? '',
    branchName: account.branchName ?? '',
    branchCode: account.branchCode ?? '',
    bankPhone: account.bankPhone ?? '',
    bankEmail: account.bankEmail ?? '',
    bankAddress: account.bankAddress ?? '',
    bankWebsite: (account.metadata?.bankWebsite as string) ?? '',
    bankCity: (account.metadata?.bankCity as string) ?? '',
    bankRelationshipDuration: (account.metadata?.bankRelationshipDuration as string) ?? '',
    accountManagerName: (account.metadata?.accountManagerName as string) ?? '',
    preferredLanguage: (account.metadata?.preferredLanguage as string) ?? '',
    accountType: account.accountType ?? '',
    accountNumber: account.accountNumber ?? '',
    iban: account.iban ?? '',
    currency: account.currency ?? 'SAR',
    swiftCode: account.swiftCode ?? '',
    routingNumber: account.routingNumber ?? '',
    sortCode: account.sortCode ?? '',
    ifscCode: (account.metadata?.ifscCode as string) ?? '',
    bankleitzahl: (account.metadata?.bankleitzahl as string) ?? '',
    accountNickname: (account.metadata?.accountNickname as string) ?? '',
    expectedMonthlyTransactions: (account.metadata?.expectedMonthlyTransactions as string) ?? '',
    expectedTransactionValue: (account.metadata?.expectedTransactionValue as string) ?? '',
    correspondentBank: (account.metadata?.correspondentBank as string) ?? '',
    correspondentSwift: (account.metadata?.correspondentSwift as string) ?? '',
    isDefault: account.isDefault ?? false,
    isActive: account.isActive ?? true,
    notes: account.notes ?? '',
    accountPurpose: (account.metadata?.accountPurpose as string) ?? '',
    monthlyTransactionLimit: (account.metadata?.monthlyTransactionLimit as string) ?? '',
    lowBalanceAlerts: (account.metadata?.lowBalanceAlerts as boolean) ?? true,
    largeTransactionAlerts: (account.metadata?.largeTransactionAlerts as boolean) ?? true,
    statementFrequency: (account.metadata?.statementFrequency as string) ?? 'monthly',
    establishmentType: account.establishmentType ?? '',
    businessSector: account.businessSector ?? '',
    businessActivity: account.businessActivity ?? '',
    commercialRegNumber: account.commercialRegNumber ?? '',
    vatNumber: account.vatNumber ?? '',
    authorizedSignatoryName: account.authorizedSignatoryName ?? '',
    authorizedSignatoryId: account.authorizedSignatoryId ?? '',
    signatoryPosition: account.signatoryPosition ?? '',
    beneficialOwnershipPercentage:
      account.beneficialOwnershipPercentage != null
        ? String(account.beneficialOwnershipPercentage)
        : '',
    businessName: account.businessName ?? '',
    businessType: account.businessType ?? '',
    taxId: account.taxId ?? '',
    businessAddress: account.businessAddress ?? '',
    businessPhone:
      (account.metadata?.businessPhone as string | undefined)?.trim() ||
      account.businessPhone ||
      '',
    dateOfBirth: account.dateOfBirth ?? '',
    ssnLast4: account.ssnLast4 ?? '',
  };
}

// ─── Helper: BankAccountFormData → API payload ────────────────────────────────
// Phase 3: Preserves existing API contract exactly.

function formDataToPayload(formData: BankAccountFormData): RequestPayload {
  const isBusiness = formData.accountCategory === 'business';
  const isPersonal = formData.accountCategory === 'personal';
  const inferredHolderName = (isBusiness ? formData.businessName : '') || formData.holderNameEn;

  return {
    account_name:
      formData.accountNickname ||
      (isBusiness ? formData.businessName : formData.holderNameEn) ||
      null,
    holder_name_ar: formData.holderNameAr || inferredHolderName,
    holder_name_en: formData.holderNameEn || inferredHolderName,
    holder_id_type: formData.holderIdType || null,
    holder_id: formData.holderId || null,
    date_of_birth: isPersonal ? (formData.dateOfBirth || null) : null,
    ssn_last_4: isPersonal ? (formData.ssnLast4 || null) : null,
    account_holder_name: isPersonal ? formData.holderNameEn : null,
    bank_name: formData.bankName,
    bank_country: formData.bankCountry || null,
    bank_address: formData.bankAddress || null,
    bank_phone: formData.bankPhone || null,
    bank_email: formData.bankEmail || null,
    account_number: formData.accountNumber,
    iban: formData.iban,
    swift_code: formData.swiftCode || null,
    currency: formData.currency,
    branch_name: formData.branchName || null,
    branch_code: formData.branchCode || null,
    routing_number: formData.routingNumber || null,
    sort_code: formData.sortCode || null,
    account_type: formData.accountType,
    account_category: formData.accountCategory,
    is_default: formData.isDefault,
    is_active: formData.isActive,
    notes: formData.notes || null,
    metadata: {
      holderPhone: formData.holderPhone || null,
      holderEmail: formData.holderEmail || null,
      bankWebsite: formData.bankWebsite || null,
      bankCity: formData.bankCity || null,
      bankRelationshipDuration: formData.bankRelationshipDuration || null,
      accountManagerName: formData.accountManagerName || null,
      preferredLanguage: formData.preferredLanguage || null,
      accountNickname: formData.accountNickname || null,
      expectedMonthlyTransactions: formData.expectedMonthlyTransactions || null,
      expectedTransactionValue: formData.expectedTransactionValue || null,
      correspondentBank: formData.correspondentBank || null,
      correspondentSwift: formData.correspondentSwift || null,
      ifscCode: formData.ifscCode || null,
      bankleitzahl: formData.bankleitzahl || null,
      accountPurpose: formData.accountPurpose || null,
      monthlyTransactionLimit: formData.monthlyTransactionLimit || null,
      lowBalanceAlerts: formData.lowBalanceAlerts,
      largeTransactionAlerts: formData.largeTransactionAlerts,
      statementFrequency: formData.statementFrequency,
    },
    // Business fields — only included for business accounts
    establishment_type: isBusiness ? (formData.establishmentType || null) : null,
    business_sector: isBusiness ? (formData.businessSector || null) : null,
    business_activity: isBusiness ? (formData.businessActivity || null) : null,
    commercial_reg_number: isBusiness ? (formData.commercialRegNumber || null) : null,
    vat_number: isBusiness ? (formData.vatNumber || null) : null,
    authorized_signatory_name: isBusiness ? (formData.authorizedSignatoryName || null) : null,
    authorized_signatory_id: isBusiness ? (formData.authorizedSignatoryId || null) : null,
    signatory_position: isBusiness ? (formData.signatoryPosition || null) : null,
    beneficial_ownership_percentage:
      isBusiness && formData.beneficialOwnershipPercentage
        ? Number(formData.beneficialOwnershipPercentage)
        : null,
    business_name: isBusiness ? (formData.businessName || null) : null,
    business_type: isBusiness ? (formData.businessType || null) : null,
    tax_id: isBusiness ? (formData.taxId || null) : null,
    business_address: isBusiness ? (formData.businessAddress || null) : null,
    business_phone: isBusiness ? (formData.businessPhone || null) : null,
  };
}

// ─── Molecule: StepProgressBar ───────────────────────────────────────────────
// Phase 4: Pure presentational component — zero business logic.

interface StepProgressBarProps {
  steps: typeof STEPS;
  currentStep: number;
  stepCompletionMap: Record<number, boolean>;
  visitedSteps: Set<number>;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  onStepClick: (index: number) => void;
}

function StepProgressBar({
  steps,
  currentStep,
  stepCompletionMap,
  visitedSteps,
  isRtl,
  t,
  onStepClick,
}: StepProgressBarProps) {
  return (
    <nav aria-label={t('Form steps', 'خطوات النموذج')}>
      <ol className="flex items-center gap-0 overflow-x-auto" role="list">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[step.icon] ?? LayoutGrid;
          const isActive = index === currentStep;
          const isCompleted = !!stepCompletionMap[index] && index < currentStep;
          const isVisited = visitedSteps.has(index);
          const isClickable = isVisited || index <= currentStep;

          return (
            <li key={step.key} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                aria-current={isActive ? 'step' : undefined}
                aria-label={[
                  `${t('Step', 'خطوة')} ${index + 1}:`,
                  isRtl ? step.labelAr : step.labelEn,
                  isCompleted ? `(${t('completed', 'مكتملة')})` : '',
                  isActive ? `(${t('current', 'الحالية')})` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : isCompleted
                      ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                      : isVisited
                        ? 'text-muted-foreground hover:bg-muted/40'
                        : 'cursor-not-allowed opacity-40',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground',
                  )}
                  aria-hidden="true"
                >
                  {isCompleted ? '✓' : <Icon className="size-3.5" />}
                </span>
                <span className="hidden sm:block">
                  {isRtl ? step.labelAr : step.labelEn}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-1 h-px w-5 shrink-0 transition-colors',
                    isCompleted ? 'bg-emerald-400' : 'bg-border/60',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Molecule: ToastNotification ─────────────────────────────────────────────
// Phase 4: Pure presentational — no logic, no state.

interface NotificationData {
  type: 'success' | 'error';
  message: string;
}

function ToastNotification({
  notification,
  onDismiss,
  t,
}: {
  notification: NotificationData;
  onDismiss: () => void;
  t: (en: string, ar: string) => string;
}) {
  const isSuccess = notification.type === 'success';
  return (
    <motion.div
      key="toast"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        'fixed inset-x-4 top-4 z-50 mx-auto flex max-w-xl items-start gap-3 rounded-xl border px-4 py-3 shadow-xl',
        'md:inset-x-auto md:left-1/2 md:-translate-x-1/2',
        // Phase 2: glass notification
        'backdrop-blur-md',
        isSuccess
          ? 'border-emerald-500/30 bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200'
          : 'border-destructive/30 bg-red-50/90 text-red-800 dark:bg-red-950/80 dark:text-red-200',
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
      )}
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        aria-label={t('Dismiss notification', 'إغلاق الإشعار')}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

// ─── Page props ───────────────────────────────────────────────────────────────

interface PageProps {
  account?: BankAccount;
  isEdit?: boolean;
  flash?: { success?: string; error?: string };
}

// ─── Main component: CreateBankAccount ───────────────────────────────────────

export default function CreateBankAccount() {
  const page = usePage();

  // Phase 3: mode explicitly from prop — never infer from `account` presence.
  const { account, isEdit = false, flash } = page.props as PageProps;

  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  // ── Breadcrumbs ───────────────────────────────────────────────────────────
  const breadcrumbs: BreadcrumbItem[] = isEdit
    ? [
        { title: t('Bank Accounts', 'الحسابات البنكية'), href: '/bank-accounts' },
        { title: t('Edit Account', 'تعديل الحساب البنكي'), href: '#' },
      ]
    : [
        { title: t('Bank Accounts', 'الحسابات البنكية'), href: '/bank-accounts' },
        { title: t('Add Account', 'إضافة حساب بنكي'), href: '#' },
      ];

  // ── Form state ─────────────────────────────────────────────────────────────
  // Phase 3: lazy initialiser — runs once at mount, never on re-render.
  const [formData, dispatch] = useReducer(formReducer, undefined, () =>
    account ? accountToFormData(account) : { ...INITIAL_FORM_DATA },
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<ValidationErrors>({});
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationData | null>(null);

  // Phase 1: refs for side-effect cleanup — no extra renders
  const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSubmittingRef = useRef(false);

  // Phase 5: focus management on step change
  const stepContentRef = useRef<HTMLDivElement | null>(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentStepKey = STEPS[currentStep].key;
  const isLastStep = currentStep === STEPS.length - 1;

  // ── Hydrate on account change (Edit mode only) ────────────────────────────
  // Phase 1 fix: account?.id is a primitive — stable dep prevents infinite loops.
  useEffect(() => {
    if (account) {
      dispatch({ type: 'HYDRATE', data: accountToFormData(account) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id]);

  // ── Flash messages from server ────────────────────────────────────────────
  useEffect(() => {
    if (flash?.success) showNotification('success', flash.success);
    else if (flash?.error) showNotification('error', flash.error);
  }, [flash?.success, flash?.error]);

  // ── Cleanup notification timer on unmount ─────────────────────────────────
  // Phase 1 fix: was leaking setTimeout across route changes.
  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    };
  }, []);

  // ── Focus step content on step change ────────────────────────────────────
  // Phase 5: announces step transition to screen readers via focus shift.
  useEffect(() => {
    stepContentRef.current?.focus({ preventScroll: false });
  }, [currentStep]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function showNotification(type: 'success' | 'error', message: string) {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ type, message });
    notificationTimerRef.current = setTimeout(() => setNotification(null), 6000);
  }

  function dismissNotification() {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification(null);
  }

  // Phase 1: useCallback — prevents child re-renders due to unstable function ref.
  const set = useCallback(
    (field: keyof BankAccountFormData, value: string | boolean) => {
      dispatch({ type: 'SET_FIELD', field, value });
      // Clear only the touched field's error — preserves other field errors.
      setStepErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  // ── Navigation ────────────────────────────────────────────────────────────

  function goToStep(index: number) {
    if (index === currentStep) return;
    // Moving forward: validate current step first
    if (index > currentStep) {
      const errors = validateStep(STEPS[currentStep].key, formData, t);
      if (hasErrors(errors)) {
        setStepErrors(errors);
        return;
      }
      setStepErrors({});
    }
    setVisitedSteps((prev) => new Set([...prev, index]));
    setCurrentStep(index);
  }

  function handleNext() {
    const errors = validateStep(STEPS[currentStep].key, formData, t);
    if (hasErrors(errors)) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      setVisitedSteps((prev) => new Set([...prev, next]));
      setCurrentStep(next);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setStepErrors({});
      setCurrentStep((prev) => prev - 1);
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  // Phase 3: Deterministic lifecycle — guard → validate settings → full pass
  //          → navigate to first failing step → POST or PUT → onFinish clears lock.

  function handleSubmit() {
    // Phase 1: double-submit guard using ref (avoids extra render from state)
    if (isSubmittingRef.current) return;

    // Validate final step locally
    const finalStepErrors = validateStep('settings', formData, t);
    if (hasErrors(finalStepErrors)) {
      setStepErrors(finalStepErrors);
      return;
    }

    // Full-form validation pass
    const failingSteps = validateAllSteps(formData, t);
    if (failingSteps.length > 0) {
      const first = failingSteps[0];
      const failingIndex = STEPS.findIndex((s) => s.key === first.stepKey);
      setStepErrors(first.errors);
      setCurrentStep(failingIndex);
      setVisitedSteps((prev) => new Set([...prev, failingIndex]));
      showNotification(
        'error',
        t(
          'Please complete all required fields before saving.',
          'يرجى إكمال جميع الحقول المطلوبة قبل الحفظ.',
        ),
      );
      return;
    }

    // Lock submission
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const payload = formDataToPayload(formData);

    const handlers = {
      onSuccess: () => {
        showNotification(
          'success',
          isEdit
            ? t('Account updated successfully.', 'تم تحديث الحساب بنجاح.')
            : t('Account created successfully.', 'تم إنشاء الحساب بنجاح.'),
        );
        if (!isEdit) {
          dispatch({ type: 'RESET' });
          setCurrentStep(0);
          setVisitedSteps(new Set([0]));
          setStepErrors({});
        }
      },
      onError: (errors: Record<string, string>) => {
        const firstMsg = Object.values(errors)[0];
        showNotification(
          'error',
          firstMsg ??
            t(
              'Failed to save bank account. Please try again.',
              'فشل حفظ الحساب. يرجى المحاولة مرة أخرى.',
            ),
        );

        // Phase 3: map snake_case server errors → camelCase form fields
        const mapped: ValidationErrors = {};
        for (const [key, message] of Object.entries(errors)) {
          const camelKey = key.replace(/_([a-z])/g, (_, c: string) =>
            c.toUpperCase(),
          ) as keyof BankAccountFormData;
          mapped[camelKey] = message;
        }

        // Navigate to the first step that has a server error
        for (let i = 0; i < STEPS.length; i++) {
          const stepErrors = validateStep(STEPS[i].key, formData, t);
          const serverStepErrors = Object.keys(mapped).some((k) =>
            Object.keys(stepErrors).includes(k),
          );
          if (serverStepErrors || (i === 0 && Object.keys(mapped).length > 0)) {
            setCurrentStep(i);
            setVisitedSteps((prev) => new Set([...prev, i]));
            break;
          }
        }
        setStepErrors(mapped);
      },
      // Phase 1 fix: always clear submission state in onFinish — fires even if
      // success/error callback throws, preventing permanently-stuck disabled button.
      onFinish: () => {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      },
    };

    // Phase 3: correct API verb — PUT for edit, POST for create
    if (isEdit && account) {
      router.put(`/bank-accounts/${account.id}`, payload, handlers);
    } else {
      router.post('/bank-accounts', payload, handlers);
    }
  }

  // ── Step completion map (stepper UI indicator) ────────────────────────────
  // useMemo: recomputes only when formData or visitedSteps changes.
  const stepCompletionMap = useMemo<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    for (let i = 0; i < STEPS.length; i++) {
      if (!visitedSteps.has(i)) { map[i] = false; continue; }
      const errs = validateStep(STEPS[i].key, formData, t);
      map[i] = !hasErrors(errs);
    }
    return map;
  }, [formData, visitedSteps, t]);

  // ── Step content renderer ─────────────────────────────────────────────────
  const stepProps = { formData, errors: stepErrors, isRtl, t, set };

  function renderStep() {
    switch (currentStepKey) {
      case 'category': return <StepAccountType {...stepProps} />;
      case 'holder':   return <StepHolder {...stepProps} />;
      case 'bank':     return <StepBank {...stepProps} />;
      case 'account':  return <StepCategory {...stepProps} />;
      case 'settings': return <StepSettings {...stepProps} />;
      default:         return null;
    }
  }

  // ── Error summary (step-level) ────────────────────────────────────────────
  const errorCount = Object.values(stepErrors).filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head
        title={
          isEdit
            ? t('Edit Bank Account', 'تعديل الحساب البنكي')
            : t('Add Bank Account', 'إضافة حساب بنكي')
        }
      />

      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <ToastNotification
            notification={notification}
            onDismiss={dismissNotification}
            t={t}
          />
        )}
      </AnimatePresence>

      <div className="flex h-full flex-1 flex-col overflow-x-hidden">
        <div className="flex flex-1 flex-col gap-5 p-6">

          {/* ── Step progress bar ────────────────────────────────────────── */}
          <div
            className={cn(
              'rounded-2xl border border-border/60 px-4 py-3',
              // Phase 2: glass
              'backdrop-blur-sm bg-card/70',
            )}
          >
            <StepProgressBar
              steps={STEPS}
              currentStep={currentStep}
              stepCompletionMap={stepCompletionMap}
              visitedSteps={visitedSteps}
              isRtl={isRtl}
              t={t}
              onStepClick={goToStep}
            />
          </div>

          {/* ── Step content card ────────────────────────────────────────── */}
          <div
            className={cn(
              'flex flex-1 flex-col rounded-2xl border border-border/60 shadow-sm',
              // Phase 2: glass card
              'backdrop-blur-sm bg-card/80',
            )}
          >
            {/* Card header bar */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('Step', 'خطوة')} {currentStep + 1} {t('of', 'من')} {STEPS.length}
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-foreground">
                  {isRtl ? STEPS[currentStep].labelAr : STEPS[currentStep].labelEn}
                </h2>
              </div>

              {/* Inline error count badge */}
              <AnimatePresence>
                {errorCount > 0 && (
                  <motion.span
                    key="err-badge"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
                    aria-live="polite"
                    aria-label={`${errorCount} ${t('errors on this step', 'أخطاء في هذه الخطوة')}`}
                  >
                    <AlertCircle className="size-3.5" aria-hidden="true" />
                    {errorCount} {t('error', 'خطأ', )}
                    {errorCount !== 1 ? (isRtl ? '' : 's') : ''}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Step body — animated transition */}
            {/* Phase 5: tabIndex=-1 focus target, sr-only announcement */}
            <div
              ref={stepContentRef}
              tabIndex={-1}
              className="flex-1 overflow-y-auto p-6 focus:outline-none"
              role="region"
              aria-label={`${isRtl ? STEPS[currentStep].labelAr : STEPS[currentStep].labelEn} — ${t('Step', 'خطوة')} ${currentStep + 1}`}
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepKey}
                  initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 16 : -16 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer: navigation buttons ─────────────────────────────── */}
            <div
              className={cn(
                'flex items-center border-t border-border/50 px-6 py-4',
                'justify-between',
              )}
            >
              {/* Back */}
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className="gap-2"
                aria-label={t('Go to previous step', 'الذهاب إلى الخطوة السابقة')}
              >
                {isRtl ? (
                  <ChevronRight className="size-4" aria-hidden="true" />
                ) : (
                  <ChevronLeft className="size-4" aria-hidden="true" />
                )}
                {t('Back', 'رجوع')}
              </Button>

              {/* Step indicator dots — compact */}
              <div
                className="flex items-center gap-1.5"
                aria-label={t('Step progress', 'تقدم الخطوات')}
                role="group"
              >
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i === currentStep
                        ? 'w-5 bg-primary'
                        : stepCompletionMap[i]
                          ? 'w-1.5 bg-emerald-500'
                          : visitedSteps.has(i)
                            ? 'w-1.5 bg-muted-foreground/40'
                            : 'w-1.5 bg-border',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Next / Submit */}
              {isLastStep ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                  aria-label={
                    isSubmitting
                      ? t('Saving…', 'جار الحفظ…')
                      : isEdit
                        ? t('Save changes', 'حفظ التغييرات')
                        : t('Create account', 'إنشاء الحساب')
                  }
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      {t('Saving…', 'جار الحفظ…')}
                    </>
                  ) : (
                    <>
                      <Save className="size-4" aria-hidden="true" />
                      {isEdit ? t('Save changes', 'حفظ التغييرات') : t('Create account', 'إنشاء الحساب')}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="gap-2 font-semibold"
                  aria-label={t('Go to next step', 'الذهاب إلى الخطوة التالية')}
                >
                  {t('Next', 'التالي')}
                  {isRtl ? (
                    <ChevronLeft className="size-4" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="size-4" aria-hidden="true" />
                  )}
                </Button>
              )}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
