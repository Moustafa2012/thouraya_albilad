<?php

use App\Models\Beneficiary;
use App\Models\User;

test('beneficiaries can be listed', function () {
    $user = User::factory()->create();
    Beneficiary::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->get('/beneficiaries');

    $response->assertStatus(200);
    // Inertia testing assertions might need setup, but basic status check works.
    // To test props, we can use assertInertia

    $response->assertInertia(fn ($page) => $page
        ->component('beneficiaries')
        ->has('beneficiaries', 3)
    );
});

test('beneficiary can be created', function () {
    $user = User::factory()->create();

    $data = [
        'accountType' => 'individual',
        'nameAr' => 'أحمد محمد',
        'nameEn' => 'Ahmed Mohamed',
        'nationalId' => '1234567890',
        'country' => 'SA',
        'bankName' => 'Al Rajhi Bank',
        'accountNumber' => '1234567890',
        'iban' => 'SA0380000000608010167519',
        'swiftCode' => 'RJHIXS',
        'currency' => 'SAR',
        'category' => 'other',
        'notes' => 'Test beneficiary',
    ];

    $response = $this->actingAs($user)
        ->post('/beneficiaries', $data);

    $response->assertRedirect(route('beneficiaries.index'));

    $this->assertDatabaseHas('beneficiaries', [
        'user_id' => $user->id,
        'name_en' => 'Ahmed Mohamed',
        'account_type' => 'individual',
        'category' => 'other',
    ]);
});

test('beneficiary can be deleted', function () {
    $user = User::factory()->create();
    $beneficiary = Beneficiary::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->delete("/beneficiaries/{$beneficiary->id}");

    $response->assertRedirect(route('beneficiaries.index'));

    $this->assertDatabaseMissing('beneficiaries', [
        'id' => $beneficiary->id,
    ]);
});
