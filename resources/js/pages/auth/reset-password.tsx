import { Form, Head } from '@inertiajs/react';
import { AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { t } = useLanguage();

    return (
        <AuthLayout
            title={t('Set new password', 'تعيين كلمة مرور جديدة')}
            description={t(
                'Choose a strong password to protect your account',
                'اختر كلمة مرور قوية لحماية حسابك',
            )}
        >
            <Head title={t('Reset password', 'إعادة تعيين كلمة المرور')} />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="flex flex-col gap-5">
                        {/* Email (read-only) */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                {t('Account email', 'البريد الإلكتروني للحساب')}
                            </Label>
                            <div className="flex h-9 items-center rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground">
                                {email}
                            </div>
                            {errors.email && (
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError message={errors.email} />
                                </div>
                            )}
                        </div>

                        {/* New password */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                {t('New password', 'كلمة المرور الجديدة')}
                            </Label>
                            <div className="relative">
                                <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder={t(
                                        'Minimum 8 characters',
                                        '8 أحرف على الأقل',
                                    )}
                                    className="px-9"
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
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError message={errors.password} />
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-medium"
                            >
                                {t(
                                    'Confirm new password',
                                    'تأكيد كلمة المرور الجديدة',
                                )}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder={t(
                                        'Re-enter your password',
                                        'أعد إدخال كلمة المرور',
                                    )}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                    aria-label={
                                        showConfirm
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
                                    {showConfirm ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    {t(
                                        'Updating password…',
                                        'جاري تحديث كلمة المرور…',
                                    )}
                                </>
                            ) : (
                                t(
                                    'Reset password',
                                    'إعادة تعيين كلمة المرور',
                                )
                            )}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
