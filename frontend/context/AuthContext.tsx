'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type UserProfile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    plan: 'free' | 'pro' | 'agency';
    preferences: Record<string, unknown>;
    blogs_generated_count: number;
    total_words_generated: number;
    active_workspace_id: string | null;
    referral_code: string | null;
    total_referrals: number;
    total_referral_credits_earned: number;
    referred_by_user_id: string | null;
    total_blogs_generated: number;
    onboarding_completed: boolean;
    onboarding_step: number;
    primary_country: string | null;
    default_tone: string | null;
    typical_word_count: number | null;
    primary_niche: string | null;
    created_at: string;
};

type AuthContextType = {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (data) setProfile(data as unknown as UserProfile);
        } catch (e) {
            console.error('Failed to fetch profile:', e);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            if (data.session?.user) {
                fetchProfile(data.session.user.id);
            }
            setIsLoading(false);
        }).catch((err) => {
            console.error('Failed to get session:', err);
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signOut = async () => {
        try {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Sign out timeout')), 800)
            );
            await Promise.race([supabase.auth.signOut(), timeoutPromise]);
        } catch (err) {
            console.error('Supabase sign out error or timeout:', err);
        }

        try {
            // Force clear Supabase cookies if the network request hung
            document.cookie.split(';').forEach(c => {
                const cookieName = c.split('=')[0].trim();
                if (cookieName.startsWith('sb-')) {
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
            });
        } catch (err) {
            console.error('Failed to clear cookies:', err);
        }

        // Clear all Recuvix localStorage data on sign out
        try {
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith('recuvix_') || key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (err) {
            // LocalStorage might not be accessible
        }
        setProfile(null);
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.id);
    };

    return (
        <AuthContext.Provider
            value={{ user, session, profile, isLoading, signOut, refreshProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
