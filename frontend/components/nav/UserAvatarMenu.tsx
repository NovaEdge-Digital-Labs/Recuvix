'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, BarChart2, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOptimizedImageUrl } from '@/lib/utils/cloudinary';

function getInitials(name: string | null, email: string): string {
    if (name && name.trim().length > 0) {
        const parts = name.trim().split(' ');
        return parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    }
    return email && email.length > 0 ? email[0].toUpperCase() : '?';
}

function getAvatarColor(email: string): string {
    const safeEmail = email || 'default';
    const colors = [
        '#e8ff47', '#ff6b6b', '#4ecdc4', '#45b7d1',
        '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8',
    ];
    let hash = 0;
    for (let i = 0; i < safeEmail.length; i++) {
        hash = safeEmail.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export function UserAvatarMenu() {
    const { user, profile, signOut } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const email = user.email || '';
    const name = profile?.full_name || user.user_metadata?.full_name || null;
    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null;
    const initials = getInitials(name, email);
    const bgColor = getAvatarColor(email);

    const handleSignOut = async () => {
        setIsOpen(false);
        try {
            await signOut();
        } finally {
            window.location.href = '/login';
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-border hover:border-[#e8ff47] transition-colors focus:outline-none"
                title={name || email}
            >
                {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getOptimizedImageUrl(avatarUrl, 100)} alt={name || email} className="w-full h-full object-cover" />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: bgColor, color: bgColor === '#e8ff47' ? '#000' : '#1a1a1a' }}
                    >
                        {initials}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-10 w-60 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{name || 'Account'}</p>
                        <p className="text-xs text-muted-foreground truncate">{email}</p>
                        {profile && (
                            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-border text-muted-foreground">
                                {profile.plan}
                            </span>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-border/50 transition-colors"
                        >
                            <User size={15} className="text-muted-foreground" />
                            Profile & Settings
                        </Link>
                        <Link
                            href="/profile#stats"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-border/50 transition-colors"
                        >
                            <BarChart2 size={15} className="text-muted-foreground" />
                            Usage Stats
                        </Link>
                        <Link
                            href="/profile#refer"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-border/50 transition-colors"
                        >
                            <Sparkles size={15} className="text-accent" />
                            Refer & Earn
                        </Link>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="py-1">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={15} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
