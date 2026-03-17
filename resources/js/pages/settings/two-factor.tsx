import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck, ShieldOff } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { useLanguage } from '@/components/language-provider';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const { t } = useLanguage();
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('Two-Factor Authentication', 'المصادقة الثنائية'),
            href: typeof show === 'function' ? show().url : (show as unknown as { url: string }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Two-Factor Authentication', 'المصادقة الثنائية')} />
            <h1 className="sr-only">{t('Two-Factor Authentication Settings', 'إعدادات المصادقة الثنائية')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('Two-Factor Authentication', 'المصادقة الثنائية')}
                        description={t(
                            'Add an extra layer of security to your account',
                            'أضف طبقة أمان إضافية إلى حسابك'
                        )}
                    />

                    {/* Status card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between gap-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    {twoFactorEnabled ? (
                                        <ShieldCheck className="size-5 text-emerald-500" />
                                    ) : (
                                        <ShieldOff className="size-5 text-muted-foreground" />
                                    )}
                                    {t('2FA Status', 'حالة المصادقة الثنائية')}
                                </CardTitle>
                                <Badge variant={twoFactorEnabled ? 'default' : 'destructive'}>
                                    {twoFactorEnabled ? t('Enabled', 'ممكّن') : t('Disabled', 'معطل')}
                                </Badge>
                            </div>
                            <CardDescription>
                                {twoFactorEnabled
                                    ? t(
                                        'Your account is protected with two-factor authentication. You will be prompted for a secure pin each time you sign in.',
                                        'حسابك محمي بالمصادقة الثنائية. سيتم مطالبتك برقم تعريف شخصي آمن في كل مرة تسجل فيها الدخول.'
                                      )
                                    : t(
                                        'Two-factor authentication adds an extra layer of security. When enabled, you will be prompted for a secure pin during login from a TOTP-supported app.',
                                        'المصادقة الثنائية تضيف طبقة أمان إضافية. عند تمكينها، سيتم مطالبتك برقم تعريف شخصي آمن أثناء تسجيل الدخول من تطبيق يدعم TOTP.'
                                      )}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {twoFactorEnabled ? (
                                <>
                                    {/* Recovery codes */}
                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={errors}
                                    />

                                    {/* Disable button */}
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                <ShieldBan className="size-4" />
                                                {t('Disable 2FA', 'تعطيل المصادقة الثنائية')}
                                            </Button>
                                        )}
                                    </Form>
                                </>
                            ) : (
                                <div>
                                    {hasSetupData ? (
                                        // Setup was started but not confirmed — let user continue
                                        <Button onClick={() => setShowSetupModal(true)}>
                                            <ShieldCheck className="size-4" />
                                            {t('Continue Setup', 'متابعة الإعداد')}
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() => setShowSetupModal(true)}
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    <ShieldCheck className="size-4" />
                                                    {t('Enable 2FA', 'تمكين المصادقة الثنائية')}
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* How it works */}
                    {!twoFactorEnabled && (
                        <Card className="border-dashed">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">{t('How it works', 'كيف يعمل')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-2">
                                <p>
                                    {t('1. Install a TOTP authenticator app (e.g. Google Authenticator, Authy, or 1Password).', '1. قم بتثبيت تطبيق مصادقة TOTP (مثل Google Authenticator أو Authy أو 1Password).')}
                                </p>
                                <p>
                                    {t('2. Click', '2. انقر فوق')} <strong>{t('Enable 2FA', 'تمكين المصادقة الثنائية')}</strong> {t('and scan the QR code with your app.', 'امسح رمز QR بتطبيقك.')}
                                </p>
                                <p>
                                    {t('3. Enter the 6-digit code to confirm setup.', '3. أدخل الرقم المكون من 6 أرقام لتأكيد الإعداد.')}
                                </p>
                                <p>
                                    {t('4. Save your recovery codes in a secure location in case you lose access to your device.', '4. احفظ رموز الاسترداد الخاصة بك في مكان آمن في حالة فقدان الوصول إلى جهازك.')}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Setup modal */}
                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </SettingsLayout>
        </AppLayout>
    );
}