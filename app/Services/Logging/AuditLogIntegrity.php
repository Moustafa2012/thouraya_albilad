<?php

namespace App\Services\Logging;

use App\Models\AuditLog;
use App\Models\UserActivityLog;
use Illuminate\Support\Facades\Log;

class AuditLogIntegrity
{
    private string $secretKey;

    public function __construct()
    {
        $this->secretKey = config('app.key') ?? 'default-secret-key';
    }

    public function generateHash(array $data): string
    {
        ksort($data);
        $hashData = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        
        return hash_hmac('sha256', $hashData, $this->secretKey);
    }

    public function verifyHash(string $hash, array $data): bool
    {
        $expectedHash = $this->generateHash($data);
        
        return hash_equals($expectedHash, $hash);
    }

    public function signAuditLog(AuditLog $log): void
    {
        $data = [
            'id' => $log->id,
            'user_id' => $log->user_id,
            'action' => $log->action,
            'auditable_type' => $log->auditable_type,
            'auditable_id' => $log->auditable_id,
            'old_values' => $log->old_values,
            'new_values' => $log->new_values,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at?->toIso8601String(),
        ];

        $log->update([
            'integrity_hash' => $this->generateHash($data),
        ]);
    }

    public function signActivityLog(UserActivityLog $log): void
    {
        $data = [
            'id' => $log->id,
            'user_id' => $log->user_id,
            'action' => $log->action,
            'description' => $log->description,
            'old_values' => $log->old_values,
            'new_values' => $log->new_values,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at?->toIso8601String(),
        ];

        $log->update([
            'integrity_hash' => $this->generateHash($data),
        ]);
    }

    public function verifyAuditLog(AuditLog $log): bool
    {
        if (!$log->integrity_hash) {
            return false;
        }

        $data = [
            'id' => $log->id,
            'user_id' => $log->user_id,
            'action' => $log->action,
            'auditable_type' => $log->auditable_type,
            'auditable_id' => $log->auditable_id,
            'old_values' => $log->old_values,
            'new_values' => $log->new_values,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at?->toIso8601String(),
        ];

        return $this->verifyHash($log->integrity_hash, $data);
    }

    public function verifyActivityLog(UserActivityLog $log): bool
    {
        if (!$log->integrity_hash) {
            return false;
        }

        $data = [
            'id' => $log->id,
            'user_id' => $log->user_id,
            'action' => $log->action,
            'description' => $log->description,
            'old_values' => $log->old_values,
            'new_values' => $log->new_values,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at?->toIso8601String(),
        ];

        return $this->verifyHash($log->integrity_hash, $data);
    }

    public function verifyAllLogs(int $limit = 1000): array
    {
        $results = [
            'total_audit_logs' => 0,
            'verified_audit_logs' => 0,
            'failed_audit_logs' => 0,
            'total_activity_logs' => 0,
            'verified_activity_logs' => 0,
            'failed_activity_logs' => 0,
            'issues' => [],
        ];

        $auditLogs = AuditLog::with('user')
            ->whereNotNull('integrity_hash')
            ->latest()
            ->limit($limit)
            ->get();

        $results['total_audit_logs'] = $auditLogs->count();

        foreach ($auditLogs as $log) {
            if ($this->verifyAuditLog($log)) {
                $results['verified_audit_logs']++;
            } else {
                $results['failed_audit_logs']++;
                $results['issues'][] = [
                    'type' => 'audit_log',
                    'id' => $log->id,
                    'action' => $log->action,
                    'user_id' => $log->user_id,
                    'created_at' => $log->created_at?->toIso8601String(),
                ];
            }
        }

        $activityLogs = UserActivityLog::with('user')
            ->whereNotNull('integrity_hash')
            ->latest()
            ->limit($limit)
            ->get();

        $results['total_activity_logs'] = $activityLogs->count();

        foreach ($activityLogs as $log) {
            if ($this->verifyActivityLog($log)) {
                $results['verified_activity_logs']++;
            } else {
                $results['failed_activity_logs']++;
                $results['issues'][] = [
                    'type' => 'activity_log',
                    'id' => $log->id,
                    'action' => $log->action,
                    'user_id' => $log->user_id,
                    'created_at' => $log->created_at?->toIso8601String(),
                ];
            }
        }

        Log::info('Audit log integrity verification completed', $results);

        return $results;
    }

    public function signRecentLogs(int $limit = 100): void
    {
        $unsignedAuditLogs = AuditLog::whereNull('integrity_hash')
            ->latest()
            ->limit($limit)
            ->get();

        foreach ($unsignedAuditLogs as $log) {
            try {
                $this->signAuditLog($log);
            } catch (\Exception $e) {
                Log::error('Failed to sign audit log', [
                    'log_id' => $log->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $unsignedActivityLogs = UserActivityLog::whereNull('integrity_hash')
            ->latest()
            ->limit($limit)
            ->get();

        foreach ($unsignedActivityLogs as $log) {
            try {
                $this->signActivityLog($log);
            } catch (\Exception $e) {
                Log::error('Failed to sign activity log', [
                    'log_id' => $log->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('Signed recent logs', [
            'audit_logs_signed' => $unsignedAuditLogs->count(),
            'activity_logs_signed' => $unsignedActivityLogs->count(),
        ]);
    }
}
