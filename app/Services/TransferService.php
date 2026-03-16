<?php

namespace App\Services;

use App\Http\Requests\StoreTransferRequest;
use App\Mail\TransferRequestMail;
use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\Transfer;
use App\Services\Logging\ActivityLogger;
use App\Services\Logging\AuditLogger;
use Illuminate\Database\QueryException;
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

            $attempts = 0;
            $transfer = null;
            while (! $transfer) {
                try {
                    $transfer = Transfer::create([
                        'user_id' => $user->id,
                        'bank_account_id' => $bankAccount->id,
                        'beneficiary_id' => $beneficiary->id,
                        'amount' => $amount,
                        'currency' => strtoupper((string) $validated['currency']),
                        'transfer_date' => $validated['transferDate'],
                        'reference_number' => $validated['referenceNumber'],
                        'notes' => $validated['notes'],
                        'authorized_by' => $validated['authorizedBy'],
                        'bank_email' => $bankAccount->bank_email,
                        'status' => 'draft',
                    ]);
                } catch (QueryException $e) {
                    $attempts++;
                    $isTransferNumberCollision = str_contains($e->getMessage(), 'transfers_transfer_number_unique')
                        || str_contains($e->getMessage(), 'transfer_number');

                    if (! $isTransferNumberCollision || $attempts >= 5) {
                        throw $e;
                    }
                }
            }

            $transfer->update([
                'document_hash' => $this->documentHash($transfer),
            ]);

            app(AuditLogger::class)->logCreate($transfer);

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

        return $transfer;
    }

    public function sendToBank(Transfer $transfer): void
    {
        $transfer->loadMissing(['bankAccount', 'beneficiary', 'user']);

        try {
            Mail::to((string) $transfer->bank_email)->send(new TransferRequestMail($transfer));

            $previousStatus = $transfer->status;
            $transfer->update([
                'status' => 'sent',
                'sent_at' => now(),
                'sent_by' => auth()->id() ?? $transfer->user_id,
                'sent_to' => $transfer->bank_email,
            ]);

            app(AuditLogger::class)->logCustom($transfer, 'sent_email', [
                'old_values' => ['status' => $previousStatus],
                'new_values' => [
                    'status' => 'sent',
                    'sent_at' => $transfer->sent_at?->toIso8601String(),
                    'sent_to' => $transfer->sent_to,
                    'transfer_number' => $transfer->transfer_number,
                ],
            ]);

            app(ActivityLogger::class)->log([
                'user_id' => $transfer->user_id,
                'action' => 'transfer_sent_email',
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
            'transfer_number' => $transfer->transfer_number,
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
