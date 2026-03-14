<?php

use App\Services\Logging\AuditLogger;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

beforeEach(function () {
    Auth::shouldReceive('id')->andReturn(1);
});

test('logs model creation with metadata', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger();

    $log = $logger->logCreate($user);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('create');
    expect($log->user_id)->toBe(1);
    expect($log->metadata)->toHaveKey('request_id');
    expect($log->metadata)->toHaveKey('correlation_id');
    expect($log->metadata)->toHaveKey('session_id');
});

test('logs model update with metadata', function () {
    $user = User::factory()->create(['name' => 'Old Name']);
    $logger = new AuditLogger();

    $changes = ['name' => 'New Name'];
    $log = $logger->logUpdate($user, $changes);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('update');
    expect($log->old_values)->toBe(['name' => 'Old Name']);
    expect($log->new_values)->toBe($changes);
    expect($log->metadata)->toHaveKey('request_id');
});

test('logs model deletion with metadata', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger();

    $log = $logger->logDelete($user);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('delete');
    expect($log->metadata)->toHaveKey('request_id');
});

test('logs custom action with metadata', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger();

    $data = [
        'old_values' => ['status' => 'active'],
        'new_values' => ['status' => 'suspended'],
        'metadata' => ['reason' => 'violation'],
    ];

    $log = $logger->logCustom($user, 'custom_action', $data);

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->action)->toBe('custom_action');
    expect($log->metadata)->toHaveKey('request_id');
    expect($log->metadata)->toHaveKey('correlation_id');
    expect($log->metadata['custom_data'])->toBe(['reason' => 'violation']);
});

test('includes request context in metadata', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger();

    $log = $logger->logCreate($user);

    expect($log->metadata)->toHaveKeys([
        'request_id',
        'correlation_id',
        'session_id',
        'user_agent',
        'ip_address',
        'request_url',
        'request_method',
    ]);
});

test('generates unique request IDs', function () {
    $user = User::factory()->create();
    $logger = new AuditLogger();

    $log1 = $logger->logCreate($user);
    $log2 = $logger->logCreate($user);

    expect($log1->metadata['request_id'])->not->toBe($log2->metadata['request_id']);
});
