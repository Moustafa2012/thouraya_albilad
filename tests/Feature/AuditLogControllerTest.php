<?php

use App\Http\Controllers\AuditLogController;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    Cache::flush();
});

test('audit logs index paginates results', function () {
    $user = User::factory()->create();
    AuditLog::factory()->count(60)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.index', ['page' => 1, 'per_page' => 50]));

    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('audit-logs')
            ->has('logs', 50)
            ->has('pagination', fn (AssertableInertia $page) => $page
                ->where('current_page', 1)
                ->where('per_page', 50)
                ->where('total', 60)
                ->where('total_pages', 2)
                ->where('has_more_pages', true)
            );
    });
});

test('audit logs index applies server-side filtering by action', function () {
    $user = User::factory()->create();
    AuditLog::factory()->create(['user_id' => $user->id, 'action' => 'create_user']);
    AuditLog::factory()->create(['user_id' => $user->id, 'action' => 'delete_user']);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.index', ['action' => 'create']));

    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('audit-logs')
            ->has('logs', 1)
            ->where('logs.0.action', 'create');
    });
});

test('audit logs index applies server-side search', function () {
    $user = User::factory()->create(['name' => 'John Doe']);
    AuditLog::factory()->create(['user_id' => $user->id, 'description' => 'User created account']);
    AuditLog::factory()->create(['user_id' => $user->id, 'description' => 'User deleted account']);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.index', ['search' => 'created']));

    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('audit-logs')
            ->has('logs', 1)
            ->where('logs.0.description', 'User created account');
    });
});

test('audit logs index filters by severity', function () {
    $user = User::factory()->create();
    AuditLog::factory()->create(['user_id' => $user->id, 'action' => 'delete_user']);
    AuditLog::factory()->create(['user_id' => $user->id, 'action' => 'create_user']);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.index', ['severity' => 'critical']));

    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('audit-logs')
            ->has('logs', 1)
            ->where('logs.0.severity', 'critical');
    });
});

test('audit logs index filters by date range', function () {
    $user = User::factory()->create();
    AuditLog::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(10)]);
    AuditLog::factory()->create(['user_id' => $user->id, 'created_at' => now()]);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.index', ['date_range' => 'week']));

    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('audit-logs')
            ->has('logs', 1);
    });
});

test('audit logs export returns CSV', function () {
    $user = User::factory()->create();
    AuditLog::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.export', ['format' => 'csv']));

    $response->assertStatus(200)
        ->assertHeader('content-type', 'text/csv');
});

test('audit logs export returns JSON', function () {
    $user = User::factory()->create();
    AuditLog::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.export', ['format' => 'json']));

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data',
            'meta' => ['total', 'exported_at'],
        ]);
});

test('audit logs stats returns statistics', function () {
    $user = User::factory()->create();
    AuditLog::factory()->create(['user_id' => $user->id, 'action' => 'create_user']);
    AuditLog::factory()->create(['user_id' => $user->id, 'action' => 'delete_user']);
    UserActivityLog::factory()->create(['user_id' => $user->id, 'action' => 'login']);

    $response = $this->actingAs($user)
        ->get(route('audit-logs.stats'));

    $response->assertStatus(200)
        ->assertJsonStructure([
            'total_audit_logs',
            'total_activity_logs',
            'critical_logs',
            'warning_logs',
            'info_logs',
            'unique_users',
        ]);
});

test('audit logs index caches results', function () {
    $user = User::factory()->create();
    AuditLog::factory()->count(10)->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('audit-logs.index', ['page' => 1, 'per_page' => 50]));

    $cacheKey = 'audit_logs_page_1_50_' . md5(json_encode([]));

    expect(Cache::has($cacheKey))->toBeTrue();
});
