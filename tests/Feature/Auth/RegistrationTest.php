<?php

use App\Models\User;

use function Pest\Laravel\assertAuthenticated;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

test('registration screen can be rendered', function () {
    $response = get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration stores user ip address', function () {
    $response = post(route('register.store'), [
        'name' => 'IP Test User',
        'username' => 'iptestuser',
        'email' => 'iptest@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ], [
        'REMOTE_ADDR' => '198.51.100.5',
    ]);

    assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::query()->where('email', 'iptest@example.com')->firstOrFail();

    expect($user->created_ip)->toBe('198.51.100.5');
});
