<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\EmailGatewayConfig;
use App\Models\SmsGatewayConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UpdateController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->has('email_gateway')) {
            $validator = Validator::make($request->input('email_gateway'), [
                'smtp_host' => 'required|string',
                'smtp_port' => 'required|integer',
                'username' => 'nullable|string',
                'password' => 'nullable|string',
                'from_email' => 'required|email',
                'from_name' => 'required|string',
                'encryption' => 'required|in:TLS,SSL,NONE',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            EmailGatewayConfig::updateOrCreate(
                ['id' => 1],
                $request->input('email_gateway')
            );
        }

        if ($request->has('sms_gateway')) {
            $validator = Validator::make($request->input('sms_gateway'), [
                'api_key' => 'required|string',
                'api_secret' => 'required|string',
                'sender_id' => 'required|string',
                'api_endpoint' => 'required|url',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            SmsGatewayConfig::updateOrCreate(
                ['id' => 1],
                $request->input('sms_gateway')
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'email_gateway' => EmailGatewayConfig::first(),
            'sms_gateway' => SmsGatewayConfig::first(),
        ]);
    }
}
