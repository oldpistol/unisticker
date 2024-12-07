<?php

namespace App\Http\Controllers\StickerApplication;

use App\Http\Controllers\Controller;
use App\Http\Resources\StickerApplicationResource;
use App\Models\StickerApplication;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $application = StickerApplication::with(['vehicle.vehicleBrandModel', 'user'])
            ->findOrFail($id);

        // Check if user has permission to view this application
        if (!auth()->user()->is_admin && $application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to view this application');
        }

        return new StickerApplicationResource($application);
    }
}
