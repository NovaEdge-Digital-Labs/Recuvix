import {
    Heading,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

export const NewsletterWelcomeEmail = () => {
    return (
        <EmailLayout previewText="You're subscribed to Recuvix updates">
            <Heading className="text-2xl font-bold text-gray-900 mb-6">
                You're on the list! 📬
            </Heading>

            <Text className="text-gray-700 leading-7 mb-6">
                Thanks for subscribing to Recuvix updates. We're excited to share our latest features,
                SEO tips, and AI writing breakthroughs with you.
            </Text>

            <Section className="bg-accent/5 rounded-xl p-6 mb-8 border border-accent/20">
                <Text className="m-0 font-bold text-gray-900 mb-2">What to expect:</Text>
                <ul className="m-0 p-0 list-none text-sm text-gray-700 space-y-2">
                    <li>✨ Early access to new AI models</li>
                    <li>📈 Proven SEO strategies for 2024</li>
                    <li>🛠 Product updates and efficiency tips</li>
                </ul>
            </Section>

            <Text className="text-sm text-gray-500 italic">
                We promise to only send the good stuff (usually once a week).
            </Text>
        </EmailLayout>
    );
};

export default NewsletterWelcomeEmail;
