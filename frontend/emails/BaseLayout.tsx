import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface BaseLayoutProps {
    previewText: string;
    children: React.ReactNode;
}

export const BaseLayout = ({ previewText, children }: BaseLayoutProps) => {
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
                                dark: '#050505',
                                card: '#0a0a0a',
                            },
                        },
                    },
                }}
            >
                <Body className="bg-dark font-sans py-10">
                    <Container className="bg-card border border-white/5 rounded-2xl mx-auto p-8 max-w-[580px]">
                        {/* Logo */}
                        <Section className="mb-8">
                            <table align="center" border={0} cellPadding="0" cellSpacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: '#e8ff47',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            color: '#000',
                                            fontSize: '20px'
                                        }}>
                                            R
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </Section>

                        {children}

                        {/* Footer */}
                        <Hr className="border-white/5 my-8" />
                        <Section className="text-center">
                            <Text className="text-neutral-500 text-xs leading-5">
                                © 2026 Recuvix Inc. • One AI Way, San Francisco, CA 94103
                            </Text>
                            <div className="mt-4 flex justify-center gap-4">
                                <Link href="https://recuvix.com" className="text-neutral-400 text-xs underline">Website</Link>
                                <Link href="https://twitter.com/recuvix" className="text-neutral-400 text-xs underline">Twitter</Link>
                                <Link href="https://recuvix.com/dashboard" className="text-neutral-400 text-xs underline">Dashboard</Link>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
