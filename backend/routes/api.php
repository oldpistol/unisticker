<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// route group for auth
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', RegisterController::class);
});
