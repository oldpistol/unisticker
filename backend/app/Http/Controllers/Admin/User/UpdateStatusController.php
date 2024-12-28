<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UpdateStatusController extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        if ($request->status === 'block') {
            $user->update(['blocked_at' => now()]);
        } else {
            $user->update(['blocked_at' => null]);
        }

        return response()->json([
            'message' => 'User status updated successfully',
            'data' => [
                'status' => $user->status
            ]
        ]);
    }
}
