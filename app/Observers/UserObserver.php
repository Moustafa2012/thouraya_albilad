<?php

namespace App\Observers;

use App\Models\User;
use App\Services\Logging\ActivityLogger;

class UserObserver
{
    public function created(User $user): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        app(ActivityLogger::class)->log([
            'user_id' => $user->id,
            'action' => 'user_registered',
            'description' => 'User account registered',
            'ip_address' => $user->created_ip,
            'created_at' => now(),
        ]);
    }

    public function updated(User $user): void
    {
        $changes = $user->getChanges();

        // Log password changes
        if (isset($changes['password'])) {
            app(ActivityLogger::class)->logPasswordChange($user);

            $user->forceFill(['password_changed_at' => now()])->saveQuietly();
        }

        // Log profile updates (email, name, phone, etc.)
        $profileFields = ['email', 'name', 'username', 'phone', 'avatar', 'date_of_birth', 'gender', 'nationality', 'timezone', 'locale', 'bio', 'address', 'city', 'state', 'country', 'postal_code'];
        $profileChanges = array_intersect_key($changes, array_flip($profileFields));

        if (! empty($profileChanges)) {
            $oldValues = [];
            foreach ($profileChanges as $key => $value) {
                if (array_key_exists($key, $user->getOriginal())) {
                    $oldValues[$key] = $user->getOriginal()[$key];
                }
            }

            app(ActivityLogger::class)->logProfileUpdate($user, $oldValues, $profileChanges);
        }

        // Log two-factor authentication changes
        if (isset($changes['two_factor_enabled'])) {
            if ($changes['two_factor_enabled']) {
                app(ActivityLogger::class)->logTwoFactorEnabled($user);
            } else {
                app(ActivityLogger::class)->logTwoFactorDisabled($user);
            }
        }

        // Log account status changes
        if (isset($changes['is_banned']) && $changes['is_banned']) {
            app(ActivityLogger::class)->logSecurityEvent(
                $user,
                'account_banned',
                'User account was banned',
                'critical'
            );
        }

        if (isset($changes['is_active']) && ! $changes['is_active']) {
            app(ActivityLogger::class)->logSecurityEvent(
                $user,
                'account_deactivated',
                'User account was deactivated',
                'warning'
            );
        }

        // Log role changes
        if (isset($changes['role'])) {
            app(ActivityLogger::class)->log([
                'user_id' => $user->id,
                'action' => 'role_changed',
                'description' => "User role changed from {$user->getOriginal()['role']} to {$changes['role']}",
                'old_values' => ['role' => $user->getOriginal()['role']],
                'new_values' => ['role' => $changes['role']],
                'severity' => 'warning',
            ]);
        }

        // Log verification status changes
        if (isset($changes['email_verified_at'])) {
            app(ActivityLogger::class)->log([
                'user_id' => $user->id,
                'action' => 'email_verified',
                'description' => 'User email verified',
                'severity' => 'info',
            ]);
        }

        if (isset($changes['phone_verified_at'])) {
            app(ActivityLogger::class)->log([
                'user_id' => $user->id,
                'action' => 'phone_verified',
                'description' => 'User phone verified',
                'severity' => 'info',
            ]);
        }
    }

    public function deleted(User $user): void
    {
        if ($user->isForceDeleting()) {
            app(ActivityLogger::class)->log([
                'user_id' => $user->id,
                'action' => 'user_permanently_deleted',
                'description' => 'User account permanently deleted',
                'severity' => 'critical',
            ]);
        } else {
            app(ActivityLogger::class)->log([
                'user_id' => $user->id,
                'action' => 'user_soft_deleted',
                'description' => 'User account soft deleted',
                'severity' => 'warning',
            ]);
        }
    }

    public function restored(User $user): void
    {
        app(ActivityLogger::class)->log([
            'user_id' => $user->id,
            'action' => 'user_restored',
            'description' => 'User account restored',
            'severity' => 'info',
        ]);
    }
}
