<?php

namespace Database\Seeders;

use App\Models\VehicleBrand;
use Illuminate\Database\Seeder;

class VehicleBrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $vehicleBrands = [
            ['name' => 'Proton', 'type' => 'Car', 'origin' => 'Malaysia'],
            ['name' => 'Perodua', 'type' => 'Car', 'origin' => 'Malaysia'],
            ['name' => 'Volvo', 'type' => 'Car', 'origin' => 'Sweden'],
            ['name' => 'Honda', 'type' => 'Car', 'origin' => 'Japan'],
            ['name' => 'Mercedes-Benz', 'type' => 'Car', 'origin' => 'Germany'],
            ['name' => 'BMW', 'type' => 'Car', 'origin' => 'Germany'],
            ['name' => 'Hyundai', 'type' => 'Car', 'origin' => 'South Korea'],
            ['name' => 'Mazda', 'type' => 'Car', 'origin' => 'Japan'],
            ['name' => 'Kia', 'type' => 'Car', 'origin' => 'South Korea'],
            ['name' => 'Toyota', 'type' => 'Car', 'origin' => 'Japan'],
            ['name' => 'Nissan', 'type' => 'Car', 'origin' => 'Japan'],
            ['name' => 'Mitsubishi', 'type' => 'Car', 'origin' => 'Japan'],
            ['name' => 'Ford', 'type' => 'Car', 'origin' => 'USA'],
            ['name' => 'Volkswagen', 'type' => 'Car', 'origin' => 'Germany'],
            ['name' => 'Audi', 'type' => 'Car', 'origin' => 'Germany'],
            ['name' => 'Lexus', 'type' => 'Car', 'origin' => 'Japan'],
            ['name' => 'Land Rover', 'type' => 'Car', 'origin' => 'UK'],
            ['name' => 'Jaguar', 'type' => 'Car', 'origin' => 'UK'],
            ['name' => 'Porsche', 'type' => 'Car', 'origin' => 'Germany'],
            ['name' => 'Chevrolet', 'type' => 'Car', 'origin' => 'USA'],
            ['name' => 'Renault', 'type' => 'Car', 'origin' => 'France'],
            ['name' => 'Peugeot', 'type' => 'Car', 'origin' => 'France'],
            ['name' => 'Tesla', 'type' => 'Car', 'origin' => 'USA'],
            ['name' => 'Ferrari', 'type' => 'Car', 'origin' => 'Italy'],
            ['name' => 'Lamborghini', 'type' => 'Car', 'origin' => 'Italy'],
            ['name' => 'Maserati', 'type' => 'Car', 'origin' => 'Italy'],
            ['name' => 'Rolls-Royce', 'type' => 'Car', 'origin' => 'UK'],
            ['name' => 'Modenas', 'type' => 'Motorcycle', 'origin' => 'Malaysia'],
            ['name' => 'Yamaha', 'type' => 'Motorcycle', 'origin' => 'Japan'],
            ['name' => 'Honda', 'type' => 'Motorcycle', 'origin' => 'Japan'],
            ['name' => 'Kawasaki', 'type' => 'Motorcycle', 'origin' => 'Japan'],
            ['name' => 'Suzuki', 'type' => 'Motorcycle', 'origin' => 'Japan'],
            ['name' => 'Ducati', 'type' => 'Motorcycle', 'origin' => 'Italy'],
            ['name' => 'BMW Motorrad', 'type' => 'Motorcycle', 'origin' => 'Germany'],
            ['name' => 'Harley-Davidson', 'type' => 'Motorcycle', 'origin' => 'USA'],
            ['name' => 'Aprilia', 'type' => 'Motorcycle', 'origin' => 'Italy'],
            ['name' => 'Vespa', 'type' => 'Motorcycle', 'origin' => 'Italy'],
            ['name' => 'Triumph', 'type' => 'Motorcycle', 'origin' => 'UK'],
            ['name' => 'Royal Enfield', 'type' => 'Motorcycle', 'origin' => 'India'],
            ['name' => 'KTM', 'type' => 'Motorcycle', 'origin' => 'Austria'],
        ];

        // clean the table
        VehicleBrand::truncate();
        // insert data
        VehicleBrand::insert($vehicleBrands);
    }
}
