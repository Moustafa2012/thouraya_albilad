<?php

namespace App\Observers;

use App\Services\Logging\AuditLogger;
use Illuminate\Database\Eloquent\Model;

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
        app(AuditLogger::class)->log(
            model: $model,
            action: $action,
            oldValues: $old,
            newValues: $new,
            description: $action,
        );
    }
}
