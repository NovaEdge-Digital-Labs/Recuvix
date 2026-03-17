import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayback } from './AudioPlayback';

interface UploadTabProps {
    onComplete: (file: File) => void;
}

export const UploadTab: React.FC<UploadTabProps> = ({ onComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (selected.size > 100 * 1024 * 1024) {
            setError('File too large (max 100MB)');
            return;
        }

        setFile(selected);
        setError(null);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) {
            if (dropped.size > 100 * 1024 * 1024) {
                setError('File too large (max 100MB)');
                return;
            }
            setFile(dropped);
            setError(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-6 min-h-[400px]">
            {!file ? (
                <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    className="w-full max-w-md aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all group"
                >
                    <input type="file" className="hidden" accept="audio/*,video/mp4,video/webm" onChange={onFileChange} />
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                        <Upload className="w-8 h-8 text-white/40 group-hover:text-accent transition-colors" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Drop your audio file here</p>
                        <p className="text-xs text-white/40 mt-1">MP3, WAV, M4A, OGG, FLAC, WebM (Max 100MB)</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 pointer-events-none">Browse Files</Button>
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                            <AlertCircle className="w-3 h-3" />
                            {error}
                        </div>
                    )}
                </label>
            ) : (
                <div className="w-full max-w-md flex flex-col gap-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3">
                            <FileAudio className="w-8 h-8 text-accent" />
                            <div>
                                <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-white/40">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-white/40 hover:text-white">Change</Button>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-accent mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">File ready for transcription</span>
                    </div>

                    <Button
                        className="w-full bg-accent text-black font-bold h-12"
                        onClick={() => onComplete(file)}
                    >
                        Start Transcribing
                    </Button>
                </div>
            )}
        </div>
    );
};
