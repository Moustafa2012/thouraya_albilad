<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Services\Logging\ActivityLogger;

class LogUserRegistration
{
    public function handle(UserRegistered $event): void
    {
        app(ActivityLogger::class)->log([
            'user_id' => $event->user->id,
            'action' => 'user_registered',
            'description' => 'User account registered',
            'ip_address' => $event->ipAddress,
            'user_agent' => $event->userAgent,
            'created_at' => now(),
        ]);
    }
}
