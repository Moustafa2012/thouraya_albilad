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

test('beneficiary can be edited', function () {
    $user = User::factory()->create();
    $beneficiary = Beneficiary::factory()->create([
        'user_id' => $user->id,
        'name_en' => 'Old Name',
        'bank_name' => 'Old Bank',
    ]);

    $payload = [
        'accountType' => 'individual',
        'nameAr' => 'اسم جديد',
        'nameEn' => 'New Name',
        'nationalId' => '1234567890',
        'businessRegistration' => null,
        'taxId' => null,
        'email' => null,
        'phone' => null,
        'address' => null,
        'country' => 'SA',
        'bankName' => 'New Bank',
        'accountNumber' => '1234567890',
        'iban' => 'SA0380000000608010167519',
        'swiftCode' => 'RJHIXS',
        'currency' => 'SAR',
        'abaNumber' => null,
        'routingNumber' => null,
        'ifscCode' => null,
        'sortCode' => null,
        'bsbNumber' => null,
        'transitNumber' => null,
        'category' => 'other',
        'notes' => 'Updated beneficiary',
    ];

    $this->actingAs($user)
        ->get("/beneficiaries/{$beneficiary->id}/edit")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Createbeneficiary')
            ->where('isEdit', true)
            ->where('beneficiary.id', $beneficiary->id)
        );

    $this->actingAs($user)
        ->put("/beneficiaries/{$beneficiary->id}", $payload)
        ->assertRedirect(route('beneficiaries.index'));

    $this->assertDatabaseHas('beneficiaries', [
        'id' => $beneficiary->id,
        'name_en' => 'New Name',
        'bank_name' => 'New Bank',
    ]);
});
