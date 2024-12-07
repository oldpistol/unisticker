<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehicleBrand>
 */
class VehicleBrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = [
            'Toyota',
            'Honda',
            'Nissan',
            'Mazda',
            'Proton',
            'Perodua',
            'BMW',
            'Mercedes-Benz',
            'Audi',
            'Volkswagen'
        ];

        $origins = [
            'Japan',
            'Malaysia',
            'Germany',
            'United States',
            'South Korea',
            'Italy'
        ];

        return [
            'name' => fake()->unique()->randomElement($brands),
            'origin' => fake()->randomElement($origins),
            'created_at' => fake()->dateTimeBetween('-1 year'),
            'updated_at' => fake()->dateTimeBetween('-1 month')
        ];
    }
}
