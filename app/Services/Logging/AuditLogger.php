<?php

namespace App\Services\Logging;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    public function log(Model $model, string $action, ?array $oldValues = null, ?array $newValues = null, ?string $description = null, ?string $severity = null): AuditLog
    {
        $log = AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'description' => $description ?? $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'severity' => $severity ?? 'info',
        ]);

        app(AuditLogIntegrity::class)->signAuditLog($log);

        return $log->refresh();
    }

    public function logCreate(Model $model): AuditLog
    {
        return $this->log($model, 'create', null, $model->toArray());
    }

    public function logUpdate(Model $model, array $changes): AuditLog
    {
        $original = $model->getOriginal();
        $oldValues = [];

        foreach ($changes as $key => $value) {
            if (array_key_exists($key, $original)) {
                $oldValues[$key] = $original[$key];
            }
        }

        return $this->log($model, 'update', $oldValues, $changes);
    }

    public function logDelete(Model $model, bool $forceDelete = false): AuditLog
    {
        if ($forceDelete) {
            return $this->log($model, 'force_delete', $model->toArray(), null);
        }

        return $this->log($model, 'delete', null, ['deleted_at' => $model->deleted_at]);
    }

    public function logRestore(Model $model): AuditLog
    {
        return $this->log($model, 'restore', ['deleted_at' => $model->deleted_at], ['deleted_at' => null]);
    }

    public function logSuspend(Model $model): AuditLog
    {
        return $this->log($model, 'suspend', ['status' => 'active'], ['status' => 'suspended']);
    }

    public function logActivate(Model $model): AuditLog
    {
        return $this->log($model, 'activate', ['status' => 'suspended'], ['status' => 'active']);
    }

    public function logCustom(Model $model, string $action, array $data): AuditLog
    {
        return $this->log(
            model: $model,
            action: $action,
            oldValues: $data['old_values'] ?? null,
            newValues: $data['new_values'] ?? null,
            description: $data['description'] ?? $action,
            severity: $data['severity'] ?? null,
        );
    }
}
