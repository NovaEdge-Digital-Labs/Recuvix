import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { TranscriptionStatus } from '@/hooks/useTranscription';

interface TranscriptionProgressProps {
    status: TranscriptionStatus;
    error?: string | null;
    duration?: number | null;
    wordCount?: number | null;
    language?: string | null;
}

export const TranscriptionProgress: React.FC<TranscriptionProgressProps> = ({
    status, error, duration, wordCount, language
}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (status === 'processing' || status === 'chunking') {
            const interval = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + 1 : prev));
            }, 500);
            return () => clearInterval(interval);
        } else if (status === 'complete') {
            setProgress(100);
        }
    }, [status]);

    const stages = {
        'idle': 'Waiting...',
        'uploading': 'Uploading audio...',
        'processing': 'AI Transcription in progress...',
        'chunking': 'Processing large file in segments...',
        'complete': 'Transcription complete!',
        'failed': 'Transcription failed'
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {status === 'complete' ? (
                    <CheckCircle2 className="w-20 h-20 text-accent animate-in zoom-in duration-500" />
                ) : status === 'failed' ? (
                    <AlertCircle className="w-20 h-20 text-red-500 animate-in shake duration-500" />
                ) : (
                    <>
                        <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                        <div
                            className="absolute inset-0 border-4 border-accent rounded-full transition-all duration-500"
                            style={{
                                clipPath: `polygon(50% 50%, -50% -50%, ${progress > 50 ? '150% -50%' : '50% -50%'}, ${progress > 75 ? '150% 150%' : progress > 50 ? '150% 150%' : '50% 150%'}, ${progress > 25 ? '-50% 150%' : '50% 150%'}, -50% -50%)`,
                                transform: `rotate(${progress * 3.6}deg)`
                            }}
                        />
                        <div className="text-2xl font-bold font-mono text-accent">{progress}%</div>
                    </>
                )}
            </div>

            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{stages[status]}</h3>
                {status === 'processing' && (
                    <p className="text-white/40 text-sm animate-pulse">Whisper AI is listening...</p>
                )}
                {error && (
                    <p className="text-red-400 text-sm mt-2 max-w-sm mx-auto">{error}</p>
                )}
            </div>

            {(duration || wordCount || language) && status === 'complete' && (
                <div className="flex gap-8 border border-white/10 bg-white/5 rounded-2xl px-8 py-4 animate-in slide-in-from-bottom-5">
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Duration</p>
                        <p className="font-mono font-bold">{Math.floor(duration! / 60)}:{(duration! % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Words</p>
                        <p className="font-mono font-bold">{wordCount}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Language</p>
                        <p className="font-mono font-bold">{language?.toUpperCase() || 'EN'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
