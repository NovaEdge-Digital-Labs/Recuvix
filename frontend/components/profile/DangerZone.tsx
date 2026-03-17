'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function DangerZone() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const requiredText = 'delete my account';
    const canDelete = confirmText.toLowerCase() === requiredText;

    const handleDeleteAccount = async () => {
        if (!canDelete || !user) return;
        setIsDeleting(true);

        // We call a server-side API route for this since it requires admin privileges
        try {
            const res = await fetch('/api/account/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error('Failed');
            await signOut();
            router.push('/signup?deleted=1');
        } catch {
            toast.error('Failed to delete account. Contact support@recuvix.in');
        }
        setIsDeleting(false);
    };

    const handleExportData = async () => {
        if (!user) return;
        toast.info('Preparing your data export...');
        const supabase = createClient();
        const { data } = await supabase.from('blogs').select('*').eq('user_id', user.id);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recuvix-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export downloaded!');
    };

    return (
        <div className="bg-card border border-red-500/20 rounded-2xl divide-y divide-border">
            <div className="p-6 flex items-center gap-3">
                <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
                <div>
                    <h2 className="font-bold text-foreground text-lg">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Account actions — proceed with caution</p>
                </div>
            </div>

            <div className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-foreground">Sign out of your account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">End your current session</p>
                </div>
                <button
                    onClick={async () => {
                        try {
                            await signOut();
                        } finally {
                            window.location.href = '/login';
                        }
                    }}
                    className="h-9 px-4 text-sm border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors font-medium"
                >
                    Sign Out
                </button>
            </div>

            <div className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-foreground">Export all data</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Download a JSON copy of all your blogs</p>
                </div>
                <button
                    onClick={handleExportData}
                    className="h-9 px-4 text-sm border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                    Export JSON
                </button>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <p className="text-sm font-medium text-red-400">Delete account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Permanently deletes your account and all data. This cannot be undone.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                        Type <span className="text-foreground font-mono">{requiredText}</span> to confirm
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={requiredText}
                        className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 transition-colors font-mono"
                    />
                </div>
                <button
                    onClick={handleDeleteAccount}
                    disabled={!canDelete || isDeleting}
                    className="h-10 px-5 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isDeleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : 'Delete My Account'}
                </button>
            </div>
        </div>
    );
}
