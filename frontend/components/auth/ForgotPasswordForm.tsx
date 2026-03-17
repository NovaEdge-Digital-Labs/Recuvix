'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AuthHeader } from './AuthHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordForm() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?next=/app/settings/profile&type=recovery`,
        });

        setIsLoading(false);
        if (resetErr) {
            setError(resetErr.message || 'Something went wrong. Please try again.');
            return;
        }
        setSent(true);
    };

    if (sent) {
        return (
            <div className="w-full text-center py-4">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8 animate-in zoom-in-50 duration-500">
                    <CheckCircle size={36} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-syne font-bold text-white mb-4 tracking-tight">Check your inbox.</h2>
                <div className="space-y-4 text-white/60 font-outfit text-base leading-relaxed mb-10 text-center">
                    <p>
                        We sent a password reset link to<br />
                        <span className="text-white font-bold">{email}</span>
                    </p>
                    <p className="text-sm">
                        Didn&apos;t receive it?{' '}
                        <button
                            onClick={() => setSent(false)}
                            className="text-accent font-bold hover:underline"
                        >
                            Try again →
                        </button>
                    </p>
                </div>

                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-white/40 font-medium hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to sign in
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <AuthHeader title="Reset your password." />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/60 font-outfit">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus-visible:ring-accent"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex gap-2 animate-in fade-in slide-in-from-top-1">
                        <span>{error}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all text-base shadow-[0_8px_30px_rgb(232,255,71,0.1)] hover:shadow-[0_8px_40px_rgb(232,255,71,0.2)]"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        'Send Reset Link'
                    )}
                </Button>

                <div className="text-center pt-2">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}
