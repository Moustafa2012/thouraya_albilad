<?php

use App\Models\BankAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('bank account can sync and switch type details between personal and business', function () {
    $bankAccount = BankAccount::factory()->create([
        'account_category' => 'personal',
    ]);

    $bankAccount->syncTypeDetails([
        'account_holder_name' => 'Jane Doe',
        'date_of_birth' => '1990-01-01',
        'ssn_last_4' => '1234',
    ]);

    $bankAccount->refresh()->load(['personal', 'business']);

    expect($bankAccount->personal)->not->toBeNull();
    expect($bankAccount->business)->toBeNull();
    expect($bankAccount->personal->account_holder_name)->toBe('Jane Doe');
    expect($bankAccount->personal->date_of_birth)->toBe('1990-01-01');
    expect($bankAccount->personal->ssn_last_4)->toBe('1234');

    $bankAccount->update(['account_category' => 'business']);
    $bankAccount->updateTypeDetails([
        'business_name' => 'Acme LLC',
        'business_type' => 'LLC',
        'tax_id' => 'TAX-123',
        'business_address' => 'Riyadh',
        'business_phone' => '0500000000',
        'establishment_type' => 'LLC',
        'business_sector' => 'Technology',
        'commercial_reg_number' => 'CR-123',
        'authorized_signatory_name' => 'John Smith',
        'authorized_signatory_id' => 'ID-1',
        'signatory_position' => 'CEO',
        'beneficial_ownership_percentage' => 50.25,
    ]);

    $bankAccount->refresh()->load(['personal', 'business']);

    expect($bankAccount->personal)->toBeNull();
    expect($bankAccount->business)->not->toBeNull();
    expect($bankAccount->business->tax_id)->toBe('TAX-123');
    expect($bankAccount->business->beneficial_ownership_percentage)->toBe(50.25);
});
