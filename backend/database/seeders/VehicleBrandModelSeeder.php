<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleBrandModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // List of models grouped by brand
        $models = [
            'Proton' => ['Saga', 'Persona'],
            'Perodua' => ['Myvi', 'Axia'],
            'Volvo' => ['XC40', 'XC60'],
            'Honda' => ['Civic', 'CR-V'],
            'Mercedes-Benz' => ['C-Class', 'E-Class'],
            'BMW' => ['3 Series', 'X5'],
            'Hyundai' => ['Elantra', 'Tucson'],
            'Mazda' => ['Mazda3', 'CX-5'],
            'Kia' => ['Picanto', 'Sportage'],
            'Toyota' => ['Corolla', 'Hilux'],
            'Nissan' => ['Almera', 'X-Trail'],
            'Mitsubishi' => ['Outlander', 'Triton'],
            'Ford' => ['Ranger', 'Everest'],
            'Volkswagen' => ['Golf', 'Tiguan'],
            'Audi' => ['A4', 'Q5'],
            'Lexus' => ['RX', 'NX'],
            'Land Rover' => ['Range Rover', 'Defender'],
            'Jaguar' => ['XF', 'F-Pace'],
            'Porsche' => ['911', 'Cayenne'],
            'Chevrolet' => ['Colorado', 'Equinox'],
            'Renault' => ['Koleos', 'Captur'],
            'Peugeot' => ['3008', '5008'],
            'Tesla' => ['Model S', 'Model 3'],
            'Ferrari' => ['Roma', 'Portofino'],
            'Lamborghini' => ['Huracán', 'Urus'],
            'Maserati' => ['Ghibli', 'Levante'],
            'Rolls-Royce' => ['Phantom', 'Ghost'],
            'Modenas' => ['Kriss', 'Pulsar'],
            'Yamaha' => ['R15', 'MT-15'],
            'Kawasaki' => ['Ninja 250', 'Z650'],
            'Suzuki' => ['GSX-R150', 'Hayabusa'],
            'Ducati' => ['Panigale', 'Monster'],
            'BMW Motorrad' => ['G310R', 'R1250 GS'],
            'Harley-Davidson' => ['Street Glide', 'Road King'],
            'Aprilia' => ['RS660', 'Tuono V4'],
            'Vespa' => ['Primavera', 'GTS 300'],
            'Triumph' => ['Bonneville', 'Tiger 1200'],
            'Royal Enfield' => ['Classic 350', 'Himalayan'],
            'KTM' => ['Duke 200', 'RC 390'],
        ];

        // clear table
        DB::table('vehicle_brand_models')->truncate();

        foreach ($models as $brand => $brandModels) {
            // Get the brand ID from the database
            $brandId = DB::table('vehicle_brands')->where('name', $brand)->value('id');

            if ($brandId) {
                foreach ($brandModels as $model) {
                    // Insert models into the vehicle_models table
                    DB::table('vehicle_brand_models')->insert([
                        'vehicle_brand_id' => $brandId,
                        'name' => $model,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
