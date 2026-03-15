<?php

namespace App\Services;

use App\Http\Requests\StoreTransferRequest;
use App\Mail\TransferRequestMail;
use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\Transfer;
use App\Services\Logging\ActivityLogger;
use App\Services\Logging\AuditLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Throwable;

class TransferService
{
    public function create(StoreTransferRequest $request): Transfer
    {
        $validated = $request->validated();
        $user = $request->user();

        $transfer = DB::transaction(function () use ($validated, $user) {
            $bankAccount = BankAccount::query()
                ->whereKey((int) $validated['bankAccountId'])
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->firstOrFail();

            $beneficiary = Beneficiary::query()
                ->whereKey((int) $validated['beneficiaryId'])
                ->where('user_id', $user->id)
                ->firstOrFail();

            $amount = (float) $validated['amount'];

            $transfer = Transfer::create([
                'user_id' => $user->id,
                'bank_account_id' => $bankAccount->id,
                'beneficiary_id' => $beneficiary->id,
                'amount' => $amount,
                'currency' => strtoupper((string) $validated['currency']),
                'transfer_date' => $validated['transferDate'],
                'reference_number' => $validated['referenceNumber'],
                'notes' => $validated['notes'] ?? null,
                'bank_email' => $bankAccount->bank_email,
                'status' => 'submitted',
            ]);

            $bankAccount->update([
                'balance' => max(0, (float) $bankAccount->balance - $amount),
            ]);

            $transfer->update([
                'document_hash' => $this->documentHash($transfer),
            ]);

            app(AuditLogger::class)->logCustom($transfer, 'transfer_create', [
                'new_values' => [
                    'bank_account_id' => $transfer->bank_account_id,
                    'beneficiary_id' => $transfer->beneficiary_id,
                    'amount' => $transfer->amount,
                    'currency' => $transfer->currency,
                    'transfer_date' => $transfer->transfer_date?->toDateString(),
                    'reference_number' => $transfer->reference_number,
                ],
                'metadata' => [
                    'status' => $transfer->status,
                ],
            ]);

            app(ActivityLogger::class)->log([
                'user_id' => $user->id,
                'action' => 'transfer_created',
                'description' => 'Transfer created',
                'entity_type' => Transfer::class,
                'entity_id' => $transfer->id,
                'new_values' => [
                    'bank_account_id' => $transfer->bank_account_id,
                    'beneficiary_id' => $transfer->beneficiary_id,
                    'amount' => $transfer->amount,
                    'currency' => $transfer->currency,
                ],
            ]);

            return $transfer;
        });

        DB::afterCommit(function () use ($transfer): void {
            $this->sendToBank($transfer);
        });

        return $transfer;
    }

    public function sendToBank(Transfer $transfer): void
    {
        $transfer->loadMissing(['bankAccount', 'beneficiary', 'user']);

        try {
            Mail::to((string) $transfer->bank_email)->send(new TransferRequestMail($transfer));

            $transfer->update(['status' => 'emailed']);

            app(AuditLogger::class)->logCustom($transfer, 'transfer_emailed', [
                'old_values' => ['status' => 'submitted'],
                'new_values' => ['status' => 'emailed'],
            ]);

            app(ActivityLogger::class)->log([
                'user_id' => $transfer->user_id,
                'action' => 'transfer_emailed',
                'description' => 'Transfer emailed to bank',
                'entity_type' => Transfer::class,
                'entity_id' => $transfer->id,
                'new_values' => ['bank_email' => $transfer->bank_email],
            ]);
        } catch (Throwable $e) {
            $transfer->update(['status' => 'email_failed']);

            app(AuditLogger::class)->logCustom($transfer, 'transfer_email_failed', [
                'old_values' => ['status' => 'submitted'],
                'new_values' => ['status' => 'email_failed'],
                'metadata' => [
                    'error' => $e->getMessage(),
                ],
            ]);

            app(ActivityLogger::class)->log([
                'user_id' => $transfer->user_id,
                'action' => 'transfer_email_failed',
                'description' => 'Transfer email failed',
                'entity_type' => Transfer::class,
                'entity_id' => $transfer->id,
                'severity' => 'warning',
                'metadata' => [
                    'error' => $e->getMessage(),
                ],
            ]);
        }
    }

    private function documentHash(Transfer $transfer): string
    {
        $payload = [
            'id' => $transfer->id,
            'user_id' => $transfer->user_id,
            'bank_account_id' => $transfer->bank_account_id,
            'beneficiary_id' => $transfer->beneficiary_id,
            'amount' => (string) $transfer->amount,
            'currency' => $transfer->currency,
            'transfer_date' => $transfer->transfer_date?->toDateString(),
            'reference_number' => $transfer->reference_number,
            'created_at' => $transfer->created_at?->toIso8601String(),
        ];

        return hash('sha256', json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES).'|'.(config('app.key') ?? ''));
    }
}
