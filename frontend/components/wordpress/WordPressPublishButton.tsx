import React, { useState } from "react";
import { WordPressIcon } from "./WordPressIcon";
import { Button } from "@/components/ui/button";
import { WordPressPublishModal } from "./WordPressPublishModal";
import { WordPressSiteSelector, WordPressPublishHistory } from "./WordPressShared";
import { useWordPressPublish } from "@/hooks/useWordPressPublish";
import { Settings } from "lucide-react";
import { toast } from "sonner";

interface WordPressPublishButtonProps {
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
}

export function WordPressPublishButton({ blogData }: WordPressPublishButtonProps) {
    const { connections, getHistoryForBlog } = useWordPressPublish();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSiteId, setSelectedSiteId] = useState("");

    // Initialize selected site
    React.useEffect(() => {
        if (connections.length > 0 && !selectedSiteId) {
            setSelectedSiteId(connections[0].id);
        }
    }, [connections, selectedSiteId]);

    const selectedConnection = connections.find(c => c.id === selectedSiteId) || connections[0] || null;
    const blogHistory = getHistoryForBlog(blogData.title);

    if (connections.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] text-white/50 text-center leading-relaxed">
                    Connect WordPress to publish with one click
                </p>
                <Button
                    variant="outline"
                    className="w-full h-10 border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest gap-2"
                    onClick={() => {
                        toast.warning('Connect your WordPress site first', {
                            description: 'Go to Settings → WordPress to connect your site.',
                        });
                    }}
                >
                    Connect Site <Settings className="w-3 h-3" />
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <WordPressIcon className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">WordPress</span>
                </div>

                {connections.length > 1 && (
                    <WordPressSiteSelector
                        connections={connections}
                        selectedId={selectedSiteId}
                        onSelect={setSelectedSiteId}
                    />
                )}
            </div>

            <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-12 bg-[#2171b1] hover:bg-[#1a5a8e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(33,113,177,0.2)] transition-all group active:scale-[0.98]"
            >
                <WordPressIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Publish to WordPress
            </Button>

            <WordPressPublishHistory history={blogHistory} />

            <WordPressPublishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                blogData={blogData}
                connection={selectedConnection}
            />
        </div>
    );
}
