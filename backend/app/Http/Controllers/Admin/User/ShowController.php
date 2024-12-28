<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $user = User::with('address')->findOrFail($id);
        
        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'matric_id' => $user->matric_id ?: null,
                'ic_no' => $user->ic_no ?: null,
                'passport_no' => $user->passport_no ?: null,
                'phone_no' => $user->phone_no ?: null,
                'status' => $user->status,
                'registered_at' => $user->created_at->format('n/j/Y'),
                'address' => $user->address ? [
                    'street_address' => $user->address->street_address,
                    'postcode' => $user->address->postcode,
                    'city' => $user->address->city,
                    'state' => $user->address->state,
                ] : null,
                'active_vehicles' => $user->active_vehicles->map(function ($vehicle) {
                    $latestSticker = $vehicle->stickerApplications->first();
                    $brandModel = $vehicle->vehicleBrandModel;
                    return [
                        'vehicle_number' => $vehicle->vehicle_plate_no,
                        'sticker_number' => $latestSticker ? $latestSticker->id : null,
                        'vehicle_type' => $vehicle->vehicle_type,
                        'brand_model' => $brandModel->brand->name . ' ' . $brandModel->name,
                        'color' => $vehicle->vehicle_color ?: null,
                        'expiry_date' => $latestSticker ? $latestSticker->expiry_date->format('m/d/Y') : null,
                    ];
                })
            ]
        ]);
    }
}
