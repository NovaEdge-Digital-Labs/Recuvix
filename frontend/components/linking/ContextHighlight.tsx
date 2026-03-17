import React from 'react';

interface ContextHighlightProps {
    sentence: string;
    anchor: string;
    className?: string;
}

export function ContextHighlight({ sentence, anchor, className }: ContextHighlightProps) {
    if (!anchor) return <span className={className}>{sentence}</span>;

    const parts = sentence.split(new RegExp(`(${anchor})`, 'gi'));

    return (
        <span className={`text-zinc-400 italic line-clamp-2 ${className}`}>
            "
            {parts.map((part, i) =>
                part.toLowerCase() === anchor.toLowerCase() ? (
                    <span key={i} className="text-accent font-medium not-italic underline decoration-accent/30 underline-offset-4">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
            "
        </span>
    );
}
