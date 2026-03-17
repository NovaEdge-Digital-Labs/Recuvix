"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
    Settings,
    Trash2,
    AlertTriangle,
    ShieldAlert,
    Save,
    Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useWorkspace } from '@/context/WorkspaceContext';

const settingsSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function WorkspaceSettingsForm() {
    const { activeWorkspace, refreshWorkspaces, can, activeRole } = useWorkspace();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: activeWorkspace?.name || '',
            description: activeWorkspace?.description || '',
        },
    });

    async function onSubmit(values: SettingsFormValues) {
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

            if (!response.ok) throw new Error('Failed to update settings');

            toast.success('Workspace settings updated');
            await refreshWorkspaces();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!activeWorkspace) return;
        setIsDeleting(true);
        try {
            const response = await fetch('/api/workspaces/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId: activeWorkspace.id }),
            });

            if (!response.ok) throw new Error('Failed to delete workspace');

            toast.success('Workspace deleted successfully');
            window.location.href = '/workspaces';
        } catch (error: any) {
            toast.error(error.message);
            setIsDeleting(false);
        }
    };

    if (!activeWorkspace) return null;

    const isOwner = activeRole === 'owner';

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Basic information about your workspace.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!can('manage_settings')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!can('manage_settings')} />
                                        </FormControl>
                                        <FormDescription>A brief summary of what this team does.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        {can('manage_settings') && (
                            <CardFooter className="border-t px-6 py-4 bg-muted/20">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </form>
            </Form>

            {isOwner && (
                <Card className="border-destructive/20 overflow-hidden">
                    <CardHeader className="bg-destructive/5">
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <ShieldAlert className="size-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>Actions that cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Transfer Ownership</p>
                                <p className="text-sm text-muted-foreground">Assign another member as the owner of this workspace.</p>
                            </div>
                            <Button variant="outline">Transfer</Button>
                        </div>

                        <div className="border-t pt-6 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-destructive">Delete Workspace</p>
                                <p className="text-sm text-muted-foreground">Permanently delete this workspace and all associated data.</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger {...({ asChild: true } as any)}>
                                    <Button variant="destructive">Delete Workspace</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the
                                            <span className="font-bold"> {activeWorkspace.name}</span> workspace,
                                            all team blogs, member associations, and shared brand assets.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Yes, Delete Workspace'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
