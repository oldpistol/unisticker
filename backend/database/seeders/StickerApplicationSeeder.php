<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\StickerApplication;
use Illuminate\Database\Seeder;

class StickerApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $applications = [
            [
                'status' => 'pending',
                'application_date' => now(),
                'remarks' => 'New application'
            ],
            [
                'status' => 'approved',
                'application_date' => now(),
                'expiry_date' => now()->addYear(),
                'remarks' => 'Approved'
            ],
            [
                'status' => 'pending',
                'application_date' => now(),
                'remarks' => 'Documents under review'
            ],
            [
                'status' => 'rejected',
                'application_date' => now(),
                'remarks' => 'Invalid insurance'
            ],
            [
                'status' => 'approved',
                'application_date' => now(),
                'expiry_date' => now()->addYear(),
                'remarks' => 'Approved'
            ]
        ];

        // Get all vehicles
        $vehicles = Vehicle::all();
        
        foreach ($applications as $index => $applicationData) {
            $vehicle = $vehicles[$index];
            
            $applicationData['user_id'] = $vehicle->user_id;
            $applicationData['vehicle_id'] = $vehicle->id;
            $applicationData['created_at'] = now();
            $applicationData['updated_at'] = now();
            
            StickerApplication::create($applicationData);
        }
    }
}
