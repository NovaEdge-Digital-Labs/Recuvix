import React from 'react';

interface CreditsReceivedTemplateProps {
    amount: number;
    reason: string;
    newBalance: number;
    expiresAt?: string | null;
}

export const CreditsReceivedTemplate = ({
    amount,
    reason,
    newBalance,
    expiresAt
}: CreditsReceivedTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You received free credits!</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; margin: 0; padding: 0; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; margin-top: 40px; }
        .header { padding: 40px 20px; text-align: center; border-bottom: 1px solid #27272a; }
        .logo { font-size: 24px; font-weight: bold; color: #fff; text-decoration: none; }
        .logo span { color: #facc15; }
        .content { padding: 40px 20px; text-align: center; line-height: 1.6; }
        .badge { font-size: 48px; font-weight: 800; color: #facc15; margin: 20px 0; }
        .new-balance { color: #71717a; font-size: 14px; margin-top: 10px; }
        .reason { background-color: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 8px; margin: 20px 0; color: #d4d4d8; font-style: italic; }
        .expiry { color: #ef4444; font-size: 14px; font-weight: 500; margin-top: 10px; }
        .footer { padding: 40px 20px; text-align: center; border-top: 1px solid #27272a; color: #71717a; font-size: 12px; }
        .btn { display: inline-block; padding: 14px 28px; background-color: #facc15; color: #000; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="https://recuvix.in" class="logo">Recuvix<span>.</span></a>
        </div>
        <div class="content">
            <h1 style="color: #fff; font-size: 24px;">Good News!</h1>
            <p style="color: #a1a1aa; font-size: 16px;">You've just received free credits on your account.</p>
            
            <div class="badge">${amount} Credits</div>
            
            <div class="reason">
                "${reason}"
            </div>
            
            <div class="new-balance">
                Your new total balance: <strong>${newBalance} credits</strong>
            </div>

            ${expiresAt ? `<div class="expiry">⏰ These credits expire on ${new Date(expiresAt).toLocaleDateString()}</div>` : ''}

            <a href="https://recuvix.in/dashboard" class="btn">Start Generating Now</a>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Recuvix AI Platform</p>
            <p>You received this because someone (likely an admin or an automated rule) awarded you credits.</p>
        </div>
    </div>
</body>
</html>
`;
