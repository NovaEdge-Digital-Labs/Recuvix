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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Gift, Loader2 } from 'lucide-react';

interface QuickGrantModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (result: any) => void;
}

export const QuickGrantModal = ({ user, isOpen, onClose, onSuccess }: QuickGrantModalProps) => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(10);
    const [reason, setReason] = useState('Manual bonus from admin');
    const [expiresInDays, setExpiresInDays] = useState('0'); // 0 = Never

    const handleGrant = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await fetch('/api/admin/credits/grant-single', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    credits: amount,
                    reason: reason,
                    expiresInDays: expiresInDays === '0' ? null : parseInt(expiresInDays)
                })
            });

            const data = await response.json();
            if (data.success) {
                onSuccess(data);
                onClose();
            } else {
                alert(data.error || 'Failed to grant credits');
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
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-amber-500" />
                        Give Free Credits
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black font-bold uppercase">
                            {user?.fullName?.[0] || user?.email?.[0] || 'U'}
                        </div>
                        <div>
                            <div className="text-sm font-bold">{user?.fullName || 'User'}</div>
                            <div className="text-xs text-zinc-500">{user?.email}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-zinc-400">Credit Amount</Label>
                        <div className="relative">
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(parseInt(e.target.value))}
                                className="bg-zinc-950 border-zinc-900 focus:ring-accent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-600">CREDITS</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-zinc-400">Reason (User will see this)</Label>
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="bg-zinc-950 border-zinc-900 focus:ring-accent"
                            placeholder="e.g. VIP appreciation bonus"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-400">Expiry</Label>
                        <Select value={expiresInDays} onValueChange={(val: string | null) => setExpiresInDays(val ?? '0')}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-900">
                                <SelectValue placeholder="Select expiry" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                                <SelectItem value="0">Never Expires</SelectItem>
                                <SelectItem value="7">7 Days</SelectItem>
                                <SelectItem value="30">30 Days</SelectItem>
                                <SelectItem value="90">90 Days</SelectItem>
                                <SelectItem value="365">1 Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button
                        onClick={handleGrant}
                        disabled={loading || amount < 1 || !reason}
                        className="bg-accent hover:bg-accent/90 text-black font-bold"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Give {amount} Credits
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
