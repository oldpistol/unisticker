<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request)
    {
        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'matric_id' => $validated['matric_id'],
            'phone_no' => $validated['phone_no'],
            'ic_no' => $validated['ic_no'],
            'passport_no' => $validated['passport_no'],
            'matric_id' => $validated['matric_id'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'User created successfully',
        ], Response::HTTP_CREATED);
    }
}
