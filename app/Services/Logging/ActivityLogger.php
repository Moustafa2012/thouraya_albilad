<?php

namespace App\Services\Logging;

use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ActivityLogger
{
    public function log(array $data): UserActivityLog
    {
        $logData = array_merge([
            'action' => 'general',
            'entity_type' => null,
            'entity_id' => null,
            'description' => null,
            'old_values' => null,
            'new_values' => null,
            'metadata' => null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'device_type' => null,
            'browser' => null,
            'platform' => null,
            'location' => null,
            'country_code' => null,
            'request_method' => request()->method(),
            'request_url' => request()->fullUrl(),
            'response_code' => null,
            'severity' => 'info',
            'is_suspicious' => false,
            'created_at' => now(),
        ], array_diff_key($data, ['updated_at' => '']));

        // Add comprehensive metadata
        $logData['metadata'] = array_merge($logData['metadata'] ?? [], [
            'request_id' => $this->getRequestId(),
            'correlation_id' => $this->getCorrelationId(),
            'session_id' => session()->getId(),
        ]);

        // user_id is required (NOT NULL), so always provide it
        // If no authenticated user, use system user (ID 1 - assuming it exists)
        if (Auth::check()) {
            $logData['user_id'] = Auth::id();
        } else {
            // Use system user or first available user for system logs
            $systemUser = User::where('email', 'admin@example.com')->first() ?? User::first();
            $logData['user_id'] = $systemUser->id;
        }

        // Only include session_id if it exists in the sessions table
        $sessionId = session()->getId();
        if ($sessionId && DB::table('sessions')->where('id', $sessionId)->exists()) {
            $logData['session_id'] = $sessionId;
        }

        return UserActivityLog::create($logData);
    }

    public function logLogin(User $user, bool $successful = true, ?string $failureReason = null): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => $successful ? 'login' : 'login_failed',
            'description' => $successful ? 'قام المستخدم بتسجيل الدخول بنجاح' : "محاولة تسجيل دخول فاشلة: {$failureReason}",
            'severity' => $successful ? 'info' : 'warning',
            'is_suspicious' => ! $successful,
            'response_code' => $successful ? 200 : 401,
        ]);
    }

    public function logLogout(User $user): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'logout',
            'description' => 'قام المستخدم بتسجيل الخروج',
            'severity' => 'info',
        ]);
    }

    public function logPasswordChange(User $user): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'password_changed',
            'description' => 'قام المستخدم بتغيير كلمة المرور',
            'severity' => 'info',
        ]);
    }

    public function logPasswordReset(User $user): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'password_reset',
            'description' => 'قام المستخدم بإعادة تعيين كلمة المرور',
            'severity' => 'info',
        ]);
    }

    public function logProfileUpdate(User $user, array $oldValues, array $newValues): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'profile_updated',
            'description' => 'تم تحديث معلومات الملف الشخصي للمستخدم',
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'severity' => 'info',
        ]);
    }

    public function logTwoFactorEnabled(User $user): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'two_factor_enabled',
            'description' => 'تم تفعيل المصادقة الثنائية',
            'severity' => 'info',
        ]);
    }

    public function logTwoFactorDisabled(User $user): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'two_factor_disabled',
            'description' => 'تم تعطيل المصادقة الثنائية',
            'severity' => 'warning',
        ]);
    }

    public function logAccountLocked(User $user, string $reason): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'account_locked',
            'description' => "تم قفل الحساب: {$reason}",
            'severity' => 'critical',
            'is_suspicious' => true,
        ]);
    }

    public function logAccountUnlocked(User $user): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'account_unlocked',
            'description' => 'تم فتح الحساب',
            'severity' => 'info',
        ]);
    }

    public function logSuspiciousActivity(User $user, string $activity, string $reason): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => $activity,
            'description' => "تم اكتشاف نشاط مشبوه: {$reason}",
            'severity' => 'warning',
            'is_suspicious' => true,
        ]);
    }

    public function logDeviceChange(User $user, string $deviceInfo): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'new_device_detected',
            'description' => "تم اكتشاف تسجيل دخول من جهاز جديد: {$deviceInfo}",
            'severity' => 'warning',
            'is_suspicious' => true,
        ]);
    }

    public function logLocationChange(User $user, string $location): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => 'new_location_detected',
            'description' => "تم اكتشاف تسجيل دخول من موقع جديد: {$location}",
            'severity' => 'warning',
            'is_suspicious' => true,
        ]);
    }

    public function logSecurityEvent(User $user, string $event, string $description, string $severity = 'warning'): UserActivityLog
    {
        return $this->log([
            'user_id' => $user->id,
            'action' => $event,
            'description' => $description,
            'severity' => $severity,
            'is_suspicious' => in_array($severity, ['warning', 'critical']),
        ]);
    }

    private function getRequestId(): string
    {
        return request()->header('X-Request-ID') ?? (string) Str::uuid();
    }

    private function getCorrelationId(): string
    {
        return request()->header('X-Correlation-ID') ?? session()->get('correlation_id', (string) Str::uuid());
    }
}
