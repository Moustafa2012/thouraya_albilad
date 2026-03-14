<?php

namespace App\Services\Logging;

use App\Models\User;
use App\Models\UserLoginHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class SecurityLogger
{
    public function logLoginAttempt(User|null $user, bool $successful, ?string $failureReason = null): UserLoginHistory
    {
        return UserLoginHistory::create([
            'user_id' => $user?->id,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'successful' => $successful,
            'failure_reason' => $failureReason,
            'login_at' => now(),
        ]);
    }

    public function logLogout(User $user): void
    {
        $loginHistory = UserLoginHistory::where('user_id', $user->id)
            ->whereNull('logout_at')
            ->latest()
            ->first();

        if ($loginHistory) {
            $loginHistory->update([
                'logout_at' => now(),
                'session_duration' => now()->diffInSeconds($loginHistory->login_at),
            ]);
        }
    }

    public function logFailedLogin(string $email, string $ip, string $userAgent, string $reason): void
    {
        UserLoginHistory::create([
            'user_id' => null,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'successful' => false,
            'failure_reason' => $reason,
            'login_at' => now(),
        ]);
    }

    public function logTwoFactorAttempt(User $user, bool $passed): void
    {
        $loginHistory = UserLoginHistory::where('user_id', $user->id)
            ->whereNull('logout_at')
            ->latest()
            ->first();

        if ($loginHistory) {
            $loginHistory->update([
                'two_factor_passed' => $passed,
            ]);
        }
    }

    public function detectSuspiciousActivity(User $user): array
    {
        $suspiciousActivities = [];

        // Check for login from new location
        $lastLogin = UserLoginHistory::where('user_id', $user->id)
            ->where('successful', true)
            ->latest('login_at')
            ->skip(1)
            ->first();

        if ($lastLogin) {
            $currentIp = Request::ip();
            if ($lastLogin->ip_address !== $currentIp) {
                $suspiciousActivities[] = [
                    'type' => 'new_location',
                    'description' => "Login from new IP address: {$currentIp}",
                    'severity' => 'warning',
                ];
            }
        }

        // Check for rapid login attempts
        $recentFailedLogins = UserLoginHistory::where('user_id', $user->id)
            ->where('successful', false)
            ->where('login_at', '>', now()->subMinutes(15))
            ->count();

        if ($recentFailedLogins >= 3) {
            $suspiciousActivities[] = [
                'type' => 'brute_force_attempt',
                'description' => "Multiple failed login attempts detected: {$recentFailedLogins} in 15 minutes",
                'severity' => 'critical',
            ];
        }

        // Check for rapid password changes
        $recentPasswordChanges = \App\Models\UserActivityLog::where('user_id', $user->id)
            ->where('action', 'password_changed')
            ->where('created_at', '>', now()->subHours(24))
            ->count();

        if ($recentPasswordChanges >= 3) {
            $suspiciousActivities[] = [
                'type' => 'rapid_password_changes',
                'description' => "Multiple password changes detected: {$recentPasswordChanges} in 24 hours",
                'severity' => 'warning',
            ];
        }

        // Check for concurrent sessions
        $concurrentSessions = \App\Models\UserLoginHistory::where('user_id', $user->id)
            ->whereNull('logout_at')
            ->count();

        if ($concurrentSessions > 3) {
            $suspiciousActivities[] = [
                'type' => 'concurrent_sessions',
                'description' => "Multiple concurrent sessions detected: {$concurrentSessions}",
                'severity' => 'warning',
            ];
        }

        return $suspiciousActivities;
    }

    public function shouldLockAccount(User $user): bool
    {
        // Lock account after 5 failed login attempts in 15 minutes
        $failedAttempts = UserLoginHistory::where('user_id', $user->id)
            ->where('successful', false)
            ->where('login_at', '>', now()->subMinutes(15))
            ->count();

        return $failedAttempts >= 5;
    }

    public function lockAccount(User $user, string $reason): void
    {
        $user->update([
            'locked_until' => now()->addMinutes(30),
            'login_attempts' => 0,
        ]);

        app(ActivityLogger::class)->logAccountLocked($user, $reason);
    }

    public function unlockAccount(User $user): void
    {
        $user->update([
            'locked_until' => null,
            'login_attempts' => 0,
        ]);

        app(ActivityLogger::class)->logAccountUnlocked($user);
    }
}
