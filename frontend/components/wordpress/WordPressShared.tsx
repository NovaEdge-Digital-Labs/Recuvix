import React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { WPConnection, WPPublishHistory } from "@/lib/wordpress/wpTypes";
import { WordPressIcon } from "./WordPressIcon";
import { formatDistanceToNow } from "date-fns";

// --- Site Selector ---
export function WordPressSiteSelector({
    connections,
    selectedId,
    onSelect
}: {
    connections: WPConnection[],
    selectedId: string,
    onSelect: (id: string) => void
}) {
    return (
        <div className="relative group">
            <select
                value={selectedId}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-sm text-white appearance-none focus:outline-none focus:border-accent/40 cursor-pointer"
            >
                {connections.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0f0f0f]">
                        {c.siteTitle || c.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-hover:text-white/60" />
        </div>
    );
}

// --- Publish History ---
export function WordPressPublishHistory({ history }: { history: WPPublishHistory | null }) {
    if (!history) return null;

    return (
        <div className="mt-4 flex items-center justify-between text-[10px] text-white/40 bg-white/[0.02] border border-white/5 rounded-lg p-2">
            <div className="flex items-center gap-1.5">
                <WordPressIcon className="w-3 h-3 opacity-50" />
                <span>Last published: {history.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
            </div>
            <div className="flex items-center gap-3">
                <span>{formatDistanceToNow(new Date(history.publishedAt))} ago</span>
                <a
                    href={history.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent/60 hover:text-accent flex items-center gap-0.5"
                >
                    View <ExternalLink className="w-2.5 h-2.5" />
                </a>
            </div>
        </div>
    );
}
