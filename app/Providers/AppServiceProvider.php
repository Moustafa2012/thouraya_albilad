<?php

namespace App\Providers;

use App\Models\BankAccount;
use App\Models\Beneficiary;
use App\Models\User;
use App\Observers\BankAccountDetailObserver;
use App\Observers\BankAccountObserver;
use App\Observers\BeneficiaryObserver;
use App\Observers\UserObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model observers
        User::observe(UserObserver::class);
        BankAccount::observe(BankAccountObserver::class);
        \App\Models\PersonalBankAccount::observe(BankAccountDetailObserver::class);
        \App\Models\BusinessBankAccount::observe(BankAccountDetailObserver::class);
        Beneficiary::observe(BeneficiaryObserver::class);

        $this->configureDefaults();
        $this->configurePermissions();
        app(\App\Services\SmtpSettingsService::class)->apply();
    }

    protected function configurePermissions(): void
    {
        foreach (\App\Enums\UserPermission::cases() as $permission) {
            \Illuminate\Support\Facades\Gate::define($permission->value, function (\App\Models\User $user) use ($permission) {
                return $user->hasPermission($permission);
            });
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
