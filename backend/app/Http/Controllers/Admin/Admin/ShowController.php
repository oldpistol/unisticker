<?php

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    public function __invoke(Admin $admin)
    {
        return response()->json([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'phone' => $admin->phone,
            'role' => $admin->role,
            'status' => $admin->status,
            'blocked_at' => $admin->blocked_at ? $admin->blocked_at->format('Y-m-d H:i:s') : null
        ]);
    }
}
