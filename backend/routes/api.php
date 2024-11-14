<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthCheckController;
use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;

// route group for auth
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    Route::get('/check', AuthCheckController::class)->middleware('auth:sanctum');
    Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');
    
    // Google OAuth routes
    Route::get('/google', [GoogleController::class, 'redirectToGoogle'])->middleware(['web'])->name('google.login');
    Route::get('/google/callback', [GoogleController::class, 'handleGoogleCallback'])->middleware(['web'])->name('google.callback');
});
