import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, Mail, MailCheck, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmail({ status }: { status?: string }) {
    const justSent = status === 'verification-link-sent';
    const [cooldown, setCooldown] = useState(
        justSent ? RESEND_COOLDOWN_SECONDS : 0,
    );
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (justSent) {
            setCooldown(RESEND_COOLDOWN_SECONDS);
        }
    }, [justSent]);

    useEffect(() => {
        if (cooldown > 0) {
            timerRef.current = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [cooldown]);

    return (
        <AuthLayout
            title={t('Verify your email', 'تحقق من بريدك الإلكتروني')}
            description={t(
                "One more step before you're all set",
                'خطوة واحدة قبل أن تصبح جاهزاً',
            )}
        >
            <Head
                title={t('Email verification', 'تأكيد البريد الإلكتروني')}
            />

            <div className="flex flex-col items-center gap-6 text-center">
                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted">
                    {justSent ? (
                        <MailCheck className="size-7 text-green-500" />
                    ) : (
                        <Mail className="size-7 text-muted-foreground" />
                    )}
                </div>

                {/* Status messages */}
                {justSent ? (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="size-4 text-green-500" />
                            <p className="font-medium text-green-600 dark:text-green-400">
                                {t(
                                    'Verification link sent!',
                                    'تم إرسال رابط التحقق!',
                                )}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                'A new verification link has been sent to your email address. Please check your inbox and spam folder.',
                                'تم إرسال رابط تحقق جديد إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد والبريد غير المرغوب فيه.',
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {t(
                                'We sent a verification link to your email address. Click the link in that email to get started.',
                                'قمنا بإرسال رابط تحقق إلى بريدك الإلكتروني. اضغط على الرابط في الرسالة للبدء.',
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            {t(
                                "Didn't get it? Check your spam folder or request a new link below.",
                                'لم تصلك الرسالة؟ تحقق من مجلد البريد غير المرغوب فيه أو اطلب رابطاً جديداً أدناه.',
                            )}
                        </p>
                    </div>
                )}

                <Form {...send.form()} className="w-full space-y-3">
                    {({ processing }) => (
                        <>
                            <Button
                                disabled={processing || cooldown > 0}
                                variant="secondary"
                                className="w-full"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        {t('Sending…', 'جاري الإرسال…')}
                                    </>
                                ) : cooldown > 0 ? (
                                    <>
                                        <RefreshCw className="size-4 opacity-50" />
                                        {t('Resend in', 'إعادة الإرسال خلال')}{' '}
                                        {cooldown}s
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="size-4" />
                                        {t(
                                            'Resend verification email',
                                            'إعادة إرسال رسالة التحقق',
                                        )}
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                <span>
                                    {t('Wrong account?', 'حساب غير صحيح؟')}
                                </span>
                                <TextLink
                                    href={logout()}
                                    className="font-medium text-foreground hover:underline"
                                >
                                    {t('Sign out', 'تسجيل الخروج')}
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
