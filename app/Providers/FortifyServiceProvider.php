<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use App\Services\Logging\ActivityLogger;
use App\Services\Logging\SecurityLogger;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LoginResponse::class,
            \App\Http\Responses\LoginResponse::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureAuthentication();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    private function configureAuthentication(): void
    {
        Fortify::authenticateUsing(function (Request $request): ?User {
            $login = (string) $request->input('email');
            $securityLogger = app(SecurityLogger::class);
            $activityLogger = app(ActivityLogger::class);

            $user = User::query()
                ->where('email', $login)
                ->orWhere('username', $login)
                ->first();

            if (! $user) {
                // Log failed login attempt - user not found
                $securityLogger->logFailedLogin(
                    $login,
                    $request->ip(),
                    $request->userAgent(),
                    'User not found'
                );

                return null;
            }

            // Check if account is locked
            if ($user->locked_until && $user->locked_until->isFuture()) {
                $securityLogger->logFailedLogin(
                    $user->email,
                    $request->ip(),
                    $request->userAgent(),
                    'Account is locked'
                );

                return null;
            }

            // Check if account is inactive or banned
            if (! $user->is_active || $user->is_banned) {
                $reason = ! $user->is_active ? 'Account is inactive' : 'Account is banned';
                $securityLogger->logFailedLogin(
                    $user->email,
                    $request->ip(),
                    $request->userAgent(),
                    $reason
                );

                return null;
            }

            if (! Hash::check((string) $request->input('password'), $user->password)) {
                // Log failed login attempt - invalid password
                $securityLogger->logLoginAttempt($user, false, 'Invalid password');

                // Increment login attempts
                $user->increment('login_attempts');

                // Check if account should be locked
                if ($securityLogger->shouldLockAccount($user)) {
                    $securityLogger->lockAccount($user, 'Too many failed login attempts');
                }

                return null;
            }

            // Check for suspicious activity before allowing login
            $suspiciousActivities = $securityLogger->detectSuspiciousActivity($user);
            foreach ($suspiciousActivities as $activity) {
                $activityLogger->logSuspiciousActivity(
                    $user,
                    $activity['type'],
                    $activity['description']
                );
            }

            // Log successful login
            $securityLogger->logLoginAttempt($user, true);
            $activityLogger->logLogin($user, true);

            // Update user login information
            $user->forceFill([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
                'last_login_user_agent' => $request->userAgent(),
                'login_attempts' => 0,
                'locked_until' => null,
            ])->save();

            // Clear rate limiter
            $throttleKey = md5('login'.implode('|', [
                Str::lower($request->input(Fortify::username())),
                $request->ip(),
            ]));
            RateLimiter::clear($throttleKey);

            return $user;
        });

        // Register logout event listener
        Event::listen(\Illuminate\Auth\Events\Logout::class, function ($event) {
            if ($event->user) {
                $securityLogger = app(SecurityLogger::class);
                $activityLogger = app(ActivityLogger::class);

                $securityLogger->logLogout($event->user);
                $activityLogger->logLogout($event->user);
            }
        });

        // Register login event listener for additional logging
        Event::listen(\Illuminate\Auth\Events\Login::class, function ($event) {
            if ($event->user) {
                $activityLogger = app(ActivityLogger::class);
                $activityLogger->logLogin($event->user, true);
            }
        });

        // Register failed login event listener
        Event::listen(\Illuminate\Auth\Events\Failed::class, function ($event) {
            $securityLogger = app(SecurityLogger::class);
            $activityLogger = app(ActivityLogger::class);

            if ($event->user) {
                $securityLogger->logLoginAttempt($event->user, false, 'Authentication failed');
                $activityLogger->logLogin($event->user, false, 'Authentication failed');
            } else {
                $securityLogger->logFailedLogin(
                    $event->credentials['email'] ?? 'unknown',
                    request()->ip(),
                    request()->userAgent(),
                    'Authentication failed'
                );
            }
        });

        // Register password reset event listener
        Event::listen(\Illuminate\Auth\Events\PasswordReset::class, function ($event) {
            $activityLogger = app(ActivityLogger::class);
            $activityLogger->logPasswordReset($event->user);

            $event->user->update(['password_changed_at' => now()]);
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
