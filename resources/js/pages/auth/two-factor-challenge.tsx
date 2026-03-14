import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { KeySquare, Shield, Smartphone } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';

type Mode = 'code' | 'recovery';

export default function TwoFactorChallenge() {
    const [mode, setMode] = useState<Mode>('code');
    const [code, setCode] = useState<string>('');
    const { t } = useLanguage();

    const config = useMemo(
        () =>
            mode === 'recovery'
                ? {
                      title: t('Recovery Code', 'رمز الاسترداد'),
                      description: t(
                          'Enter one of your emergency recovery codes to access your account.',
                          'أدخل أحد رموز الاسترداد الطارئة للوصول إلى حسابك.',
                      ),
                      toggleText: t(
                          'Use authenticator app instead',
                          'استخدم تطبيق المصادقة بدلاً من ذلك',
                      ),
                      toggleMode: 'code' as Mode,
                  }
                : {
                      title: t(
                          'Two-Factor Authentication',
                          'المصادقة الثنائية',
                      ),
                      description: t(
                          'Enter the 6-digit code from your authenticator app.',
                          'أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة.',
                      ),
                      toggleText: t(
                          'Use recovery code instead',
                          'استخدم رمز الاسترداد بدلاً من ذلك',
                      ),
                      toggleMode: 'recovery' as Mode,
                  },
        [mode, t],
    );

    const handleModeToggle = (clearErrors: () => void) => {
        setMode(config.toggleMode);
        clearErrors();
        setCode('');
    };

    return (
        <AuthLayout title={config.title} description={config.description}>
            <Head
                title={t(
                    'Two-Factor Authentication',
                    'المصادقة الثنائية',
                )}
            />

            {/* Mode indicator */}
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                    {mode === 'code' ? (
                        <Smartphone className="size-4 text-muted-foreground" />
                    ) : (
                        <KeySquare className="size-4 text-muted-foreground" />
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">
                        {mode === 'code'
                            ? t('Authenticator app', 'تطبيق المصادقة')
                            : t('Recovery code', 'رمز الاسترداد')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {mode === 'code'
                            ? t(
                                  'Open your authenticator app to get a code',
                                  'افتح تطبيق المصادقة للحصول على الرمز',
                              )
                            : t(
                                  'Use a backup code saved when you enabled 2FA',
                                  'استخدم رمزاً احتياطياً حفظته عند تفعيل المصادقة الثنائية',
                              )}
                    </p>
                </div>
                <Shield className="ml-auto size-4 shrink-0 text-muted-foreground" />
            </div>

            <Form
                {...store.form()}
                className="space-y-5"
                resetOnError
                resetOnSuccess={mode === 'code'}
            >
                {({ errors, processing, clearErrors }) => (
                    <>
                        {mode === 'recovery' ? (
                            <div className="grid gap-2">
                                <Input
                                    name="recovery_code"
                                    type="text"
                                    placeholder="xxxxxxxx-xxxxxxxx"
                                    autoFocus
                                    required
                                    className="font-mono text-center tracking-widest"
                                />
                                {errors.recovery_code && (
                                    <InputError
                                        message={errors.recovery_code}
                                        className="text-center"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <InputOTP
                                    name="code"
                                    maxLength={OTP_MAX_LENGTH}
                                    value={code}
                                    onChange={(value) => setCode(value)}
                                    disabled={processing}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    autoFocus
                                >
                                    <InputOTPGroup>
                                        {Array.from(
                                            { length: OTP_MAX_LENGTH },
                                            (_, index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                />
                                            ),
                                        )}
                                    </InputOTPGroup>
                                </InputOTP>
                                {errors.code && (
                                    <InputError
                                        message={errors.code}
                                        className="text-center"
                                    />
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        'Enter the 6-digit code — no spaces needed',
                                        'أدخل الرمز المكوّن من 6 أرقام دون مسافات',
                                    )}
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={
                                processing ||
                                (mode === 'code' &&
                                    code.length < OTP_MAX_LENGTH)
                            }
                        >
                            {processing
                                ? t('Verifying…', 'جاري التحقق…')
                                : t(
                                      'Verify & continue',
                                      'التحقق والمتابعة',
                                  )}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/40"
                                onClick={() => handleModeToggle(clearErrors)}
                            >
                                {config.toggleText}
                            </button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
