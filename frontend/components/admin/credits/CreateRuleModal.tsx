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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Settings2, Loader2, Info } from 'lucide-react';
import { creditRuleSchema } from '@/lib/validators/adminCreditsSchemas';

interface CreateRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (rule: any) => void;
}

interface FormData {
    name: string;
    triggerEvent: string;
    creditsAmount: number;
    creditsExpireDays: number;
    isActive: boolean;
    conditionCountry: string;
    conditionMinBlogs: number;
    maxGrantsPerUser: number;
}

export const CreateRuleModal = ({ isOpen, onClose, onSuccess }: CreateRuleModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        triggerEvent: 'signup',
        creditsAmount: 5,
        creditsExpireDays: 30,
        isActive: true,
        conditionCountry: '',
        conditionMinBlogs: 0,
        maxGrantsPerUser: 1
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/credit-rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    trigger_event: formData.triggerEvent,
                    credits_amount: formData.creditsAmount,
                    credits_expire_days: formData.creditsExpireDays,
                    is_active: formData.isActive,
                    condition_country: formData.conditionCountry || null,
                    condition_min_blogs: formData.conditionMinBlogs || 0,
                    max_grants_per_user: formData.maxGrantsPerUser
                })
            });

            const data = await response.json();
            if (data.success) {
                onSuccess(data.rule);
                onClose();
            } else {
                alert(data.error || 'Failed to create rule');
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
            <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-accent" />
                        Create Auto-Credit Rule
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Rule Name</Label>
                            <Input
                                placeholder="e.g. Welcome Bonus (India Only)"
                                className="bg-zinc-950 border-zinc-900"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Trigger Event</Label>
                                <Select value={formData.triggerEvent ?? ''} onValueChange={(val: string | null) => setFormData({ ...formData, triggerEvent: val ?? '' })}>
                                    <SelectTrigger className="bg-zinc-950 border-zinc-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-950 border-zinc-900 text-white text-xs">
                                        <SelectItem value="signup">On User Signup</SelectItem>
                                        <SelectItem value="purchase">On Any Purchase</SelectItem>
                                        <SelectItem value="manual">Manual Execution Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Amount (Credits)</Label>
                                <Input
                                    type="number"
                                    className="bg-zinc-950 border-zinc-900"
                                    value={formData.creditsAmount}
                                    onChange={(e) => setFormData({ ...formData, creditsAmount: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Expiry (Days)</Label>
                                <Input
                                    type="number"
                                    className="bg-zinc-950 border-zinc-900"
                                    value={formData.creditsExpireDays}
                                    onChange={(e) => setFormData({ ...formData, creditsExpireDays: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Max Per User</Label>
                                <Input
                                    type="number"
                                    className="bg-zinc-950 border-zinc-900"
                                    value={formData.maxGrantsPerUser}
                                    onChange={(e) => setFormData({ ...formData, maxGrantsPerUser: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-900">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            Conditions (Optional)
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Target Country</Label>
                                <Input
                                    placeholder="e.g. India"
                                    className="bg-zinc-950 border-zinc-900"
                                    value={formData.conditionCountry || ""}
                                    onChange={(e) => setFormData({ ...formData, conditionCountry: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Min Blogs Generated</Label>
                                <Input
                                    type="number"
                                    className="bg-zinc-950 border-zinc-900"
                                    value={formData.conditionMinBlogs}
                                    onChange={(e) => setFormData({ ...formData, conditionMinBlogs: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                        <div className="space-y-0.5">
                            <div className="text-sm font-bold text-white">Activate Rule</div>
                            <div className="text-[10px] text-zinc-400">Rule will start applying to new triggers immediately.</div>
                        </div>
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button
                        className="bg-accent hover:bg-accent/90 text-black font-bold h-10 px-8"
                        onClick={handleSubmit}
                        disabled={loading || !formData.name}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Create Rule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
