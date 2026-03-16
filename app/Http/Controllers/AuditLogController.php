<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\UserActivityLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AuditLogController extends Controller
{
    private const PER_PAGE_MAX = 100;

    private const PER_PAGE_DEFAULT = 50;

    private const CACHE_TTL_LOGS = 5;   // minutes

    private const CACHE_TTL_STATS = 15;  // minutes

    // -------------------------------------------------------------------------
    // Action mappings
    // -------------------------------------------------------------------------

    private const ACTION_MAP = [
        'create' => 'create',
        'update' => 'update',
        'delete' => 'delete',
        'login' => 'login',
        'logout' => 'logout',
        'view' => 'view',
        'export' => 'export',
        'import' => 'import',
        'sent_email' => 'sent_email',
        'email' => 'sent_email',
        'approve' => 'approve',
        'reject' => 'reject',
    ];

    private const SEVERITY_CRITICAL_KEYWORDS = ['delete', 'suspend', 'lock', 'ban', 'revoke'];

    private const SEVERITY_WARNING_KEYWORDS = ['failed', 'suspicious', 'denied', 'blocked'];

    private const ACTIVITY_SEVERITY_MAP = [
        'login_failed' => 'warning',
        'account_locked' => 'warning',
        'concurrent_sessions' => 'warning',
        'new_device_detected' => 'warning',
        'new_location_detected' => 'warning',
        'two_factor_disabled' => 'warning',
    ];

    private const ACTIVITY_ACTION_MAP = [
        'login' => 'login',
        'logout' => 'logout',
        'login_failed' => 'login',
        'password_changed' => 'update',
        'password_reset' => 'update',
        'profile_updated' => 'update',
        'two_factor_enabled' => 'create',
        'two_factor_disabled' => 'delete',
        'account_locked' => 'delete',
        'account_unlocked' => 'create',
        'user_registered' => 'create',
        'concurrent_sessions' => 'view',
        'new_device_detected' => 'view',
        'new_location_detected' => 'view',
    ];

    private const ACTIVITY_DESCRIPTION_MAP = [
        'login' => 'قام المستخدم بتسجيل الدخول بنجاح',
        'logout' => 'قام المستخدم بتسجيل الخروج',
        'login_failed' => 'محاولة تسجيل دخول فاشلة',
        'password_changed' => 'قام المستخدم بتغيير كلمة المرور',
        'password_reset' => 'قام المستخدم بإعادة تعيين كلمة المرور',
        'profile_updated' => 'تم تحديث معلومات الملف الشخصي للمستخدم',
        'two_factor_enabled' => 'تم تفعيل المصادقة الثنائية',
        'two_factor_disabled' => 'تم تعطيل المصادقة الثنائية',
        'account_locked' => 'تم قفل حساب المستخدم لأسباب أمنية',
        'account_unlocked' => 'تم فتح حساب المستخدم',
        'user_registered' => 'تم إنشاء حساب مستخدم جديد',
        'concurrent_sessions' => 'تم اكتشاف جلسات متعددة متزامنة',
        'new_device_detected' => 'تم اكتشاف تسجيل دخول من جهاز جديد',
        'new_location_detected' => 'تم اكتشاف تسجيل دخول من موقع جديد',
    ];

    private const RESOURCE_MAP = [
        'User' => 'مستخدم',
        'BankAccount' => 'bank_accounts',
        'Beneficiary' => 'beneficiaries',
        'Transfer' => 'transfers',
    ];

    // -------------------------------------------------------------------------
    // Public endpoints
    // -------------------------------------------------------------------------

    public function index(Request $request): InertiaResponse
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:'.self::PER_PAGE_MAX,
            'page' => 'nullable|integer|min:1',
            'search' => 'nullable|string|max:255',
            'action' => 'nullable|string',
            'severity' => 'nullable|in:all,critical,warning,info',
            'date_range' => 'nullable|in:all,today,week,month,custom',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        $perPage = min($request->integer('per_page', self::PER_PAGE_DEFAULT), self::PER_PAGE_MAX);
        $page = max($request->integer('page', 1), 1);

        $cacheKey = $this->buildCacheKey('audit_logs_page', $page, $perPage, $request);
        $allLogs = Cache::remember($cacheKey, now()->addMinutes(self::CACHE_TTL_LOGS), fn () => $this->fetchMergedLogs($request));

        $paginated = $allLogs->forPage($page, $perPage)->values();
        $total = $allLogs->count();
        $totalPages = (int) ceil($total / $perPage);

        return Inertia::render('audit-logs', [
            'logs' => $paginated,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_more_pages' => $page < $totalPages,
            ],
            'filters' => $request->only(['search', 'action', 'severity', 'date_range', 'start_date', 'end_date', 'user_id']),
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $cacheKey = $this->buildCacheKey('audit_stats', filters: $request);

        $data = Cache::remember($cacheKey, now()->addMinutes(self::CACHE_TTL_STATS), function () use ($request) {
            [$auditQuery, $activityQuery] = $this->baseQueriesWithDateRange($request);

            // Clone queries before adding severity constraints
            $auditBase = clone $auditQuery;
            $activityBase = clone $activityQuery;

            $totalAudit = $auditBase->count();
            $totalActivity = $activityBase->count();

            return [
                'total_audit_logs' => $totalAudit,
                'total_activity_logs' => $totalActivity,
                'total' => $totalAudit + $totalActivity,
                'critical_logs' => (clone $auditQuery)->where('severity', 'critical')->count()
                    + (clone $activityQuery)->where('severity', 'critical')->count(),
                'warning_logs' => (clone $auditQuery)->where('severity', 'warning')->count()
                    + (clone $activityQuery)->where('severity', 'warning')->count(),
                'info_logs' => (clone $auditQuery)->where('severity', 'info')->count()
                    + (clone $activityQuery)->where('severity', 'info')->count(),
                'by_action' => $this->getActionBreakdown($request),
                'unique_users' => $activityBase->distinct('user_id')->count('user_id'),
                'top_users' => $this->getTopUsers($request),
                'top_ips' => $this->getTopIps($request),
                'hourly_activity' => $this->getHourlyActivity($request),
                'daily_trend' => $this->getDailyTrend($request),
                'recent_activity' => $activityBase->latest('created_at')->limit(10)->get(['id', 'action', 'description', 'created_at', 'user_id']),
            ];
        });

        return response()->json($data);
    }

    public function export(Request $request): Response|JsonResponse|\Symfony\Component\HttpFoundation\StreamedResponse
    {
        $request->validate([
            'format' => 'nullable|in:csv,json,xlsx',
            'search' => 'nullable|string|max:255',
            'action' => 'nullable|string',
            'severity' => 'nullable|in:all,critical,warning,info',
            'date_range' => 'nullable|in:all,today,week,month,custom',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $format = $request->input('format', 'csv');
        $logs = $this->fetchMergedLogs($request);
        $filename = 'audit_logs_'.now()->format('Y-m-d_His');

        Log::info('Audit log export', [
            'format' => $format,
            'count' => $logs->count(),
            'user_id' => $request->user()?->id,
            'ip' => $request->ip(),
            'filters' => $request->only(['action', 'severity', 'date_range']),
        ]);

        return match ($format) {
            'json' => $this->exportJson($logs, $filename),
            default => $this->exportCsv($logs, $filename),
        };
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $log = AuditLog::with('user')->find($id)
            ?? UserActivityLog::with('user')->where('id', ltrim((string) $id, 'activity_'))->first();

        abort_if(! $log, 404, 'Log entry not found.');

        return response()->json($this->mapAuditLog($log));
    }

    public function userTimeline(Request $request, int $userId): JsonResponse
    {
        abort_unless(User::where('id', $userId)->exists(), 404, 'User not found.');

        $request->validate([
            'limit' => 'nullable|integer|min:1|max:200',
        ]);

        $limit = $request->integer('limit', 50);

        $audit = AuditLog::with('user')->where('user_id', $userId)->latest()->limit($limit)->get()->map(fn ($l) => $this->mapAuditLog($l));
        $activity = UserActivityLog::with('user')->where('user_id', $userId)->latest()->limit($limit)->get()->map(fn ($l) => $this->mapActivityLog($l));

        $timeline = $audit->concat($activity)->sortByDesc('createdAt')->take($limit)->values();

        return response()->json([
            'user_id' => $userId,
            'timeline' => $timeline,
            'total' => $timeline->count(),
        ]);
    }

    // -------------------------------------------------------------------------
    // Data fetching & merging
    // -------------------------------------------------------------------------

    private function fetchMergedLogs(Request $request): Collection
    {
        $auditQuery = AuditLog::with('user');
        $activityQuery = UserActivityLog::with('user');

        $this->applyFilters($auditQuery, $request, 'audit');
        $this->applyFilters($activityQuery, $request, 'activity');

        // Use chunking for large datasets to avoid memory spikes
        $auditLogs = $auditQuery->latest('created_at')->get();
        $activityLogs = $activityQuery->latest('created_at')->get();

        return $auditLogs->map(fn ($l) => $this->mapAuditLog($l))
            ->concat($activityLogs->map(fn ($l) => $this->mapActivityLog($l)))
            ->sortByDesc('createdAt')
            ->values();
    }

    // -------------------------------------------------------------------------
    // Mapping helpers
    // -------------------------------------------------------------------------

    private function mapAuditLog(AuditLog $log): array
    {
        return [
            'id' => $log->id,
            'type' => 'audit',
            'action' => $this->resolveAction($log->action),
            'resource' => $this->resolveResource($log->auditable_type),
            'resourceId' => $log->auditable_id,
            'userId' => $log->user?->id,
            'userName' => $log->user?->name ?? 'System',
            'userEmail' => $log->user?->email ?? 'system@local',
            'ipAddress' => $log->ip_address ?? 'N/A',
            'userAgent' => $log->user_agent,
            'description' => $log->description ?? $this->buildAuditDescription($log->action, $log->auditable_type),
            'severity' => $this->resolveAuditSeverity($log->action, $log->severity ?? null),
            'createdAt' => $log->created_at->toIso8601String(),
            'oldValues' => $log->old_values,
            'newValues' => $log->new_values,
            'metadata' => $log->metadata,
        ];
    }

    private function mapActivityLog(UserActivityLog $log): array
    {
        return [
            'id' => 'activity_'.$log->id,
            'type' => 'activity',
            'action' => self::ACTIVITY_ACTION_MAP[$log->action] ?? 'create',
            'resource' => 'system',
            'resourceId' => null,
            'userId' => $log->user?->id,
            'userName' => $log->user?->name ?? 'System',
            'userEmail' => $log->user?->email ?? 'system@local',
            'ipAddress' => $log->ip_address ?? 'N/A',
            'userAgent' => $log->user_agent,
            'description' => $log->description ?? (self::ACTIVITY_DESCRIPTION_MAP[$log->action] ?? $log->action),
            'severity' => self::ACTIVITY_SEVERITY_MAP[$log->action] ?? 'info',
            'createdAt' => $log->created_at->toIso8601String(),
            'oldValues' => $log->old_values ?? null,
            'newValues' => $log->new_values ?? null,
            'metadata' => $log->metadata ?? null,
        ];
    }

    // -------------------------------------------------------------------------
    // Resolution helpers
    // -------------------------------------------------------------------------

    private function resolveAction(string $action): string
    {
        foreach (self::ACTION_MAP as $keyword => $type) {
            if (str_contains($action, $keyword)) {
                return $type;
            }
        }

        return 'create';
    }

    private function resolveResource(?string $auditableType): string
    {
        if (! $auditableType) {
            return 'system';
        }

        foreach (self::RESOURCE_MAP as $keyword => $label) {
            if (str_contains($auditableType, $keyword)) {
                return $label;
            }
        }

        return 'النظام';
    }

    private function resolveAuditSeverity(string $action, ?string $existingSeverity): string
    {
        // Trust an explicitly stored severity on the model
        if ($existingSeverity && in_array($existingSeverity, ['critical', 'warning', 'info'])) {
            return $existingSeverity;
        }

        foreach (self::SEVERITY_CRITICAL_KEYWORDS as $kw) {
            if (str_contains($action, $kw)) {
                return 'critical';
            }
        }

        foreach (self::SEVERITY_WARNING_KEYWORDS as $kw) {
            if (str_contains($action, $kw)) {
                return 'warning';
            }
        }

        return 'info';
    }

    private function buildAuditDescription(string $action, ?string $auditableType): string
    {
        $resource = $auditableType ? $this->resolveResource($auditableType) : null;

        return match (true) {
            str_contains($action, 'create') => $resource ? "تم إنشاء {$resource}" : 'تم الإنشاء',
            str_contains($action, 'update') => $resource ? "تم تحديث {$resource}" : 'تم التحديث',
            str_contains($action, 'delete') => $resource ? "تم حذف {$resource}" : 'تم الحذف',
            str_contains($action, 'login') => 'قام المستخدم بتسجيل الدخول بنجاح',
            str_contains($action, 'logout') => 'قام المستخدم بتسجيل الخروج',
            default => $action,
        };
    }

    // -------------------------------------------------------------------------
    // Filters
    // -------------------------------------------------------------------------

    private function applyFilters($query, Request $request, string $type): void
    {
        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->toString();
            $query->where(function ($q) use ($search, $type) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"));

                if ($type === 'audit') {
                    $q->orWhere('action', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%");
                }
            });
        }

        if ($request->filled('action') && $request->input('action') !== 'all') {
            $action = $request->input('action');
            $type === 'audit'
                ? $query->where('action', 'like', "%{$action}%")
                : $query->where('action', $action);
        }

        if ($request->filled('severity') && $request->input('severity') !== 'all') {
            $query->where('severity', $request->input('severity'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        $this->applyDateFilter($query, $request);
    }

    private function applyDateFilter($query, Request $request): void
    {
        $range = $request->input('date_range', 'all');

        if ($range === 'all' || ! $range) {
            return;
        }

        $now = Carbon::now();

        match ($range) {
            'today' => $query->whereDate('created_at', $now->toDateString()),
            'week' => $query->where('created_at', '>=', $now->copy()->startOfWeek()),
            'month' => $query->where('created_at', '>=', $now->copy()->startOfMonth()),
            'custom' => $this->applyCustomDateFilter($query, $request),
            default => null,
        };
    }

    private function applyCustomDateFilter($query, Request $request): void
    {
        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', Carbon::parse($request->input('start_date'))->startOfDay());
        }
        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', Carbon::parse($request->input('end_date'))->endOfDay());
        }
    }

    // -------------------------------------------------------------------------
    // Analytics helpers
    // -------------------------------------------------------------------------

    private function baseQueriesWithDateRange(Request $request): array
    {
        $auditQuery = AuditLog::query();
        $activityQuery = UserActivityLog::query();

        if ($request->filled('start_date')) {
            $start = Carbon::parse($request->input('start_date'))->startOfDay();
            $auditQuery->where('created_at', '>=', $start);
            $activityQuery->where('created_at', '>=', $start);
        }

        if ($request->filled('end_date')) {
            $end = Carbon::parse($request->input('end_date'))->endOfDay();
            $auditQuery->where('created_at', '<=', $end);
            $activityQuery->where('created_at', '<=', $end);
        }

        return [$auditQuery, $activityQuery];
    }

    private function getActionBreakdown(Request $request): array
    {
        [$auditQuery] = $this->baseQueriesWithDateRange($request);

        return $auditQuery
            ->select('action', DB::raw('count(*) as total'))
            ->groupBy('action')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'action' => $this->resolveAction($row->action),
                'total' => $row->total,
            ])
            ->toArray();
    }

    private function getTopUsers(Request $request, int $limit = 5): array
    {
        [$auditQuery] = $this->baseQueriesWithDateRange($request);

        return $auditQuery
            ->select('user_id', DB::raw('count(*) as total'))
            ->with('user:id,name,email')
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'user_id' => $row->user_id,
                'name' => $row->user?->name ?? 'مجهول',
                'email' => $row->user?->email,
                'total' => $row->total,
            ])
            ->toArray();
    }

    private function getTopIps(Request $request, int $limit = 5): array
    {
        [$auditQuery] = $this->baseQueriesWithDateRange($request);

        return $auditQuery
            ->select('ip_address', DB::raw('count(*) as total'))
            ->whereNotNull('ip_address')
            ->groupBy('ip_address')
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'ip_address' => $row->ip_address,
                'total' => $row->total,
            ])
            ->toArray();
    }

    private function getHourlyActivity(Request $request): array
    {
        [$auditQuery, $activityQuery] = $this->baseQueriesWithDateRange($request);

        $driver = DB::connection()->getDriverName();
        $hourExpr = match ($driver) {
            'sqlite' => "CAST(strftime('%H', created_at) AS INTEGER)",
            'pgsql' => 'EXTRACT(HOUR FROM created_at)',
            default => 'HOUR(created_at)',
        };

        $audit = $auditQuery
            ->select(DB::raw("{$hourExpr} as hour"), DB::raw('count(*) as total'))
            ->groupBy('hour')
            ->pluck('total', 'hour');

        $activity = $activityQuery
            ->select(DB::raw("{$hourExpr} as hour"), DB::raw('count(*) as total'))
            ->groupBy('hour')
            ->pluck('total', 'hour');

        return collect(range(0, 23))->map(fn ($h) => [
            'hour' => $h,
            'audit' => $audit->get($h, 0),
            'activity' => $activity->get($h, 0),
            'total' => $audit->get($h, 0) + $activity->get($h, 0),
        ])->toArray();
    }

    private function getDailyTrend(Request $request, int $days = 30): array
    {
        [$auditQuery, $activityQuery] = $this->baseQueriesWithDateRange($request);

        $audit = $auditQuery
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->groupBy('date')
            ->pluck('total', 'date');

        $activity = $activityQuery
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->groupBy('date')
            ->pluck('total', 'date');

        return collect(range(0, $days - 1))->map(function ($offset) use ($audit, $activity) {
            $date = Carbon::now()->subDays($offset)->toDateString();

            return [
                'date' => $date,
                'audit' => $audit->get($date, 0),
                'activity' => $activity->get($date, 0),
                'total' => $audit->get($date, 0) + $activity->get($date, 0),
            ];
        })->sortBy('date')->values()->toArray();
    }

    // -------------------------------------------------------------------------
    // Export helpers
    // -------------------------------------------------------------------------

    private function exportCsv(Collection $logs, string $filename): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
            'X-Content-Type-Options' => 'nosniff',
        ];

        $columns = ['ID', 'Type', 'Action', 'Resource', 'Resource ID', 'User', 'Email', 'IP Address', 'Description', 'Severity', 'Created At'];

        $callback = function () use ($logs, $columns) {
            $file = fopen('php://output', 'w');
            // UTF-8 BOM for Excel compatibility
            fwrite($file, "\xEF\xBB\xBF");
            fputcsv($file, $columns);

            foreach ($logs as $log) {
                fputcsv($file, [
                    $log['id'],
                    $log['type'],
                    $log['action'],
                    $log['resource'],
                    $log['resourceId'] ?? '',
                    $log['userName'],
                    $log['userEmail'],
                    $log['ipAddress'],
                    $log['description'],
                    $log['severity'],
                    $log['createdAt'],
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportJson(Collection $logs, string $filename): JsonResponse
    {
        return response()->json([
            'data' => $logs->values(),
            'meta' => [
                'total' => $logs->count(),
                'exported_at' => now()->toIso8601String(),
                'exported_by' => request()->user()?->email ?? 'system',
            ],
        ], 200, [
            'Content-Disposition' => "attachment; filename=\"{$filename}.json\"",
        ]);
    }

    // -------------------------------------------------------------------------
    // Cache key builder
    // -------------------------------------------------------------------------

    private function buildCacheKey(string $prefix, int $page = 1, int $perPage = 50, ?Request $filters = null): string
    {
        $filterHash = $filters
            ? md5(json_encode($filters->only(['search', 'action', 'resource', 'severity', 'date_range', 'start_date', 'end_date', 'user_id'])))
            : 'no_filters';

        return "{$prefix}_{$page}_{$perPage}_{$filterHash}";
    }
}
