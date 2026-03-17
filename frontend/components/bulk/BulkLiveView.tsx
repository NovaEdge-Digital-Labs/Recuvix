"use client";

import React from 'react';
import { BulkTopic } from '@/lib/validators/bulkSchemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CheckCircle2, Circle, AlertCircle, FileText, ImageIcon, Search, Zap, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BulkLiveViewProps {
    topic: BulkTopic | null;
}

export function BulkLiveView({ topic }: BulkLiveViewProps) {
    if (!topic) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-border rounded-xl bg-card/20 text-center p-8">
                <div className="bg-card p-4 rounded-full mb-4">
                    <Zap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Waiting for next topic...</h3>
                <p className="text-muted-foreground max-w-sm">
                    The queue is currently idle or waiting for the mandatory delay between generations.
                </p>
            </div>
        );
    }

    const steps = [
        { id: 'outline', label: 'Outline Generation', icon: Search },
        { id: 'writing', label: 'Blog Writing', icon: FileText },
        { id: 'images', label: 'Image Fetching', icon: ImageIcon },
        { id: 'thumbnail', label: 'Thumbnail Generation', icon: Zap },
        { id: 'seoPack', label: 'SEO Meta Generation', icon: Search },
        { id: 'packaging', label: 'Bundling Output', icon: Package },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentStepIndex = steps.findIndex(s => (topic.steps as any)[s.id].status === 'running');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const progress = ((steps.filter(s => (topic.steps as any)[s.id].status === 'done').length) / steps.length) * 100;

    return (
        <Card className="h-[750px] flex flex-col border-border bg-card/30 overflow-hidden">
            <CardHeader className="border-b border-border bg-background/40">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-foreground border-accent/20 animate-pulse">
                                Active Generation
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">Topic #{topic.position}</span>
                        </div>
                        <CardTitle className="text-2xl font-black truncate max-w-xl">
                            {topic.topic}
                        </CardTitle>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Overall Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-card" />
                </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-grow overflow-hidden">
                {/* Steps Sidebar */}
                <div className="w-72 border-r border-border bg-background/20 p-6 space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Pipeline Steps</h3>
                    {steps.map((step) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const status = (topic.steps as any)[step.id].status;

                        return (
                            <div key={step.id} className="flex items-start gap-3 group">
                                <div className="mt-1">
                                    {status === 'done' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                    {status === 'running' && <Loader2 className="h-5 w-5 text-foreground animate-spin" />}
                                    {status === 'failed' && <AlertCircle className="h-5 w-5 text-red-500" />}
                                    {status === 'pending' && <Circle className="h-5 w-5 text-gray-700" />}
                                    {status === 'skipped' && <Circle className="h-5 w-5 text-muted-foreground opacity-50" />}
                                </div>
                                <div className="space-y-0.5">
                                    <span className={`text-sm font-bold transition-colors ${status === 'running' ? 'text-foreground' :
                                        status === 'done' ? 'text-gray-300' : 'text-muted-foreground'
                                        }`}>
                                        {step.label}
                                    </span>
                                    {status === 'running' && (
                                        <div className="flex gap-1">
                                            <span className="h-1 w-1 bg-accent rounded-full animate-bounce" />
                                            <span className="h-1 w-1 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="h-1 w-1 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Live Preview Console */}
                <div className="flex-grow flex flex-col bg-background/40">
                    <div className="p-4 border-b border-border bg-card/40 flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">generation_stream.log</span>
                        {topic.durationSeconds && <span className="text-xs font-mono text-muted-foreground">Elapsed: {topic.durationSeconds}s</span>}
                    </div>
                    <ScrollArea className="flex-grow p-6">
                        <div className="font-mono text-sm space-y-2">
                            <p className="text-muted-foreground">[{new Date().toLocaleTimeString()}] Initializing generation pipeline...</p>
                            <p className="text-muted-foreground">[{new Date().toLocaleTimeString()}] LLM Model: GPT-4o</p>

                            {topic.blogMarkdown ? (
                                <div className="mt-6 prose prose-invert prose-sm max-w-none">
                                    <div className="text-gray-300 whitespace-pre-wrap">
                                        {topic.blogMarkdown}
                                        <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1" />
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-12 flex flex-col items-center justify-center text-muted-foreground gap-4">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <p className="animate-pulse">Waiting for content stream...</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
