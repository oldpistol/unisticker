<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

// route group for auth
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
});
