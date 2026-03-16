<?php

use App\Enums\UserPermission;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('admin can access protected route', function () {
    Route::get('/test/admin', function () {
        return 'ok';
    })->middleware(['auth', 'can:'.UserPermission::ADMIN_ACCESS->value]);

    $user = User::factory()->admin()->create();

    actingAs($user);

    get('/test/admin')->assertStatus(200);
});

test('user cannot access admin route', function () {
    Route::get('/test/admin', function () {
        return 'ok';
    })->middleware(['auth', 'can:'.UserPermission::ADMIN_ACCESS->value]);

    $user = User::factory()->create(['role' => UserRole::VISITOR]);

    actingAs($user);

    get('/test/admin')->assertStatus(403);
});

test('inertia shared props contain role and can', function () {
    $user = User::factory()->admin()->create();

    actingAs($user);

    get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('auth.user.role', UserRole::ADMIN->value)
            ->has('auth.user.can', 4)
            ->where('auth.user.can', function ($can) {
                if ($can instanceof \Illuminate\Support\Collection) {
                    return $can->contains(UserPermission::ADMIN_ACCESS->value);
                }

                return in_array(UserPermission::ADMIN_ACCESS->value, $can);
            })
        );
});

test('inertia shared props support manager role', function () {
    $user = User::factory()->create(['role' => UserRole::MANAGER]);

    actingAs($user);

    get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('auth.user.role', UserRole::MANAGER->value)
            ->has('auth.user.can', 4)
        );
});

test('inertia shared props support user role', function () {
    $user = User::factory()->create(['role' => UserRole::USER]);

    actingAs($user);

    get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('auth.user.role', UserRole::USER->value)
            ->has('auth.user.can', 0)
        );
});
