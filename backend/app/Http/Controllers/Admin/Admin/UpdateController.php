<?php

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UpdateController extends Controller
{
    public function __invoke(Request $request, Admin $admin)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:admins,email,' . $admin->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', Password::defaults()],
            'role' => ['required', 'string', 'in:super-admin,Admin'],
            'status' => ['required', 'string', 'in:Active,Blocked'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'blocked_at' => $validated['status'] === 'Blocked' ? now() : null
        ];

        if (isset($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $admin->update($updateData);

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
