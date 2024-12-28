<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\EmailGatewayConfig;
use App\Models\SmsGatewayConfig;
use Illuminate\Http\JsonResponse;

class ShowController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $emailConfig = EmailGatewayConfig::first();
        $smsConfig = SmsGatewayConfig::first();

        return response()->json([
            'email_gateway' => $emailConfig,
            'sms_gateway' => $smsConfig,
        ]);
    }
}
