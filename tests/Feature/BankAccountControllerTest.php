<?php

namespace Tests\Feature;

use App\Models\BankAccount;
use App\Models\BusinessBankAccount;
use App\Models\PersonalBankAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BankAccountControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_bank_accounts_index()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        BankAccount::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->get(route('bank-accounts.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('bank-accounts')
            ->has('accounts', 3)
        );
    }

    public function test_user_can_create_personal_bank_account()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'personal',
            'account_name' => 'My Personal Account', // Added
            'routing_number' => '123456789', // Added
            'holder_name_ar' => 'محمد أحمد',
            'holder_name_en' => 'Mohammed Ahmed',
            'bank_name' => 'Al Rajhi Bank',
            'bank_country' => 'SA',
            'bank_email' => 'info@alrajhibank.com.sa',
            'bank_phone' => '920000802',
            'account_number' => '1234567890',
            'iban' => 'SA0000000000000000000000',
            'currency' => 'SAR',
            'account_type' => 'current',
            'status' => 'active',
            'is_default' => true,
            'is_active' => true,
            'metadata' => [
                'holderPhone' => '0500000000',
                'holderEmail' => 'holder@example.com',
            ],

            // Personal specific fields
            'account_holder_name' => 'Mohammed Ahmed',
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '1234',
            'holder_id_type' => 'national_id',
            'holder_id' => '1010101010',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertRedirect(route('bank-accounts.index'));
        $this->assertDatabaseHas('bank_accounts', [
            'user_id' => $user->id,
            'account_category' => 'personal',
            'bank_name' => 'Al Rajhi Bank',
            'holder_name_en' => 'Mohammed Ahmed',
        ]);

        $bankAccount = BankAccount::where('user_id', $user->id)->first();
        $this->assertNotNull($bankAccount->details);
        $this->assertInstanceOf(PersonalBankAccount::class, $bankAccount->details);

        // Verify encrypted fields
        $this->assertEquals('1234', $bankAccount->details->ssn_last_4);
        $this->assertEquals('1990-01-01', $bankAccount->details->date_of_birth);

        $this->assertIsArray($bankAccount->metadata);
        $this->assertSame('0500000000', $bankAccount->metadata['holderPhone']);
    }

    public function test_user_can_create_business_bank_account()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'business',
            'account_name' => 'My Business Account', // Added
            'routing_number' => '987654321', // Added
            'holder_name_ar' => 'شركة التقنية',
            'holder_name_en' => 'Tech Company',
            'bank_name' => 'NCB',
            'bank_country' => 'SA',
            'bank_email' => 'info@ncb.com.sa',
            'bank_phone' => '920000000',
            'account_number' => '0987654321',
            'iban' => 'SA1111111111111111111111',
            'currency' => 'SAR',
            'account_type' => 'business',
            'status' => 'active',
            'metadata' => [
                'bankCity' => 'Riyadh',
            ],

            // Business specific fields
            'business_name' => 'Tech Company',
            'commercial_reg_number' => '1010101010',
            'business_type' => 'LLC',
            'tax_id' => '300000000000003',
            'business_address' => 'Riyadh, Saudi Arabia',
            'business_phone' => '+966500000000',
            'establishment_type' => 'LLC', // Added
            'business_sector' => 'Technology', // Added
            'authorized_signatory_name' => 'CEO Name',
            'authorized_signatory_id' => '1020304050',
            'signatory_position' => 'CEO',
            'beneficial_ownership_percentage' => 100.00,
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertRedirect(route('bank-accounts.index'));
        $this->assertDatabaseHas('bank_accounts', [
            'user_id' => $user->id,
            'account_category' => 'business',
            'bank_name' => 'NCB',
        ]);

        $bankAccount = BankAccount::where('user_id', $user->id)->first();
        $this->assertNotNull($bankAccount->details);
        $this->assertInstanceOf(BusinessBankAccount::class, $bankAccount->details);

        // Verify encrypted fields
        $this->assertEquals('300000000000003', $bankAccount->details->tax_id);
        $this->assertEquals('Riyadh, Saudi Arabia', $bankAccount->details->business_address);
        // Verify float cast
        $this->assertEquals(100.00, $bankAccount->details->beneficial_ownership_percentage);

        $this->assertIsArray($bankAccount->metadata);
        $this->assertSame('Riyadh', $bankAccount->metadata['bankCity']);
    }

    public function test_validation_errors_for_required_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('bank-accounts.store'), []);

        $response->assertSessionHasErrors([
            'account_category',
            'account_type',
            'currency',
            'holder_name_ar',
            'holder_name_en',
            'bank_name',
            'account_number',
            'iban',
        ]);
    }

    public function test_routing_number_is_optional_and_free_form_on_create()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'personal',
            'account_name' => 'Invalid Routing Account',
            'routing_number' => '12345',
            'holder_name_ar' => 'محمد أحمد',
            'holder_name_en' => 'Mohammed Ahmed',
            'bank_name' => 'Al Rajhi Bank',
            'bank_country' => 'SA',
            'bank_email' => 'info@alrajhibank.com.sa',
            'bank_phone' => '920000802',
            'account_number' => '1234567890',
            'iban' => 'SA0000000000000000000000',
            'currency' => 'SAR',
            'account_type' => 'current',
            'status' => 'active',
            'is_active' => true,
            'metadata' => [],
            'account_holder_name' => 'Mohammed Ahmed',
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '1234',
        ];

        $response = $this->from(route('bank-accounts.create'))
            ->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('bank-accounts.index'));
    }

    public function test_validation_errors_for_personal_specific_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'personal',
            // Missing personal fields
            'holder_name_ar' => 'محمد أحمد',
            'holder_name_en' => 'Mohammed Ahmed',
            'bank_name' => 'Test Bank',
            'account_number' => '123',
            'iban' => 'SA2222222222222222222222',
            'currency' => 'USD',
            'account_type' => 'current',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasErrors(['account_holder_name', 'date_of_birth', 'ssn_last_4']);
    }

    public function test_routing_number_is_optional_and_free_form_on_update()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $bankAccount = BankAccount::factory()->create([
            'user_id' => $user->id,
            'account_category' => 'personal',
        ]);

        PersonalBankAccount::create([
            'bank_account_id' => $bankAccount->id,
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '1234',
        ]);

        $payload = [
            'account_category' => 'personal',
            'account_name' => 'Updated Account Name',
            'routing_number' => '12345',
            'holder_name_ar' => 'محمد محدث',
            'holder_name_en' => 'Updated Name',
            'bank_name' => 'Updated Bank',
            'bank_country' => 'US',
            'account_number' => '999999',
            'iban' => 'SA3333333333333333333333',
            'currency' => 'USD',
            'account_type' => 'current',
            'status' => 'active',
        ];

        $response = $this->from(route('bank-accounts.edit', $bankAccount))
            ->put(route('bank-accounts.update', $bankAccount), $payload);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('bank-accounts.index'));
    }

    public function test_user_can_update_bank_account()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create initial account with Personal details
        $bankAccount = BankAccount::factory()->create([
            'user_id' => $user->id,
            'account_category' => 'personal',
        ]);

        $personalDetails = PersonalBankAccount::create([
            'bank_account_id' => $bankAccount->id,
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '1234',
        ]);

        // Relationship is already established via bank_account_id

        $payload = [
            'account_category' => 'personal',
            'account_name' => 'Updated Account Name', // Added
            'routing_number' => '123456789', // Added
            'holder_name_ar' => 'محمد محدث',
            'holder_name_en' => 'Updated Name',
            'bank_name' => 'Updated Bank',
            'bank_country' => 'US', // Changed country
            'account_number' => '999999',
            'iban' => 'SA4444444444444444444444',
            'currency' => 'USD',
            'account_type' => 'current',
            'status' => 'active',
            'metadata' => [
                'holderPhone' => '0500000001',
            ],

            // Personal fields
            'account_holder_name' => 'Updated Name',
            'date_of_birth' => '1995-05-05',
            'ssn_last_4' => '9999',
            'holder_id_type' => 'passport',
            'holder_id' => 'P1234567',
        ];

        $response = $this->put(route('bank-accounts.update', $bankAccount), $payload);

        $response->assertRedirect(route('bank-accounts.index'));

        $bankAccount->refresh();
        $this->assertEquals('Updated Bank', $bankAccount->bank_name);
        $this->assertEquals('Updated Name', $bankAccount->holder_name_en);

        $bankAccount->details->refresh();
        $this->assertEquals('9999', $bankAccount->details->ssn_last_4);
        $this->assertEquals('1995-05-05', $bankAccount->details->date_of_birth);
        $this->assertIsArray($bankAccount->metadata);
        $this->assertSame('0500000001', $bankAccount->metadata['holderPhone']);
    }

    public function test_user_can_delete_bank_account()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $bankAccount = BankAccount::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->delete(route('bank-accounts.destroy', $bankAccount));

        $response->assertRedirect(route('bank-accounts.index'));
        $this->assertSoftDeleted('bank_accounts', ['id' => $bankAccount->id]);
    }
}
