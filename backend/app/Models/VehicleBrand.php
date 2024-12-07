<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleBrand extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'origin',
    ];

    /**
     * Get the models for the vehicle brand.
     */
    public function models(): HasMany
    {
        return $this->hasMany(VehicleBrandModel::class);
    }
}
