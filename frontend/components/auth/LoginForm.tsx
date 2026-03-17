'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AuthHeader } from './AuthHeader';
import { PasswordInput } from './PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResend, setShowResend] = useState(false);
    const [resendSent, setResendSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setShowResend(false);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setIsLoading(false);
            if (signInError.message.includes('Email not confirmed')) {
                setError('Email not confirmed. Please check your inbox.');
                setShowResend(true);
            } else if (signInError.message.includes('Too many requests') || signInError.message.includes('rate limit')) {
                setError('Too many sign-in attempts. Please wait a few minutes and try again.');
            } else {
                setError('Invalid email or password. Check your credentials.');
            }
            return;
        }

        router.push('/');
        router.refresh();
    };

    const handleResend = async () => {
        const { error: resendErr } = await supabase.auth.resend({ type: 'signup', email });
        if (!resendErr) setResendSent(true);
    };

    return (
        <div className="w-full">
            <AuthHeader title="Welcome back." />

            <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" title="Password" className="text-white/60 font-outfit">Password</Label>
                    </div>
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus-visible:ring-accent"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex gap-2 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <div>
                            <p>{error}</p>
                            {showResend && (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-xs underline mt-2 hover:text-red-300 transition-colors"
                                >
                                    {resendSent ? 'Confirmation email sent!' : 'Resend confirmation email'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all text-base shadow-[0_8px_30px_rgb(232,255,71,0.1)] hover:shadow-[0_8px_40px_rgb(232,255,71,0.2)]"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </div>

                <div className="text-center">
                    <Link
                        href="/forgot-password"
                        title="Forgot password?"
                        className="text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                        <span className="bg-[#0d0d0d] px-4 text-white/20">or continue with</span>
                    </div>
                </div>

                <GoogleSignInButton variant="outline" className="w-full h-12 bg-transparent border-white/10 text-white hover:bg-white/5 font-bold rounded-xl" />

                <div className="pt-6 text-center">
                    <p className="text-sm text-white/40">
                        No account?{' '}
                        <Link href="/signup" title="Sign up" className="text-accent font-bold hover:text-accent/80 transition-colors">
                            Start free →
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
