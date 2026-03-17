import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AuthCard } from '@/components/auth/AuthCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password — Recuvix',
    description: 'Recover your Recuvix account through email verification.',
};

export default function ForgotPasswordPage() {
    return (
        <AuthCard>
            <ForgotPasswordForm />
        </AuthCard>
    );
}
