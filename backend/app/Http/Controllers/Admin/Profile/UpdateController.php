<?php

namespace App\Http\Controllers\Admin\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Profile\UpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UpdateController extends Controller
{
    public function __invoke(UpdateRequest $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();
        $validated = $request->validated();

        $admin->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'admin' => [
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
            ],
        ]);
    }
}
