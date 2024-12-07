<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'vehicle' => [
                'id' => $this->vehicle->id,
                'plate_no' => $this->vehicle->vehicle_plate_no,
                'type' => $this->vehicle->vehicle_type,
                'color' => $this->vehicle->vehicle_color,
                'brand_model' => $this->vehicle->vehicleBrandModel->name,
            ],
            'application_date' => $this->application_date->format('Y-m-d H:i:s'),
            'status' => $this->status->value,
            'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            'remarks' => $this->remarks,
            'documents' => $this->documents->map(fn ($document) => [
                'id' => $document->id,
                'name' => $document->name,
                'type' => $document->type,
                'file_path' => $document->file_path,
            ]),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
