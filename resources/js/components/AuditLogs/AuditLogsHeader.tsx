import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Download, Filter, Search, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AuditLogAction, AuditLogFilters, AuditLogResource, AuditLogSeverity } from './types';

interface AuditLogsHeaderProps {
  filters: AuditLogFilters;
  onFiltersChange: (partial: Partial<AuditLogFilters>) => void;
  onClearFilters: () => void;
  resultCount: number;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}

const ACTION_OPTIONS: { value: AuditLogAction | 'all'; en: string; ar: string }[] = [
  { value: 'all',      en: 'All Actions',   ar: 'جميع الإجراءات' },
  { value: 'login',    en: 'Login',         ar: 'تسجيل الدخول' },
  { value: 'logout',   en: 'Logout',        ar: 'تسجيل الخروج' },
  { value: 'create',   en: 'Create',        ar: 'إنشاء' },
  { value: 'update',   en: 'Update',        ar: 'تحديث' },
  { value: 'delete',   en: 'Delete',        ar: 'حذف' },
  { value: 'view',     en: 'View',          ar: 'عرض' },
  { value: 'export',   en: 'Export',        ar: 'تصدير' },
  { value: 'import',   en: 'Import',        ar: 'استيراد' },
  { value: 'approve',  en: 'Approve',       ar: 'موافقة' },
  { value: 'reject',   en: 'Reject',        ar: 'رفض' },
];

const RESOURCE_OPTIONS: { value: AuditLogResource | 'all'; en: string; ar: string }[] = [
  { value: 'all',           en: 'All Resources',    ar: 'جميع الموارد' },
  { value: 'beneficiaries', en: 'Beneficiaries',    ar: 'المستفيدون' },
  { value: 'bank_accounts', en: 'Bank Accounts',    ar: 'الحسابات البنكية' },
  { value: 'users',         en: 'Users',            ar: 'المستخدمون' },
  { value: 'settings',      en: 'Settings',         ar: 'الإعدادات' },
  { value: 'transfers',     en: 'Transfers',        ar: 'التحويلات' },
  { value: 'reports',       en: 'Reports',          ar: 'التقارير' },
  { value: 'system',        en: 'System',           ar: 'النظام' },
];

const SEVERITY_OPTIONS: { value: AuditLogSeverity | 'all'; en: string; ar: string }[] = [
  { value: 'all',      en: 'All Severities', ar: 'جميع المستويات' },
  { value: 'info',     en: 'Info',          ar: 'معلومات' },
  { value: 'warning',  en: 'Warning',       ar: 'تحذير' },
  { value: 'error',    en: 'Error',         ar: 'خطأ' },
  { value: 'critical', en: 'Critical',      ar: 'حرج' },
];

const DATE_RANGE_OPTIONS: { value: 'all' | 'today' | 'week' | 'month'; en: string; ar: string }[] = [
  { value: 'all',    en: 'All Time',   ar: 'كل الوقت' },
  { value: 'today',  en: 'Today',     ar: 'اليوم' },
  { value: 'week',   en: 'This Week', ar: 'هذا الأسبوع' },
  { value: 'month',  en: 'This Month', ar: 'هذا الشهر' },
];

function hasActiveFilters(filters: AuditLogFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.action !== 'all' ||
    filters.resource !== 'all' ||
    filters.severity !== 'all' ||
    filters.dateRange !== 'all'
  );
}

export function AuditLogsHeader({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  isRtl,
  t,
}: AuditLogsHeaderProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="border-b border-border bg-card">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary">
              <Shield className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t('Audit Logs', 'سجلات التدقيق')}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(
                  'Track system activities and security events.',
                  'تتبع أنشطة النظام والأحداث الأمنية.',
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="shrink-0 gap-2">
              <Download className={cn('size-4', isRtl ? 'ms-1' : 'me-1')} />
              {t('Export', 'تصدير')}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className={cn(
                'absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground',
                isRtl ? 'right-3' : 'left-3',
              )}
            />
            <Input
              placeholder={t('Search audit logs...', 'بحث في سجلات التدقيق...')}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className={cn('h-9 bg-background', isRtl ? 'pr-9' : 'pl-9')}
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFiltersChange({ search: '' })}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground',
                  isRtl ? 'left-2' : 'right-2',
                )}
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filters.action}
              onValueChange={(v) => onFiltersChange({ action: v as AuditLogAction | 'all' })}
            >
              <SelectTrigger className="h-9 w-40 bg-background">
                <Filter className="me-2 size-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.resource}
              onValueChange={(v) => onFiltersChange({ resource: v as AuditLogResource | 'all' })}
            >
              <SelectTrigger className="h-9 w-40 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.severity}
              onValueChange={(v) => onFiltersChange({ severity: v as AuditLogSeverity | 'all' })}
            >
              <SelectTrigger className="h-9 w-32 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(v) => onFiltersChange({ dateRange: v as 'all' | 'today' | 'week' | 'month' })}
            >
              <SelectTrigger className="h-9 w-32 bg-background">
                <Calendar className="me-2 size-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {active && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
                {t('Clear', 'مسح')}
              </Button>
            )}
          </div>
        </div>

        {active && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-muted-foreground"
          >
            {t(`${resultCount} logs found`, `تم العثور على ${resultCount} سجل`)}
          </motion.p>
        )}
      </div>
    </div>
  );
}
