<?php

namespace App\Http\Controllers\StickerApplication;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateApplicationRequest;
use App\Models\Vehicle;
use App\Models\Document;
use App\Models\StickerApplication;
use App\Enums\StickerApplicationStatus;
use App\Http\Resources\StickerApplicationResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CreateController extends Controller
{
    public function __invoke(CreateApplicationRequest $request)
    {
        try {
            DB::beginTransaction();

            // Create new vehicle record
            $vehicle = Vehicle::create([
                'user_id' => auth()->id(),
                'vehicle_brand_model_id' => $request->vehicle_brand_model_id,
                'vehicle_plate_no' => $request->vehicle_plate_no,
                'vehicle_type' => $request->vehicle_type,
                'vehicle_color' => $request->vehicle_color,
                'road_tax_expiry_date' => $request->road_tax_expiry_date,
                'insurance_name' => $request->insurance_name,
                'insurance_number' => $request->insurance_number,
                'driving_license_no' => $request->driving_license_no,
            ]);

            // Create sticker application
            $application = StickerApplication::create([
                'user_id' => auth()->id(),
                'vehicle_id' => $vehicle->id,
                'application_date' => now(),
                'status' => StickerApplicationStatus::PENDING,
            ]);

            // Handle document uploads
            foreach ($request->documents as $document) {
                $path = $document['file']->store('documents/' . $application->id, 'public');
                
                Document::create([
                    'user_id' => auth()->id(),
                    'application_id' => $application->id,
                    'name' => $document['file']->getClientOriginalName(),
                    'file_path' => $path,
                    'type' => $document['type']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Sticker application created successfully',
                'data' => new StickerApplicationResource($application->load(['vehicle.vehicleBrandModel', 'documents', 'user']))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up any uploaded files if transaction failed
            if (isset($application)) {
                Storage::disk('public')->deleteDirectory('documents/' . $application->id);
            }

            return response()->json([
                'message' => 'Failed to create sticker application',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}