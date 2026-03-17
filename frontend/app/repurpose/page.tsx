"use client";

import React, { Suspense } from 'react';
import { useRepurpose } from '@/hooks/useRepurpose';
import { FormatSelector } from '@/components/repurpose/FormatSelector';
import { ContentViewer } from '@/components/repurpose/ContentViewer';
import { DownloadAllButton } from '@/components/repurpose/DownloadAllButton';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Sparkles,
    History,
    FileText,
    ChevronRight,
    ShieldCheck,
    Zap,
    Layout
} from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RepurposePageWrapper() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        }>
            <RepurposePage />
        </Suspense>
    );
}

function RepurposePage() {
    const {
        blog,
        isLoadingBlog,
        selectedFormats,
        formatStates,
        generatedContent,
        isGenerating,
        completedCount,
        totalCount,
        customInstruction,
        activeTab,
        toggleFormat,
        selectSocialPack,
        selectContentPack,
        selectAll,
        clearAll,
        generateSelected,
        regenerateFormat,
        updateContent,
        setActiveTab,
        setCustomInstruction,
        downloadAll,
    } = useRepurpose();

    if (isLoadingBlog) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    <p className="text-white/40 text-sm animate-pulse">Loading your blog studio...</p>
                </div>
            </div>
        );
    }

    if (!blog && !isLoadingBlog) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[#0a0a0a] p-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-white/20" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Blog Not Found</h1>
                <p className="text-white/40 max-w-sm mb-8">
                    We couldn't find the blog you're looking for. It might have been deleted or the link is invalid.
                </p>
                <Link href="/history">
                    <Button className="bg-accent hover:bg-accent/90">
                        <History className="w-4 h-4 mr-2" />
                        Back to History
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                    <Link href={blog ? `/results?blogId=${blog.id}` : '/history'}>
                        <Button variant="ghost" size="sm" className="text-white/40 hover:text-white group">
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-white truncate max-w-[300px] md:max-w-[500px]">
                            Repurpose: {blog.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-white/30 truncate max-w-[200px]">{blog.focus_keyword}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-white/10" />
                            <span className="text-[10px] text-accent font-medium">Studio Mode</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <DownloadAllButton
                        onDownload={downloadAll}
                        disabled={Object.keys(generatedContent).length === 0}
                    />
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] font-medium text-white/50">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                        <span>Connected</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Selection & Controls */}
                <aside className="w-[380px] border-r border-white/5 p-6 overflow-y-auto scrollbar-hide shrink-0 bg-[#0a0a0a]">
                    <FormatSelector
                        selectedFormats={selectedFormats}
                        formatStates={formatStates}
                        isGenerating={isGenerating}
                        customInstruction={customInstruction}
                        completedCount={completedCount}
                        totalCount={totalCount}
                        model={blog.model}
                        onToggleFormat={toggleFormat}
                        onSelectSocialPack={selectSocialPack}
                        onSelectContentPack={selectContentPack}
                        onSelectAll={selectAll}
                        onClearAll={clearAll}
                        onGenerate={generateSelected}
                        onSetActiveTab={setActiveTab}
                        onSetCustomInstruction={setCustomInstruction}
                    />
                </aside>

                {/* Main Preview Area */}
                <main className="flex-1 p-8 bg-[#0d0d0d] overflow-hidden">
                    <div className="h-full max-w-5xl mx-auto flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent/10">
                                    <Zap className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Generation Output</h2>
                                    <p className="text-xs text-white/30">Edit and optimize for each platform</p>
                                </div>
                            </div>

                            {isGenerating && (
                                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-accent/5 border border-accent/20">
                                    <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                                    <span className="text-[11px] text-accent font-bold uppercase tracking-widest">Generating Multi-Platform Content</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-h-0">
                            <ContentViewer
                                activeTab={activeTab}
                                generatedContent={generatedContent}
                                blogUrl={`${window?.location?.origin || ''}/history`} // Fallback url
                                onSetActiveTab={setActiveTab}
                                onUpdateContent={updateContent}
                                onRegenerateFormat={regenerateFormat}
                            />
                        </div>

                        {/* Bottom Info Bar */}
                        <footer className="mt-6 flex items-center justify-between">
                            <div className="flex items-center gap-6 text-[10px] text-white/30 font-medium uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span>Parallel Generation Active (Max Concurrency: 3)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span>Auto-Save to Cloud Enabled</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-white/20 italic">
                                <Layout className="w-3 h-3" />
                                <span>Studio Layout v1.0</span>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
