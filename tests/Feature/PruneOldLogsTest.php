<?php

use App\Jobs\PruneOldLogs;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\UserActivityLog;
use App\Models\UserLoginHistory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
});

test('prune old activity logs', function () {
    $user = User::factory()->create();
    UserActivityLog::factory()->count(5)->create([
        'user_id' => $user->id,
        'created_at' => now()->subDays(400),
    ]);

    $job = new PruneOldLogs('activity', 365, false);
    $job->handle();

    expect(UserActivityLog::count())->toBe(0);
});

test('prune old login history', function () {
    $user = User::factory()->create();
    UserLoginHistory::factory()->count(5)->create([
        'user_id' => $user->id,
        'login_at' => now()->subDays(200),
    ]);

    $job = new PruneOldLogs('login_history', 180, false);
    $job->handle();

    expect(UserLoginHistory::count())->toBe(0);
});

test('prune old audit logs', function () {
    $user = User::factory()->create();
    AuditLog::factory()->count(5)->create([
        'user_id' => $user->id,
        'created_at' => now()->subDays(800),
    ]);

    $job = new PruneOldLogs('audit', 730, false);
    $job->handle();

    expect(AuditLog::count())->toBe(0);
});

test('archive logs before pruning', function () {
    $user = User::factory()->create();
    $logs = UserActivityLog::factory()->count(3)->create([
        'user_id' => $user->id,
        'created_at' => now()->subDays(400),
    ]);

    $job = new PruneOldLogs('activity', 365, true);
    $job->handle();

    $files = Storage::disk('local')->allFiles('archives');
    expect(collect($files)->contains(fn (string $path) => str_contains($path, 'activity_logs_') && str_ends_with($path, '.json')))->toBeTrue();

    expect(UserActivityLog::count())->toBe(0);
});

test('prune skips when no old logs exist', function () {
    $user = User::factory()->create();
    UserActivityLog::factory()->count(5)->create([
        'user_id' => $user->id,
        'created_at' => now()->subDays(10),
    ]);

    $job = new PruneOldLogs('activity', 365, false);
    $job->handle();

    expect(UserActivityLog::count())->toBe(5);
});

test('prune logs detailed logging', function () {
    $user = User::factory()->create();
    UserActivityLog::factory()->count(3)->create([
        'user_id' => $user->id,
        'created_at' => now()->subDays(400),
    ]);

    Log::shouldReceive('info')->once()->with(\Mockery::on(function ($message) {
        return str_contains($message, 'Pruned 3 old activity logs');
    }), \Mockery::on(function ($context) {
        return isset($context['log_type']) &&
               isset($context['days_kept']) &&
               isset($context['cutoff_date']);
    }));

    $job = new PruneOldLogs('activity', 365, false);
    $job->handle();
});

test('archive logs on failure continues pruning', function () {
    $user = User::factory()->create();
    UserActivityLog::factory()->count(3)->create([
        'user_id' => $user->id,
        'created_at' => now()->subDays(400),
    ]);

    Log::shouldReceive('error')->once();
    Log::shouldReceive('info')->zeroOrMoreTimes();
    Storage::shouldReceive('disk')->andThrow(new \Exception('Storage error'));

    $job = new PruneOldLogs('activity', 365, true);
    $job->handle();

    expect(UserActivityLog::count())->toBe(0);
});
