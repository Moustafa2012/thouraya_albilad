<?php

namespace App\Observers;

use App\Models\BankAccount;
use App\Services\Logging\AuditLogger;

class BankAccountObserver
{
    /**
     * Handle the BankAccount "created" event.
     */
    public function created(BankAccount $bankAccount): void
    {
        $this->log($bankAccount, 'create', null, $bankAccount->toArray());
    }

    /**
     * Handle the BankAccount "updated" event.
     */
    public function updated(BankAccount $bankAccount): void
    {
        $changes = $bankAccount->getChanges();
        $original = $bankAccount->getOriginal();

        $oldValues = [];
        foreach ($changes as $key => $value) {
            if (array_key_exists($key, $original)) {
                $oldValues[$key] = $original[$key];
            }
        }

        $action = 'update';

        if (array_key_exists('status', $changes)) {
            if ($changes['status'] === 'suspended') {
                $action = 'suspend';
            } elseif ($changes['status'] === 'active' && ($original['status'] ?? null) === 'suspended') {
                $action = 'activate';
            }
        }

        $this->log($bankAccount, $action, $oldValues, $changes);
    }

    /**
     * Handle the BankAccount "deleted" event.
     */
    public function deleted(BankAccount $bankAccount): void
    {
        if ($bankAccount->isForceDeleting()) {
            $this->log($bankAccount, 'force_delete', $bankAccount->toArray(), null);
        } else {
            $this->log($bankAccount, 'delete', null, ['deleted_at' => $bankAccount->deleted_at]);
        }
    }

    /**
     * Handle the BankAccount "restored" event.
     */
    public function restored(BankAccount $bankAccount): void
    {
        $this->log($bankAccount, 'restore', ['deleted_at' => $bankAccount->deleted_at], ['deleted_at' => null]);
    }

    /**
     * Log the audit event.
     */
    protected function log($model, string $action, ?array $old = null, ?array $new = null): void
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
