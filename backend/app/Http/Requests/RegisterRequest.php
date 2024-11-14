<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'matric_id' => ['required', 'string', 'max:255', 'unique:users'],
            'phone_no' => ['required', 'string', 'max:255', 'unique:users'],
            'ic_no' => ['required_if:passport_no,null', 'string', 'max:255', 'unique:users', 'nullable'],
            'passport_no' => ['required_if:ic_no,null', 'string', 'max:255', 'unique:users', 'nullable'],
            'matric_id' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];

        return $rules;
    }
}
