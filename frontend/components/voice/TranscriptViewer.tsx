import React, { useState } from 'react';
import { Sparkles, Clock, FileText, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TranscriptEditor } from './TranscriptEditor';
import { CleaningModal } from './CleaningModal';

interface TranscriptViewerProps {
    rawTranscript: string;
    cleanedTranscript?: string | null;
    duration: number;
    wordCount: number;
    language?: string | null;
    isCleaning: boolean;
    onClean: (level: 'light' | 'standard' | 'heavy') => void;
    onUpdate: (text: string) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
    rawTranscript, cleanedTranscript, duration, wordCount,
    language, isCleaning, onClean, onUpdate
}) => {
    const [showCleaningModal, setShowCleaningModal] = useState(false);
    const [view, setView] = useState<'raw' | 'cleaned'>(cleanedTranscript ? 'cleaned' : 'raw');

    const activeTranscript = view === 'cleaned' ? (cleanedTranscript || rawTranscript) : rawTranscript;

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        {wordCount} WORDS
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Languages className="w-3 h-3 text-accent" />
                        {(language || 'detecting...').toUpperCase()}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {cleanedTranscript && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-0.5 flex">
                            <button
                                onClick={() => setView('raw')}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${view === 'raw' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                            >
                                RAW
                            </button>
                            <button
                                onClick={() => setView('cleaned')}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${view === 'cleaned' ? 'bg-accent/10 text-accent' : 'text-white/40'}`}
                            >
                                CLEANED
                            </button>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCleaningModal(true)}
                        className="h-8 border-accent/20 text-accent bg-accent/5 hover:bg-accent/10"
                        disabled={isCleaning}
                    >
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        {cleanedTranscript ? 'Re-clean ✨' : 'Clean Transcript ✨'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <TranscriptEditor
                    content={activeTranscript}
                    onChange={onUpdate}
                    isCleaning={isCleaning}
                />
            </div>

            <CleaningModal
                isOpen={showCleaningModal}
                onClose={() => setShowCleaningModal(false)}
                onSelect={(level) => {
                    onClean(level);
                    setShowCleaningModal(false);
                    setView('cleaned');
                }}
            />
        </div>
    );
};
