import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Clock,
    Lock,
    MapPin,
    Monitor,
    Save,
    Shield,
    Smartphone,
    Tablet,
    Wifi,
} from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/language-provider';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionEntry = {
    id: string;
    ip_address?: string | null;
    user_agent?: string | null;
    device_name?: string | null;
    device_type?: string | null;
    browser?: string | null;
    browser_version?: string | null;
    platform?: string | null;
    platform_version?: string | null;
    is_robot?: boolean;
    location?: string | null;
    country_code?: string | null;
    last_activity: number;
    last_used_at?: string | null;
    is_current?: boolean;
    trusted_device?: boolean;
};

type LoginHistoryEntry = {
    id: number;
    ip_address: string;
    user_agent?: string | null;
    device_type?: string | null;
    browser?: string | null;
    platform?: string | null;
    location?: string | null;
    country_code?: string | null;
    successful: boolean;
    failure_reason?: string | null;
    two_factor_method?: string | null;
    two_factor_passed?: boolean | null;
    is_suspicious: boolean;
    login_at: string;
    logout_at?: string | null;
    session_duration?: number | null;
};

type DeviceToken = {
    id: number;
    token: string;
    device_type: string;
    device_name?: string | null;
    app_version?: string | null;
    is_active: boolean;
    last_used_at?: string | null;
};

type AuthUser = {
    id: number;
    name: string;
    username: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
    bio?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    nationality?: string | null;
    timezone?: string | null;
    locale?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postal_code?: string | null;
    email_verified_at?: string | null;
    phone_verified_at?: string | null;
    email_verification_sent_at?: string | null;
    phone_verification_sent_at?: string | null;
    login_attempts?: number;
    locked_until?: string | null;
    password_changed_at?: string | null;
    force_password_change?: boolean;
    last_login_at?: string | null;
    last_login_ip?: string | null;
    last_login_device?: string | null;
    last_login_location?: string | null;
};

type ProfilePageProps = {
    auth: { user: AuthUser };
    mustVerifyEmail: boolean;
    status?: string;
    sessions: SessionEntry[];
    loginHistory: LoginHistoryEntry[];
    deviceTokens: DeviceToken[];
};

// ─── Constants ───────────────────────────────────────────────────────────────

const TIMEZONES = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Africa/Cairo', label: 'Africa/Cairo' },
    { value: 'Africa/Tunis', label: 'Africa/Tunis' },
    { value: 'Africa/Algiers', label: 'Africa/Algiers' },
    { value: 'Africa/Casablanca', label: 'Africa/Casablanca' },
    { value: 'Asia/Riyadh', label: 'Asia/Riyadh' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai' },
    { value: 'Asia/Kuwait', label: 'Asia/Kuwait' },
    { value: 'Asia/Bahrain', label: 'Asia/Bahrain' },
    { value: 'Asia/Qatar', label: 'Asia/Qatar' },
    { value: 'Asia/Muscat', label: 'Asia/Muscat' },
    { value: 'Asia/Aden', label: 'Asia/Aden' },
    { value: 'Asia/Baghdad', label: 'Asia/Baghdad' },
    { value: 'Asia/Beirut', label: 'Asia/Beirut' },
    { value: 'Asia/Damascus', label: 'Asia/Damascus' },
    { value: 'Asia/Amman', label: 'Asia/Amman' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'Europe/Paris', label: 'Europe/Paris' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'America/Chicago', label: 'America/Chicago' },
    { value: 'America/Denver', label: 'America/Denver' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(value: unknown): string {
    if (!value || typeof value !== 'string') return '—';
    return new Date(value).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function formatDuration(seconds: number | null | undefined): string {
    if (!seconds) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

function DeviceIcon({ type }: { type?: string | null }) {
    if (type === 'mobile') return <Smartphone className="size-4 text-muted-foreground" />;
    if (type === 'tablet') return <Tablet className="size-4 text-muted-foreground" />;
    return <Monitor className="size-4 text-muted-foreground" />;
}


function ProfileForm({
    user,
    mustVerifyEmail,
    status,
}: {
    user: AuthUser;
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { t, isRTL } = useLanguage();

    const { data, setData, patch, processing, recentlySuccessful, errors } = useForm({
        name:          user.name,
        username:      user.username,
        email:         user.email,
        phone:         user.phone         ?? '',
        avatar:        user.avatar        ?? '',
        bio:           user.bio           ?? '',
        date_of_birth: user.date_of_birth ?? '',
        gender:        user.gender        ?? '',
        nationality:   user.nationality   ?? '',
        timezone:      user.timezone      ?? 'Asia/Riyadh',
        locale:        user.locale        ?? 'en',
        address:       user.address       ?? '',
        city:          user.city          ?? '',
        state:         user.state         ?? '',
        country:       user.country       ?? '',
        postal_code:   user.postal_code   ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(ProfileController.update.url(), { preserveScroll: true });
    }

    return (
        <form onSubmit={submit} className="space-y-8">

            {/* ── Section 1: Basic Info ── */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Basic Information', 'المعلومات الأساسية')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Your public identity: name, username, and bio', 'هويتك العامة: الاسم واسم المستخدم والسيرة الذاتية')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="space-y-4 pt-2">
                    {/* Avatar */}
                    <div className="grid gap-2">
                        <Label htmlFor="avatar">{t('Avatar URL', 'رابط الصورة الشخصية')}</Label>
                        <Input
                            id="avatar"
                            type="url"
                            value={data.avatar}
                            onChange={(e) => setData('avatar', e.target.value)}
                            autoComplete="url"
                            placeholder="https://example.com/avatar.jpg"
                        />
                        <InputError message={errors.avatar} />
                    </div>

                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('Full Name', 'الاسم الكامل')}</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder={t('Your full name', 'اسمك الكامل')}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Username */}
                    <div className="grid gap-2">
                        <Label htmlFor="username">{t('Username', 'اسم المستخدم')}</Label>
                        <Input
                            id="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="username"
                        />
                        <InputError message={errors.username} />
                    </div>

                    {/* Bio */}
                    <div className="grid gap-2">
                        <Label htmlFor="bio">{t('Bio', 'السيرة الذاتية')}</Label>
                        <Textarea
                            id="bio"
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            placeholder={t('A short bio about yourself', 'سيرة ذاتية قصيرة عنك')}
                            rows={3}
                        />
                        <InputError message={errors.bio} />
                    </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <hr className="border-border" />

            {/* ── Section 2: Contact ── */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Contact Information', 'معلومات الاتصال')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Email and phone used to reach you and verify your identity', 'البريد الإلكتروني والهاتف المستخدمان للتواصل معك والتحقق من هويتك')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="space-y-4 pt-2">
                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('Email Address', 'البريد الإلكتروني')}</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="flex-1"
                            />
                            <Badge variant={user.email_verified_at ? 'default' : 'destructive'} className="shrink-0">
                                {user.email_verified_at
                                    ? t('Verified', 'موثق')
                                    : t('Unverified', 'غير موثق')}
                            </Badge>
                        </div>
                        <InputError message={errors.email} />

                        {mustVerifyEmail && !user.email_verified_at && (
                            <p className="text-sm text-muted-foreground">
                                {t('Your email is unverified.', 'بريدك الإلكتروني غير موثق.')}{' '}
                                <Link
                                    href={send()}
                                    as="button"
                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-current"
                                >
                                    {t('Resend verification email', 'إعادة إرسال بريد التحقق')}
                                </Link>
                                {status === 'verification-link-sent' && (
                                    <span className="ml-2 text-green-600 font-medium">
                                        {t('Sent!', 'تم الإرسال!')}
                                    </span>
                                )}
                            </p>
                        )}

                        {user.email_verified_at && (
                            <p className="text-xs text-muted-foreground">
                                {t('Verified at', 'تم التوثيق في')} {formatDate(user.email_verified_at)}
                            </p>
                        )}
                        {user.email_verification_sent_at && !user.email_verified_at && (
                            <p className="text-xs text-muted-foreground">
                                {t('Last verification email sent', 'آخر إرسال لبريد التحقق')} {formatDate(user.email_verification_sent_at)}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="grid gap-2">
                        <Label htmlFor="phone">{t('Phone Number', 'رقم الهاتف')}</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                autoComplete="tel"
                                placeholder="+966 5x xxx xxxx"
                                className="flex-1"
                            />
                            <Badge
                                variant={
                                    user.phone_verified_at
                                        ? 'default'
                                        : user.phone
                                        ? 'destructive'
                                        : 'secondary'
                                }
                                className="shrink-0"
                            >
                                {user.phone_verified_at
                                    ? t('Verified', 'موثق')
                                    : user.phone
                                    ? t('Unverified', 'غير موثق')
                                    : t('Not Set', 'غير محدد')}
                            </Badge>
                        </div>
                        <InputError message={errors.phone} />

                        {user.phone_verified_at && (
                            <p className="text-xs text-muted-foreground">
                                {t('Verified at', 'تم التوثيق في')} {formatDate(user.phone_verified_at)}
                            </p>
                        )}
                        {user.phone_verification_sent_at && !user.phone_verified_at && (
                            <p className="text-xs text-muted-foreground">
                                {t('Last verification SMS sent', 'آخر إرسال لرسالة التحقق')} {formatDate(user.phone_verification_sent_at)}
                            </p>
                        )}
                    </div>
                </div>
                </CollapsibleContent>
            </Collapsible>

            <hr className="border-border" />

            {/* ── Section 3: Personal Details ── */}
            <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Personal Details', 'التفاصيل الشخصية')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Date of birth, gender, nationality, and language preferences', 'تاريخ الميلاد والجنس والجنسية وتفضيلات اللغة')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="space-y-4 pt-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Date of Birth */}
                        <div className="grid gap-2">
                            <Label htmlFor="date_of_birth">{t('Date of Birth', 'تاريخ الميلاد')}</Label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                autoComplete="bday"
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <InputError message={errors.date_of_birth} />
                        </div>

                        {/* Gender */}
                        <div className="grid gap-2">
                            <Label htmlFor="gender">{t('Gender', 'الجنس')}</Label>
                            <Select
                                value={data.gender || '__none__'}
                                onValueChange={(v) => setData('gender', v === '__none__' ? '' : v)}
                            >
                                <SelectTrigger id="gender" className="w-full">
                                    <SelectValue placeholder={t('Select gender', 'اختر الجنس')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none__">{t('— Not specified —', '— غير محدد —')}</SelectItem>
                                    <SelectItem value="male">{t('Male', 'ذكر')}</SelectItem>
                                    <SelectItem value="female">{t('Female', 'أنثى')}</SelectItem>
                                    <SelectItem value="other">{t('Other', 'آخر')}</SelectItem>
                                    <SelectItem value="prefer_not_to_say">{t('Prefer not to say', 'أفضل عدم الإجابة')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />
                        </div>

                        {/* Nationality */}
                        <div className="grid gap-2">
                            <Label htmlFor="nationality">{t('Nationality', 'الجنسية')}</Label>
                            <Input
                                id="nationality"
                                value={data.nationality}
                                onChange={(e) => setData('nationality', e.target.value)}
                                placeholder={t('e.g. Saudi, Egyptian', 'مثل: سعودي، مصري')}
                                maxLength={50}
                            />
                            <InputError message={errors.nationality} />
                        </div>

                        {/* Language */}
                        <div className="grid gap-2">
                            <Label htmlFor="locale">{t('Language', 'اللغة')}</Label>
                            <Select value={data.locale} onValueChange={(v) => setData('locale', v)}>
                                <SelectTrigger id="locale" className="w-full">
                                    <SelectValue placeholder={t('Select language', 'اختر اللغة')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ar">العربية</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.locale} />
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="grid gap-2">
                        <Label htmlFor="timezone">{t('Timezone', 'المنطقة الزمنية')}</Label>
                        <Select value={data.timezone} onValueChange={(v) => setData('timezone', v)}>
                            <SelectTrigger id="timezone" className="w-full">
                                <SelectValue placeholder={t('Select timezone', 'اختر المنطقة الزمنية')} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {TIMEZONES.map((tz) => (
                                    <SelectItem key={tz.value} value={tz.value}>
                                        {tz.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.timezone} />
                    </div>
                </div>
                </CollapsibleContent>
            </Collapsible>

            <hr className="border-border" />

            {/* ── Section 4: Address ── */}
            <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Address', 'العنوان')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Your physical location and mailing address', 'موقعك الجغرافي وعنوان المراسلة')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="space-y-4 pt-2">
                    {/* Street Address */}
                    <div className="grid gap-2">
                        <Label htmlFor="address">{t('Street Address', 'عنوان الشارع')}</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder={t('Street address', 'عنوان الشارع')}
                            rows={2}
                        />
                        <InputError message={errors.address} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* City */}
                        <div className="grid gap-2">
                            <Label htmlFor="city">{t('City', 'المدينة')}</Label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                autoComplete="address-level2"
                                placeholder={t('City', 'المدينة')}
                            />
                            <InputError message={errors.city} />
                        </div>

                        {/* State */}
                        <div className="grid gap-2">
                            <Label htmlFor="state">{t('State / Province', 'المحافظة / المنطقة')}</Label>
                            <Input
                                id="state"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                                autoComplete="address-level1"
                                placeholder={t('State or province', 'المحافظة أو المنطقة')}
                            />
                            <InputError message={errors.state} />
                        </div>

                        {/* Country */}
                        <div className="grid gap-2">
                            <Label htmlFor="country">{t('Country', 'الدولة')}</Label>
                            <CountryDropdown
                                defaultValue={data.country}
                                onChange={(country) => setData('country', country?.alpha2 ?? '')}
                                placeholder={t('Select country', 'اختر الدولة')}
                            />
                            <InputError message={errors.country} />
                        </div>

                        {/* Postal Code */}
                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">{t('Postal / ZIP Code', 'الرمز البريدي')}</Label>
                            <Input
                                id="postal_code"
                                value={data.postal_code}
                                onChange={(e) => setData('postal_code', e.target.value)}
                                autoComplete="postal-code"
                                placeholder={t('Postal code', 'الرمز البريدي')}
                            />
                            <InputError message={errors.postal_code} />
                        </div>
                    </div>
                </div>
                </CollapsibleContent>
            </Collapsible>

            <hr className="border-border" />

            {/* ── Single Save Button ── */}
            <div className="flex items-center gap-4 pt-2">
                <Button type="submit" disabled={processing} data-test="save-profile-button" className="gap-2">
                    <Save className="size-4" />
                    {t('Save Changes', 'حفظ التغييرات')}
                </Button>
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                        <CheckCircle2 className="size-4" /> {t('Saved', 'تم الحفظ')}
                    </p>
                </Transition>
            </div>
        </form>
    );
}

// ─── Security Section (read-only) ─────────────────────────────────────────────

function SecuritySection({ user }: { user: AuthUser }) {
    const { t, isRTL } = useLanguage();
    const loginAttempts = user.login_attempts ?? 0;
    const isLocked = user.locked_until && new Date(user.locked_until) > new Date();

    return (
        <div className="space-y-4">
            {/* Security Overview */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Login Security', 'أمان تسجيل الدخول')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Account lock status, failed attempts, and password information', 'حالة قفل الحساب والمحاولات الفاشلة ومعلومات كلمة المرور')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="pt-2">
                    <Card>
                        <CardContent className="space-y-3 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Shield className="size-3.5" />
                                    {t('Failed login attempts', 'محاولات تسجيل دخول فاشلة')}
                                </span>
                                <Badge variant={loginAttempts > 5 ? 'destructive' : loginAttempts > 0 ? 'secondary' : 'default'}>
                                    {loginAttempts}
                                </Badge>
                            </div>

                            {isLocked && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Lock className="size-3.5 text-destructive" />
                                        {t('Locked until', 'مقفل حتى')}
                                    </span>
                                    <span className="text-destructive font-medium">{formatDate(user.locked_until)}</span>
                                </div>
                            )}

                            {user.password_changed_at && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t('Password last changed', 'آخر تغيير لكلمة المرور')}</span>
                                    <span>{formatDate(user.password_changed_at)}</span>
                                </div>
                            )}

                            {user.force_password_change && (
                                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
                                    <AlertTriangle className="size-4 shrink-0" />
                                    {t('Password change required on next login.', 'يجب تغيير كلمة المرور عند تسجيل الدخول التالي.')}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                </CollapsibleContent>
            </Collapsible>

            <hr className="border-border" />

            {/* Last Login */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Last Login', 'آخر تسجيل دخول')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Details of your most recent login session', 'تفاصيل جلسة تسجيل الدخول الأخيرة')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="pt-2">
                    <Card>
                        <CardContent className="space-y-3 pt-4">
                            {user.last_login_at ? (
                                <>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                            <Clock className="size-3.5" />
                                            {t('When', 'متى')}
                                        </span>
                                        <span>{formatDate(user.last_login_at)}</span>
                                    </div>
                                    {user.last_login_ip && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1.5">
                                                <Wifi className="size-3.5" />
                                                {t('IP Address', 'عنوان IP')}
                                            </span>
                                            <span className="font-mono text-xs">{user.last_login_ip}</span>
                                        </div>
                                    )}
                                    {user.last_login_device && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{t('Device', 'الجهاز')}</span>
                                            <span>{user.last_login_device}</span>
                                        </div>
                                    )}
                                    {user.last_login_location && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1.5">
                                                <MapPin className="size-3.5" />
                                                {t('Location', 'الموقع')}
                                            </span>
                                            <span>{user.last_login_location}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {t('No login history available.', 'لا يوجد سجل تسجيل دخول.')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

// ─── Sessions Section (read-only) ───────────────────────────────────────────────

function SessionsSection({
    sessions,
    loginHistory,
    deviceTokens,
}: {
    sessions: SessionEntry[];
    loginHistory: LoginHistoryEntry[];
    deviceTokens: DeviceToken[];
}) {
    const { t, isRTL } = useLanguage();

    return (
        <div className="space-y-4">
            {/* Active Sessions */}
            <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Active Sessions', 'الجلسات النشطة')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Your currently active sessions across devices', 'جلساتك النشطة حاليًا عبر الأجهزة')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="pt-2">
                    <Card>
                        <CardContent className="pt-4">
                            {sessions.length > 0 ? (
                                <div className="space-y-2">
                                    {sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                                        >
                                            <div className="flex items-start gap-2.5">
                                                <DeviceIcon type={session.device_type} />
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-medium">
                                                            {session.device_name || session.device_type || t('Unknown Device', 'جهاز غير معروف')}
                                                        </span>
                                                        {session.is_current && (
                                                            <Badge variant="default" className="text-[10px] py-0 h-4">
                                                                {t('Current', 'الحالية')}
                                                            </Badge>
                                                        )}
                                                        {session.trusted_device && (
                                                            <Badge variant="secondary" className="text-[10px] py-0 h-4">
                                                                {t('Trusted', 'موثوق')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {[session.browser, session.browser_version, session.platform].filter(Boolean).join(' · ')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {[session.ip_address, session.location || session.country_code || undefined].filter(Boolean).join(' · ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                                                <Clock className="size-3 inline mr-0.5" />
                                                {session.last_activity
                                                    ? new Date(session.last_activity * 1000).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                                                    : '—'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {t('No active sessions found.', 'لا توجد جلسات نشطة.')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                </CollapsibleContent>
            </Collapsible>

            <hr className="border-border" />

            {/* Login History */}
            <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Login History', 'سجل تسجيل الدخول')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Recent login activity on your account (last 20)', 'نشاط تسجيل الدخول الأخير على حسابك (آخر 20 سجل)')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="pt-2">
                    <Card>
                        <CardContent className="pt-4">
                            {loginHistory.length > 0 ? (
                                <div className="space-y-2">
                                    {loginHistory.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                                        >
                                            <div className="flex items-start gap-2.5">
                                                <DeviceIcon type={entry.device_type} />
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-medium">
                                                            {entry.device_type || t('Unknown Device', 'جهاز غير معروف')}
                                                        </span>
                                                        <Badge
                                                            variant={entry.successful ? 'default' : 'destructive'}
                                                            className="text-[10px] py-0 h-4"
                                                        >
                                                            {entry.successful ? t('Success', 'ناجح') : t('Failed', 'فاشل')}
                                                        </Badge>
                                                        {entry.is_suspicious && (
                                                            <Badge variant="destructive" className="text-[10px] py-0 h-4">
                                                                {t('Suspicious', 'مشبوه')}
                                                            </Badge>
                                                        )}
                                                        {entry.two_factor_passed === true && (
                                                            <Badge variant="secondary" className="text-[10px] py-0 h-4">
                                                                {t('2FA ✓', '2FA ✓')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {[entry.browser, entry.platform].filter(Boolean).join(' · ')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {[entry.ip_address, entry.location || entry.country_code || undefined].filter(Boolean).join(' · ')}
                                                    </p>
                                                    {!entry.successful && entry.failure_reason && (
                                                        <p className="text-xs text-destructive">{entry.failure_reason}</p>
                                                    )}
                                                    {entry.logout_at && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t('Duration:', 'المدة:')} {formatDuration(entry.session_duration)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDate(entry.login_at)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {t('No login history available.', 'لا يوجد سجل تسجيل دخول.')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                </CollapsibleContent>
            </Collapsible>

            <hr className="border-border" />

            {/* Authorized Devices */}
            <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                    <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-base font-semibold">{t('Authorized Devices', 'الأجهزة المصرح بها')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t('Devices registered for push notifications', 'الأجهزة المسجلة للإشعارات الفورية')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                    <div className="pt-2">
                    <Card>
                        <CardContent className="pt-4">
                            {deviceTokens.length > 0 ? (
                                <div className="space-y-2">
                                    {deviceTokens.map((device) => (
                                        <div
                                            key={device.id}
                                            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                                        >
                                            <div className="flex items-start gap-2.5">
                                                <DeviceIcon type={device.device_type} />
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {device.device_name || device.device_type || t('Unknown Device', 'جهاز غير معروف')}
                                                        </span>
                                                        <Badge
                                                            variant={device.is_active ? 'default' : 'secondary'}
                                                            className="text-[10px] py-0 h-4"
                                                        >
                                                            {device.is_active ? t('Active', 'نشط') : t('Inactive', 'غير نشط')}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {device.device_type}
                                                        {device.app_version ? ` · v${device.app_version}` : ''}
                                                    </p>
                                                    {device.last_used_at && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {t('Last used:', 'آخر استخدام:')} {formatDate(device.last_used_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {t('No authorized devices found.', 'لا توجد أجهزة مصرح بها.')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Profile({ auth, mustVerifyEmail, status, sessions, loginHistory, deviceTokens }: ProfilePageProps) {
    const { t } = useLanguage();
    const { user } = auth;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Profile settings', 'إعدادات الملف الشخصي'), href: edit().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Profile settings', 'إعدادات الملف الشخصي')} />
            <h1 className="sr-only">{t('Profile Settings', 'إعدادات الملف الشخصي')}</h1>

            <SettingsLayout>
                {/* ── Editable Profile (single form / single save) ── */}
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('Profile Information', 'معلومات الملف الشخصي')}
                        description={t(
                            'Update your profile details, contact info, personal preferences, and address',
                            'تحديث تفاصيل ملفك الشخصي ومعلومات الاتصال والتفضيلات الشخصية والعنوان'
                        )}
                    />
                    <ProfileForm user={user} mustVerifyEmail={mustVerifyEmail} status={status} />
                </div>

                {/* ── Security (read-only) ── */}
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('Security Information', 'معلومات الأمان')}
                        description={t(
                            'Login security details and account protection status',
                            'تفاصيل أمان تسجيل الدخول وحالة حماية الحساب'
                        )}
                    />
                    <SecuritySection user={user} />
                </div>

                {/* ── Sessions & Devices (read-only) ── */}
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('Sessions & Devices', 'الجلسات والأجهزة')}
                        description={t(
                            'Active sessions, login history, and authorized devices',
                            'الجلسات النشطة وسجل تسجيل الدخول والأجهزة المصرح بها'
                        )}
                    />
                    <SessionsSection
                        sessions={sessions}
                        loginHistory={loginHistory}
                        deviceTokens={deviceTokens}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}