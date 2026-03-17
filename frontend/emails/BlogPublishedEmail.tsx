import {
    Button,
    Heading,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface BlogPublishedEmailProps {
    title: string;
    wordCount: number;
    blogUrl: string;
}

export const BlogPublishedEmail = ({
    title = 'My New Awesome Blog',
    wordCount = 1200,
    blogUrl = '#',
}: BlogPublishedEmailProps) => {
    return (
        <EmailLayout previewText={`Your blog is ready: ${title}`}>
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Your Content is Live! 🚀
            </Heading>

            <Section className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-100">
                <Text className="m-0 text-xl font-bold text-black mb-2 leading-tight">
                    {title}
                </Text>
                <Text className="m-0 text-sm text-gray-500 font-medium italic">
                    Approx. {wordCount} words
                </Text>

                <Hr className="my-6 border-gray-200" />

                <Text className="text-gray-600 text-sm leading-6 m-0">
                    Your humanized, SEO-optimized blog post has been generated and is ready for review.
                </Text>
            </Section>

            <Section className="text-center mb-10">
                <Button
                    href={blogUrl}
                    className="bg-[#e8ff47] text-black px-8 py-4 rounded-xl font-bold text-sm no-underline inline-block"
                >
                    View Blog →
                </Button>
            </Section>
        </EmailLayout>
    );
};

export default BlogPublishedEmail;
