<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsGatewayConfig extends Model
{
    protected $fillable = [
        'api_key',
        'api_secret',
        'sender_id',
        'api_endpoint',
    ];

    protected $hidden = [
        'api_key',
        'api_secret',
    ];
}
