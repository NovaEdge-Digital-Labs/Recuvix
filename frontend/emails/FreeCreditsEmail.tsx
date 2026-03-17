import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface FreeCreditsEmailProps {
    n: number;
    reason: string;
    newBalance: number;
    expiryDate?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuvix.in';

export const FreeCreditsEmail = ({
    n = 5,
    reason = 'Special Promotion',
    newBalance = 10,
    expiryDate,
}: FreeCreditsEmailProps) => {
    return (
        <EmailLayout previewText={`🎁 You received ${n} free credits!`}>
            <Heading className="text-2xl font-bold text-gray-900 mb-6 text-center">
                A Gift For You!
            </Heading>

            <Section className="bg-[#e8ff47]/5 rounded-2xl p-10 mb-8 border-2 border-dashed border-[#e8ff47] text-center">
                <Text className="m-0 text-6xl font-black text-black leading-none mb-2">{n}</Text>
                <Text className="m-0 text-xl font-bold text-gray-900 uppercase tracking-wider">Credits Added</Text>
            </Section>

            <Text className="text-gray-700 leading-7 mb-6 text-center">
                You've received these credits for: <strong>{reason}</strong>.
                Happy writing!
            </Text>

            <Section className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 flex items-center justify-between">
                <div className="w-full text-center">
                    <Text className="m-0 text-xs text-gray-400 uppercase tracking-widest mb-1">New Balance</Text>
                    <Text className="m-0 text-2xl font-bold text-black">{newBalance} Credits</Text>
                    {expiryDate && (
                        <Text className="m-0 text-xs text-red-500 mt-2 font-semibold">Expires on {expiryDate}</Text>
                    )}
                </div>
            </Section>

            <Section className="text-center mb-10">
                <Button
                    href={`${baseUrl}/dashboard`}
                    className="bg-[#e8ff47] text-black px-8 py-4 rounded-xl font-bold text-sm no-underline inline-block"
                >
                    Start Generating →
                </Button>
            </Section>
        </EmailLayout>
    );
};

export default FreeCreditsEmail;
