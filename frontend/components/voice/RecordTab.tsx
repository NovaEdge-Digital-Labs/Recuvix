import React from 'react';
import { Mic, Square, Pause, Play, Trash2, CheckCircle2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { WaveformVisualiser } from './WaveformVisualiser';
import { AudioLevelMeter } from './AudioLevelMeter';
import { AudioPlayback } from './AudioPlayback';
import { formatDuration } from '@/lib/voice/fileSizeEstimator';

interface RecordTabProps {
    onComplete: (blob: Blob) => void;
}

export const RecordTab: React.FC<RecordTabProps> = ({ onComplete }) => {
    const {
        phase,
        duration,
        audioBlob,
        audioUrl,
        audioLevel,
        permissionError,
        recordingError,
        requestPermission,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        discardRecording
    } = useVoiceRecording();

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-6 min-h-[400px]">
            {phase === 'idle' && !audioUrl && (
                <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center relative">
                        <Mic className="w-10 h-10 text-accent" />
                        <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Ready to record</h3>
                        <p className="text-white/40 text-sm max-w-[280px] mx-auto text-center font-medium leading-relaxed">
                            Tap the button and speak naturally. Record up to 60 minutes.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        onClick={startRecording}
                        className="h-16 px-10 rounded-full bg-accent text-black hover:bg-accent/90 text-lg font-bold shadow-[0_0_20px_rgba(232,255,71,0.2)]"
                    >
                        Start Recording
                    </Button>
                </div>
            )}

            {(phase === 'recording' || phase === 'paused') && (
                <div className="w-full max-w-md flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 text-red-500 animate-pulse mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm font-medium tracking-wider">RECORDING</span>
                    </div>

                    <WaveformVisualiser isRecording={phase === 'recording'} audioLevel={audioLevel} />

                    <div className="text-5xl font-mono font-bold tracking-tighter tabular-nums">
                        {formatDuration(duration)}
                    </div>

                    <AudioLevelMeter level={audioLevel} />

                    <div className="flex items-center gap-4 mt-4">
                        {phase === 'recording' ? (
                            <Button size="icon" variant="outline" onClick={pauseRecording} className="w-14 h-14 rounded-full border-white/10 hover:bg-white/5">
                                <Pause className="w-6 h-6" />
                            </Button>
                        ) : (
                            <Button size="icon" variant="outline" onClick={resumeRecording} className="w-14 h-14 rounded-full border-accent/20 hover:bg-accent/10">
                                <Play className="w-6 h-6 text-accent" />
                            </Button>
                        )}
                        <Button size="lg" onClick={stopRecording} className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 font-bold">
                            Stop & Review
                        </Button>
                    </div>
                </div>
            )}

            {phase === 'stopped' && audioUrl && (
                <div className="w-full max-w-md flex flex-col gap-6">
                    <div className="flex items-center justify-center gap-3 text-accent mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Recording complete</span>
                    </div>

                    <div className="bg-card/50 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4">
                        <div className="text-3xl font-mono font-bold">{formatDuration(duration)}</div>
                        <AudioPlayback url={audioUrl} />
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={discardRecording} className="flex-1 border-white/10 text-red-400 hover:text-red-300 hover:bg-red-400/5">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Discard
                        </Button>
                        <Button
                            className="flex-[2] bg-accent text-black font-bold"
                            onClick={() => audioBlob && onComplete(audioBlob)}
                        >
                            Transcribe Recording
                        </Button>
                    </div>
                </div>
            )}

            {phase === 'error' && (
                <div className="text-center p-8 border border-red-500/20 bg-red-500/5 rounded-2xl max-w-sm">
                    <p className="text-red-400 font-medium mb-4">{permissionError || recordingError}</p>
                    <Button variant="outline" onClick={discardRecording}>Try Again</Button>
                </div>
            )}
        </div>
    );
};
