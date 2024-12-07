<?php

namespace Database\Factories;

use App\Enums\StickerApplicationStatus;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StickerApplication>
 */
class StickerApplicationFactory extends Factory
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
            'vehicle_id' => Vehicle::factory(),
            'application_date' => now(),
            'status' => StickerApplicationStatus::PENDING,
            'expiry_date' => now()->addYear(),
            'remarks' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the application is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StickerApplicationStatus::APPROVED,
        ]);
    }

    /**
     * Indicate that the application is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StickerApplicationStatus::REJECTED,
            'remarks' => $this->faker->sentence(),
        ]);
    }

    /**
     * Indicate that the application is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StickerApplicationStatus::EXPIRED,
            'expiry_date' => now()->subDay(),
        ]);
    }

    /**
     * Indicate that the application is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => StickerApplicationStatus::CANCELLED,
            'remarks' => $this->faker->sentence(),
        ]);
    }
}
