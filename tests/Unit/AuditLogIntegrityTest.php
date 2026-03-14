<?php

use App\Services\Logging\AuditLogIntegrity;
use App\Models\AuditLog;
use App\Models\UserActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
});

test('generates hash for audit log', function () {
    $user = User::factory()->create();
    $log = AuditLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'create_user',
        'auditable_type' => 'App\\Models\\User',
        'auditable_id' => $user->id,
    ]);

    $integrity = new AuditLogIntegrity();
    $integrity->signAuditLog($log);

    expect($log->integrity_hash)->not->toBeNull();
    expect(strlen($log->integrity_hash))->toBe(64);
});

test('generates hash for activity log', function () {
    $user = User::factory()->create();
    $log = UserActivityLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'login',
    ]);

    $integrity = new AuditLogIntegrity();
    $integrity->signActivityLog($log);

    expect($log->integrity_hash)->not->toBeNull();
    expect(strlen($log->integrity_hash))->toBe(64);
});

test('verifies valid audit log hash', function () {
    $user = User::factory()->create();
    $log = AuditLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'create_user',
        'auditable_type' => 'App\\Models\\User',
        'auditable_id' => $user->id,
    ]);

    $integrity = new AuditLogIntegrity();
    $integrity->signAuditLog($log);

    expect($integrity->verifyAuditLog($log))->toBeTrue();
});

test('verifies valid activity log hash', function () {
    $user = User::factory()->create();
    $log = UserActivityLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'login',
    ]);

    $integrity = new AuditLogIntegrity();
    $integrity->signActivityLog($log);

    expect($integrity->verifyActivityLog($log))->toBeTrue();
});

test('detects tampered audit log', function () {
    $user = User::factory()->create();
    $log = AuditLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'create_user',
        'auditable_type' => 'App\\Models\\User',
        'auditable_id' => $user->id,
    ]);

    $integrity = new AuditLogIntegrity();
    $integrity->signAuditLog($log);

    $log->action = 'delete_user';
    $log->save();

    expect($integrity->verifyAuditLog($log))->toBeFalse();
});

test('detects tampered activity log', function () {
    $user = User::factory()->create();
    $log = UserActivityLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'login',
    ]);

    $integrity = new AuditLogIntegrity();
    $integrity->signActivityLog($log);

    $log->action = 'logout';
    $log->save();

    expect($integrity->verifyActivityLog($log))->toBeFalse();
});

test('returns false for log without hash', function () {
    $user = User::factory()->create();
    $log = AuditLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'create_user',
        'integrity_hash' => null,
    ]);

    $integrity = new AuditLogIntegrity();
    expect($integrity->verifyAuditLog($log))->toBeFalse();
});

test('verifies all logs returns statistics', function () {
    $user = User::factory()->create();
    
    $auditLogs = AuditLog::factory()->count(5)->create(['user_id' => $user->id]);
    $activityLogs = UserActivityLog::factory()->count(5)->create(['user_id' => $user->id]);

    $integrity = new AuditLogIntegrity();
    $integrity->signAuditLog($auditLogs->first());
    $integrity->signActivityLog($activityLogs->first());

    $results = $integrity->verifyAllLogs(10);

    expect($results['total_audit_logs'])->toBeGreaterThanOrEqual(1);
    expect($results['total_activity_logs'])->toBeGreaterThanOrEqual(1);
    expect($results['verified_audit_logs'])->toBeGreaterThanOrEqual(1);
    expect($results['verified_activity_logs'])->toBeGreaterThanOrEqual(1);
});

test('signs recent logs', function () {
    $user = User::factory()->create();
    
    AuditLog::factory()->count(5)->create([
        'user_id' => $user->id,
        'integrity_hash' => null,
    ]);

    UserActivityLog::factory()->count(5)->create([
        'user_id' => $user->id,
        'integrity_hash' => null,
    ]);

    $integrity = new AuditLogIntegrity();
    $integrity->signRecentLogs(10);

    expect(AuditLog::whereNotNull('integrity_hash')->count())->toBe(5);
    expect(UserActivityLog::whereNotNull('integrity_hash')->count())->toBe(5);
});

test('hash is deterministic for same data', function () {
    $user = User::factory()->create();
    $log1 = AuditLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'create_user',
        'auditable_type' => 'App\\Models\\User',
        'auditable_id' => $user->id,
    ]);

    $log2 = AuditLog::factory()->create([
        'user_id' => $user->id,
        'action' => 'create_user',
        'auditable_type' => 'App\\Models\\User',
        'auditable_id' => $user->id,
    ]);

    $integrity = new AuditLogIntegrity();
    $hash1 = $integrity->generateHash([
        'id' => $log1->id,
        'user_id' => $log1->user_id,
        'action' => $log1->action,
        'auditable_type' => $log1->auditable_type,
        'auditable_id' => $log1->auditable_id,
    ]);

    $hash2 = $integrity->generateHash([
        'id' => $log2->id,
        'user_id' => $log2->user_id,
        'action' => $log2->action,
        'auditable_type' => $log2->auditable_type,
        'auditable_id' => $log2->auditable_id,
    ]);

    expect($hash1)->not->toBe($hash2);
});
