<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailGatewayConfig extends Model
{
    protected $fillable = [
        'smtp_host',
        'smtp_port',
        'username',
        'password',
        'from_email',
        'from_name',
        'encryption',
    ];

    protected $hidden = [
        'password',
    ];
}
