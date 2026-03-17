"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
    Image as ImageIcon,
    Globe,
    Instagram,
    Facebook,
    Youtube,
    Twitter,
    MapPin,
    Phone,
    Type,
    FileText,
    Save,
    Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspace } from '@/context/WorkspaceContext';

const brandSchema = z.object({
    brand_logo_url: z.string().url().optional().or(z.literal('')),
    brand_user_image_url: z.string().url().optional().or(z.literal('')),
    brand_website_url: z.string().url().optional().or(z.literal('')),
    brand_instagram_handle: z.string().optional(),
    brand_facebook_handle: z.string().optional(),
    brand_youtube_handle: z.string().optional(),
    brand_x_handle: z.string().optional(),
    brand_address: z.string().optional(),
    brand_phone: z.string().optional(),
    default_country: z.string().optional(),
    default_tone: z.string().optional(),
    default_word_count: z.number().min(100).max(10000).optional(),
    default_output_format: z.string().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export function BrandAssetsPanel() {
    const { activeWorkspace, refreshWorkspaces, can } = useWorkspace();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            brand_logo_url: activeWorkspace?.brand_logo_url || '',
            brand_user_image_url: activeWorkspace?.brand_user_image_url || '',
            brand_website_url: activeWorkspace?.brand_website_url || '',
            brand_instagram_handle: activeWorkspace?.brand_instagram_handle || '',
            brand_facebook_handle: activeWorkspace?.brand_facebook_handle || '',
            brand_youtube_handle: activeWorkspace?.brand_youtube_handle || '',
            brand_x_handle: activeWorkspace?.brand_x_handle || '',
            brand_address: activeWorkspace?.brand_address || '',
            brand_phone: activeWorkspace?.brand_phone || '',
            default_country: activeWorkspace?.default_country || 'United States',
            default_tone: activeWorkspace?.default_tone || 'Professional',
            default_word_count: activeWorkspace?.default_word_count || 1000,
            default_output_format: activeWorkspace?.default_output_format || 'Markdown',
        },
    });

    async function onSubmit(values: BrandFormValues) {
        if (!activeWorkspace) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/workspaces/update-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: activeWorkspace.id,
                    ...values,
                }),
            });

            if (!response.ok) throw new Error('Failed to update brand assets');

            toast.success('Brand assets updated successfully');
            await refreshWorkspaces();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const isReadOnly = !can('manage_settings');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs defaultValue="identity" className="w-full flex flex-col md:flex-row gap-6">
                    <TabsList className="flex flex-col h-auto w-full md:w-48 bg-transparent space-y-1 p-0">
                        <TabsTrigger value="identity" className="w-full justify-start data-[state=active]:bg-muted">Visual Identity</TabsTrigger>
                        <TabsTrigger value="social" className="w-full justify-start data-[state=active]:bg-muted">Social & Contact</TabsTrigger>
                        <TabsTrigger value="defaults" className="w-full justify-start data-[state=active]:bg-muted">Content Defaults</TabsTrigger>
                    </TabsList>

                    <div className="flex-1">
                        <TabsContent value="identity" className="mt-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Visual Assets</CardTitle>
                                    <CardDescription>URLs for your team's logo and representative images.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="brand_logo_url"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Brand Logo URL</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <ImageIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="https://..." className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brand_user_image_url"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Team Profile Image URL</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <ImageIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="https://..." className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Used as the default author image for team blogs.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="social" className="space-y-6 pt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Presence</CardTitle>
                                    <CardDescription>Information to be included in blog footers or schemas.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="brand_website_url"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="https://..." className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brand_x_handle"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>X (Twitter) Handle</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Twitter className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="@handle" className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brand_instagram_handle"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Instagram Handle</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Instagram className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="handle" className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brand_phone"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Business Phone</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="+1..." className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="defaults" className="space-y-6 pt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content Strategy Defaults</CardTitle>
                                    <CardDescription>These settings will pre-fill the generation form for all team members.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="default_country"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Target Country</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="United States" className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="default_tone"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Default Tone</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Type className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input placeholder="Professional, Witty, etc." className="pl-9" {...field} disabled={isReadOnly} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="default_word_count"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Target Word Count</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <FileText className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            className="pl-9"
                                                            disabled={isReadOnly}
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>

                {!isReadOnly && (
                    <div className="flex justify-end">
                        <Button type="submit" className="min-w-[150px]" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 size-4" />
                                    Save Brand Assets
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </Form>
    );
}
