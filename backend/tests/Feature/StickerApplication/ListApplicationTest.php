<?php

use App\Enums\StickerApplicationStatus;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleBrandModel;
use App\Models\Document;
use App\Models\StickerApplication;
use Database\Seeders\VehicleBrandSeeder;
use Database\Seeders\VehicleBrandModelSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Seed the vehicle brands and models
    $this->seed([
        VehicleBrandSeeder::class,
        VehicleBrandModelSeeder::class
    ]);

    $this->user = User::factory()->create();
    // Get a random vehicle brand model from seeded data
    $this->vehicleBrandModel = VehicleBrandModel::inRandomOrder()->first();
    test()->actingAs($this->user);
});

test('user can list their sticker applications', function () {
    // Create applications for the user
    StickerApplication::factory()
        ->count(5)
        ->sequence(fn ($sequence) => [
            'user_id' => $this->user->id,
            'created_at' => now()->subDays($sequence->index)
        ])
        ->has(
            Vehicle::factory()
                ->state([
                    'user_id' => $this->user->id,
                    'vehicle_brand_model_id' => $this->vehicleBrandModel->id
                ])
        )
        ->has(
            Document::factory()
                ->count(2)
                ->state(['user_id' => $this->user->id])
        )
        ->create();

    // Create applications for another user
    StickerApplication::factory()
        ->count(3)
        ->for(User::factory())
        ->has(Vehicle::factory()->state([
            'vehicle_brand_model_id' => $this->vehicleBrandModel->id
        ]))
        ->create();

    $response = test()->getJson('/api/sticker-applications');

    $response->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'user' => ['id', 'name', 'email'],
                    'vehicle' => [
                        'id',
                        'plate_no',
                        'type',
                        'color',
                        'brand_model'
                    ],
                    'application_date',
                    'status',
                    'documents' => [
                        '*' => [
                            'id',
                            'name',
                            'file_path',
                            'type'
                        ]
                    ]
                ]
            ],
            'links',
            'meta'
        ]);

    dd($response->json());

    // Verify only user's applications are returned
    $applications = $response->json('data');
    foreach ($applications as $application) {
        expect($application['user']['id'])->toBe($this->user->id);
    }
});

test('user can filter sticker applications by status', function () {
    // Create applications with different statuses
    StickerApplication::factory()
        ->count(3)
        ->state([
            'status' => StickerApplicationStatus::PENDING,
            'user_id' => $this->user->id
        ])
        ->has(
            Vehicle::factory()->state([
                'user_id' => $this->user->id,
                'vehicle_brand_model_id' => $this->vehicleBrandModel->id
            ])
        )
        ->create();

    StickerApplication::factory()
        ->count(2)
        ->state([
            'status' => StickerApplicationStatus::APPROVED,
            'user_id' => $this->user->id
        ])
        ->has(
            Vehicle::factory()->state([
                'user_id' => $this->user->id,
                'vehicle_brand_model_id' => $this->vehicleBrandModel->id
            ])
        )
        ->create();

    $response = test()->getJson('/api/sticker-applications?status=' . StickerApplicationStatus::PENDING->value);

    $response->assertOk()
        ->assertJsonCount(3, 'data');

    $applications = $response->json('data');
    foreach ($applications as $application) {
        expect($application['status'])->toBe(StickerApplicationStatus::PENDING->value);
    }
});

test('user can search sticker applications by vehicle plate', function () {
    // Create an application with specific plate number
    $vehicle = Vehicle::factory()
        ->state([
            'user_id' => $this->user->id,
            'vehicle_brand_model_id' => $this->vehicleBrandModel->id,
            'vehicle_plate_no' => 'ABC123'
        ])
        ->create();

    StickerApplication::factory()
        ->state(['user_id' => $this->user->id])
        ->for($vehicle)
        ->has(Document::factory()->count(2)->state(['user_id' => $this->user->id]))
        ->create();

    // Create some other applications
    StickerApplication::factory()
        ->count(3)
        ->state(['user_id' => $this->user->id])
        ->has(
            Vehicle::factory()->state([
                'user_id' => $this->user->id,
                'vehicle_brand_model_id' => $this->vehicleBrandModel->id
            ])
        )
        ->create();

    $response = test()->getJson('/api/sticker-applications?search=ABC123');

    $response->assertOk()
        ->assertJsonCount(1, 'data');

    expect($response->json('data.0.vehicle.plate_no'))->toBe('ABC123');
});

test('pagination works correctly', function () {
    StickerApplication::factory()
        ->count(15)
        ->state(['user_id' => $this->user->id])
        ->has(
            Vehicle::factory()->state([
                'user_id' => $this->user->id,
                'vehicle_brand_model_id' => $this->vehicleBrandModel->id
            ])
        )
        ->create();

    $response = test()->getJson('/api/sticker-applications?per_page=5');

    $response->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonStructure([
            'data',
            'links' => [
                'first',
                'last',
                'prev',
                'next'
            ],
            'meta' => [
                'current_page',
                'from',
                'last_page',
                'path',
                'per_page',
                'to',
                'total'
            ]
        ]);

    expect($response->json('meta.total'))->toBe(15);
    expect($response->json('meta.per_page'))->toBe(5);
    expect($response->json('meta.last_page'))->toBe(3);
});
