<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\EmailGatewayConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class TestEmailController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            $config = EmailGatewayConfig::first();
            if (!$config) {
                return response()->json(['error' => 'Email configuration not found'], 404);
            }

            // Configure mail settings
            config([
                'mail.mailers.smtp.host' => $config->smtp_host,
                'mail.mailers.smtp.port' => $config->smtp_port,
                'mail.mailers.smtp.username' => $config->username,
                'mail.mailers.smtp.password' => $config->password,
                'mail.mailers.smtp.encryption' => strtolower($config->encryption),
                'mail.from.address' => $config->from_email,
                'mail.from.name' => $config->from_name,
            ]);

            // Send test email
            Mail::raw('This is a test email from UniSticker System', function ($message) use ($config) {
                $message->to($config->username)
                    ->subject('UniSticker - Test Email');
            });

            return response()->json(['message' => 'Test email sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send test email: ' . $e->getMessage()], 500);
        }
    }
}
