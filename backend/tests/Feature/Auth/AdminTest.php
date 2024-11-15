<?php

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = Admin::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => Hash::make('password'),
        'role' => 'admin',
    ]);
});

test('admin can login with valid credentials', function () {
    $response = $this->postJson('/api/admin/auth/login', [
        'email' => 'admin@test.com',
        'password' => 'password',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'token',
            'admin' => [
                'name',
                'email',
                'role',
            ],
        ]);

    expect($response->json('admin.email'))->toBe('admin@test.com')
        ->and($response->json('admin.name'))->toBe('Test Admin')
        ->and($response->json('admin.role'))->toBe('admin');
});

test('admin cannot login with invalid credentials', function () {
    $response = $this->postJson('/api/admin/auth/login', [
        'email' => 'admin@test.com',
        'password' => 'wrong_password',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('admin cannot login with non-admin email', function () {
    $response = $this->postJson('/api/admin/auth/login', [
        'email' => 'nonexistent@test.com',
        'password' => 'password',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('admin can logout', function () {
    $token = $this->admin->createToken('admin-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer '.$token,
    ])->postJson('/api/admin/auth/logout');

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Successfully logged out',
        ]);
});

test('admin cannot logout without token', function () {
    $response = $this->postJson('/api/admin/auth/logout');

    $response->assertStatus(401);
});

test('admin can check authentication status', function () {
    $token = $this->admin->createToken('admin-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer '.$token,
    ])->getJson('/api/admin/auth/check');

    $response->assertStatus(200)
        ->assertJson([
            'authenticated' => true,
            'admin' => [
                'name' => $this->admin->name,
                'email' => $this->admin->email,
                'role' => $this->admin->role,
            ],
        ]);
});

test('admin check fails without token', function () {
    $response = $this->getJson('/api/admin/auth/check');

    $response->assertStatus(401);
});

test('login validation requires email and password', function () {
    $response = $this->postJson('/api/admin/auth/login', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'password']);
});

test('login validation requires valid email format', function () {
    $response = $this->postJson('/api/admin/auth/login', [
        'email' => 'not-an-email',
        'password' => 'password',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});
