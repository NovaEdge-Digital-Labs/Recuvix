import React, { useRef, useState } from 'react';
import { Bold, Italic, Quote, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TranscriptEditorProps {
    content: string;
    onChange: (newContent: string) => void;
    isCleaning?: boolean;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
    content, onChange, isCleaning
}) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerText);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Bold className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Italic className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Quote className="w-4 h-4" /></Button>
                </div>
                <div className="flex items-center gap-2 group">
                    <Search className="w-4 h-4 text-white/40 group-focus-within:text-accent" />
                    <input
                        type="text"
                        placeholder="Search transcript..."
                        className="bg-transparent border-none text-xs focus:ring-0 w-32 outline-none"
                    />
                </div>
            </div>

            <div className="relative flex-1 overflow-y-auto min-h-[400px]">
                {isCleaning && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-medium text-accent">AI cleaning in progress...</p>
                        </div>
                    </div>
                )}

                <div
                    ref={editorRef}
                    contentEditable={!isCleaning}
                    onInput={handleInput}
                    suppressContentEditableWarning
                    className="p-6 font-sans text-sm leading-relaxed outline-none whitespace-pre-wrap min-h-full"
                >
                    {content}
                </div>
            </div>
        </div>
    );
};
