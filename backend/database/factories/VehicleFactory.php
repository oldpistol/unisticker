<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\VehicleBrandModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['Car', 'SUV', 'MPV', 'Pickup Truck'];
        $colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Grey'];

        return [
            'user_id' => User::factory(),
            'vehicle_brand_model_id' => VehicleBrandModel::factory(),
            'vehicle_plate_no' => strtoupper(fake()->randomLetter() . fake()->randomLetter() . fake()->randomLetter()) 
                . ' ' 
                . fake()->numberBetween(1000, 9999),
            'vehicle_type' => fake()->randomElement($types),
            'vehicle_color' => fake()->randomElement($colors),
            'road_tax_expiry_date' => fake()->dateTimeBetween('now', '+2 years'),
            'insurance_name' => fake()->company(),
            'insurance_number' => 'INS' . fake()->numberBetween(10000, 99999),
            'driving_license_no' => fake()->numerify('DL########'),
            'created_at' => fake()->dateTimeBetween('-1 year'),
            'updated_at' => fake()->dateTimeBetween('-1 month')
        ];
    }
}
