<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CheckController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            $admin = $request->user();

            if (! $admin || $admin->role !== 'admin') {
                return response()->json([
                    'authenticated' => false,
                ], 401);
            }

            return response()->json([
                'authenticated' => true,
                'admin' => [
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while checking authentication.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
