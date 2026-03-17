"use client";

import React from 'react';
import { BulkTopic } from '@/lib/validators/bulkSchemas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, CheckCircle2, Clock, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BulkQueueListProps {
    topics: BulkTopic[];
    onRemove?: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<BulkTopic>) => void;
    readonly?: boolean;
    running?: boolean;
}

export function BulkQueueList({ topics, onRemove, onUpdate, readonly, running }: BulkQueueListProps) {
    if (topics.length === 0 && !running) return null;

    return (
        <div className="space-y-3">
            {topics.map((topic) => (
                <BulkQueueRow
                    key={topic.id}
                    topic={topic}
                    onRemove={onRemove}
                    onUpdate={onUpdate}
                    readonly={readonly}
                    active={topic.status === 'generating'}
                />
            ))}
        </div>
    );
}

interface BulkQueueRowProps {
    topic: BulkTopic;
    onRemove?: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<BulkTopic>) => void;
    readonly?: boolean;
    active?: boolean;
}

function BulkQueueRow({ topic, onRemove, onUpdate, readonly, active }: BulkQueueRowProps) {
    const getStatusIcon = () => {
        switch (topic.status) {
            case 'complete': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'generating': return <Loader2 className="h-5 w-5 text-foreground animate-spin" />;
            default: return <Clock className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getStatusBadge = () => {
        switch (topic.status) {
            case 'complete': return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Complete</Badge>;
            case 'failed': return <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
            case 'generating': return <Badge variant="secondary" className="bg-accent/10 text-foreground border-accent/20">Generating</Badge>;
            default: return <Badge variant="outline" className="text-muted-foreground border-border">Queued</Badge>;
        }
    };

    return (
        <Card className={`group relative overflow-hidden transition-all duration-300 ${active ? 'border-accent shadow-[0_0_15px_rgba(232,255,71,0.1)] bg-card' : 'border-border bg-background/40'
            }`}>
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />}

            <div className="p-4 flex items-center gap-4">
                {!readonly && (
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-gray-300">
                        <GripVertical className="h-5 w-5" />
                    </div>
                )}

                <div className="flex-shrink-0">
                    {getStatusIcon()}
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">#{String(topic.position).padStart(2, '0')}</span>
                        {getStatusBadge()}
                        {topic.retryCount > 0 && <span className="text-[10px] text-muted-foreground">Retry {topic.retryCount}</span>}
                    </div>
                    <h4 className="font-semibold text-foreground truncate">{topic.topic}</h4>
                    {topic.lastError && (
                        <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {topic.lastError} ({topic.lastErrorStep})
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {topic.durationSeconds && (
                        <span className="text-xs text-muted-foreground font-mono">{topic.durationSeconds}s</span>
                    )}

                    {!readonly && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove?.(topic.id)}
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}

                    {topic.status === 'failed' && !readonly && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onUpdate?.(topic.id, { status: 'queued', retryCount: 0 })}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
