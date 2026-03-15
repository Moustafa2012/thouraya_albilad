import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Eye,
  Globe,
  Info,
  LogIn,
  LogOut,
  Shield,
  Trash2,
  Upload,
  Download,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  User,
  Calendar,
  Network,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AuditLog } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AuditLogCardProps {
  log: AuditLog;
  index: number;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}

type Severity = 'info' | 'warning' | 'error' | 'critical';
type Action   = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'import' | 'approve' | 'reject';
type Resource = 'beneficiaries' | 'bank_accounts' | 'users' | 'settings' | 'transfers' | 'reports' | 'system' | string;

// ─────────────────────────────────────────────────────────────────────────────
// Configuration maps
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, {
  icon: React.ElementType;
  label: { en: string; ar: string };
  bar: string;
  badge: string;
  dot: string;
}> = {
  info: {
    icon: Info,
    label: { en: 'Info', ar: 'معلومات' },
    bar: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    label: { en: 'Warning', ar: 'تحذير' },
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  error: {
    icon: AlertTriangle,
    label: { en: 'Error', ar: 'خطأ' },
    bar: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
    dot: 'bg-red-500',
  },
  critical: {
    icon: AlertTriangle,
    label: { en: 'Critical', ar: 'حرج' },
    bar: 'bg-rose-600',
    badge: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    dot: 'bg-rose-600',
  },
};

const ACTION_CONFIG: Record<Action, {
  icon: React.ElementType;
  label: { en: string; ar: string };
  iconClass: string;
}> = {
  login:   { icon: LogIn,      label: { en: 'Login',    ar: 'تسجيل دخول' },  iconClass: 'text-emerald-600 dark:text-emerald-400' },
  logout:  { icon: LogOut,     label: { en: 'Logout',   ar: 'تسجيل خروج' },  iconClass: 'text-slate-500 dark:text-slate-400' },
  create:  { icon: CheckCircle,label: { en: 'Created',  ar: 'تم الإنشاء' },   iconClass: 'text-blue-600 dark:text-blue-400' },
  update:  { icon: Pencil,     label: { en: 'Updated',  ar: 'تم التحديث' },   iconClass: 'text-amber-600 dark:text-amber-400' },
  delete:  { icon: Trash2,     label: { en: 'Deleted',  ar: 'تم الحذف' },     iconClass: 'text-red-600 dark:text-red-400' },
  view:    { icon: Eye,        label: { en: 'Viewed',   ar: 'تم العرض' },     iconClass: 'text-indigo-600 dark:text-indigo-400' },
  export:  { icon: Download,   label: { en: 'Exported', ar: 'تم التصدير' },   iconClass: 'text-purple-600 dark:text-purple-400' },
  import:  { icon: Upload,     label: { en: 'Imported', ar: 'تم الاستيراد' }, iconClass: 'text-teal-600 dark:text-teal-400' },
  approve: { icon: ThumbsUp,   label: { en: 'Approved', ar: 'تمت الموافقة' }, iconClass: 'text-green-600 dark:text-green-400' },
  reject:  { icon: ThumbsDown, label: { en: 'Rejected', ar: 'تم الرفض' },     iconClass: 'text-rose-600 dark:text-rose-400' },
};

const RESOURCE_CONFIG: Record<Resource, { label: { en: string; ar: string } }> = {
  beneficiaries: { label: { en: 'Beneficiary',  ar: 'مستفيد' } },
  bank_accounts: { label: { en: 'Bank Account', ar: 'حساب بنكي' } },
  users:         { label: { en: 'User',         ar: 'مستخدم' } },
  settings:      { label: { en: 'Settings',     ar: 'الإعدادات' } },
  transfers:     { label: { en: 'Transfer',     ar: 'تحويل' } },
  reports:       { label: { en: 'Report',       ar: 'تقرير' } },
  system:        { label: { en: 'System',       ar: 'النظام' } },
};

const DESCRIPTION_MAP: Record<string, { en: string; ar: string }> = {
  'User logged in successfully':                { en: 'User logged in successfully',         ar: 'قام المستخدم بتسجيل الدخول بنجاح' },
  'User logged out':                            { en: 'User logged out',                     ar: 'قام المستخدم بتسجيل الخروج' },
  'Failed login attempt':                       { en: 'Failed login attempt',                ar: 'محاولة تسجيل دخول فاشلة' },
  'User changed their password':                { en: 'Password changed',                    ar: 'قام المستخدم بتغيير كلمة المرور' },
  'User reset their password':                  { en: 'Password reset',                      ar: 'قام المستخدم بإعادة تعيين كلمة المرور' },
  'User profile information updated':           { en: 'Profile updated',                     ar: 'تم تحديث معلومات ملف المستخدم' },
  'Two-factor authentication enabled':          { en: '2FA enabled',                         ar: 'تم تفعيل المصادقة الثنائية' },
  'Two-factor authentication disabled':         { en: '2FA disabled',                        ar: 'تم تعطيل المصادقة الثنائية' },
  'User account locked due to security concerns':{ en: 'Account locked',                    ar: 'تم قفل الحساب لأسباب أمنية' },
  'User account unlocked':                      { en: 'Account unlocked',                    ar: 'تم فتح قفل الحساب' },
  'New user account created':                   { en: 'New account created',                 ar: 'تم إنشاء حساب مستخدم جديد' },
  'Multiple concurrent sessions detected':      { en: 'Multiple concurrent sessions',        ar: 'تم اكتشاف جلسات متعددة في نفس الوقت' },
  'Login from new device detected':             { en: 'Login from new device',               ar: 'تم تسجيل الدخول من جهاز جديد' },
  'Login from new location detected':           { en: 'Login from new location',             ar: 'تم تسجيل الدخول من موقع جديد' },
};

const FIELD_LABELS: Record<string, string> = {
  name: 'الاسم', email: 'البريد الإلكتروني', password: 'كلمة المرور',
  phone: 'رقم الهاتف', address: 'العنوان', status: 'الحالة', role: 'الدور',
  created_at: 'تاريخ الإنشاء', updated_at: 'تاريخ التحديث', ip_address: 'عنوان IP',
  user_agent: 'وكيل المستخدم', device_type: 'نوع الجهاز', browser: 'المتصفح',
  platform: 'النظام الأساسي', location: 'الموقع', country_code: 'رمز البلد',
  failure_reason: 'سبب الفشل', session_duration: 'مدة الجلسة',
  login_attempts: 'محاولات تسجيل الدخول', two_factor_passed: 'تم تمرير المصادقة الثنائية',
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function MetadataPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
      <span className="font-medium text-foreground/70">{label}</span>
      <span className="text-muted-foreground/60">·</span>
      <span>{value}</span>
    </span>
  );
}

function DiffRow({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2 text-xs py-1.5 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground font-medium min-w-[80px]">{label}</span>
      <span className="font-mono text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded px-1.5 py-0.5 truncate">{before}</span>
      <ArrowRight className="size-3 text-muted-foreground/50 flex-shrink-0" />
      <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded px-1.5 py-0.5 truncate">{after}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function AuditLogCard({ log, index, isRtl, t }: AuditLogCardProps) {
  const [expanded, setExpanded] = useState(false);

  const severityCfg  = SEVERITY_CONFIG[log.severity as Severity]  ?? SEVERITY_CONFIG.info;
  const actionCfg    = ACTION_CONFIG[log.action as Action]         ?? ACTION_CONFIG.view;
  const resourceCfg  = RESOURCE_CONFIG[log.resource as Resource]   ?? { label: { en: log.resource, ar: log.resource } };

  const SeverityIcon = severityCfg.icon;
  const ActionIcon   = actionCfg.icon;

  const hasDetails =
    (log.metadata && Object.keys(log.metadata).length > 0) ||
    (log.oldValues && log.newValues);

  const hasDiff = !!(log.oldValues && log.newValues);

  const resolveDescription = (desc: string) => {
    const match = DESCRIPTION_MAP[desc];
    return match ? t(match.en, match.ar) : desc;
  };

  const fieldLabel = (key: string) => isRtl ? (FIELD_LABELS[key] ?? key) : key;

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(isRtl ? 'ar-SA' : 'en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(date));

  // Merged diff keys
  const diffKeys = hasDiff
    ? Array.from(new Set([...Object.keys(log.oldValues!), ...Object.keys(log.newValues!)]))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border bg-card',
        'shadow-sm transition-shadow duration-200 hover:shadow-md',
        log.severity === 'critical' && 'border-rose-200 dark:border-rose-900/60',
        log.severity === 'warning'  && 'border-amber-200 dark:border-amber-900/60',
      )}
    >
      {/* Severity accent bar */}
      <div className={cn('absolute inset-y-0 start-0 w-[3px]', severityCfg.bar)} />

      <div className="ps-4 pe-2 py-2">
        {/* ── Single compact row ── */}
        <div className={cn(
          'flex items-center gap-2 min-w-0',
          isRtl && 'flex-row-reverse',
        )}>
          {/* Severity badge */}
          <span className={cn(
            'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide flex-shrink-0',
            severityCfg.badge,
          )}>
            <SeverityIcon className="size-2.5" />
            {t(severityCfg.label.en, severityCfg.label.ar)}
          </span>

          {/* Action chip */}
          <span className="inline-flex items-center gap-1 rounded bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60 flex-shrink-0">
            <ActionIcon className={cn('size-2.5', actionCfg.iconClass)} />
            {t(actionCfg.label.en, actionCfg.label.ar)}
          </span>

          {/* Resource chip */}
          <span className="inline-flex items-center gap-1 rounded bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border/40 flex-shrink-0">
            <Shield className="size-2.5 opacity-60" />
            {t(resourceCfg.label.en, resourceCfg.label.ar)}
            {log.resourceId && (
              <span className="font-mono opacity-50">#{log.resourceId}</span>
            )}
          </span>

          {/* Divider */}
          <span className="text-border/60 flex-shrink-0 select-none text-xs">·</span>

          {/* Description — flex-1 so it takes remaining space and truncates */}
          <p className="text-xs font-medium text-foreground truncate flex-1 min-w-0">
            {resolveDescription(log.description)}
          </p>

          {/* User — hidden on small screens */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
            <User className="size-2.5 opacity-50" />
            <span className="font-medium text-foreground/70 max-w-[240px] truncate">
              {log.userName || t('System', 'النظام')}
            </span>
          </span>

          {/* IP — hidden on medium and below */}
          {log.ipAddress && log.ipAddress !== 'N/A' && (
            <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground/70 flex-shrink-0">
              <Network className="size-2.5 opacity-50" />
              {log.ipAddress}
            </span>
          )}

          {/* Timestamp */}
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/60 whitespace-nowrap flex-shrink-0">
            <Calendar className="size-2.5 opacity-50" />
            {formatDate(log.createdAt)}
          </span>

          {/* Expand toggle */}
          {hasDetails && (
            <button
              onClick={() => setExpanded(v => !v)}
              className={cn(
                'flex-shrink-0 flex items-center justify-center size-5 rounded',
                'text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150',
              )}
            >
              <ChevronDown
                className={cn(
                  'size-3 transition-transform duration-200',
                  expanded && 'rotate-180',
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* ── Expandable details panel ── */}
      <AnimatePresence initial={false}>
        {expanded && hasDetails && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mx-3 mb-3 rounded-lg border border-border/70 bg-muted/30 divide-y divide-border/50">

              {/* Metadata pills */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div className="px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                    {t('Metadata', 'البيانات الوصفية')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <MetadataPill
                        key={key}
                        label={fieldLabel(key)}
                        value={String(value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Inline diff table */}
              {hasDiff && (
                <div className="px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                    {t('Changes', 'التغييرات')}
                  </p>
                  <div className="space-y-0">
                    {diffKeys.map(key => {
                      const before = String(log.oldValues![key] ?? '—');
                      const after  = String(log.newValues![key] ?? '—');
                      if (before === after) return null;
                      return (
                        <DiffRow
                          key={key}
                          label={fieldLabel(key)}
                          before={before}
                          after={after}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}