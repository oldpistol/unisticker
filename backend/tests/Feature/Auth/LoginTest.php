<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// test valid login
test('user can login using email and password', function () {

    $user = User::factory()->create();

    $response = $this->post('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertStatus(200);

    $response->assertJsonStructure([
        'token',
    ]);
});

// test invalid login
test('user cannot login using invalid email and password', function () {

    $response = $this->post('/api/auth/login', [
        'email' => 'email@domain.com',
        'password' => 'password',
    ]);

    $response->assertStatus(401);
});

// test wrong password
test('user cannot login using correct email and wrong password', function () {

    $user = User::factory()->create();

    $response = $this->post('/api/auth/login', [
        'email' => $user->email,
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401);

    $response->assertJson([
        'message' => 'Invalid credential',
    ]);
});
