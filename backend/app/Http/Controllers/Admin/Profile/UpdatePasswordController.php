<?php

namespace App\Http\Controllers\Admin\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Profile\UpdatePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UpdatePasswordController extends Controller
{
    public function __invoke(UpdatePasswordRequest $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();
        $validated = $request->validated();

        if (!Hash::check($validated['current_password'], $admin->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $admin->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }
}
