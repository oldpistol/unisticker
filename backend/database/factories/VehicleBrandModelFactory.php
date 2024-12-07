<?php

namespace Database\Factories;

use App\Models\VehicleBrand;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehicleBrandModel>
 */
class VehicleBrandModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $models = [
            // Toyota models
            'Camry', 'Corolla', 'Vios', 'RAV4', 'Hilux',
            // Honda models
            'Civic', 'Accord', 'CR-V', 'HR-V', 'City',
            // Proton models
            'X50', 'X70', 'Saga', 'Persona', 'Iriz',
            // Perodua models
            'Myvi', 'Axia', 'Bezza', 'Ativa', 'Alza',
        ];

        return [
            'vehicle_brand_id' => VehicleBrand::factory(),
            'name' => fake()->unique()->randomElement($models),
            'created_at' => fake()->dateTimeBetween('-1 year'),
            'updated_at' => fake()->dateTimeBetween('-1 month')
        ];
    }
}
