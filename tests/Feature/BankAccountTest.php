<?php

use App\Models\BankAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;
use function Pest\Laravel\withoutMiddleware;

uses(RefreshDatabase::class);

/** @var \Tests\TestCase $this */
beforeEach(function () {
    withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
});

test('user can list bank accounts', function () {
    $user = User::factory()->create();
    actingAs($user);

    // Create a bank account with related personal details
    $account = BankAccount::factory()->create(['user_id' => $user->id]);
    $account->personal()->create([
        'account_holder_name' => 'John Doe',
        'date_of_birth' => '1990-01-01',
        'ssn_last_4' => '1234',
    ]);

    $response = get(route('bank-accounts.index'));

    $response->assertStatus(200);
});

test('user can create personal bank account', function () {
    $user = User::factory()->create();
    actingAs($user);

    $data = BankAccount::factory()->make()->toArray();
    // Add required personal fields
    $data['iban'] = 'SA'.fake()->numerify('######################');
    $data['account_holder_name'] = 'John Doe';
    $data['date_of_birth'] = '1990-01-01';
    $data['ssn_last_4'] = '1234';

    $response = post(route('bank-accounts.store'), $data);

    $response->assertRedirect(route('bank-accounts.index'));
    $account = BankAccount::first();
    expect($account)->not->toBeNull();
    expect($account->iban)->toBe($data['iban']);

    assertDatabaseHas('personal_bank_accounts', [
        'bank_account_id' => $account->id,
        // encrypted fields are not easily asserted with assertDatabaseHas unless we encrypt.
        // But Laravel's assertDatabaseHas doesn't automatically decrypt.
        // We can check the model instead.
    ]);

    $personal = $account->personal;
    expect($personal->account_holder_name)->toBe('John Doe');
    expect($personal->ssn_last_4)->toBe('1234');
});

test('user can create business bank account', function () {
    $user = User::factory()->create();
    actingAs($user);

    $data = BankAccount::factory()->make([
        'account_category' => 'business',
    ])->toArray();

    // Add required business fields
    $data = array_merge($data, [
        'business_name' => 'Acme Corp',
        'business_type' => 'LLC',
        'tax_id' => 'TAX12345',
        'business_address' => '123 Business St',
        'business_phone' => '555-1234',
        'establishment_type' => 'llc',
        'business_sector' => 'retail',
        'commercial_reg_number' => '1010101010',
        'authorized_signatory_name' => 'Jane Doe',
        'authorized_signatory_id' => '1234567890',
        'signatory_position' => 'CEO',
        'beneficial_ownership_percentage' => 100,
    ]);

    $response = post(route('bank-accounts.store'), $data);

    $response->assertRedirect(route('bank-accounts.index'));
    $account = BankAccount::first();
    expect($account->account_category)->toBe('business');

    assertDatabaseHas('business_bank_accounts', [
        'bank_account_id' => $account->id,
    ]);

    $business = $account->business;
    expect($business->business_name)->toBe('Acme Corp');
    expect($business->tax_id)->toBe('TAX12345');
    expect($business->establishment_type)->toBe('llc');
    expect($business->business_sector)->toBe('retail');
    expect($business->commercial_reg_number)->toBe('1010101010');
    expect($business->beneficial_ownership_percentage)->toBe(100.0);
});

test('user can update bank account category', function () {
    $user = User::factory()->create();
    actingAs($user);

    // Create Personal
    $account = BankAccount::factory()->create(['user_id' => $user->id, 'account_category' => 'personal']);
    $account->personal()->create([
        'account_holder_name' => 'John Doe',
        'date_of_birth' => '1990-01-01',
        'ssn_last_4' => '1234',
    ]);

    // Update to Business
    $newData = [
        ...$account->toArray(),
        'account_category' => 'business',
        'business_name' => 'Acme Corp',
        'business_type' => 'LLC',
        'tax_id' => 'TAX12345',
        'business_address' => '123 Business St',
        'business_phone' => '555-1234',
        'establishment_type' => 'llc',
        'business_sector' => 'retail',
        'commercial_reg_number' => '1010101010',
        'authorized_signatory_name' => 'Jane Doe',
        'authorized_signatory_id' => '1234567890',
        'signatory_position' => 'CEO',
        'beneficial_ownership_percentage' => 100,
    ];

    $response = put(route('bank-accounts.update', $account), $newData);

    $response->assertRedirect(route('bank-accounts.index'));

    $account->refresh();
    expect($account->account_category)->toBe('business');

    // Check old personal is gone
    assertDatabaseMissing('personal_bank_accounts', ['bank_account_id' => $account->id]);

    // Check new business exists
    assertDatabaseHas('business_bank_accounts', ['bank_account_id' => $account->id]);
});
