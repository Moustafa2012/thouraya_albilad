export type AuditLogAction =
  | 'login' | 'logout' | 'create' | 'update' | 'delete'
  | 'view' | 'export' | 'import' | 'approve' | 'reject';

export type AuditLogResource =
  | 'beneficiaries' | 'bank_accounts' | 'users' | 'settings'
  | 'transfers' | 'reports' | 'system';

export type AuditLogSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLog {
  id: string;
  action: AuditLogAction;
  resource: AuditLogResource;
  resourceId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  description: string;
  metadata?: Record<string, unknown>;
  severity: AuditLogSeverity;
  createdAt: Date;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export interface AuditLogFilters {
  search: string;
  action: AuditLogAction | 'all';
  resource: AuditLogResource | 'all';
  severity: AuditLogSeverity | 'all';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface AuditLogStats {
  total: number;
  byAction: Partial<Record<AuditLogAction, number>>;
  byResource: Partial<Record<AuditLogResource, number>>;
  bySeverity: Partial<Record<AuditLogSeverity, number>>;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_more_pages: boolean;
}
