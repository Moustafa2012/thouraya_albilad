import { Transition } from '@headlessui/react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Loader2,
    Mail,
    Send,
    Server,
    ShieldCheck,
    X,
    XCircle,
} from 'lucide-react';
import { useId, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/language-provider';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type SmtpSettings = {
    enabled: boolean;
    host?: string | null;
    port?: number | null;
    username?: string | null;
    encryption?: string | null;
    from_address?: string | null;
    from_name?: string | null;
    has_password?: boolean;
};

type TestResult = {
    success: boolean;
    message: string;
} | null;

type PageProps = {
    smtp: SmtpSettings;
    flash?: { success?: string; error?: string };
    errors?: Record<string, string>;
};

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SmtpSettings() {
    const { t } = useLanguage();
    const uid = useId();
    const { smtp, flash, errors } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Settings', 'الإعدادات'), href: edit().url },
        { title: t('SMTP Email', 'بريد SMTP'), href: '/settings/smtp' },
    ];

    const [enabled,      setEnabled]      = useState<boolean>(Boolean(smtp.enabled));
    const [host,         setHost]         = useState<string>(smtp.host ?? '');
    const [port,         setPort]         = useState<string>(smtp.port ? String(smtp.port) : '');
    const [username,     setUsername]     = useState<string>(smtp.username ?? '');
    const [password,     setPassword]     = useState<string>('');
    const [encryption,   setEncryption]   = useState<string>(smtp.encryption ?? '');
    const [fromAddress,  setFromAddress]  = useState<string>(smtp.from_address ?? '');
    const [fromName,     setFromName]     = useState<string>(smtp.from_name ?? '');

    const [processing,         setProcessing]         = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [testResult,         setTestResult]         = useState<TestResult>(null);
    const [testLoading,        setTestLoading]        = useState(false);

    // ── Helpers ────────────────────────────────────────────────────────────

    function getPayload() {
        return {
            enabled,
            host:         host        || null,
            port:         port        ? Number(port) : null,
            username:     username    || null,
            password:     password    || null,
            encryption:   encryption  || null,
            from_address: fromAddress || null,
            from_name:    fromName    || null,
        };
    }

    // ── Actions ────────────────────────────────────────────────────────────

    function submit() {
        setProcessing(true);
        setRecentlySuccessful(false);
        setTestResult(null);

        router.put('/settings/smtp', getPayload(), {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setPassword('');
                setRecentlySuccessful(true);
                window.setTimeout(() => setRecentlySuccessful(false), 2500);
            },
        });
    }

    async function testConnection() {
        setTestLoading(true);
        setTestResult(null);

        try {
            // Use the global axios instance (injected by Laravel's bootstrap.js)
            // which automatically attaches the XSRF-TOKEN cookie as a header.
            const axios = (window as unknown as { axios: { post: (url: string) => Promise<{ data: { success: boolean; message: string } }> } }).axios;

            const { data } = await axios.post('/settings/smtp/test');
            setTestResult(data);
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            const errorMessage = axiosError?.response?.data?.message;
            
            setTestResult({
                success: false,
                message: errorMessage || 'Network error — could not reach the server.',
            });
            
            // If the error indicates settings need to be saved, show a helpful hint
            if (errorMessage?.includes('save your settings first')) {
                setTimeout(() => {
                    setTestResult({
                        success: false,
                        message: '💡 Please click "Save Settings" first, then try testing the connection.',
                    });
                }, 2000);
            }
        } finally {
            setTestLoading(false);
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('SMTP Email', 'بريد SMTP')} />
            <h1 className="sr-only">{t('SMTP Email Settings', 'إعدادات بريد SMTP')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('SMTP Email', 'بريد SMTP')}
                        description={t(
                            'Configure the outgoing mail server and sender identity',
                            'تكوين خادم البريد الصادر وهوية المرسل'
                        )}
                    />

                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            <span className="font-medium">{flash.error}</span>
                        </div>
                    )}

                    {/* Test result banner */}
                    {testResult && (
                        <div
                            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                                testResult.success
                                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                    : 'border-destructive/25 bg-destructive/10 text-destructive'
                            }`}
                        >
                            {testResult.success ? (
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            ) : (
                                <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            )}
                            <span className="font-medium">{testResult.message}</span>
                        </div>
                    )}

                    {/* Enable toggle */}
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    className="mt-0.5 size-5 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <div>
                                    <p className="text-sm font-semibold">{t('Enable SMTP override', 'تمكين تجاوز SMTP')}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'When enabled, the application uses these settings for all outgoing email.',
                                            'عند التمكين، يستخدم التطبيق هذه الإعدادات لجميع رسائل البريد الصادرة.'
                                        )}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={enabled}
                                onCheckedChange={setEnabled}
                                aria-label={t('Enable SMTP override', 'تمكين تجاوز SMTP')}
                            />
                        </div>
                    </div>

                    {/* Server settings */}
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                            <Server className="size-4 text-muted-foreground" aria-hidden="true" />
                            {t('Server', 'الخادم')}
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor={`${uid}-host`}>{t('Host', 'المضيف')}</Label>
                                <Input
                                    id={`${uid}-host`}
                                    value={host}
                                    onChange={(e) => setHost(e.target.value)}
                                    placeholder="smtp.example.com"
                                    autoComplete="off"
                                />
                                <InputError message={errors?.host} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`${uid}-port`}>{t('Port', 'المنفذ')}</Label>
                                <Input
                                    id={`${uid}-port`}
                                    inputMode="numeric"
                                    value={port}
                                    onChange={(e) => setPort(e.target.value)}
                                    placeholder="587"
                                />
                                <InputError message={errors?.port} />
                            </div>

                            <div className="grid gap-2">
                                <Label>{t('Encryption', 'التشفير')}</Label>
                                <Select
                                    value={encryption || 'none'}
                                    onValueChange={(v) => setEncryption(v === 'none' ? '' : v)}
                                >
                                    <SelectTrigger className="h-10 bg-background/60">
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">{t('None', 'بدون')}</SelectItem>
                                        <SelectItem value="tls">TLS</SelectItem>
                                        <SelectItem value="ssl">SSL</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors?.encryption} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`${uid}-username`}>{t('Username', 'اسم المستخدم')}</Label>
                                <Input
                                    id={`${uid}-username`}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="user@example.com"
                                    autoComplete="off"
                                />
                                <InputError message={errors?.username} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`${uid}-password`}>{t('Password', 'كلمة المرور')}</Label>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <Input
                                        id={`${uid}-password`}
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={
                                            smtp.has_password
                                                ? '•••••••• (leave blank to keep)'
                                                : 'Enter password'
                                        }
                                        autoComplete="new-password"
                                    />
                                </form>
                                <InputError message={errors?.password} />
                            </div>
                        </div>
                    </div>

                    {/* Sender settings */}
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                            <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                            {t('Sender Identity', 'هوية المرسل')}
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`${uid}-from-address`}>{t('From address', 'عنوان المرسل')}</Label>
                                <Input
                                    id={`${uid}-from-address`}
                                    type="email"
                                    value={fromAddress}
                                    onChange={(e) => setFromAddress(e.target.value)}
                                    placeholder="no-reply@example.com"
                                />
                                <InputError message={errors?.from_address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`${uid}-from-name`}>{t('From name', 'اسم المرسل')}</Label>
                                <Input
                                    id={`${uid}-from-name`}
                                    value={fromName}
                                    onChange={(e) => setFromName(e.target.value)}
                                    placeholder="My Application"
                                />
                                <InputError message={errors?.from_name} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            disabled={processing}
                            onClick={submit}
                            data-test="update-smtp-button"
                        >
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            {t('Save Settings', 'حفظ الإعدادات')}
                        </Button>

                        <Button
                            variant="outline"
                            disabled={testLoading || !enabled || !host}
                            onClick={testConnection}
                            data-test="test-smtp-button"
                            title={
                                !enabled
                                    ? 'Enable SMTP first'
                                    : !host
                                      ? 'Configure and save a host first'
                                      : recentlySuccessful
                                        ? 'Send a test email to your account'
                                        : 'Save your settings first, then test connection'
                            }
                        >
                            {testLoading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Send className="size-4" />
                            )}
                            {testLoading ? t('Sending…', 'جاري الإرسال…') : t('Test Connection', 'اختبار الاتصال')}
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                                <CheckCircle2 className="size-4" />
                                {t('Saved', 'تم الحفظ')}
                            </p>
                        </Transition>
                    </div>

                    {/* Helper note */}
                    <p className="text-xs text-muted-foreground">
                        {t(
                            'The test connection button sends a test email to your account email address. Save your settings before testing.',
                            'زر اختبار الاتصال يرسل بريدًا تجريبيًا إلى عنوان بريدك الإلكتروني. احفظ إعداداتك قبل الاختبار.'
                        )}
                    </p>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}