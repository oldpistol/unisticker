<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;

uses(RefreshDatabase::class);

// test valid register
it('user can register using ic no', function () {

    $user = User::factory()->make();

    $response = $this->post('/api/auth/register', [
        'name' => $user->name,
        'matric_id' => $user->matric_id,
        'phone_no' => $user->phone_no,
        'ic_no' => $user->ic_no,
        'passport_no' => null,
        'matric_id' => $user->matric_id,
        'email' => $user->email,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(Response::HTTP_CREATED)
        ->assertJson([
            'message' => 'User created successfully',
        ]);

    $this->assertDatabaseHas('users', [
        'name' => $user->name,
        'matric_id' => $user->matric_id,
        'phone_no' => $user->phone_no,
        'ic_no' => $user->ic_no,
        'passport_no' => null,
        'matric_id' => $user->matric_id,
        'email' => $user->email,
    ]);
});

// test valid register
it('user can register using passport no', function () {

    $user = User::factory()->make();

    $response = $this->post('/api/auth/register', [
        'name' => $user->name,
        'matric_id' => $user->matric_id,
        'phone_no' => $user->phone_no,
        'ic_no' => null,
        'passport_no' => $user->passport_no,
        'matric_id' => $user->matric_id,
        'email' => $user->email,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(Response::HTTP_CREATED)
        ->assertJson([
            'message' => 'User created successfully',
        ]);

    $this->assertDatabaseHas('users', [
        'name' => $user->name,
        'matric_id' => $user->matric_id,
        'phone_no' => $user->phone_no,
        'ic_no' => null,
        'passport_no' => $user->passport_no,
        'matric_id' => $user->matric_id,
        'email' => $user->email,
    ]);
});

// test invalid register
it('user cannot register using existing email', function () {

    $user = User::factory()->create();

    $response = $this->post('/api/auth/register', [
        'name' => $user->name,
        'matric_id' => $user->matric_id,
        'phone_no' => $user->phone_no,
        'ic_no' => $user->ic_no,
        'passport_no' => null,
        'matric_id' => $user->matric_id,
        'email' => $user->email,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
        ->assertJsonValidationErrors([
            'email' => 'The email has already been taken.',
        ]);
});
