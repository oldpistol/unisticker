<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CreateApplicationRequest extends FormRequest
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
        return [
            'vehicle_brand_model_id' => 'required|exists:vehicle_brand_models,id',
            'vehicle_plate_no' => 'required|string',
            'vehicle_type' => 'required|string',
            'vehicle_color' => 'required|string',
            'road_tax_expiry_date' => 'required|date',
            'insurance_name' => 'required|string',
            'insurance_number' => 'required|string',
            'driving_license_no' => 'required|string',
            
            // Document validation
            'documents' => 'required|array',
            'documents.*.file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'documents.*.type' => ['required', new Enum(DocumentType::class)],
        ];
    }
}
