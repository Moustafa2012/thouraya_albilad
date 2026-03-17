import type { RequestPayload } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Filter,
    Lock,
    Search,
    Shield,
    UserCog,
    X,
} from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { useLanguage } from '@/components/language-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type ManagedUser = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    is_banned: boolean;
    ban_reason?: string | null;
    banned_at?: string | null;
    email_verified_at?: string | null;
    last_login_at?: string | null;
    last_login_ip?: string | null;
    login_attempts?: number;
    locked_until?: string | null;
    created_at: string;
};

type PageProps = {
    users: ManagedUser[];
    roles: string[];
    flash?: { success?: string; error?: string };
};

type Filters = {
    search: string;
    role: 'all' | string;
    status: 'all' | 'active' | 'inactive' | 'banned' | 'locked';
};

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FILTERS: Filters = {
    search: '',
    role: 'all',
    status: 'all',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function isLocked(user: ManagedUser): boolean {
    return Boolean(user.locked_until && new Date(user.locked_until) > new Date());
}

// ─── Ban Reason Modal ─────────────────────────────────────────────────────────

type BanDialogProps = {
    user: ManagedUser;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
};

function BanReasonDialog({ user, onConfirm, onCancel }: BanDialogProps) {
    const [reason, setReason] = useState('');
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                    <div className="rounded-full bg-destructive/10 p-2">
                        <AlertTriangle className="size-5 text-destructive" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">
                            {t('Ban User', 'حظر المستخدم')}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {t(
                                `You are about to ban ${user.name}. Please provide a reason.`,
                                `أنت على وشك حظر ${user.name}. يرجى تقديم سبب.`,
                            )}
                        </p>
                    </div>
                </div>

                <div className="grid gap-2 mb-4">
                    <Label htmlFor="ban-reason">
                        {t('Ban Reason', 'سبب الحظر')}{' '}
                        <span className="text-destructive" aria-hidden="true">*</span>
                    </Label>
                    <Textarea
                        id="ban-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={t(
                            'Explain why this user is being banned...',
                            'اشرح سبب حظر هذا المستخدم...',
                        )}
                        rows={3}
                        maxLength={5000}
                        autoFocus
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {reason.length}/5000
                    </p>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={onCancel}>
                        {t('Cancel', 'إلغاء')}
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={reason.trim().length === 0}
                        onClick={() => onConfirm(reason.trim())}
                    >
                        {t('Confirm Ban', 'تأكيد الحظر')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── User Card ────────────────────────────────────────────────────────────────

type UserCardProps = {
    user: ManagedUser;
    roles: string[];
    saving: boolean;
    onUpdate: (userId: number, payload: RequestPayload) => void;
    onBanRequest: (user: ManagedUser) => void;
};

function UserCard({ user, roles, saving, onUpdate, onBanRequest }: UserCardProps) {
    const { t } = useLanguage();
    const locked = isLocked(user);

    const statusPill = user.is_banned
        ? 'border-destructive/25 bg-destructive/10 text-destructive'
        : !user.is_active
          ? 'border-border bg-muted/30 text-muted-foreground'
          : locked
            ? 'border-amber-300/25 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
            : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';

    const statusLabel = user.is_banned
        ? t('Banned', 'محظور')
        : !user.is_active
          ? t('Inactive', 'غير نشط')
          : locked
            ? t('Locked', 'مقفل')
            : t('Active', 'نشط');

    return (
        <div className="rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <UserCog className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
                        <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                            <span className="ms-2 text-xs font-medium text-muted-foreground">
                                #{user.id}
                            </span>
                        </p>
                        {!user.email_verified_at && (
                            <Badge variant="secondary" className="text-[10px] py-0 h-4">
                                {t('Unverified', 'غير موثق')}
                            </Badge>
                        )}
                        {locked && (
                            <Badge variant="outline" className="text-[10px] py-0 h-4 border-amber-300 text-amber-600">
                                <Lock className="size-2.5 mr-0.5" />
                                {t('Locked', 'مقفل')}
                            </Badge>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {user.email} · @{user.username}
                    </p>
                    {/* Meta: last login, joined */}
                    <div className="mt-1 flex gap-3 flex-wrap">
                        {user.last_login_at && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="size-3" />
                                {t('Last login', 'آخر دخول')}: {formatDate(user.last_login_at)}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            {t('Joined', 'انضم')}: {formatDate(user.created_at)}
                        </span>
                    </div>
                </div>

                <span className={cn('shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold', statusPill)}>
                    {statusLabel}
                </span>
            </div>

            {/* Ban reason */}
            {user.is_banned && user.ban_reason && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
                    <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-destructive mb-0.5">
                            {t('Ban reason', 'سبب الحظر')}
                            {user.banned_at && (
                                <span className="font-normal text-muted-foreground ml-1.5">
                                    · {formatDate(user.banned_at)}
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.ban_reason}</p>
                    </div>
                </div>
            )}

            {/* Locked info */}
            {locked && user.locked_until && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800/30 dark:bg-amber-900/10">
                    <Lock className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                        <p className="font-semibold text-amber-700 dark:text-amber-400">
                            {t('Account locked', 'الحساب مقفل')}
                        </p>
                        <p className="text-amber-600 dark:text-amber-500">
                            {t('Until', 'حتى')}: {formatDate(user.locked_until)}
                            {(user.login_attempts ?? 0) > 0 && (
                                <span className="ml-1.5">
                                    · {user.login_attempts} {t('failed attempts', 'محاولة فاشلة')}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Role */}
                <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{t('Role', 'الدور')}</Label>
                    <Select
                        value={user.role ?? 'visitor'}
                        onValueChange={(v) => onUpdate(user.id, { role: v })}
                        disabled={saving}
                    >
                        <SelectTrigger className="h-9 bg-background" aria-label={t('Change role', 'تغيير الدور')}>
                            <Shield className="me-2 size-3.5 text-muted-foreground" aria-hidden="true" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((r) => (
                                <SelectItem key={r} value={r}>
                                    {r}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold">{t('Active', 'نشط')}</p>
                        <p className="text-[11px] text-muted-foreground">
                            {t('Allow login', 'السماح بتسجيل الدخول')}
                        </p>
                    </div>
                    <Switch
                        checked={Boolean(user.is_active)}
                        onCheckedChange={(checked) => onUpdate(user.id, { is_active: checked })}
                        disabled={saving}
                        aria-label={t('Toggle active', 'تبديل الحالة النشطة')}
                    />
                </div>

                {/* Ban toggle — uses dialog for ban reason */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold">{t('Banned', 'محظور')}</p>
                        <p className="text-[11px] text-muted-foreground">
                            {t('Block access', 'منع الوصول')}
                        </p>
                    </div>
                    <Switch
                        checked={Boolean(user.is_banned)}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                // Show ban reason dialog before actually banning
                                onBanRequest(user);
                            } else {
                                // Unban immediately
                                onUpdate(user.id, { is_banned: false });
                            }
                        }}
                        disabled={saving}
                        aria-label={t('Toggle ban', 'تبديل الحظر')}
                    />
                </div>
            </div>

            {/* Unlock account shortcut */}
            {locked && (
                <div className="mt-3 flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800/30 dark:text-amber-400"
                        disabled={saving}
                        onClick={() =>
                            onUpdate(user.id, { is_active: true })
                        }
                    >
                        <Lock className="size-3 mr-1.5" />
                        {t('Unlock Account', 'فتح الحساب')}
                    </Button>
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersSettings() {
    const { t, direction } = useLanguage();
    const isRtl = direction === 'rtl';
    const uid = useId();

    const { users = [], roles = [], flash } = usePage<PageProps>().props;

    const [filters,   setFilters]   = useState<Filters>(INITIAL_FILTERS);
    const [savingId,  setSavingId]  = useState<number | null>(null);
    const [banTarget, setBanTarget] = useState<ManagedUser | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('Settings', 'الإعدادات'), href: edit().url },
        { title: t('Users', 'المستخدمون'), href: '/settings/users' },
    ];

    // ── Filtering ──────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        return users.filter((u) => {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const matches =
                    u.name.toLowerCase().includes(q) ||
                    u.username.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) ||
                    String(u.id).includes(filters.search);
                if (!matches) return false;
            }

            if (filters.role !== 'all' && (u.role ?? '') !== filters.role) return false;

            if (filters.status !== 'all') {
                if (filters.status === 'banned'   && !u.is_banned) return false;
                if (filters.status === 'active'   && (!u.is_active || u.is_banned)) return false;
                if (filters.status === 'inactive' && u.is_active) return false;
                if (filters.status === 'locked'   && !isLocked(u)) return false;
            }

            return true;
        });
    }, [filters, users]);

    const hasActiveFilters =
        filters.search.trim() !== '' ||
        filters.role !== 'all' ||
        filters.status !== 'all';

    // ── Actions ────────────────────────────────────────────────────────────

    function updateUser(userId: number, payload: RequestPayload) {
        setSavingId(userId);
        router.patch(`/settings/users/${userId}`, payload, {
            preserveScroll: true,
            onFinish: () => setSavingId(null),
        });
    }

    function confirmBan(reason: string) {
        if (!banTarget) return;
        updateUser(banTarget.id, { is_banned: true, ban_reason: reason });
        setBanTarget(null);
    }

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('User management', 'إدارة المستخدمين')} />
            <h1 className="sr-only">{t('User management', 'إدارة المستخدمين')}</h1>

            {/* Ban reason dialog — rendered at root so it's above everything */}
            {banTarget && (
                <BanReasonDialog
                    user={banTarget}
                    onConfirm={confirmBan}
                    onCancel={() => setBanTarget(null)}
                />
            )}

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('User & Role Management', 'إدارة المستخدمين والأدوار')}
                        description={t(
                            'Manage user roles, account status, and access control.',
                            'إدارة أدوار المستخدمين وحالة الحساب والتحكم في الوصول.',
                        )}
                    />

                    {/* Flash messages */}
                    <AnimatePresence>
                        {flash?.success && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
                            >
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                <span className="font-medium">{flash.success}</span>
                            </motion.div>
                        )}
                        {flash?.error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                            >
                                <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                <span className="font-medium">{flash.error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filters */}
                    <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {/* Search */}
                            <div className="relative flex-1" role="search">
                                <Search
                                    className={cn(
                                        'pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground',
                                        isRtl ? 'right-3' : 'left-3',
                                    )}
                                    aria-hidden="true"
                                />
                                <Input
                                    id={`${uid}-search`}
                                    type="search"
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters((p) => ({ ...p, search: e.target.value }))
                                    }
                                    placeholder={t('Search by name, email, or username…', 'ابحث بالاسم أو البريد أو اسم المستخدم…')}
                                    className={cn('h-9 bg-background', isRtl ? 'pr-9' : 'pl-9')}
                                    aria-label={t('Search users', 'بحث في المستخدمين')}
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Role filter */}
                                <Select
                                    value={filters.role}
                                    onValueChange={(v) =>
                                        setFilters((p) => ({ ...p, role: v }))
                                    }
                                >
                                    <SelectTrigger
                                        className="h-9 w-44 bg-background"
                                        aria-label={t('Filter by role', 'تصفية حسب الدور')}
                                    >
                                        <Filter className="me-2 size-3.5 text-muted-foreground" aria-hidden="true" />
                                        <SelectValue placeholder={t('Role', 'الدور')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('All roles', 'كل الأدوار')}
                                        </SelectItem>
                                        {roles.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {r}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Status filter */}
                                <Select
                                    value={filters.status}
                                    onValueChange={(v) =>
                                        setFilters((p) => ({
                                            ...p,
                                            status: v as Filters['status'],
                                        }))
                                    }
                                >
                                    <SelectTrigger
                                        className="h-9 w-44 bg-background"
                                        aria-label={t('Filter by status', 'تصفية حسب الحالة')}
                                    >
                                        <SelectValue placeholder={t('Status', 'الحالة')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('All statuses', 'كل الحالات')}
                                        </SelectItem>
                                        <SelectItem value="active">
                                            {t('Active', 'نشط')}
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            {t('Inactive', 'غير نشط')}
                                        </SelectItem>
                                        <SelectItem value="banned">
                                            {t('Banned', 'محظور')}
                                        </SelectItem>
                                        <SelectItem value="locked">
                                            {t('Locked', 'مقفل')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                                        onClick={() => setFilters(INITIAL_FILTERS)}
                                        aria-label={t('Clear all filters', 'مسح كل المرشحات')}
                                    >
                                        <X className="size-3.5" aria-hidden="true" />
                                        {t('Clear', 'مسح')}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <p
                                className="mt-2 text-xs text-muted-foreground"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {t(
                                    `${filtered.length} user${filtered.length !== 1 ? 's' : ''} found`,
                                    `تم العثور على ${filtered.length} مستخدم`,
                                )}
                            </p>
                        )}
                    </div>

                    {/* User list */}
                    <div className="space-y-3">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center">
                                <UserCog className="size-8 text-muted-foreground/40 mb-3" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('No users found', 'لم يتم العثور على مستخدمين')}
                                </p>
                                {hasActiveFilters && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="mt-1 text-xs"
                                        onClick={() => setFilters(INITIAL_FILTERS)}
                                    >
                                        {t('Clear filters', 'مسح المرشحات')}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            filtered.map((u) => (
                                <UserCard
                                    key={u.id}
                                    user={u}
                                    roles={roles}
                                    saving={savingId === u.id}
                                    onUpdate={updateUser}
                                    onBanRequest={setBanTarget}
                                />
                            ))
                        )}
                    </div>

                    {/* Summary */}
                    {filtered.length > 0 && (
                        <p className="text-xs text-muted-foreground text-center">
                            {t(
                                `Showing ${filtered.length} of ${users.length} users`,
                                `عرض ${filtered.length} من أصل ${users.length} مستخدم`,
                            )}
                        </p>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}