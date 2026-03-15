<?php

use App\Enums\UserRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;

test('manage users page is forbidden for visitors', function () {
    $user = User::factory()->create(['role' => UserRole::VISITOR]);

    actingAs($user);

    get('/settings/users')->assertStatus(403);
});

test('manage users page is available for admins', function () {
    $user = User::factory()->admin()->create();

    actingAs($user);

    get('/settings/users')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/users')
            ->has('users')
            ->has('roles')
        );
});

test('admin can update another user role and status', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->create(['role' => UserRole::VISITOR, 'is_active' => true, 'is_banned' => false]);

    actingAs($admin);

    patch("/settings/users/{$target->id}", [
        'role' => UserRole::ADMIN->value,
        'is_active' => false,
        'is_banned' => true,
        'ban_reason' => 'Policy violation',
    ])->assertSessionHasNoErrors();

    $target->refresh();
    expect($target->role)->toBe(UserRole::ADMIN);
    expect($target->is_active)->toBeFalse();
    expect($target->is_banned)->toBeTrue();
    expect($target->ban_reason)->toBe('Policy violation');
});

test('admin cannot assign super admin role', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->create(['role' => UserRole::VISITOR]);

    actingAs($admin);

    patch("/settings/users/{$target->id}", [
        'role' => UserRole::SUPER_ADMIN->value,
    ])->assertSessionHas('error');

    expect($target->refresh()->role)->toBe(UserRole::VISITOR);
});

test('user cannot update self from user management screen', function () {
    $admin = User::factory()->admin()->create();

    actingAs($admin);

    patch("/settings/users/{$admin->id}", [
        'role' => UserRole::VISITOR->value,
    ])->assertSessionHas('error');

    expect($admin->refresh()->role)->toBe(UserRole::ADMIN);
});
