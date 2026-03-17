import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordPressIcon } from "./WordPressIcon";
import { WordPressPublishProgress, WordPressPublishSuccess, WordPressPublishError } from "./WordPressPublishViews";
import { WPConnection } from "@/lib/wordpress/wpTypes";
import { useWordPressPublish } from "@/hooks/useWordPressPublish";

interface WordPressPublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    blogData: {
        title: string;
        html: string;
        metaTitle: string;
        metaDescription: string;
        focusKeyword: string;
        secondaryKeywords: string[];
        slug: string;
        thumbnailUrl: string | null;
    };
    connection: WPConnection | null;
}

export function WordPressPublishModal({
    isOpen,
    onClose,
    blogData,
    connection
}: WordPressPublishModalProps) {
    const {
        isPublishing,
        stepStatuses,
        publishResult,
        publishError,
        publishBlog,
        resetPublishState
    } = useWordPressPublish();

    const [status, setStatus] = useState<"draft" | "publish">(connection?.defaultStatus || "draft");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(connection?.defaultCategory || null);
    const [useFeaturedImg, setUseFeaturedImg] = useState(true);
    const [useSeoMeta, setUseSeoMeta] = useState(true);

    if (!isOpen || !connection) return null;

    async function handlePublish() {
        if (!connection) return;
        await publishBlog({
            connection,
            blogHtml: blogData.html,
            blogTitle: blogData.title,
            focusKeyword: blogData.focusKeyword,
            secondaryKeywords: blogData.secondaryKeywords,
            metaTitle: blogData.metaTitle,
            metaDescription: blogData.metaDescription,
            slug: blogData.slug,
            thumbnailUrl: useFeaturedImg ? blogData.thumbnailUrl : null,
            categoryIds: selectedCategory ? [selectedCategory] : [],
            status,
            injectYoastMeta: useSeoMeta,
            injectRankMathMeta: useSeoMeta, // Routes handle if both or one
        });
    }

    function handleClose() {
        resetPublishState();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2171b1] flex items-center justify-center text-white">
                            <WordPressIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {publishResult ? "Published!" : isPublishing ? "Publishing..." : "Ready to Publish"}
                            </h2>
                            {!publishResult && !isPublishing && <p className="text-xs text-white/50">Post to {connection.siteTitle}</p>}
                        </div>
                    </div>
                    {!isPublishing && (
                        <button
                            onClick={handleClose}
                            className="p-2 text-white/40 hover:text-white rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>

                <div className="p-6 overflow-y-auto max-h-[75vh]">
                    {publishResult ? (
                        <WordPressPublishSuccess result={publishResult} />
                    ) : publishError ? (
                        <WordPressPublishError error={publishError} onRetry={resetPublishState} />
                    ) : isPublishing ? (
                        <WordPressPublishProgress steps={stepStatuses} />
                    ) : (
                        <div className="space-y-6">
                            {/* Info Card */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4">
                                {blogData.thumbnailUrl && (
                                    <div className="w-24 h-[54px] rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                        <img src={blogData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-sm line-clamp-1 mb-1">{blogData.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${status === "publish" ? "text-green-500" : "text-white/40"
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${status === "publish" ? "bg-green-500 animate-pulse" : "bg-white/20"}`} />
                                            {status}
                                        </div>
                                        <div className="text-[10px] text-white/30 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                            Category: {connection.categories.find(c => c.id === selectedCategory)?.name || "Uncategorized"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-white/40 tracking-widest ml-1">Status</label>
                                    <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
                                        <button
                                            onClick={() => setStatus("draft")}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === "draft" ? "bg-white/10 text-white shadow-sm" : "text-white/30 hover:text-white/60"
                                                }`}
                                        >
                                            Draft
                                        </button>
                                        <button
                                            onClick={() => setStatus("publish")}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === "publish" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-white/30 hover:text-white/60"
                                                }`}
                                        >
                                            Live
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-white/40 tracking-widest ml-1">Category</label>
                                    <select
                                        value={selectedCategory || ""}
                                        onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-white appearance-none focus:outline-none focus:border-accent/40"
                                    >
                                        <option value="" className="bg-[#0f0f0f]">Uncategorized</option>
                                        {connection.categories.map(c => (
                                            <option key={c.id} value={c.id} className="bg-[#0f0f0f]">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={() => setUseFeaturedImg(!useFeaturedImg)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${useFeaturedImg ? "bg-accent border-accent text-white" : "border-white/20 text-transparent"
                                            }`}>
                                            <Check className="w-3 h-3 stroke-[4]" />
                                        </div>
                                        <span className="text-xs font-medium text-white/80">Set as Featured Image</span>
                                    </div>
                                    <span className="text-[10px] text-white/30 italic group-hover:text-white/40">Includes alt text</span>
                                </button>

                                <button
                                    onClick={() => setUseSeoMeta(!useSeoMeta)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${useSeoMeta ? "bg-accent border-accent text-white" : "border-white/20 text-transparent"
                                            }`}>
                                            <Check className="w-3 h-3 stroke-[4]" />
                                        </div>
                                        <span className="text-xs font-medium text-white/80">Inject SEO Meta</span>
                                    </div>
                                    <span className="text-[10px] text-white/30 italic group-hover:text-white/40">Yoast / RankMath</span>
                                </button>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handlePublish}
                                    className="w-full h-14 bg-[#2171b1] hover:bg-[#1a5a8e] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(33,113,177,0.3)] transition-all group active:scale-[0.98]"
                                >
                                    <WordPressIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Publish to WordPress Now
                                </Button>
                                <p className="text-center text-[10px] text-white/30 mt-4 leading-relaxed">
                                    By publishing, you agree to your site&apos;s content guidelines.<br />
                                    Credits will not be consumed for publishing.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {publishResult && (
                    <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            className="text-white/40 hover:text-white text-xs font-bold"
                        >
                            Close Window
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
