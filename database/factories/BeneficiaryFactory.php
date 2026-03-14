<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Beneficiary>
 */
class BeneficiaryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'account_type' => fake()->randomElement(['individual', 'business']),
            'name_ar' => fake()->name(),
            'name_en' => fake()->name(),
            'national_id' => fake()->randomNumber(9),
            'country' => fake()->countryCode(),
            'bank_name' => fake()->company(),
            'account_number' => fake()->bankAccountNumber(),
            'iban' => fake()->iban('SA'),
            'swift_code' => fake()->swiftBicNumber(),
            'currency' => fake()->currencyCode(),
            'category' => fake()->randomElement(['suppliers', 'employees', 'partners', 'contractors', 'other']),
            'notes' => fake()->sentence(),
        ];
    }
}
