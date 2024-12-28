<?php

use App\Models\User;
use App\Models\Admin;
use App\Models\Vehicle;
use App\Models\VehicleBrand;
use App\Models\VehicleBrandModel;
use App\Models\StickerApplication;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create vehicle brand and model
    $brand = VehicleBrand::create([
        'name' => 'Test Brand',
        'type' => 'Car',
        'origin' => 'Japan'
    ]);
    
    VehicleBrandModel::create([
        'vehicle_brand_id' => $brand->id,
        'name' => 'Test Model'
    ]);
    
    // Create an admin user
    $this->admin = Admin::factory()->create();
    
    // Create a regular user
    $this->user = User::factory()->create();
    
    // Create vehicles for testing
    $this->vehicles = Vehicle::factory()
        ->count(5)
        ->create();
});

test('admin can view recent applications', function () {
    // Authenticate as admin
    Sanctum::actingAs($this->admin, ['*'], 'admin');
    
    // Create applications with different timestamps
    $applications = collect([
        StickerApplication::factory()->for($this->user)->for($this->vehicles[0])->create(['created_at' => now()->subDays(1)]),
        StickerApplication::factory()->for($this->user)->for($this->vehicles[1])->create(['created_at' => now()->subDays(2)]),
        StickerApplication::factory()->for($this->user)->for($this->vehicles[2])->create(['created_at' => now()->subHours(1)]),
        StickerApplication::factory()->for($this->user)->for($this->vehicles[3])->create(['created_at' => now()]),
        StickerApplication::factory()->for($this->user)->for($this->vehicles[4])->create(['created_at' => now()->subDays(3)]),
    ]);
    
    // Make request to the endpoint
    $response = $this->getJson('/api/admin/recent-applications');
    
    // Assert successful response
    $response->assertStatus(200);
    
    // Assert we get exactly 4 applications
    $response->assertJsonCount(4, 'data');
    
    // Get the IDs of the 4 most recent applications
    $expectedIds = $applications->sortByDesc('created_at')
        ->take(4)
        ->pluck('id')
        ->toArray();
    
    // Get the actual IDs from the response
    $actualIds = collect($response->json('data'))
        ->pluck('id')
        ->map(fn($id) => (int) $id)
        ->toArray();
    
    // Assert the IDs match
    expect($actualIds)->toBe($expectedIds);
});

test('non-admin cannot view recent applications', function () {
    // Authenticate as non-admin user
    Sanctum::actingAs($this->user, ['*'], 'sanctum');
    
    // Make request to the endpoint
    $response = $this->getJson('/api/admin/recent-applications');
    
    // Assert forbidden response
    $response->assertStatus(401);
});

test('unauthenticated user cannot view recent applications', function () {
    // Make request without authentication
    $response = $this->getJson('/api/admin/recent-applications');
    
    // Assert unauthorized response
    $response->assertStatus(401);
});
