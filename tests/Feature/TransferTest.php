<?php

namespace Tests\Feature;

use App\Mail\TransferRequestMail;
use App\Models\AuditLog;
use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\Transfer;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class TransferTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_transfer_and_email_is_sent(): void
    {
        Mail::fake();

        $user = User::factory()->create();
        $this->actingAs($user);

        $bankAccount = BankAccount::factory()->create([
            'user_id' => $user->id,
            'currency' => 'SAR',
            'balance' => 2500.00,
            'status' => 'active',
            'is_active' => true,
            'bank_email' => 'bank@example.com',
        ]);

        $beneficiary = Beneficiary::factory()->create([
            'user_id' => $user->id,
            'currency' => 'SAR',
        ]);

        $payload = [
            'bankAccountId' => (string) $bankAccount->id,
            'beneficiaryId' => (string) $beneficiary->id,
            'amount' => '500.25',
            'currency' => 'SAR',
            'transferDate' => now()->toDateString(),
            'referenceNumber' => 'INV-2026-001',
            'notes' => 'Vendor payment',
        ];

        $response = $this->post(route('transfers.store'), $payload);

        $transfer = Transfer::query()->where('user_id', $user->id)->latest()->first();

        $response->assertRedirect(route('transfers.show', $transfer));

        $this->assertDatabaseHas('transfers', [
            'user_id' => $user->id,
            'bank_account_id' => $bankAccount->id,
            'beneficiary_id' => $beneficiary->id,
            'currency' => 'SAR',
            'reference_number' => 'INV-2026-001',
        ]);

        $bankAccount->refresh();
        $this->assertEquals(1999.75, (float) $bankAccount->balance);

        $transfer->refresh();
        $this->assertNotEmpty($transfer->document_hash);

        Mail::assertSent(TransferRequestMail::class, function (TransferRequestMail $mail) use ($transfer) {
            return $mail->hasTo('bank@example.com') && $mail->transfer->id === $transfer->id;
        });

        $this->assertTrue(AuditLog::query()->where('auditable_type', Transfer::class)->where('auditable_id', $transfer->id)->exists());
        $this->assertTrue(UserActivityLog::query()->where('entity_type', Transfer::class)->where('entity_id', $transfer->id)->exists());
    }

    public function test_transfer_fails_when_balance_is_insufficient(): void
    {
        Mail::fake();

        $user = User::factory()->create();
        $this->actingAs($user);

        $bankAccount = BankAccount::factory()->create([
            'user_id' => $user->id,
            'currency' => 'SAR',
            'balance' => 100.00,
            'status' => 'active',
            'is_active' => true,
            'bank_email' => 'bank@example.com',
        ]);

        $beneficiary = Beneficiary::factory()->create([
            'user_id' => $user->id,
            'currency' => 'SAR',
        ]);

        $payload = [
            'bankAccountId' => (string) $bankAccount->id,
            'beneficiaryId' => (string) $beneficiary->id,
            'amount' => '250.00',
            'currency' => 'SAR',
            'transferDate' => now()->toDateString(),
            'referenceNumber' => 'INV-2026-002',
        ];

        $response = $this->post(route('transfers.store'), $payload);

        $response->assertSessionHasErrors(['amount']);
        $this->assertDatabaseCount('transfers', 0);
        Mail::assertNothingSent();
    }

    public function test_user_cannot_create_transfer_for_another_users_beneficiary(): void
    {
        Mail::fake();

        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $this->actingAs($user);

        $bankAccount = BankAccount::factory()->create([
            'user_id' => $user->id,
            'currency' => 'SAR',
            'balance' => 1000.00,
            'status' => 'active',
            'is_active' => true,
            'bank_email' => 'bank@example.com',
        ]);

        $otherBeneficiary = Beneficiary::factory()->create([
            'user_id' => $otherUser->id,
            'currency' => 'SAR',
        ]);

        $payload = [
            'bankAccountId' => (string) $bankAccount->id,
            'beneficiaryId' => (string) $otherBeneficiary->id,
            'amount' => '50.00',
            'currency' => 'SAR',
            'transferDate' => now()->toDateString(),
            'referenceNumber' => 'INV-2026-003',
        ];

        $response = $this->post(route('transfers.store'), $payload);

        $response->assertSessionHasErrors(['beneficiaryId']);
        $this->assertDatabaseCount('transfers', 0);
        Mail::assertNothingSent();
    }
}
