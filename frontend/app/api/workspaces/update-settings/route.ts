import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspacesService } from '@/lib/db/workspacesService';

const settingsSchema = z.object({
    workspaceId: z.string().uuid(),
    name: z.string().min(2).max(50).optional(),
    description: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal('')),
    brandLogoUrl: z.string().url().optional().or(z.literal('')),
    brandUserImageUrl: z.string().url().optional().or(z.literal('')),
    brandColorThemeUrl: z.string().url().optional().or(z.literal('')),
    brandWebsiteUrl: z.string().url().optional().or(z.literal('')),
    brandInstagramHandle: z.string().optional(),
    brandFacebookHandle: z.string().optional(),
    brandYoutubeHandle: z.string().optional(),
    brandXHandle: z.string().optional(),
    brandAddress: z.string().optional(),
    brandPhone: z.string().optional(),
    defaultCountry: z.string().optional(),
    defaultTone: z.string().optional(),
    defaultWordCount: z.number().optional(),
    defaultOutputFormat: z.string().optional(),
    settings: z.record(z.string(), z.any()).optional(),
});

export async function PATCH(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId, ...updates } = settingsSchema.parse(body);

        // 1. Verify requester is owner or admin
        const membership = await workspacesService.getMembership(workspaceId, user.id, supabase);
        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // 2. Perform updates
        const updatedWorkspace = await workspacesService.update(workspaceId, {
            name: updates.name,
            description: updates.description,
            avatar_url: updates.avatarUrl,
            brand_logo_url: updates.brandLogoUrl,
            brand_user_image_url: updates.brandUserImageUrl,
            brand_color_theme_url: updates.brandColorThemeUrl,
            brand_website_url: updates.brandWebsiteUrl,
            brand_instagram_handle: updates.brandInstagramHandle,
            brand_facebook_handle: updates.brandFacebookHandle,
            brand_youtube_handle: updates.brandYoutubeHandle,
            brand_x_handle: updates.brandXHandle,
            brand_address: updates.brandAddress,
            brand_phone: updates.brandPhone,
            default_country: updates.defaultCountry,
            default_tone: updates.defaultTone,
            default_word_count: updates.defaultWordCount,
            default_output_format: updates.defaultOutputFormat,
            settings: updates.settings as any,
        }, supabase);

        // 3. Log activity
        await workspacesService.logActivity({
            workspace_id: workspaceId,
            user_id: user.id,
            user_email: user.email,
            action: 'settings_changed',
            entity_type: 'workspace',
            entity_id: workspaceId,
            entity_name: updatedWorkspace.name,
        }, supabase);

        return NextResponse.json({ workspace: updatedWorkspace });
    } catch (error: any) {
        console.error('Update settings failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
