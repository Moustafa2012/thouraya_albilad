<?php

namespace App\Jobs;

use App\Models\AuditLog;
use App\Models\UserActivityLog;
use App\Models\UserLoginHistory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PruneOldLogs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $logType,
        public int $daysToKeep,
        public bool $archiveBeforeDelete = true
    ) {}

    public function handle(): void
    {
        match ($this->logType) {
            'activity' => $this->pruneActivityLogs(),
            'login_history' => $this->pruneLoginHistory(),
            'audit' => $this->pruneAuditLogs(),
            default => throw new \InvalidArgumentException("Unknown log type: {$this->logType}"),
        };
    }

    private function pruneActivityLogs(): void
    {
        $cutoffDate = now()->subDays($this->daysToKeep);
        $totalLogs = UserActivityLog::where('created_at', '<', $cutoffDate)->count();

        if ($totalLogs === 0) {
            Log::info('No old activity logs to prune');

            return;
        }

        if ($this->archiveBeforeDelete) {
            $this->archiveLogs('activity', $cutoffDate);
        }

        $deleted = UserActivityLog::where('created_at', '<', $cutoffDate)->delete();

        Log::info("Pruned {$deleted} old activity logs (older than {$this->daysToKeep} days)", [
            'log_type' => 'activity',
            'days_kept' => $this->daysToKeep,
            'cutoff_date' => $cutoffDate->toIso8601String(),
            'archived' => $this->archiveBeforeDelete,
        ]);
    }

    private function pruneLoginHistory(): void
    {
        $cutoffDate = now()->subDays($this->daysToKeep);
        $totalLogs = UserLoginHistory::where('login_at', '<', $cutoffDate)->count();

        if ($totalLogs === 0) {
            Log::info('No old login history to prune');

            return;
        }

        if ($this->archiveBeforeDelete) {
            $this->archiveLogs('login_history', $cutoffDate);
        }

        $deleted = UserLoginHistory::where('login_at', '<', $cutoffDate)->delete();

        Log::info("Pruned {$deleted} old login history records (older than {$this->daysToKeep} days)", [
            'log_type' => 'login_history',
            'days_kept' => $this->daysToKeep,
            'cutoff_date' => $cutoffDate->toIso8601String(),
            'archived' => $this->archiveBeforeDelete,
        ]);
    }

    private function pruneAuditLogs(): void
    {
        $cutoffDate = now()->subDays($this->daysToKeep);
        $totalLogs = AuditLog::where('created_at', '<', $cutoffDate)->count();

        if ($totalLogs === 0) {
            Log::info('No old audit logs to prune');

            return;
        }

        if ($this->archiveBeforeDelete) {
            $this->archiveLogs('audit', $cutoffDate);
        }

        $deleted = AuditLog::where('created_at', '<', $cutoffDate)->delete();

        Log::info("Pruned {$deleted} old audit logs (older than {$this->daysToKeep} days)", [
            'log_type' => 'audit',
            'days_kept' => $this->daysToKeep,
            'cutoff_date' => $cutoffDate->format(DATE_ATOM),
            'archived' => $this->archiveBeforeDelete,
        ]);
    }

    private function archiveLogs(string $logType, \DateTimeInterface $cutoffDate): void
    {
        try {
            $filename = "archives/{$logType}_logs_".now()->format('Y-m-d_His').'.json';
            $disk = Storage::disk('local');

            $logs = match ($logType) {
                'activity' => UserActivityLog::where('created_at', '<', $cutoffDate)->get(),
                'login_history' => UserLoginHistory::where('login_at', '<', $cutoffDate)->get(),
                'audit' => AuditLog::where('created_at', '<', $cutoffDate)->get(),
                default => throw new \InvalidArgumentException("Unknown log type for archiving: {$logType}"),
            };

            $archiveData = [
                'log_type' => $logType,
                'archived_at' => now()->format(DATE_ATOM),
                'cutoff_date' => $cutoffDate->format(DATE_ATOM),
                'total_logs' => $logs->count(),
                'logs' => $logs->map(fn ($log) => $log->toArray()),
            ];

            $disk->put($filename, json_encode($archiveData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            Log::info("Archived {$logs->count()} {$logType} logs to {$filename}");
        } catch (\Exception $e) {
            Log::error("Failed to archive {$logType} logs", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
