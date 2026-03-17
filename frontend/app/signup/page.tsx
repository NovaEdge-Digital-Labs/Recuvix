import { SignupForm } from '@/components/auth/SignupForm';
import { AuthCard } from '@/components/auth/AuthCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Account — Recuvix',
    description: 'Join Recuvix and start generating AI-powered SEO blogs with your own API keys.',
};

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <AuthCard>
                <SignupForm />
            </AuthCard>
        </main>
    );
}
