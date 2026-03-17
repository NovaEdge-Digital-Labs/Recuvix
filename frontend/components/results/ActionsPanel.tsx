"use client";


import {
    Download,
    Copy,
    RefreshCw,
    CheckCircle2,
    ImageIcon,
    TrendingUp,
    Globe,
    History,
    Sparkles,
    Shield,
    Share2,
    Zap,
    Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordPressPublishButton } from "@/components/wordpress/WordPressPublishButton";
import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ApprovalActions } from "../workspaces/ApprovalActions";
import { LinkingQuickAccess } from "../linking/LinkingQuickAccess";

interface ActionsPanelProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blogData: any;
    onDownloadZip: () => void;
    isDownloading: boolean;
    onCopy: (text: string, type: "html" | "md") => void;
    copiedText: "html" | "md" | null;
    onRegenerate: () => void;
    onShowHistory: () => void;
    historyCount: number;
    blogId?: string;
    status?: string;
    onStatusChange?: (newStatus: string) => void;
}

export function ActionsPanel({
    blogData,
    onDownloadZip,
    isDownloading,
    onCopy,
    copiedText,
    onRegenerate,
    onShowHistory,
    historyCount,
    blogId,
    status,
    onStatusChange
}: ActionsPanelProps) {
    const { activeWorkspace } = useWorkspace();
    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Workspace Approval Flow */}
            {activeWorkspace && blogId && (
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-accent" />
                        Workspace Approval
                    </h3>
                    <ApprovalActions
                        blogId={blogId}
                        status={status || 'pending'}
                        onStatusChange={onStatusChange}
                    />
                </div>
            )}

            {/* Voice Source Indicator */}
            {blogData.source === 'voice' && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                        <Mic size={18} className="text-accent" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Voice Studio Blog</h4>
                        <p className="text-[10px] text-accent/60 font-medium">Generated from voice transcript</p>
                    </div>
                </div>
            )}

            {/* Regeneration & History - Primary Actions */}
            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={60} className="text-accent" />
                </div>

                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-accent" />
                    AI Refinement
                </h3>

                <div className="space-y-3">
                    <Button
                        onClick={onRegenerate}
                        className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_20px_rgba(232,255,71,0.2)] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <RefreshCw className="mr-2" size={18} />
                        Regenerate Full Blog
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onShowHistory}
                        className="w-full h-10 border-border bg-surface/50 hover:bg-surface text-xs flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <History size={14} className="text-muted-foreground" />
                            <span>Edit History</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-full bg-surface-lighter text-[10px] font-mono">
                            {historyCount}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Repurpose Content - New Feature */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                    <Share2 size={18} className="text-pink-500" />
                    Repurpose Content
                </h3>
                <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
                    Convert this blog into LinkedIn posts, Twitter threads, Emails, and more.
                    <span className="text-accent ml-1 font-bold">0 Credits Used.</span>
                </p>
                <Link href={`/repurpose?blogId=${blogId}`} className="block">
                    <Button
                        className="w-full h-11 bg-surface hover:bg-surface-lighter border border-border text-foreground font-semibold group"
                    >
                        <Zap className="mr-2 group-hover:text-accent transition-colors" size={18} />
                        Open Repurpose Studio
                    </Button>
                </Link>
            </div>

            {/* Export Options */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                    <Download size={18} className="text-muted-foreground" />
                    Export Options
                </h3>

                <Button
                    onClick={onDownloadZip}
                    disabled={isDownloading}
                    className="w-full h-11 mb-3 bg-surface hover:bg-surface-lighter border border-border text-foreground font-semibold"
                >
                    {isDownloading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Download className="mr-2" size={18} />}
                    {isDownloading ? "Packaging..." : "Download .ZIP Package"}
                </Button>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onCopy(blogData.html, "html")}
                        className="h-10 text-xs text-muted-foreground hover:text-foreground border-border hover:bg-surface"
                    >
                        {copiedText === "html" ? <CheckCircle2 size={14} className="mr-2 text-green-400" /> : <Copy size={14} className="mr-2" />}
                        Copy HTML
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onCopy(blogData.markdown || "", "md")}
                        className="h-10 text-xs text-muted-foreground hover:text-foreground border-border hover:bg-surface"
                    >
                        {copiedText === "md" ? <CheckCircle2 size={14} className="mr-2 text-green-400" /> : <Copy size={14} className="mr-2" />}
                        Copy MD
                    </Button>
                </div>
            </div>

            {/* Direct Publish */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                    <Globe size={18} className="text-blue-500" />
                    Direct Publish
                </h3>
                <WordPressPublishButton blogData={blogData} />
            </div>

            {/* Internal Linking - Section 8 */}
            {blogId && <LinkingQuickAccess blogId={blogId} />}

            {/* Featured Image */}
            {blogData.thumbnailUrl && (
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                        <ImageIcon size={18} className="text-muted-foreground" />
                        Featured Image
                    </h3>

                    <div className="rounded-lg overflow-hidden border border-border bg-background mb-3 aspect-video relative group">
                        <img src={blogData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={blogData.thumbnailUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-white px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">
                                View Original
                            </a>
                        </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                        Optimized for Social Sharing (1200x630)
                    </p>
                </div>
            )}

            {/* Tracker Callout */}
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp size={18} className="text-primary" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">Track Rankings</h4>
                <p className="text-[11px] text-muted-foreground mb-4">Monitor performance in Google Search Console.</p>
                <Link
                    href="/tracker"
                    className="w-full inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                    Open Performance Tracker
                </Link>
            </div>
        </div>
    );
}
