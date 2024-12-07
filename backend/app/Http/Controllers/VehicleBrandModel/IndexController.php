<?php

namespace App\Http\Controllers\VehicleBrandModel;

use App\Http\Controllers\Controller;
use App\Models\VehicleBrand;
use Illuminate\Http\JsonResponse;

class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): JsonResponse
    {
        $brands = VehicleBrand::with('models')->get();
        
        // Transform the data into the required format
        $result = $brands->mapWithKeys(function ($brand) {
            return [
                $brand->name => [
                    'models' => $brand->models->map(function ($model) {
                        return [
                            'id' => $model->id,
                            'name' => $model->name,
                        ];
                    }),
                ],
            ];
        });

        return response()->json($result);
    }
}
