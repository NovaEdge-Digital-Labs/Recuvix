'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, Layout, Save, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function PartnerSettings() {
    const supabase = createClient();
    const { tenant, refreshTenant } = useTenant();
    const [isLoading, setIsLoading] = useState(false);

    // Branding State
    const [colors, setColors] = useState({
        primary: tenant?.colors?.primary || '#3b82f6',
        secondary: tenant?.colors?.secondary || '#64748b',
        background: tenant?.colors?.background || '#ffffff',
        text: tenant?.colors?.text || '#0f172a',
        card: tenant?.colors?.card || '#ffffff',
        border: tenant?.colors?.border || '#e2e8f0'
    });

    const [fonts, setFonts] = useState({
        heading: tenant?.fonts?.heading || 'Inter',
        body: tenant?.fonts?.body || 'Inter'
    });

    const [assets, setAssets] = useState({
        logoUrl: tenant?.logoUrl || '',
        faviconUrl: tenant?.faviconUrl || ''
    });

    useEffect(() => {
        if (tenant) {
            setColors({
                primary: tenant.colors?.primary || '#3b82f6',
                secondary: tenant.colors?.secondary || '#64748b',
                background: tenant.colors?.background || '#ffffff',
                text: tenant.colors?.text || '#0f172a',
                card: tenant.colors?.card || '#ffffff',
                border: tenant.colors?.border || '#e2e8f0'
            });
            setFonts({
                heading: tenant.fonts?.heading || 'Inter',
                body: tenant.fonts?.body || 'Inter'
            });
            setAssets({
                logoUrl: tenant.logoUrl || '',
                faviconUrl: tenant.faviconUrl || ''
            });
        }
    }, [tenant]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const { error } = await (supabase
                .from('wl_tenants' as any) as any)
                .update({
                    colors: colors as any,
                    fonts: fonts as any,
                    logo_url: assets.logoUrl || null,
                    favicon_url: assets.faviconUrl || null
                })
                .eq('id', tenant?.id);

            if (error) throw error;

            toast.success('Branding settings updated successfully');
            await refreshTenant();
        } catch (error: any) {
            console.error('Save Settings Error:', error);
            toast.error(error.message || 'Failed to save settings');
        } finally {
            setIsLoading(false);
        }
    };

    if (!tenant) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Partner Settings</h1>
                    <p className="text-muted-foreground text-sm">Customize your platform instance's look and feel.</p>
                </div>
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="branding" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="branding" className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Colors
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Typography
                    </TabsTrigger>
                    <TabsTrigger value="assets" className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Assets
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="branding">
                    <Card>
                        <CardHeader>
                            <CardTitle>Color Palette</CardTitle>
                            <CardDescription>Configure the core colors of your platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Primary Color (Accent)</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-border"
                                            style={{ backgroundColor: colors.primary }}
                                        />
                                        <Input
                                            value={colors.primary}
                                            onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                                            placeholder="#3b82f6"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary Color (Surface)</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-border"
                                            style={{ backgroundColor: colors.secondary }}
                                        />
                                        <Input
                                            value={colors.secondary}
                                            onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                                            placeholder="#64748b"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Background Color</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-border"
                                            style={{ backgroundColor: colors.background }}
                                        />
                                        <Input
                                            value={colors.background}
                                            onChange={(e) => setColors({ ...colors, background: e.target.value })}
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Text Color</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-border"
                                            style={{ backgroundColor: colors.text }}
                                        />
                                        <Input
                                            value={colors.text}
                                            onChange={(e) => setColors({ ...colors, text: e.target.value })}
                                            placeholder="#0f172a"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Card Background</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-border"
                                            style={{ backgroundColor: colors.card }}
                                        />
                                        <Input
                                            value={colors.card}
                                            onChange={(e) => setColors({ ...colors, card: e.target.value })}
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Border Color</Label>
                                    <div className="flex gap-2">
                                        <div
                                            className="w-10 h-10 rounded border border-border"
                                            style={{ backgroundColor: colors.border }}
                                        />
                                        <Input
                                            value={colors.border}
                                            onChange={(e) => setColors({ ...colors, border: e.target.value })}
                                            placeholder="#e2e8f0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="typography">
                    <Card>
                        <CardHeader>
                            <CardTitle>Typography</CardTitle>
                            <CardDescription>Choose fonts that match your brand identity.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Heading Font (Google Fonts name)</Label>
                                <Input
                                    value={fonts.heading}
                                    onChange={(e) => setFonts({ ...fonts, heading: e.target.value })}
                                    placeholder="Syne, Montserrat, etc."
                                />
                                <p className="text-[10px] text-muted-foreground">Standard Google Fonts names only.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Body Font (Google Fonts name)</Label>
                                <Input
                                    value={fonts.body}
                                    onChange={(e) => setFonts({ ...fonts, body: e.target.value })}
                                    placeholder="Inter, Roboto, etc."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="assets">
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Assets</CardTitle>
                            <CardDescription>Upload or link your visual assets.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <Input
                                    value={assets.logoUrl}
                                    onChange={(e) => setAssets({ ...assets, logoUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Favicon URL</Label>
                                <Input
                                    value={assets.faviconUrl}
                                    onChange={(e) => setAssets({ ...assets, faviconUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
