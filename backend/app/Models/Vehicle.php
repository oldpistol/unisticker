<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\VehicleBrandModel;

class Vehicle extends Model
{
    /** @use HasFactory<\Database\Factories\VehicleFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_brand_model_id',
        'vehicle_plate_no',
        'vehicle_type',
        'vehicle_color',
        'road_tax_expiry_date',
        'insurance_name',
        'insurance_number',
        'driving_license_no'
    ];

    protected $casts = [
        'road_tax_expiry_date' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicleBrandModel()
    {
        return $this->belongsTo(VehicleBrandModel::class);
    }
}
