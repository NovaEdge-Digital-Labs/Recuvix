"use client";

import React, { useState } from 'react';
import {
    Users,
    Search,
    MapPin,
    Zap,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Eye,
    Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export const GrantSegment = ({ onGrantComplete }: { onGrantComplete?: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [matchedCount, setMatchedCount] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        country: '',
        minBlogs: '',
        joinedAfter: '',
        byokOnly: 'all',
        credits: 10,
        reason: '',
        expiresInDays: '30'
    });

    const handlePreview = async () => {
        setPreviewing(true);
        try {
            const sp = new URLSearchParams();
            if (formData.country) sp.set('country', formData.country);
            if (formData.minBlogs) sp.set('minBlogs', formData.minBlogs);
            if (formData.joinedAfter) sp.set('joinedAfter', formData.joinedAfter);
            if (formData.byokOnly !== 'all') sp.set('managedMode', formData.byokOnly === 'byok' ? 'false' : 'true');

            const response = await fetch(`/api/admin/users?${sp.toString()}&limit=1`);
            const data = await response.json();
            setMatchedCount(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setPreviewing(false);
        }
    };

    const handleExecute = async () => {
        if (!formData.reason || formData.credits < 1) return;
        setLoading(true);
        try {
            const response = await fetch('/api/admin/credits/grant-bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filters: {
                        country: formData.country || null,
                        minBlogs: formData.minBlogs ? parseInt(formData.minBlogs) : null,
                        joinedAfter: formData.joinedAfter || null,
                        managedMode: formData.byokOnly === 'all' ? null : (formData.byokOnly === 'managed')
                    },
                    credits: formData.credits,
                    reason: formData.reason,
                    expiresInDays: formData.expiresInDays === '0' ? null : parseInt(formData.expiresInDays),
                    dryRun: false
                })
            });

            const data = await response.json();
            if (data.success) {
                alert(`Successfully granted credits to ${data.processedCount} users!`);
                if (onGrantComplete) onGrantComplete();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-black">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Targeted Bulk Grant</h2>
                    <p className="text-zinc-500 text-sm">Define a segment and distribute credits to all matching users.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Segment Conditions */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-3 h-3" />
                        Segment Conditions
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs">Country</Label>
                            <Input
                                placeholder="e.g. India (leave blank for all)"
                                className="bg-zinc-900 border-zinc-800"
                                value={formData.country || ""}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs">Min Blogs Generated</Label>
                            <Input
                                type="number"
                                className="bg-zinc-900 border-zinc-800"
                                value={formData.minBlogs}
                                onChange={(e) => setFormData({ ...formData, minBlogs: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs">Management Mode</Label>
                            <Select value={formData.byokOnly} onValueChange={(val: string | null) => setFormData({ ...formData, byokOnly: val ?? 'all' })}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                                    <SelectItem value="all">Everyone</SelectItem>
                                    <SelectItem value="managed">Managed Users Only</SelectItem>
                                    <SelectItem value="byok">BYOK Users Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                        onClick={handlePreview}
                        disabled={previewing}
                    >
                        {previewing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        Preview Segment Size
                    </Button>

                    {matchedCount !== null && (
                        <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <div className="text-sm font-medium text-accent">Matched Users:</div>
                            <div className="text-lg font-bold text-white">{matchedCount.toLocaleString()}</div>
                        </div>
                    )}
                </div>

                {/* Right Side: Grant Details */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        Grant Details
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs">Amount per User</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    className="bg-zinc-900 border-zinc-800"
                                    value={formData.credits}
                                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600">CREDITS</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs">Grant Reason (Internal & Email)</Label>
                            <Input
                                placeholder="e.g. Festival Season Bonus"
                                className="bg-zinc-900 border-zinc-800"
                                value={formData.reason || ""}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-xs">Expiry</Label>
                            <Select value={formData.expiresInDays} onValueChange={(val: string | null) => setFormData({ ...formData, expiresInDays: val ?? '30' })}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                                    <SelectItem value="0">Never Expires</SelectItem>
                                    <SelectItem value="7">7 Days</SelectItem>
                                    <SelectItem value="30">30 Days</SelectItem>
                                    <SelectItem value="90">90 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Warning</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            This action will immediately distribute <strong>{formData.credits} credits</strong> to all
                            matched users. This cannot be easily undone. Each user will receive an email
                            notification.
                        </p>
                    </div>

                    <Button
                        className="w-full bg-accent hover:bg-accent/90 text-black font-black h-12 text-lg shadow-xl shadow-accent/10"
                        disabled={loading || !formData.reason || !matchedCount || matchedCount === 0}
                        onClick={handleExecute}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                        Execute Bulk Grant
                    </Button>
                </div>
            </div>
        </div>
    );
};
