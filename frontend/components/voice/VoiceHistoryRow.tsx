import React from 'react';
import { Mic, FileAudio, Youtube, Clock, FileText, ExternalLink, Download, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '@/lib/voice/fileSizeEstimator';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface VoiceHistoryRowProps {
    recording: {
        id: string;
        created_at: string;
        source_type: 'browser_recording' | 'file_upload' | 'youtube_url';
        audio_duration_seconds: number;
        word_count_transcript: number;
        transcription_status: string;
        blog_id?: string;
        original_filename?: string;
        blogs?: {
            title: string;
        }
    };
}

export const VoiceHistoryRow: React.FC<VoiceHistoryRowProps> = ({ recording }) => {
    const SourceIcon = recording.source_type === 'youtube_url' ? Youtube : recording.source_type === 'file_upload' ? FileAudio : Mic;

    return (
        <div className="group bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-accent/30 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-accent/10 transition-colors">
                    <SourceIcon className="w-5 h-5 text-white/40 group-hover:text-accent" />
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">
                            {recording.original_filename || (recording.source_type === 'browser_recording' ? 'Voice Recording' : 'Audio Note')}
                        </p>
                        {recording.blog_id && (
                            <Badge variant="outline" className="text-[10px] bg-accent/10 border-accent/20 text-accent font-bold py-0">BLOG GENERATED</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDuration(recording.audio_duration_seconds)}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {recording.word_count_transcript} WORDS</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{format(new Date(recording.created_at), 'MMM d, yyyy')}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {recording.blog_id ? (
                    <Link
                        href={`/results?id=${recording.blog_id}`}
                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "h-9 border-white/10 bg-white/5 hover:bg-white/10")}
                    >
                        <ExternalLink className="w-3.5 h-3.5 mr-2" />
                        View Blog
                    </Link>
                ) : (
                    <Link
                        href={`/voice?recordingId=${recording.id}`}
                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "h-9 border-accent/20 text-accent bg-accent/5 hover:bg-accent/10")}
                    >
                        Continue to Blog
                    </Link>
                )}

                <Button variant="ghost" size="icon" className="w-9 h-9 text-white/20 hover:text-white hover:bg-white/5 rounded-full">
                    <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-full">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
