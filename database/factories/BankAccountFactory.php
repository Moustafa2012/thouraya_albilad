<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BankAccount>
 */
class BankAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_name' => $this->faker->words(2, true),
            'holder_name_ar' => $this->faker->name(),
            'holder_name_en' => $this->faker->name(),
            'bank_name' => $this->faker->company(),
            'account_number' => $this->faker->bankAccountNumber(),
            'routing_number' => $this->faker->numerify('#########'),
            'iban' => $this->faker->iban('SA'),
            'currency' => 'SAR',
            'account_type' => 'current',
            'account_category' => 'personal',
            'balance' => $this->faker->randomFloat(2, 0, 100000),
            'status' => 'active',
            'is_default' => false,
            'is_active' => true,
        ];
    }
}
