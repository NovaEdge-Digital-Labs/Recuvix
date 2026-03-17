'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PasswordStrengthBar } from './PasswordStrengthBar';

export function ResetPasswordForm() {
    const router = useRouter();
    const supabase = createClient();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        setIsLoading(false);

        if (error) {
            setError(error.message || 'Failed to update password. Please try again.');
            return;
        }

        router.push('/');
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
                <p className="text-muted-foreground mt-1 text-sm">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Min. 8 characters"
                            className="w-full h-11 px-4 pr-11 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#e8ff47] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <PasswordStrengthBar password={password} />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Repeat your password"
                        className="w-full h-11 px-4 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#e8ff47] transition-colors"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#e8ff47] text-black font-bold rounded-xl hover:bg-[#d4e840] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Update Password'}
                </button>
            </form>
        </div>
    );
}
