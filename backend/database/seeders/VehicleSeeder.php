<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleBrandModel;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicles = [
            [
                'vehicle_type' => 'Car',
                'vehicle_plate_no' => 'JHR1234',
                'vehicle_color' => 'Black',
                'is_vehicle_owner' => true,
                'road_tax_expiry_date' => '2024-12-31',
                'insurance_name' => 'Etiqa Takaful',
                'insurance_number' => 'INS123456',
                'driving_license_no' => 'D1234567'
            ],
            [
                'vehicle_type' => 'Motorcycle',
                'vehicle_plate_no' => 'JHR5678',
                'vehicle_color' => 'Red',
                'is_vehicle_owner' => true,
                'road_tax_expiry_date' => '2024-12-31',
                'insurance_name' => 'Takaful Malaysia',
                'insurance_number' => 'INS234567',
                'driving_license_no' => 'D2345678'
            ],
            [
                'vehicle_type' => 'Car',
                'vehicle_plate_no' => 'JHR9012',
                'vehicle_color' => 'White',
                'is_vehicle_owner' => false,
                'owner_full_name' => 'Ahmad bin Abdullah',
                'road_tax_expiry_date' => '2024-12-31',
                'insurance_name' => 'Allianz',
                'insurance_number' => 'INS345678',
                'driving_license_no' => 'D3456789'
            ],
            [
                'vehicle_type' => 'Car',
                'vehicle_plate_no' => 'JHR3456',
                'vehicle_color' => 'Silver',
                'is_vehicle_owner' => true,
                'road_tax_expiry_date' => '2024-12-31',
                'insurance_name' => 'Kurnia',
                'insurance_number' => 'INS456789',
                'driving_license_no' => 'D4567890'
            ],
            [
                'vehicle_type' => 'Motorcycle',
                'vehicle_plate_no' => 'JHR7890',
                'vehicle_color' => 'Blue',
                'is_vehicle_owner' => true,
                'road_tax_expiry_date' => '2024-12-31',
                'insurance_name' => 'Tokio Marine',
                'insurance_number' => 'INS567890',
                'driving_license_no' => 'D5678901'
            ]
        ];

        $users = User::all();
        $models = VehicleBrandModel::all();
        
        foreach ($vehicles as $index => $vehicleData) {
            // Assign each vehicle to a user and a random model
            $user = $users[$index];
            $model = $models->random();
            
            $vehicleData['user_id'] = $user->id;
            $vehicleData['vehicle_brand_model_id'] = $model->id;
            
            Vehicle::create($vehicleData);
        }
    }
}
