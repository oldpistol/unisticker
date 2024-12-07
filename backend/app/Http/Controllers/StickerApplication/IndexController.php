<?php

namespace App\Http\Controllers\StickerApplication;

use App\Http\Controllers\Controller;
use App\Http\Resources\StickerApplicationResource;
use App\Models\StickerApplication;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = StickerApplication::query()
            ->with(['vehicle.vehicleBrandModel', 'user'])
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user if not admin
        if (!auth()->user()->is_admin) {
            $query->where('user_id', auth()->id());
        }

        // Search by vehicle plate number
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('vehicle', function ($q) use ($search) {
                $q->where('vehicle_plate_no', 'like', "%{$search}%");
            });
        }

        $applications = $query->paginate($request->input('per_page', 10));

        return StickerApplicationResource::collection($applications);
    }
}
