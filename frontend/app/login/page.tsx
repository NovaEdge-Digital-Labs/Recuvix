import { LoginForm } from '@/components/auth/LoginForm';
import { AuthCard } from '@/components/auth/AuthCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In — Recuvix',
    description: 'Sign in to your Recuvix account to access your AI-generated blog library.',
};

export default function LoginPage() {
    return (
        <AuthCard>
            <LoginForm />
        </AuthCard>
    );
}

