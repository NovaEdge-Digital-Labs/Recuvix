'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { validateSlug, generateSlug } from '@/lib/wl/slugValidator';
import { toast } from 'sonner';

interface CreateTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateTenantModal({ isOpen, onClose, onSuccess }: CreateTenantModalProps) {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (!slug || slug === generateSlug(name)) {
            setSlug(generateSlug(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateSlug(slug)) {
            setError('Invalid slug format. Use lowercase letters, numbers, and hyphens.');
            return;
        }

        setIsLoading(true);

        try {
            // Get admin key from cookie
            const adminKey = document.cookie
                .split('; ')
                .find(row => row.startsWith('admin_key='))
                ?.split('=')[1];

            const response = await fetch('/api/admin/wl/tenants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminKey || ''}`
                },
                body: JSON.stringify({
                    name,
                    slug,
                    ownerEmail,
                    customDomain: customDomain || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create tenant');
                setIsLoading(false);
                return;
            }

            toast.success('Tenant created successfully');
            onSuccess();
            onClose();
            // Reset form
            setName('');
            setSlug('');
            setOwnerEmail('');
            setCustomDomain('');
        } catch (err: any) {
            console.error('Create Tenant Error:', err);
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-900 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New White Label Tenant</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Onboard a new partner with their own branded instance.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400 text-xs font-bold uppercase">Business Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Acme Content Studio"
                                value={name}
                                onChange={handleNameChange}
                                required
                                className="bg-zinc-900 border-zinc-800 focus:border-accent transition-colors h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-zinc-400 text-xs font-bold uppercase">Slug (Subdomain)</Label>
                            <div className="relative">
                                <Input
                                    id="slug"
                                    placeholder="acme-studio"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                                    required
                                    className="bg-zinc-900 border-zinc-800 focus:border-accent transition-colors h-11 pr-32"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-medium pointer-events-none">
                                    .recuvix.in
                                </div>
                            </div>
                            <p className="text-[10px] text-zinc-600">This will be the default access URL.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ownerEmail" className="text-zinc-400 text-xs font-bold uppercase">Owner Email</Label>
                            <Input
                                id="ownerEmail"
                                type="email"
                                placeholder="owner@acme.com"
                                value={ownerEmail}
                                onChange={(e) => setOwnerEmail(e.target.value)}
                                required
                                className="bg-zinc-900 border-zinc-800 focus:border-accent transition-colors h-11"
                            />
                            <p className="text-[10px] text-zinc-600">The user must already have a Recuvix account.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customDomain" className="text-zinc-400 text-xs font-bold uppercase">Custom Domain (Optional)</Label>
                            <Input
                                id="customDomain"
                                placeholder="blog.acme.com"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                                className="bg-zinc-900 border-zinc-800 focus:border-accent transition-colors h-11"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs text-red-400">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <DialogFooter className="pt-4 border-t border-zinc-900">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="hover:bg-zinc-900 text-zinc-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-accent text-black font-bold hover:opacity-90 min-w-[120px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Tenant'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
