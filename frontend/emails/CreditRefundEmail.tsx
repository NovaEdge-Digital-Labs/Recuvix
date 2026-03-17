import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface CreditRefundEmailProps {
    newBalance: number;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuvix.in';

export const CreditRefundEmail = ({
    newBalance = 1,
}: CreditRefundEmailProps) => {
    return (
        <EmailLayout previewText="Credit refunded — generation failed">
            <Heading className="text-2xl font-bold text-gray-900 mb-6">
                Credit Refunded
            </Heading>

            <Text className="text-gray-700 leading-7 mb-6">
                We're sorry, but one of your blog generations failed to complete. We've automatically
                refunded the credit to your account.
            </Text>

            <Section className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-100 text-center">
                <Text className="m-0 text-xs text-gray-400 uppercase tracking-widest mb-2">Updated Credit Balance</Text>
                <Text className="m-0 text-4xl font-extrabold text-black">{newBalance}</Text>
            </Section>

            <Section className="text-center mb-10">
                <Button
                    href={`${baseUrl}/dashboard`}
                    className="bg-[#e8ff47] text-black px-8 py-4 rounded-xl font-bold text-sm no-underline inline-block"
                >
                    Try Again →
                </Button>
            </Section>

            <Section className="border-t border-gray-100 pt-6">
                <Text className="text-sm text-gray-500 m-0">
                    If you continue to experience issues, please reply to this email or contact our support team.
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default CreditRefundEmail;
