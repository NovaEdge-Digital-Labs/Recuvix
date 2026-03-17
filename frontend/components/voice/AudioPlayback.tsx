import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlaybackProps {
    url: string;
    duration?: number;
}

export const AudioPlayback: React.FC<AudioPlaybackProps> = ({ url, duration }) => {
    return (
        <div className="bg-card/50 border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <audio src={url} controls className="w-full h-10 accent-accent" />
        </div>
    );
};
