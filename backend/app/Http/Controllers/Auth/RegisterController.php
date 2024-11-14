<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request)
    {
        // Get the validated data
        $validated = $request->validated();

        // Create a new user
        User::create([
            'name' => $validated['name'],
            'matric_no' => $validated['matric_no'],
            'phone' => $validated['phone'],
            'ic_no' => $validated['ic_no'],
            'passport_no' => $validated['passport_no'],
            'matric_id' => $validated['matric_id'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Return success response
        return response()->json([
            'message' => 'User created successfully',
        ], 201);
    }
}