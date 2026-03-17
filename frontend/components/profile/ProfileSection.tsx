'use client';

import { useState } from 'react';
import { User, Camera, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { profilesService } from '@/lib/db/profilesService';
import { toast } from 'sonner';
import Image from 'next/image';

export function ProfileSection() {
    const { user, profile, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const email = user?.email || '';

    const handleSave = async () => {
        if (!user) return;

        // Optimization: Don't save if nothing changed
        if (fullName === profile?.full_name) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            return;
        }

        setIsSaving(true);
        try {
            const { success, error } = await profilesService.updateProfile(user.id, { full_name: fullName });

            if (error) {
                if (error.message === 'session_lock_timeout') {
                    toast.error('Update request timed out. This can happen if the database is busy or your connection is slow. Please try again.');
                } else if (error.code === '42501') {
                    toast.error('Permission denied: You do not have permission to update this profile.');
                } else {
                    toast.error(`Failed to save profile: ${error.message || 'Unknown error'}`);
                }
                setIsSaving(false);
                return;
            }

            if (!success) {
                throw new Error("Update failed unexpectedly");
            }

            // Don't await refreshProfile to reduce perceived save latency
            refreshProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err: any) {
            toast.error(err.message || 'An unexpected error occurred while saving.');
        }
        setIsSaving(false);
    };

    return (
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            <div className="p-6">
                <h2 className="font-bold text-foreground text-lg">Profile</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Manage your personal details</p>
            </div>
            <div className="p-6 flex items-start gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
                        {profile?.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt={fullName || email}
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#e8ff47] flex items-center justify-center">
                                <User size={28} className="text-black" />
                            </div>
                        )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Camera size={12} />
                    </button>
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your name"
                            className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#e8ff47] transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support.</p>
                    </div>
                </div>
            </div>
            <div className="p-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-9 px-5 text-sm font-bold bg-[#e8ff47] text-black rounded-xl hover:bg-[#d4e840] transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                    {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : saved ? <><CheckCircle size={14} /> Saved!</> : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
