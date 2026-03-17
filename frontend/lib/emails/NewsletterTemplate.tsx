import React from 'react';

interface NewsletterTemplateProps {
    title: string;
    content: string;
    previewText?: string;
    unsubscribeUrl: string;
}

export const NewsletterTemplate = ({ title, content, previewText, unsubscribeUrl }: NewsletterTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #000; margin: 0; padding: 0; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; }
        .header { padding: 40px 20px; text-align: center; border-bottom: 1px solid #27272a; }
        .logo { font-size: 24px; font-weight: bold; color: #fff; text-decoration: none; }
        .logo span { color: #facc15; }
        .content { padding: 40px 20px; line-height: 1.6; color: #d4d4d8; font-size: 16px; }
        .content h2 { color: #fff; margin-bottom: 20px; }
        .footer { padding: 40px 20px; text-align: center; border-top: 1px solid #27272a; color: #71717a; font-size: 12px; }
        .footer a { color: #facc15; text-decoration: none; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #facc15; color: #000; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="https://recuvix.in" class="logo">Recuvix<span>.</span></a>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>Recuvix AI Platform • 123 AI Lane, Silicon Valley</p>
            <p>You received this because you subscribed to our newsletter.</p>
            <p><a href="${unsubscribeUrl}">Unsubscribe</a> from future updates.</p>
        </div>
    </div>
</body>
</html>
`;
