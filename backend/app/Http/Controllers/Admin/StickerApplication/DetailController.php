<?php

namespace App\Http\Controllers\Admin\StickerApplication;

use App\Http\Controllers\Controller;
use App\Models\StickerApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DetailController extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $application = StickerApplication::with(['user', 'vehicle.vehicleBrandModel.brand', 'documents'])
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $application->id,
                'student' => [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'matricId' => $application->user->matric_id,
                    'email' => $application->user->email,
                    'phoneNo' => $application->user->phone_no,
                ],
                'vehicle' => [
                    'id' => $application->vehicle->id,
                    'plateNo' => $application->vehicle->vehicle_plate_no,
                    'type' => $application->vehicle->vehicle_type,
                    'color' => $application->vehicle->vehicle_color,
                    'brand' => $application->vehicle->vehicleBrandModel->brand->name,
                    'model' => $application->vehicle->vehicleBrandModel->name,
                    'isVehicleOwner' => $application->vehicle->is_vehicle_owner,
                    'ownerFullName' => $application->vehicle->owner_full_name,
                    'roadTaxExpiryDate' => $application->vehicle->road_tax_expiry_date,
                    'insuranceName' => $application->vehicle->insurance_name,
                    'insuranceNumber' => $application->vehicle->insurance_number,
                    'drivingLicenseNo' => $application->vehicle->driving_license_no,
                ],
                'application' => [
                    'status' => $application->status,
                    'submittedDate' => $application->created_at->format('Y-m-d'),
                    'expiryDate' => $application->expiry_date ? $application->expiry_date->format('Y-m-d') : null,
                    'remarks' => $application->remarks,
                ],
                'documents' => $application->documents->map(function ($document) {
                    return [
                        'id' => $document->id,
                        'type' => $document->type,
                        'fileName' => pathinfo($document->name, PATHINFO_FILENAME) . '.' . pathinfo($document->name, PATHINFO_EXTENSION),
                        'fileUrl' => route('api.documents.show', ['document' => $document->id]),
                        'uploadedAt' => $document->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
            ]
        ]);
    }
}
