<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $email = $googleUser->email;

            // Validate UTM email domain
            if (! str_ends_with($email, '@utm.my') && ! str_ends_with($email, '@graduate.utm.my')) {
                return redirect(config('app.frontend_url').'/login?error='.urlencode('Only UTM email addresses are allowed.'));
            }

            // Find existing user or create new one
            $user = User::where('email', $email)->first();

            if (! $user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $email,
                    'password' => Hash::make(Str::random(24)), // Random secure password
                    'email_verified_at' => now(),
                ]);
            }

            // Login user
            Auth::login($user);
            $token = $user->createToken('auth-token')->plainTextToken;

            return redirect(config('app.frontend_url').'/login?token='.$token);

        } catch (\Exception $e) {
            return redirect(config('app.frontend_url').'/login?error='.urlencode('Google authentication failed.'));
        }
    }
}
