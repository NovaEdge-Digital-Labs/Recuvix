"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGSCData } from "@/hooks/useGSCData";
import { getPerformance } from "@/lib/tracker/gscClient";
import { formatSlugToTitle, extractSlugFromUrl } from "@/lib/utils/stringUtils";
import { Loader2, Search, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface DiscoveredPage {
    url: string;
    impressions: number;
    clicks: number;
    position: number;
    selected: boolean;
    slug: string;
    title: string;
}

interface GSCPerformanceRow {
    keys: string[];
    impressions: number;
    clicks: number;
    position: number;
}

interface GscImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GscImportModal({ isOpen, onClose }: GscImportModalProps) {
    const { gscConfig, refreshTokenIfNeeded, importBlogs, fetchLatestKeywords } = useGSCData();
    const [isLoading, setIsLoading] = useState(false);
    const [pages, setPages] = useState<DiscoveredPage[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    const fetchDiscoveredPages = useCallback(async () => {
        if (!gscConfig) return;

        try {
            setIsLoading(true);
            const token = await refreshTokenIfNeeded();

            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            const startDate = ninetyDaysAgo.toISOString().split('T')[0];
            const endDate = new Date().toISOString().split('T')[0];

            const response = await getPerformance({
                accessToken: token,
                siteUrl: gscConfig.siteUrl,
                startDate,
                endDate,
                dimensions: ["page"],
                rowLimit: 50
            });

            if (response.rows) {
                const siteUrl = gscConfig.siteUrl.replace(/\/$/, "");

                const filteredPages: DiscoveredPage[] = response.rows
                    .map((row: GSCPerformanceRow) => {
                        const url = row.keys[0];
                        const slug = extractSlugFromUrl(url);
                        return {
                            url,
                            impressions: row.impressions,
                            clicks: row.clicks,
                            position: row.position,
                            selected: true,
                            slug,
                            title: formatSlugToTitle(slug) || "Untitled Post"
                        };
                    })
                    .filter((page: DiscoveredPage) => {
                        const url = page.url.toLowerCase();

                        // 1. Remove homepage
                        if (url === siteUrl || url === siteUrl + "/") return false;

                        // 2. Remove category/tag/author pages
                        if (url.includes("/category/") || url.includes("/tag/") || url.includes("/author/")) return false;

                        // 3. Keep blog-like paths
                        const isProbablyBlog = url.includes("/blog/") ||
                            url.includes("/post/") ||
                            url.includes("/article/") ||
                            (page.slug && page.slug.split('-').length > 1);

                        return isProbablyBlog;
                    });

                setPages(filteredPages);
            }
        } catch (err) {
            console.error("Failed to fetch pages for import:", err);
            toast.error("Failed to fetch pages from Search Console");
        } finally {
            setIsLoading(false);
        }
    }, [gscConfig, refreshTokenIfNeeded]);

    useEffect(() => {
        if (isOpen && gscConfig?.connected) {
            fetchDiscoveredPages();
        }
    }, [isOpen, gscConfig, fetchDiscoveredPages]);

    const togglePage = (index: number) => {
        setPages(prev => prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p));
    };

    const toggleAll = (selected: boolean) => {
        setPages(prev => prev.map(p => ({ ...p, selected })));
    };

    const handleImport = async () => {
        const selectedPages = pages.filter(p => p.selected);
        if (selectedPages.length === 0) {
            toast.error("Please select at least one blog to import");
            return;
        }

        try {
            setIsImporting(true);
            const now = new Date().toISOString().split('T')[0];

            const blogsToImport = selectedPages.map(p => ({
                title: p.title,
                url: p.url,
                slug: p.slug,
                publishedAt: now,
                focusKeyword: "", // User fills in later
                secondaryKeywords: [],
                addedAt: new Date().toISOString()
            }));

            const addedIds = await importBlogs(blogsToImport);

            toast.success(`Imported ${addedIds.length} blogs successfully!`);

            // Auto-fetch rankings for imported blogs (async, don't block UI)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const start = thirtyDaysAgo.toISOString().split('T')[0];
            const end = new Date().toISOString().split('T')[0];

            // Trigger fetches in background
            addedIds.forEach((id: string) => {
                fetchLatestKeywords(id, start, end).catch(() => { });
            });

            onClose();
        } catch {
            toast.error("An error occurred during import");
        } finally {
            setIsImporting(false);
        }
    };

    const selectedCount = pages.filter(p => p.selected).length;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl sm:max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 border-b border-border">
                    <DialogTitle className="text-2xl font-heading flex items-center gap-2">
                        <Search className="w-6 h-6 text-primary" />
                        Import Blogs from Search Console
                    </DialogTitle>
                    <DialogDescription>
                        We found these potential blog posts on your site from the last 90 days.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {isLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12">
                            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground animate-pulse">Scanning your site performance data...</p>
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-medium mb-2">No blogs discovered</h3>
                            <p className="text-muted-foreground max-w-sm">
                                We couldn&apos;t find any URLs that look like blog posts. Try adding them manually.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="px-6 py-4 bg-muted/30 flex items-center justify-between border-b border-border">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => toggleAll(true)}
                                        className="h-8 text-xs"
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => toggleAll(false)}
                                        className="h-8 text-xs"
                                    >
                                        Deselect All
                                    </Button>
                                </div>
                                <span className="text-sm font-medium">
                                    {selectedCount} of {pages.length} selected
                                </span>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-2">
                                    {pages.map((page, index) => (
                                        <div
                                            key={page.url}
                                            className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${page.selected ? 'bg-primary/5 border-primary/20' : 'border-transparent hover:bg-muted/50'
                                                }`}
                                        >
                                            <Checkbox
                                                id={`page-${index}`}
                                                checked={page.selected}
                                                onCheckedChange={() => togglePage(index)}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <label
                                                    htmlFor={`page-${index}`}
                                                    className="font-medium text-sm block cursor-pointer truncate"
                                                >
                                                    {page.title}
                                                </label>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <span className="truncate flex-1">{page.url.replace(/^https?:\/\//, '')}</span>
                                                    <div className="flex items-center gap-2 font-mono shrink-0">
                                                        <span title="Impressions">{page.impressions.toLocaleString()} imp</span>
                                                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                                        <span title="Clicks">{page.clicks.toLocaleString()} clicks</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-background border-border shrink-0 font-mono text-[10px]">
                                                Avg Pos: {page.position.toFixed(1)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </div>

                <DialogFooter className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isImporting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={isImporting || pages.length === 0 || selectedCount === 0}
                        className="px-8"
                    >
                        {isImporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Import {selectedCount} Blogs
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
