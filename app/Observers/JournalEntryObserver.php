<?php

namespace App\Observers;

use App\Models\BankAccount;
use App\Models\JournalEntry;
use Illuminate\Support\Facades\DB;

class JournalEntryObserver
{
    public function created(JournalEntry $entry): void
    {
        $this->applyBalanceEffect($entry, 1);
    }

    public function updated(JournalEntry $entry): void
    {
        if (! $entry->wasChanged(['bank_account_id', 'direction', 'amount'])) {
            return;
        }

        $oldAccountId = $entry->getOriginal('bank_account_id');
        $oldDirection = $entry->getOriginal('direction');
        $oldAmount = (float) $entry->getOriginal('amount');
        $this->reverseBalanceEffect($oldAccountId, $oldDirection, $oldAmount);
        $this->applyBalanceEffect($entry, 1);
    }

    public function deleted(JournalEntry $entry): void
    {
        $this->applyBalanceEffect($entry, -1);
    }

    private function applyBalanceEffect(JournalEntry $entry, int $multiplier): void
    {
        if (! $entry->bank_account_id || ! in_array($entry->direction, ['debit', 'credit'], true)) {
            return;
        }

        $delta = $this->deltaForEntry($entry->direction, (float) $entry->amount) * $multiplier;

        DB::transaction(function () use ($entry, $delta): void {
            $account = BankAccount::query()
                ->whereKey($entry->bank_account_id)
                ->lockForUpdate()
                ->first();

            if ($account) {
                $account->update([
                    'balance' => max(0, (float) $account->balance + $delta),
                ]);
            }
        });
    }

    private function reverseBalanceEffect(?int $bankAccountId, ?string $direction, float $amount): void
    {
        if (! $bankAccountId || ! in_array($direction, ['debit', 'credit'], true)) {
            return;
        }

        $delta = -$this->deltaForEntry($direction, $amount);

        DB::transaction(function () use ($bankAccountId, $delta): void {
            $account = BankAccount::query()
                ->whereKey($bankAccountId)
                ->lockForUpdate()
                ->first();

            if ($account) {
                $account->update([
                    'balance' => max(0, (float) $account->balance + $delta),
                ]);
            }
        });
    }

    private function deltaForEntry(string $direction, float $amount): float
    {
        return $direction === 'debit' ? $amount : -$amount;
    }
}
