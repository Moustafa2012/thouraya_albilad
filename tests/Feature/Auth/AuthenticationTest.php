<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertAuthenticated;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

// ─── Rendering ───────────────────────────────────────────────────────────────

test('login screen renders successfully', function () {
    get(route('login'))
        ->assertOk();
});

test('authenticated users are redirected away from login screen', function () {
    $user = User::factory()->create();

    actingAs($user);

    get(route('login'))
        ->assertRedirect(route('dashboard', absolute: false));
});

// ─── Authentication ───────────────────────────────────────────────────────────

test('users can authenticate with valid credentials', function () {
    $user = User::factory()->create();

    post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    assertAuthenticated();
});

test('users cannot authenticate with wrong password', function () {
    $user = User::factory()->create();

    post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    assertGuest();
});

test('users cannot authenticate with non-existent email', function () {
    post(route('login.store'), [
        'email' => 'ghost@example.com',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    assertGuest();
});

test('login requires email and password', function (array $payload, string $field) {
    post(route('login.store'), $payload)
        ->assertSessionHasErrors($field);

    assertGuest();
})->with([
    'missing email' => [['password' => 'password'], 'email'],
    'missing password' => [['email' => 'user@example.com'], 'password'],
    'invalid email' => [['email' => 'not-an-email', 'password' => 'password'], 'email'],
]);

// ─── Post-login Side Effects ──────────────────────────────────────────────────

test('last login ip is recorded on successful login', function () {
    $user = User::factory()->create();

    post(
        route('login.store'),
        ['email' => $user->email, 'password' => 'password'],
        ['REMOTE_ADDR' => '203.0.113.10'],
    )->assertRedirect(route('dashboard', absolute: false));

    expect($user->refresh()->last_login_ip)->toBe('203.0.113.10');
});

// ─── Two-Factor Authentication ────────────────────────────────────────────────

test('users with two-factor authentication are challenged before access', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        return;
    }

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()
        ->withTwoFactor()
        ->create();

    post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertRedirect(route('two-factor.login'))
        ->assertSessionHas('login.id', $user->id);

    assertGuest();
});

// ─── Logout ───────────────────────────────────────────────────────────────────

test('authenticated users can logout', function () {
    actingAs(User::factory()->create());

    post(route('logout'))
        ->assertRedirect(route('home'));

    assertGuest();
});

test('guests cannot access logout', function () {
    post(route('logout'))
        ->assertRedirect(route('login'));
});

// ─── Rate Limiting ────────────────────────────────────────────────────────────

test('login is rate limited after too many failed attempts', function () {
    $user = User::factory()->create();

    $key = md5('login'.implode('|', [$user->email, '127.0.0.1']));
    RateLimiter::increment($key, amount: 5);

    post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertTooManyRequests();

    assertGuest();
});

test('rate limiter resets after successful login', function () {
    $user = User::factory()->create();

    $key = md5('login'.implode('|', [$user->email, '127.0.0.1']));
    RateLimiter::increment($key, amount: 3);

    post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    expect(RateLimiter::attempts($key))->toBe(0);
    assertAuthenticated();
});
