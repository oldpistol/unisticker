<?php

namespace App\Http\Controllers\Admin\StickerApplication;

use App\Http\Controllers\Controller;
use App\Http\Resources\StickerApplicationResource;
use App\Models\StickerApplication;
use Illuminate\Http\Request;

class RecentApplicationsController extends Controller
{
    public function __invoke(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        
        $query = StickerApplication::query()
            ->with(['vehicle.vehicleBrandModel', 'user'])
            ->orderBy('created_at', 'desc');

        $applications = $query->paginate($perPage);

        return StickerApplicationResource::collection($applications);
    }
}
