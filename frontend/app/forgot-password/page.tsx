import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AuthCard } from '@/components/auth/AuthCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password — Recuvix',
    description: 'Recover your Recuvix account through email verification.',
};

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <AuthCard>
                <ForgotPasswordForm />
            </AuthCard>
        </main>
    );
}
