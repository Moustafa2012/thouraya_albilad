<?php

use App\Models\AuditLog;
use App\Models\User;
use App\Services\Logging\AuditLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    Auth::shouldReceive('id')->andReturn(1);
});

test('logs model creation', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger;

    $log = $logger->logCreate($user);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('create');
    expect($log->user_id)->toBe(1);
    expect($log->description)->toBe('create');
    expect($log->integrity_hash)->not->toBeNull();
});

test('logs model update', function () {
    $user = User::factory()->create(['name' => 'Old Name']);
    $logger = new AuditLogger;

    $changes = ['name' => 'New Name'];
    $log = $logger->logUpdate($user, $changes);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('update');
    expect($log->old_values)->toBe(['name' => 'Old Name']);
    expect($log->new_values)->toBe($changes);
    expect($log->integrity_hash)->not->toBeNull();
});

test('logs model deletion', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger;

    $log = $logger->logDelete($user);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('delete');
    expect($log->integrity_hash)->not->toBeNull();
});

test('logs custom action', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger;

    $data = [
        'old_values' => ['status' => 'active'],
        'new_values' => ['status' => 'suspended'],
        'description' => 'Custom action occurred',
        'severity' => 'warning',
    ];

    $log = $logger->logCustom($user, 'custom_action', $data);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('custom_action');
    expect($log->description)->toBe('Custom action occurred');
    expect($log->severity)->toBe('warning');
    expect($log->integrity_hash)->not->toBeNull();
});

test('stores request context', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger;

    $log = $logger->logCreate($user);

    expect($log->ip_address)->toBeString()->or->toBeNull();
    expect($log->user_agent)->toBeString()->or->toBeNull();
});
