<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StickerApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'matric_id' => $this->user->matric_id ?? '',
                'phone_no' => $this->user->phone_no ?? '',
            ] : null,
            'vehicle' => $this->vehicle ? [
                'id' => $this->vehicle->id,
                'plate_no' => $this->vehicle->vehicle_plate_no,
                'type' => $this->vehicle->vehicle_type,
                'color' => $this->vehicle->vehicle_color,
                'brand' => $this->vehicle->vehicleBrandModel?->brand?->name,
                'model' => $this->vehicle->vehicleBrandModel?->name,
                'driving_license_no' => $this->vehicle->driving_license_no,
                'road_tax_expiry_date' => $this->vehicle->road_tax_expiry_date?->format('Y-m-d'),
                'insurance_name' => $this->vehicle->insurance_name,
                'insurance_number' => $this->vehicle->insurance_number,
            ] : null,
            'application_date' => $this->application_date?->format('Y-m-d H:i:s'),
            'status' => $this->status?->value,
            'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            'remarks' => $this->remarks,
            'documents' => $this->documents->map(fn ($document) => [
                'id' => $document->id,
                'name' => $document->name,
                'type' => $document->type,
                'file_path' => $document->file_path,
                'url' => Storage::disk('public')->url($document->file_path),
            ]),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
