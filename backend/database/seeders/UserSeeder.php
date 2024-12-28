<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'ic_no' => '910517015433',
                'passport_no' => null,
                'phone_no' => '0123456789',
                'matric_id' => 'A19EC0001',
                'email_verified_at' => now(),
                'address' => [
                    'street_address' => '123 Main Street',
                    'postcode' => '81300',
                    'city' => 'Skudai',
                    'state' => 'Johor'
                ]
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'ic_no' => '920623015577',
                'passport_no' => null,
                'phone_no' => '0123456790',
                'matric_id' => 'A19EC0002',
                'email_verified_at' => now(),
                'address' => [
                    'street_address' => '456 Oak Avenue',
                    'postcode' => '81310',
                    'city' => 'Skudai',
                    'state' => 'Johor'
                ]
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'ic_no' => '930731016644',
                'passport_no' => null,
                'phone_no' => '0123456791',
                'matric_id' => 'A19EC0003',
                'email_verified_at' => now(),
                'address' => [
                    'street_address' => '789 Pine Road',
                    'postcode' => '81320',
                    'city' => 'Skudai',
                    'state' => 'Johor'
                ]
            ],
            [
                'name' => 'Sarah Wilson',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
                'ic_no' => '940812017788',
                'passport_no' => null,
                'phone_no' => '0123456792',
                'matric_id' => 'A19EC0004',
                'email_verified_at' => now(),
                'address' => [
                    'street_address' => '321 Cedar Lane',
                    'postcode' => '81330',
                    'city' => 'Skudai',
                    'state' => 'Johor'
                ]
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'password' => Hash::make('password'),
                'ic_no' => null,
                'passport_no' => 'A12345678',
                'phone_no' => '0123456793',
                'matric_id' => 'A19EC0005',
                'email_verified_at' => now(),
                'address' => [
                    'street_address' => '654 Maple Drive',
                    'postcode' => '81340',
                    'city' => 'Skudai',
                    'state' => 'Johor'
                ]
            ]
        ];

        foreach ($users as $userData) {
            $address = $userData['address'];
            unset($userData['address']);
            
            $user = User::create($userData);
            
            $user->address()->create($address);
        }
    }
}
