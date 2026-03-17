"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { NavBar } from "@/components/navigation/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Search, History } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FontLoader } from "@/components/multilingual/FontLoader";


// New Components
import { useBlogEditor } from "@/hooks/useBlogEditor";
import { ActionsPanel } from "@/components/results/ActionsPanel";
import { BlogPreview } from "@/components/results/BlogPreview";
import { EditModeToggle } from "@/components/results/EditModeToggle";
import { WordCountBadge } from "@/components/results/WordCountBadge";
import { EditHistoryPanel } from "@/components/results/EditHistoryPanel";
import { RegenerateBlogModal } from "@/components/results/RegenerateBlogModal";
import { RegenerationCompare } from "@/components/results/RegenerationCompare";
import { SEORegenBanner } from "@/components/results/SEORegenBanner";
import { InlineLinkSuggestions } from "@/components/linking/InlineLinkSuggestions";
import { toast } from "sonner";

export default function ResultsPage() {
    const router = useRouter();
    const { lastOutput } = useAppContext();

    // Editor State
    const editor = useBlogEditor();


    // UI State
    const [copiedText, setCopiedText] = useState<"html" | "md" | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
    const [showSeoBanner, setShowSeoBanner] = useState(false);
    const [isRegeneratingSeo, setIsRegeneratingSeo] = useState(false);

    // Effect to show SEO banner after significant edits
    const initialWordCount = useRef(editor.wordCount);
    useEffect(() => {
        if (Math.abs(editor.wordCount - initialWordCount.current) > 200 && !showSeoBanner) {
            setShowSeoBanner(true);
        }
    }, [editor.wordCount, showSeoBanner]);

    useEffect(() => {
        if (typeof window !== "undefined" && !lastOutput && !editor.blog) {
            router.push("/");
        }
    }, [lastOutput, editor.blog, router]);

    const { blog } = editor;
    if (!blog) return null; // Extra safety for TS

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = blog.seoMeta as any || {};

    const blogDataForActions = {
        title: meta.metaTitle || blog.topic || "Untitled Blog",
        html: blog.currentHtml,
        markdown: blog.currentMarkdown,
        thumbnailUrl: blog.thumbnailUrl,
        focusKeyword: blog.focusKeyword,
        source: blog.source
    };

    const handleCopy = (text: string, type: "html" | "md") => {
        navigator.clipboard.writeText(text);
        setCopiedText(type);
        setTimeout(() => setCopiedText(null), 2000);
        toast.success(`${type.toUpperCase()} copied to clipboard`);
    };

    const handleDownloadZip = async () => {
        setIsDownloading(true);
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const res = await fetch(`${backendUrl}/api/export/package`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    html: blog.currentHtml,
                    markdown: blog.currentMarkdown,
                    seoMeta: blog.seoMeta,
                    images: [],
                }),
            });
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `recuvix-export-${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Package downloaded");
        } catch (e) {
            console.error(e);
            toast.error("Download failed. Direct text fallback initiated.");
            const blob = new Blob([blog.currentMarkdown], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "post.md";
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative">
            <FontLoader />
            <NavBar />

            <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-3.5rem)] overflow-hidden">

                {/* Left Column: SEO Meta */}
                <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
                            <ChevronLeft size={16} className="mr-1" />
                            New Blog Post
                        </Link>
                        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                            <Search size={22} className="text-accent" />
                            SEO Meta Pack
                        </h2>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
                        {blog.thumbnailUrl && (
                            <div className="mb-4 rounded-lg overflow-hidden border border-border bg-surface aspect-video relative">
                                <Image
                                    src={blog.thumbnailUrl}
                                    alt="Blog Thumbnail"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Primary Keyword</label>
                                <div className="font-medium text-foreground">{blog.focusKeyword || "Not specified"}</div>
                            </div>
                            <WordCountBadge count={editor.wordCount} />
                        </div>

                        <div className="h-px bg-border w-full" />

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meta Title <span className="text-xs font-normal opacity-70 ml-1">({meta.metaTitle?.length || 0}/60)</span></label>
                            <div className="text-sm text-foreground bg-background p-3 rounded border border-border leading-relaxed">
                                {meta.metaTitle || "No title generated"}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Meta Description <span className="text-xs font-normal opacity-70 ml-1">({meta.metaDescription?.length || 0}/160)</span></label>
                            <div className="text-sm text-foreground bg-background p-3 rounded border border-border leading-relaxed">
                                {meta.metaDescription || "No description generated"}
                            </div>
                        </div>

                        <div className="h-px bg-border w-full" />

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">LSI Keywords</label>
                            <div className="flex flex-wrap gap-2">
                                {meta.secondaryKeywords ? (
                                    meta.secondaryKeywords.map((kw: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md border border-border">
                                            {kw}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">None generated</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column: Content Tabs */}
                <div className="lg:col-span-6 flex flex-col h-full bg-card border border-border rounded-xl shadow-sm overflow-hidden relative">
                    <Tabs defaultValue="preview" className="flex flex-col h-full w-full">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
                            <TabsList className="bg-background">
                                <TabsTrigger value="preview" className="text-xs data-[state=active]:bg-card">Visual Preview</TabsTrigger>
                                <TabsTrigger value="links" className="text-xs data-[state=active]:bg-card text-accent flex gap-1.5 items-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                                    Internal Links
                                </TabsTrigger>
                                <TabsTrigger value="html" className="text-xs data-[state=active]:bg-card text-muted-foreground">HTML</TabsTrigger>
                                <TabsTrigger value="md" className="text-xs data-[state=active]:bg-card text-muted-foreground">Markdown</TabsTrigger>
                            </TabsList>

                            <div className="flex items-center gap-2">
                                <EditModeToggle
                                    isEditMode={editor.isEditMode}
                                    onToggle={editor.toggleEditMode}
                                />
                                {editor.editHistory.length > 0 && (
                                    <button
                                        onClick={() => setShowHistory(true)}
                                        className="p-1.5 rounded-full hover:bg-surface-lighter text-muted-foreground transition-colors"
                                        title="Show Edit History"
                                    >
                                        <History size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-background p-6 md:p-10 custom-scrollbar relative">
                            {showSeoBanner && (
                                <div className="mb-6">
                                    <SEORegenBanner
                                        onDismiss={() => setShowSeoBanner(false)}
                                        onUpdate={async () => {
                                            setIsRegeneratingSeo(true);
                                            await editor.updateSeoMeta();
                                            setIsRegeneratingSeo(false);
                                            setShowSeoBanner(false);
                                        }}
                                        isLoading={isRegeneratingSeo}
                                    />
                                </div>
                            )}

                            <TabsContent value="preview" className="m-0 focus-visible:outline-none">
                                <BlogPreview
                                    html={editor.currentHtml}
                                    isEditMode={editor.isEditMode}
                                    activeSectionIndex={editor.activeSectionIndex}
                                    activeSectionAction={editor.activeSectionAction}
                                    sectionStreamText={editor.sectionStreamText}
                                    onRewrite={editor.rewriteSection}
                                    onAccept={editor.acceptSectionChange}
                                    onDiscard={editor.discardSectionChange}
                                    onManualSave={editor.saveInlineEdit}
                                />
                            </TabsContent>

                            <TabsContent value="html" className="m-0 h-full focus-visible:outline-none">
                                <pre className="p-4 rounded-lg bg-[#0d0d0d] border border-border overflow-x-auto text-sm text-[#44ff88] font-mono whitespace-pre-wrap break-words h-full">
                                    {editor.currentHtml}
                                </pre>
                            </TabsContent>

                            <TabsContent value="md" className="m-0 h-full focus-visible:outline-none">
                                <pre className="p-4 rounded-lg bg-[#0d0d0d] border border-border overflow-x-auto text-sm text-[#44ff88] font-mono whitespace-pre-wrap break-words h-full">
                                    {blog.currentMarkdown}
                                </pre>
                            </TabsContent>

                            <TabsContent value="links" className="m-0 focus-visible:outline-none">
                                <div className="p-2">
                                    <InlineLinkSuggestions blogId={blog.id} />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* Overlay History Panel */}
                    {showHistory && (
                        <div className="absolute top-0 right-0 h-full z-50">
                            <EditHistoryPanel
                                history={editor.editHistory}
                                onRestore={(id) => {
                                    editor.restoreVersion(id);
                                    setShowHistory(false);
                                }}
                                onClear={editor.clearHistory}
                                onClose={() => setShowHistory(false)}
                            />
                        </div>
                    )}
                </div>

                {/* Right Column: Actions */}
                <div className="lg:col-span-3 h-full overflow-y-auto pl-2 custom-scrollbar">
                    <ActionsPanel
                        blogData={blogDataForActions}
                        onDownloadZip={handleDownloadZip}
                        isDownloading={isDownloading}
                        onCopy={handleCopy}
                        copiedText={copiedText}
                        onRegenerate={() => setIsRegenModalOpen(true)}
                        onShowHistory={() => setShowHistory(true)}
                        historyCount={editor.editHistory.length}
                        blogId={blog.id}
                        status={(blog as any).status || 'pending'}
                        onStatusChange={(newStatus) => {
                            if (editor.blog) {
                                (editor.blog as any).status = newStatus;
                            }
                        }}
                    />
                </div>
            </main>

            {/* Modals & Full Page Overlays */}
            <RegenerateBlogModal
                isOpen={isRegenModalOpen}
                onClose={() => setIsRegenModalOpen(false)}
                onConfirm={(params) => editor.regenerateBlog({ ...params, showComparison: true })}
            />

            {editor.isRegenerating && (
                <RegenerationCompare
                    originalHtml={blog?.currentHtml || ""}
                    generatedHtml={editor.regenStreamText}
                    isStreaming={true}
                    onAccept={() => editor.acceptSectionChange(-1, editor.regenStreamText)} // Special case for full -1
                    onDiscard={editor.discardSectionChange}
                />
            )}
        </div>
    );
}
