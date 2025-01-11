<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\StickerApplication;
use App\Models\Vehicle;
use App\Models\Address;
use App\Enums\StickerApplicationStatus;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_no',
        'ic_no',
        'passport_no',
        'matric_id',
        'blocked_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'blocked_at' => 'datetime',
    ];

    protected $appends = [
        'status',
        'active_vehicles'
    ];

    public function getStatusAttribute()
    {
        return $this->blocked_at ? 'Blocked' : 'Active';
    }

    public function stickerApplications()
    {
        return $this->hasMany(StickerApplication::class);
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function getActiveVehiclesAttribute()
    {
        return Vehicle::whereHas('stickerApplications', function ($query) {
            $query->where('user_id', $this->id)
                  ->where('status', StickerApplicationStatus::APPROVED)
                  ->where('expiry_date', '>=', now())
                  ->latest('application_date');
        })->with(['vehicleBrandModel.brand', 'stickerApplications' => function ($query) {
            $query->where('status', StickerApplicationStatus::APPROVED)
                  ->where('expiry_date', '>=', now())
                  ->latest('application_date')
                  ->limit(1);
        }])->get();
    }
}
