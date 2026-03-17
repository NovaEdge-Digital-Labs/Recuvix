import {
    Button,
    Heading,
    Section,
    Text,
    Img,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface WelcomeEmailProps {
    name: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuvix.in';

export const WelcomeEmail = ({
    name = 'there',
}: WelcomeEmailProps) => {
    return (
        <EmailLayout previewText="Welcome to Recuvix! Your 5 free credits are ready 🎉">
            <Heading className="text-2xl font-bold text-gray-900 mb-6">
                Welcome to Recuvix, {name}!
            </Heading>

            <Text className="text-lg text-gray-700 leading-7 mb-6">
                We're thrilled to have you here. To get you started on your content journey,
                we've credited your account with <strong>5 free credits</strong>.
            </Text>

            <Section className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                <Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Feature Highlights
                </Text>

                <div className="mb-4 flex items-start gap-4">
                    <div className="bg-accent/10 p-2 rounded-lg text-lg">✍️</div>
                    <div>
                        <Text className="m-0 font-bold text-gray-900">Humanized AI Writing</Text>
                        <Text className="m-0 text-sm text-gray-600">Content that passes AI detectors and engages readers.</Text>
                    </div>
                </div>

                <div className="mb-4 flex items-start gap-4">
                    <div className="bg-accent/10 p-2 rounded-lg text-lg">🚀</div>
                    <div>
                        <Text className="m-0 font-bold text-gray-900">SEO Optimized</Text>
                        <Text className="m-0 text-sm text-gray-600">Built-in keyword integration and meta-tag generation.</Text>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-2 rounded-lg text-lg">🎨</div>
                    <div>
                        <Text className="m-0 font-bold text-gray-900">Auto-Images</Text>
                        <Text className="m-0 text-sm text-gray-600">High-quality thumbnails and internal images generated for you.</Text>
                    </div>
                </div>
            </Section>

            <Section className="text-center mb-10">
                <Button
                    href={`${baseUrl}/dashboard`}
                    className="bg-[#e8ff47] text-black px-8 py-4 rounded-xl font-bold text-sm no-underline inline-block"
                >
                    Generate Your First Blog →
                </Button>
            </Section>

            <Section className="border-t border-gray-100 pt-6">
                <Text className="text-sm text-gray-500 italic m-0">
                    Pro-tip: BYOK (Bring Your Own Key) is completely free, and your credits never expire!
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default WelcomeEmail;
