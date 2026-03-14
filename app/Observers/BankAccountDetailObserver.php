<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class BankAccountDetailObserver
{
    public function created(Model $model): void
    {
        $this->log($model, 'create', null, $model->toArray());
    }

    public function updated(Model $model): void
    {
        $changes = $model->getChanges();
        $original = $model->getOriginal();

        $oldValues = [];
        foreach ($changes as $key => $value) {
            if (array_key_exists($key, $original)) {
                $oldValues[$key] = $original[$key];
            }
        }

        $this->log($model, 'update', $oldValues, $changes);
    }

    public function deleted(Model $model): void
    {
        // For type details, we might not want to log 'delete' if it's just a category switch
        // But if it is deleted, we should log it.
        $this->log($model, 'delete', $model->toArray(), null);
    }

    protected function log(Model $model, string $action, ?array $old = null, ?array $new = null): void
    {
        // We want to link this to the parent BankAccount if possible
        // But AuditLog is polymorphic on auditable.
        // We can log it as the detail model.

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => $old,
            'new_values' => $new,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
