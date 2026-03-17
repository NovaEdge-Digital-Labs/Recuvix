"use client";

import { useState, useEffect } from "react";
import { useGSCData, TrackedBlog } from "@/hooks/useGSCData";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Plus } from "lucide-react";
import { nanoid } from "nanoid";

interface AddBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingBlog?: TrackedBlog;
}

export function AddBlogModal({ isOpen, onClose, editingBlog }: AddBlogModalProps) {
    const { trackedBlogs, saveTrackedBlogs } = useGSCData();

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0]);
    const [focusKeyword, setFocusKeyword] = useState("");
    const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
    const [newKeyword, setNewKeyword] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (editingBlog) {
            setTitle(editingBlog.title);
            setUrl(editingBlog.url);
            setPublishedAt(editingBlog.publishedAt);
            setFocusKeyword(editingBlog.focusKeyword);
            setSecondaryKeywords(editingBlog.secondaryKeywords);
            setNotes(editingBlog.notes || "");
        } else {
            setTitle("");
            setUrl("");
            setPublishedAt(new Date().toISOString().split("T")[0]);
            setFocusKeyword("");
            setSecondaryKeywords([]);
            setNotes("");
        }
    }, [editingBlog, isOpen]);

    const addSecondaryKeyword = () => {
        if (newKeyword.trim() && secondaryKeywords.length < 5 && !secondaryKeywords.includes(newKeyword.trim())) {
            setSecondaryKeywords([...secondaryKeywords, newKeyword.trim()]);
            setNewKeyword("");
        }
    };

    const removeSecondaryKeyword = (kw: string) => {
        setSecondaryKeywords(secondaryKeywords.filter((s) => s !== kw));
    };

    const handleImport = () => {
        const lastOutput = localStorage.getItem("recuvix_last_output");
        if (lastOutput) {
            try {
                const data = JSON.parse(lastOutput);
                setTitle(data.seoMeta?.blogTitle || data.title || "");
                setFocusKeyword(data.seoMeta?.focusKeyword || "");
                if (data.seoMeta?.secondaryKeywords) {
                    setSecondaryKeywords(data.seoMeta.secondaryKeywords);
                }
            } catch { }
        }
    };

    const handleSave = () => {
        if (!title || !url || !publishedAt || !focusKeyword) return;

        const slug = new URL(url).pathname.split("/").pop() || "";

        if (editingBlog) {
            const updated = trackedBlogs.map(b => b.id === editingBlog.id ? {
                ...b,
                title, url, slug, publishedAt, focusKeyword, secondaryKeywords, notes
            } : b);
            saveTrackedBlogs(updated);
        } else {
            const newBlog: TrackedBlog = {
                id: nanoid(),
                title,
                url,
                slug,
                publishedAt,
                focusKeyword,
                secondaryKeywords,
                addedAt: new Date().toISOString(),
                notes,
            };
            saveTrackedBlogs([...trackedBlogs, newBlog]);
        }

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border shadow-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading">
                        {editingBlog ? "Edit Tracked Blog" : "Track a New Blog"}
                    </DialogTitle>
                    <DialogDescription>
                        Enter the details of your published blog to start tracking its rankings.
                    </DialogDescription>
                </DialogHeader>

                {!editingBlog && (
                    <Button
                        variant="outline"
                        className="w-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors py-6 border-dashed"
                        onClick={handleImport}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Import from last generated blog
                    </Button>
                )}

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Blog Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 10 Best AI Strategies" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Published Date</Label>
                            <Input id="date" type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url">Published URL</Label>
                        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourdomain.com/blog/ai-strategies" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="focus">Focus Keyword</Label>
                        <Input id="focus" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="e.g. AI marketing" />
                    </div>

                    <div className="space-y-3">
                        <Label>Secondary Keywords (Max 5)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSecondaryKeyword())}
                                placeholder="Type and press Enter"
                            />
                            <Button type="button" size="icon" onClick={addSecondaryKeyword}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {secondaryKeywords.map((kw) => (
                                <Badge key={kw} className="bg-muted text-foreground hover:bg-muted font-normal px-3 py-1.5 flex items-center gap-1.5 rounded-full border border-border">
                                    {kw}
                                    <button onClick={() => removeSecondaryKeyword(kw)}>
                                        <X className="w-3 h-3 hover:text-destructive" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Goal: Rank in India market, published on Webflow" />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} className="px-8 shadow-lg shadow-primary/20">
                        {editingBlog ? "Update Tracking" : "Start Tracking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
