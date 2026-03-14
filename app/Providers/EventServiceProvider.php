<?php

namespace App\Providers;

use App\Events\BankAccountCreated;
use App\Events\UserRegistered;
use App\Listeners\LogUserRegistration;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        UserRegistered::class => [
            LogUserRegistration::class,
        ],
        Login::class => [
            // Handled in FortifyServiceProvider
        ],
        Logout::class => [
            // Handled in FortifyServiceProvider
        ],
    ];

    public function boot(): void
    {
        //
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
