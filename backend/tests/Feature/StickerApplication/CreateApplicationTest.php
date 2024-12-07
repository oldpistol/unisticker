<?php

use App\Enums\DocumentType;
use App\Enums\StickerApplicationStatus;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleBrandModel;
use App\Models\Document;
use App\Models\StickerApplication;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    
    $this->user = User::factory()->create();
    $this->vehicleBrandModel = VehicleBrandModel::factory()->create();
    
    test()->actingAs($this->user);
});

test('user can create sticker application with required documents', function () {
    $data = [
        'vehicle_brand_model_id' => $this->vehicleBrandModel->id,
        'vehicle_plate_no' => 'ABC123',
        'vehicle_type' => 'Car',
        'vehicle_color' => 'Black',
        'road_tax_expiry_date' => '2024-12-31',
        'insurance_name' => 'Insurance Co',
        'insurance_number' => 'INS123',
        'driving_license_no' => 'DL123',
        'documents' => [
            [
                'file' => UploadedFile::fake()->create('road_tax.pdf', 100),
                'type' => DocumentType::RoadTax->value
            ],
            [
                'file' => UploadedFile::fake()->create('license_front.jpg', 100),
                'type' => DocumentType::DrivingLicenseFront->value
            ],
            [
                'file' => UploadedFile::fake()->create('license_back.jpg', 100),
                'type' => DocumentType::DrivingLicenseBack->value
            ],
            [
                'file' => UploadedFile::fake()->create('insurance.pdf', 100),
                'type' => DocumentType::InsuranceCoverNote->value
            ]
        ]
    ];

    $response = test()->postJson('/api/sticker-applications', $data);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => [
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
        ]);

    // Check vehicle creation
    expect(Vehicle::where([
        'user_id' => $this->user->id,
        'vehicle_plate_no' => $data['vehicle_plate_no'],
        'vehicle_brand_model_id' => $data['vehicle_brand_model_id']
    ])->exists())->toBeTrue();

    // Check application creation
    $application = StickerApplication::where('user_id', $this->user->id)
        ->where('status', StickerApplicationStatus::PENDING)
        ->first();
    expect($application)->not->toBeNull();

    // Check documents creation and storage
    expect(Document::count())->toBe(4);
    $documents = Document::where('application_id', $application->id)->get();
    foreach ($documents as $document) {
        Storage::disk('public')->assertExists($document->file_path);
    }
});

test('user cannot create sticker application without required documents', function () {
    $data = [
        'vehicle_brand_model_id' => $this->vehicleBrandModel->id,
        'vehicle_plate_no' => 'ABC123',
        'vehicle_type' => 'Car',
        'vehicle_color' => 'Black',
        'road_tax_expiry_date' => '2024-12-31',
        'insurance_name' => 'Insurance Co',
        'insurance_number' => 'INS123',
        'driving_license_no' => 'DL123',
        'documents' => []
    ];

    $response = test()->postJson('/api/sticker-applications', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['documents']);

    // Ensure no records were created
    expect(Vehicle::count())->toBe(0);
    expect(StickerApplication::count())->toBe(0);
    expect(Document::count())->toBe(0);
});

test('user cannot create sticker application with invalid document type', function () {
    $data = [
        'vehicle_brand_model_id' => $this->vehicleBrandModel->id,
        'vehicle_plate_no' => 'ABC123',
        'vehicle_type' => 'Car',
        'vehicle_color' => 'Black',
        'road_tax_expiry_date' => '2024-12-31',
        'insurance_name' => 'Insurance Co',
        'insurance_number' => 'INS123',
        'driving_license_no' => 'DL123',
        'documents' => [
            [
                'file' => UploadedFile::fake()->create('invalid.pdf', 100),
                'type' => 'invalid_type'
            ]
        ]
    ];

    $response = test()->postJson('/api/sticker-applications', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['documents.0.type']);
});

test('user cannot create sticker application with invalid file type', function () {
    $data = [
        'vehicle_brand_model_id' => $this->vehicleBrandModel->id,
        'vehicle_plate_no' => 'ABC123',
        'vehicle_type' => 'Car',
        'vehicle_color' => 'Black',
        'road_tax_expiry_date' => '2024-12-31',
        'insurance_name' => 'Insurance Co',
        'insurance_number' => 'INS123',
        'driving_license_no' => 'DL123',
        'documents' => [
            [
                'file' => UploadedFile::fake()->create('document.exe', 100),
                'type' => DocumentType::RoadTax->value
            ]
        ]
    ];

    $response = test()->postJson('/api/sticker-applications', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['documents.0.file']);
});
