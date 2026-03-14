<?php

namespace Tests\Feature;

use App\Models\BankAccount;
use App\Models\BusinessBankAccount;
use App\Models\PersonalBankAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddBankAccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_add_personal_bank_account_with_complete_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            // Common Fields
            'account_name' => 'John Doe Personal Account',
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '1234567890123456',
            'routing_number' => '123456789',
            'balance' => '5000.50',
            'status' => 'active',
            'is_default' => true,

            // Bank Fields
            'holder_name_ar' => 'جون دو',
            'holder_name_en' => 'John Doe',
            'bank_name' => 'Al Rajhi Bank',
            'iban' => 'SA0380000000608010167519',
            'swift_code' => 'RJHISARI',
            'bank_address' => 'Riyadh, Saudi Arabia',

            // Personal Specific Fields
            'account_holder_name' => 'John Doe',
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '1234',

            // Additional Metadata
            'notes' => 'Primary personal account for daily transactions',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertRedirect(route('bank-accounts.index'));
        $response->assertSessionHas('success', 'Bank account created successfully.');

        $this->assertDatabaseHas('bank_accounts', [
            'user_id' => $user->id,
            'account_category' => 'personal',
            'bank_name' => 'Al Rajhi Bank',
            'holder_name_en' => 'John Doe',
            'currency' => 'SAR',
            'is_default' => true,
            'is_active' => true,
        ]);

        $bankAccount = BankAccount::where('user_id', $user->id)->first();
        $this->assertNotNull($bankAccount);
        $this->assertInstanceOf(PersonalBankAccount::class, $bankAccount->details);

        // Verify personal details
        $this->assertEquals('John Doe', $bankAccount->details->account_holder_name);
        $this->assertEquals('1990-01-01', $bankAccount->details->date_of_birth);
        $this->assertEquals('1234', $bankAccount->details->ssn_last_4);

        // Verify encrypted fields are accessible
        $this->assertEquals('SA0380000000608010167519', $bankAccount->iban);
        $this->assertEquals('RJHISARI', $bankAccount->swift_code);
    }

    public function test_user_can_add_business_bank_account_with_complete_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            // Common Fields
            'account_name' => 'Tech Solutions Business Account',
            'account_category' => 'business',
            'account_type' => 'business',
            'currency' => 'SAR',
            'account_number' => '9876543210987654',
            'routing_number' => '987654321',
            'balance' => '50000.00',
            'status' => 'active',
            'is_default' => false,

            // Bank Fields
            'holder_name_ar' => 'شركة التقنية',
            'holder_name_en' => 'Tech Solutions',
            'bank_name' => 'National Commercial Bank',
            'iban' => 'SA4400000000010000000001',
            'swift_code' => 'NCBKSARI',
            'bank_address' => 'Jeddah, Saudi Arabia',

            // Business Specific Fields
            'business_name' => 'Tech Solutions Ltd',
            'business_type' => 'Limited Liability Company',
            'tax_id' => '300000000000003',
            'business_address' => 'King Abdullah Road, Riyadh, Saudi Arabia',
            'business_phone' => '+966500000000',
            'establishment_type' => 'LLC',
            'business_sector' => 'Technology',
            'business_activity' => 'Software Development and IT Consulting',
            'commercial_reg_number' => '1010101010',
            'vat_number' => '300000000000003',
            'authorized_signatory_name' => 'John Smith',
            'authorized_signatory_id' => '1020304050',
            'signatory_position' => 'Chief Executive Officer',
            'beneficial_ownership_percentage' => 75.50,

            // Additional Metadata
            'notes' => 'Primary business account for operations',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertRedirect(route('bank-accounts.index'));
        $response->assertSessionHas('success', 'Bank account created successfully.');

        $this->assertDatabaseHas('bank_accounts', [
            'user_id' => $user->id,
            'account_category' => 'business',
            'bank_name' => 'National Commercial Bank',
            'holder_name_en' => 'Tech Solutions',
            'currency' => 'SAR',
            'is_default' => false,
            'is_active' => true,
        ]);

        $bankAccount = BankAccount::where('user_id', $user->id)->first();
        $this->assertNotNull($bankAccount);
        $this->assertInstanceOf(BusinessBankAccount::class, $bankAccount->details);

        // Verify business details
        $this->assertEquals('Tech Solutions Ltd', $bankAccount->details->business_name);
        $this->assertEquals('Limited Liability Company', $bankAccount->details->business_type);
        $this->assertEquals('300000000000003', $bankAccount->details->tax_id);
        $this->assertEquals('75.50', $bankAccount->details->beneficial_ownership_percentage);

        // Verify encrypted fields are accessible
        $this->assertEquals('SA4400000000010000000001', $bankAccount->iban);
        $this->assertEquals('NCBKSARI', $bankAccount->swift_code);
    }

    public function test_add_bank_account_validation_for_required_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('bank-accounts.store'), []);

        $response->assertSessionHasErrors([
            'account_category',
            'account_type',
            'currency',
            'account_number',
            'bank_name',
        ]);
    }

    public function test_add_personal_bank_account_validation_for_specific_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '1234567890',
            'bank_name' => 'Test Bank',
            // Missing required personal fields
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasErrors([
            'account_holder_name',
            'date_of_birth',
            'ssn_last_4',
        ]);
    }

    public function test_add_business_bank_account_validation_for_specific_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'business',
            'account_type' => 'business',
            'currency' => 'SAR',
            'account_number' => '1234567890',
            'bank_name' => 'Test Bank',
            // Missing required business fields
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasErrors([
            'business_name',
            'business_type',
            'tax_id',
            'business_address',
            'business_phone',
            'establishment_type',
            'business_sector',
            'commercial_reg_number',
            'authorized_signatory_name',
            'authorized_signatory_id',
            'signatory_position',
            'beneficial_ownership_percentage',
        ]);
    }

    public function test_add_bank_account_routing_number_format_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '1234567890',
            'bank_name' => 'Test Bank',
            'routing_number' => '12345', // Invalid format - should be 9 digits
            'account_holder_name' => 'John Doe',
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '1234',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasErrors([
            'routing_number' => 'Invalid routing number format',
        ]);
    }

    public function test_add_bank_account_iban_uniqueness_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create existing account with IBAN
        $existingAccount = BankAccount::factory()->create([
            'user_id' => $user->id,
            'iban' => 'SA0380000000608010167519',
        ]);

        $payload = [
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '9876543210',
            'bank_name' => 'Another Bank',
            'iban' => 'SA0380000000608010167519', // Same IBAN as existing account
            'account_holder_name' => 'Jane Doe',
            'date_of_birth' => '1985-05-15',
            'ssn_last_4' => '5678',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        // Check that validation failed by checking no new account was created
        $this->assertDatabaseMissing('bank_accounts', [
            'user_id' => $user->id,
            'bank_name' => 'Another Bank',
        ]);
    }

    public function test_add_bank_account_ssn_last_4_format_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '1234567890',
            'bank_name' => 'Test Bank',
            'account_holder_name' => 'John Doe',
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '123', // Invalid format - should be 4 digits
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasErrors([
            'ssn_last_4' => 'SSN Last 4 must be exactly 4 digits.',
        ]);
    }

    public function test_add_bank_account_beneficial_ownership_percentage_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            'account_category' => 'business',
            'account_type' => 'business',
            'currency' => 'SAR',
            'account_number' => '1234567890',
            'bank_name' => 'Test Bank',
            'business_name' => 'Test Business',
            'business_type' => 'LLC',
            'tax_id' => '300000000000003',
            'business_address' => 'Test Address',
            'business_phone' => '+966500000000',
            'establishment_type' => 'LLC',
            'business_sector' => 'Technology',
            'commercial_reg_number' => '1010101010',
            'authorized_signatory_name' => 'John Doe',
            'authorized_signatory_id' => '1020304050',
            'signatory_position' => 'CEO',
            'beneficial_ownership_percentage' => 150, // Invalid - should be max 100
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasErrors([
            'beneficial_ownership_percentage',
        ]);
    }

    public function test_add_bank_account_default_flag_behavior()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create existing default account
        $existingDefault = BankAccount::factory()->create([
            'user_id' => $user->id,
            'is_default' => true,
        ]);

        $payload = [
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '9876543210',
            'bank_name' => 'New Bank',
            'is_default' => true, // Set new account as default
            'account_holder_name' => 'Jane Doe',
            'date_of_birth' => '1985-05-15',
            'ssn_last_4' => '5678',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        // Verify the response was successful (redirect status)
        $response->assertStatus(302);

        // Check that only one account is default (should be the new one)
        $defaultAccounts = BankAccount::where('user_id', $user->id)
            ->where('is_default', true)
            ->get();
        $this->assertCount(1, $defaultAccounts);
        
        // Verify the new account is the default one
        $newDefault = $defaultAccounts->first();
        $this->assertEquals('New Bank', $newDefault->bank_name);
    }

    public function test_add_bank_account_transaction_rollback_on_error()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Mock a scenario where personal details creation fails
        $payload = [
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '1234567890',
            'bank_name' => 'Test Bank',
            'account_holder_name' => 'John Doe',
            'date_of_birth' => 'invalid-date', // This will cause validation to fail
            'ssn_last_4' => '1234',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        $response->assertSessionHasErrors(['date_of_birth']);

        // Verify no bank account was created due to transaction rollback
        $this->assertDatabaseMissing('bank_accounts', [
            'user_id' => $user->id,
            'account_number' => '1234567890',
        ]);
    }

    public function test_add_bank_account_with_minimal_valid_data()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $payload = [
            // Minimal required fields for personal account
            'account_category' => 'personal',
            'account_type' => 'current',
            'currency' => 'SAR',
            'account_number' => '1234567890',
            'bank_name' => 'Test Bank',
            'account_holder_name' => 'John Doe',
            'date_of_birth' => '1990-01-01',
            'ssn_last_4' => '1234',
        ];

        $response = $this->post(route('bank-accounts.store'), $payload);

        // Verify the response was successful (redirect status)
        $response->assertStatus(302);

        // Check that the account was created successfully by counting total accounts
        $accountCount = BankAccount::where('user_id', $user->id)->count();
        $this->assertEquals(1, $accountCount);

        // Get the created account
        $bankAccount = BankAccount::where('user_id', $user->id)->first();
        $this->assertNotNull($bankAccount);
        $this->assertEquals('personal', $bankAccount->account_category);
        $this->assertEquals('Test Bank', $bankAccount->bank_name);
        $this->assertInstanceOf(PersonalBankAccount::class, $bankAccount->details);
    }
}
