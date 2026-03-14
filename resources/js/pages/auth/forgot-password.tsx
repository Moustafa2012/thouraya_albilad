import { Form, Head } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const emailSent = status !== undefined;

    return (
        <AuthLayout
            title="Reset your password"
            description={
                emailSent
                    ? 'Check your inbox for the reset link'
                    : "Enter your email and we'll send you a reset link"
            }
        >
            <Head title="Forgot password" />

            {/* Success state */}
            {emailSent && status && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            Reset link sent!
                        </p>
                        <p className="text-sm text-green-600/80 dark:text-green-500/80">
                            {status}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-5">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="you@example.com"
                                        className="pl-9"
                                        aria-describedby={
                                            errors.email
                                                ? 'email-error'
                                                : undefined
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

                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Sending link…
                                    </>
                                ) : (
                                    <>
                                        <Send className="size-4" />
                                        {emailSent
                                            ? 'Resend link'
                                            : 'Send reset link'}
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                    <ArrowLeft className="size-3.5" />
                    <span>Remembered it?</span>
                    <TextLink
                        href={login()}
                        className="font-medium text-foreground hover:underline"
                    >
                        Back to sign in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}