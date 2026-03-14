import { Form, Head } from '@inertiajs/react';
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useLanguage();

    return (
        <AuthLayout
            title={t('Confirm your identity', 'تأكيد هويتك')}
            description={t(
                'This action requires re-authentication. Please enter your password to continue.',
                'هذه العملية تتطلب إعادة التحقق من الهوية. يرجى إدخال كلمة المرور للمتابعة.',
            )}
        >
            <Head title={t('Confirm password', 'تأكيد كلمة المرور')} />

            {/* Security notice */}
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    {t(
                        'Your session will remain active after confirmation. This prompt protects sensitive operations.',
                        'ستظل جلستك مفعّلة بعد التأكيد. هذه الرسالة لحماية العمليات الحساسة.',
                    )}
                </p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
            >
                {({ processing, errors }) => (
                    <div className="flex flex-col gap-5">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                {t('Current password', 'كلمة المرور الحالية')}
                            </Label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder={t(
                                        'Enter your password',
                                        'أدخل كلمة المرور',
                                    )}
                                    autoComplete="current-password"
                                    autoFocus
                                    className="px-9"
                                    aria-describedby={
                                        errors.password
                                            ? 'password-error'
                                            : undefined
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    aria-label={
                                        showPassword
                                            ? t(
                                                  'Hide password',
                                                  'إخفاء كلمة المرور',
                                              )
                                            : t(
                                                  'Show password',
                                                  'إظهار كلمة المرور',
                                              )
                                    }
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <div
                                    id="password-error"
                                    className="flex items-center gap-1.5"
                                >
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError message={errors.password} />
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    {t('Confirming…', 'جاري التأكيد…')}
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="size-4" />
                                    {t(
                                        'Confirm & continue',
                                        'تأكيد المتابعة',
                                    )}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
