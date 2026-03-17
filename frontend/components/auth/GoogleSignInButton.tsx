'use client';

import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GoogleSignInButtonProps {
    redirectTo?: string;
    className?: string;
    variant?: 'default' | 'outline';
}

export function GoogleSignInButton({
    redirectTo = '/',
    className,
    variant = 'default'
}: GoogleSignInButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL;
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback?next=${redirectTo}`,
            },
        });
        // Note: page will redirect, so no need to setIsLoading(false)
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={cn(
                "w-full h-11 flex items-center justify-center gap-3 rounded-xl font-medium text-sm transition-all disabled:opacity-60 shadow-sm group",
                variant === 'default' ? "bg-white text-black hover:bg-gray-50 border border-border" : "bg-transparent border border-white/10 text-white hover:bg-white/5",
                className
            )}
        >
            {isLoading ? (
                <Loader2 size={16} className="animate-spin text-gray-400" />
            ) : (
                <div className="group-hover:scale-110 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                            fill="#4285F4"
                        />
                        <path
                            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                            fill="#34A853"
                        />
                        <path
                            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                            fill="#EA4335"
                        />
                    </svg>
                </div>
            )}
            <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>
    );


}
