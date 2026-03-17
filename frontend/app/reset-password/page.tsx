import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password — Recuvix',
    description: 'Set a new password for your Recuvix account.',
};

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl">
                <ResetPasswordForm />
            </div>
        </main>
    );
}
