import { Form, Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Mail } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { useLanguage } from '@/components/language-provider';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useLanguage();

    return (
        <AuthLayout
            title={t('Welcome back', 'مرحباً بعودتك')}
            description={t(
                'Enter your credentials to access your account',
                'أدخل بيانات الدخول للوصول إلى حسابك',
            )}
        >
            <Head title={t('Log in', 'تسجيل الدخول')} />

            {/* Status message */}
            {status && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900/50 dark:bg-green-950/30">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        {status}
                    </p>
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                {t(
                                    'Email or username',
                                    'البريد الإلكتروني أو اسم المستخدم',
                                )}
                            </Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder={t(
                                        'you@example.com or username',
                                        'you@example.com أو اسم المستخدم',
                                    )}
                                    className="pl-9"
                                    aria-describedby={
                                        errors.email ? 'email-error' : undefined
                                    }
                                />
                            </div>
                            {errors.email && (
                                <div
                                    id="email-error"
                                    className="flex items-center gap-1.5"
                                >
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError message={errors.email} />
                                </div>
                            )}
                        </div>

                        {/* Password field */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    {t('Password', 'كلمة المرور')}
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                        tabIndex={5}
                                    >
                                        {t(
                                            'Forgot password?',
                                            'نسيت كلمة المرور؟',
                                        )}
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="pr-10"
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
                                            ? t('Hide password', 'إخفاء كلمة المرور')
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

                        {/* Remember me */}
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                            />
                            <Label
                                htmlFor="remember"
                                className="cursor-pointer text-sm text-muted-foreground"
                            >
                                {t(
                                    'Keep me signed in for 30 days',
                                    'إبقني مسجلاً الدخول لمدة 30 يوماً',
                                )}
                            </Label>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    {t('Signing in…', 'جاري تسجيل الدخول…')}
                                </>
                            ) : (
                                t('Sign in', 'تسجيل الدخول')
                            )}
                        </Button>

                        {canRegister && (
                            <p className="text-center text-sm text-muted-foreground">
                                {t(
                                    "Don't have an account?",
                                    'لا تملك حساباً؟',
                                )}{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={6}
                                    className="font-medium text-foreground hover:underline"
                                >
                                    {t('Create one', 'إنشاء حساب')}
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
