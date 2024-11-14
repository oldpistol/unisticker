<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthCheckController extends Controller
{
    public function __invoke(Request $request)
    {
        return response()->json([
            'authenticated' => true,
            'user' => $request->user()
        ]);
    }
}
