<?php

namespace App\Http\Controllers\Admin\StickerApplication;

use App\Http\Controllers\Controller;
use App\Models\StickerApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApplicationsController extends Controller
{
    public function __invoke(Request $request)
    {
        // Validate request parameters
        $request->validate([
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:Pending,Approved,Rejected',
            'vehicle_type' => 'nullable|string|in:Car,Motorcycle',
            'date_range' => 'nullable|string|in:today,week,month,all',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        // Build query
        $query = StickerApplication::query()
            ->join('users', 'sticker_applications.user_id', '=', 'users.id')
            ->join('vehicles', 'sticker_applications.vehicle_id', '=', 'vehicles.id')
            ->select([
                'sticker_applications.id',
                'users.matric_id as studentId',
                'users.name as studentName',
                'vehicles.vehicle_plate_no as vehicleNo',
                'sticker_applications.created_at as submittedDate',
                'sticker_applications.status',
                'vehicles.vehicle_type as vehicleType'
            ]);

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('users.matric_id', 'like', "%{$search}%")
                    ->orWhere('vehicles.vehicle_plate_no', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->has('status')) {
            $query->where('sticker_applications.status', $request->status);
        }

        // Apply vehicle type filter
        if ($request->has('vehicle_type')) {
            $query->where('vehicles.vehicle_type', $request->vehicle_type);
        }

        // Apply date range filter
        if ($request->has('date_range')) {
            switch ($request->date_range) {
                case 'today':
                    $query->whereDate('sticker_applications.created_at', today());
                    break;
                case 'week':
                    $query->whereBetween('sticker_applications.created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'month':
                    $query->whereBetween('sticker_applications.created_at', [now()->startOfMonth(), now()->endOfMonth()]);
                    break;
            }
        }

        // Get total counts using separate query instances
        $total = (clone $query)->count();
        $pending = (clone $query)->where('sticker_applications.status', 'Pending')->count();
        $approved = (clone $query)->where('sticker_applications.status', 'Approved')->count();
        $rejected = (clone $query)->where('sticker_applications.status', 'Rejected')->count();

        // Apply pagination
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        $applications = $query->orderBy('sticker_applications.created_at', 'desc')
            ->paginate($perPage);

        // Transform the data to match frontend structure
        $data = $applications->map(function ($item) {
            return [
                'id' => $item->id,
                'studentId' => $item->studentId,
                'studentName' => $item->studentName,
                'vehicleNo' => $item->vehicleNo,
                'submittedDate' => \Carbon\Carbon::parse($item->submittedDate)->format('Y-m-d'),
                'status' => $item->status,
                'vehicleType' => $item->vehicleType
            ];
        })->values()->all();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $total,
                'totalItems' => $total,
                'itemsPerPage' => $perPage,
                'totalPages' => ceil($total / $perPage),
                'summary' => [
                    'total' => $total,
                    'pending' => $pending,
                    'approved' => $approved,
                    'rejected' => $rejected
                ]
            ]
        ]);
    }
}
