<?php

namespace App\Http\Controllers\Admin\StickerApplication;

use App\Http\Controllers\Controller;
use App\Models\StickerApplication;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function __invoke(Request $request)
    {
        $applications = StickerApplication::with(['user', 'vehicle'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('student_id', 'like', "%{$search}%");
                    })
                    ->orWhereHas('vehicle', function ($q) use ($search) {
                        $q->where('plate_number', 'like', "%{$search}%");
                    });
                });
            })
            ->when($request->status && $request->status !== 'all', function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->vehicleType && $request->vehicleType !== 'all', function ($query, $vehicleType) {
                $query->whereHas('vehicle', function ($q) use ($vehicleType) {
                    $q->where('type', $vehicleType);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'applications-' . now()->format('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $columns = ['Student ID', 'Student Name', 'Vehicle No.', 'Vehicle Type', 'Submitted Date', 'Status'];

        $callback = function() use ($applications, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($applications as $application) {
                fputcsv($file, [
                    $application->user?->student_id ?? 'N/A',
                    $application->user?->name ?? 'N/A',
                    $application->vehicle?->plate_number ?? 'N/A',
                    $application->vehicle?->type ?? 'N/A',
                    $application->created_at->format('M d, Y'),
                    $application->status->value
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
