<?php

use App\Services\Logging\ActivityLogger;
use App\Models\UserActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

beforeEach(function () {
    Auth::shouldReceive('id')->andReturn(1);
});

test('logs user login with metadata', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logLogin($user, true);

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('login');
    expect($log->severity)->toBe('info');
    expect($log->is_suspicious)->toBeFalse();
    expect($log->metadata)->toHaveKey('request_id');
    expect($log->metadata)->toHaveKey('correlation_id');
});

test('logs failed login with warning severity', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logLogin($user, false, 'Invalid credentials');

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('login_failed');
    expect($log->severity)->toBe('warning');
    expect($log->is_suspicious)->toBeTrue();
});

test('logs user logout', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logLogout($user);

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('logout');
    expect($log->severity)->toBe('info');
});

test('logs password change', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logPasswordChange($user);

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('password_changed');
    expect($log->severity)->toBe('info');
});

test('logs password reset', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logPasswordReset($user);

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('password_reset');
    expect($log->severity)->toBe('info');
});

test('logs profile update with changes', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $oldValues = ['name' => 'Old Name'];
    $newValues = ['name' => 'New Name'];

    $log = $logger->logProfileUpdate($user, $oldValues, $newValues);

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('profile_updated');
    expect($log->old_values)->toBe($oldValues);
    expect($log->new_values)->toBe($newValues);
});

test('logs two factor enabled', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logTwoFactorEnabled($user);

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('two_factor_enabled');
    expect($log->severity)->toBe('info');
});

test('logs two factor disabled with warning', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logTwoFactorDisabled($user);

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('two_factor_disabled');
    expect($log->severity)->toBe('warning');
});

test('logs account locked with critical severity', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logAccountLocked($user, 'Too many failed attempts');

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('account_locked');
    expect($log->severity)->toBe('critical');
    expect($log->is_suspicious)->toBeTrue();
});

test('logs suspicious activity with warning', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logSuspiciousActivity($user, 'concurrent_sessions', 'Multiple sessions detected');

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('concurrent_sessions');
    expect($log->severity)->toBe('warning');
    expect($log->is_suspicious)->toBeTrue();
});

test('logs device change with warning', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logDeviceChange($user, 'Chrome on Windows');

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('new_device_detected');
    expect($log->severity)->toBe('warning');
    expect($log->is_suspicious)->toBeTrue();
});

test('logs location change with warning', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logLocationChange($user, 'New York, USA');

    expect($log)->toBeInstanceOf(UserActivityLog::class);
    expect($log->action)->toBe('new_location_detected');
    expect($log->severity)->toBe('warning');
    expect($log->is_suspicious)->toBeTrue();
});

test('includes comprehensive metadata', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log = $logger->logLogin($user, true);

    expect($log->metadata)->toHaveKeys([
        'request_id',
        'correlation_id',
        'session_id',
    ]);
});

test('generates unique request IDs', function () {
    $user = User::factory()->create();
    $logger = new ActivityLogger();

    $log1 = $logger->logLogin($user, true);
    $log2 = $logger->logLogin($user, true);

    expect($log1->metadata['request_id'])->not->toBe($log2->metadata['request_id']);
});
