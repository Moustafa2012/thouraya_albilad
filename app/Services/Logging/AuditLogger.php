<?php

namespace App\Services\Logging;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class AuditLogger
{
    public function log(Model $model, string $action, ?array $oldValues = null, ?array $newValues = null): AuditLog
    {
        $metadata = [
            'request_id' => $this->getRequestId(),
            'correlation_id' => $this->getCorrelationId(),
            'session_id' => session()->getId(),
            'user_agent' => Request::userAgent(),
            'ip_address' => Request::ip(),
            'request_url' => Request::fullUrl(),
            'request_method' => Request::method(),
        ];

        return AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'metadata' => $metadata,
        ]);
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
        $metadata = [
            'request_id' => $this->getRequestId(),
            'correlation_id' => $this->getCorrelationId(),
            'session_id' => session()->getId(),
            'user_agent' => Request::userAgent(),
            'ip_address' => Request::ip(),
            'request_url' => Request::fullUrl(),
            'request_method' => Request::method(),
            'custom_data' => $data['metadata'] ?? [],
        ];

        return AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => $data['old_values'] ?? null,
            'new_values' => $data['new_values'] ?? null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'metadata' => $metadata,
        ]);
    }

    private function getRequestId(): string
    {
        return Request::header('X-Request-ID') ?? (string) Str::uuid();
    }

    private function getCorrelationId(): string
    {
        return Request::header('X-Correlation-ID') ?? session()->get('correlation_id', (string) Str::uuid());
    }
}
