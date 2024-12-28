<?php

namespace App\Http\Controllers\Admin\StickerApplication;

use App\Http\Controllers\Controller;
use App\Models\StickerApplication;
use App\Enums\StickerApplicationStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ApproveController extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $application = StickerApplication::findOrFail($id);
        
        // Set expiry date to 1 year from now
        $application->update([
            'status' => StickerApplicationStatus::APPROVED,
            'expiry_date' => Carbon::now()->addYear(),
            'remarks' => $request->input('remarks')
        ]);

        return response()->json([
            'message' => 'Application approved successfully'
        ]);
    }
}
