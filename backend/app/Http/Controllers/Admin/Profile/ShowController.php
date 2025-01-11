<?php

namespace App\Http\Controllers\Admin\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ShowController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $admin = Auth::guard('admin')->user();

        return response()->json([
            'name' => $admin->name,
            'email' => $admin->email,
            'phone' => $admin->phone,
        ]);
    }
}
