<?php

namespace App\Http\Controllers\Admin\StickerApplication;

use App\Http\Controllers\Controller;
use App\Models\StickerApplication;
use App\Enums\StickerApplicationStatus;
use Illuminate\Http\Request;

class RejectController extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $application = StickerApplication::findOrFail($id);
        
        $application->update([
            'status' => StickerApplicationStatus::REJECTED,
            'remarks' => $request->input('remarks')
        ]);

        return response()->json([
            'message' => 'Application rejected successfully'
        ]);
    }
}
