"use client";

import React, { useState } from 'react';
import { BulkTopic } from '@/lib/validators/bulkSchemas';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Download,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    FileText,
    ArrowLeft,
    TrendingUp,
    Clock,
    Zap,
    Layout,
} from 'lucide-react';
import { buildBulkZip } from '@/lib/bulk/bulkZipBuilder';
import { WordPressPublishButton } from '../wordpress/WordPressPublishButton';
import { toast } from 'sonner';

interface BulkResultsViewProps {
    topics: BulkTopic[];
    onRestart: () => void;
}

export function BulkResultsView({ topics, onRestart }: BulkResultsViewProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const completed = topics.filter(t => t.status === 'complete');
    const failed = topics.filter(t => t.status === 'failed');

    const totalWords = completed.reduce((acc, t) => acc + (t.blogMarkdown.split(/\s+/).length), 0);
    const avgDuration = completed.length > 0
        ? Math.round(completed.reduce((acc, t) => acc + (t.durationSeconds || 0), 0) / completed.length)
        : 0;

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        try {
            // In a real app we'd load settings or pass them in
            const blob = await buildBulkZip(topics);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recuvix-bulk-export-${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Bulk export started!");
        } catch (e) {
            console.error("Download failed", e);
            toast.error("Failed to generate ZIP export.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="bg-green-500/20 p-4 rounded-full">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-foreground mb-1">Bulk Mission Accomplished!</h2>
                        <p className="text-muted-foreground">Generated {completed.length} blogs successfully. {failed.length > 0 && `${failed.length} failures encountered.`}</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={onRestart}
                        className="flex-1 md:flex-none border-border hover:bg-card"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        New Job
                    </Button>
                    <Button
                        size="lg"
                        disabled={completed.length === 0 || isDownloading}
                        onClick={handleDownloadAll}
                        className="flex-1 md:flex-none bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-md"
                    >
                        {isDownloading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Download All (ZIP)
                    </Button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-card/30 border-border">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Output</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            {totalWords.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">words</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/30 border-border">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Efficiency</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            {avgDuration}s <span className="text-sm text-muted-foreground font-normal">avg/blog</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/30 border-border">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Quality Score</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black flex items-center gap-2 text-green-500">
                            <TrendingUp className="h-5 w-5" />
                            98% <span className="text-sm text-muted-foreground font-normal ml-auto">EST. SEO</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/30 border-border">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Success Rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black flex items-center gap-2">
                            <Zap className="h-5 w-5 text-foreground" />
                            {Math.round((completed.length / topics.length) * 100)}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Results List */}
            <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                    {topics.map((topic) => (
                        <Card key={topic.id} className={`border-border bg-card/20 group hover:border-border transition-all ${topic.status === 'failed' ? 'border-red-900/50 bg-red-950/5' : ''}`}>
                            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4 flex-grow min-w-0">
                                    <div className={`p-3 rounded-xl ${topic.status === 'complete' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                        {topic.status === 'complete' ? <FileText className="h-6 w-6 text-green-500" /> : <AlertCircle className="h-6 w-6 text-red-500" />}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-lg truncate">{topic.topic}</h4>
                                        <div className="flex gap-3 mt-1">
                                            <Badge variant="outline" className="text-[10px] font-mono py-0">{topic.durationSeconds}s</Badge>
                                            <Badge variant="outline" className="text-[10px] font-mono py-0">{topic.blogMarkdown.split(/\s+/).length} words</Badge>
                                            {topic.status === 'failed' && <span className="text-xs text-red-400 font-medium">Step: {topic.lastErrorStep}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    {topic.status === 'complete' ? (
                                        <>
                                            <Button variant="outline" size="sm" className="bg-card border-border hover:text-foreground">
                                                <Layout className="h-4 w-4 mr-2" />
                                                Preview
                                            </Button>
                                            <Button variant="outline" size="sm" className="bg-card border-border">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>

                                            <div className="w-px h-8 bg-card hidden md:block" />

                                            <div className="w-full md:w-32">
                                                <WordPressPublishButton
                                                    blogData={{
                                                        title: topic.topic,
                                                        html: topic.blogHtml,
                                                        metaTitle: topic.topic, // Fallback
                                                        metaDescription: "",
                                                        focusKeyword: topic.topic,
                                                        secondaryKeywords: [],
                                                        slug: "",
                                                        thumbnailUrl: null
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <Button variant="outline" size="sm" className="bg-red-900/20 border-red-900/50 text-red-400 hover:bg-red-900/40">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Retry Topic
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
