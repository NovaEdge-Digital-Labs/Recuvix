'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AuthHeader } from './AuthHeader';
import { PasswordInput } from './PasswordInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignupForm() {
    const supabase = createClient();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(false);

    const passwordStrength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        // Map 0-4 score to 1-4 strength (since 0 is reserved for empty)
        return Math.max(1, score) as 1 | 2 | 3 | 4;
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setIsLoading(true);

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName || null },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        setIsLoading(false);

        if (signUpError) {
            if (signUpError.message.includes('already registered')) {
                setError('This email is already registered. Sign in instead.');
            } else {
                setError(signUpError.message);
            }
            return;
        }

        setSuccess(true);
    };

    const handleResend = async () => {
        setResendCooldown(true);
        const { error: resendErr } = await supabase.auth.resend({ type: 'signup', email });
        if (!resendErr) {
            setTimeout(() => setResendCooldown(false), 30000);
        } else {
            setResendCooldown(false);
        }
    };

    if (success) {
        return (
            <div className="w-full text-center py-4">
                <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={36} className="text-accent" />
                </div>
                <h2 className="text-3xl font-syne font-bold text-white mb-4 tracking-tight">Check your email.</h2>
                <div className="space-y-4 text-white/60 font-outfit text-base leading-relaxed mb-10">
                    <p>
                        We sent a confirmation link to<br />
                        <span className="text-white font-bold">{email}</span>
                    </p>
                    <p>Click it to activate your account and start generating.</p>
                </div>

                <div className="space-y-6">
                    <Button
                        onClick={handleResend}
                        disabled={resendCooldown}
                        variant="outline"
                        className="w-full h-12 border-white/10 text-white hover:bg-white/5 disabled:opacity-40 rounded-xl"
                    >
                        {resendCooldown ? 'Wait 30s to resend' : 'Resend confirmation email'}
                    </Button>

                    <p className="text-sm">
                        Already confirmed?{' '}
                        <Link href="/login" className="text-accent font-bold hover:underline">
                            Sign in →
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <AuthHeader title="Create your account." />

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white/60 font-outfit">Full Name</Label>
                    <Input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus-visible:ring-accent"
                    />
                </div>

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
                    <Label htmlFor="password" title="Password" className="text-white/60 font-outfit">Password</Label>
                    <PasswordInput
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus-visible:ring-accent"
                    />
                    <PasswordStrengthIndicator strength={passwordStrength as any} />
                </div>

                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex gap-2 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
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
                            'Create Account'
                        )}
                    </Button>
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

                <div className="pt-6 space-y-6 text-center">
                    <p className="text-[11px] text-white/30 leading-relaxed px-4">
                        By signing up you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-white/50">Terms</Link> and{' '}
                        <Link href="/privacy" className="underline hover:text-white/50">Privacy Policy</Link>
                    </p>

                    <p className="text-sm text-white/40">
                        Already have an account?{' '}
                        <Link href="/login" title="Sign in" className="text-accent font-bold hover:text-accent/80 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
