<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('bank accounts index page can be rendered', function () {
    $user = User::factory()->create();

    actingAs($user);

    get('/bank-accounts')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('bank-accounts')
        );
});

test('bank accounts create page can be rendered', function () {
    $user = User::factory()->create();

    actingAs($user);

    get('/bank-accounts/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Createbankaccount')
        );
});
