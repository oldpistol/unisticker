<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\SmsGatewayConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class TestSmsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            $config = SmsGatewayConfig::first();
            if (!$config) {
                return response()->json(['error' => 'SMS configuration not found'], 404);
            }

            // Send test SMS using the configured gateway
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $config->api_key,
            ])->post($config->api_endpoint, [
                'to' => '+1234567890', // Replace with admin's phone number
                'message' => 'This is a test SMS from UniSticker System',
                'from' => $config->sender_id,
            ]);

            if (!$response->successful()) {
                throw new \Exception('SMS gateway returned error: ' . $response->body());
            }

            return response()->json(['message' => 'Test SMS sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send test SMS: ' . $e->getMessage()], 500);
        }
    }
}
