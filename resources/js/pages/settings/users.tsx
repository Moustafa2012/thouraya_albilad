import type { RequestPayload } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Filter, Search, Shield, UserCog, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

type ManagedUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  is_banned: boolean;
  ban_reason?: string | null;
  email_verified_at?: string | null;
  created_at: string;
};

type PageProps = {
  users: ManagedUser[];
  roles: string[];
  flash?: { success?: string; error?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: edit().url,
  },
  {
    title: 'Users',
    href: '/settings/users',
  },
];

type Filters = {
  search: string;
  role: 'all' | string;
  status: 'all' | 'active' | 'inactive' | 'banned';
};

const INITIAL_FILTERS: Filters = {
  search: '',
  role: 'all',
  status: 'all',
};

export default function UsersSettings() {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const uid = useId();

  const { users = [], roles = [], flash } = usePage().props as unknown as PageProps;

  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [savingId, setSavingId] = useState<number | null>(null);

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

      if (filters.role !== 'all' && (u.role ?? '').toString() !== filters.role) return false;

      if (filters.status !== 'all') {
        if (filters.status === 'banned' && !u.is_banned) return false;
        if (filters.status === 'active' && (!u.is_active || u.is_banned)) return false;
        if (filters.status === 'inactive' && u.is_active) return false;
      }

      return true;
    });
  }, [filters, users]);

  const hasActiveFilters =
    filters.search.trim() !== '' || filters.role !== 'all' || filters.status !== 'all';

  function updateUser(userId: number, payload: RequestPayload) {
    setSavingId(userId);
    router.patch(`/settings/users/${userId}`, payload, {
      preserveScroll: true,
      onFinish: () => setSavingId(null),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('User management', 'إدارة المستخدمين')} />

      <h1 className="sr-only">{t('User management', 'إدارة المستخدمين')}</h1>

      <SettingsLayout>
        <div className="space-y-6">
          <Heading
            variant="small"
            title={t('User & roles management', 'إدارة المستخدمين والأدوار')}
            description={t('Manage roles and account status.', 'إدارة الأدوار وحالة الحساب.')}
          />

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

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                  placeholder={t('Search users...', 'بحث في المستخدمين...')}
                  className={cn('h-9 bg-background', isRtl ? 'pr-9' : 'pl-9')}
                  aria-label={t('Search users', 'بحث في المستخدمين')}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={filters.role} onValueChange={(v) => setFilters((p) => ({ ...p, role: v }))}>
                  <SelectTrigger className="h-9 w-44 bg-background" aria-label={t('Filter by role', 'تصفية حسب الدور')}>
                    <Filter className="me-2 size-3.5 text-muted-foreground" aria-hidden="true" />
                    <SelectValue placeholder={t('Role', 'الدور')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('All roles', 'كل الأدوار')}</SelectItem>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(v) => setFilters((p) => ({ ...p, status: v as Filters['status'] }))}>
                  <SelectTrigger className="h-9 w-44 bg-background" aria-label={t('Filter by status', 'تصفية حسب الحالة')}>
                    <SelectValue placeholder={t('Status', 'الحالة')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('All statuses', 'كل الحالات')}</SelectItem>
                    <SelectItem value="active">{t('Active', 'نشط')}</SelectItem>
                    <SelectItem value="inactive">{t('Inactive', 'غير نشط')}</SelectItem>
                    <SelectItem value="banned">{t('Banned', 'محظور')}</SelectItem>
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
              <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                {t(`${filtered.length} users found`, `تم العثور على ${filtered.length} مستخدم`)}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {filtered.map((u) => {
              const saving = savingId === u.id;
              const statusPill = u.is_banned
                ? 'border-destructive/25 bg-destructive/10 text-destructive'
                : u.is_active
                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-border bg-muted/30 text-muted-foreground';

              return (
                <div key={u.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <UserCog className="size-4 text-muted-foreground" aria-hidden="true" />
                        <p className="truncate text-sm font-semibold text-foreground">
                          {u.name}
                          <span className="ms-2 text-xs font-medium text-muted-foreground">
                            #{u.id}
                          </span>
                        </p>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {u.email} · {u.username}
                      </p>
                    </div>

                    <span className={cn('shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold', statusPill)}>
                      {u.is_banned ? t('Banned', 'محظور') : u.is_active ? t('Active', 'نشط') : t('Inactive', 'غير نشط')}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">{t('Role', 'الدور')}</Label>
                      <Select
                        value={u.role ?? 'visitor'}
                        onValueChange={(v) => updateUser(u.id, { role: v })}
                        disabled={saving}
                      >
                        <SelectTrigger className="h-9 bg-background">
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

                    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">{t('Active', 'نشط')}</p>
                        <p className="text-[11px] text-muted-foreground">{t('Allow login', 'السماح بتسجيل الدخول')}</p>
                      </div>
                      <Switch
                        checked={Boolean(u.is_active)}
                        onCheckedChange={(checked) => updateUser(u.id, { is_active: checked })}
                        disabled={saving}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">{t('Banned', 'محظور')}</p>
                        <p className="text-[11px] text-muted-foreground">{t('Block access', 'منع الوصول')}</p>
                      </div>
                      <Switch
                        checked={Boolean(u.is_banned)}
                        onCheckedChange={(checked) => updateUser(u.id, { is_banned: checked })}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
