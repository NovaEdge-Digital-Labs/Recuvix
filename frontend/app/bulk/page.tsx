"use client";

import React, { useState } from 'react';
import { useBulkGeneration } from '@/hooks/useBulkGeneration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


import {
    Plus,
    Play,
    Pause,
    X,
    FileUp,
    History,
    Settings2,
    Type,
} from 'lucide-react';

// Child components to be split into separate files later
import { BulkSettingsPanel } from '@/components/bulk/BulkSettingsPanel';
import { BulkQueueList } from '@/components/bulk/BulkQueueList';
import { BulkLiveView } from '@/components/bulk/BulkLiveView';
import { BulkResultsView } from '@/components/bulk/BulkResultsView';
import { BulkEstimatorCard } from '@/components/bulk/BulkEstimatorCard';

export default function BulkPage() {
    const {
        phase,
        topics,
        settings,
        setSettings,
        addTopic,
        removeTopic,
        updateTopic,
        startGeneration,
        pauseGeneration,
        resumeGeneration,
        cancelGeneration,
        setPhase,
        isPaused,
    } = useBulkGeneration();

    const [newTopic, setNewTopic] = useState("");

    const handleAddManual = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopic.trim()) return;
        addTopic(newTopic.trim());
        setNewTopic("");
    };

    return (
        <div className="container py-8 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-foreground">
                        Bulk <span className="text-foreground">RECU VIX</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Queue up to 20 topics and generate SEO blogs in bulk while you work on other tasks.
                    </p>
                </div>

                {phase === 'builder' && topics.length > 0 && (
                    <Button
                        size="lg"
                        onClick={startGeneration}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-8 shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Start Bulk Job
                    </Button>
                )}

                {phase === 'running' && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={isPaused ? resumeGeneration : pauseGeneration}
                            className="font-semibold"
                        >
                            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                            {isPaused ? "Resume" : "Pause Queue"}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={cancelGeneration}
                            className="font-semibold"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Stop Job
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content Areas */}
            {phase === 'builder' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Queue Builder */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border-2 border-dashed border-border bg-card/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Type className="h-5 w-5 text-foreground" />
                                    Blog Queue ({topics.length}/20)
                                </CardTitle>
                                <CardDescription>
                                    Add topics manually, import from keywords, or upload a CSV file.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleAddManual} className="flex gap-2">
                                    <Input
                                        placeholder="Enter a blog topic or keyword..."
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                        className="h-12 border-border bg-background/50"
                                    />
                                    <Button type="submit" size="icon" className="h-12 w-12 bg-card hover:bg-muted">
                                        <Plus className="h-6 w-6" />
                                    </Button>
                                </form>

                                <BulkQueueList
                                    topics={topics}
                                    onRemove={removeTopic}
                                    onUpdate={updateTopic}
                                />

                                {topics.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="bg-card p-4 rounded-full mb-4">
                                            <FileUp className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">Queue is empty</h3>
                                        <p className="text-muted-foreground text-sm max-w-xs">
                                            Add your first topic above or try importing from your research history.
                                        </p>
                                        <div className="flex gap-2 mt-6">
                                            <Button variant="secondary" size="sm">
                                                <History className="mr-2 h-4 w-4" />
                                                Import Research
                                            </Button>
                                            <Button variant="secondary" size="sm">
                                                <FileUp className="mr-2 h-4 w-4" />
                                                Upload CSV
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="lg:col-span-4 space-y-6">
                        <BulkEstimatorCard topics={topics} settings={settings} />
                        <Card className="bg-card/30 border-border sticky top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings2 className="h-5 w-5 text-foreground" />
                                    Global Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <BulkSettingsPanel settings={settings} onChange={setSettings} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {phase === 'running' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Running Queue Status */}
                    <div className="lg:col-span-4 space-y-4">
                        <BulkQueueList
                            topics={topics}
                            readonly
                            running
                        />
                    </div>
                    {/* Live Generation View */}
                    <div className="lg:col-span-8">
                        <BulkLiveView
                            topic={topics.find(t => t.status === 'generating') || null}
                        />
                    </div>
                </div>
            )}

            {phase === 'complete' && (
                <BulkResultsView topics={topics} onRestart={() => setPhase('builder')} />
            )}
        </div>
    );
}
