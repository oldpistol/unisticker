<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5;">UniSticker</h1>
    </div>

    <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1F2937; margin-bottom: 20px;">Reset Your Password</h2>
        
        <p>Hello,</p>
        
        <p>You are receiving this email because we received a password reset request for your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $resetUrl }}" 
               style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
            </a>
        </div>
        
        <p>This password reset link will expire in 60 minutes.</p>
        
        <p>If you did not request a password reset, no further action is required.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6B7280; font-size: 14px;">If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
        
        <p style="color: #6B7280; font-size: 14px; word-break: break-all;">
            {{ $resetUrl }}
        </p>
    </div>

    <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px;">
        <p>&copy; {{ date('Y') }} UniSticker. All rights reserved.</p>
    </div>
</body>
</html>
