<?php

use App\Http\Controllers\Admin\Auth\CheckController as AdminCheckController;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\Auth\LogoutController as AdminLogoutController;
use App\Http\Controllers\Auth\AuthCheckController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

// User Auth Routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    Route::get('/check', AuthCheckController::class)->middleware('auth:sanctum');
    Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');

    // Google OAuth routes
    Route::get('/google', [GoogleController::class, 'redirectToGoogle'])->middleware(['web'])->name('google.login');
    Route::get('/google/callback', [GoogleController::class, 'handleGoogleCallback'])->middleware(['web'])->name('google.callback');
});

// Admin Auth Routes
Route::group(['prefix' => 'admin/auth'], function () {
    Route::post('/login', AdminLoginController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', AdminLogoutController::class);
        Route::get('/check', AdminCheckController::class);
    });
});
