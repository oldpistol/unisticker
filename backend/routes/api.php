<?php

use App\Http\Controllers\Admin\Auth\CheckController as AdminCheckController;
use App\Http\Controllers\Admin\Auth\LoginController as AdminLoginController;
use App\Http\Controllers\Admin\Auth\LogoutController as AdminLogoutController;
use App\Http\Controllers\Admin\StickerApplication\RecentApplicationsController;
use App\Http\Controllers\Auth\AuthCheckController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Document\ShowController as DocumentShowController;
use App\Http\Controllers\StickerApplication\CreateController;
use App\Http\Controllers\StickerApplication\IndexController;
use App\Http\Controllers\StickerApplication\ShowController as ApplicationShowController;
use App\Http\Controllers\VehicleBrandModel\IndexController as VehicleBrandModelIndexController;
use Illuminate\Support\Facades\Route;

// User Auth Routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    Route::get('/check', AuthCheckController::class)->middleware('auth:sanctum');
    Route::get('/user', UserController::class)->middleware('auth:sanctum');
    Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');
    Route::post('/forgot-password', ForgotPasswordController::class);
    Route::post('/reset-password', ResetPasswordController::class)->name('password.reset');

    // Google OAuth routes
    Route::get('/google', [GoogleController::class, 'redirectToGoogle'])->middleware(['web'])->name('google.login');
    Route::get('/google/callback', [GoogleController::class, 'handleGoogleCallback'])->middleware(['web'])->name('google.callback');
});

// Admin Auth Routes
Route::group(['prefix' => 'admin/auth'], function () {
    Route::post('/login', AdminLoginController::class);

    Route::middleware('auth:admin')->group(function () {
        Route::post('/logout', AdminLogoutController::class);
        Route::get('/check', AdminCheckController::class);
    });
});

// Admin routes
Route::prefix('admin')->middleware(['auth:admin'])->group(function () {
    Route::get('/recent-applications', RecentApplicationsController::class);
    // Route::get('/sticker-applications', IndexController::class);
    // Route::get('/sticker-applications/{id}', ApplicationShowController::class);
    // Route::post('/sticker-applications', CreateController::class);
});

// Sticker Application Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sticker-applications', IndexController::class);
    Route::get('/sticker-applications/{id}', ApplicationShowController::class);
    Route::post('/sticker-applications', CreateController::class);
});

// Document routes
Route::middleware('auth:sanctum')->get('/documents/{document}', DocumentShowController::class);

// Vehicle Brand Models
Route::get('/vehicle-brand-models', VehicleBrandModelIndexController::class);
