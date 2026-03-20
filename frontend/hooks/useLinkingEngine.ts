import { useState, useEffect, useCallback } from 'react';
import {
    LinkSuggestion,
    SuggestionStatus
} from '@/lib/linking/linkingEngine';
import { toast } from 'sonner';

export interface GraphNode {
    id: string;
    title: string;
    slug: string | null;
    focusKeyword: string;
    inboundLinks: number;
    outboundLinks: number;
    isOrphan: boolean;
}

export interface GraphEdge {
    source: string;
    target: string;
    sourceTitle: string;
    targetTitle: string;
    anchorTexts: string[];
    linkCount: number;
}

export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
    orphans: any[];
    stats: {
        totalLinks: number;
        totalBlogs: number;
        orphanCount: number;
        avgLinksPerBlog: string | number;
    };
}

export function useLinkingEngine(workspaceId?: string) {
    const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
    const [allBlogs, setAllBlogs] = useState<any[]>([]);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);

    const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState('');

    const [isApplying, setIsApplying] = useState(false);

    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [isLoadingGraph, setIsLoadingGraph] = useState(false);

    // Fetch all blogs (simplified index)
    const fetchBlogs = useCallback(async () => {
        setIsLoadingBlogs(true);
        try {
            // We can use a shared API for blogs or build a specific one if needed.
            // For now, let's assume we fetch them and build a simple list.
            const res = await fetch(`/api/blogs?workspaceId=${workspaceId || ''}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setAllBlogs([]);
                    return;
                }
                throw new Error(`Blogs API failed: ${res.status}`);
            }
            const data = await res.json();
            if (data.blogs) {
                setAllBlogs(data.blogs);
            }
        } catch (err) {
            console.error('Failed to fetch blogs:', err);
        } finally {
            setIsLoadingBlogs(false);
        }
    }, [workspaceId]);

    // Analyse selected blog
    const analyseSelectedBlog = async (options: { forceRefresh?: boolean, baseUrl?: string } = {}) => {
        if (!selectedBlogId) return;

        setIsAnalysing(true);
        setAnalysisProgress('Analysing library...');
        try {
            const res = await fetch('/api/linking/analyse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId: selectedBlogId,
                    workspaceId,
                    forceRefresh: options.forceRefresh,
                    baseUrl: options.baseUrl,
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSuggestions(data.suggestions || []);
            toast.success(data.cached ? 'Loaded existing suggestions' : 'Analysis complete');
        } catch (err: any) {
            toast.error(`Analysis failed: ${err.message}`);
        } finally {
            setIsAnalysing(false);
            setAnalysisProgress('');
        }
    };

    // Update suggestion status
    const updateSuggestionStatus = async (suggestionId: string, status: SuggestionStatus, reason?: string) => {
        try {
            const res = await fetch('/api/linking/suggestions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    updates: [{ suggestionId, status, rejectedReason: reason }]
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSuggestions(prev => prev.map(s =>
                s.id === suggestionId ? { ...s, status } : s
            ));
        } catch (err: any) {
            toast.error(`Failed to update suggestion: ${err.message}`);
        }
    };

    // Approve all
    const approveAll = async () => {
        const pendingIds = suggestions.filter(s => s.status === 'pending').map(s => s.id);
        if (pendingIds.length === 0) return;

        try {
            const res = await fetch('/api/linking/suggestions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    updates: pendingIds.map(id => ({ suggestionId: id, status: 'approved' }))
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Approve failed: ${res.status} ${text.substring(0, 50)}`);
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSuggestions(prev => prev.map(s =>
                pendingIds.includes(s.id) ? { ...s, status: 'approved' } : s
            ));
            toast.success(`Approved ${pendingIds.length} suggestions`);
        } catch (err: any) {
            toast.error(`Failed to approve all: ${err.message}`);
        }
    };

    // Apply approved suggestions
    const applyApproved = async (baseUrl?: string) => {
        if (!selectedBlogId) return;
        const approvedIds = suggestions.filter(s => s.status === 'approved').map(s => s.id);
        if (approvedIds.length === 0) return;

        setIsApplying(true);
        try {
            const res = await fetch('/api/linking/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId: selectedBlogId,
                    suggestionIds: approvedIds,
                    baseUrl
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSuggestions(prev => prev.map(s =>
                approvedIds.includes(s.id) ? { ...s, status: 'applied' } : s
            ));
            toast.success(`Applied ${data.appliedCount} links (${data.skippedCount} skipped)`);
            return data;
        } catch (err: any) {
            toast.error(`Application failed: ${err.message}`);
        } finally {
            setIsApplying(false);
        }
    };

    // Remove applied link
    const removeLink = async (appliedLinkId: string) => {
        if (!selectedBlogId) return;
        try {
            const res = await fetch('/api/linking/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId: selectedBlogId,
                    appliedLinkId
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success('Link removed from blog');
            // Refresh suggestions if needed, or just update local state
        } catch (err: any) {
            toast.error(`Removal failed: ${err.message}`);
        }
    };

    // Fetch graph data
    const fetchGraphData = useCallback(async () => {
        setIsLoadingGraph(true);
        try {
            const res = await fetch(`/api/linking/graph?workspaceId=${workspaceId || ''}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setGraphData(data);
        } catch (err: any) {
            toast.error(`Failed to load link graph: ${err.message}`);
        } finally {
            setIsLoadingGraph(false);
        }
    }, [workspaceId]);

    // Library wide analysis
    const analyseEntireLibrary = async (baseUrl?: string) => {
        setIsAnalysing(true);
        setAnalysisProgress('Scanning entire library...');
        try {
            const res = await fetch('/api/linking/analyse-library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, baseUrl }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            toast.success(`Library analysis complete. Found ${data.totalSuggestions} suggestions across ${data.analysed} blogs.`);
        } catch (err: any) {
            toast.error(`Library analysis failed: ${err.message}`);
        } finally {
            setIsAnalysing(false);
            setAnalysisProgress('');
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return {
        selectedBlogId,
        selectedBlog: allBlogs.find(b => b.id === selectedBlogId) || null,
        allBlogs,
        isLoadingBlogs,
        suggestions,
        isAnalysing,
        analysisProgress,
        isApplying,
        graphData,
        isLoadingGraph,
        fetchGraphData,

        selectBlog: setSelectedBlogId,
        analyseSelectedBlog,
        updateSuggestionStatus,
        approveAll,
        applyApproved,
        removeLink,
        analyseEntireLibrary,

        pendingCount: suggestions.filter(s => s.status === 'pending').length,
        approvedCount: suggestions.filter(s => s.status === 'approved').length,
        rejectedCount: suggestions.filter(s => s.status === 'rejected').length,
        appliedCount: suggestions.filter(s => s.status === 'applied').length,
    };
}
