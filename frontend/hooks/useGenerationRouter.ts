"use client";

import { useBlogGeneration } from "./useBlogGeneration";
import { useManagedGeneration } from "./useManagedGeneration";
import { useCredits } from "./useCredits";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useWorkspaceGeneration } from "./workspaces/useWorkspaceGeneration";
import { BlogFormData } from "@/components/form/BlogForm";
import { useVoiceGeneration, VoiceGenerationData } from "./useVoiceGeneration";
import { useSearchParams } from "next/navigation";

export function useGenerationRouter() {
    const { isManagedMode, balance: personalCredits } = useCredits();
    const { user } = useAuth();
    const { activeWorkspace } = useWorkspace();
    const { checkGenerationEligibility, getWorkspaceContextForPrompt } = useWorkspaceGeneration();

    const byok = useBlogGeneration();
    const managed = useManagedGeneration();
    const voice = useVoiceGeneration();
    const searchParams = useSearchParams();
    const source = searchParams.get('source');
    const isVoice = source === 'voice';

    // Determine if we should use workspace mode
    // Workspace mode ALWAYS uses managed generation (for pool credit deduction)
    const isWorkspaceMode = !!activeWorkspace;

    // Eligibility checks
    const { eligible: isWorkspaceEligible, error: workspaceError } = isWorkspaceMode
        ? checkGenerationEligibility()
        : { eligible: false, error: null };

    // Determine if we should use managed mode
    // Either workspace mode or personal managed mode
    const shouldUseManaged = isWorkspaceMode || (isManagedMode && !!user && (personalCredits || 0) > 0);

    const generate = (data: BlogFormData | VoiceGenerationData) => {
        if (isVoice) {
            return voice.generateFromVoice(data as VoiceGenerationData);
        }

        const standardData = data as BlogFormData;
        if (isWorkspaceMode) {
            if (!isWorkspaceEligible) {
                throw new Error(workspaceError || 'Workspace generation not eligible');
            }

            // Inject workspace brand context into the prompt/data
            const workspaceContext = getWorkspaceContextForPrompt();
            const enhancedData = {
                ...standardData,
                workspaceId: activeWorkspace.id,
                additionalContext: ((standardData as any).additionalContext || '') + workspaceContext
            };

            return managed.generate(enhancedData as any);
        }

        if (shouldUseManaged) {
            return managed.generate(standardData);
        } else {
            return byok.startGeneration(standardData);
        }
    };

    const abort = () => {
        if (isVoice) {
            voice.cancel();
            return;
        }
        if (shouldUseManaged) {
            managed.cancel();
        } else {
            byok.abort();
        }
    };

    // Unify the interfaces
    const status = isVoice ? voice.status : (shouldUseManaged ? managed.status : byok.step);
    const progress = isVoice ? voice.progress : (shouldUseManaged ? managed.progress : byok.progress);
    const error = isWorkspaceMode && workspaceError ? workspaceError : (isVoice ? voice.error : (shouldUseManaged ? managed.error : byok.error));
    const streamedText = isVoice ? voice.streamedText : (shouldUseManaged ? managed.streamedText : byok.streamedMarkdown);

    return {
        generate,
        abort,
        status,
        progress,
        error,
        streamedText,
        isManaged: shouldUseManaged || isVoice,
        isWorkspace: isWorkspaceMode,
        isVoice,
        stepMessage: isVoice ? voice.stepMessage : (shouldUseManaged ? managed.stepMessage : undefined)
    };
}
