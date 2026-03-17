import {
    Heading,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './BaseLayout';

interface CreditPurchaseReceiptEmailProps {
    amount?: string;
    credits?: number;
    receiptId?: string;
    date?: string;
}

export const CreditPurchaseReceiptEmail = ({
    amount = '$29.00',
    credits = 100,
    receiptId = 'REC-12345',
    date = 'March 17, 2026',
}: CreditPurchaseReceiptEmailProps) => {
    return (
        <BaseLayout previewText="Your Recuvix credit purchase receipt.">
            <Section>
                <Heading className="text-white text-2xl font-bold mb-4">
                    Receipt for your purchase
                </Heading>
                <Text className="text-neutral-400 text-base leading-7">
                    Thanks for fueling your blog engine! Your purchase was successful.
                </Text>

                <Section className="bg-white/5 rounded-xl p-6 mt-6">
                    <table width="100%">
                        <tr>
                            <td className="text-neutral-400 text-sm py-1">Item</td>
                            <td className="text-white text-sm text-right font-medium py-1">{credits} AI Credits</td>
                        </tr>
                        <tr>
                            <td className="text-neutral-400 text-sm py-1">Receipt ID</td>
                            <td className="text-white text-sm text-right font-medium py-1">{receiptId}</td>
                        </tr>
                        <tr>
                            <td className="text-neutral-400 text-sm py-1">Date</td>
                            <td className="text-white text-sm text-right font-medium py-1">{date}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}><Hr className="border-white/10 my-3" /></td>
                        </tr>
                        <tr>
                            <td className="text-white font-bold py-1">Total</td>
                            <td className="text-accent font-bold text-right py-1">{amount}</td>
                        </tr>
                    </table>
                </Section>

                <Text className="text-neutral-400 text-sm leading-6 mt-8">
                    The credits have been added to your workspace and are ready for use.
                </Text>
            </Section>
        </BaseLayout>
    );
};

export default CreditPurchaseReceiptEmail;
