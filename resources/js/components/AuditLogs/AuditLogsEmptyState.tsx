import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Database, 
  Shield, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuditLogsEmptyStateProps {
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  hasSearch?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const FEATURES = [
  { en: 'Track all user activities', ar: 'تتبع جميع أنشطة المستخدمين', icon: Users },
  { en: 'Security event monitoring', ar: 'مراقبة الأحداث الأمنية', icon: Shield },
  { en: 'Detailed audit trails', ar: 'سجلات تدقيق مفصلة', icon: Database },
  { en: 'Real-time event logging', ar: 'تسجيل الأحداث في الوقت الفعلي', icon: Calendar },
];

export function AuditLogsEmptyState({
  isRtl,
  t,
  hasSearch = false,
  searchQuery = '',
  onClearSearch,
}: AuditLogsEmptyStateProps) {
  if (hasSearch && searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-8 py-16 text-center"
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
          <AlertTriangle className="size-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('No logs found', 'لم يتم العثور على سجلات')}
        </h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
          {t(
            `No audit logs matching "${searchQuery}" were found.`,
            `لم يتم العثور على سجلات تدقيق تطابق "${searchQuery}".`,
          )}
        </p>
        {onClearSearch && (
          <Button variant="outline" size="sm" onClick={onClearSearch}>
            {t('Clear search', 'مسح البحث')}
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="col-span-full"
    >
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/30 px-8 py-20 text-center">
        <div className="mb-6 flex size-24 items-center justify-center rounded-3xl border border-primary/15 bg-primary/8 text-primary/50">
          <Shield className="size-11" />
        </div>

        <h2 className="mb-3 text-2xl font-bold text-foreground">
          {t('No audit logs yet', 'لا توجد سجلات تدقيق بعد')}
        </h2>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t(
            'Audit logs will appear here once system activities are recorded.',
            'ستظهر سجلات التدقيق هنا بمجرد تسجيل أنشطة النظام.',
          )}
        </p>

        <div className="mb-8 flex flex-col items-start gap-3 rounded-xl border border-border bg-card px-6 py-4 text-start">
          {FEATURES.map(({ en, ar, icon: Icon }) => (
            <div key={en} className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-3.5" />
              </span>
              <span className="text-sm text-muted-foreground">{t(en, ar)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="size-3.5 text-green-500" />
          {t('Automatic logging enabled', 'تم تفعيل التسجيل التلقائي')}
        </div>
      </div>
    </motion.div>
  );
}
