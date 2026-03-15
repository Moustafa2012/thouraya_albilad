<?php

use App\Models\BankAccount;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('user can create a personal bank account with frontend payload', function () {
    $user = User::factory()->create();

    actingAs($user);

    $payload = [
        'account_name' => 'My Personal Account',
        'account_category' => 'personal',
        'account_type' => 'current',
        'currency' => 'SAR',
        'holder_name_ar' => 'محمد أحمد',
        'holder_name_en' => 'Mohammed Ahmed',
        'holder_id_type' => 'national_id',
        'holder_id' => '1010101010',
        'bank_name' => 'Al Rajhi Bank',
        'bank_country' => 'SA',
        'bank_address' => 'Riyadh',
        'bank_phone' => '920000802',
        'bank_email' => 'info@alrajhibank.com.sa',
        'account_number' => '1234567890',
        'iban' => 'SA5555555555555555555555',
        'swift_code' => null,
        'branch_name' => null,
        'branch_code' => null,
        'routing_number' => '12345',
        'sort_code' => null,
        'is_default' => true,
        'is_active' => true,
        'notes' => null,
        'metadata' => [
            'holderPhone' => '0500000000',
            'holderEmail' => 'holder@example.com',
            'bankCity' => 'Riyadh',
            'lowBalanceAlerts' => true,
        ],
        'account_holder_name' => 'Mohammed Ahmed',
        'date_of_birth' => '1990-01-01',
        'ssn_last_4' => '1234',
    ];

    post(route('bank-accounts.store', absolute: false), $payload)
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('bank-accounts.index', absolute: false));

    $bankAccount = BankAccount::query()->where('user_id', $user->id)->firstOrFail();
    $bankAccount->load(['personal', 'business']);

    expect($bankAccount->account_category)->toBe('personal');
    expect($bankAccount->iban)->toBe('SA5555555555555555555555');
    expect($bankAccount->metadata)->toMatchArray([
        'holderPhone' => '0500000000',
        'holderEmail' => 'holder@example.com',
        'bankCity' => 'Riyadh',
        'lowBalanceAlerts' => true,
    ]);

    expect($bankAccount->personal)->not->toBeNull();
    expect($bankAccount->business)->toBeNull();
    expect($bankAccount->personal->account_holder_name)->toBe('Mohammed Ahmed');
    expect($bankAccount->personal->date_of_birth)->toBe('1990-01-01');
    expect($bankAccount->personal->ssn_last_4)->toBe('1234');
});

test('user can create a business bank account with frontend payload', function () {
    $user = User::factory()->create();

    actingAs($user);

    $payload = [
        'account_name' => 'My Business Account',
        'account_category' => 'business',
        'account_type' => 'business',
        'currency' => 'SAR',
        'holder_name_ar' => 'شركة التقنية',
        'holder_name_en' => 'Tech Company',
        'bank_name' => 'NCB',
        'bank_country' => 'SA',
        'account_number' => '0987654321',
        'iban' => 'SA6666666666666666666666',
        'is_default' => false,
        'is_active' => true,
        'metadata' => [
            'bankCity' => 'Jeddah',
        ],
        'business_name' => 'Tech Company',
        'business_type' => 'LLC',
        'tax_id' => '300000000000003',
        'business_address' => 'Riyadh, Saudi Arabia',
        'business_phone' => '+966500000000',
        'establishment_type' => 'LLC',
        'business_sector' => 'Technology',
        'business_activity' => 'Software',
        'commercial_reg_number' => '1010101010',
        'vat_number' => 'VAT-1',
        'authorized_signatory_name' => 'CEO Name',
        'authorized_signatory_id' => '1020304050',
        'signatory_position' => 'CEO',
        'beneficial_ownership_percentage' => 100.0,
    ];

    post(route('bank-accounts.store', absolute: false), $payload)
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('bank-accounts.index', absolute: false));

    $bankAccount = BankAccount::query()->where('user_id', $user->id)->firstOrFail();
    $bankAccount->load(['personal', 'business']);

    expect($bankAccount->account_category)->toBe('business');
    expect($bankAccount->iban)->toBe('SA6666666666666666666666');
    expect($bankAccount->metadata)->toMatchArray([
        'bankCity' => 'Jeddah',
    ]);

    expect($bankAccount->personal)->toBeNull();
    expect($bankAccount->business)->not->toBeNull();
    expect($bankAccount->business->tax_id)->toBe('300000000000003');
    expect($bankAccount->business->beneficial_ownership_percentage)->toBe(100.0);
});
