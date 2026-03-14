<?php

use App\Http\Requests\StoreBankAccountRequest;
use App\Models\BankAccount;
use App\Models\BusinessBankAccount;
use App\Models\User;
use App\Services\BankAccountService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

uses(RefreshDatabase::class, WithoutMiddleware::class);

test('can create business bank account', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    $service = new BankAccountService();

    $requestData = [
        'account_name' => 'Test Business Account',
        'account_category' => 'business',
        'account_type' => 'current',
        'currency' => 'SAR',
        'account_number' => '1234567890',
        'bank_name' => 'Test Bank',
        'iban' => 'SA1234567890123456789012',
        'holder_name_ar' => 'اختبار الشركة',
        'holder_name_en' => 'Test Company',
        
        // Business specific fields
        'business_name' => 'Test Business LLC',
        'business_type' => 'LLC',
        'tax_id' => '1234567890',
        'business_address' => '123 Test Street, Riyadh, Saudi Arabia',
        'business_phone' => '+966501234567',
        'commercial_reg_number' => '1234567890',
        'authorized_signatory_name' => 'John Doe',
        'authorized_signatory_id' => '1234567890',
        'signatory_position' => 'CEO',
        'beneficial_ownership_percentage' => 100,
        
        'is_default' => false,
        'is_active' => true,
    ];

    // Create request manually
    $request = StoreBankAccountRequest::create('/bank-accounts', 'POST', $requestData);
    $request->setUserResolver(fn () => $user);

    // Act
    $bankAccount = $service->create($request);

    // Assert
    expect($bankAccount)->toBeInstanceOf(BankAccount::class);
    expect($bankAccount->id)->not->toBeNull();
    expect($bankAccount->account_category)->toBe('business');
    expect($bankAccount->business)->not->toBeNull();
    
    // Check business details
    $businessDetails = $bankAccount->business;
    expect($businessDetails->business_name)->toBe('Test Business LLC');
    expect($businessDetails->business_type)->toBe('LLC');
    expect($businessDetails->tax_id)->toBe('1234567890');
    expect($businessDetails->business_address)->toBe('123 Test Street, Riyadh, Saudi Arabia');
    expect($businessDetails->business_phone)->toBe('+966501234567');
    expect($businessDetails->commercial_reg_number)->toBe('1234567890');
    expect($businessDetails->authorized_signatory_name)->toBe('John Doe');
    expect($businessDetails->authorized_signatory_id)->toBe('1234567890');
    expect($businessDetails->signatory_position)->toBe('CEO');
    expect($businessDetails->beneficial_ownership_percentage)->toBe(100.0);

    // Check database counts
    expect(BankAccount::count())->toBe(1);
    expect(BusinessBankAccount::count())->toBe(1);
});
