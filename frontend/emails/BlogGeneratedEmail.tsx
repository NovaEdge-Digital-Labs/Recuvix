import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './BaseLayout';

interface BlogGeneratedEmailProps {
    blogTitle?: string;
    blogLink?: string;
}

export const BlogGeneratedEmail = ({
    blogTitle = 'AI SEO Masterclass',
    blogLink = 'https://recuvix.com/dashboard/blogs',
}: BlogGeneratedEmailProps) => {
    return (
        <BaseLayout previewText="Your AI blog is ready!">
            <Section>
                <Heading className="text-white text-2xl font-bold mb-4">
                    Blog Generated Successfully
                </Heading>
                <Text className="text-neutral-400 text-base leading-7">
                    Your new blog post <span className="text-white font-medium">"{blogTitle}"</span> has
                    been generated and is ready for review.
                </Text>

                <Section className="mt-8 text-center">
                    <Button
                        className="bg-accent text-black font-bold py-3 px-6 rounded-xl"
                        href={blogLink}
                    >
                        View Blog Post
                    </Button>
                </Section>

                <Text className="text-neutral-400 text-sm leading-6 mt-8">
                    You can now edit, optimize, or publish it directly from your dashboard.
                </Text>
            </Section>
        </BaseLayout>
    );
};

export default BlogGeneratedEmail;
