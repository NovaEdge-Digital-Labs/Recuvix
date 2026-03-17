import {
    Button,
    Heading,
    Section,
    Text,
    Hr,
    Link,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface CreditPurchaseEmailProps {
    packName: string;
    credits: number;
    amount: string;
    newBalance: number;
    invoiceUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuvix.in';

export const CreditPurchaseEmail = ({
    packName = 'Starter Pack',
    credits = 10,
    amount = '₹999',
    newBalance = 10,
    invoiceUrl = '#',
}: CreditPurchaseEmailProps) => {
    return (
        <EmailLayout previewText={`Payment confirmed — ${credits} credits added`}>
            <Heading className="text-2xl font-bold text-gray-900 mb-6">
                Payment Confirmed
            </Heading>

            <Text className="text-gray-700 leading-7 mb-8">
                Thank you for your purchase! Your credits have been added to your account and are ready to use.
            </Text>

            <Section className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-100">
                <div className="flex justify-between mb-4">
                    <Text className="m-0 text-gray-500 font-medium">Item</Text>
                    <Text className="m-0 text-gray-900 font-bold">{packName}</Text>
                </div>
                <div className="flex justify-between mb-4">
                    <Text className="m-0 text-gray-500 font-medium">Credits Added</Text>
                    <Text className="m-0 text-gray-900 font-bold">+{credits}</Text>
                </div>
                <div className="flex justify-between mb-6">
                    <Text className="m-0 text-gray-500 font-medium">Amount Paid</Text>
                    <Text className="m-0 text-gray-900 font-bold">{amount}</Text>
                </div>

                <Hr className="border-gray-200 mb-6" />

                <div className="flex justify-between items-center text-center">
                    <div className="w-full">
                        <Text className="m-0 text-xs text-gray-400 uppercase tracking-widest mb-1">New Credit Balance</Text>
                        <Text className="m-0 text-4xl font-extrabold text-black">{newBalance}</Text>
                    </div>
                </div>
            </Section>

            <Section className="text-center mb-10">
                <Button
                    href={`${baseUrl}/dashboard`}
                    className="bg-[#e8ff47] text-black px-8 py-4 rounded-xl font-bold text-sm no-underline inline-block mb-4"
                >
                    Start Generating →
                </Button>
                <div className="mt-4">
                    <Link href={invoiceUrl} className="text-sm text-gray-500 underline">
                        Download GST Invoice
                    </Link>
                </div>
            </Section>
        </EmailLayout>
    );
};

export default CreditPurchaseEmail;
