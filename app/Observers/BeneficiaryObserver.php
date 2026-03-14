<?php

namespace App\Observers;

use App\Models\Beneficiary;
use App\Services\Logging\AuditLogger;
use Illuminate\Support\Facades\Auth;

class BeneficiaryObserver
{
    public function created(Beneficiary $beneficiary): void
    {
        app(AuditLogger::class)->logCreate($beneficiary);

        app(\App\Services\Logging\ActivityLogger::class)->log([
            'user_id' => $beneficiary->user_id,
            'action' => 'beneficiary_created',
            'description' => 'Beneficiary created',
            'entity_type' => Beneficiary::class,
            'entity_id' => $beneficiary->id,
            'new_values' => $beneficiary->toArray(),
        ]);
    }

    public function updated(Beneficiary $beneficiary): void
    {
        $changes = $beneficiary->getChanges();

        if (! empty($changes)) {
            app(AuditLogger::class)->logUpdate($beneficiary, $changes);

            app(\App\Services\Logging\ActivityLogger::class)->log([
                'user_id' => $beneficiary->user_id,
                'action' => 'beneficiary_updated',
                'description' => 'Beneficiary updated',
                'entity_type' => Beneficiary::class,
                'entity_id' => $beneficiary->id,
                'old_values' => array_intersect_key($beneficiary->getOriginal(), $changes),
                'new_values' => $changes,
            ]);
        }
    }

    public function deleted(Beneficiary $beneficiary): void
    {
        app(AuditLogger::class)->logDelete($beneficiary);

        app(\App\Services\Logging\ActivityLogger::class)->log([
            'user_id' => $beneficiary->user_id,
            'action' => 'beneficiary_deleted',
            'description' => 'Beneficiary deleted',
            'entity_type' => Beneficiary::class,
            'entity_id' => $beneficiary->id,
            'old_values' => $beneficiary->toArray(),
        ]);
    }
}
