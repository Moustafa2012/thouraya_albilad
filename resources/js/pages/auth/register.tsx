import { Form, Head } from '@inertiajs/react';
import { AlertCircle, Eye, EyeOff, Mail, User } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { useLanguage } from '@/components/language-provider';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

type PasswordStrength = {
    score: number; // 0-4
    label: string;
    color: string;
};

function getPasswordStrength(password: string): PasswordStrength {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map: Record<number, PasswordStrength> = {
        0: { score: 0, label: '', color: '' },
        1: { score: 1, label: 'Too weak', color: 'bg-destructive' },
        2: { score: 2, label: 'Weak', color: 'bg-orange-500' },
        3: { score: 3, label: 'Fair', color: 'bg-yellow-500' },
        4: { score: 4, label: 'Strong', color: 'bg-green-500' },
        5: { score: 5, label: 'Very strong', color: 'bg-emerald-500' },
    };
    return map[Math.min(score, 5)] ?? map[0];
}

function PasswordStrengthBar({ password }: { password: string }) {
    const { t } = useLanguage();
    const { score, label, color } = getPasswordStrength(password);
    if (!password) return null;
    const bars = 4;

    return (
        <div className="space-y-1.5">
            <div className="flex gap-1">
                {Array.from({ length: bars }, (_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < Math.ceil((score / 5) * bars) && score > 0
                                ? color
                                : 'bg-muted'
                        }`}
                    />
                ))}
            </div>
            {label && (
                <p className="text-xs text-muted-foreground">
                    {t('Strength:', 'القوة:')}{' '}
                    <span className="font-medium text-foreground">
                        {label === 'Too weak'
                            ? t('Too weak', 'ضعيفة جداً')
                            : label === 'Weak'
                              ? t('Weak', 'ضعيفة')
                              : label === 'Fair'
                                  ? t('Fair', 'متوسطة')
                                  : label === 'Strong'
                                      ? t('Strong', 'قوية')
                                      : label === 'Very strong'
                                          ? t('Very strong', 'قوية جداً')
                                          : label}
                    </span>
                </p>
            )}
        </div>
    );
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const { t } = useLanguage();

    return (
        <AuthLayout
            title={t('Create your account', 'إنشاء حسابك')}
            description={t(
                'Start your journey — it takes less than a minute',
                'ابدأ رحلتك — لن يستغرق الأمر أكثر من دقيقة',
            )}
        >
            <Head title={t('Register', 'إنشاء حساب')} />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                {t('Full name', 'الاسم الكامل')}
                            </Label>
                            <div className="relative">
                                <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={t(
                                        'Jane Smith',
                                        'أحمد محمد',
                                    )}
                                    className="pl-9"
                                />
                            </div>
                            {errors.name && (
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError message={errors.name} />
                                </div>
                            )}
                        </div>

                        {/* Username */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="username"
                                className="text-sm font-medium"
                            >
                                {t('Username', 'اسم المستخدم')}
                            </Label>
                            <div className="relative">
                                <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="username"
                                    name="username"
                                    placeholder={t(
                                        'janesmith',
                                        'ahmedmohamed',
                                    )}
                                    className="pl-9"
                                />
                            </div>
                            {errors.username && (
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError message={errors.username} />
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                {t('Email address', 'البريد الإلكتروني')}
                            </Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={t(
                                        'you@example.com',
                                        'you@example.com',
                                    )}
                                    className="pl-9"
                                />
                            </div>
                            {errors.email && (
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                                    <InputError message={errors.email} />
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                {t('Password', 'كلمة المرور')}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={t(
                                        'Minimum 8 characters',
                                        '8 أحرف على الأقل',
                                    )}
                                    className="pr-10"
                                    onChange={(e) =>
                                        setPasswordValue(e.target.value)
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
                            <PasswordStrengthBar password={passwordValue} />
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
                                {t('Confirm password', 'تأكيد كلمة المرور')}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
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
                            tabIndex={6}
                            data-test="register-user-button"
                        >
                            {processing ? (
                                <>
                                    <Spinner />
                                    {t(
                                        'Creating account…',
                                        'جاري إنشاء الحساب…',
                                    )}
                                </>
                            ) : (
                                t('Create account', 'إنشاء حساب')
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            {t(
                                'Already have an account?',
                                'لديك حساب بالفعل؟',
                            )}{' '}
                            <TextLink
                                href={login()}
                                tabIndex={7}
                                className="font-medium text-foreground hover:underline"
                            >
                                {t('Sign in', 'تسجيل الدخول')}
                            </TextLink>
                        </p>

                        <p className="text-center text-xs text-muted-foreground/60">
                            {t(
                                'By creating an account you agree to our',
                                'من خلال إنشاء حساب فإنك توافق على',
                            )}{' '}
                            <span className="underline">
                                {t(
                                    'Terms of Service',
                                    'شروط الخدمة',
                                )}
                            </span>{' '}
                            {t('and', 'و')}{' '}
                            <span className="underline">
                                {t(
                                    'Privacy Policy',
                                    'سياسة الخصوصية',
                                )}
                            </span>
                            .
                        </p>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
