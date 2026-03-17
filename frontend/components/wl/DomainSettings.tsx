'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, RefreshCw, CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function DomainSettings() {
    const supabase = createClient();
    const { tenant } = useTenant();
    const [domain, setDomain] = useState(tenant?.custom_domain || '');
    const [verification, setVerification] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (tenant?.id) {
            fetchVerification();
        }
    }, [tenant?.id]);

    const fetchVerification = async () => {
        const { data, error } = await (supabase
            .from('wl_domain_verifications')
            .select('*')
            .eq('tenant_id', tenant?.id as any)
            .single() as any);

        if (data && !error) {
            setVerification(data);
            setDomain(data.domain);
        }
    };

    const handleUpdateDomain = async () => {
        if (!domain) {
            toast.error('Please enter a domain');
            return;
        }

        setIsUpdating(true);
        try {
            // 1. Create/Update verification record
            const txtValue = `recuvix-verification=${Math.random().toString(36).substring(2, 15)}`;

            const { data, error } = await (supabase
                .from('wl_domain_verifications' as any)
                .upsert({
                    tenant_id: tenant?.id,
                    domain,
                    txt_record: txtValue,
                    status: 'pending',
                } as any)
                .select()
                .single() as any);

            if (error) throw error;

            setVerification(data);
            toast.success('Domain updated. Please add the TXT record to your DNS.');
        } catch (error: any) {
            console.error('Update Domain Error:', error);
            toast.error('Failed to update domain');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            const response = await fetch('/api/wl/verify-domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: tenant?.id,
                    domain: verification?.domain
                })
            });

            const result = await response.json();

            if (result.success) {
                if (result.status === 'verified') {
                    toast.success('Domain verified successfully!');
                } else {
                    toast.error('Verification failed. TXT record not found yet.');
                }
                fetchVerification();
            } else {
                toast.error(result.error || 'Verification failed');
            }
        } catch (error) {
            console.error('Verify Error:', error);
            toast.error('An error occurred during verification');
        } finally {
            setIsVerifying(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied to clipboard');
    };

    if (!tenant) return null;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    Custom Domain
                </CardTitle>
                <CardDescription>
                    Connect your own domain to your white-label portal.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            placeholder="e.g. blog.yourdomain.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            disabled={verification?.status === 'verified'}
                        />
                    </div>
                    {verification?.status !== 'verified' && (
                        <Button
                            onClick={handleUpdateDomain}
                            disabled={isUpdating || domain === verification?.domain}
                        >
                            {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                            {verification ? 'Update' : 'Connect'}
                        </Button>
                    )}
                </div>

                {verification && (
                    <div className="space-y-4 rounded-lg bg-muted/50 p-4 border border-border">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Verification Status</span>
                            <div className="flex items-center gap-2">
                                {verification.status === 'verified' ? (
                                    <span className="flex items-center gap-1 text-sm text-green-500 font-bold">
                                        <CheckCircle className="w-4 h-4" />
                                        Verified
                                    </span>
                                ) : verification.status === 'failed' ? (
                                    <span className="flex items-center gap-1 text-sm text-red-500 font-bold">
                                        <XCircle className="w-4 h-4" />
                                        Failed
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-sm text-yellow-500 font-bold">
                                        <AlertCircle className="w-4 h-4" />
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>

                        {verification.status !== 'verified' && (
                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground">
                                    Add the following TXT record to your domain's DNS settings at <strong>{verification.domain}</strong>:
                                </p>
                                <div className="flex items-center gap-2 rounded bg-background p-2 border border-border group">
                                    <code className="flex-1 text-xs font-mono truncate">{verification.txt_record}</code>
                                    <button
                                        onClick={() => copyToClipboard(verification.txt_record)}
                                        className="p-1 hover:bg-muted rounded transition-colors"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={handleVerify}
                                    disabled={isVerifying}
                                >
                                    {isVerifying ? (
                                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                    )}
                                    Check Verification
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {verification?.status === 'verified' && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                        <p className="text-xs text-green-800 dark:text-green-300">
                            Your domain is verified. Note that it may take up to 24 hours for SSL/TLS certificates to be provisioned and for the domain to be fully active.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
