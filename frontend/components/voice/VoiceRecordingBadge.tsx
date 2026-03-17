import React from 'react';
import { Mic } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const VoiceRecordingBadge: React.FC = () => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 border border-accent/30 text-accent">
                        <Mic className="w-3 h-3" />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#0d0d0d] border-white/10 text-[10px] font-bold">
                    Generated from Voice Recording
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
