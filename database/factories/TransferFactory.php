<?php

namespace Database\Factories;

use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\Transfer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transfer>
 */
class TransferFactory extends Factory
{
    protected $model = Transfer::class;

    public function configure(): static
    {
        return $this->afterCreating(function (Transfer $transfer) {
            if (! $transfer->bank_account_id) {
                $account = BankAccount::factory()->create([
                    'user_id' => $transfer->user_id,
                    'currency' => $transfer->currency,
                    'balance' => max(1000, (float) $transfer->amount + 50),
                    'bank_email' => fake()->safeEmail(),
                ]);

                $transfer->update([
                    'bank_account_id' => $account->id,
                    'bank_email' => $account->bank_email,
                ]);
            }

            if (! $transfer->beneficiary_id) {
                $beneficiary = Beneficiary::factory()->create([
                    'user_id' => $transfer->user_id,
                    'currency' => $transfer->currency,
                ]);

                $transfer->update([
                    'beneficiary_id' => $beneficiary->id,
                ]);
            }
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bank_account_id' => null,
            'beneficiary_id' => null,
            'amount' => 100.00,
            'currency' => 'SAR',
            'transfer_date' => now()->toDateString(),
            'reference_number' => fake()->bothify('REF-########'),
            'notes' => fake()->sentence(),
            'bank_email' => null,
            'status' => 'submitted',
            'document_hash' => fake()->sha256(),
        ];
    }
}
