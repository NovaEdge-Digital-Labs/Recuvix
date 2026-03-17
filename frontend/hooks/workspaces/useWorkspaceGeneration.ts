"use client";

import { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { toast } from 'sonner';

export function useWorkspaceGeneration() {
    const { activeWorkspace, activeRole, can, refreshWorkspaces } = useWorkspace();
    const [isProcessing, setIsProcessing] = useState(false);

    const checkGenerationEligibility = () => {
        if (!activeWorkspace) return { eligible: false, error: 'No active workspace selected' };

        if (!can('generate_blog')) {
            return { eligible: false, error: 'You do not have permission to generate blogs in this workspace' };
        }

        if (activeWorkspace.credits_balance < 1) {
            return { eligible: false, error: 'Insufficient credits in workspace pool' };
        }

        return { eligible: true };
    };

    const getWorkspaceContextForPrompt = () => {
        if (!activeWorkspace) return "";

        let context = "\n\n### WORKSPACE CONTEXT (BRAND VOICE & ASSETS)\n";
        if (activeWorkspace.name) context += `- Brand Name: ${activeWorkspace.name}\n`;
        if (activeWorkspace.brand_logo_url) context += `- Brand Logo URL: ${activeWorkspace.brand_logo_url}\n`;
        if (activeWorkspace.default_country) context += `- Target Country/Audience: ${activeWorkspace.default_country}\n`;
        if (activeWorkspace.default_tone) context += `- Desired Tone: ${activeWorkspace.default_tone}\n`;
        if (activeWorkspace.brand_website_url) context += `- Website URL: ${activeWorkspace.brand_website_url}\n`;

        // Add default output format if specified
        if (activeWorkspace.default_output_format) {
            context += `- Preferred Output Format: ${activeWorkspace.default_output_format}\n`;
        }

        return context;
    };

    const logWorkspaceActivity = async (action: string, entityType: string, entityId: string, entityName: string) => {
        if (!activeWorkspace) return;

        try {
            await fetch('/api/workspaces/update-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: activeWorkspace.id,
                    logActivity: {
                        action,
                        entity_type: entityType,
                        entity_id: entityId,
                        entity_name: entityName
                    }
                }),
            });
        } catch (error) {
            console.error('Failed to log workspace activity:', error);
        }
    };

    return {
        activeWorkspace,
        checkGenerationEligibility,
        getWorkspaceContextForPrompt,
        logWorkspaceActivity,
        isProcessing,
        setIsProcessing,
    };
}
