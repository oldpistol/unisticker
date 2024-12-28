<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\EmailGatewayConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TestEmailController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            $config = EmailGatewayConfig::first();
            if (!$config) {
                return response()->json(['error' => 'Email configuration not found'], 404);
            }

            // Get admin's email as test recipient
            $admin = Auth::guard('admin')->user();
            if (!$admin || !$admin->email) {
                return response()->json(['error' => 'Admin email not found'], 404);
            }

            // Log current config for debugging
            Log::info('Current email config:', [
                'host' => $config->smtp_host,
                'port' => $config->smtp_port,
                'username' => $config->username,
                'encryption' => $config->encryption,
                'from_email' => $config->from_email,
                'from_name' => $config->from_name,
            ]);

            // Configure mail settings
            $mailConfig = [
                'driver' => 'smtp',
                'host' => $config->smtp_host,
                'port' => $config->smtp_port,
                'username' => $config->username,
                'password' => $config->password,
                'encryption' => strtolower($config->encryption),
                'from' => [
                    'address' => $config->from_email,
                    'name' => $config->from_name,
                ],
            ];

            // Set the configuration for this specific mailer
            config(['mail.mailers.smtp' => $mailConfig]);
            config(['mail.from' => ['address' => $config->from_email, 'name' => $config->from_name]]);

            // Log the configured mailer settings
            Log::info('Configured mailer settings:', [
                'mailer' => config('mail.mailers.smtp'),
                'from' => config('mail.from'),
            ]);

            // Send test email to admin's email
            Mail::raw('This is a test email from UniSticker System', function ($message) use ($admin, $config) {
                $message->from($config->from_email, $config->from_name)
                       ->to($admin->email)
                       ->subject('UniSticker - Test Email');
            });

            return response()->json(['message' => 'Test email sent successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to send test email:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to send test email: ' . $e->getMessage()], 500);
        }
    }
}
