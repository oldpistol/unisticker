<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            VehicleBrandSeeder::class,
            VehicleBrandModelSeeder::class,
            UserSeeder::class,
            VehicleSeeder::class,
            StickerApplicationSeeder::class,
        ]);
    }
}
