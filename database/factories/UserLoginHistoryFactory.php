<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserLoginHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserLoginHistory>
 */
class UserLoginHistoryFactory extends Factory
{
    protected $model = UserLoginHistory::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'successful' => true,
            'failure_reason' => null,
            'login_at' => now(),
            'logout_at' => null,
            'session_duration' => null,
        ];
    }
}
