<?php

namespace App\Models;

use App\Enums\StickerApplicationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StickerApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'application_date',
        'status',
        'expiry_date',
        'remarks'
    ];

    protected $casts = [
        'application_date' => 'datetime',
        'expiry_date' => 'date',
        'status' => StickerApplicationStatus::class
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'application_id');
    }
}
