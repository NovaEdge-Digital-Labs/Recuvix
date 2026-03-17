import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
    previewText: string;
    children: React.ReactNode;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuvix.in';

export const EmailLayout = ({
    previewText,
    children,
}: EmailLayoutProps) => {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                accent: '#e8ff47',
                                background: '#ffffff',
                                header: '#050505',
                                footer: '#050505',
                                text: '#000000',
                                muted: '#666666',
                            },
                        },
                    },
                }}
            >
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto my-10 max-w-[600px] overflow-hidden rounded shadow-sm">
                        {/* Header */}
                        <Section className="bg-header p-8 text-center">
                            <Link href={baseUrl} className="flex items-center justify-center gap-2 no-underline">
                                <div style={{
                                    display: 'inline-block',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    backgroundColor: '#e8ff47',
                                    verticalAlign: 'middle',
                                    marginRight: '12px'
                                }}>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        backgroundColor: '#050505',
                                        borderRadius: '4px',
                                        transform: 'rotate(45deg)',
                                        margin: '8px auto'
                                    }} />
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white m-0 leading-8">
                                    Recuvix
                                </span>
                            </Link>
                        </Section>

                        {/* Content Area */}
                        <Section className="bg-white p-10">
                            {children}
                        </Section>

                        {/* Footer */}
                        <Section className="bg-footer p-10 text-center">
                            <Text className="m-0 text-xs font-semibold uppercase tracking-wider text-accent">
                                Recuvix AI
                            </Text>
                            <Text className="mt-4 text-xs leading-5 text-gray-500">
                                Generate humanized, SEO-optimized blogs in minutes.
                            </Text>
                            <Text className="mt-2 text-xs text-gray-500">
                                123 AI Boulevard, Tech City, IN 560001
                            </Text>
                            <Hr className="my-6 border-gray-800" />
                            <div className="flex justify-center gap-4">
                                <Link href={`${baseUrl}/privacy`} className="text-xs text-gray-400 underline">Privacy Policy</Link>
                                <Link href={`${baseUrl}/terms`} className="text-xs text-gray-400 underline">Terms of Service</Link>
                                <Link href="{{unsubscribe_url}}" className="text-xs text-gray-400 underline">Unsubscribe</Link>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
