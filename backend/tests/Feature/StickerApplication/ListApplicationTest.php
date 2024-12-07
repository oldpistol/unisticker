<?php

use App\Enums\StickerApplicationStatus;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleBrandModel;
use App\Models\Document;
use App\Models\StickerApplication;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->vehicleBrandModel = VehicleBrandModel::factory()->create();
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
                ->for($this->user)
                ->for($this->vehicleBrandModel)
        )
        ->has(
            Document::factory()
                ->count(4)
                ->for($this->user)
        )
        ->create();

    // Create applications for another user
    StickerApplication::factory()
        ->count(3)
        ->for(User::factory())
        ->has(Vehicle::factory())
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

    // Verify only user's applications are returned
    $applications = $response->json('data');
    foreach ($applications as $application) {
        expect($application['user']['id'])->toBe($this->user->id);
    }
});

// test('admin can list all sticker applications', function () {
//     $admin = User::factory()->create(['is_admin' => true]);
//     test()->actingAs($admin);

//     // Create applications for various users
//     StickerApplication::factory()
//         ->count(8)
//         ->has(Vehicle::factory())
//         ->has(Document::factory()->count(4))
//         ->create();

//     $response = test()->getJson('/api/sticker-applications');

//     $response->assertOk()
//         ->assertJsonCount(8, 'data');
// });

test('user can filter sticker applications by status', function () {
    // Create applications with different statuses
    StickerApplication::factory()
        ->count(3)
        ->state(['status' => StickerApplicationStatus::PENDING])
        ->for($this->user)
        ->has(Vehicle::factory()->for($this->user))
        ->create();

    StickerApplication::factory()
        ->count(2)
        ->state(['status' => StickerApplicationStatus::APPROVED])
        ->for($this->user)
        ->has(Vehicle::factory()->for($this->user))
        ->create();

    $response = test()->getJson('/api/sticker-applications?status=' . StickerApplicationStatus::PENDING->value);

    $response->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJson(fn (AssertableJson $json) =>
            $json->has('data', 3, fn ($json) =>
                $json->where('status', StickerApplicationStatus::PENDING->value)
                    ->etc()
            )
        );
});

test('user can search sticker applications by vehicle plate', function () {
    // Create an application with specific plate number
    $vehicle = Vehicle::factory()
        ->for($this->user)
        ->for($this->vehicleBrandModel)
        ->state(['vehicle_plate_no' => 'ABC123'])
        ->create();

    StickerApplication::factory()
        ->for($this->user)
        ->for($vehicle)
        ->has(Document::factory()->count(4))
        ->create();

    // Create some other applications
    StickerApplication::factory()
        ->count(3)
        ->for($this->user)
        ->has(Vehicle::factory()->for($this->user))
        ->create();

    $response = test()->getJson('/api/sticker-applications?search=ABC123');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJson(fn (AssertableJson $json) =>
            $json->has('data.0.vehicle', fn ($json) =>
                $json->where('plate_no', 'ABC123')
                    ->etc()
            )
        );
});

test('pagination works correctly', function () {
    StickerApplication::factory()
        ->count(15)
        ->for($this->user)
        ->has(Vehicle::factory()->for($this->user))
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
