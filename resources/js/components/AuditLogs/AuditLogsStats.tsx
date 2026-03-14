import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, CheckCircle, Clock, Eye, Shield, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditLog, AuditLogStats } from './types';

interface AuditLogsStatsProps {
  logs: AuditLog[];
  t: (en: string, ar: string) => string;
  isRtl: boolean;
}

function computeStats(logs: AuditLog[]): AuditLogStats {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    total: logs.length,
    byAction: logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] ?? 0) + 1;
        return acc;
      },
      {} as AuditLogStats['byAction'],
    ),
    byResource: logs.reduce(
      (acc, log) => {
        acc[log.resource] = (acc[log.resource] ?? 0) + 1;
        return acc;
      },
      {} as AuditLogStats['byResource'],
    ),
    bySeverity: logs.reduce(
      (acc, log) => {
        acc[log.severity] = (acc[log.severity] ?? 0) + 1;
        return acc;
      },
      {} as AuditLogStats['bySeverity'],
    ),
    today: logs.filter(log => new Date(log.createdAt) >= today).length,
    thisWeek: logs.filter(log => new Date(log.createdAt) >= weekAgo).length,
    thisMonth: logs.filter(log => new Date(log.createdAt) >= monthAgo).length,
  };
}

interface ChipProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  highlight?: boolean;
  variant?: 'default' | 'warning' | 'error';
}

function Chip({ icon: Icon, label, value, highlight, variant = 'default' }: ChipProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'warning':
        return 'border-orange-200 bg-orange-50 text-orange-700';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-700';
      default:
        return highlight
          ? 'border-primary/25 bg-primary/10 text-primary'
          : 'border-border bg-card text-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium',
        getVariantClasses(),
      )}
    >
      <Icon className="size-4 shrink-0 opacity-70" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </motion.div>
  );
}

export function AuditLogsStats({ logs, t, isRtl }: AuditLogsStatsProps) {
  if (logs.length === 0) return null;

  const stats = computeStats(logs);
  const criticalCount = stats.bySeverity.critical ?? 0;
  const errorCount = stats.bySeverity.error ?? 0;
  const warningCount = stats.bySeverity.warning ?? 0;
  const topResource = Object.entries(stats.byResource).sort(([, a], [, b]) => b - a)[0];
  const topAction = Object.entries(stats.byAction).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="flex flex-wrap gap-2.5">
      <Chip icon={Shield} label={t('Total', 'إجمالي')} value={stats.total} highlight />
      
      <Chip icon={Calendar} label={t('Today', 'اليوم')} value={stats.today} />
      
      <Chip icon={Clock} label={t('This Week', 'هذا الأسبوع')} value={stats.thisWeek} />
      
      <Chip icon={TrendingUp} label={t('This Month', 'هذا الشهر')} value={stats.thisMonth} />
      
      {criticalCount > 0 && (
        <Chip 
          icon={AlertTriangle} 
          label={t('Critical', 'حرج')} 
          value={criticalCount} 
          variant="error" 
        />
      )}
      
      {errorCount > 0 && (
        <Chip 
          icon={AlertTriangle} 
          label={t('Errors', 'أخطاء')} 
          value={errorCount} 
          variant="error" 
        />
      )}
      
      {warningCount > 0 && (
        <Chip 
          icon={AlertTriangle} 
          label={t('Warnings', 'تحذيرات')} 
          value={warningCount} 
          variant="warning" 
        />
      )}
      
      {topResource && (
        <Chip
          icon={Eye}
          label={t('Top resource', 'المورد الأكثر')}
          value={topResource[0]}
        />
      )}
      
      {topAction && (
        <Chip
          icon={Users}
          label={t('Top action', 'الإجراء الأكثر')}
          value={topAction[0]}
        />
      )}
    </div>
  );
}
