<?php

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\delete;
use function Pest\Laravel\from;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    actingAs($user);

    $response = get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    actingAs($user);

    $response = patch(route('profile.update'), [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'phone' => '0500000000',
        'avatar' => 'https://example.com/avatar.png',
        'bio' => 'Short bio',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->phone)->toBe('0500000000');
    expect($user->avatar)->toBe('https://example.com/avatar.png');
    expect($user->bio)->toBe('Short bio');
    expect($user->email_verified_at)->toBeNull();
});

test('profile update validates avatar url', function () {
    $user = User::factory()->create();

    actingAs($user);

    $response = from(route('profile.edit'))->patch(route('profile.update'), [
        'name' => $user->name,
        'username' => $user->username,
        'email' => $user->email,
        'avatar' => 'not-a-url',
    ]);

    $response
        ->assertSessionHasErrors('avatar')
        ->assertRedirect(route('profile.edit'));
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    actingAs($user);

    $response = patch(route('profile.update'), [
        'name' => 'Test User',
        'username' => $user->username,
        'email' => $user->email,
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    actingAs($user);

    $response = delete(route('profile.destroy'), [
        'password' => 'password',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    assertGuest();
    $user->refresh();
    expect($user->trashed())->toBeTrue();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    actingAs($user);

    $response = from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
