import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface PasswordResetEmailProps {
    resetLink: string;
}

export const PasswordResetEmail = ({
    resetLink = '#',
}: PasswordResetEmailProps) => {
    return (
        <EmailLayout previewText="Reset your Recuvix password">
            <Heading className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Password Reset Request
            </Heading>

            <Text className="text-gray-700 leading-7 mb-8 text-center">
                We received a request to reset your Recuvix password.
                Click the button below to choose a new one.
            </Text>

            <Section className="text-center mb-10">
                <Button
                    href={resetLink}
                    className="bg-[#050505] text-white px-8 py-4 rounded-xl font-bold text-sm no-underline inline-block"
                >
                    Reset Password →
                </Button>
            </Section>

            <Section className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                <Text className="m-0 text-sm font-semibold text-gray-600">
                    This link expires in 1 hour.
                </Text>
            </Section>

            <Section className="border-t border-gray-100 pt-6 text-center">
                <Text className="text-sm text-gray-400 m-0">
                    Didn't request this? You can safely ignore this email. Your password will remain unchanged.
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default PasswordResetEmail;
