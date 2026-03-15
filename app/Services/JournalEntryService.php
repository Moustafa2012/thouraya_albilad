<?php

namespace App\Services;

use App\Http\Requests\StoreJournalEntryRequest;
use App\Models\JournalEntry;
use App\Services\Logging\ActivityLogger;
use App\Services\Logging\AuditLogger;
use Illuminate\Support\Facades\DB;

class JournalEntryService
{
    public function create(StoreJournalEntryRequest $request): JournalEntry
    {
        $user = $request->user();
        $validated = $request->validated();

        return DB::transaction(function () use ($user, $validated) {
            $entry = JournalEntry::create([
                'user_id' => $user->id,
                'date' => $validated['date'],
                'description' => $validated['description'],
                'reference' => $validated['reference'] ?? null,
                'type' => $validated['type'],
                'status' => $validated['status'],
                'amount' => $validated['amount'],
                'currency' => strtoupper((string) $validated['currency']),
                'notes' => $validated['notes'] ?? null,
            ]);

            app(AuditLogger::class)->logCustom($entry, 'journal_entry_create', [
                'new_values' => [
                    'date' => $entry->date?->toDateString(),
                    'description' => $entry->description,
                    'reference' => $entry->reference,
                    'type' => $entry->type,
                    'status' => $entry->status,
                    'amount' => $entry->amount,
                    'currency' => $entry->currency,
                ],
            ]);

            app(ActivityLogger::class)->log([
                'user_id' => $user->id,
                'action' => 'journal_entry_created',
                'description' => 'Journal entry created',
                'entity_type' => JournalEntry::class,
                'entity_id' => $entry->id,
                'new_values' => [
                    'type' => $entry->type,
                    'status' => $entry->status,
                    'amount' => $entry->amount,
                    'currency' => $entry->currency,
                ],
            ]);

            return $entry;
        });
    }
}
