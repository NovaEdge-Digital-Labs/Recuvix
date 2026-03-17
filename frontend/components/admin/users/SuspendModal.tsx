import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Loader2 } from 'lucide-react';

interface SuspendModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (result: any) => void;
}

export const SuspendModal = ({ user, isOpen, onClose, onSuccess }: SuspendModalProps) => {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');

    const handleSuspend = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isSuspended: true,
                    suspendedReason: reason
                })
            });

            const data = await response.json();
            if (data.success) {
                onSuccess(data);
                onClose();
            } else {
                alert(data.error || 'Failed to suspend user');
            }
        } catch (err) {
            console.error(err);
            alert('Internal error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500">
                        <ShieldAlert className="w-5 h-5" />
                        Suspend Account
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-zinc-400 text-sm">
                        Are you sure you want to suspend <strong>{user?.email}</strong>?
                        They will lose access to the platform immediately.
                    </p>

                    <div className="space-y-2">
                        <Label htmlFor="suspend-reason" className="text-zinc-400">Reason for Suspension</Label>
                        <Input
                            id="suspend-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="bg-zinc-950 border-zinc-900 focus:ring-red-500"
                            placeholder="e.g. Terms of service violation, payment failure"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button
                        onClick={handleSuspend}
                        disabled={loading || !reason}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Suspend Account
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
